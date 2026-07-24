/**
 * weeklyReview.js
 *
 * Reine Domain-Logik für den Wochenrückblick-Screen (Block E): fasst
 * Bewegung, Ernährung und Fasten der letzten 7 Tage zusammen. Nimmt fertige
 * Daten aus den jeweiligen Repos entgegen (keine eigenen Storage-Zugriffe),
 * damit die Logik unabhängig testbar bleibt.
 */

/**
 * @param {Array} activityDays   activityRepo.getLast7Days()
 * @param {Array} nutritionDays  nutritionRepo.getLast7DaysTotals()
 * @param {object} fastingData   fastingRepo.get()
 */
export function buildWeeklyReview(activityDays, nutritionDays, fastingData) {
  const totalSteps = activityDays.reduce((s, d) => s + d.steps, 0);
  const activeDays = activityDays.filter(d => d.steps > 0 || d.activities.length > 0).length;
  const totalWorkoutCalories = activityDays.reduce((s, d) => s + d.totalCalories, 0);
  const totalWorkouts = activityDays.reduce((s, d) => s + d.activities.length, 0);

  const loggedNutritionDays = nutritionDays.filter(d => d.kcal > 0);
  const avgKcal = loggedNutritionDays.length
    ? Math.round(loggedNutritionDays.reduce((s, d) => s + d.kcal, 0) / loggedNutritionDays.length)
    : 0;

  const weekAgo = nutritionDays[0]?.date;
  const fastingSessionsThisWeek = (fastingData.log || []).filter(entry => entry.date >= weekAgo);
  const completedFasts = fastingSessionsThisWeek.filter(e => e.completed).length;
  const avgFastMinutes = fastingSessionsThisWeek.length
    ? Math.round(fastingSessionsThisWeek.reduce((s, e) => s + (e.duration || 0), 0) / fastingSessionsThisWeek.length)
    : 0;

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
    },
    fasting: {
      sessions: fastingSessionsThisWeek.length,
      completed: completedFasts,
      avgFastMinutes,
      streak: fastingData.streak || 0,
    },
  };
}
