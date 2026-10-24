/**
 * checkinHints.js – WellANNI 2.2
 *
 * Vorsichtige Hinweise, wenn es jemandem seit ein paar Tagen nicht gut geht:
 * Liegt Energie, Schlaf oder Bauchgefühl an mindestens 3 der letzten 4 Tage
 * bei 1 oder 2, erscheint unter dem Check-in ein kurzer Satz – ohne Urteil,
 * ohne Diagnose, mit dem Rat, bei anhaltenden Beschwerden die Hausarztpraxis
 * zu fragen. Für die Stimmung gibt es bewusst KEINE Hinweise und keine
 * Auswertungen (Entscheidung 24.10.2026).
 *
 * Nährstoff-Bezug nur mit zugelassenen EU-Aussagen (Health Claims) und nur,
 * wenn der Nährstoff in der Woche tatsächlich zu kurz kam.
 */
export const HINT_AREAS = ['energie', 'schlaf', 'bauch'];
export const LOW_VALUE = 2;
export const WINDOW_DAYS = 4;
export const MIN_LOW_DAYS = 3;
export const SNOOZE_DAYS = 7;

const FATIGUE_NUTRIENTS = { eisen: 'Eisen', b12: 'Vitamin B12', mag: 'Magnesium' };

export const HINT_TEXT = {
  energie: {
    title: 'Deine Energie ist seit ein paar Tagen eher niedrig',
    body: 'Das kann viele Gründe haben – Schlaf, Stress, wie und wann du isst.',
  },
  schlaf: {
    title: 'Du schläfst seit ein paar Tagen eher schlecht',
    body: 'Vielen helfen feste Schlafenszeiten, ein nicht zu spätes und nicht zu schweres Abendessen und Kaffee oder schwarzer Tee eher nur bis zum frühen Nachmittag.',
  },
  bauch: {
    title: 'Dein Bauch fühlt sich seit ein paar Tagen nicht so gut an',
    body: 'Vielen tut es gut, Ballaststoffe langsam zu steigern, genug zu trinken und in Ruhe zu essen.',
  },
};

export const DOCTOR_NOTE = 'Hält das länger an, sprich mit deiner Hausarztpraxis.';

/**
 * @param {object[]} recent checkinRepo.getRecent(WINDOW_DAYS) – heute zuletzt
 * @returns {string[]} Bereiche mit Hinweis
 */
export function lowAreas(recent) {
  const days = (recent || []).slice(-WINDOW_DAYS);
  return HINT_AREAS.filter(area =>
    days.filter(d => typeof d[area] === 'number' && d[area] <= LOW_VALUE).length >= MIN_LOW_DAYS);
}

/** true, wenn der Hinweis zu `area` in den letzten 7 Tagen weggetippt wurde. */
export function isSnoozed(dismissed, area, todayIso) {
  const at = dismissed?.[area];
  if (!at) return false;
  const diff = (new Date(todayIso + 'T12:00:00') - new Date(at + 'T12:00:00')) / 86400000;
  return diff < SNOOZE_DAYS;
}

/**
 * Baut die anzuzeigenden Hinweise.
 * @param {object} p
 * @param {object[]} p.recent        letzte 4 Check-in-Tage
 * @param {object} p.dismissed       { area: 'YYYY-MM-DD' }
 * @param {string} p.today
 * @param {object[]} p.core          coreStatus() – für den Nährstoff-Bezug
 * @returns {{area, title, body, nutrients:string[], extra:string|null}[]}
 */
export function buildCheckinHints({ recent, dismissed = {}, today, core = [] }) {
  const byKey = Object.fromEntries(core.map(c => [c.key, c]));
  return lowAreas(recent)
    .filter(area => !isSnoozed(dismissed, area, today))
    .map(area => {
      let nutrients = [];
      let extra = null;
      if (area === 'energie') {
        nutrients = Object.keys(FATIGUE_NUTRIENTS).filter(k => byKey[k]?.status === 'more');
        if (nutrients.length) {
          const names = nutrients.map(k => FATIGUE_NUTRIENTS[k]);
          extra = `${listDe(Object.values(FATIGUE_NUTRIENTS))} tragen zur Verringerung von Müdigkeit und Ermüdung bei. In deinen letzten Tagen war weniger dabei von: ${listDe(names)}.`;
        }
      }
      if (area === 'bauch' && byKey.fiber?.status === 'more') {
        nutrients = ['fiber'];
        extra = 'Heute waren bisher eher wenig Ballaststoffe auf deinem Teller.';
      }
      return { area, ...HINT_TEXT[area], nutrients, extra };
    });
}

function listDe(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}`;
}
