/**
 * checkinPatterns.js – WellANNI 2.2 (Premium)
 *
 * Persönliche Muster: Vergleicht das Befinden (Energie, Schlaf, Bauchgefühl)
 * mit dem, was sonst eingetragen wurde, und meldet nur deutliche
 * Unterschiede. Stimmung wird bewusst NICHT ausgewertet.
 *
 * Seriositäts-Regeln:
 * - frühestens ab MIN_CHECKIN_DAYS Tagen mit Check-in (im Zeitraum)
 * - je Vergleichsgruppe mindestens MIN_GROUP Tage
 * - Unterschied der Durchschnitte mindestens MIN_DIFF Punkte (Skala 1–5)
 * - höchstens MAX_PATTERNS Muster, die deutlichsten zuerst
 * - immer als Beobachtung formuliert, nie als Ursache (siehe PATTERN_NOTE)
 *
 * Schlaf und Bauchgefühl werden mit dem VORTAG verglichen (der Check-in
 * beschreibt die Nacht bzw. den Morgen danach), Energie mit demselben Tag.
 */
export const MIN_CHECKIN_DAYS = 14;
export const MIN_GROUP = 4;
export const MIN_DIFF = 0.7;
export const MAX_PATTERNS = 3;
export const PATTERN_NOTE = 'Das sind Beobachtungen aus deinen Einträgen, kein Beweis – Zufall ist möglich, und vieles spielt zusammen.';

const AREA_LABEL = { energie: 'deine Energie', schlaf: 'dein Schlaf', bauch: 'dein Bauchgefühl' };

/**
 * Faktoren: test(day) liefert true/false (Gruppe) oder null (keine Daten).
 * `lag`: 0 = derselbe Tag, 1 = Vortag.
 */
export const FACTORS = [
  { id: 'steps', areas: ['energie'], lag: 0, yes: 'An Tagen mit mehr als 7.000 Schritten', no: 'an Tagen mit weniger',
    test: d => (d.steps > 0 ? d.steps >= 7000 : null) },
  { id: 'steps_prev', areas: ['schlaf'], lag: 1, yes: 'Nach Tagen mit mehr als 7.000 Schritten', no: 'nach Tagen mit weniger',
    test: d => (d.steps > 0 ? d.steps >= 7000 : null) },
  { id: 'sleep', areas: ['energie'], lag: 0, yes: 'Nach einer guten Nacht (Schlaf 4 oder 5)', no: 'nach einer schlechten (1 oder 2)',
    test: d => (typeof d.checkin?.schlaf === 'number' ? (d.checkin.schlaf >= 4 ? true : d.checkin.schlaf <= 2 ? false : null) : null) },
  { id: 'water', areas: ['energie', 'bauch'], lag: 0, yes: 'An Tagen, an denen du mindestens 1,5 Liter getrunken hast', no: 'an Tagen mit weniger',
    test: d => (d.waterMl > 0 ? d.waterMl >= 1500 : null) },
  { id: 'fasting', areas: ['energie'], lag: 0, yes: 'An Tagen mit abgeschlossenem Fastenfenster', no: 'an Tagen ohne',
    test: d => (d.fastingTracked ? !!d.fastCompleted : null) },
  { id: 'caffeine', areas: ['schlaf'], lag: 1, yes: 'Nach Tagen mit mehr als 200 mg Koffein (etwa 2–3 Tassen Kaffee)', no: 'nach Tagen mit weniger',
    test: d => (typeof d.caffeineMg === 'number' ? d.caffeineMg > 200 : null) },
  { id: 'big_dinner', areas: ['schlaf', 'bauch'], lag: 1, yes: 'Nach Tagen mit einem großen Abendessen (mehr als 40 % des Tages)', no: 'nach Tagen mit leichterem Abendessen',
    test: d => (d.kcal > 0 ? d.dinnerShare > 0.4 : null) },
  { id: 'fiber', areas: ['bauch'], lag: 1, yes: 'Nach Tagen mit mindestens 25 g Ballaststoffen', no: 'nach Tagen mit weniger',
    test: d => (d.kcal > 0 ? d.fiber >= 25 : null) },
  { id: 'period', areas: ['energie', 'schlaf'], lag: 0, yes: 'Während deiner Periode', no: 'an den übrigen Zyklustagen',
    test: d => (d.phase ? d.phase === 'menstruation' : null) },
];

function mean(a) { return a.reduce((s, v) => s + v, 0) / a.length; }
function fmt(n) { return (Math.round(n * 10) / 10).toString().replace('.', ','); }

/**
 * @param {object[]} days aufsteigend nach Datum, lückenlos:
 *   { date, checkin:{energie,schlaf,bauch}, steps, waterMl, fastingTracked, fastCompleted,
 *     caffeineMg, kcal, fiber, dinnerShare, phase }
 * @returns {{ready:boolean, checkinDays:number, patterns:{id, area, text, diff}[]}}
 */
export function findPatterns(days) {
  const checkinDays = days.filter(d => ['energie', 'schlaf', 'bauch'].some(a => typeof d.checkin?.[a] === 'number')).length;
  if (checkinDays < MIN_CHECKIN_DAYS) return { ready: false, checkinDays, patterns: [] };

  const found = [];
  for (const f of FACTORS) {
    for (const area of f.areas) {
      const yes = []; const no = [];
      for (let i = f.lag; i < days.length; i++) {
        const value = days[i].checkin?.[area];
        if (typeof value !== 'number') continue;
        const group = f.test(days[i - f.lag]);
        if (group === true) yes.push(value);
        else if (group === false) no.push(value);
      }
      if (yes.length < MIN_GROUP || no.length < MIN_GROUP) continue;
      const a = mean(yes); const b = mean(no);
      if (Math.abs(a - b) < MIN_DIFF) continue;
      const verb = a > b ? 'besser' : 'schlechter';
      found.push({
        id: `${f.id}:${area}`,
        area,
        diff: Math.abs(a - b),
        text: `${f.yes} war ${AREA_LABEL[area]} im Schnitt ${verb}: ${fmt(a)} statt ${fmt(b)} von 5 (${f.no}).`,
      });
    }
  }
  found.sort((x, y) => y.diff - x.diff);
  return { ready: true, checkinDays, patterns: found.slice(0, MAX_PATTERNS) };
}
