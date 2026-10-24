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
export function getUnderCoveredTags(last7DaysTotals, dgeRef, thresholdPct = 80) {
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
    // 2.2: Durchschnitt nur über Tage mit Einträgen (wie auf der Startseite) –
    // ein vergessener Tag ist kein Mangel. Schwelle seit 2.2 überall 80 %.
    const logged = last7DaysTotals.filter(day => (day.kcal || 0) > 0
      || Object.keys(INTAKE_KEY_TO_TAG).some(k => (day[k] || 0) > 0));
    const avg = logged.reduce((sum, day) => sum + (day[intakeKey] || 0), 0) / (logged.length || 1);
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

// 2.2: Rezepte haben jetzt strukturierte Allergen-Angaben (recipes.json
// "allergens", aus den Zutaten abgeleitet). Die Freitext-Suche bleibt als
// Fallback für eigene Rezepte ohne Allergen-Daten.
const INTOLERANCE_ALLERGENS = {
  laktose: ['milk'],
  gluten: ['gluten'],
  nuesse: ['tree_nuts', 'peanut'],
};

/** Prüft, ob ein Rezept zu einer Unverträglichkeit passt (Allergen-Daten, sonst Freitext-Keywords). */
export function recipeMatchesIntolerance(recipe, intoleranceId) {
  const keywords = INTOLERANCE_KEYWORDS[intoleranceId];
  if (!keywords) return false;
  if (Array.isArray(recipe.allergens)) {
    return recipe.allergens.some(a => (INTOLERANCE_ALLERGENS[intoleranceId] || []).includes(a));
  }
  const text = (recipe.ingredients || []).join(' ').toLowerCase();
  return keywords.some(kw => text.includes(kw));
}

/** Entfernt Rezepte, deren Zutaten zu mindestens einer aktiven Unverträglichkeit passen. */
export function filterByIntolerances(recipes, activeIntolerances = []) {
  if (!activeIntolerances?.length) return recipes;
  return recipes.filter(r => !activeIntolerances.some(id => recipeMatchesIntolerance(r, id)));
}

/**
 * Liefert den geeigneten Rezept-Pool je Mahlzeit (Kategorie- und
 * Unverträglichkeits-gefiltert) - dieselbe Filterlogik wie in generatePlan(),
 * aber ohne zu würfeln. Von generatePlan() selbst UND von der UI genutzt
 * (Rezept-Tausch-Auswahl, siehe mealPlan.js "🔄 Tauschen"), damit beide
 * garantiert denselben Pool sehen und kein zweites Mal gepflegt werden muss.
 *
 * Review 12 (19.08.2026), Nutzer-Feedback ("in jedem Rezept wird Fleisch oder
 * Fisch verwendet, das muss nicht sein" / "Frühstück eine komplett eigene
 * Kategorie"): zwei Verhaltensänderungen gegenüber vorher.
 * 1. Frühstück ist jetzt IMMER von der gewählten Mittag/Abend-Kategorie
 *    entkoppelt - unabhängig von "Fleisch/Fisch"/"Vegetarisch"/"Keto"/
 *    "Gemischt" kommen Frühstücksvorschläge aus dem GESAMTEN Frühstücks-Pool
 *    (Porridge/Quark/Obst/Gemüse ebenso wie die herzhaften Varianten).
 *    Vorher fielen z.B. bei "Fleisch/Fisch" alle Skyr-/Porridge-Rezepte weg,
 *    weil die nur unter "Vegetarisch"/"Keto" einsortiert sind.
 * 2. "Fleisch/Fisch" ist für Mittag/Abend keine strikte Pflicht mehr, sondern
 *    eine Präferenz: der Pool umfasst jetzt ALLE Kategorien (wie "Gemischt"),
 *    die tatsächliche Fleisch/Fisch-Bevorzugung passiert als Gewichtung beim
 *    Würfeln in generatePlan() - siehe FLEISCH_FISCH_WEIGHT dort.
 *    "Vegetarisch" und "Keto" bleiben dagegen bewusst STRIKT (Nicole:
 *    "bei vegetarisch ist Fleisch verboten") - dort wird weiterhin nur aus
 *    Rezepten der jeweiligen Kategorie gewählt.
 */
export function getEligiblePool(recipes, category, activeIntolerances = []) {
  const withoutIntolerances = filterByIntolerances(recipes, activeIntolerances);
  // 2.2 (Fund aus der Gesamtprüfung Okt. 2026): Bei "Vegetarisch" kamen zum
  // Frühstück Rezepte wie "Rührei mit Rindfleisch", weil das Frühstück seit
  // Review 12 komplett von der Kategorie entkoppelt war. Die Ernährungsform
  // gilt jetzt für ALLE Mahlzeiten; entkoppelt bleibt nur die Kategorie-
  // Präferenz "Fleisch/Fisch" (Frühstück darf dort auch Porridge sein).
  const fitsDiet = r => matchesDiet(r, category);

  const breakfast = withoutIntolerances.filter(r => r.mealType === 'breakfast' && fitsDiet(r));
  const lunch = withoutIntolerances.filter(r => r.mealType === 'lunch' && fitsDiet(r));

  return {
    breakfast,
    lunch,
    dinner: lunch, // Abendessen nutzt denselben Pool wie Mittag
  };
}

/** true, wenn ein Rezept zur gewählten Ernährungsform passt (2.2: über Rezept-Flags). */
export function matchesDiet(recipe, category) {
  if (category === 'gemischt' || category === 'fleisch_fisch') return true;
  if (category === 'vegetarisch') {
    return typeof recipe.vegetarian === 'boolean' ? recipe.vegetarian : recipe.category === 'vegetarisch';
  }
  if (category === 'keto') {
    return typeof recipe.lowCarb === 'boolean' ? recipe.lowCarb : recipe.category === 'keto';
  }
  return recipe.category === category;
}

/** true, wenn ein Rezept Fleisch oder Fisch enthält. */
function hasMeatOrFish(recipe) {
  return typeof recipe.vegetarian === 'boolean' ? !recipe.vegetarian : recipe.category === 'fleisch_fisch';
}

// 2.2: Saison des Wochenstarts (f/s/h/w). Rezepte tragen "seasons" wie
// ["h","w"] oder ["g"] (ganzjährig). Beim Würfeln werden Rezepte der
// aktuellen Saison bevorzugt (kein Spargel im Oktober), solange genug da sind.
export function seasonOf(isoDate) {
  const m = new Date(isoDate).getMonth() + 1;
  if (m >= 3 && m <= 5) return 'f';
  if (m >= 6 && m <= 8) return 's';
  if (m >= 9 && m <= 11) return 'h';
  return 'w';
}

export function isInSeason(recipe, season) {
  if (!Array.isArray(recipe.seasons) || !recipe.seasons.length) return true;
  return recipe.seasons.includes('g') || recipe.seasons.includes(season);
}

/**
 * Erzeugt einen neuen 7-Tage-Plan. `category` ist 'vegetarisch' | 'fleisch_fisch'
 * | 'keto' | 'gemischt'. Bei 'gemischt' wird über alle Kategorien gestreut;
 * bei 'fleisch_fisch' seit Review 12 ebenfalls (siehe getEligiblePool()),
 * mit einer Ziehungs-Gewichtung Richtung Fleisch/Fisch (FLEISCH_FISCH_WEIGHT).
 *
 * `underCoveredTags` (optional): Rezept-Tag-IDs, die bei der Auswahl bevorzugt
 * werden, siehe getUnderCoveredTags(). Sanfte Praeferenz, kein Zwang - wenn
 * kein "frisches" Rezept mit passendem Tag verfuegbar ist, wird trotzdem aus
 * dem vollen frischen Pool gewaehlt, damit die Abwechslung erhalten bleibt.
 *
 * `activeIntolerances` (optional): siehe filterByIntolerances() - wird VOR
 * der Kategorie-/Mahlzeit-Filterung angewendet.
 *
 * `pins` (optional, Feature-Wunsch 03.08.2026: "zum Frühstück immer das
 * Porridge"): { breakfast?: recipeId, lunch?: recipeId, dinner?: recipeId }.
 * Ist für eine Mahlzeit ein Pin gesetzt UND das Rezept existiert noch in
 * `recipes`, wird an ALLEN 7 Tagen dieses Rezept eingeplant statt gewürfelt -
 * überlebt also auch "Neu generieren". Existiert das gepinnte Rezept nicht
 * mehr (z.B. nach einer Rezept-Datenbank-Änderung), fällt die Mahlzeit
 * defensiv auf normales Würfeln zurück statt eine Lücke zu erzeugen.
 */
export function generatePlan(recipes, category, weekStartIso, underCoveredTags = [], activeIntolerances = [], pins = {}) {
  const byMeal = getEligiblePool(recipes, category, activeIntolerances);
  const recipesById = Object.fromEntries(recipes.map(r => [r.id, r]));

  // Review 12 (19.08.2026), Tester-Fund ("an zwei Wochentagen jeweils Mittag-
  // und Abendessen dasselbe Rezept" + "bitte immer eine Berücksichtigung,
  // dass das Rezept nicht zweimal an einem Tag gewählt werden darf und auch
  // nicht zweimal in einer Woche"): STRIKTE Wochen-Einzigartigkeit statt der
  // vorherigen "nicht dieselben letzten 3"-Weichspülung. Mittag UND Abend
  // teilen sich einen gemeinsamen "lunchDinner"-Track (sie nutzen ohnehin
  // denselben Rezept-Pool, siehe getEligiblePool()) - so kann ein Rezept
  // niemals zweimal am selben Tag ODER an zwei verschiedenen Tagen derselben
  // Woche auftauchen. Frühstück wird unabhängig davon getrackt (eigener,
  // disjunkter Rezept-Pool). Fällt defensiv auf den vollen Pool zurück, falls
  // ein sehr enger Filter (z.B. mehrere gleichzeitige Unverträglichkeiten)
  // weniger eindeutige Rezepte übrig lässt, als die Woche Slots braucht -
  // niemals eine leere Mahlzeit erzeugen.
  const usedThisWeek = { breakfast: new Set(), lunchDinner: new Set() };

  // Pins gelten für die GANZE Woche und zählen daher vorab als "diese Woche
  // verwendet" - sonst könnte eine zufällige Auswahl in der jeweils anderen
  // Mahlzeit (Mittag/Abend teilen sich den Pool) dieselbe Woche über exakt
  // das gepinnte Rezept "duplizieren".
  for (const mealType of ['breakfast', 'lunch', 'dinner']) {
    const pinnedId = pins[mealType];
    if (pinnedId && recipesById[pinnedId]) {
      const trackKey = mealType === 'breakfast' ? 'breakfast' : 'lunchDinner';
      usedThisWeek[trackKey].add(pinnedId);
    }
  }

  // "Fleisch/Fisch" ist seit Review 12 eine Präferenz, keine Pflicht mehr
  // (Nutzer-Feedback: bei durchgehender Fleisch/Fisch-Wahl enthielt vorher
  // buchstäblich JEDES Rezept Fleisch/Fisch). Der Pool (getEligiblePool)
  // enthält jetzt auch vegetarische/Keto-Gerichte; hier wird nur noch die
  // AUSWAHL innerhalb des Pools in Richtung Fleisch/Fisch gewichtet, nicht
  // mehr erzwungen. 65% ist eine bewusste Mitte zwischen "kaum merkbar" und
  // "de facto wieder Pflicht" - im Schnitt über Mittag+Abend ergibt das ca.
  // 1,3 Fleisch/Fisch-Mahlzeiten pro Tag, mit echter Streuung (mal 0, mal 1,
  // mal 2), wie von Nicole beschrieben ("einmal am Tag... auch mal zweimal...
  // auch mal vegetarisch").
  const FLEISCH_FISCH_WEIGHT = 0.65;
  const preferredIds = category === 'fleisch_fisch'
    ? new Set(recipes.filter(hasMeatOrFish).map(r => r.id))
    : null;
  const season = seasonOf(weekStartIso);

  function pick(mealType, sameDayExcludeId = null) {
    const trackKey = mealType === 'breakfast' ? 'breakfast' : 'lunchDinner';
    const options = byMeal[mealType];
    if (!options.length) return null;
    const used = usedThisWeek[trackKey];

    let candidates = options.filter(r => !used.has(r.id));
    if (!candidates.length) candidates = options; // Pool zu klein fuer volle Wochen-Einzigartigkeit - Fallback

    // 2.2: Saisonale Rezepte bevorzugen - nur wenn danach noch Auswahl bleibt.
    const inSeason = candidates.filter(r => isInSeason(r, season));
    if (inSeason.length) candidates = inSeason;

    // Selbst-Duplikat-Schutz: der Wochen-Fallback oben (und der Tag-Boost
    // gleich danach) koennten sonst in kleinen Pools genau das Rezept
    // reproduzieren, das heute schon fuer Mittag gewaehlt wurde (der
    // urspruengliche Bug-Report: "an zwei Wochentagen jeweils Mittag- und
    // Abendessen das gleiche Rezept"). Deshalb wird der Ausschluss NACH dem
    // Wochen-Fallback, aber VOR dem Tag-Boost angewendet - und nur, wenn
    // dadurch nicht der Pool komplett leerlaeuft (1-Rezept-Pool = Duplikat
    // unvermeidbar, aber besser als eine leere Mahlzeit).
    if (sameDayExcludeId) {
      const withoutSameDay = candidates.filter(r => r.id !== sameDayExcludeId);
      if (withoutSameDay.length) candidates = withoutSameDay;
    }

    const boosted = underCoveredTags.length
      ? candidates.filter(r => r.tags?.some(t => underCoveredTags.includes(t)))
      : [];
    let pool = boosted.length ? boosted : candidates;

    // Fleisch/Fisch-Gewichtung nur anwenden, wenn im aktuellen (schon
    // gefilterten) Pool tatsächlich BEIDE Varianten verfügbar sind - sonst
    // würde der Würfel wirkungslos bzw. die Auswahl künstlich einschränken.
    if (preferredIds && trackKey === 'lunchDinner') {
      const preferred = pool.filter(r => preferredIds.has(r.id));
      const rest = pool.filter(r => !preferredIds.has(r.id));
      if (preferred.length && rest.length) {
        pool = Math.random() < FLEISCH_FISCH_WEIGHT ? preferred : rest;
      }
    }

    const choice = pool[Math.floor(Math.random() * pool.length)];
    used.add(choice.id);
    return choice.id;
  }

  function pinnedOrPicked(mealType, sameDayExcludeId = null) {
    const pinnedId = pins[mealType];
    if (pinnedId && recipesById[pinnedId]) return pinnedId;
    return pick(mealType, sameDayExcludeId);
  }

  const start = new Date(weekStartIso);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const breakfastId = pinnedOrPicked('breakfast');
    const lunchId = pinnedOrPicked('lunch');
    // Abend erhaelt explizit die heutige Mittags-Wahl als Ausschluss - das ist
    // der eigentliche Fix fuer den gemeldeten Bug (siehe pick() oben).
    const dinnerId = pinnedOrPicked('dinner', lunchId);
    days.push({
      date: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[i],
      breakfast: breakfastId,
      lunch: lunchId,
      dinner: dinnerId,
    });
  }
  return { weekStart: weekStartIso, category, pins: { ...pins }, days };
}

/**
 * Tauscht die Mahlzeit EINES einzelnen Tages gegen ein anderes Rezept aus
 * (Feature-Wunsch 03.08.2026: "keine Forelle mag und sich dann ein anderes
 * Rezept aussucht") - reine, unveraenderliche Funktion, betrifft nur diesen
 * einen Tag/diese eine Mahlzeit, kein Einfluss auf Pins oder andere Tage.
 */
export function setDaySlot(plan, dateIso, mealType, recipeId) {
  return {
    ...plan,
    days: plan.days.map(day => (day.date === dateIso ? { ...day, [mealType]: recipeId } : day)),
  };
}

/**
 * Pinnt (oder loest einen Pin) fuer eine Mahlzeit-Kategorie ueber die GANZE
 * Woche (Feature-Wunsch 03.08.2026: "zum Fruehstueck immer das Porridge").
 * Beim Pinnen wird das gewaehlte Rezept sofort in ALLE 7 Tage des aktuell
 * angezeigten Plans eingetragen (nicht erst beim naechsten "Neu generieren")
 * und bleibt dank generatePlan()'s pins-Parameter auch danach bestehen.
 * Beim Loesen (recipeId = null) wird nur der Pin selbst entfernt - die
 * aktuell eingetragenen Tage bleiben unveraendert, erst eine kuenftige
 * Neugenerierung wuerfelt diese Mahlzeit wieder frei.
 */
export function setPin(plan, mealType, recipeId) {
  const pins = { ...(plan.pins || {}) };
  if (recipeId) {
    pins[mealType] = recipeId;
  } else {
    delete pins[mealType];
  }
  const days = recipeId
    ? plan.days.map(day => ({ ...day, [mealType]: recipeId }))
    : plan.days;
  return { ...plan, pins, days };
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
 * 2.2: Rezept-Datenbank wurde von 310 auf gut 200 Rezepte konsolidiert. Ein
 * gespeicherter Plan kann daher IDs enthalten, die es nicht mehr gibt. Diese
 * Slots werden durch ein passendes Rezept (gleiche Mahlzeit, Ernährungsform,
 * Unverträglichkeiten) ersetzt, das in dieser Woche noch nicht vorkommt.
 * Pins auf gelöschte Rezepte werden entfernt. Gibt { plan, changed } zurück.
 */
export function repairPlan(plan, recipes, activeIntolerances = []) {
  if (!plan?.days) return { plan, changed: false };
  const ids = new Set(recipes.map(r => r.id));
  const pool = getEligiblePool(recipes, plan.category, activeIntolerances);
  const used = new Set(plan.days.flatMap(d => [d.breakfast, d.lunch, d.dinner]).filter(id => ids.has(id)));
  let changed = false;
  const pickFor = mealType => {
    const options = pool[mealType] || [];
    const fresh = options.filter(r => !used.has(r.id));
    const list = fresh.length ? fresh : options;
    if (!list.length) return null;
    const choice = list[Math.floor(Math.random() * list.length)];
    used.add(choice.id);
    return choice.id;
  };
  const days = plan.days.map(day => {
    const next = { ...day };
    for (const mealType of ['breakfast', 'lunch', 'dinner']) {
      if (next[mealType] && !ids.has(next[mealType])) {
        next[mealType] = pickFor(mealType);
        changed = true;
      }
    }
    return next;
  });
  const pins = { ...(plan.pins || {}) };
  for (const [mealType, id] of Object.entries(pins)) {
    if (!ids.has(id)) { delete pins[mealType]; changed = true; }
  }
  return { plan: changed ? { ...plan, days, pins } : plan, changed };
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
/** "Kidneybohnen (240 g abgetropft)" -> "Kidneybohnen"; Staples vereinheitlichen. */
function cleanIngredientName(name) {
  const base = String(name || '').replace(/\s*\([^)]*\)/g, '').trim();
  const staple = STAPLE_ITEMS[base.toLowerCase()];
  if (staple) return staple;
  if (/^salz\b/i.test(base)) return 'Salz und Gewürze';
  return base;
}

function addShoppingItem(items, mapKey, scaledQty, unit, name) {
  if (items.has(mapKey)) {
    const existing = items.get(mapKey);
    if (scaledQty != null && existing.qty != null) existing.qty += scaledQty;
    else if (scaledQty == null && existing.qty == null) { /* schon gelistet */ }
    else existing.qty = existing.qty ?? scaledQty;
  } else {
    items.set(mapKey, { qty: scaledQty, unit, name });
  }
}

export function buildShoppingList(resolvedPlan, targetServings = 1) {
  const items = new Map(); // key: `${unit}::${name.toLowerCase()}` -> { qty, unit, name }

  for (const day of resolvedPlan.days) {
    for (const key of ['breakfastRecipe', 'lunchRecipe', 'dinnerRecipe']) {
      const recipe = day[key];
      if (!recipe) continue;
      const factor = targetServings / (recipe.servings || 1);
      // 2.2: strukturierte Zutaten (Menge, Einheit, Name) statt Freitext-Parsing.
      if (Array.isArray(recipe.ingredientsData) && recipe.ingredientsData.length) {
        for (const ing of recipe.ingredientsData) {
          const name = cleanIngredientName(ing.name);
          if (!name || /^wasser\b/i.test(name)) continue;
          const unit = ing.qty != null ? (ing.unit || '') : '';
          const scaledQty = ing.qty != null ? ing.qty * factor : null;
          const mapKey = `${unit.toLowerCase()}::${name.toLowerCase()}`;
          addShoppingItem(items, mapKey, scaledQty, unit, name);
        }
        continue;
      }
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

  // 2.2: alphabetisch nach Zutat statt nach Mengen-Text; Vorrats-Zutaten
  // (Gewürze, Öl, Essig, Löffelmengen) als eigene Gruppe "pantry".
  return [...items.values()]
    .map(i => ({
      name: i.name,
      pantry: isPantryItem(i),
      label: i.qty != null ? `${formatQty(i.qty, i.unit)} ${i.unit} ${i.name}`.replace(/\s+/g, ' ').trim() : i.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

const PANTRY_UNITS = new Set(['tl', 'el', 'prise', 'prisen', 'msp.', 'spritzer']);
const PANTRY_NAMES = /(salz|pfeffer|gewürz|paprikapulver|kreuzkümmel|kurkuma|curry|zimt|muskat|oregano|thymian|chili|cayenne|öl\b|essig|senf|brühe|honig|ahornsirup|backpulver|natron|vanille|sojasauce|tomatenmark|lorbeer|kardamom)/i;

function isPantryItem(i) {
  if (i.name === 'Salz und Gewürze') return true;
  if (PANTRY_UNITS.has(String(i.unit || '').toLowerCase())) return true;
  return i.qty == null && PANTRY_NAMES.test(i.name);
}

const WHOLE_UNITS = new Set(['', 'bund', 'dose', 'dosen', 'stück', 'glas', 'gläser', 'becher', 'pck.', 'packung', 'kopf', 'köpfe', 'stange', 'stangen', 'knolle', 'knollen', 'beutel', 'netz', 'schale']);

function formatQty(n, unit) {
  const u = String(unit || '').toLowerCase();
  // Zählbare Einheiten (Eier, Zwiebeln, Bund, Dose …) werden aufgerundet –
  // man kauft keine halbe Dose.
  if (WHOLE_UNITS.has(u)) return String(Math.max(1, Math.ceil(n - 0.05)));
  if (u === 'g' || u === 'ml') {
    if (n >= 100) return String(Math.round(n / 10) * 10);
    return String(Math.max(5, Math.round(n / 5) * 5));
  }
  if (u === 'kg' || u === 'l') return (Math.round(n * 10) / 10).toString().replace('.', ',');
  // Löffel, Zehen, cm, Handvoll: auf halbe aufrunden
  const v = Math.max(0.5, Math.ceil(n * 2 - 0.05) / 2);
  const whole = Math.floor(v);
  if (v - whole === 0.5) return whole ? `${whole} ½` : '½';
  return String(v);
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

/**
 * 2.2: "Gegessen ✓" im Wochenplan. Merkt sich pro Tag und Mahlzeit, ob sie
 * ins Tagebuch übernommen wurde (Schlüssel "YYYY-MM-DD|lunch").
 */
export function eatenKey(dateIso, mealType) {
  return `${dateIso}|${mealType}`;
}

export function isEaten(plan, dateIso, mealType) {
  return !!plan?.eaten?.[eatenKey(dateIso, mealType)];
}

export function setEaten(plan, dateIso, mealType, value) {
  const eaten = { ...(plan.eaten || {}) };
  if (value) eaten[eatenKey(dateIso, mealType)] = true;
  else delete eaten[eatenKey(dateIso, mealType)];
  return { ...plan, eaten };
}
