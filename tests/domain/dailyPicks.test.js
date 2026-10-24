import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coreStatus, CORE_KEYS, STATUS_TEXT, defaultProteinRef } from '../../app/src/domain/coreNutrients.js';
import { recipeOfTheDay, recipeForNutrient, personalPool } from '../../app/src/domain/dailyPicks.js';
import { getDGERef } from '../../app/src/domain/nutrition.js';

const recipes = JSON.parse(readFileSync(new URL('../../app/src/data/recipes.json', import.meta.url), 'utf-8'));
const ref = getDGERef('25-50', 'f');

test('coreNutrients: genau die 8 Kernwerte der Startseite', () => {
  assert.deepEqual(CORE_KEYS, ['protein', 'fiber', 'eisen', 'cal', 'mag', 'vit_d', 'folat', 'b12']);
});

test('coreStatus: ohne Einträge neutral "Noch nichts eingetragen" statt Mangel', () => {
  const s = coreStatus({ kcal: 0 }, ref, 48);
  assert.ok(s.every(x => x.status === 'none'));
  assert.equal(STATUS_TEXT.none, 'Noch nichts eingetragen');
});

test('coreStatus: ab 80 % "Schon gut dabei", darunter "Da geht noch was"', () => {
  const s = coreStatus({ kcal: 1500, protein: 40, fiber: 10, eisen: 16, cal: 800, mag: 300, vit_d: 2, folat: 240, b12: 4 }, ref, 48);
  const by = Object.fromEntries(s.map(x => [x.key, x.status]));
  assert.equal(by.protein, 'ok');      // 40/48 = 83 %
  assert.equal(by.fiber, 'more');      // 10/30
  assert.equal(by.cal, 'ok');          // 80 %
  assert.equal(by.vit_d, 'more');
  assert.equal(STATUS_TEXT.ok, 'Schon gut dabei');
  assert.equal(STATUS_TEXT.more, 'Da geht noch was');
});

test('defaultProteinRef: 0,8 g/kg bei Referenzgewicht, Männer höher', () => {
  assert.ok(defaultProteinRef('m') > defaultProteinRef('f'));
});

test('recipeOfTheDay: stabil für ein Datum, ein Hauptgericht der Saison, wechselt über die Tage', () => {
  const a = recipeOfTheDay(recipes, '2026-10-23');
  const b = recipeOfTheDay(recipes, '2026-10-23');
  assert.equal(a.id, b.id);
  assert.equal(a.mealType, 'lunch');
  assert.ok(a.seasons.includes('g') || a.seasons.includes('h'), `${a.title} ist im Oktober nicht in Saison`);
  const ids = new Set(['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'].map(d => recipeOfTheDay(recipes, d).id));
  assert.ok(ids.size >= 4, 'Rezept des Tages sollte über die Woche wechseln');
});

test('recipeForNutrient: liefert ein Rezept, das den Nährstoff im Fokus hat, und nicht das Rezept des Tages', () => {
  for (const key of ['eisen', 'fiber', 'cal', 'vit_d', 'folat', 'b12', 'mag', 'protein']) {
    const r = recipeForNutrient(recipes, key, '2026-10-23', 'kein');
    assert.ok(r, `kein Rezept für ${key}`);
    assert.ok(r.focus.some(f => f.key === key), `${r.title} hat ${key} nicht im Fokus`);
  }
  const rdt = recipeOfTheDay(recipes, '2026-10-23');
  const hint = recipeForNutrient(recipes, 'eisen', '2026-10-23', rdt.id);
  assert.notEqual(hint.id, rdt.id);
});

test('personalPool: Vegetarisch, Low Carb und Unverträglichkeiten werden berücksichtigt', () => {
  assert.ok(personalPool(recipes, 'vegetarisch').every(r => r.vegetarian));
  assert.ok(personalPool(recipes, 'keto').every(r => r.lowCarb));
  assert.ok(personalPool(recipes, null, ['laktose']).every(r => !(r.allergens || []).includes('milk')));
  assert.equal(personalPool(recipes, null).length, recipes.length);
});
