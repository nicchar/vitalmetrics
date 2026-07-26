/**
 * weeklyReview.js
 *
 * Reine Domain-Logik für den Wochenrückblick-Screen (Block E): fasst
 * Bewegung, Ernährung und Fasten der letzten 7 Tage zusammen. Nimmt fertige
 * Daten aus den jeweiligen Repos entgegen (keine eigenen Storage-Zugriffe),
 * damit die Logik unabhängig testbar bleibt.
 */

/**
 * Mikronährstoffe, die im Free-Tier des Mehrwochen-Ernährungsverlaufs
 * sichtbar sind (Entscheidung 25.07.2026: "5 wichtigste" gratis, alle 15
 * mit Premium). Bewusst als eigene, benannte Konstante statt Zahl "5" im
 * Code, damit die Auswahl an einer Stelle dokumentiert und änderbar ist.
 */
export const FREE_INTAKE_KEYS = ['vit_d', 'eisen', 'mag', 'zink', 'cal'];

/**
 * @param {Array} activityDays   activityRepo.getLast7Days()
 * @param {Array} nutritionDays  nutritionRepo.getLast7DaysTotals()
 * @param {object} fastingData   fastingRepo.get()
 * @param {Array|null} weeklyTotals  nutritionRepo.getWeeklyTotals(numWeeks), aufsteigend
 *   sortiert (ältester Block zuerst, aktuelle Woche zuletzt). Optional, damit
 *   bestehende Aufrufer/Tests ohne den Mehrwochen-Verlauf weiterlaufen.
 */
export function buildWeeklyReview(activityDays, nutritionDays, fastingData, weeklyTotals = null) {
  const totalSteps = activityDays.reduce((s, d) => s + d.steps, 0);
  const activeDays = activityDays.filter(d => d.steps > 0 || d.activities.length > 0).length;
  const totalWorkoutCalories = activityDays.reduce((s, d) => s + d.totalCalories, 0);
  const totalWorkouts = activityDays.reduce((s, d) => s + d.activities.length, 0);

  const loggedNutritionDays = nutritionDays.filter(d => d.kcal > 0);
  const avgKcal = loggedNutritionDays.length
    ? Math.round(loggedNutritionDays.reduce((s, d) => s + d.kcal, 0) / loggedNutritionDays.length)
    : 0;

  // Block F Phase 1 (Makro-Info-Spiegel): rein informativer Durchschnitt,
  // bewusst OHNE Tagesziel/Prozent-Erreichung - siehe Hinweistext im Screen.
  // Aus derselben, ohnehin schon in getDayTotals() berechneten Grundlage wie
  // avgKcal, kein neuer Tracking-Mechanismus.
  const avgMacro = key => loggedNutritionDays.length
    ? Math.round((loggedNutritionDays.reduce((s, d) => s + (d[key] || 0), 0) / loggedNutritionDays.length) * 10) / 10
    : 0;
  const avgProtein = avgMacro('protein');
  const avgFat = avgMacro('fat');
  const avgCarbs = avgMacro('carbs');

  const weekAgo = nutritionDays[0]?.date;
  const fastingSessionsThisWeek = (fastingData.log || []).filter(entry => entry.date >= weekAgo);
  const completedFasts = fastingSessionsThisWeek.filter(e => e.completed).length;
  const avgFastMinutes = fastingSessionsThisWeek.length
    ? Math.round(fastingSessionsThisWeek.reduce((s, e) => s + (e.duration || 0), 0) / fastingSessionsThisWeek.length)
    : 0;

  // Mehrwochen-Ernährungsverlauf (Premium-Idee 25.07.2026): Vorwochenvergleich
  // + die volle Wochenreihe fürs Chart. Bewusst nur ein Vergleich (aktuelle
  // vs. direkt vorherige Woche), keine Bewertung "besser/schlechter" - der
  // Screen zeigt nur die Richtung/Größe der Veränderung, wie schon der
  // bestehende Makro-Spiegel ("Spiegel, nicht Ziel").
  let nutritionTrend = null;
  if (Array.isArray(weeklyTotals) && weeklyTotals.length >= 2) {
    const current = weeklyTotals[weeklyTotals.length - 1];
    const previous = weeklyTotals[weeklyTotals.length - 2];
    const pctChange = (curr, prev) => (prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null);
    nutritionTrend = {
      current,
      previous,
      hasPreviousData: previous.loggedDays > 0,
      deltaKcalPct: pctChange(current.avgKcal, previous.avgKcal),
      deltaProteinPct: pctChange(current.avgProtein, previous.avgProtein),
      deltaFatPct: pctChange(current.avgFat, previous.avgFat),
      deltaCarbsPct: pctChange(current.avgCarbs, previous.avgCarbs),
      weeks: weeklyTotals,
    };
  }

  return {
    movement: {
      totalSteps,
      activeDays,
      totalWorkouts,
      totalWorkoutCalories,
    },
    nutrition: {
      loggedDays: loggedNutritionDays.length,
      avgKcal,
      avgProtein,
      avgFat,
      avgCarbs,
    },
    fasting: {
      sessions: fastingSessionsThisWeek.length,
      completed: completedFasts,
      avgFastMinutes,
      streak: fastingData.streak || 0,
    },
    nutritionTrend,
  };
}
