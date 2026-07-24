import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

const { hydrationRepo } = await import('../../app/src/infra/db/repositories/hydrationRepo.js');

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('getDay: 0 ohne Eintraege', () => {
  assert.equal(hydrationRepo.getDay(isoDaysAgo(0)), 0);
});

test('addMl: summiert mehrere Eintraege am selben Tag', () => {
  const today = isoDaysAgo(0);
  hydrationRepo.addMl(today, 250);
  hydrationRepo.addMl(today, 500);
  assert.equal(hydrationRepo.getDay(today), 750);
});

test('addMl: trennt Tage korrekt', () => {
  hydrationRepo.addMl(isoDaysAgo(0), 250);
  hydrationRepo.addMl(isoDaysAgo(1), 1000);
  assert.equal(hydrationRepo.getDay(isoDaysAgo(0)), 250);
  assert.equal(hydrationRepo.getDay(isoDaysAgo(1)), 1000);
});

test('getLast7Days: liefert 7 Tage aufsteigend, heute zuletzt', () => {
  hydrationRepo.addMl(isoDaysAgo(0), 500);
  const days = hydrationRepo.getLast7Days();
  assert.equal(days.length, 7);
  assert.equal(days[6].date, isoDaysAgo(0));
  assert.equal(days[6].ml, 500);
});
