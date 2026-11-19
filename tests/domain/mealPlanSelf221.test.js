import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  emptyPlan, ensureCurrentPlan, setDaySlot, resolvePlan, buildShoppingList,
  addCustomShoppingItem, removeCustomShoppingItem, setShoppingChecked,
  setMeTime, meTimeFor, ME_TIME_IDEAS,
} from '../../app/src/domain/mealPlan.js';
import { shareText, PLAY_URL } from '../../app/src/infra/share/recipeShare.js';

const recipes = JSON.parse(readFileSync(new URL('../../app/src/data/recipes.json', import.meta.url), 'utf8'));

test('emptyPlan: 7 leere Tage ab Montag, Einkaufsliste leer', () => {
  const p = emptyPlan('2026-11-23');
  assert.equal(p.days.length, 7);
  assert.equal(p.days[0].weekday, 'Montag');
  assert.ok(p.days.every(d => !d.breakfast && !d.lunch && !d.dinner));
  assert.equal(p.selfBuilt, true);
  assert.deepEqual(buildShoppingList(resolvePlan(p, recipes), 2), []);
});

test('ensureCurrentPlan: behält den Plan dieser Woche, ersetzt alte/fehlende durch eine leere Woche', () => {
  const cur = emptyPlan('2026-11-23');
  assert.equal(ensureCurrentPlan(cur, '2026-11-23').plan, cur);
  const r1 = ensureCurrentPlan(null, '2026-11-23');
  assert.equal(r1.created, true);
  const r2 = ensureCurrentPlan({ ...emptyPlan('2026-11-16', 'vegetarisch'), portions: 3 }, '2026-11-23');
  assert.equal(r2.created, true);
  assert.equal(r2.plan.weekStart, '2026-11-23');
  assert.equal(r2.plan.category, 'vegetarisch');
  assert.equal(r2.plan.portions, 3);
});

test('Selbst zusammenstellen: Rezept einsetzen -> erscheint in der Einkaufsliste', () => {
  const r = recipes.find(x => x.id === 'linsen_dal_spinat_kokos');
  const p = setDaySlot(emptyPlan('2026-11-23'), '2026-11-23', 'dinner', r.id);
  const list = buildShoppingList(resolvePlan(p, recipes), 2);
  assert.ok(list.some(i => /linsen/i.test(i.name)));
});

test('Eigene Einkaufs-Einträge: hinzufügen, keine Dubletten, abhaken und entfernen', () => {
  let p = emptyPlan('2026-11-23');
  p = addCustomShoppingItem(p, '  Kaffee ');
  p = addCustomShoppingItem(p, 'kaffee');
  p = addCustomShoppingItem(p, '');
  assert.deepEqual(p.customShopping, ['Kaffee']);
  p = setShoppingChecked(p, 'Kaffee', true);
  p = removeCustomShoppingItem(p, 'Kaffee');
  assert.deepEqual(p.customShopping, []);
  assert.equal(p.shoppingChecked.Kaffee, undefined);
});

test('Me-Time: je Tag setzen und entfernen, Ideen ohne Wirkversprechen', () => {
  let p = setMeTime(emptyPlan('2026-11-23'), '2026-11-25', '30 Minuten raus');
  assert.equal(meTimeFor(p, '2026-11-25'), '30 Minuten raus');
  p = setMeTime(p, '2026-11-25', '');
  assert.equal(meTimeFor(p, '2026-11-25'), null);
  assert.ok(ME_TIME_IDEAS.length >= 6);
  assert.ok(!/hilft|senkt|heilt|gegen|besser schlafen/i.test(ME_TIME_IDEAS.join(' ')));
});

test('Rezept teilen: Text enthält Titel, Zutaten und Store-Link mit utm', () => {
  const r = recipes.find(x => x.id === 'skyr_walnuesse_zimt');
  const t = shareText(r);
  assert.ok(t.startsWith(r.title));
  assert.ok(t.includes(PLAY_URL));
  assert.ok(/utm_medium%3Dshare/.test(PLAY_URL));
});
