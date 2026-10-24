/**
 * dashboard.js – Startseite "Heute" (WellANNI 2.2)
 *
 * Aufbau von oben nach unten:
 * 1. Begrüßung
 * 2. "Wie geht's dir heute?" – Check-in mit vier Bereichen (Energie, Schlaf,
 *    Bauchgefühl, Stimmung), 5-stufig, mit Wochenstreifen
 * 3. "Heute auf deinem Teller" – Kalorien, Makros und die 8 Kernwerte in
 *    freundlichen Worten statt Ampel-Prozenten, dazu EIN Rezeptvorschlag für
 *    den Kernwert mit der größten Lücke
 * 4. Wochenrückblick (Premium, nur montags-neu)
 * 5. Rezept des Tages
 * 6. Tipp des Tages (Saison-Tipp und Wildkraut des Monats im Wechsel)
 * 7. Körperwerte in einer Zeile + "Alle Werte ansehen"
 *
 * Die Detailkarten aller Vitalstoffe sind auf die Seite "Alle Werte"
 * (values.js) umgezogen. Bewusst ohne Ampelfarben, ohne Diät-Sprache:
 * Kalorien als "Orientierung, kein Ziel" (siehe energyNeeds.js).
 */
import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { hydrationRepo } from '../../infra/db/repositories/hydrationRepo.js';
import { checkinRepo } from '../../infra/db/repositories/checkinRepo.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { entitlements } from '../../domain/entitlements.js';
import { getSeasonalTip, getWildHerbTip, WILDHERB_SAFETY_NOTE } from '../../domain/seasonalTips.js';
import { calcTDEERange, getProteinRefRange, calcWHR, getWHRRefLabel, estimateAge } from '../../domain/energyNeeds.js';
import { mondayOf, previousMonday } from '../../domain/dateUtils.js';
import { buildWeeklyRecommendations } from '../../domain/weeklyReview.js';
import { CHECKIN_AREAS, dayAverage, isComplete } from '../../domain/checkin.js';
import { coreStatus, STATUS_TEXT, defaultProteinRef } from '../../domain/coreNutrients.js';
import { recipeOfTheDay, recipeForNutrient, personalPool } from '../../domain/dailyPicks.js';
import { navigate } from '../../router.js';
import { recipePictureHtml } from '../components/recipeArt.js';
import { totalMinutes, fmtNum, escapeHtml } from '../components/recipeFormat.js';

const WEEKDAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

function greeting(name, now = new Date()) {
  const h = now.getHours();
  const base = h < 11 ? 'Guten Morgen' : h < 17 ? 'Schön, dass du da bist' : 'Guten Abend';
  return name ? `${base}, ${escapeHtml(name)}` : base;
}

function openRecipe(id) {
  state.set('currentRecipeId', id);
  state.set('recipeBackTo', 'dashboard');
  navigate('recipe');
}

function renderCheckin(today) {
  const day = checkinRepo.getDay(today);
  const rows = CHECKIN_AREAS.map(a => `
    <div class="w-checkin-row"><b>${a.label}</b>
      <div class="w-pebbles" role="group" aria-label="${a.label}">${a.faces.map((face, i) =>
        `<button type="button" class="w-pebble" data-area="${a.key}" data-value="${i + 1}" aria-pressed="${day[a.key] === i + 1}" aria-label="${a.label}: ${i + 1} von 5">${face}</button>`).join('')}
      </div>
    </div>`).join('');
  const week = checkinRepo.getRecent(7).map(d => {
    const avg = dayAverage(d);
    const wd = WEEKDAY_SHORT[new Date(d.date + 'T12:00:00').getDay()];
    return avg == null
      ? `<div><i class="w-week-empty"></i>${wd}</div>`
      : `<div><i style="opacity:${(0.25 + (avg - 1) / 4 * 0.75).toFixed(2)}" title="${fmtNum(avg)} von 5"></i>${wd}</div>`;
  }).join('');
  return `<section class="w-block">
    <div class="w-block-title">Wie geht's dir heute?</div>
    <div class="w-card" id="checkin-card">
      ${rows}
      <p class="w-small" id="checkin-done" ${isComplete(day) ? '' : 'hidden'}>Danke dir! Hier unten siehst du, wie deine Woche bisher war.</p>
      <div class="w-week" aria-label="Deine letzten 7 Tage">${week}</div>
    </div>
  </section>`;
}

/**
 * "Heute auf deinem Teller" – Kalorien, alle drei Makros gemeinsam (Nicole:
 * Eiweiß nicht isoliert betrachten), Ballaststoffe und die 8 Kernwerte.
 */
function renderTeller({ dayTotals, tdee, core, hint }) {
  const hasEntries = (dayTotals.kcal || 0) > 0;
  const kcalRef = tdee
    ? `<p class="w-small" style="margin-top:2px">Orientierung: ca. ${tdee.min}–${tdee.max} kcal am Tag · grobe Schätzung, kein Ziel</p>`
    : '';
  const coreHtml = !hasEntries ? '' : core.map(c =>
    `<div class="${c.status === 'more' ? 'more' : 'ok'}"><b>${c.label}</b><small>${STATUS_TEXT[c.status]}</small></div>`).join('');
  const hintHtml = hint
    ? `<button type="button" class="w-hint" data-open="${hint.recipe.id}">
        <span class="w-thumb">${recipePictureHtml(hint.recipe)}</span>
        <p><b>Für mehr ${hint.label}</b>Wie wär's mit ${escapeHtml(hint.recipe.title)}?</p>
      </button>`
    : '';
  return `<section class="w-block" id="heute-card">
    <div class="w-block-title">Heute auf deinem Teller</div>
    <div class="w-card">
      ${hasEntries ? `
        <div class="w-kcal"><div><strong>${Math.round(dayTotals.kcal)}</strong> <span class="w-kcal-unit">kcal</span></div>
          <div class="w-macros">
            <span><b>${fmtNum(dayTotals.protein)} g</b> Eiweiß</span>
            <span><b>${fmtNum(dayTotals.carbs)} g</b> Kohlenhydrate</span>
            <span><b>${fmtNum(dayTotals.fat)} g</b> Fett</span>
            <span><b>${fmtNum(dayTotals.fiber || 0)} g</b> Ballaststoffe</span>
          </div>
        </div>
        ${kcalRef}` : `
        <p class="w-muted">Noch nichts eingetragen. Sobald du etwas einträgst, siehst du hier, was dein Teller schon geliefert hat – an Eiweiß, Ballaststoffen, Eisen, Calcium, Magnesium, Vitamin D, Folat und Vitamin B12.</p>`}
      ${coreHtml ? `<div class="w-core">${coreHtml}</div>` : ''}
      ${hintHtml}
      <div class="w-btn-row"><button type="button" class="w-btn w-btn-ghost" id="btn-heute-nutrition">Essen eintragen</button></div>
    </div>
  </section>`;
}

function renderBody({ weightEntry, waistEntry, hipEntry, whr, waterMl, profile }) {
  const items = [];
  if (weightEntry) items.push(`<span>Gewicht <b>${fmtNum(weightEntry.value)} kg</b></span>`);
  if (waistEntry) items.push(`<span>Taille <b>${fmtNum(waistEntry.value)} cm</b></span>`);
  if (hipEntry) items.push(`<span>Hüfte <b>${fmtNum(hipEntry.value)} cm</b></span>`);
  if (whr != null) items.push(`<span>Taille/Hüfte <b>${fmtNum(whr)}</b></span>`);
  if (waterMl > 0) items.push(`<span>Getrunken <b>${fmtNum(waterMl / 1000)} l</b></span>`);
  return `<section class="w-block">
    <div class="w-block-title">Dein Körper</div>
    <div class="w-card">
      ${items.length ? `<div class="w-body-row">${items.join('')}</div>` : '<p class="w-muted">Noch keine Körperwerte eingetragen.</p>'}
      ${whr != null ? `<p class="w-small">${getWHRRefLabel(profile.sex)} – rein informativ, keine automatische Bewertung durch die App.</p>` : ''}
      <div class="w-btn-row"><button type="button" class="w-btn w-btn-ghost" id="btn-heute-weight">Gewicht oder Maße eintragen</button></div>
    </div>
    <button type="button" class="w-outline-btn" id="btn-all-values">Alle Werte ansehen</button>
  </section>`;
}

export function renderDashboard(container) {
  const catalog = state.get('catalog');
  const recipes = state.get('recipes') || [];
  const profile = profileRepo.get();
  const isPremium = entitlements.isPremium();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const dayTotals = nutritionRepo.getDayTotals(today);

  // Kalorien-Orientierung und Eiweiß-Referenz brauchen das zuletzt
  // eingetragene Gewicht; ohne Gewicht keine Kalorien-Schätzung (kein
  // Rateergebnis auf Basis eines angenommenen Durchschnittsgewichts).
  const weightHistory = measurementRepo.getByBiomarker('gewicht');
  const weightEntry = weightHistory[weightHistory.length - 1] || null;
  const waistHistory = measurementRepo.getByBiomarker('taillenumfang');
  const waistEntry = waistHistory[waistHistory.length - 1] || null;
  const hipHistory = measurementRepo.getByBiomarker('hueftumfang');
  const hipEntry = hipHistory[hipHistory.length - 1] || null;
  const age = estimateAge(profile);
  const tdee = weightEntry
    ? calcTDEERange(weightEntry.value, profile.height, age, profile.sex, profile.activityLevel)
    : null;
  const proteinRange = weightEntry
    ? getProteinRefRange(weightEntry.value, profile.activityLevel, profile.ageGroup === '70+')
    : null;
  const whr = (waistEntry && hipEntry) ? calcWHR(waistEntry.value, hipEntry.value) : null;

  const core = coreStatus(dayTotals, dgeRef, proteinRange ? proteinRange.min : defaultProteinRef(profile.sex));

  // Rezepte passend zu Ernährungsform (aus dem Wochenplan) und Unverträglichkeiten
  const pool = personalPool(recipes, mealPlanRepo.get()?.category || null, profile.intolerances || []);
  const rdt = recipeOfTheDay(pool, today);

  // Ein einziger Vorschlag für die größte Lücke – nur, wenn schon etwas
  // eingetragen ist (sonst wäre "Lücke" nur fehlendes Tracking).
  let hint = null;
  const gaps = core.filter(c => c.status === 'more').sort((a, b) => a.share - b.share);
  for (const gap of gaps) {
    const recipe = recipeForNutrient(pool, gap.key, today, rdt?.id);
    if (recipe) { hint = { label: gap.label, recipe }; break; }
  }

  // Automatischer Wochenrückblick (Premium): dezenter Hinweis statt Pop-up,
  // sobald eine neue Kalenderwoche begonnen hat und letzte Woche etwas
  // eingetragen wurde. Bleibt, bis er angetippt wird.
  const thisMonday = mondayOf(now);
  let weeklyRecap = null;
  if (isPremium && profile.lastWeeklyRecapShown !== thisMonday) {
    const weekTotals = nutritionRepo.getTotalsForWeek(previousMonday(thisMonday));
    const recap = buildWeeklyRecommendations(weekTotals, dgeRef, catalog.biomarkers);
    if (recap.loggedDays > 0) weeklyRecap = recap;
  }
  let recapHtml = '';
  if (weeklyRecap) {
    const top = weeklyRecap.recommendations.slice(0, 2);
    recapHtml = `<section class="w-block"><button type="button" class="w-card w-tip" id="weekly-recap-banner" style="width:100%;text-align:left;color:inherit">
      <span class="w-tip-icon">🗓️</span>
      <p><b>Dein Wochenrückblick ist da</b><br>${top.length
        ? `Letzte Woche war weniger dabei von: ${top.map(r => r.label).join(', ')}${top[0].foods.length ? ` – zum Beispiel in ${top[0].foods.join(', ')}` : ''}.`
        : 'Letzte Woche lag alles, was du eingetragen hast, im grünen Bereich. Schön!'}</p>
    </button></section>`;
  }

  // Tipp des Tages: Saison-Tipp und Wildkraut des Monats im Wechsel
  const dayNo = Math.floor(now.getTime() / 86400000);
  const wild = getWildHerbTip(now);
  const seasonal = getSeasonalTip(now);
  let tipHtml = '';
  if (wild && (dayNo % 2 === 1 || !seasonal)) {
    tipHtml = `<div class="w-card w-tip" id="wildherb-banner"><span class="w-tip-icon">${wild.icon}</span>
      <p><b>Wildkraut des Monats: ${wild.name}</b><br>${wild.text}<small>${WILDHERB_SAFETY_NOTE}</small></p></div>`;
  } else if (seasonal) {
    tipHtml = `<div class="w-card w-tip" id="seasonal-tip-banner"><span class="w-tip-icon">${seasonal.icon}</span><p>${seasonal.text}</p></div>`;
  }

  const dateLine = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  container.innerHTML = `<div class="w-screen" id="dashboard-screen">
    <h1 class="w-h1">${greeting(profile.name, now)}</h1>
    <p class="w-sub">${dateLine}</p>
    ${renderCheckin(today)}
    ${renderTeller({ dayTotals, tdee, core, hint })}
    ${recapHtml}
    ${rdt ? `<section class="w-block">
      <div class="w-block-title">Rezept des Tages <button type="button" class="w-link" id="btn-all-recipes">Alle Rezepte</button></div>
      <button type="button" class="w-feature" data-open="${rdt.id}">
        <div class="w-pic">${recipePictureHtml(rdt)}</div>
        <div class="w-feature-body"><h3>${escapeHtml(rdt.title)}</h3>
          ${rdt.highlight ? `<p>${escapeHtml(rdt.highlight)}</p>` : ''}
          <div class="w-meta"><span>${totalMinutes(rdt)} Min.</span><span>${Math.round(rdt.nutritionPerServing?.kal || 0)} kcal</span><span>${rdt.servings} Portion${rdt.servings > 1 ? 'en' : ''}</span></div>
        </div>
      </button>
    </section>` : ''}
    ${tipHtml ? `<section class="w-block"><div class="w-block-title">Tipp des Tages</div>${tipHtml}</section>` : ''}
    ${renderBody({ weightEntry, waistEntry, hipEntry, whr, waterMl: hydrationRepo.getDay(today) || 0, profile })}
  </div>`;

  // Check-in
  const done = container.querySelector('#checkin-done');
  container.querySelectorAll('.w-pebble').forEach(btn => {
    btn.addEventListener('click', () => {
      const area = btn.dataset.area;
      checkinRepo.setValue(today, area, Number(btn.dataset.value));
      container.querySelectorAll(`.w-pebble[data-area="${area}"]`).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      if (isComplete(checkinRepo.getDay(today))) {
        // Wochenstreifen aktualisieren
        const fresh = document.createElement('div');
        fresh.innerHTML = renderCheckin(today);
        container.querySelector('.w-week').replaceWith(fresh.querySelector('.w-week'));
        done.hidden = false;
      }
    });
  });

  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openRecipe(b.dataset.open)));
  container.querySelector('#btn-all-recipes')?.addEventListener('click', () => navigate('recipes'));
  container.querySelector('#btn-heute-nutrition')?.addEventListener('click', () => navigate('nutrition'));
  container.querySelector('#btn-heute-weight')?.addEventListener('click', () => navigate('entry', 'gewicht'));
  container.querySelector('#btn-all-values')?.addEventListener('click', () => navigate('values'));
  container.querySelector('#weekly-recap-banner')?.addEventListener('click', () => {
    profileRepo.save({ lastWeeklyRecapShown: thisMonday });
    navigate('weekly_review');
  });
}
