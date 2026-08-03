/**
 * myRecipes.js
 *
 * "Eigene Rezepte" (Feature-Wunsch 03.08.2026): persönliche Rezept-Sammlung,
 * rein lokal, unabhängig vom Wochenplan/den 302 App-Rezepten (Nicole:
 * "Erstmal nur persönliche Sammlung"). Nährwerte pro Portion werden manuell
 * eingegeben (domain/customRecipe.js) - dadurch ist das entstehende
 * Rezept-Objekt kompatibel zu recipes.json und die bestehende "Rezept
 * gekocht"-Komponente (ui/components/recipeLogControl.js) funktioniert ohne
 * jede Änderung auch hier, inklusive Portions- und Mahlzeit-Auswahl.
 *
 * Aufbau/Formular-Toggle-Muster analog zu ui/screens/cravings.js.
 */
import { customRecipeRepo } from '../../infra/db/repositories/customRecipeRepo.js';
import { buildCustomRecipe } from '../../domain/customRecipe.js';
import { recipeLogButtonHtml, wireRecipeLogButtons } from '../components/recipeLogControl.js';
import { showToast } from '../components/toast.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderMyRecipes(c) {
  let recipes = customRecipeRepo.getAll();
  let formOpen = false;

  function buildForm() {
    if (!formOpen) return '';
    return `<div class="activity-section" id="recipe-form-card">
      <h3>➕ Neues Rezept</h3>
      <input type="text" id="rc-title" class="sport-select" style="width:100%;margin-bottom:6px" placeholder="Titel (z. B. Omas Linseneintopf)">
      <input type="text" inputmode="numeric" id="rc-servings" class="minutes-input" style="width:100%;margin-bottom:6px" placeholder="Portionen (z. B. 2)">
      <textarea id="rc-ingredients" rows="4" style="width:100%;margin-bottom:6px;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit"
        placeholder="Zutaten - eine pro Zeile&#10;z. B.&#10;200 g Linsen&#10;1 Zwiebel&#10;1 EL Öl"></textarea>
      <textarea id="rc-steps" rows="3" style="width:100%;margin-bottom:10px;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit"
        placeholder="Zubereitung - ein Schritt pro Zeile (optional)"></textarea>
      <div style="font-weight:600;margin-bottom:6px;font-size:13px">Nährwerte pro Portion (geschätzt)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
        <input type="text" inputmode="numeric" id="rc-kal"     class="minutes-input" placeholder="kcal">
        <input type="text" inputmode="numeric" id="rc-protein" class="minutes-input" placeholder="Protein g">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        <input type="text" inputmode="numeric" id="rc-fat"     class="minutes-input" placeholder="Fett g">
        <input type="text" inputmode="numeric" id="rc-carbs"   class="minutes-input" placeholder="Kohlenhydrate g">
      </div>
      <p style="font-size:11px;color:var(--text-secondary);margin-bottom:10px">Mikronährstoffe (Vitamine, Mineralstoffe) werden bei eigenen Rezepten nicht erfasst - dafür fehlt ohne Laboranalyse eine verlässliche Grundlage. Für die volle Mikronährstoff-Berechnung eignen sich die App-Rezepte im Wochenplan.</p>
      <button class="btn-primary" id="btn-save-recipe" style="width:100%">Speichern</button>
    </div>`;
  }

  function buildList() {
    if (!recipes.length) {
      return `<p style="font-size:13px;color:var(--text-secondary);padding:0 16px">Noch keine eigenen Rezepte – oben auf „+ Rezept" tippen und dein erstes Rezept eintragen.</p>`;
    }
    return `<div class="activity-section">
      ${recipes.map(r => `
        <div class="mealplan-meal" style="margin-bottom:10px">
          <div class="mealplan-meal-row">
            <span class="mealplan-meal-title">${escapeHtml(r.title)}</span>
            <span class="mealplan-meal-duration">${r.servings} Portion${r.servings !== 1 ? 'en' : ''}</span>
          </div>
          <details class="recipe-details">
            <summary>${Math.round(r.nutritionPerServing.kal)} kcal/Portion · Zutaten &amp; Zubereitung</summary>
            <ul class="recipe-ingredients">${r.ingredients.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
            ${r.steps.length ? `<ol class="recipe-steps">${r.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : ''}
            ${recipeLogButtonHtml(r)}
            <button class="btn-delete-recipe" data-rid="${r.id}"
              style="margin-top:8px;width:100%;padding:8px 0;border:1px dashed var(--border);border-radius:8px;background:none;color:#ef4444;font-size:13px;cursor:pointer">
              🗑️ Rezept löschen
            </button>
          </details>
        </div>`).join('')}
    </div>`;
  }

  function build() {
    return `<div class="screen my-recipes-screen">
      <div class="screen-header">
        <h1 class="screen-title">📖 Eigene Rezepte</h1>
      </div>
      <div class="activity-section">
        <p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px">Deine persönliche Rezept-Sammlung, lokal gespeichert. Unabhängig vom Wochenplan – du kannst jedes eigene Rezept trotzdem direkt ins Ernährungstagebuch eintragen.</p>
        <button class="btn-secondary" id="btn-toggle-recipe-form">${formOpen ? '✕ Schließen' : '+ Rezept'}</button>
      </div>
      ${buildForm()}
      ${buildList()}
    </div>`;
  }

  function attachEvents() {
    c.querySelector('#btn-toggle-recipe-form').addEventListener('click', () => {
      formOpen = !formOpen;
      c.innerHTML = build();
      attachEvents();
    });

    if (formOpen) {
      c.querySelector('#btn-save-recipe').addEventListener('click', () => {
        const result = buildCustomRecipe({
          title: c.querySelector('#rc-title').value,
          servings: c.querySelector('#rc-servings').value,
          ingredientsText: c.querySelector('#rc-ingredients').value,
          stepsText: c.querySelector('#rc-steps').value,
          kal: c.querySelector('#rc-kal').value,
          protein: c.querySelector('#rc-protein').value,
          fat: c.querySelector('#rc-fat').value,
          carbs: c.querySelector('#rc-carbs').value,
        });
        if (!result.ok) {
          showToast(result.reason === 'title' ? 'Bitte einen Titel eingeben' : 'Bitte mindestens eine Zutat eingeben');
          return;
        }
        customRecipeRepo.save(result.recipe);
        recipes = customRecipeRepo.getAll();
        formOpen = false;
        showToast(`📖 „${result.recipe.title}" gespeichert`);
        c.innerHTML = build();
        attachEvents();
      });
    }

    c.querySelectorAll('.btn-delete-recipe').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Rezept löschen?')) return;
        customRecipeRepo.remove(btn.dataset.rid);
        recipes = customRecipeRepo.getAll();
        c.innerHTML = build();
        attachEvents();
      });
    });

    // ── "Rezept gekocht" -> Ernährungstagebuch (geteilte Komponente, siehe
    // mealPlan.js/trend.js) - funktioniert unverändert, weil buildCustomRecipe()
    // dasselbe Schema wie app/src/data/recipes.json erzeugt.
    wireRecipeLogButtons(c, recipes);
  }

  c.innerHTML = build();
  attachEvents();
}
