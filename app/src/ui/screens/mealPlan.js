import { state } from '../../appState.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import {
  generatePlan, resolvePlan, buildShoppingList, scaleIngredients,
  getUnderCoveredTags, getDayTagCoverage, INTOLERANCE_LABELS,
} from '../../domain/mealPlan.js';

const CATEGORY_LABEL = { vegetarisch: '🥬 Vegetarisch', fleisch_fisch: '🍗 Fleisch/Fisch', keto: '🥑 Keto', gemischt: '🍽️ Gemischt' };

function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = So
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

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

  const daysHtml = resolved ? resolved.days.map(day => {
    const dayTags = getDayTagCoverage(day);
    return `
    <div class="mealplan-day">
      <div class="mealplan-day-header">${day.weekday} <span class="mealplan-date">${formatDate(day.date)}</span></div>
      ${mealRow('🌅 Frühstück', day.breakfastRecipe, portions)}
      ${mealRow('🍲 Mittag', day.lunchRecipe, portions)}
      ${mealRow('🌙 Abend', day.dinnerRecipe, portions)}
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
    const activeIntolerances = [...container.querySelectorAll('.mealplan-intolerance:checked')].map(el => el.value);
    const newPlan = { ...generatePlan(recipes, category, thisMonday, underCoveredTags, activeIntolerances), portions };
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
}

function mealRow(label, recipe, portions) {
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
    </details>
  </div>`;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.`;
}
