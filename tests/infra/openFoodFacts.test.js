import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { mapOFFFood, searchOpenFoodFacts, fetchProductByBarcode } from '../../app/src/infra/external/openFoodFacts.js';

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
});

function mockFetch(jsonBody, ok = true, status = 200) {
  globalThis.fetch = async () => ({
    ok,
    status,
    json: async () => jsonBody,
  });
}

test('mapOFFFood: mappt Kernfelder korrekt und rundet sinnvoll', () => {
  const product = {
    product_name: 'Testmüsli',
    brands: 'Testmarke, Zweitname',
    categories_tags: ['en:cereals'],
    nutriments: {
      'energy-kcal_100g': 123.4,
      proteins_100g: 5.55,
      fat_100g: 2.222,
      carbohydrates_100g: 60,
      iron_100g: 1.2,
    },
  };
  const food = mapOFFFood(product);
  assert.equal(food.name, 'Testmüsli');
  assert.equal(food.brand, 'Testmarke');
  assert.equal(food.emoji, '🥣');
  assert.equal(food.kal, 123);
  assert.equal(food.protein, 5.6);
  assert.equal(food.fat, 2.2);
  assert.equal(food.carbs, 60);
  assert.equal(food.eisen, 1.2);
  assert.equal(food.source, 'openfoodfacts');
});

test('mapOFFFood: fehlender Name faellt auf "Unbekannt" zurueck, keine Exceptions bei leeren nutriments', () => {
  const food = mapOFFFood({});
  assert.equal(food.name, 'Unbekannt');
  assert.equal(food.kal, 0);
  assert.equal(food.brand, '');
});

test('searchOpenFoodFacts: mapped nur Produkte mit Namen und nutriments', async () => {
  mockFetch({
    products: [
      { product_name: 'A', nutriments: { 'energy-kcal_100g': 10 } },
      { product_name: '', nutriments: { 'energy-kcal_100g': 20 } }, // kein Name -> raus
      { nutriments: { 'energy-kcal_100g': 30 } }, // kein Name -> raus
      { product_name: 'B' }, // keine nutriments -> raus
    ],
  });
  const foods = await searchOpenFoodFacts('testquery');
  assert.equal(foods.length, 1);
  assert.equal(foods[0].name, 'A');
});

test('searchOpenFoodFacts: wirft bei HTTP-Fehler', async () => {
  mockFetch({}, false, 500);
  await assert.rejects(() => searchOpenFoodFacts('x'), /HTTP 500/);
});

test('fetchProductByBarcode (Block F Phase 4): gibt gemapptes Produkt bei Treffer zurueck', async () => {
  mockFetch({
    status: 1,
    product: {
      product_name: 'Gescanntes Produkt',
      brands: 'Marke X',
      nutriments: { 'energy-kcal_100g': 250, proteins_100g: 8 },
    },
  });
  const food = await fetchProductByBarcode('4001234567890');
  assert.ok(food);
  assert.equal(food.name, 'Gescanntes Produkt');
  assert.equal(food.kal, 250);
  assert.equal(food.source, 'openfoodfacts');
});

test('fetchProductByBarcode: gibt null zurueck wenn Barcode bei OFF unbekannt (status 0)', async () => {
  mockFetch({ status: 0 });
  const food = await fetchProductByBarcode('0000000000000');
  assert.equal(food, null);
});

test('fetchProductByBarcode: gibt null zurueck wenn product-Objekt fehlt oder keinen Namen hat', async () => {
  mockFetch({ status: 1, product: {} });
  const food = await fetchProductByBarcode('123');
  assert.equal(food, null);
});

test('fetchProductByBarcode: wirft bei HTTP-Fehler wie die bestehende Suche', async () => {
  mockFetch({}, false, 404);
  await assert.rejects(() => fetchProductByBarcode('123'), /HTTP 404/);
});
