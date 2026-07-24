/**
 * glucose.js
 *
 * Referenzdaten + Musterauswertung für den Blutzucker-Tagesgang-Tracker.
 * Portiert aus dem Monolithen (VitalMetrics.html).
 */

export const GLUCOSE_SLOTS = [
  { key: 'nuechtern',       icon: '🌙', label: 'Nüchternwert',     hint: 'Morgens vor dem Frühstück', normal: [70, 99],  warning: [100, 125] },
  { key: 'nachFruehstueck', icon: '☀️', label: 'Nach Frühstück',   hint: '2h nach der Mahlzeit',       normal: [0, 139],  warning: [140, 199] },
  { key: 'nachMittagessen', icon: '🌤️', label: 'Nach Mittagessen', hint: '2h nach der Mahlzeit',       normal: [0, 139],  warning: [140, 199] },
  { key: 'abends',          icon: '🌇', label: 'Abendwert',        hint: 'Vor dem Schlafen',           normal: [70, 109], warning: [110, 139] },
];

/**
 * Bewertet den Tagesgang eines einzelnen Tages.
 * @param {Object} dayEntry z.B. { nuechtern: 95, nachFruehstueck: 130, ... }
 */
export function assessGlucosePattern(dayEntry) {
  if (!dayEntry) return null;
  const vals = Object.values(dayEntry).filter(v => v > 0);
  if (vals.length < 2) return null;
  const nuechtern = dayEntry.nuechtern;
  const postMeals = [dayEntry.nachFruehstueck, dayEntry.nachMittagessen].filter(Boolean);
  const avgPost = postMeals.length ? postMeals.reduce((a, b) => a + b, 0) / postMeals.length : null;
  if (nuechtern >= 126 || (avgPost && avgPost >= 200)) {
    return { level: 'alert', title: '⚠️ Auffälliges Muster', text: 'Deine Werte liegen wiederholt über den Normalwerten. Bitte besprich das zeitnah mit deinem Arzt — das kann auf Diabetes hinweisen.' };
  }
  if (nuechtern >= 100 || (avgPost && avgPost >= 140)) {
    return { level: 'warning', title: '🟡 Grenzwertiger Bereich', text: 'Dein Nüchternwert oder dein Anstieg nach Mahlzeiten ist leicht erhöht. Das kann ein frühes Zeichen von Insulinresistenz sein. Bewegung nach Mahlzeiten und weniger raffinierte Kohlenhydrate helfen gezielt.' };
  }
  return { level: 'normal', title: '✅ Gutes Muster', text: 'Dein Tagesgang sieht normal aus. Dein Körper verarbeitet Glucose gut — weiter so mit ausgewogener Ernährung und Bewegung.' };
}
