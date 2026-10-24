import { test } from 'node:test';
import assert from 'node:assert/strict';
import { household, householdPortions, householdServings, householdLabel } from '../../app/src/domain/household.js';
import { isEaten, setEaten } from '../../app/src/domain/mealPlan.js';

test('household: ohne Angabe nicht gesetzt, Fallback greift', () => {
  assert.equal(household({}).isSet, false);
  assert.equal(householdPortions({}, 2), 2);
  assert.equal(householdServings({}), null);
  assert.equal(householdLabel({}), null);
});

test('household: Kind zählt als halbe Portion, Rezeptseite rundet auf', () => {
  const p = { householdAdults: 2, householdKids: 1 };
  assert.equal(householdPortions(p), 2.5);
  assert.equal(householdServings(p), 3);
  assert.equal(householdLabel(p), '2 Erwachsene und 1 Kind');
  assert.equal(householdLabel({ householdAdults: 1 }), '1 Erwachsener');
  assert.equal(householdLabel({ householdAdults: 1, householdKids: 2 }), '1 Erwachsener und 2 Kinder');
});

test('household: nur Kinder ergibt mindestens 1 Portion, Werte werden begrenzt', () => {
  assert.equal(householdPortions({ householdKids: 1 }), 1);
  assert.equal(household({ householdAdults: 99, householdKids: -3 }).adults, 8);
  assert.equal(household({ householdAdults: 99, householdKids: -3 }).kids, 0);
});

test('setEaten/isEaten: pro Tag und Mahlzeit, unveränderlich', () => {
  const plan = { days: [] };
  const p2 = setEaten(plan, '2026-10-20', 'lunch', true);
  assert.equal(isEaten(p2, '2026-10-20', 'lunch'), true);
  assert.equal(isEaten(p2, '2026-10-20', 'dinner'), false);
  assert.equal(isEaten(plan, '2026-10-20', 'lunch'), false);
  assert.equal(isEaten(setEaten(p2, '2026-10-20', 'lunch', false), '2026-10-20', 'lunch'), false);
});

test('recipeFormat: küchentaugliches Runden beim Hochrechnen', async () => {
  const { scaledLine, sourceName } = await import('../../app/src/ui/components/recipeFormat.js');
  const f = 3 / 4;
  assert.deepEqual(scaledLine({ qty: 150, unit: 'g', name: 'Naturjoghurt' }, f), ['115 g', 'Naturjoghurt']);
  assert.deepEqual(scaledLine({ qty: 0.5, unit: '', name: 'Zitrone' }, f), ['½', 'Zitrone']);
  assert.deepEqual(scaledLine({ qty: 0.5, unit: 'TL', name: 'Kreuzkümmel' }, f), ['½ TL', 'Kreuzkümmel']);
  assert.deepEqual(scaledLine({ qty: 2, unit: 'EL', name: 'Öl' }, f), ['1 ½ EL', 'Öl']);
  assert.deepEqual(scaledLine({ qty: 1, unit: '', name: 'Zucchini' }, f), ['¾', 'Zucchini']);
  assert.deepEqual(scaledLine({ qty: 200, unit: 'g', name: 'Linsen' }, 2), ['400 g', 'Linsen']);
  assert.deepEqual(scaledLine({ qty: 30, unit: 'g', name: 'Nüsse' }, f), ['23 g', 'Nüsse']);
  assert.equal(sourceName('Kichererbsen (240 g abgetropft)'), 'Kichererbsen');
  assert.equal(sourceName('Salz, Pfeffer'), 'Jodsalz');
});
