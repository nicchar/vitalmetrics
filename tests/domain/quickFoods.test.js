import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { QUICK_FOODS, quickFoodsFor } from '../../app/src/domain/quickFoods.js';
import { getDGERef } from '../../app/src/domain/nutrition.js';

const db = Object.fromEntries(JSON.parse(readFileSync(new URL('../../app/src/data/foodDatabase.json', import.meta.url), 'utf-8')).map(d => [d.id, d]));
// Strengster Fall: höchste Referenz je Nährstoff (Frauen bis 50: Eisen 16 mg)
const ref = { ...Object.fromEntries(Object.entries(getDGERef('25-50', 'f')).map(([k, v]) => [k, v.ref])), protein: 48 };

test('quickFoods: jede Portion liefert laut BLS 4.0 spürbar etwas (≥ 15 %, Eisen ≥ 12 %)', () => {
  for (const [key, list] of Object.entries(QUICK_FOODS)) {
    for (const f of list) {
      const food = db[f.bls];
      assert.ok(food, `${f.bls} (${f.label}) nicht im BLS`);
      const share = ((food[key] || 0) * f.grams / 100) / ref[key];
      assert.ok(share >= (key === 'eisen' ? 0.12 : 0.15), `${key}: ${f.label} liefert nur ${Math.round(share * 100)} %`);
    }
  }
});

test('quickFoods: Vitamin D bewusst ohne Liste, sonst jeder Kernwert mit mindestens 4 Lebensmitteln', () => {
  assert.equal(QUICK_FOODS.vit_d, undefined);
  for (const key of ['protein', 'fiber', 'eisen', 'cal', 'mag', 'folat', 'b12']) assert.ok(QUICK_FOODS[key].length >= 4, key);
});

test('quickFoodsFor: vegetarisch ohne Fleisch und Fisch, stabil pro Tag, höchstens 3', () => {
  for (const key of Object.keys(QUICK_FOODS)) {
    const list = quickFoodsFor(key, 'vegetarisch', '2026-10-24');
    assert.ok(list.length > 0 && list.length <= 3);
    assert.ok(list.every(f => f.diet !== 'meat'), key);
  }
  assert.deepEqual(quickFoodsFor('eisen', null, '2026-10-24'), quickFoodsFor('eisen', null, '2026-10-24'));
});
