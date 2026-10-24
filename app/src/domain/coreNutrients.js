/**
 * coreNutrients.js – WellANNI 2.2
 *
 * Die 8 Kernwerte der Startseite ("Heute auf deinem Teller").
 *
 * - Eiweiß und Ballaststoffe braucht man jeden Tag: sie werden für HEUTE
 *   bewertet.
 * - Eisen, Calcium, Magnesium, Vitamin D, Folat und Vitamin B12 schwanken von
 *   Tag zu Tag stark und werden deshalb als Durchschnitt der letzten 7 Tage
 *   bewertet – gezählt werden nur Tage mit Einträgen, und erst ab 3 solchen
 *   Tagen gibt es überhaupt eine Einschätzung.
 *
 * Statt Ampel und Prozent gibt es freundliche Worte: ab 80 % der Referenz
 * "Schon gut dabei", sonst "Da geht noch was". Vitamin D ist ein Sonderfall:
 * Der Referenzwert (20 µg) gilt ohne Bildung über die Haut und ist über Essen
 * allein kaum zu erreichen – dort steht deshalb ein eigener Hinweis statt
 * eines Dauer-"Da geht noch was".
 */
export const CORE_KEYS = ['protein', 'fiber', 'eisen', 'cal', 'mag', 'vit_d', 'folat', 'b12'];
export const DAILY_KEYS = ['protein', 'fiber'];
export const WEEKLY_KEYS = ['eisen', 'cal', 'mag', 'vit_d', 'folat', 'b12'];

/** Eine Schwelle für die ganze App (Startseite, Wochenplan, Wochenrückblick). */
export const OK_THRESHOLD = 0.8;
export const MIN_WEEK_DAYS = 3;

export const CORE_LABELS = {
  protein: 'Eiweiß', fiber: 'Ballaststoffe', eisen: 'Eisen', cal: 'Calcium',
  mag: 'Magnesium', vit_d: 'Vitamin D', folat: 'Folat', b12: 'Vitamin B12',
};

export const STATUS_TEXT = {
  ok: 'Schon gut dabei',
  more: 'Da geht noch was',
  none: 'Noch nichts eingetragen',
  few: 'Noch zu wenige Tage',
  sun: 'Über Essen kaum zu schaffen',
};

/** Ein Tag zählt, wenn etwas eingetragen wurde. */
export function isLoggedDay(day) {
  return (day?.kcal || 0) > 0;
}

/** Durchschnitt pro Tag mit Einträgen, oder null. */
export function weeklyAverage(last7Totals, key) {
  const days = (last7Totals || []).filter(isLoggedDay);
  if (!days.length) return null;
  return days.reduce((s, d) => s + (d[key] || 0), 0) / days.length;
}

/**
 * @param {object} p
 * @param {object} p.dayTotals     nutritionRepo.getDayTotals(heute)
 * @param {object[]} p.last7Totals nutritionRepo.getLast7DaysTotals()
 * @param {object} p.dgeRef        getDGERef()
 * @param {number} p.proteinRef    Eiweiß-Referenz in g
 * @returns {{key, label, scope:'day'|'week', status:'ok'|'more'|'none'|'few'|'sun', share:number, amount:number, ref:number, unit:string}[]}
 */
export function coreStatus({ dayTotals, last7Totals = [], dgeRef, proteinRef }) {
  const hasToday = isLoggedDay(dayTotals);
  const weekDays = (last7Totals || []).filter(isLoggedDay).length;
  return CORE_KEYS.map(key => {
    const ref = key === 'protein' ? proteinRef : dgeRef[key]?.ref;
    const unit = key === 'protein' ? 'g' : dgeRef[key]?.unit;
    const base = { key, label: CORE_LABELS[key], ref, unit };
    if (DAILY_KEYS.includes(key)) {
      const amount = dayTotals?.[key] || 0;
      const share = ref ? amount / ref : 0;
      const status = !hasToday ? 'none' : share >= OK_THRESHOLD ? 'ok' : 'more';
      return { ...base, scope: 'day', status, share, amount };
    }
    if (weekDays < MIN_WEEK_DAYS) {
      return { ...base, scope: 'week', status: weekDays === 0 ? 'none' : 'few', share: 0, amount: weeklyAverage(last7Totals, key) || 0 };
    }
    const amount = weeklyAverage(last7Totals, key) || 0;
    const share = ref ? amount / ref : 0;
    let status = share >= OK_THRESHOLD ? 'ok' : 'more';
    if (key === 'vit_d' && status === 'more') status = 'sun';
    return { ...base, scope: 'week', status, share, amount };
  });
}

/** Kernwerte mit echter Lücke, größte zuerst (Vitamin D ausgenommen). */
export function coreGaps(core) {
  return core.filter(c => c.status === 'more').sort((a, b) => a.share - b.share);
}

/** Vitamin-D-Hinweis je nach Jahreszeit – ohne Präparate-Empfehlung. */
export function vitaminDNote(date = new Date()) {
  const m = date.getMonth() + 1;
  return m >= 4 && m <= 9
    ? 'Vitamin D ist über Essen allein kaum zu schaffen. Von April bis September bildet deine Haut es mit Sonnenlicht selbst – Zeit draußen hilft.'
    : 'Vitamin D ist über Essen allein kaum zu schaffen, und im Winterhalbjahr reicht die Sonne in Deutschland meist nicht. Fettreicher Fisch und Eier liefern etwas. Bei Fragen dazu sprich mit deiner Hausarztpraxis.';
}

/** Fallback-Referenz Eiweiß ohne Körpergewicht: DGE 0,8 g/kg bei Referenzgewicht. */
export function defaultProteinRef(sex) {
  if (sex === 'm') return 57;
  if (sex === 'f') return 48;
  return 52; // Keine Angabe: Mittelwert
}
