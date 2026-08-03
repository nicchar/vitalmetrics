import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCustomRecipe } from '../../app/src/domain/customRecipe.js';
import { computeLoggedNutrition } from '../../app/src/domain/recipeLogging.js';

/**
 * customRecipe.test.js
 *
 * Feature "Eigene Rezepte" (03.08.2026): persönliche Rezept-Sammlung mit
 * manueller Nährwert-Eingabe statt Berechnung aus Zutaten.
 */

test('buildCustomRecipe: fehlender Titel liefert ok:false mit reason "title"', () => {
  const result = buildCustomRecipe({ title: '  ', ingredientsText: '200g Linsen' });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'title');
});

test('buildCustomRecipe: fehlende Zutaten liefert ok:false mit reason "ingredients"', () => {
  const result = buildCustomRecipe({ title: 'Linseneintopf', ingredientsText: '   \n  ' });
  assert.equal(result.ok, false);
  assert.equal(result.reason, 'ingredients');
});

test('buildCustomRecipe: gültige Eingabe liefert ein vollständiges Rezept-Objekt', () => {
  const result = buildCustomRecipe({
    title: '  Omas Linseneintopf  ',
    servings: '2',
    ingredientsText: '200 g Linsen\n1 Zwiebel\n\n1 EL Öl',
    stepsText: 'Zwiebel anbraten\nLinsen zugeben und köcheln',
    kal: '350', protein: '18', fat: '8', carbs: '45',
  });
  assert.equal(result.ok, true);
  const r = result.recipe;
  assert.equal(r.title, 'Omas Linseneintopf');
  assert.equal(r.servings, 2);
  assert.deepEqual(r.ingredients, ['200 g Linsen', '1 Zwiebel', '1 EL Öl']);
  assert.deepEqual(r.steps, ['Zwiebel anbraten', 'Linsen zugeben und köcheln']);
  assert.equal(r.nutritionPerServing.kal, 350);
  assert.equal(r.nutritionPerServing.protein, 18);
  assert.equal(r.nutritionConfidence, 'estimated');
  assert.equal(r.source, 'custom');
  assert.ok(r.id.startsWith('custom_'));
  assert.ok(r.createdAt);
});

test('buildCustomRecipe: Mikronährstoffe sind immer 0 (keine seriöse manuelle Schätzung möglich)', () => {
  const result = buildCustomRecipe({ title: 'X', ingredientsText: 'Etwas', kal: '100' });
  for (const key of ['vit_a', 'vit_d', 'vit_c', 'eisen', 'zink', 'mag', 'cal', 'b12']) {
    assert.equal(result.recipe.nutritionPerServing[key], 0);
  }
});

test('buildCustomRecipe: fehlende Nährwerte werden zu 0, nicht NaN', () => {
  const result = buildCustomRecipe({ title: 'X', ingredientsText: 'Etwas' });
  assert.equal(result.recipe.nutritionPerServing.kal, 0);
  assert.ok(!Number.isNaN(result.recipe.nutritionPerServing.kal));
});

test('buildCustomRecipe: Portionen ohne gültige Zahl fallen auf 1 zurück, niemals 0', () => {
  const result = buildCustomRecipe({ title: 'X', ingredientsText: 'Etwas', servings: 'abc' });
  assert.equal(result.recipe.servings, 1);
  const result2 = buildCustomRecipe({ title: 'X', ingredientsText: 'Etwas', servings: '0' });
  assert.equal(result2.recipe.servings, 1);
});

test('buildCustomRecipe: leere Zeilen in Zutaten/Zubereitung werden herausgefiltert und getrimmt', () => {
  const result = buildCustomRecipe({ title: 'X', ingredientsText: '  A  \n\n  \n B ' });
  assert.deepEqual(result.recipe.ingredients, ['A', 'B']);
});

/**
 * Kompatibilitäts-Test: das erzeugte Objekt muss von der ECHTEN
 * recipeLogging.js-Logik (nicht gemockt) korrekt verarbeitet werden können,
 * damit "Rezept gekocht" (recipeLogControl.js) auch für eigene Rezepte
 * funktioniert, ohne dort etwas ändern zu müssen.
 */
test('buildCustomRecipe: Ergebnis ist mit computeLoggedNutrition() aus recipeLogging.js kompatibel', () => {
  const result = buildCustomRecipe({
    title: 'Testgericht', servings: '1', ingredientsText: 'Test-Zutat',
    kal: '200', protein: '10', fat: '5', carbs: '20',
  });
  const n = computeLoggedNutrition(result.recipe, 1.5);
  assert.equal(n.kal, 300); // 200 * 1.5
  assert.equal(n.protein, 15); // 10 * 1.5
  assert.equal(n.vit_d, 0);
});
