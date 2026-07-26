import { test } from 'node:test';
import assert from 'node:assert/strict';

import { PORTION_FACTORS, computeLoggedNutrition, recipeToFoodEntry } from '../../app/src/domain/recipeLogging.js';

const sampleRecipe = {
  id: 'test_recipe',
  title: 'Test-Rezept',
  servings: 2,
  nutritionConfidence: 'reviewed',
  nutritionPerServing: {
    kal: 400, protein: 20, fat: 10, carbs: 50,
    vit_a: 100, vit_d: 2, vit_e: 3, vit_k: 20, vit_c: 30,
    b1: 0.2, b2: 0.3, b3: 4, b6: 0.4, b12: 1, folat: 50,
    eisen: 3, zink: 2, mag: 40, cal: 100,
  },
};

test('PORTION_FACTORS enthaelt die vier abgestimmten Optionen (0,5/1/1,5/2)', () => {
  assert.deepEqual(PORTION_FACTORS, [0.5, 1, 1.5, 2]);
});

test('computeLoggedNutrition: Faktor 1 gibt die nutritionPerServing-Werte unveraendert zurueck', () => {
  const n = computeLoggedNutrition(sampleRecipe, 1);
  assert.equal(n.kal, 400);
  assert.equal(n.protein, 20);
  assert.equal(n.cal, 100);
});

test('computeLoggedNutrition: skaliert linear mit dem Portionsfaktor (0,5x und 2x)', () => {
  const half = computeLoggedNutrition(sampleRecipe, 0.5);
  const double = computeLoggedNutrition(sampleRecipe, 2);
  assert.equal(half.kal, 200);
  assert.equal(half.protein, 10);
  assert.equal(double.kal, 800);
  assert.equal(double.eisen, 6);
});

test('computeLoggedNutrition: gibt null zurueck wenn dem Rezept keine nutritionPerServing-Daten vorliegen', () => {
  const n = computeLoggedNutrition({ id: 'x' }, 1);
  assert.equal(n, null);
});

test('recipeToFoodEntry: baut ein {food, grams}-Objekt im nutritionRepo.addEntry-Schema', () => {
  const entry = recipeToFoodEntry(sampleRecipe, 1);
  assert.equal(entry.grams, 100);
  assert.equal(entry.food.kal, 400);
  assert.equal(entry.food.name, 'Test-Rezept');
  assert.equal(entry.food.source, 'recipe');
  assert.equal(entry.food.recipeId, 'test_recipe');
});

test('recipeToFoodEntry: grams = 100 * portionFactor, damit nutritionRepo (kal * grams/100) korrekt skaliert', () => {
  const entry = recipeToFoodEntry(sampleRecipe, 1.5);
  assert.equal(entry.grams, 150);
  // Kernrechnung, die nutritionRepo.getDayTotals intern macht:
  const effectiveKcal = entry.food.kal * entry.grams / 100;
  assert.equal(effectiveKcal, 600); // 400 kcal/Portion * 1,5
});

test('recipeToFoodEntry: gibt null zurueck ohne nutritionPerServing (kein Absturz beim Rendern)', () => {
  assert.equal(recipeToFoodEntry({ id: 'x', title: 'Y' }, 1), null);
});
