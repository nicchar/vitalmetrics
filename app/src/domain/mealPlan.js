/**
 * mealPlan.js
 *
 * Wochenplan-Logik (Block E): stellt aus recipes.json einen 7-Tage-Plan
 * (Frühstück/Mittag/Abend) zusammen und aggregiert daraus eine Einkaufsliste.
 * Reine Domain-Logik, keine Storage-Zugriffe (siehe mealPlanRepo.js dafür).
 */

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

// Bildet nutritionRepo-Kurzschlüssel (vit_a, vit_d, ..., eisen, zink, mag,
// cal, folat, b1-b12 - siehe nutrition.js/getDGERef) auf die Rezept-Tag-IDs
// ab, die dem biomarkerCatalog-Schema folgen (vitamin_a, vitamin_d, ...).
// Nur die 15 Naehrstoffe mit echter BLS-Zufuhrberechnung sind hier drin -
// fuer reine Info-Only-Naehrstoffe (Jod, Selen, ...) gibt es keine
// berechenbare Zufuhr, die man als "unterversorgt" markieren koennte.
const INTAKE_KEY_TO_TAG = {
  vit_a: 'vitamin_a', vit_d: 'vitamin_d', vit_e: 'vitamin_e', vit_k: 'vitamin_k', vit_c: 'vitamin_c',
  b1: 'vitamin_b1', b2: 'vitamin_b2', b3: 'vitamin_b3', b6: 'vitamin_b6', b12: 'vitamin_b12',
  folat: 'vitamin_b9', eisen: 'eisen', zink: 'zink', mag: 'magnesium', cal: 'calcium',
};

/**
 * Ermittelt, bei welchen Naehrstoffen die durchschnittliche Zufuhr der
 * letzten 7 Tage unter `thresholdPct` des DGE-Referenzwerts liegt - als
 * Grundlage fuer eine sanfte Praeferenz bei der Rezeptauswahl (siehe
 * generatePlan). Rein Tag-basiert/qualitativ (Panel-/Nutzer-Entscheidung):
 * keine erfundene Gramm-Genauigkeit, nur "worauf du laut Ernährungstagebuch
 * aktuell eher niedrig liegst".
 *
 * @param {Array<object>} last7DaysTotals  nutritionRepo.getLast7DaysTotals()
 * @param {object} dgeRef                  getDGERef(ageGroup, sex)
 * @returns {string[]} Rezept-Tag-IDs (z.B. ['vitamin_d', 'eisen'])
 */
export function getUnderCoveredTags(last7DaysTotals, dgeRef, thresholdPct = 70) {
  if (!last7DaysTotals?.length) return [];

  // Ohne jeden Ernährungstagebuch-Eintrag in der Woche sind alle Werte 0 -
  // das würde sonst ALLE 15 Nährstoffe als "unterversorgt" markieren, obwohl
  // schlicht nichts getrackt wurde (Bug gefunden beim Dashboard-Fokuskarte-
  // Test für Erstnutzerinnen, Juli 2026). "Unterversorgt" soll ein Signal
  // über echte Zufuhr sein, kein Rauschen durch fehlendes Tracking.
  const hasAnyIntakeLogged = last7DaysTotals.some(day =>
    Object.keys(INTAKE_KEY_TO_TAG).some(k => (day[k] || 0) > 0)
  );
  if (!hasAnyIntakeLogged) return [];

  const under = [];
  for (const [intakeKey, tag] of Object.entries(INTAKE_KEY_TO_TAG)) {
    const ref = dgeRef[intakeKey]?.ref;
    if (!ref) continue;
    const avg = last7DaysTotals.reduce((sum, day) => sum + (day[intakeKey] || 0), 0) / last7DaysTotals.length;
    if ((avg / ref) * 100 < thresholdPct) under.push(tag);
  }
  return under;
}

/**
 * Unverträglichkeiten-Filter (Alltagsreibung-Review Juli 2026,
 * Ernährungsberater-Perspektive: "kein Allergie-/Unverträglichkeitsfilter im
 * Wochenplan"). BEWUSST als "Unverträglichkeiten" benannt, nicht "Allergien":
 * Rezepte haben keine strukturierten Allergen-Daten, nur Freitext-Zutaten -
 * eine Schlüsselwort-Suche darin kann Spuren-Hinweise ("kann Spuren von
 * Nüssen enthalten") oder verarbeitete Zutaten nicht erkennen. Für Laktose-/
 * Gluten-Unverträglichkeit ist das ein sinnvoller Komfort-Filter (schlimmstenfalls
 * Unwohlsein bei einem Fehltreffer); für eine echte Nussallergie mit
 * Anaphylaxie-Risiko wäre ein falsches Sicherheitsgefühl potenziell gefährlich
 * - deshalb hier klar NICHT als Allergie-Schutz beworben, siehe UI-Hinweistext.
 */
export const INTOLERANCE_LABELS = {
  laktose: 'Laktose',
  gluten: 'Gluten',
  nuesse: 'Nüsse',
};

const INTOLERANCE_KEYWORDS = {
  laktose: ['milch', 'käse', 'kaese', 'sahne', 'joghurt', 'quark', 'butter', 'schmand', 'mozzarella', 'parmesan', 'frischkäse', 'frischkaese', 'ricotta', 'feta', 'buttermilch', 'kondensmilch', 'crème fraîche', 'creme fraiche'],
  gluten: ['mehl', 'weizen', 'nudeln', 'pasta', 'brot', 'brötchen', 'broetchen', 'grieß', 'griess', 'couscous', 'bulgur', 'gerste', 'dinkel', 'roggen', 'paniermehl', 'hafer'],
  nuesse: ['nuss', 'nüsse', 'nuesse', 'mandel', 'walnuss', 'haselnuss', 'cashew', 'pistazie', 'erdnuss', 'pekannuss', 'macadamia'],
};

/** Prüft, ob die Freitext-Zutaten eines Rezepts ein Trigger-Keyword enthalten. */
export function recipeMatchesIntolerance(recipe, intoleranceId) {
  const keywords = INTOLERANCE_KEYWORDS[intoleranceId];
  if (!keywords) return false;
  const text = (recipe.ingredients || []).join(' ').toLowerCase();
  return keywords.some(kw => text.includes(kw));
}

/** Entfernt Rezepte, deren Zutaten zu mindestens einer aktiven Unverträglichkeit passen. */
export function filterByIntolerances(recipes, activeIntolerances = []) {
  if (!activeIntolerances?.length) return recipes;
  return recipes.filter(r => !activeIntolerances.some(id => recipeMatchesIntolerance(r, id)));
}

/**
 * Erzeugt einen neuen 7-Tage-Plan. `category` ist 'vegetarisch' | 'fleisch_fisch'
 * | 'keto' | 'gemischt'. Bei 'gemischt' wird über alle Kategorien gestreut.
 *
 * `underCoveredTags` (optional): Rezept-Tag-IDs, die bei der Auswahl bevorzugt
 * werden, siehe getUnderCoveredTags(). Sanfte Praeferenz, kein Zwang - wenn
 * kein "frisches" Rezept mit passendem Tag verfuegbar ist, wird trotzdem aus
 * dem vollen frischen Pool gewaehlt, damit die Abwechslung erhalten bleibt.
 *
 * `activeIntolerances` (optional): siehe filterByIntolerances() - wird VOR
 * der Kategorie-/Mahlzeit-Filterung angewendet.
 */
export function generatePlan(recipes, category, weekStartIso, underCoveredTags = [], activeIntolerances = []) {
  const withoutIntolerances = filterByIntolerances(recipes, activeIntolerances);
  const pool = category === 'gemischt' ? withoutIntolerances : withoutIntolerances.filter(r => r.category === category);
  const byMeal = {
    breakfast: pool.filter(r => r.mealType === 'breakfast'),
    lunch: pool.filter(r => r.mealType === 'lunch'),
    dinner: pool.filter(r => r.mealType === 'lunch'), // Abendessen nutzt denselben Pool wie Mittag
  };

  const usedRecently = { breakfast: [], lunch: [], dinner: [] };

  function pick(mealType) {
    const options = byMeal[mealType];
    if (!options.length) return null;
    const avoid = usedRecently[mealType];
    const fresh = options.filter(r => !avoid.includes(r.id));
    const pool2 = fresh.length ? fresh : options;

    const boosted = underCoveredTags.length
      ? pool2.filter(r => r.tags?.some(t => underCoveredTags.includes(t)))
      : [];
    const finalPool = boosted.length ? boosted : pool2;

    const choice = finalPool[Math.floor(Math.random() * finalPool.length)];
    avoid.push(choice.id);
    if (avoid.length > 3) avoid.shift(); // nicht dieselben letzten 3 Tage wiederholen
    return choice.id;
  }

  const start = new Date(weekStartIso);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[i],
      breakfast: pick('breakfast'),
      lunch: pick('lunch'),
      dinner: pick('dinner'),
    });
  }
  return { weekStart: weekStartIso, category, days };
}

/**
 * Vereinigt die Naehrstoff-Tags aller Rezepte eines (aufgeloesten) Tages -
 * fuer die "Diese Mahlzeiten decken laut Tags: ..."-Anzeige im Wochenplan.
 * Rein qualitativ (Tag-Vereinigung), keine Mengen-/Prozentangabe.
 */
export function getDayTagCoverage(resolvedDay) {
  const tags = new Set();
  for (const key of ['breakfastRecipe', 'lunchRecipe', 'dinnerRecipe']) {
    (resolvedDay[key]?.tags || []).forEach(t => tags.add(t));
  }
  return [...tags];
}

/**
 * Loest die Rezept-IDs im Plan zu vollen Rezept-Objekten auf (fuer die UI).
 */
export function resolvePlan(plan, recipes) {
  const byId = Object.fromEntries(recipes.map(r => [r.id, r]));
  return {
    ...plan,
    days: plan.days.map(day => ({
      ...day,
      breakfastRecipe: byId[day.breakfast] || null,
      lunchRecipe: byId[day.lunch] || null,
      dinnerRecipe: byId[day.dinner] || null,
    })),
  };
}

// Erkennt "300 g Lachs", "2 EL Olivenöl", "1 Avocado", "1 Dose Kichererbsen (240 g)" etc.
const QTY_RE = /^([\d.,]+)\s*(g|kg|ml|l|EL|TL|Dose[n]?|Handvoll|Stück|Prise)?\s+(.+)$/i;

// Grundzutaten, die in Rezepten mal als "Salz", mal als "1 Prise Salz" o.ä.
// auftauchen. Über die Woche summiert ergäbe das unsinnige Werte ("7 Prisen
// Salz") und - schlimmer - wegen der unterschiedlichen Schreibweisen zwei
// getrennte Listeneinträge für dieselbe Zutat. Diese Zutaten werden daher
// immer als einzelner, mengenloser Eintrag geführt (Bugfix, Nutzer-Feedback:
// "Salz" tauchte doppelt auf, einmal als Prise, einmal ohne Menge).
const STAPLE_ITEMS = {
  salz: 'Salz',
  pfeffer: 'Pfeffer',
  'salz und pfeffer': 'Salz und Pfeffer',
  öl: 'Öl',
  olivenöl: 'Olivenöl',
  zucker: 'Zucker',
};

function parseIngredientLine(line) {
  const m = line.match(QTY_RE);
  const parsed = m
    ? { qty: parseFloat(m[1].replace(',', '.')), unit: (m[2] || '').toLowerCase(), name: m[3].trim() }
    : { qty: null, unit: '', name: line.trim() };

  const staple = STAPLE_ITEMS[parsed.name.toLowerCase()];
  if (staple) return { qty: null, unit: '', name: staple };

  return { qty: isNaN(parsed.qty) ? null : parsed.qty, unit: parsed.unit, name: parsed.name };
}

/**
 * Baut eine aggregierte Einkaufsliste aus allen Rezepten eines Plans.
 * Zutatenzeilen wie "1 Zwiebel, 2 Knoblauchzehen" werden an Kommas
 * aufgesplittet. Gleiche Zutat + gleiche Einheit wird über die Woche
 * aufsummiert; alles andere wird einmalig gelistet (Dubletten entfernt).
 * Das ist eine Naeherung (Freitext-Zutaten, keine strukturierte Datenbank) -
 * für den tatsächlichen Einkauf gedacht, nicht für Kalorien-/Naehrwertbilanz.
 *
 * `targetServings`: für wie viele Personen eingekauft werden soll (Standard:
 * 1). Rezepte sind für unterschiedlich viele Portionen geschrieben (1-4) -
 * ohne diese Skalierung wurden bisher die vollen Rezeptmengen aufsummiert,
 * unabhängig davon wie viele Portionen das Rezept eigentlich ergibt (Bugfix,
 * Nutzer-Feedback: "30 Eier, 1000g Lachs" für eine Person).
 */
export function buildShoppingList(resolvedPlan, targetServings = 1) {
  const items = new Map(); // key: `${unit}::${name.toLowerCase()}` -> { qty, unit, name }

  for (const day of resolvedPlan.days) {
    for (const key of ['breakfastRecipe', 'lunchRecipe', 'dinnerRecipe']) {
      const recipe = day[key];
      if (!recipe) continue;
      const factor = targetServings / (recipe.servings || 1);
      for (const line of recipe.ingredients || []) {
        for (const part of line.split(',').map(s => s.trim()).filter(Boolean)) {
          const { qty, unit, name } = parseIngredientLine(part);
          const scaledQty = qty != null ? qty * factor : null;
          const mapKey = `${unit}::${name.toLowerCase()}`;
          if (items.has(mapKey)) {
            const existing = items.get(mapKey);
            if (scaledQty != null && existing.qty != null) existing.qty += scaledQty;
            else existing.qty = null; // nicht mehr sauber summierbar -> nur noch Haken-Liste
          } else {
            items.set(mapKey, { qty: scaledQty, unit, name });
          }
        }
      }
    }
  }

  return [...items.values()]
    .map(i => ({
      label: i.qty != null ? `${formatQty(i.qty, i.unit)} ${i.unit} ${i.name}`.replace(/\s+/g, ' ').trim() : i.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
}

function formatQty(n, unit) {
  // Zaehlbare Einheiten (Eier, Zwiebeln, Avocados ...) haben unit === '' -
  // hier wird aufgerundet, da man keine halben Eier kauft.
  if (unit === '') return String(Math.ceil(n));
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ',');
}

/**
 * Skaliert die Zutatenliste EINES Rezepts auf eine Zielportionenzahl - fuer
 * die Detailansicht im Wochenplan (Bugfix: bisher wurden dort immer die
 * unskalierten Original-Mengen des Rezepts angezeigt, obwohl die
 * Einkaufsliste daneben schon auf die gewaehlte Personenzahl skaliert war).
 *
 * @param {string[]} ingredients   recipe.ingredients (Original-Zutatenzeilen)
 * @param {number} recipeServings  recipe.servings
 * @param {number} targetServings  gewaehlte Zielportionen (z. B. 1 Person)
 * @returns {string[]} skalierte Zutatenzeilen, gleiche Zeilenstruktur wie das Original
 */
export function scaleIngredients(ingredients, recipeServings, targetServings) {
  const factor = targetServings / (recipeServings || 1);
  if (factor === 1) return ingredients;

  return (ingredients || []).map(line =>
    line
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => _scalePart(part, factor))
      .join(', ')
  );
}

function _scalePart(part, factor) {
  const { qty, unit, name } = parseIngredientLine(part);
  if (qty == null) return part; // z.B. "Salz", "nach Belieben etwas Zimt" - unveraendert lassen
  const scaled = qty * factor;
  return `${formatQty(scaled, unit)}${unit ? ' ' + unit : ''} ${name}`.replace(/\s+/g, ' ').trim();
}
