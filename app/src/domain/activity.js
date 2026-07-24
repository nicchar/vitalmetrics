/**
 * activity.js
 *
 * Sportarten-Katalog + Kalorienberechnung für den Bewegungs-Tracker.
 * Portiert aus dem Monolithen (VitalMetrics.html).
 */

export const SPORTS = [
  { id: 'laufen',        name: 'Laufen',             emoji: '🏃', met: 8.0 },
  { id: 'spazieren',     name: 'Spazieren',          emoji: '🚶', met: 3.8 },
  { id: 'radfahren',     name: 'Radfahren',          emoji: '🚴', met: 6.0 },
  { id: 'schwimmen',     name: 'Schwimmen',          emoji: '🏊', met: 6.0 },
  { id: 'yoga',          name: 'Yoga',               emoji: '🧘', met: 2.5 },
  { id: 'krafttraining', name: 'Krafttraining',      emoji: '💪', met: 3.5 },
  { id: 'fussball',      name: 'Fußball',            emoji: '⚽', met: 7.0 },
  { id: 'tennis',        name: 'Tennis',             emoji: '🎾', met: 7.3 },
  { id: 'fitness',       name: 'Fitness/Aerobic',    emoji: '🏋️', met: 6.0 },
  { id: 'boxen',         name: 'Boxen',              emoji: '🥊', met: 7.8 },
  { id: 'skifahren',     name: 'Skifahren',          emoji: '⛷️', met: 6.8 },
  { id: 'pilates',       name: 'Pilates',            emoji: '🤸', met: 3.0 },
  { id: 'klettern',      name: 'Klettern',           emoji: '🧗', met: 8.0 },
  { id: 'badminton',     name: 'Badminton',          emoji: '🏸', met: 4.5 },
  { id: 'rudern',        name: 'Rudern',             emoji: '🚣', met: 6.0 },
  { id: 'tanzen',        name: 'Tanzen',             emoji: '💃', met: 4.5 },
  { id: 'basketball',    name: 'Basketball',         emoji: '🏀', met: 6.5 },
  { id: 'wandern',       name: 'Wandern',            emoji: '🥾', met: 5.5 },
  { id: 'kampfsport',    name: 'Kampfsport',         emoji: '🥋', met: 10.0 },
  { id: 'wassergymnastik', name: 'Wassergymnastik',  emoji: '🤽', met: 4.0 },
];

/** Kalorienbrechnung: MET × Gewicht(kg) × Zeit(h) */
export function calcCalories(met, minutes, weightKg) {
  const w = weightKg || 70;
  return Math.round(met * w * (minutes / 60));
}

/**
 * Schritte → Kalorien: ca. 0.04 kcal/Schritt bei 70 kg, gewichtsbereinigt
 * Quelle: ACSM / Tudor-Locke et al. — Durchschnittswert ca. 0.57 kcal/Schritt pro 100 kg
 */
export function calcStepCalories(steps, weightKg) {
  return Math.round(steps * 0.0004 * (weightKg || 70));
}
