/**
 * dateUtils.js
 *
 * Gemeinsame Kalenderwochen-Hilfsfunktion (Montag als Wochenstart). Vorher
 * nur privat in ui/screens/mealPlan.js dupliziert - jetzt hier zentral, weil
 * der automatische Wochenrückblick (domain/weeklyReview.js, Feature-Wunsch
 * 03.08.2026: "am Anfang der nächsten Woche eine Auswertung") exakt dieselbe
 * Wochendefinition braucht wie der Wochenplan, damit beide Features von
 * derselben Kalenderwoche sprechen.
 */

/** Montag der Kalenderwoche von `date` (als ISO-Datumsstring 'YYYY-MM-DD'). */
export function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = So
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

/** Montag der Kalenderwoche VOR der Woche von `mondayIso`. */
export function previousMonday(mondayIso) {
  const d = new Date(mondayIso);
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}
