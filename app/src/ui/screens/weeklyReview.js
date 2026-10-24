import { state } from '../../appState.js';
import { activityRepo } from '../../infra/db/repositories/activityRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { buildWeeklyReview, buildWeekFocus, checkinWeekAverage, FREE_INTAKE_KEYS } from '../../domain/weeklyReview.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { checkinRepo } from '../../infra/db/repositories/checkinRepo.js';
import { getProteinRefRange } from '../../domain/energyNeeds.js';
import { defaultProteinRef, vitaminDNote } from '../../domain/coreNutrients.js';
import { personalPool, recipeForNutrient } from '../../domain/dailyPicks.js';
import { quickFoodsFor, QUICK_TIPS } from '../../domain/quickFoods.js';
import { findPatterns, PATTERN_NOTE, MIN_CHECKIN_DAYS } from '../../domain/checkinPatterns.js';
import { collectPatternDays } from '../../infra/data/patternData.js';
import { recipePictureHtml } from '../components/recipeArt.js';
import { escapeHtml, fmtNum } from '../components/recipeFormat.js';
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
  // Premium-Sperre: Wochenrückblick ist komplett Premium, nur Teaser.
  if (!entitlements.isPremium()) {
    container.innerHTML = `<div class="w-screen weeklyreview-screen">
      <button class="w-link" id="btn-back-tools-gate" type="button">← Mehr</button>
      <h1 class="w-h1" style="margin-top:12px">Wochenrückblick</h1>
      <p class="w-sub">Jeden Montag: Was letzte Woche los war und worauf du in der neuen Woche achten kannst – mit passenden Rezepten, deinem Befinden und persönlichen Mustern.</p>
      <div class="analysis-upsell-card" style="margin-top:16px">
        <p>Der Wochenrückblick ist Teil von Premium.</p>
        <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-weekly-gate">Premium ansehen</button>
      </div>
    </div>`;
    container.querySelector('#btn-upgrade-weekly-gate').addEventListener('click', () => navigate('premium'));
    container.querySelector('#btn-back-tools-gate').addEventListener('click', () => navigate('tools'));
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
  const recipes = state.get('recipes') || [];
  const today = new Date().toISOString().slice(0, 10);
  const diet = mealPlanRepo.get()?.category || null;
  const pool = personalPool(recipes, diet, profile.intolerances || []);

  // Rückblick auf die zuletzt ABGESCHLOSSENE Kalenderwoche (Montag–Sonntag)
  const thisMonday = mondayOf(new Date());
  const lastWeekMonday = previousMonday(thisMonday);
  const weekTotals = nutritionRepo.getTotalsForWeek(lastWeekMonday);
  const weightHistory = measurementRepo.getByBiomarker('gewicht');
  const weightEntry = weightHistory[weightHistory.length - 1] || null;
  const proteinRange = weightEntry ? getProteinRefRange(weightEntry.value, profile.activityLevel, profile.ageGroup === '70+') : null;
  const proteinRef = proteinRange ? proteinRange.min : defaultProteinRef(profile.sex);
  const week = buildWeekFocus(weekTotals, dgeRef, proteinRef);
  const weekDates = weekTotals.map(d => d.date);
  const checkins = checkinRepo.getAll();
  const mood = checkinWeekAverage(weekDates.map(d => checkins[d] || {}));
  const steps = weekDates.reduce((sum, d) => sum + (activityRepo.getDay(d)?.steps || 0), 0);
  const patterns = findPatterns(collectPatternDays(60));

  // Wer den Rückblick öffnet, hat den Montags-Hinweis gesehen.
  if (profile.lastWeeklyRecapShown !== thisMonday) profileRepo.save({ lastWeeklyRecapShown: thisMonday });

  const availableKeys = isPremium ? Object.keys(dgeRef) : FREE_INTAKE_KEYS;
  if (!_selectedIntakeKey || !availableKeys.includes(_selectedIntakeKey)) {
    _selectedIntakeKey = availableKeys[0];
  }

  const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' });
  container.innerHTML = `<div class="w-screen weeklyreview-screen">
    <button class="w-link" id="btn-back-tools" type="button">← Mehr</button>
    <h1 class="w-h1" style="margin-top:12px">Wochenrückblick</h1>
    <p class="w-sub">Deine Woche vom ${fmtDate(weekDates[0])} bis ${fmtDate(weekDates[6])}</p>

    ${renderWeekSummary(week, mood, steps)}
    ${renderFocus(week, pool, diet, today)}
    ${renderPatterns(patterns)}

    <h2 class="w-group-title" style="margin-top:28px">Die letzten 7 Tage im Detail</h2>
    <div class="activity-section">
      <h3>Bewegung</h3>
      <div class="review-stat-grid">
        ${stat(review.movement.totalSteps.toLocaleString('de-DE'), 'Schritte gesamt')}
        ${stat(review.movement.activeDays, 'aktive Tage')}
        ${stat(review.movement.totalWorkouts, 'Trainingseinheiten')}
        ${stat(`${review.movement.totalWorkoutCalories} kcal`, 'verbraucht beim Sport')}
      </div>
    </div>

    <div class="activity-section">
      <h3>Ernährung</h3>
      <div class="review-stat-grid">
        ${stat(review.nutrition.loggedDays + ' / 7', 'Tage mit Einträgen')}
        ${stat(review.nutrition.avgKcal ? `${review.nutrition.avgKcal} kcal` : '–', 'Ø pro Tag mit Einträgen')}
      </div>
      ${review.nutrition.loggedDays === 0 ? '<p class="w-small">Noch keine Einträge in den letzten 7 Tagen.</p>' : ''}

      ${review.nutrition.loggedDays > 0 ? `
      <div class="macro-mirror">
        <p class="macro-mirror-hint">Im Schnitt – als Spiegel, nicht als Ziel. Es geht um ein Gefühl für das, was du isst, nicht darum, eine Zahl zu treffen.</p>
        <div class="review-stat-grid">
          ${stat(`${fmtNum(review.nutrition.avgProtein)} g`, 'Ø Eiweiß')}
          ${stat(`${fmtNum(review.nutrition.avgCarbs)} g`, 'Ø Kohlenhydrate')}
          ${stat(`${fmtNum(review.nutrition.avgFat)} g`, 'Ø Fett')}
        </div>
      </div>` : ''}

      ${renderWeekComparison(review.nutritionTrend)}
    </div>

    ${renderNutritionHistorySection(review.nutritionTrend, dgeRef, availableKeys, isPremium)}

    <div class="activity-section">
      <h3>Fasten</h3>
      <div class="review-stat-grid">
        ${stat(review.fasting.sessions, 'Fastenzeiten')}
        ${stat(review.fasting.completed, 'geschafft')}
        ${stat(review.fasting.avgFastMinutes ? formatMinutes(review.fasting.avgFastMinutes) : '–', 'Ø Dauer')}
        ${stat(review.fasting.streak, 'Tage in Folge')}
      </div>
    </div>
  </div>`;

  if (review.nutritionTrend) {
    drawWeeklyMacroChart(review.nutritionTrend.weeks);
    drawWeeklyMicroChart(review.nutritionTrend.weeks, _selectedIntakeKey, dgeRef[_selectedIntakeKey]);
  }

  container.querySelector('#btn-back-tools').addEventListener('click', () => navigate('tools'));
  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => {
    state.set('currentRecipeId', b.dataset.open);
    state.set('recipeBackTo', 'weekly_review');
    navigate('recipe');
  }));
  container.querySelector('#weekly-intake-select')?.addEventListener('change', e => {
    _selectedIntakeKey = e.target.value;
    renderWeeklyReview(container);
  });
  container.querySelector('#btn-upgrade-weekly')?.addEventListener('click', () => navigate('premium'));
}

function renderWeekSummary(week, mood, steps) {
  if (!week.loggedDays) {
    return `<section class="w-block"><div class="w-block-title">So war deine Woche</div>
      <div class="w-card w-muted">Letzte Woche stand nichts im Tagebuch. Trag diese Woche ein, was du isst – nächsten Montag siehst du hier deinen Rückblick.</div></section>`;
  }
  const moodItems = [['energie', 'Energie'], ['schlaf', 'Schlaf'], ['bauch', 'Bauchgefühl']]
    .filter(([k]) => mood[k] != null).map(([k, l]) => `<span>${l} <b>${fmtNum(mood[k])} von 5</b></span>`);
  return `<section class="w-block"><div class="w-block-title">So war deine Woche</div>
    <div class="w-card">
      <div class="w-body-row"><span>Tage mit Einträgen <b>${week.loggedDays} von 7</b></span>${steps ? `<span>Schritte <b>${steps.toLocaleString('de-DE')}</b></span>` : ''}</div>
      ${moodItems.length ? `<div class="w-body-row" style="margin-top:8px">${moodItems.join('')}</div>` : ''}
      <div class="w-core">${week.core.map(c => `<div class="${c.ok ? 'ok' : c.key === 'vit_d' ? 'sun' : 'more'}"><b>${c.label}</b><small>Ø ${fmtNum(c.amount)} von ${fmtNum(c.ref)} ${c.unit}</small></div>`).join('')}</div>
      <p class="w-small">Durchschnitt pro Tag mit Einträgen.</p>
    </div></section>`;
}

/**
 * "Worauf du diese Woche achten kannst": höchstens 3 Nährstoffe mit je einem
 * Rezept der Saison und Lebensmitteln für zwischendurch. Allgemeine Hinweise,
 * keine individuelle Therapieempfehlung, keine Mengenvorgaben.
 */
function renderFocus(week, pool, diet, today) {
  if (!week.loggedDays) return '';
  const items = week.focus.map(f => {
    const recipe = recipeForNutrient(pool, f.key, today);
    const foods = quickFoodsFor(f.key, diet, today);
    return `<div class="w-card" style="margin-bottom:10px">
      <b>${f.label}</b>
      ${recipe ? `<button type="button" class="w-hint" data-open="${recipe.id}">
        <span class="w-thumb">${recipePictureHtml(recipe)}</span>
        <p><b>${escapeHtml(recipe.title)}</b>Ansehen und in den Wochenplan legen</p>
      </button>` : ''}
      ${foods.length ? `<p class="w-small">Oder zwischendurch: ${foods.map(x => escapeHtml(x.label)).join(', ')}.${QUICK_TIPS[f.key] ? ` ${QUICK_TIPS[f.key]}` : ''}</p>` : ''}
    </div>`;
  }).join('');
  return `<section class="w-block"><div class="w-block-title">Worauf du diese Woche achten kannst</div>
    ${week.focus.length ? items : '<div class="w-card w-muted">Letzte Woche war alles gut dabei – im grünen Bereich. Schön!</div>'}
    ${week.vitDLow ? `<p class="w-small">${vitaminDNote()}</p>` : ''}
    <p class="w-small">Allgemeine Hinweise, keine individuelle Therapieempfehlung.</p>
  </section>`;
}

function renderPatterns(result) {
  let body;
  if (!result.ready) {
    body = `<div class="w-card w-muted">Ab ${MIN_CHECKIN_DAYS} Tagen mit „Wie geht's dir heute?“ zeigen wir dir hier, was dir auffallen könnte – zum Beispiel, ob du nach aktiven Tagen besser schläfst. Bisher: ${result.checkinDays} ${result.checkinDays === 1 ? 'Tag' : 'Tage'}.</div>`;
  } else if (!result.patterns.length) {
    body = `<div class="w-card w-muted">Bisher keine deutlichen Zusammenhänge in deinen Einträgen.</div>`;
  } else {
    body = `<div class="w-card w-focus">${result.patterns.map(p => `<p>${p.text}</p>`).join('')}</div>`;
  }
  return `<section class="w-block" id="patterns"><div class="w-block-title">Was dir auffallen könnte</div>
    ${body}
    <p class="w-small">${PATTERN_NOTE}</p>
  </section>`;
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
    <h3>Ernährungsverlauf (${NUM_WEEKS} Wochen)</h3>
    <p class="intake-chart-hint">Kalorien &amp; Makronährstoffe im Wochenschnitt – so lässt sich sehen, wie sich die Ernährungsweise über die Zeit verändert hat.</p>
    <div class="chart-container"><canvas id="weekly-macro-chart"></canvas></div>

    <select id="weekly-intake-select" class="form-control trend-select" style="margin-top:4px">${options}</select>
    <p class="intake-chart-hint">Zufuhr-Deckung des DGE-Tagesbedarfs im Wochenschnitt.</p>
    <div class="intake-chart-container"><canvas id="weekly-micro-chart"></canvas></div>

    ${!isPremium && lockedCount > 0 ? `
    <div class="analysis-upsell-card">
      <p>${lockedCount} weitere Vitamine und Mineralstoffe im Verlauf sind Teil von Premium.</p>
      <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-weekly">Premium ansehen</button>
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
        { label: 'kcal', data: weeks.map(w => w.avgKcal), borderColor: '#5E7D63', backgroundColor: 'rgba(94,125,99,0.1)', tension: 0.3, yAxisID: 'y' },
        { label: 'Eiweiß (g)', data: weeks.map(w => w.avgProtein), borderColor: '#C98F2A', tension: 0.3, yAxisID: 'y1' },
        { label: 'Kohlenhydrate (g)', data: weeks.map(w => w.avgCarbs), borderColor: '#8A968D', tension: 0.3, yAxisID: 'y1' },
        { label: 'Fett (g)', data: weeks.map(w => w.avgFat), borderColor: '#46634B', tension: 0.3, yAxisID: 'y1' },
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
  const barColors = values.map(v => v >= 80 ? '#5E7D63' : '#C98F2A');

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: `Zufuhr-Deckung ${intakeInfo.label}`, data: values, backgroundColor: barColors, borderRadius: 4 },
        { label: '100 % Tagesbedarf', data: values.map(() => 100), type: 'line',
          borderColor: '#5E7D6388', borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
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
