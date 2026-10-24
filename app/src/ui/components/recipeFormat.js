/**
 * recipeFormat.js – WellANNI 2.2
 *
 * Gemeinsame Anzeige-Helfer für Rezeptliste, Rezeptseite und Startseite.
 */
export const ALLERGEN_LABELS = {
  gluten: 'Gluten', milk: 'Milch', egg: 'Ei', fish: 'Fisch', crustaceans: 'Krebstiere',
  peanut: 'Erdnüsse', tree_nuts: 'Schalenfrüchte', sesame: 'Sesam', soy: 'Soja',
  celery: 'Sellerie', mustard: 'Senf', sulphites: 'Sulfite',
};

export const MEAL_FILTERS = [
  ['alle', 'Alle'], ['breakfast', 'Frühstück'], ['lunch', 'Hauptgerichte'], ['snack', 'Kleinigkeiten'],
];

export const TAG_FILTERS = [
  ['saison', 'Jetzt in Saison'], ['schnell', 'Schnell'], ['familie', 'Familie'],
  ['mealprep', 'Vorkochen'], ['mitnehmen', 'Zum Mitnehmen'], ['gaeste', 'Für Gäste'],
  ['veg', 'Vegetarisch'], ['vegan', 'Vegan'], ['lowcarb', 'Low Carb'],
];

export const OCCASION_TAGS = ['schnell', 'familie', 'mealprep', 'mitnehmen', 'gaeste'];

export function totalMinutes(r) {
  return (r.prepMin || 0) + (r.cookMin || 0);
}

/** Deutsche Zahl mit max. einer Nachkommastelle. */
export function fmtNum(n) {
  return (Math.round(n * 10) / 10).toString().replace('.', ',');
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Eine Zutatenzeile skaliert auf `factor` (Ziel-Portionen ÷ Rezept-Portionen).
 * @returns {[string, string]} [Menge, Zutat]
 */
export function scaledLine(item, factor) {
  if (item.qty == null) return ['', item.name];
  const v = roundQty(item.qty * factor, item.unit || '');
  return [`${formatQty(v)} ${item.unit || ''}`.trim(), item.name];
}

const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };

/**
 * Küchentaugliches Runden beim Hochrechnen: Gramm und Milliliter auf 5
 * (ab 50) bzw. ganze Zahlen, Löffel und Stückzahlen auf Viertel – niemals
 * "0,4 Zitrone" oder "113 g".
 */
export function roundQty(v, unit) {
  const u = unit.toLowerCase();
  if (u === 'g' || u === 'ml') {
    if (v >= 50) return Math.round(v / 5) * 5;
    return Math.max(1, Math.round(v));
  }
  if (u === 'kg' || u === 'l') return Math.max(0.1, Math.round(v * 10) / 10);
  return Math.max(0.25, Math.round(v * 4) / 4);
}

export function formatQty(v) {
  const whole = Math.floor(v);
  const frac = Math.round((v - whole) * 100) / 100;
  if (FRACTIONS[frac]) return whole ? `${whole} ${FRACTIONS[frac]}` : FRACTIONS[frac];
  return Number.isInteger(v) ? String(v) : fmtNum(v);
}

/** Zutatenname als Nährstoffquelle: ohne Klammerzusätze, Salz als Jodsalz. */
export function sourceName(name) {
  const clean = String(name).replace(/\s*\([^)]*\)/g, '').trim();
  if (/^salz\b/i.test(clean)) return 'Jodsalz';
  return clean;
}

/**
 * Filter für die Rezeptliste. `season` ist der Buchstabe aus seasonOf().
 */
export function matchesFilters(r, { meal = 'alle', tags = [], query = '' }, season) {
  if (meal !== 'alle' && r.mealType !== meal) return false;
  for (const t of tags) {
    if (t === 'saison' && !(r.seasons || []).some(s => s === 'g' || s === season)) return false;
    if (t === 'veg' && !r.vegetarian) return false;
    if (t === 'vegan' && !r.vegan) return false;
    if (t === 'lowcarb' && !r.lowCarb) return false;
    if (OCCASION_TAGS.includes(t) && !(r.occasions || []).includes(t)) return false;
  }
  const q = query.trim().toLowerCase();
  if (q && !(r.title + ' ' + (r.ingredients || []).join(' ')).toLowerCase().includes(q)) return false;
  return true;
}
