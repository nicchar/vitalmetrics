import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repairPlan, recipeMatchesIntolerance, buildShoppingList, seasonOf, isInSeason, getEligiblePool } from '../../app/src/domain/mealPlan.js';

const R = (id, mealType, extra = {}) => ({ id, title: id, mealType, category: 'vegetarisch', vegetarian: true, lowCarb: false, seasons: ['g'], tags: [], ingredients: [], steps: [], servings: 2, ...extra });
const recipes = [R('f1', 'breakfast'), R('f2', 'breakfast'), R('m1', 'lunch'), R('m2', 'lunch'), R('m3', 'lunch'),
  R('fleisch', 'breakfast', { vegetarian: false, category: 'fleisch_fisch' })];

test('repairPlan: ersetzt gelöschte Rezept-IDs passend zur Mahlzeit und entfernt Pins auf gelöschte Rezepte', () => {
  const plan = { weekStart: '2026-10-19', category: 'vegetarisch', pins: { lunch: 'weg' }, days: [
    { date: '2026-10-19', weekday: 'Montag', breakfast: 'alt_frueh', lunch: 'm1', dinner: 'alt_abend' },
  ] };
  const { plan: fixed, changed } = repairPlan(plan, recipes);
  assert.equal(changed, true);
  assert.ok(['f1', 'f2'].includes(fixed.days[0].breakfast));
  assert.ok(['m2', 'm3'].includes(fixed.days[0].dinner), 'Abend darf nicht das Mittagsrezept doppeln');
  assert.equal(fixed.days[0].lunch, 'm1');
  assert.deepEqual(fixed.pins, {});
});

test('repairPlan: unveränderter Plan bleibt dasselbe Objekt', () => {
  const plan = { weekStart: '2026-10-19', category: 'vegetarisch', days: [{ breakfast: 'f1', lunch: 'm1', dinner: 'm2' }] };
  const res = repairPlan(plan, recipes);
  assert.equal(res.changed, false);
  assert.equal(res.plan, plan);
});

test('getEligiblePool: Vegetarisch filtert auch das Frühstück (Bugfix 2.2)', () => {
  const pool = getEligiblePool(recipes, 'vegetarisch');
  assert.ok(!pool.breakfast.some(r => r.id === 'fleisch'));
  assert.ok(getEligiblePool(recipes, 'gemischt').breakfast.some(r => r.id === 'fleisch'));
});

test('recipeMatchesIntolerance: nutzt strukturierte Allergene, wenn vorhanden', () => {
  assert.equal(recipeMatchesIntolerance({ allergens: ['milk'], ingredients: [] }, 'laktose'), true);
  assert.equal(recipeMatchesIntolerance({ allergens: ['peanut'], ingredients: [] }, 'nuesse'), true);
  // "Kokosmilch" enthält keine Milch - die alte Wortsuche hat das falsch erkannt
  assert.equal(recipeMatchesIntolerance({ allergens: [], ingredients: ['400 ml Kokosmilch'] }, 'laktose'), false);
});

test('buildShoppingList: summiert strukturierte Zutaten und skaliert auf Personen', () => {
  const a = { servings: 2, ingredientsData: [{ qty: 200, unit: 'g', name: 'Haferflocken' }, { qty: null, unit: '', name: 'Salz, Pfeffer' }] };
  const b = { servings: 4, ingredientsData: [{ qty: 400, unit: 'g', name: 'Haferflocken' }, { qty: 1, unit: 'Dose', name: 'Kichererbsen (240 g abgetropft)' }, { qty: 500, unit: 'ml', name: 'Wasser' }] };
  const list = buildShoppingList({ days: [{ breakfastRecipe: a, lunchRecipe: b, dinnerRecipe: null }] }, 2).map(i => i.label);
  assert.ok(list.includes('400 g Haferflocken'), list.join(' | '));
  assert.ok(list.some(l => /Dose Kichererbsen$/.test(l)), list.join(' | '));
  assert.ok(!list.some(l => /Wasser/.test(l)));
});

test('seasonOf/isInSeason: Oktober ist Herbst, Sommerrezepte sind nicht in Saison', () => {
  assert.equal(seasonOf('2026-10-19'), 'h');
  assert.equal(seasonOf('2026-01-05'), 'w');
  assert.equal(isInSeason({ seasons: ['s'] }, 'h'), false);
  assert.equal(isInSeason({ seasons: ['g'] }, 'h'), true);
  assert.equal(isInSeason({}, 'h'), true);
});

test('2.2 Einkaufsliste: Vorratszutaten getrennt, alphabetisch nach Zutat, einkaufstaugliche Mengen', async () => {
  const { buildShoppingList: build } = await import('../../app/src/domain/mealPlan.js');
  const r = { servings: 4, ingredientsData: [
    { qty: 1, unit: 'Bund', name: 'Petersilie' }, { qty: 250, unit: 'g', name: 'Bergkäse' },
    { qty: 1, unit: 'TL', name: 'Kreuzkümmel' }, { qty: 2, unit: 'EL', name: 'Olivenöl' },
    { qty: null, unit: '', name: 'Salz, Pfeffer' }, { qty: 3, unit: '', name: 'Zwiebeln' },
  ] };
  const list = build({ days: [{ breakfastRecipe: null, lunchRecipe: r, dinnerRecipe: null }] }, 2.5);
  const by = Object.fromEntries(list.map(i => [i.name, i]));
  assert.equal(by['Petersilie'].label, '1 Bund Petersilie');
  assert.equal(by['Bergkäse'].label, '160 g Bergkäse');
  assert.equal(by['Zwiebeln'].label, '2 Zwiebeln');
  assert.equal(by['Kreuzkümmel'].pantry, true);
  assert.equal(by['Olivenöl'].pantry, true);
  assert.equal(by['Bergkäse'].pantry, false);
  const names = list.map(i => i.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'de')));
});
