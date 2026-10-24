/**
 * recipes.js – WellANNI 2.2
 *
 * Tab "Rezepte": Suche, Mahlzeit- und Anlass-Filter, Rezeptkarten mit Foto
 * bzw. Illustration. Filter bleiben während der Sitzung erhalten (appState),
 * damit "Zurück" von der Rezeptseite wieder an dieselbe Stelle führt.
 */
import { state } from '../../appState.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { seasonOf } from '../../domain/mealPlan.js';
import { navigate } from '../../router.js';
import { recipePictureHtml } from '../components/recipeArt.js';
import { MEAL_FILTERS, TAG_FILTERS, matchesFilters, totalMinutes, escapeHtml } from '../components/recipeFormat.js';

const PAGE = 30;

export function openRecipe(id) {
  state.set('currentRecipeId', id);
  state.set('recipeBackTo', 'recipes');
  navigate('recipe');
}

function defaultFilters() {
  const diet = mealPlanRepo.get()?.category;
  const tags = ['saison'];
  if (diet === 'vegetarisch') tags.push('veg');
  if (diet === 'keto') tags.push('lowcarb');
  return { meal: 'alle', tags, query: '', shown: PAGE };
}

export function renderRecipes(container) {
  const recipes = state.get('recipes') || [];
  const today = new Date().toISOString().slice(0, 10);
  const season = seasonOf(today);
  const f = state.get('recipeFilters') || defaultFilters();
  state.set('recipeFilters', f);

  const list = recipes
    .filter(r => matchesFilters(r, f, season))
    // Rezepte mit Foto zuerst, dann saisonale – sonst Reihenfolge der Sammlung
    .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0)
      || ((b.seasons || []).includes(season) - (a.seasons || []).includes(season)));

  const cards = list.slice(0, f.shown).map(r => `
    <button class="w-rc" data-open="${r.id}" type="button">
      <div class="w-pic">${recipePictureHtml(r)}</div>
      <div class="w-rc-t">${escapeHtml(r.title)}</div>
      <div class="w-rc-m">${totalMinutes(r)} Min. · ${Math.round(r.nutritionPerServing?.kal || 0)} kcal</div>
    </button>`).join('');

  container.innerHTML = `<div class="w-screen" id="recipes-screen">
    <h1 class="w-h1">Rezepte</h1>
    <p class="w-sub">Einfach, saisonal und zum Genießen</p>
    <label class="w-search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
      <input id="recipe-search" type="search" value="${escapeHtml(f.query)}" placeholder="Rezept oder Zutat suchen" aria-label="Rezept oder Zutat suchen">
    </label>
    <div class="w-chips" role="group" aria-label="Mahlzeit">${MEAL_FILTERS.map(([k, l]) =>
      `<button class="w-chip" type="button" data-meal="${k}" aria-pressed="${f.meal === k}">${l}</button>`).join('')}</div>
    <div class="w-chips" role="group" aria-label="Filter">${TAG_FILTERS.map(([k, l]) =>
      `<button class="w-chip" type="button" data-tag="${k}" aria-pressed="${f.tags.includes(k)}">${l}</button>`).join('')}</div>
    <p class="w-count" id="recipe-count">${list.length === 1 ? '1 Rezept' : `${list.length} Rezepte`}</p>
    ${list.length
      ? `<div class="w-grid">${cards}</div>`
      : `<div class="w-card w-muted">Dazu haben wir gerade nichts gefunden. Nimm einen Filter heraus oder such nach einer anderen Zutat.</div>`}
    ${list.length > f.shown ? `<button class="w-btn w-btn-ghost w-more-btn" id="recipes-more" type="button">Weitere Rezepte zeigen</button>` : ''}
    <button class="w-outline-btn" id="recipes-mealplan" type="button">Zum Wochenplan</button>
  </div>`;

  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openRecipe(b.dataset.open)));
  container.querySelectorAll('[data-meal]').forEach(b => b.addEventListener('click', () => {
    f.meal = b.dataset.meal; f.shown = PAGE; renderRecipes(container);
  }));
  container.querySelectorAll('[data-tag]').forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.tag;
    f.tags = f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t];
    f.shown = PAGE; renderRecipes(container);
  }));
  container.querySelector('#recipes-more')?.addEventListener('click', () => { f.shown += PAGE; renderRecipes(container); });
  container.querySelector('#recipes-mealplan').addEventListener('click', () => navigate('mealplan'));

  const input = container.querySelector('#recipe-search');
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      f.query = input.value; f.shown = PAGE;
      const pos = input.selectionStart;
      renderRecipes(container);
      const n = container.querySelector('#recipe-search');
      n.focus(); try { n.setSelectionRange(pos, pos); } catch { /* type=search */ }
    }, 200);
  });
}
