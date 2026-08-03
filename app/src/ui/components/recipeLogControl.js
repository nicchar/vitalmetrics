/**
 * recipeLogControl.js
 *
 * Gemeinsame "Rezept gekocht" -> Ernährungstagebuch-Komponente (Button +
 * Portionsauswahl + Live-Vorschau + Eintragen). Ursprünglich nur im
 * Wochenplan (Block F Phase 4), am 25.07.2026 hier herausgezogen, damit
 * dieselbe Funktion auch bei den Rezeptideen auf den Nährstoff-Detailseiten
 * (trend.js renderFoodsSection) genutzt werden kann, ohne die Logik doppelt
 * zu pflegen (Nicole: "dann muss ich nicht alles manuell eingeben").
 *
 * Nutzt recipeToFoodEntry()/computeLoggedNutrition() aus domain/recipeLogging.js
 * unverändert - jedes Rezept mit nutritionPerServing (alle 302 in recipes.json)
 * funktioniert automatisch, unabhängig davon, wo die Karte angezeigt wird.
 */
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { PORTION_FACTORS, computeLoggedNutrition, recipeToFoodEntry } from '../../domain/recipeLogging.js';
import { MEAL_TYPES, guessMealTypeByTime } from '../../domain/mealType.js';
import { showToast } from './toast.js';

/**
 * Liefert das HTML für Button + (zunächst verstecktes) Bestätigungs-Feld.
 * Muss direkt nach dem Rezept-Markup eingefügt werden - wireRecipeLogButtons()
 * verlässt sich auf `btn.nextElementSibling`, um das zugehörige Feld zu finden.
 */
export function recipeLogButtonHtml(recipe) {
  return `
    <button class="btn-log-recipe" type="button" data-recipe-id="${recipe.id}"
      style="margin-top:10px;width:100%;padding:8px 0;border:1px dashed var(--border);border-radius:8px;
             background:none;font-size:13px;cursor:pointer">
      🍳 Rezept gekocht – ins Ernährungstagebuch
    </button>
    <div class="log-recipe-confirm" data-recipe-id="${recipe.id}" style="display:none"></div>`;
}

/**
 * Verdrahtet alle `.btn-log-recipe`-Buttons innerhalb von `container`.
 * `recipes`: Array der Rezept-Objekte, die auf dem Screen sichtbar sind
 * (muss nicht die volle recipes.json sein - nur was die Buttons referenzieren).
 */
export function wireRecipeLogButtons(container, recipes) {
  container.querySelectorAll('.btn-log-recipe').forEach(btn => {
    btn.addEventListener('click', () => {
      const recipe = recipes.find(r => r.id === btn.dataset.recipeId);
      const box = btn.nextElementSibling;
      if (!recipe || !box) return;
      const isOpen = box.style.display !== 'none' && box.dataset.built === '1';
      if (isOpen) {
        box.style.display = 'none';
        return;
      }
      renderLogConfirm(box, recipe);
      box.style.display = 'block';
    });
  });
}

/** Baut die Portionsauswahl + Live-Vorschau + "Eintragen"-Button in `box`. */
export function renderLogConfirm(box, recipe) {
  let factor = 1;
  // Mahlzeiten-Kategorisierung (03.08.2026): Vorschlag per Tageszeit, jederzeit
  // änderbar - Rezept-Log ist ein eigener Einstiegspunkt (Wochenplan,
  // Rezeptideen auf trend.js) ohne den zentralen Selector aus nutrition.js,
  // braucht also seine eigene Auswahl direkt hier.
  let mealType = guessMealTypeByTime();

  function preview() {
    const n = computeLoggedNutrition(recipe, factor);
    const hint = recipe.nutritionConfidence === 'estimated'
      ? ' · Schätzwert (einzelne Zutat ohne genaue Mengenangabe im Rezept)'
      : '';
    return `~${Math.round(n.kal)} kcal · ${n.protein}g P · ${n.fat}g F · ${n.carbs}g KH${hint}`;
  }

  box.dataset.built = '1';
  box.innerHTML = `
    <div class="log-recipe-mealtype" style="display:flex;gap:6px;margin:8px 0 6px;flex-wrap:wrap">
      ${MEAL_TYPES.map(mt => `
        <button type="button" class="log-recipe-mealtype-btn${mt.key === mealType ? ' active' : ''}" data-mealtype="${mt.key}"
          style="flex:1;min-width:60px;padding:6px 4px;border:1px solid var(--border);border-radius:6px;
                 background:${mt.key === mealType ? 'var(--primary)' : 'var(--surface)'};
                 color:${mt.key === mealType ? '#fff' : 'inherit'};font-size:11px;font-weight:600;cursor:pointer">
          ${mt.emoji} ${mt.label}
        </button>`).join('')}
    </div>
    <div class="log-recipe-portions" style="display:flex;gap:6px;margin:8px 0 6px">
      ${PORTION_FACTORS.map(f => `
        <button type="button" class="log-recipe-factor-btn${f === factor ? ' active' : ''}" data-factor="${f}"
          style="flex:1;padding:6px 0;border:1px solid var(--border);border-radius:6px;
                 background:${f === factor ? 'var(--primary)' : 'var(--surface)'};
                 color:${f === factor ? '#fff' : 'inherit'};font-size:12px;cursor:pointer">
          ${String(f).replace('.', ',')}×
        </button>`).join('')}
    </div>
    <p class="log-recipe-preview" style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">${preview()}</p>
    <button class="btn-primary log-recipe-submit" type="button" style="width:100%">Eintragen</button>
  `;

  box.querySelectorAll('.log-recipe-mealtype-btn').forEach(mbtn => {
    mbtn.addEventListener('click', () => {
      mealType = mbtn.dataset.mealtype;
      box.querySelectorAll('.log-recipe-mealtype-btn').forEach(b => {
        const active = b.dataset.mealtype === mealType;
        b.classList.toggle('active', active);
        b.style.background = active ? 'var(--primary)' : 'var(--surface)';
        b.style.color = active ? '#fff' : 'inherit';
      });
    });
  });

  box.querySelectorAll('.log-recipe-factor-btn').forEach(fbtn => {
    fbtn.addEventListener('click', () => {
      factor = parseFloat(fbtn.dataset.factor);
      box.querySelectorAll('.log-recipe-factor-btn').forEach(b => {
        const active = parseFloat(b.dataset.factor) === factor;
        b.classList.toggle('active', active);
        b.style.background = active ? 'var(--primary)' : 'var(--surface)';
        b.style.color = active ? '#fff' : 'inherit';
      });
      box.querySelector('.log-recipe-preview').textContent = preview();
    });
  });

  box.querySelector('.log-recipe-submit').addEventListener('click', () => {
    const entry = recipeToFoodEntry(recipe, factor);
    if (!entry) { showToast('Für dieses Rezept liegen noch keine Nährwerte vor'); return; }
    const today = new Date().toISOString().slice(0, 10);
    nutritionRepo.addEntry(today, { ...entry, mealType });
    showToast(`🍳 ${recipe.title} (${String(factor).replace('.', ',')}×) im Ernährungstagebuch eingetragen`);
    box.style.display = 'none';
  });
}
