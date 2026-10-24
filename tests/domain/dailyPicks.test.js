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

const day = (kcal, extra = {}) => ({ kcal, ...extra });

test('coreStatus: ohne Einträge neutral "Noch nichts eingetragen" statt Mangel', () => {
  const s = coreStatus({ dayTotals: { kcal: 0 }, last7Totals: Array(7).fill(day(0)), dgeRef: ref, proteinRef: 48 });
  assert.ok(s.every(x => x.status === 'none'));
  assert.equal(STATUS_TEXT.none, 'Noch nichts eingetragen');
});

test('coreStatus: Eiweiß und Ballaststoffe heute, ab 80 % "Schon gut dabei"', () => {
  const today = { kcal: 1500, protein: 40, fiber: 10 };
  const s = coreStatus({ dayTotals: today, last7Totals: [today], dgeRef: ref, proteinRef: 48 });
  const by = Object.fromEntries(s.map(x => [x.key, x]));
  assert.equal(by.protein.status, 'ok');   // 40/48 = 83 %
  assert.equal(by.protein.scope, 'day');
  assert.equal(by.fiber.status, 'more');   // 10/30
  assert.equal(STATUS_TEXT.ok, 'Schon gut dabei');
  assert.equal(STATUS_TEXT.more, 'Da geht noch was');
});

test('coreStatus: Vitamine/Mineralstoffe erst ab 3 Tagen mit Einträgen, vorher "Noch zu wenige Tage"', () => {
  const two = [day(0), day(0), day(0), day(0), day(0), day(1500, { eisen: 20 }), day(1500, { eisen: 20 })];
  const s = coreStatus({ dayTotals: two[6], last7Totals: two, dgeRef: ref, proteinRef: 48 });
  for (const c of s.filter(x => x.scope === 'week')) assert.equal(c.status, 'few', c.key);
});

test('coreStatus: Wochenschnitt zählt nur Tage mit Einträgen – ein vergessener Tag ist kein Mangel', () => {
  const week = [day(0), day(0), day(0), day(0), day(1500, { eisen: 14, cal: 900 }), day(1500, { eisen: 14, cal: 900 }), day(1500, { eisen: 14, cal: 900 })];
  const s = coreStatus({ dayTotals: week[6], last7Totals: week, dgeRef: ref, proteinRef: 48 });
  const by = Object.fromEntries(s.map(x => [x.key, x]));
  assert.equal(by.eisen.amount, 14);       // nicht 6, nicht durch 7 geteilt
  assert.equal(by.eisen.status, 'ok');     // 14/16 = 87,5 %
  assert.equal(by.cal.status, 'ok');       // 900/1000
  assert.equal(by.mag.status, 'more');
  assert.equal(by.eisen.scope, 'week');
});

test('coreStatus: Vitamin D unter 80 % ist "sun" statt "Da geht noch was" und keine Lücke für den Rezeptvorschlag', async () => {
  const { coreGaps, vitaminDNote } = await import('../../app/src/domain/coreNutrients.js');
  const week = Array(5).fill(day(1500, { vit_d: 3 }));
  const s = coreStatus({ dayTotals: week[4], last7Totals: week, dgeRef: ref, proteinRef: 48 });
  assert.equal(s.find(x => x.key === 'vit_d').status, 'sun');
  assert.ok(!coreGaps(s).some(g => g.key === 'vit_d'));
  assert.match(vitaminDNote(new Date('2026-07-01')), /April bis September/);
  assert.match(vitaminDNote(new Date('2026-11-01')), /Hausarztpraxis/);
  assert.ok(!/Präparat|Supplement|Tablette|einnehmen/i.test(vitaminDNote(new Date('2026-11-01'))));
});

test('defaultProteinRef: 0,8 g/kg bei Referenzgewicht, Männer höher, "Keine Angabe" dazwischen', () => {
  assert.ok(defaultProteinRef('m') > defaultProteinRef('f'));
  assert.ok(defaultProteinRef('') > defaultProteinRef('f') && defaultProteinRef('') < defaultProteinRef('m'));
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
