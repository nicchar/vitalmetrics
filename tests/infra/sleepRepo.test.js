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

const { sleepRepo } = await import('../../app/src/infra/db/repositories/sleepRepo.js');

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('getDay: null ohne Eintrag', () => {
  assert.equal(sleepRepo.getDay(isoDaysAgo(0)), null);
});

test('setDay + getDay: speichert Stunden und Qualitaet', () => {
  const today = isoDaysAgo(0);
  sleepRepo.setDay(today, { hours: 7.5, quality: 4 });
  const entry = sleepRepo.getDay(today);
  assert.equal(entry.hours, 7.5);
  assert.equal(entry.quality, 4);
});

test('setDay: ueberschreibt bestehenden Eintrag am selben Tag', () => {
  const today = isoDaysAgo(0);
  sleepRepo.setDay(today, { hours: 6, quality: 2 });
  sleepRepo.setDay(today, { hours: 8, quality: 5 });
  const entry = sleepRepo.getDay(today);
  assert.equal(entry.hours, 8);
  assert.equal(entry.quality, 5);
});

test('getLast7Days: fehlende Tage liefern hours/quality = null', () => {
  const days = sleepRepo.getLast7Days();
  assert.equal(days.length, 7);
  assert.equal(days[0].hours, null);
  assert.equal(days[0].quality, null);
});
