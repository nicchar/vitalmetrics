import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getEligiblePool, setDaySlot, freeSlot, freeSlotLabel, swapSuggestions, searchSwapOptions,
  setShoppingChecked, resolvePlan, buildShoppingList, repairPlan, setEaten, isEaten,
} from '../../app/src/domain/mealPlan.js';

const R = (id, mealType, extra = {}) => ({ id, title: id, mealType, category: 'vegetarisch', vegetarian: true, lowCarb: false, seasons: ['g'], tags: [], steps: [], servings: 2, ingredients: [`200 g ${id}-Zutat`], ...extra });
const recipes = [R('f1', 'breakfast'), R('f2', 'breakfast'), R('f3', 'breakfast'),
  R('m1', 'lunch'), R('m2', 'lunch'), R('m3', 'lunch'), R('Linsensuppe', 'lunch'),
  R('fleisch', 'breakfast', { vegetarian: false, category: 'fleisch_fisch' })];
const plan = () => ({ weekStart: '2026-11-09', category: 'vegetarisch', pins: {}, days: [
  { date: '2026-11-09', weekday: 'Montag', breakfast: 'f1', lunch: 'm1', dinner: 'm2' },
  { date: '2026-11-10', weekday: 'Dienstag', breakfast: 'f2', lunch: 'm2', dinner: 'm3' },
] });

test('freeSlot: Mahlzeit freilassen, Label merken, fällt aus der Einkaufsliste', () => {
  const p = freeSlot(plan(), '2026-11-09', 'lunch', 'Auswärts essen');
  assert.equal(p.days[0].lunch, null);
  assert.equal(freeSlotLabel(p, '2026-11-09', 'lunch'), 'Auswärts essen');
  const names = buildShoppingList(resolvePlan(p, recipes), 1).map(i => i.name);
  assert.ok(!names.some(n => n.startsWith('m1')), 'm1 darf nicht mehr auf der Liste stehen');
  assert.ok(names.some(n => n.startsWith('m2')));
});

test('freeSlot: hebt "gegessen" für diesen Platz auf; setDaySlot macht den Platz wieder zum Rezept', () => {
  let p = setEaten(plan(), '2026-11-09', 'lunch', true);
  p = freeSlot(p, '2026-11-09', 'lunch', 'Reste vom Vortag');
  assert.equal(isEaten(p, '2026-11-09', 'lunch'), false);
  p = setDaySlot(p, '2026-11-09', 'lunch', 'm3');
  assert.equal(p.days[0].lunch, 'm3');
  assert.equal(freeSlotLabel(p, '2026-11-09', 'lunch'), null);
});

test('repairPlan lässt freigelassene Plätze leer', () => {
  const p = freeSlot(plan(), '2026-11-10', 'dinner', 'Eigenes Gericht');
  const { plan: fixed, changed } = repairPlan(p, recipes);
  assert.equal(changed, false);
  assert.equal(fixed.days[1].dinner, null);
});

test('swapSuggestions: nur passende Rezepte, nicht das aktuelle, bevorzugt noch nicht eingeplante', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch');
  const s = swapSuggestions(pool, 'breakfast', plan(), 'f1', 4, () => 0.5);
  assert.ok(s.length >= 1);
  assert.ok(s.every(r => r.mealType === 'breakfast' && r.id !== 'f1' && r.id !== 'fleisch'));
  const s1 = swapSuggestions(pool, 'breakfast', plan(), 'f1', 1, () => 0.1);
  assert.equal(s1[0].id, 'f3', 'f3 kommt diese Woche noch nicht vor');
});

test('searchSwapOptions: sucht im Titel, ab 2 Zeichen, ohne das aktuelle Rezept', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch');
  assert.deepEqual(searchSwapOptions(pool, 'lunch', 'l', null), []);
  assert.deepEqual(searchSwapOptions(pool, 'lunch', 'LINSEN', null).map(r => r.id), ['Linsensuppe']);
  assert.deepEqual(searchSwapOptions(pool, 'lunch', 'm1', 'm1'), []);
});

test('setShoppingChecked: Haken setzen und entfernen, ohne den Plan sonst zu ändern', () => {
  let p = setShoppingChecked(plan(), '200 g m1-Zutat', true);
  assert.equal(p.shoppingChecked['200 g m1-Zutat'], true);
  p = setShoppingChecked(p, '200 g m1-Zutat', false);
  assert.deepEqual(p.shoppingChecked, {});
  assert.equal(p.days.length, 2);
});
