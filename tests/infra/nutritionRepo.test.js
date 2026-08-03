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

// Mehrwochen-Ernaehrungsverlauf (Premium-Idee 25.07.2026)

test('getWeeklyTotals: liefert die angeforderte Anzahl Wochen, aufsteigend (aelteste zuerst, aktuelle Woche zuletzt)', () => {
  const weeks = nutritionRepo.getWeeklyTotals(12);
  assert.equal(weeks.length, 12);
  assert.equal(weeks[11].weekEnd, isoDaysAgo(0)); // letzter Block endet heute
});

test('getWeeklyTotals: Woche ganz ohne Eintraege hat loggedDays 0 und alle Werte 0 (kein Crash)', () => {
  const weeks = nutritionRepo.getWeeklyTotals(3);
  for (const w of weeks) {
    assert.equal(w.loggedDays, 0);
    assert.equal(w.avgKcal, 0);
    assert.equal(w.vit_d, 0);
  }
});

test('getWeeklyTotals: mittelt kcal/Mikronaehrstoffe nur ueber tatsaechlich geloggte Tage der jeweiligen Woche', () => {
  // Heute + vor 1 Tag geloggt -> beide in der aktuellen Woche (Block 0..6 Tage zurueck)
  const food = { kal: 200, protein: 10, fat: 5, carbs: 20, vit_d: 4 };
  nutritionRepo.addEntry(isoDaysAgo(0), { food, grams: 100 }); // 200 kcal, 4 vit_d
  nutritionRepo.addEntry(isoDaysAgo(1), { food, grams: 200 }); // 400 kcal, 8 vit_d

  const weeks = nutritionRepo.getWeeklyTotals(2);
  const current = weeks[1];
  assert.equal(current.loggedDays, 2);
  assert.equal(current.avgKcal, 300); // (200+400)/2
  assert.equal(current.vit_d, 6); // (4+8)/2
});

// Automatischer Wochenrückblick (03.08.2026): feste Kalenderwoche statt
// rollierendem Fenster relativ zu "heute".

test('getTotalsForWeek: liefert genau 7 Tage ab dem angegebenen Montag, aufsteigend', () => {
  const week = nutritionRepo.getTotalsForWeek('2026-08-03');
  assert.equal(week.length, 7);
  assert.equal(week[0].date, '2026-08-03');
  assert.equal(week[6].date, '2026-08-09');
});

test('getTotalsForWeek: ist unabhaengig vom heutigen Datum (im Gegensatz zu getLast7DaysTotals)', () => {
  // Eintrag WEIT in der Vergangenheit, ausserhalb der rollierenden "letzten 7
  // Tage ab heute" - getTotalsForWeek() muss ihn trotzdem finden, weil es
  // sich auf die angegebene Kalenderwoche bezieht, nicht auf "heute".
  nutritionRepo.addEntry('2026-01-06', { food: { name: 'Alt', kal: 300 }, grams: 100, mealType: 'lunch' });
  const week = nutritionRepo.getTotalsForWeek('2026-01-05'); // Montag jener Woche
  const tuesday = week.find(d => d.date === '2026-01-06');
  assert.equal(tuesday.kcal, 300);
});

// Mahlzeiten-Kategorisierung (03.08.2026)

test('addEntry: uebernimmt das mitgegebene mealType unveraendert', () => {
  const today = isoDaysAgo(0);
  nutritionRepo.addEntry(today, { food: { name: 'Porridge', kal: 150 }, grams: 100, mealType: 'breakfast' });
  assert.equal(nutritionRepo.getDay(today)[0].mealType, 'breakfast');
});

test('addEntry: ohne mealType greift defensiv der Default "other" (Rueckwaertskompatibilitaet)', () => {
  const today = isoDaysAgo(0);
  nutritionRepo.addEntry(today, { food: { name: 'Ohne Kategorie', kal: 100 }, grams: 100 });
  assert.equal(nutritionRepo.getDay(today)[0].mealType, 'other');
});

test('Migration v1->v2: alte Eintraege ohne mealType-Feld werden beim Laden automatisch auf "other" migriert', () => {
  const today = isoDaysAgo(0);
  // Simuliert einen Altbestand aus der Zeit vor der Mahlzeiten-Kategorisierung:
  // Envelope mit v:1 und Eintraegen ganz ohne mealType-Feld.
  globalThis.localStorage.setItem('vm_nutrition', JSON.stringify({
    v: 1,
    data: { [today]: [{ food: { name: 'Alt-Eintrag', kal: 100 }, grams: 100 }] },
  }));
  const entries = nutritionRepo.getDay(today);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].mealType, 'other');
  assert.equal(entries[0].food.name, 'Alt-Eintrag', 'Migration darf sonst nichts am Eintrag veraendern');
});

test('Migration v1->v2: bereits vorhandenes mealType bleibt bei der Migration erhalten', () => {
  const today = isoDaysAgo(0);
  globalThis.localStorage.setItem('vm_nutrition', JSON.stringify({
    v: 1,
    data: { [today]: [{ food: { name: 'Schon markiert', kal: 100 }, grams: 100, mealType: 'lunch' }] },
  }));
  assert.equal(nutritionRepo.getDay(today)[0].mealType, 'lunch');
});

test('getWeeklyTotals: ein Eintrag genau 8 Tage zurueck landet in der VORHERIGEN Woche, nicht der aktuellen', () => {
  const food = { kal: 500, protein: 0, fat: 0, carbs: 0 };
  nutritionRepo.addEntry(isoDaysAgo(8), { food, grams: 100 });

  const weeks = nutritionRepo.getWeeklyTotals(3);
  const current = weeks[2];
  const previous = weeks[1];
  assert.equal(current.loggedDays, 0);
  assert.equal(previous.loggedDays, 1);
  assert.equal(previous.avgKcal, 500);
});
