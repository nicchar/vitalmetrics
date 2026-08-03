import { state } from '../../appState.js';
import { activityRepo } from '../../infra/db/repositories/activityRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { buildWeeklyReview, buildWeeklyRecommendations, FREE_INTAKE_KEYS } from '../../domain/weeklyReview.js';
import { getDGERef } from '../../domain/nutrition.js';
import { entitlements } from '../../domain/entitlements.js';
import { mondayOf, previousMonday } from '../../domain/dateUtils.js';
import { navigate } from '../../router.js';

const NUM_WEEKS = 12;

// Merkt sich den zuletzt gewählten Mikronährstoff im Verlaufs-Dropdown über
// Re-Renders hinweg (z.B. nach Wechsel des Dropdowns), analog zum
// Picker-Zustand in cycle.js. Zurückgesetzt beim Verlassen des Screens ist
// hier bewusst egal - ein neuer Screen-Aufruf mit vit_d als Default ist unkritisch.
let _selectedIntakeKey = null;

export function renderWeeklyReview(container) {
  // Premium-Sperre (25.07.2026): Wochenrückblick ist komplett Premium,
  // gleiches Muster wie skinVitality.js - kein Teil-Zugriff, nur Teaser.
  // Die 5-vs-15-Mikronährstoff-Logik unten bleibt unangetastet (harmlos für
  // Premium-Nutzer, für Free-Nutzer schlicht nicht mehr erreichbar).
  if (!entitlements.isPremium()) {
    container.innerHTML = `<div class="screen weeklyreview-screen">
      <div class="screen-header">
        <h1 class="screen-title">🗓️ Wochenrückblick</h1>
      </div>
      <p class="hint-text" style="padding:0 16px">
        Bewegung, Ernährung und Fasten der letzten 7 Tage auf einen Blick -
        inklusive 12-Wochen-Ernährungsverlauf, wie sich deine Ernährung
        wirklich verändert.
      </p>
      <div class="analysis-upsell-card" style="margin:16px">
        <p>🗓️ Der Wochenrückblick ist Teil von Premium.</p>
        <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-weekly-gate">⭐ Premium ansehen</button>
      </div>
    </div>`;
    container.querySelector('#btn-upgrade-weekly-gate').addEventListener('click', () => navigate('premium'));
    return;
  }

  const activityDays = activityRepo.getLast7Days();
  const nutritionDays = nutritionRepo.getLast7DaysTotals();
  const fastingData = fastingRepo.get();
  const weeklyTotals = nutritionRepo.getWeeklyTotals(NUM_WEEKS);
  const review = buildWeeklyReview(activityDays, nutritionDays, fastingData, weeklyTotals);

  const profile = profileRepo.get();
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const isPremium = entitlements.isPremium();

  // Automatischer Wochenrückblick (Feature-Wunsch 03.08.2026): konkrete
  // Empfehlungen für die zuletzt ABGESCHLOSSENE Kalenderwoche (Montag-Sonntag),
  // unabhängig davon, ob der Screen über den Dashboard-Banner oder manuell
  // über Tools erreicht wurde - derselbe Rückblick ist so immer aktuell.
  const lastWeekMonday = previousMonday(mondayOf(new Date()));
  const catalog = state.get('catalog') || { biomarkers: [] };
  const weeklyRecap = buildWeeklyRecommendations(
    nutritionRepo.getTotalsForWeek(lastWeekMonday), dgeRef, catalog.biomarkers
  );
  const availableKeys = isPremium ? Object.keys(dgeRef) : FREE_INTAKE_KEYS;
  if (!_selectedIntakeKey || !availableKeys.includes(_selectedIntakeKey)) {
    _selectedIntakeKey = availableKeys[0];
  }

  container.innerHTML = `<div class="screen weeklyreview-screen">
    <div class="screen-header"><h1 class="screen-title">🗓️ Wochenrückblick</h1></div>
    <p style="font-size:12px;color:var(--text-secondary);padding:0 16px 8px">Die letzten 7 Tage auf einen Blick.</p>

    ${renderRecommendations(weeklyRecap)}

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

      ${review.nutrition.loggedDays > 0 ? `
      <div class="macro-mirror">
        <p class="macro-mirror-hint">Makronährstoffe im Schnitt – als Spiegel, nicht als Ziel. Es geht darum, ein Gefühl für das zu bekommen, was du isst, nicht darum, eine Zahl zu treffen.</p>
        <div class="review-stat-grid">
          ${stat(`${review.nutrition.avgProtein} g`, 'Ø Protein')}
          ${stat(`${review.nutrition.avgCarbs} g`, 'Ø Kohlenhydrate')}
          ${stat(`${review.nutrition.avgFat} g`, 'Ø Fett')}
        </div>
      </div>` : ''}

      ${renderWeekComparison(review.nutritionTrend)}
    </div>

    ${renderNutritionHistorySection(review.nutritionTrend, dgeRef, availableKeys, isPremium)}

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

  if (review.nutritionTrend) {
    drawWeeklyMacroChart(review.nutritionTrend.weeks);
    drawWeeklyMicroChart(review.nutritionTrend.weeks, _selectedIntakeKey, dgeRef[_selectedIntakeKey]);
  }

  container.querySelector('#btn-back-tools').addEventListener('click', () => navigate('tools'));
  container.querySelector('#weekly-intake-select')?.addEventListener('change', e => {
    _selectedIntakeKey = e.target.value;
    renderWeeklyReview(container);
  });
  container.querySelector('#btn-upgrade-weekly')?.addEventListener('click', () => navigate('premium'));
}

/**
 * Feature "Automatischer Wochenrückblick" (03.08.2026): konkrete, aber
 * undosierte Lebensmittel-Empfehlungen für die letzte Kalenderwoche (siehe
 * domain/weeklyReview.js buildWeeklyRecommendations()). Erscheint nur, wenn
 * in der letzten Woche überhaupt etwas im Ernährungstagebuch stand - sonst
 * gäbe es nichts Verlässliches zu berichten (kein Rauschen durch fehlendes
 * Tracking, gleiches Prinzip wie getUnderCoveredTags() im Wochenplan).
 */
function renderRecommendations(recap) {
  if (!recap.loggedDays) return '';
  return `<div class="activity-section">
    <h3>📋 Deine Empfehlungen für die letzte Woche</h3>
    ${recap.recommendations.length ? `
      <p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px">Allgemeine Hinweise, keine individuelle Therapieempfehlung – bei anhaltend niedrigen Werten im Zweifel ärztlich abklären lassen.</p>
      ${recap.recommendations.map(r => `
        <div class="macro-mirror" style="margin-bottom:8px">
          <p class="macro-mirror-hint" style="margin:0"><strong>${r.label}</strong>: Zufuhr letzte Woche niedriger als empfohlen${r.foods.length ? ` – gute Quellen: ${r.foods.join(', ')}.` : '.'}</p>
        </div>`).join('')}
    ` : `<p style="font-size:13px;color:var(--text-secondary)">Deine Zufuhr lag letzte Woche bei allen getrackten Nährstoffen im grünen Bereich. 🎉</p>`}
  </div>`;
}

function renderWeekComparison(trend) {
  if (!trend) return '';
  if (!trend.hasPreviousData) {
    return `<p style="font-size:12px;color:var(--text-secondary);margin-top:10px">Vorwochen-Vergleich sobald in der Woche davor Einträge vorliegen.</p>`;
  }
  return `<div class="macro-mirror">
    <p class="macro-mirror-hint">Diese Woche im Vergleich zur Vorwoche (Ø pro geloggtem Tag) – als Orientierung, nicht als Bewertung.</p>
    <div class="review-stat-grid">
      ${stat(deltaLabel(trend.deltaKcalPct), 'kcal')}
      ${stat(deltaLabel(trend.deltaProteinPct), 'Protein')}
      ${stat(deltaLabel(trend.deltaCarbsPct), 'Kohlenhydrate')}
      ${stat(deltaLabel(trend.deltaFatPct), 'Fett')}
    </div>
  </div>`;
}

function renderNutritionHistorySection(trend, dgeRef, availableKeys, isPremium) {
  if (!trend) return '';
  const options = availableKeys.map(key => `<option value="${key}" ${key === _selectedIntakeKey ? 'selected' : ''}>${dgeRef[key].label}</option>`).join('');
  const lockedCount = Object.keys(dgeRef).length - availableKeys.length;

  return `<div class="info-section">
    <h3>📈 Ernährungsverlauf (${NUM_WEEKS} Wochen)</h3>
    <p class="intake-chart-hint">Kalorien &amp; Makronährstoffe im Wochenschnitt – so lässt sich sehen, wie sich die Ernährungsweise über die Zeit verändert hat.</p>
    <div class="chart-container"><canvas id="weekly-macro-chart"></canvas></div>

    <select id="weekly-intake-select" class="form-control trend-select" style="margin-top:4px">${options}</select>
    <p class="intake-chart-hint">Zufuhr-Deckung des DGE-Tagesbedarfs im Wochenschnitt.</p>
    <div class="intake-chart-container"><canvas id="weekly-micro-chart"></canvas></div>

    ${!isPremium && lockedCount > 0 ? `
    <div class="analysis-upsell-card">
      <p>🔒 ${lockedCount} weitere Mikronährstoffe im Verlauf sind Teil von Premium.</p>
      <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-weekly">⭐ Premium ansehen</button>
    </div>` : ''}
  </div>`;
}

function deltaLabel(pct) {
  if (pct === null || pct === undefined) return '–';
  if (pct === 0) return '± 0%';
  return pct > 0 ? `↑ ${pct}%` : `↓ ${Math.abs(pct)}%`;
}

function drawWeeklyMacroChart(weeks) {
  const canvas = document.getElementById('weekly-macro-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  if (canvas._chartInstance) canvas._chartInstance.destroy();

  const labels = weekLabels(weeks);
  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'kcal', data: weeks.map(w => w.avgKcal), borderColor: '#1a7a6e', backgroundColor: 'rgba(26,122,110,0.1)', tension: 0.3, yAxisID: 'y' },
        { label: 'Protein (g)', data: weeks.map(w => w.avgProtein), borderColor: '#f59e0b', tension: 0.3, yAxisID: 'y1' },
        { label: 'Kohlenhydrate (g)', data: weeks.map(w => w.avgCarbs), borderColor: '#3b82f6', tension: 0.3, yAxisID: 'y1' },
        { label: 'Fett (g)', data: weeks.map(w => w.avgFat), borderColor: '#ef4444', tension: 0.3, yAxisID: 'y1' },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
      scales: {
        y: { position: 'left', title: { display: true, text: 'kcal' } },
        y1: { position: 'right', title: { display: true, text: 'g' }, grid: { drawOnChartArea: false } },
      },
    },
  });
  canvas._chartInstance = chart;
}

function drawWeeklyMicroChart(weeks, intakeKey, intakeInfo) {
  const canvas = document.getElementById('weekly-micro-chart');
  if (!canvas || typeof Chart === 'undefined' || !intakeInfo) return;
  if (canvas._chartInstance) canvas._chartInstance.destroy();

  const labels = weekLabels(weeks);
  const values = weeks.map(w => Math.min(150, w[intakeKey] && intakeInfo.ref ? Math.round((w[intakeKey] / intakeInfo.ref) * 100) : 0));
  const barColors = values.map(v => v >= 100 ? '#43A047' : v >= 60 ? '#f59e0b' : '#ef4444');

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: `Zufuhr-Deckung ${intakeInfo.label}`, data: values, backgroundColor: barColors, borderRadius: 4 },
        { label: '100 % Tagesbedarf', data: values.map(() => 100), type: 'line',
          borderColor: '#1a7a6e88', borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.dataset.type === 'line' ? '100 % Tagesbedarf' : `${ctx.parsed.y}%` } },
      },
      scales: { y: { min: 0, max: 150 } },
    },
  });
  canvas._chartInstance = chart;
}

function weekLabels(weeks) {
  return weeks.map((w, i) => (i === weeks.length - 1 ? 'diese Woche' : `vor ${weeks.length - 1 - i} Wo.`));
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
