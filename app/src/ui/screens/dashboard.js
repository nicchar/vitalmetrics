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
import { CHECKIN_AREAS, dayAverage, isComplete } from '../../domain/checkin.js';
import { coreStatus, coreGaps, STATUS_TEXT, defaultProteinRef, vitaminDNote } from '../../domain/coreNutrients.js';
import { quickFoodsFor, QUICK_TIPS } from '../../domain/quickFoods.js';
import { buildCheckinHints, DOCTOR_NOTE, WINDOW_DAYS } from '../../domain/checkinHints.js';
import { checkinHintsRepo } from '../../infra/db/repositories/checkinHintsRepo.js';
import { buildWeekFocus } from '../../domain/weeklyReview.js';
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

function renderHints(hints) {
  if (!hints.length) return '';
  return hints.map(h => `<div class="w-card w-tip w-checkin-hint" data-hint="${h.area}">
      <span class="w-tip-icon" aria-hidden="true">🌿</span>
      <p><b>${h.title}</b><br>${h.body}${h.extra ? ` ${h.extra}` : ''}${h.foods?.length ? ` Zum Beispiel: ${h.foods.join(', ')}.` : ''}<small>${DOCTOR_NOTE}</small>
        <button type="button" class="w-link w-hint-dismiss" data-area="${h.area}" style="margin-top:6px">Danke, ausblenden</button></p>
    </div>`).join('');
}

function renderCheckin(today, hints = []) {
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
    <div id="checkin-hints">${renderHints(hints)}</div>
  </section>`;
}

/**
 * "Heute auf deinem Teller" – Kalorien, alle drei Makros gemeinsam (Nicole:
 * Eiweiß nicht isoliert betrachten), Ballaststoffe und die 8 Kernwerte.
 */
function renderTeller({ dayTotals, tdee, core, hint, freeRecapTeaser }) {
  const hasEntries = (dayTotals.kcal || 0) > 0;
  const showCore = core.some(c => c.status !== 'none');
  const kcalRef = tdee
    ? `<p class="w-small" style="margin-top:2px">Orientierung: ca. ${tdee.min}–${tdee.max} kcal am Tag · grobe Schätzung, kein Ziel</p>`
    : '';
  const coreHtml = !showCore ? '' : core.map(c =>
    `<div class="${c.status === 'more' ? 'more' : c.status === 'sun' ? 'sun' : 'ok'}" data-core="${c.key}"><b>${c.label}</b><small>${STATUS_TEXT[c.status]}</small></div>`).join('');
  const vitD = core.find(c => c.key === 'vit_d');
  const hintHtml = hint
    ? `<div class="w-hint-box">
        <button type="button" class="w-hint" data-open="${hint.recipe.id}">
          <span class="w-thumb">${recipePictureHtml(hint.recipe)}</span>
          <p><b>Für mehr ${hint.label}</b>Wie wär's mit ${escapeHtml(hint.recipe.title)}?</p>
        </button>
        ${hint.foods.length ? `<p class="w-small w-quickfoods">Oder einfach zwischendurch: ${hint.foods.map(f => escapeHtml(f.label)).join(', ')}.${hint.tip ? ` ${hint.tip}` : ''}</p>` : ''}
      </div>`
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
      ${coreHtml ? `<div class="w-core">${coreHtml}</div>
      <p class="w-small">Eiweiß und Ballaststoffe: heute. Vitamine und Mineralstoffe: Schnitt der letzten 7 Tage mit Einträgen – die schwanken von Tag zu Tag stark.</p>` : ''}
      ${vitD?.status === 'sun' ? `<p class="w-small" id="vitd-note">${vitaminDNote()}</p>` : ''}
      ${hintHtml}
      ${freeRecapTeaser ? `<p class="w-small" id="recap-teaser">Neue Woche: Dein Wochenrückblick mit Schwerpunkten und passenden Rezepten steht mit <button type="button" class="w-link" id="btn-recap-premium">Premium</button> bereit.</p>` : ''}
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

  const proteinRef = proteinRange ? proteinRange.min : defaultProteinRef(profile.sex);
  const core = coreStatus({ dayTotals, last7Totals: nutritionRepo.getLast7DaysTotals(), dgeRef, proteinRef });

  // Rezepte passend zu Ernährungsform (aus dem Wochenplan) und Unverträglichkeiten
  const diet = mealPlanRepo.get()?.category || null;
  const pool = personalPool(recipes, diet, profile.intolerances || []);
  const rdt = recipeOfTheDay(pool, today);

  // Ein einziger Vorschlag für die größte Lücke (Vitamin D ausgenommen) –
  // nur, wenn es eine echte Lücke gibt, nicht bei fehlenden Einträgen.
  let hint = null;
  for (const gap of coreGaps(core)) {
    const recipe = recipeForNutrient(pool, gap.key, today, rdt?.id);
    if (recipe) { hint = { key: gap.key, label: gap.label, recipe, foods: quickFoodsFor(gap.key, diet, today), tip: QUICK_TIPS[gap.key] || null }; break; }
  }

  // Befindens-Hinweise nach mehreren schlechten Tagen (nie zur Stimmung)
  const currentHints = () => buildCheckinHints({ recent: checkinRepo.getRecent(WINDOW_DAYS), dismissed: checkinHintsRepo.getAll(), today, core })
    .map(h => ({ ...h, foods: h.nutrients.slice(0, 1).flatMap(k => quickFoodsFor(k, diet, today, 2).map(f => f.label)) }));
  const hints = currentHints();

  // Automatischer Wochenrückblick (Premium): dezenter Hinweis statt Pop-up,
  // sobald eine neue Kalenderwoche begonnen hat und letzte Woche etwas
  // eingetragen wurde. Bleibt, bis er angetippt wird.
  const thisMonday = mondayOf(now);
  const lastWeekTotals = nutritionRepo.getTotalsForWeek(previousMonday(thisMonday));
  let weekFocus = null;
  if (profile.lastWeeklyRecapShown !== thisMonday) {
    const wf = buildWeekFocus(lastWeekTotals, dgeRef, proteinRef);
    if (wf.loggedDays > 0) weekFocus = wf;
  }
  // Gratis: nur ein dezenter Satz, und nur am Montag
  const freeRecapTeaser = !isPremium && !!weekFocus && now.getDay() === 1;
  let recapHtml = '';
  if (isPremium && weekFocus) {
    const top = weekFocus.focus;
    recapHtml = `<section class="w-block"><button type="button" class="w-card w-tip" id="weekly-recap-banner" style="width:100%;text-align:left;color:inherit">
      <span class="w-tip-icon">🗓️</span>
      <p><b>Dein Wochenrückblick ist da</b><br>${top.length
        ? `Diese Woche lohnt sich ein Blick auf: ${top.map(r => r.label).join(', ')}. Passende Rezepte warten schon.`
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
    ${renderCheckin(today, hints)}
    ${renderTeller({ dayTotals, tdee, core, hint, freeRecapTeaser })}
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
      // Hinweise neu berechnen (ein schlechter Tag kann den dritten machen)
      container.querySelector('#checkin-hints').innerHTML = renderHints(currentHints());
      wireDismiss();
    });
  });

  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openRecipe(b.dataset.open)));
  function wireDismiss() {
    container.querySelectorAll('.w-hint-dismiss').forEach(b => b.addEventListener('click', () => {
      checkinHintsRepo.dismiss(b.dataset.area, today);
      b.closest('.w-checkin-hint')?.remove();
    }));
  }
  wireDismiss();
  container.querySelector('#btn-recap-premium')?.addEventListener('click', () => navigate('premium'));
  container.querySelector('#btn-all-recipes')?.addEventListener('click', () => navigate('recipes'));
  container.querySelector('#btn-heute-nutrition')?.addEventListener('click', () => navigate('nutrition'));
  container.querySelector('#btn-heute-weight')?.addEventListener('click', () => navigate('entry', 'gewicht'));
  container.querySelector('#btn-all-values')?.addEventListener('click', () => navigate('values'));
  container.querySelector('#weekly-recap-banner')?.addEventListener('click', () => {
    profileRepo.save({ lastWeeklyRecapShown: thisMonday });
    navigate('weekly_review');
  });
}
