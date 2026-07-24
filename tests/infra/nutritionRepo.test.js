import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// nutritionRepo -> sqlite.js -> localStorage. In der App (Browser/Capacitor
// WebView) ist das immer vorhanden, im Node-Testlauf brauchen wir einen
// minimalen In-Memory-Ersatz, bevor das Modul importiert wird.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { nutritionRepo } = await import('../../app/src/infra/db/repositories/nutritionRepo.js');

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('getDayTotals: 0 fuer alle Mikronaehrstoffe ohne Eintraege', () => {
  const totals = nutritionRepo.getDayTotals(isoDaysAgo(0));
  assert.equal(totals.vit_d, 0);
  assert.equal(totals.eisen, 0);
  assert.equal(totals.kcal, 0);
});

test('addEntry + getDayTotals: rechnet Naehrwerte anteilig nach Gramm hoch', () => {
  const today = isoDaysAgo(0);
  const food = { name: 'Testfisch', kal: 200, protein: 20, fat: 10, carbs: 0, vit_d: 20, eisen: 2 };
  nutritionRepo.addEntry(today, { food, grams: 200 }); // Faktor 2
  const totals = nutritionRepo.getDayTotals(today);
  assert.equal(totals.kcal, 400);
  assert.equal(totals.vit_d, 40);
  assert.equal(totals.eisen, 4);
});

test('removeEntry: entfernt genau den Eintrag am angegebenen Index', () => {
  const today = isoDaysAgo(0);
  nutritionRepo.addEntry(today, { food: { name: 'A', kal: 100 }, grams: 100 });
  nutritionRepo.addEntry(today, { food: { name: 'B', kal: 50 }, grams: 100 });
  nutritionRepo.removeEntry(today, 0);
  const entries = nutritionRepo.getDay(today);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].food.name, 'B');
});

test('getCoverageHistory: liefert 0% fuer Tage ohne Eintraege', () => {
  const history = nutritionRepo.getCoverageHistory('vit_d', 20, 5);
  assert.equal(history.length, 5);
  assert.ok(history.every(d => d.pct === 0 && d.amount === 0));
});

test('getCoverageHistory: berechnet Prozent-Deckung korrekt fuer heute', () => {
  const today = isoDaysAgo(0);
  nutritionRepo.addEntry(today, { food: { name: 'Lachs', kal: 200, vit_d: 10 }, grams: 200 }); // 20 vit_d
  const history = nutritionRepo.getCoverageHistory('vit_d', 20, 3);
  const todayEntry = history[history.length - 1];
  assert.equal(todayEntry.date, today);
  assert.equal(todayEntry.amount, 20);
  assert.equal(todayEntry.pct, 100);
});

test('getCoverageHistory: deckelt Prozentwert bei 150%, auch bei sehr hoher Zufuhr', () => {
  const today = isoDaysAgo(0);
  nutritionRepo.addEntry(today, { food: { name: 'Vit-D-Bombe', kal: 100, vit_d: 100 }, grams: 100 }); // 100 vit_d
  const history = nutritionRepo.getCoverageHistory('vit_d', 20, 1);
  assert.equal(history[0].pct, 150); // 500% real, gedeckelt auf 150
});

test('getCoverageHistory: gibt leeres Array zurueck ohne gueltigen Referenzwert', () => {
  assert.deepEqual(nutritionRepo.getCoverageHistory('vit_d', null, 5), []);
  assert.deepEqual(nutritionRepo.getCoverageHistory('vit_d', 0, 5), []);
});

test('getFrequentFoods: leeres Array ohne Eintraege', () => {
  assert.deepEqual(nutritionRepo.getFrequentFoods(), []);
});

test('getFrequentFoods: sortiert nach Haeufigkeit, oefter gegessenes zuerst (Quick-Add-Bugfix Juli 2026)', () => {
  const today = isoDaysAgo(0);
  const gestern = isoDaysAgo(1);
  const haferMahlzeit = { name: 'Haferflocken', id: 'hafer', kal: 380 };
  const apfelMahlzeit = { name: 'Apfel', id: 'apfel', kal: 52 };
  nutritionRepo.addEntry(today, { food: haferMahlzeit, grams: 60 });
  nutritionRepo.addEntry(gestern, { food: haferMahlzeit, grams: 50 });
  nutritionRepo.addEntry(gestern, { food: apfelMahlzeit, grams: 150 });

  const frequent = nutritionRepo.getFrequentFoods(30, 8);
  assert.equal(frequent[0].food.id, 'hafer');
  assert.equal(frequent[0].count, 2);
  assert.equal(frequent[0].grams, 60); // letzte verwendete Grammzahl (heute)
  assert.equal(frequent[1].food.id, 'apfel');
});

test('getFrequentFoods: respektiert das limit', () => {
  for (let i = 0; i < 5; i++) {
    nutritionRepo.addEntry(isoDaysAgo(0), { food: { name: `Food${i}`, id: `f${i}` }, grams: 100 });
  }
  assert.equal(nutritionRepo.getFrequentFoods(30, 3).length, 3);
});
