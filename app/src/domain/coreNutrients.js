/**
 * coreNutrients.js – WellANNI 2.2
 *
 * Die 8 Kernwerte der Startseite ("Heute auf deinem Teller"). Statt Ampel und
 * Prozent gibt es freundliche Worte: "Schon gut dabei" ab 80 % der Referenz,
 * sonst "Da geht noch was". Ohne jeden Tagebucheintrag heißt es neutral
 * "Noch nichts eingetragen" – fehlendes Tracking ist kein Mangel-Signal.
 */
export const CORE_KEYS = ['protein', 'fiber', 'eisen', 'cal', 'mag', 'vit_d', 'folat', 'b12'];

export const CORE_LABELS = {
  protein: 'Eiweiß', fiber: 'Ballaststoffe', eisen: 'Eisen', cal: 'Calcium',
  mag: 'Magnesium', vit_d: 'Vitamin D', folat: 'Folat', b12: 'Vitamin B12',
};

// Rezept-Fokus-Schlüssel (recipes.json "focus[].key") je Kernwert
export const CORE_TO_FOCUS = { protein: 'protein', fiber: 'fiber', eisen: 'eisen', cal: 'cal', mag: 'mag', vit_d: 'vit_d', folat: 'folat', b12: 'b12' };

const OK_THRESHOLD = 0.8;

/**
 * @param {object} dayTotals nutritionRepo.getDayTotals()
 * @param {object} dgeRef getDGERef()
 * @param {number|null} proteinRefG Eiweiß-Referenz in g (ohne Gewicht: Fallback nach Geschlecht)
 * @returns {{key:string,label:string,status:'ok'|'more'|'none',share:number}[]}
 */
export function coreStatus(dayTotals, dgeRef, proteinRefG) {
  const hasEntries = (dayTotals?.kcal || 0) > 0;
  return CORE_KEYS.map(key => {
    const ref = key === 'protein' ? proteinRefG : dgeRef[key]?.ref;
    const amount = key === 'protein' ? dayTotals?.protein : dayTotals?.[key];
    const share = ref ? (amount || 0) / ref : 0;
    const status = !hasEntries ? 'none' : share >= OK_THRESHOLD ? 'ok' : 'more';
    return { key, label: CORE_LABELS[key], status, share };
  });
}

export const STATUS_TEXT = { ok: 'Schon gut dabei', more: 'Da geht noch was', none: 'Noch nichts eingetragen' };

/** Fallback-Referenz Eiweiß ohne Körpergewicht: DGE 0,8 g/kg bei Referenzgewicht. */
export function defaultProteinRef(sex) {
  return sex === 'm' ? 57 : 48;
}
