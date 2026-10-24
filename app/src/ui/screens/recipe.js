/**
 * recipe.js – WellANNI 2.2
 *
 * Rezeptseite: Bild, Geschmackssatz, Zutaten mit Portionsrechner,
 * Zubereitung, Nährwerte pro Portion und zwei Aktionen:
 * "Gegessen ✓" (ins Tagebuch, mit Mahlzeit und Portionsgröße) und
 * "In den Wochenplan" (Tag und Mahlzeit wählen).
 */
import { state } from '../../appState.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { setDaySlot } from '../../domain/mealPlan.js';
import { householdServings } from '../../domain/household.js';
import { navigate } from '../../router.js';
import { recipePictureHtml } from '../components/recipeArt.js';
import { renderLogConfirm } from '../components/recipeLogControl.js';
import { ALLERGEN_LABELS, scaledLine, fmtNum, escapeHtml, sourceName } from '../components/recipeFormat.js';
import { showToast } from '../components/toast.js';

const SLOT_LABEL = { breakfast: 'Frühstück', lunch: 'Mittag', dinner: 'Abend' };


export function renderRecipe(container) {
  const recipes = state.get('recipes') || [];
  const id = state.get('currentRecipeId');
  const r = recipes.find(x => x.id === id);
  if (!r) {
    container.innerHTML = `<div class="w-screen"><h1 class="w-h1">Rezept nicht gefunden</h1>
      <p class="w-sub">Dieses Rezept gibt es nicht mehr.</p>
      <button class="w-outline-btn" id="recipe-back" type="button">Zu den Rezepten</button></div>`;
    container.querySelector('#recipe-back').addEventListener('click', () => navigate('recipes'));
    return;
  }

  let servings = state.get('recipeServings')?.[r.id] ?? householdServings(profileRepo.get()) ?? r.servings;
  const n = r.nutritionPerServing || {};

  function ingredientList() {
    const factor = servings / r.servings;
    const lines = (r.ingredientsData && r.ingredientsData.length)
      ? r.ingredientsData.map(i => scaledLine(i, factor))
      : (r.ingredients || []).map(t => ['', t]);
    return lines.map(([q, name]) => `<li><span class="q">${escapeHtml(q)}</span><span>${escapeHtml(name)}</span></li>`).join('');
  }

  const facts = [
    r.duration ? `<span class="w-pill">${escapeHtml(r.duration)}</span>` : '',
    r.vegan ? '<span class="w-pill">Vegan</span>' : r.vegetarian ? '<span class="w-pill">Vegetarisch</span>' : '',
    r.lowCarb ? '<span class="w-pill">Low Carb</span>' : '',
    r.kidFriendly ? '<span class="w-pill">Kinder mögen\'s</span>' : '',
  ].join('');

  const canPlan = r.mealType === 'breakfast' || r.mealType === 'lunch';

  container.innerHTML = `<div class="w-screen" id="recipe-screen">
    <div class="w-detail-hero w-pic">${recipePictureHtml(r)}
      <button class="w-back" id="recipe-back" type="button" aria-label="Zurück">←</button>
    </div>
    <h1 class="w-detail-title">${escapeHtml(r.title)}</h1>
    ${r.highlight ? `<p class="w-taste">${escapeHtml(r.highlight)}</p>` : ''}
    <div class="w-facts">${facts}</div>

    <section class="w-block">
      <div class="w-block-title">Zutaten
        <div class="w-serv">
          <button type="button" id="serv-minus" aria-label="Weniger Portionen">–</button>
          <b id="serv-label" aria-live="polite">${servings} Portion${servings > 1 ? 'en' : ''}</b>
          <button type="button" id="serv-plus" aria-label="Mehr Portionen">+</button>
        </div>
      </div>
      <div class="w-card"><ul class="w-ing" id="recipe-ingredients">${ingredientList()}</ul></div>
    </section>

    <section class="w-block">
      <div class="w-block-title">So geht's</div>
      <ol class="w-steps">${(r.steps || []).map(s => `<li><span>${escapeHtml(s)}</span></li>`).join('')}</ol>
      ${r.tip ? `<div class="w-card w-tip" style="margin-top:6px"><span class="w-tip-icon">💡</span><p>${escapeHtml(r.tip)}</p></div>` : ''}
    </section>

    <section class="w-block">
      <div class="w-block-title">Pro Portion</div>
      <div class="w-nut">
        <div><b>${Math.round(n.kal || 0)}</b><small>kcal</small></div>
        <div><b>${fmtNum(n.protein || 0)} g</b><small>Eiweiß</small></div>
        <div><b>${fmtNum(n.fiber || 0)} g</b><small>Ballaststoffe</small></div>
        <div><b>${fmtNum(n.carbs || 0)} g</b><small>Kohlenhydrate</small></div>
        <div><b>${fmtNum(n.fat || 0)} g</b><small>Fett</small></div>
        <div><b>${Math.round(n.jod || 0)} µg</b><small>Jod</small></div>
      </div>
      ${(r.focus || []).length ? `<div class="w-card w-focus" style="margin-top:10px">${r.focus.slice(0, 4).map(x =>
        `<p><b>${escapeHtml(x.label)}: ${fmtNum(x.amount)} ${escapeHtml(x.unit)}</b>${x.sources?.length ? ` – vor allem aus: ${[...new Set(x.sources.map(sourceName))].map(escapeHtml).join(', ')}` : ''}</p>`).join('')}</div>` : ''}
      <p class="w-small">${(r.allergens || []).length ? `Enthält: ${r.allergens.map(a => ALLERGEN_LABELS[a] || a).join(', ')}. ` : ''}Nährwerte berechnet mit dem Bundeslebensmittelschlüssel (BLS 4.0).</p>
    </section>

    <div id="recipe-sheet"></div>
    <div class="w-cta">
      ${canPlan ? '<button class="w-btn w-btn-ghost" id="recipe-plan" type="button">In den Wochenplan</button>' : ''}
      <button class="w-btn w-btn-primary" id="recipe-eaten" type="button">Gegessen ✓</button>
    </div>
  </div>`;

  const label = container.querySelector('#serv-label');
  const list = container.querySelector('#recipe-ingredients');
  function setServings(v) {
    servings = Math.max(1, Math.min(12, v));
    state.set('recipeServings', { ...(state.get('recipeServings') || {}), [r.id]: servings });
    label.textContent = `${servings} Portion${servings > 1 ? 'en' : ''}`;
    list.innerHTML = ingredientList();
  }
  container.querySelector('#serv-minus').addEventListener('click', () => setServings(servings - 1));
  container.querySelector('#serv-plus').addEventListener('click', () => setServings(servings + 1));

  container.querySelector('#recipe-back').addEventListener('click', () => {
    navigate(state.get('recipeBackTo') || 'recipes');
  });

  const sheet = container.querySelector('#recipe-sheet');
  container.querySelector('#recipe-eaten').addEventListener('click', () => {
    sheet.innerHTML = `<div class="w-sheet"><b>Ins Tagebuch eintragen</b><div class="recipe-log-box"></div></div>`;
    const box = sheet.querySelector('.recipe-log-box');
    renderLogConfirm(box, r);
    box.querySelector('.log-recipe-submit').addEventListener('click', () => { sheet.innerHTML = ''; });
    sheet.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  });

  container.querySelector('#recipe-plan')?.addEventListener('click', () => {
    const plan = mealPlanRepo.get();
    if (!plan?.days?.length) {
      showToast('Erstell zuerst deinen Wochenplan – dann kannst du Rezepte hineinlegen.');
      navigate('mealplan');
      return;
    }
    const slots = r.mealType === 'breakfast' ? ['breakfast'] : ['lunch', 'dinner'];
    let slot = slots[slots.length - 1];
    const fmtDay = d => new Date(d.date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
    sheet.innerHTML = `<div class="w-sheet">
      <b>Wann möchtest du es kochen?</b>
      ${slots.length > 1 ? `<label>Mahlzeit</label><div class="w-chips" style="margin:0">${slots.map(s =>
        `<button type="button" class="w-chip" data-slot="${s}" aria-pressed="${s === slot}">${SLOT_LABEL[s]}</button>`).join('')}</div>` : ''}
      <label>Tag</label>
      <div class="w-chips" style="margin:0;flex-wrap:wrap">${plan.days.map(d =>
        `<button type="button" class="w-chip" data-day="${d.date}">${fmtDay(d)}</button>`).join('')}</div>
    </div>`;
    sheet.querySelectorAll('[data-slot]').forEach(b => b.addEventListener('click', () => {
      slot = b.dataset.slot;
      sheet.querySelectorAll('[data-slot]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    sheet.querySelectorAll('[data-day]').forEach(b => b.addEventListener('click', () => {
      mealPlanRepo.save(setDaySlot(plan, b.dataset.day, slot, r.id));
      sheet.innerHTML = '';
      showToast(`Im Wochenplan: ${b.textContent}, ${SLOT_LABEL[slot]}`);
    }));
    sheet.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  });
}
