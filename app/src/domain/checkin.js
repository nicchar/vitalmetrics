/**
 * checkin.js – WellANNI 2.2
 *
 * Befindens-Check-in: vier Bereiche, 5-stufige Skala (1 = gar nicht gut,
 * 5 = sehr gut). Reine Selbstbeobachtung, keine Bewertung durch die App.
 */
export const CHECKIN_AREAS = [
  { key: 'energie', label: 'Energie', faces: ['😴', '🥱', '🙂', '😊', '⚡'] },
  { key: 'schlaf', label: 'Schlaf', faces: ['😣', '😕', '😐', '🙂', '😌'] },
  { key: 'bauch', label: 'Bauchgefühl', faces: ['😖', '😕', '😐', '🙂', '😊'] },
  { key: 'stimmung', label: 'Stimmung', faces: ['😞', '😕', '😐', '🙂', '😄'] },
];

/** Durchschnitt der ausgefüllten Bereiche eines Tages (1–5) oder null. */
export function dayAverage(day) {
  const vals = CHECKIN_AREAS.map(a => day?.[a.key]).filter(v => typeof v === 'number');
  if (!vals.length) return null;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

export function isComplete(day) {
  return CHECKIN_AREAS.every(a => typeof day?.[a.key] === 'number');
}
