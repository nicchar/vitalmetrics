import { state } from '../../appState.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import {
  generatePlan, resolvePlan, buildShoppingList, scaleIngredients,
  getUnderCoveredTags, getDayTagCoverage, INTOLERANCE_LABELS,
  getEligiblePool, setDaySlot, setPin,
} from '../../domain/mealPlan.js';
import { recipeLogButtonHtml, wireRecipeLogButtons } from '../components/recipeLogControl.js';
import { showToast } from '../components/toast.js';
import { mondayOf } from '../../domain/dateUtils.js';

const CATEGORY_LABEL = { vegetarisch: '🥬 Vegetarisch', fleisch_fisch: '🍗 Fleisch/Fisch', keto: '🥑 Keto', gemischt: '🍽️ Gemischt' };
const MEAL_LABEL = { breakfast: 'Frühstück', lunch: 'Mittag', dinner: 'Abend' };

export function renderMealPlan(container) {
  const recipes = state.get('recipes') || [];
  let plan = mealPlanRepo.get();
  const thisMonday = mondayOf(new Date());

  // Plan ist veraltet (andere Woche) -> UI zeigt Hinweis, generiert aber nicht
  // automatisch neu (der Nutzer soll das bewusst per Klick anstoßen).
  const isStale = plan && plan.weekStart !== thisMonday;

  renderScreen(container, recipes, plan, isStale, thisMonday);
}

function renderScreen(container, recipes, plan, isStale, thisMonday) {
  const portions = plan?.portions || 1;
  const resolved = plan ? resolvePlan(plan, recipes) : null;
  const shoppingList = resolved ? buildShoppingList(resolved, portions) : [];
  const catalog = state.get('catalog');
  const bmName = id => catalog?.biomarkers.find(b => b.id === id)?.name || id;

  const categoryOptions = Object.keys(CATEGORY_LABEL)
    .map(c => `<option value="${c}" ${plan?.category === c ? 'selected' : ''}>${CATEGORY_LABEL[c]}</option>`).join('');

  const portionOptions = [1, 2, 3, 4]
    .map(p => `<option value="${p}" ${portions === p ? 'selected' : ''}>${p} Person${p !== 1 ? 'en' : ''}</option>`).join('');

  // Nährstoffe, bei denen die Zufuhr laut Ernährungstagebuch (letzte 7 Tage)
  // aktuell unter 70% des DGE-Referenzwerts liegt - werden bei der
  // Rezeptauswahl sanft bevorzugt (Nutzer-Feedback: Rezeptauswahl war bisher
  // rein zufällig, ohne jede Nährstoff-Berücksichtigung).
  const profile = profileRepo.get();
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const underCoveredTags = getUnderCoveredTags(nutritionRepo.getLast7DaysTotals(), dgeRef);

  // Tausch/Pin-Feature (03.08.2026): derselbe gefilterte Pool wie beim
  // Generieren, damit die "Anderes Rezept"-Auswahl garantiert zu Kategorie
  // und Unverträglichkeiten passt. Nutzt bewusst NUR die 302 App-Rezepte,
  // keine eigenen Rezepte (Punkt 2, Nicole: "erstmal nur persönliche
  // Sammlung, nicht meal-plan-integriert").
  const activeIntolerances = profile.intolerances || [];
  const pool = plan ? getEligiblePool(recipes, plan.category, activeIntolerances) : null;

  const daysHtml = resolved ? resolved.days.map(day => {
    const dayTags = getDayTagCoverage(day);
    return `
    <div class="mealplan-day">
      <div class="mealplan-day-header">${day.weekday} <span class="mealplan-date">${formatDate(day.date)}</span></div>
      ${mealRow('🌅 Frühstück', 'breakfast', day.date, day.breakfastRecipe, portions, resolved, pool)}
      ${mealRow('🍲 Mittag', 'lunch', day.date, day.lunchRecipe, portions, resolved, pool)}
      ${mealRow('🌙 Abend', 'dinner', day.date, day.dinnerRecipe, portions, resolved, pool)}
      ${dayTags.length ? `<p class="mealplan-day-tags">🏷️ Diese Mahlzeiten decken laut Rezept-Tags: ${dayTags.map(bmName).join(', ')}</p>` : ''}
    </div>`;
  }).join('') : '';

  container.innerHTML = `<div class="screen mealplan-screen">
    <div class="screen-header"><h1 class="screen-title">📅 Wochenplan</h1></div>

    <div class="activity-section">
      ${isStale ? `<p style="font-size:12px;color:#f59e0b;margin-bottom:8px">⚠️ Dieser Plan ist aus einer früheren Woche. Neu generieren für die aktuelle Woche.</p>` : ''}
      ${underCoveredTags.length ? `<p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">💡 Basierend auf deinem Ernährungstagebuch der letzten 7 Tage bevorzugt die Auswahl Rezepte für: ${underCoveredTags.map(bmName).join(', ')}</p>` : ''}
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <select id="mealplan-category" class="form-control" style="flex:1">${categoryOptions || Object.keys(CATEGORY_LABEL).map(c => `<option value="${c}">${CATEGORY_LABEL[c]}</option>`).join('')}</select>
        <button class="btn-primary" id="btn-generate-plan" style="flex:1">${plan ? '🔄 Neu generieren' : '✨ Plan erstellen'}</button>
      </div>
      <div class="form-group" style="margin-top:4px">
        <label style="font-size:12px;color:var(--text-secondary)">Unverträglichkeiten berücksichtigen</label>
        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:4px">
          ${Object.entries(INTOLERANCE_LABELS).map(([key, label]) => `
            <label style="display:flex;align-items:center;gap:4px;font-size:13px">
              <input type="checkbox" class="mealplan-intolerance" value="${key}" ${profile.intolerances?.includes(key) ? 'checked' : ''}>
              ${label}
            </label>`).join('')}
        </div>
        <p style="font-size:11px;color:var(--text-hint);margin-top:4px">Komfort-Filter basierend auf den genannten Zutaten – keine Garantie, insbesondere nicht bei Allergien. Im Zweifel Zutatenliste selbst prüfen. Wirkt ab dem nächsten "Neu generieren".</p>
      </div>
      ${plan ? `<div class="form-group">
        <label for="mealplan-portions">Einkaufsliste für wie viele Personen?</label>
        <select id="mealplan-portions" class="form-control">${portionOptions}</select>
      </div>` : ''}
      ${!plan ? '<p style="font-size:13px;color:var(--text-secondary)">Noch kein Wochenplan – wähle eine Kategorie und generiere deinen ersten Plan.</p>' : ''}
    </div>

    ${plan ? `
      <div class="activity-section">
        <div class="mealplan-days">${daysHtml}</div>
      </div>

      <div class="activity-section">
        <button class="btn-secondary" id="btn-toggle-shopping">🛒 Einkaufsliste ${shoppingList.length ? `(${shoppingList.length})` : ''}</button>
        <div id="shopping-list" style="display:none;margin-top:10px">
          <p style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">Zusammengefasst aus allen Rezepten der Woche für ${portions} Person${portions !== 1 ? 'en' : ''} · Mengen sind Näherungswerte aus Freitext-Zutaten.</p>
          <ul class="shopping-list">${shoppingList.map(i => `<li><label><input type="checkbox"> ${i.label}</label></li>`).join('')}</ul>
        </div>
      </div>` : ''}
  </div>`;

  container.querySelectorAll('.mealplan-intolerance').forEach(cb => {
    cb.addEventListener('change', () => {
      const active = [...container.querySelectorAll('.mealplan-intolerance:checked')].map(el => el.value);
      profileRepo.save({ intolerances: active });
    });
  });

  container.querySelector('#btn-generate-plan').addEventListener('click', () => {
    const category = container.querySelector('#mealplan-category').value;
    const activeIntolerancesNow = [...container.querySelectorAll('.mealplan-intolerance:checked')].map(el => el.value);
    // Bestehende Pins ("immer das Porridge") ueberleben bewusst ein
    // "Neu generieren" - generatePlan() prueft defensiv, ob das gepinnte
    // Rezept ueberhaupt noch existiert (siehe domain/mealPlan.js).
    const existingPins = plan?.pins || {};
    const newPlan = { ...generatePlan(recipes, category, thisMonday, underCoveredTags, activeIntolerancesNow, existingPins), portions };
    mealPlanRepo.save(newPlan);
    renderScreen(container, recipes, newPlan, false, thisMonday);
  });

  container.querySelector('#mealplan-portions')?.addEventListener('change', (e) => {
    const newPlan = { ...plan, portions: parseInt(e.target.value, 10) };
    mealPlanRepo.save(newPlan);
    renderScreen(container, recipes, newPlan, isStale, thisMonday);
  });

  container.querySelector('#btn-toggle-shopping')?.addEventListener('click', () => {
    const el = container.querySelector('#shopping-list');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });

  // ── Rezept tauschen (nur dieser eine Tag) ────────────────────────────────
  container.querySelectorAll('.mealplan-swap-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const newRecipeId = sel.value;
      if (!newRecipeId) return; // Platzhalter-Option gewählt
      const newPlan = setDaySlot(plan, sel.dataset.date, sel.dataset.mealtype, newRecipeId);
      mealPlanRepo.save(newPlan);
      renderScreen(container, recipes, newPlan, isStale, thisMonday);
    });
  });

  // ── Mahlzeit fest einplanen/lösen (gilt für die ganze Woche) ─────────────
  container.querySelectorAll('.mealplan-pin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealType = btn.dataset.mealtype;
      const alreadyPinned = plan.pins?.[mealType] === btn.dataset.recipeId;
      const newPlan = setPin(plan, mealType, alreadyPinned ? null : btn.dataset.recipeId);
      mealPlanRepo.save(newPlan);
      showToast(alreadyPinned
        ? 'Mahlzeit wird beim nächsten "Neu generieren" wieder frei gewählt'
        : `📌 Ab jetzt immer diese Mahlzeit für ${MEAL_LABEL[mealType]}`);
      renderScreen(container, recipes, newPlan, isStale, thisMonday);
    });
  });

  // ── "Rezept gekocht" -> Ernährungstagebuch (Block F Phase 4b, seit
  // 25.07.2026 als geteilte Komponente auch im Trend-Screen genutzt) ────────
  wireRecipeLogButtons(container, recipes);
}

function mealRow(label, mealType, dateIso, recipe, portions, plan, pool) {
  if (!recipe) return `<div class="mealplan-meal"><span class="mealplan-meal-label">${label}</span><span class="mealplan-meal-empty">– keine Rezepte in dieser Kategorie –</span></div>`;
  // Bugfix: vorher navigierte ein Klick auf den Titel faelschlich zum
  // Trend-Screen eines Biomarkers (data-tag war eine Biomarker-ID, keine
  // Rezept-Referenz). Jetzt: Zutaten/Zubereitung direkt aufklappbar, analog
  // zur Rezept-Karte im Trend-Screen (renderFoodsSection).
  //
  // Bugfix 2: die angezeigten Zutatenmengen wurden bisher NICHT auf die
  // gewaehlte Personenzahl skaliert (nur die Einkaufsliste war es) - jetzt
  // zeigt die Detailansicht dieselben skalierten Mengen wie die Einkaufsliste.
  const scaled = scaleIngredients(recipe.ingredients, recipe.servings, portions);

  // Tausch/Pin (Feature-Wunsch 03.08.2026): "keine Forelle mag" -> Tauschen,
  // "immer das Porridge" -> Pin ueber die ganze Woche (siehe setDaySlot()/
  // setPin() in domain/mealPlan.js).
  const isPinned = plan.pins?.[mealType] === recipe.id;
  const alternatives = (pool?.[mealType] || []).filter(r => r.id !== recipe.id);

  return `<div class="mealplan-meal">
    <div class="mealplan-meal-row">
      <span class="mealplan-meal-label">${label}</span>
      <span class="mealplan-meal-title">${recipe.title}</span>
      <span class="mealplan-meal-duration">⏱ ${recipe.duration}</span>
    </div>
    <details class="recipe-details">
      <summary>Zutaten &amp; Zubereitung (für ${portions} Person${portions !== 1 ? 'en' : ''})</summary>
      <ul class="recipe-ingredients">${scaled.map(i => `<li>${i}</li>`).join('')}</ul>
      <ol class="recipe-steps">${(recipe.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
      <div style="display:flex;gap:6px;align-items:center;margin-top:10px;flex-wrap:wrap">
        <select class="mealplan-swap-select" data-date="${dateIso}" data-mealtype="${mealType}" style="flex:1;min-width:140px;padding:6px;border:1px solid var(--border);border-radius:6px;font-size:12px">
          <option value="">🔄 Anderes Rezept wählen…</option>
          ${alternatives.map(r => `<option value="${r.id}">${r.title}</option>`).join('')}
        </select>
        <button type="button" class="mealplan-pin-btn${isPinned ? ' active' : ''}" data-mealtype="${mealType}" data-recipe-id="${recipe.id}"
          style="padding:7px 10px;border:1px solid var(--border);border-radius:6px;
                 background:${isPinned ? 'var(--primary)' : 'var(--surface)'};
                 color:${isPinned ? '#fff' : 'inherit'};font-size:12px;cursor:pointer;white-space:nowrap">
          ${isPinned ? '📌 Fest eingeplant' : '📌 Immer diese Mahlzeit'}
        </button>
      </div>
      ${recipeLogButtonHtml(recipe)}
    </details>
  </div>`;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.`;
}
