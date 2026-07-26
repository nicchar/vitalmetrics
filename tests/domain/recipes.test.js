import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recipes = JSON.parse(readFileSync(path.join(__dirname, '../../app/src/data/recipes.json'), 'utf-8'));

const REQUIRED_FIELDS = ['id', 'title', 'duration', 'servings', 'tags', 'ingredients', 'steps', 'highlight', 'category', 'mealType'];

test('recipes.json: alle IDs sind eindeutig', () => {
  const ids = recipes.map(r => r.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('recipes.json: jedes Rezept hat alle Pflichtfelder, nicht-leere Zutaten/Schritte', () => {
  for (const r of recipes) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(field in r, `Rezept ${r.id || '?'} fehlt Feld "${field}"`);
    }
    assert.ok(r.ingredients.length > 0, `Rezept ${r.id} hat keine Zutaten`);
    assert.ok(r.steps.length > 0, `Rezept ${r.id} hat keine Zubereitungsschritte`);
    assert.ok(r.tags.length > 0, `Rezept ${r.id} hat keine Naehrstoff-Tags`);
  }
});

test('recipes.json (Block F Phase 3): mindestens 260 Rezepte, Mangan und Biotin nicht mehr fast unbelegt', () => {
  assert.ok(recipes.length >= 260, `Erwartet >= 260 Rezepte, gefunden ${recipes.length}`);
  const tagCount = id => recipes.filter(r => r.tags.includes(id)).length;
  assert.ok(tagCount('mangan') >= 5, `Mangan-Rezepte weiterhin zu duenn: ${tagCount('mangan')}`);
  assert.ok(tagCount('vitamin_b7') >= 5, `Biotin-Rezepte weiterhin zu duenn: ${tagCount('vitamin_b7')}`);
});

test('recipes.json (Block F Phase 3): Fruehstueck und Snack ausgebaut (waren die duennsten Kategorien)', () => {
  const byMeal = type => recipes.filter(r => r.mealType === type).length;
  assert.ok(byMeal('breakfast') >= 54, `Fruehstueck weiterhin zu duenn: ${byMeal('breakfast')}`);
  assert.ok(byMeal('snack') >= 48, `Snack weiterhin zu duenn: ${byMeal('snack')}`);
});

const NUTRITION_KEYS = ['kal', 'protein', 'fat', 'carbs', 'vit_a', 'vit_d', 'vit_e', 'vit_k', 'vit_c',
  'b1', 'b2', 'b3', 'b6', 'b12', 'folat', 'eisen', 'zink', 'mag', 'cal'];

test('recipes.json (Block F Phase 4b): jedes Rezept hat nutritionPerServing + nutritionConfidence', () => {
  for (const r of recipes) {
    assert.ok(r.nutritionPerServing, `${r.id}: nutritionPerServing fehlt`);
    assert.ok(['reviewed', 'estimated'].includes(r.nutritionConfidence), `${r.id}: nutritionConfidence ungueltig`);
    for (const key of NUTRITION_KEYS) {
      const val = r.nutritionPerServing[key];
      assert.equal(typeof val, 'number', `${r.id}: nutritionPerServing.${key} ist keine Zahl`);
      assert.ok(!Number.isNaN(val) && val >= 0, `${r.id}: nutritionPerServing.${key} = ${val} (negativ oder NaN)`);
    }
  }
});

test('recipes.json (Block F Phase 4b): kcal pro Portion in plausiblem Bereich (keine Rechenfehler wie 400g/Dattel)', () => {
  for (const r of recipes) {
    const kcal = r.nutritionPerServing.kal;
    assert.ok(kcal >= 20 && kcal <= 1600, `${r.id}: ${kcal} kcal/Portion wirkt unplausibel`);
  }
});

test('recipes.json (Block F Phase 4b): mindestens 99% der Rezepte auf "reviewed" (Zutaten sauber gegen BLS gematcht)', () => {
  const reviewed = recipes.filter(r => r.nutritionConfidence === 'reviewed').length;
  assert.ok(reviewed / recipes.length >= 0.99, `Nur ${reviewed}/${recipes.length} reviewed`);
});
