import { activityRepo } from '../../infra/db/repositories/activityRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { buildWeeklyReview } from '../../domain/weeklyReview.js';
import { navigate } from '../../router.js';

export function renderWeeklyReview(container) {
  const activityDays = activityRepo.getLast7Days();
  const nutritionDays = nutritionRepo.getLast7DaysTotals();
  const fastingData = fastingRepo.get();
  const review = buildWeeklyReview(activityDays, nutritionDays, fastingData);

  container.innerHTML = `<div class="screen weeklyreview-screen">
    <div class="screen-header"><h1 class="screen-title">🗓️ Wochenrückblick</h1></div>
    <p style="font-size:12px;color:var(--text-secondary);padding:0 16px 8px">Die letzten 7 Tage auf einen Blick.</p>

    <div class="activity-section">
      <h3>🏃 Bewegung</h3>
      <div class="review-stat-grid">
        ${stat(review.movement.totalSteps.toLocaleString('de-DE'), 'Schritte gesamt')}
        ${stat(review.movement.activeDays, 'aktive Tage')}
        ${stat(review.movement.totalWorkouts, 'Workouts')}
        ${stat(`${review.movement.totalWorkoutCalories} kcal`, 'verbrannt (Sport)')}
      </div>
    </div>

    <div class="activity-section">
      <h3>🥗 Ernährung</h3>
      <div class="review-stat-grid">
        ${stat(review.nutrition.loggedDays + ' / 7', 'Tage geloggt')}
        ${stat(review.nutrition.avgKcal ? `${review.nutrition.avgKcal} kcal` : '–', 'Ø pro geloggtem Tag')}
      </div>
      ${review.nutrition.loggedDays === 0 ? '<p style="font-size:12px;color:var(--text-secondary);margin-top:6px">Noch keine Einträge diese Woche im Ernährungstagebuch.</p>' : ''}
    </div>

    <div class="activity-section">
      <h3>⏱️ Fasten</h3>
      <div class="review-stat-grid">
        ${stat(review.fasting.sessions, 'Sessions diese Woche')}
        ${stat(review.fasting.completed, 'abgeschlossen')}
        ${stat(review.fasting.avgFastMinutes ? formatMinutes(review.fasting.avgFastMinutes) : '–', 'Ø Dauer')}
        ${stat(`🔥 ${review.fasting.streak}`, 'Tage Streak')}
      </div>
    </div>

    <div class="activity-section" style="text-align:center">
      <button class="btn-secondary" id="btn-back-tools">← Zurück zu den Tools</button>
    </div>
  </div>`;

  container.querySelector('#btn-back-tools').addEventListener('click', () => navigate('tools'));
}

function stat(value, label) {
  return `<div class="review-stat">
    <div class="review-stat-value">${value}</div>
    <div class="review-stat-label">${label}</div>
  </div>`;
}

function formatMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} Std. ${m} Min.` : `${m} Min.`;
}
