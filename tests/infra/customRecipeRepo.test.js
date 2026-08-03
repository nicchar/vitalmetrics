import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { customRecipeRepo } = await import('../../app/src/infra/db/repositories/customRecipeRepo.js');

beforeEach(() => {
  globalThis.localStorage.clear();
});

function sampleRecipe(id = 'custom_1') {
  return { id, title: 'Test', servings: 2, ingredients: ['A'], steps: [], nutritionPerServing: { kal: 100 }, nutritionConfidence: 'estimated', source: 'custom' };
}

test('getAll: leeres Array ohne gespeicherte Rezepte', () => {
  assert.deepEqual(customRecipeRepo.getAll(), []);
});

test('save: fügt ein Rezept hinzu und ist danach über getAll() abrufbar', () => {
  customRecipeRepo.save(sampleRecipe());
  const all = customRecipeRepo.getAll();
  assert.equal(all.length, 1);
  assert.equal(all[0].title, 'Test');
});

test('save: mehrere Rezepte werden angehängt, nicht überschrieben', () => {
  customRecipeRepo.save(sampleRecipe('custom_1'));
  customRecipeRepo.save(sampleRecipe('custom_2'));
  assert.equal(customRecipeRepo.getAll().length, 2);
});

test('remove: entfernt genau das Rezept mit der angegebenen id', () => {
  customRecipeRepo.save(sampleRecipe('custom_1'));
  customRecipeRepo.save(sampleRecipe('custom_2'));
  customRecipeRepo.remove('custom_1');
  const all = customRecipeRepo.getAll();
  assert.equal(all.length, 1);
  assert.equal(all[0].id, 'custom_2');
});

test('remove: unbekannte id verändert die Liste nicht', () => {
  customRecipeRepo.save(sampleRecipe('custom_1'));
  customRecipeRepo.remove('nicht-vorhanden');
  assert.equal(customRecipeRepo.getAll().length, 1);
});
