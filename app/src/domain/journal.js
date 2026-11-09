/**
 * journal.js – WellANNI 2.3 (Nicole, 30.10.2026)
 *
 * Reine Funktionen für "Mein Tagebuch": Einträge nach Monaten gruppieren und
 * den Rückblick "Vor 1 / 3 / 6 Monaten" bauen. Leitgedanke: Was du heute an
 * deiner Routine änderst, zeigt sich oft erst nach Monaten – die App macht es
 * sichtbar. Bewusst ohne Bewertung: Zahlen werden nebeneinandergestellt,
 * nicht als "besser" oder "schlechter" beurteilt.
 */
import { dayAverage } from './checkin.js';

export const LOOKBACK_MONTHS = [1, 3, 6];
const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parse(dateStr) {
  return new Date(dateStr + 'T12:00:00');
}

/** Datum vor `months` Monaten (Monatsende wird gekappt, z. B. 31.3. → 28./29.2.). */
export function monthsAgo(dateStr, months) {
  const d = parse(dateStr);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() - months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return iso(d);
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/** Einträge mit Text, neueste zuerst, gruppiert nach 'YYYY-MM'. */
export function groupByMonth(journal = {}) {
  const groups = new Map();
  for (const date of Object.keys(journal).sort().reverse()) {
    const e = journal[date] || {};
    if (!e.good?.trim() && !e.note?.trim()) continue;
    const key = date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ date, good: e.good?.trim() || '', note: e.note?.trim() || '' });
  }
  return [...groups.entries()].map(([key, entries]) => ({ key, label: monthLabel(key), entries }));
}

/** Durchschnitt des Check-ins in den 7 Tagen bis einschließlich `endDate`. */
export function weekCheckinAverage(checkins = {}, endDate) {
  const end = parse(endDate);
  const vals = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const avg = dayAverage(checkins[iso(d)]);
    if (avg != null) vals.push(avg);
  }
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
}

/** Messwert, der einem Datum am nächsten liegt (höchstens `maxDays` entfernt). */
export function nearestMeasurement(entries = [], dateStr, maxDays = 10) {
  const target = parse(dateStr).getTime();
  let best = null;
  let bestDiff = Infinity;
  for (const e of entries) {
    if (!e?.date || typeof e.value !== 'number') continue;
    const diff = Math.abs(parse(e.date.slice(0, 10)).getTime() - target);
    if (diff < bestDiff) { best = e; bestDiff = diff; }
  }
  return best && bestDiff <= maxDays * 86400000 ? best : null;
}

/**
 * Rückblick: für jeden Zeitpunkt (vor 1, 3, 6 Monaten) Check-in-Schnitt der
 * Woche, Gewicht und ein guter Moment aus dieser Zeit – jeweils im Vergleich
 * zu heute. Zeitpunkte ohne jegliche Daten werden ausgelassen.
 */
export function buildLookback({ today, journal = {}, checkins = {}, weights = [] }) {
  const nowAvg = weekCheckinAverage(checkins, today);
  const nowWeight = nearestMeasurement(weights, today, 14);
  const out = [];
  for (const months of LOOKBACK_MONTHS) {
    const then = monthsAgo(today, months);
    const avg = weekCheckinAverage(checkins, then);
    const weight = nearestMeasurement(weights, then);
    // Guter Moment: Eintrag in den ±7 Tagen um den Zeitpunkt
    let moment = null;
    const t = parse(then).getTime();
    for (const [date, e] of Object.entries(journal)) {
      if (!e?.good?.trim()) continue;
      if (Math.abs(parse(date).getTime() - t) <= 7 * 86400000 && (!moment || date > moment.date)) moment = { date, text: e.good.trim() };
    }
    if (avg == null && !weight && !moment) continue;
    out.push({
      months,
      date: then,
      checkin: avg,
      checkinNow: nowAvg,
      weight: weight ? weight.value : null,
      weightNow: nowWeight ? nowWeight.value : null,
      moment,
    });
  }
  return out;
}

/** Wie lange schreibt jemand schon? Datum des ersten Eintrags oder null. */
export function firstEntryDate(journal = {}) {
  const dates = Object.keys(journal).filter(d => journal[d]?.good?.trim() || journal[d]?.note?.trim()).sort();
  return dates[0] || null;
}
