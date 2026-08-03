import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guessMealTypeByTime, groupEntriesByMealType, MEAL_TYPES, MEAL_TYPES_FOR_DISPLAY } from '../../app/src/domain/mealType.js';

/**
 * mealType.test.js
 *
 * Feature "Mahlzeiten-Kategorisierung" (03.08.2026): Frühstück/Mittag/Abend/
 * Snack statt einer flachen Liste im Ernährungstagebuch.
 */

function atHour(h) {
  const d = new Date();
  d.setHours(h, 0, 0, 0);
  return d;
}

test('guessMealTypeByTime: 7 Uhr -> Fruehstueck', () => {
  assert.equal(guessMealTypeByTime(atHour(7)), 'breakfast');
});

test('guessMealTypeByTime: 13 Uhr -> Mittag', () => {
  assert.equal(guessMealTypeByTime(atHour(13)), 'lunch');
});

test('guessMealTypeByTime: 16 Uhr -> Snack', () => {
  assert.equal(guessMealTypeByTime(atHour(16)), 'snack');
});

test('guessMealTypeByTime: 19 Uhr -> Abend', () => {
  assert.equal(guessMealTypeByTime(atHour(19)), 'dinner');
});

test('guessMealTypeByTime: 1 Uhr nachts -> Snack als neutralster Default', () => {
  assert.equal(guessMealTypeByTime(atHour(1)), 'snack');
});

test('guessMealTypeByTime: Grenzwerte gehoeren zur spaeteren Kategorie (11 Uhr -> Mittag, nicht mehr Fruehstueck)', () => {
  assert.equal(guessMealTypeByTime(atHour(11)), 'lunch');
  assert.equal(guessMealTypeByTime(atHour(18)), 'dinner');
  assert.equal(guessMealTypeByTime(atHour(23)), 'snack');
});

test('MEAL_TYPES: genau die 4 waehlbaren Kategorien aus dem Feature-Wunsch, "Sonstiges" ist NICHT waehlbar', () => {
  const keys = MEAL_TYPES.map(mt => mt.key);
  assert.deepEqual(keys, ['breakfast', 'lunch', 'dinner', 'snack']);
  assert.ok(!keys.includes('other'), '"Sonstiges" darf keine aktive Auswahl-Option sein, nur automatischer Auffangwert');
});

test('groupEntriesByMealType: gruppiert in fester Reihenfolge Fruehstueck->Mittag->Abend->Snack->Sonstiges', () => {
  const entries = [
    { food: { name: 'Abendbrot', kal: 300 }, grams: 100, mealType: 'dinner' },
    { food: { name: 'Kaffee+Brot', kal: 200 }, grams: 100, mealType: 'breakfast' },
    { food: { name: 'Alt-Eintrag ohne Kategorie', kal: 50 }, grams: 100 }, // simuliert Alt-Daten
  ];
  const groups = groupEntriesByMealType(entries);
  assert.deepEqual(groups.map(g => g.key), ['breakfast', 'dinner', 'other']);
});

test('groupEntriesByMealType: leere Kategorien tauchen nicht auf', () => {
  const entries = [{ food: { name: 'Snack', kal: 100 }, grams: 100, mealType: 'snack' }];
  const groups = groupEntriesByMealType(entries);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].key, 'snack');
});

test('groupEntriesByMealType: behaelt den Original-Index aus dem ungruppierten Array (fuer removeEntry)', () => {
  const entries = [
    { food: { name: 'A', kal: 100 }, grams: 100, mealType: 'dinner' },
    { food: { name: 'B', kal: 100 }, grams: 100, mealType: 'breakfast' },
    { food: { name: 'C', kal: 100 }, grams: 100, mealType: 'dinner' },
  ];
  const groups = groupEntriesByMealType(entries);
  const breakfast = groups.find(g => g.key === 'breakfast');
  const dinner = groups.find(g => g.key === 'dinner');
  assert.equal(breakfast.items[0].idx, 1);
  assert.deepEqual(dinner.items.map(i => i.idx), [0, 2]);
});

test('groupEntriesByMealType: rechnet die kcal-Zwischensumme je Gruppe korrekt', () => {
  const entries = [
    { food: { name: 'A', kal: 200 }, grams: 100, mealType: 'lunch' }, // 200 kcal
    { food: { name: 'B', kal: 100 }, grams: 50, mealType: 'lunch' },  // 50 kcal
  ];
  const groups = groupEntriesByMealType(entries);
  assert.equal(groups[0].kcal, 250);
});

test('groupEntriesByMealType: unbekannter mealType-Wert landet defensiv unter "Sonstiges"', () => {
  const entries = [{ food: { name: 'X', kal: 100 }, grams: 100, mealType: 'irgendwas-unbekanntes' }];
  const groups = groupEntriesByMealType(entries);
  assert.equal(groups[0].key, 'other');
});

test('MEAL_TYPES_FOR_DISPLAY: "Sonstiges" steht ganz am Ende', () => {
  assert.equal(MEAL_TYPES_FOR_DISPLAY[MEAL_TYPES_FOR_DISPLAY.length - 1].key, 'other');
});
