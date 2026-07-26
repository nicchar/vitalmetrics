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

const { cycleRepo } = await import('../../app/src/infra/db/repositories/cycleRepo.js');

beforeEach(() => {
  globalThis.localStorage.clear();
});

test('getCurrentPhase: null ohne jeden Periodenstart', () => {
  assert.equal(cycleRepo.getCurrentPhase(), null);
});

test('getCurrentPhase: Tag 1 direkt am Periodenstart von heute ist Menstruation (Regression nach getPhaseForDate-Refactor)', () => {
  const today = new Date().toISOString().slice(0, 10);
  cycleRepo.save({ periodStarts: [today], periodLength: 5, avgCycleLength: 28 });
  const phase = cycleRepo.getCurrentPhase();
  assert.equal(phase.phase, 'menstruation');
  assert.equal(phase.day, 1);
});

test('getPhaseFor: liefert Phase fuer ein beliebiges vergangenes Datum', () => {
  cycleRepo.save({ periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 });
  const phase = cycleRepo.getPhaseFor('2026-07-20');
  assert.equal(phase.phase, 'luteal');
});

test('calcStats + getCurrentPhase: berechnete Ø-Zykluslaenge fliesst in die Phasenberechnung ein', () => {
  cycleRepo.save({ periodStarts: ['2026-06-01', '2026-07-01'], periodLength: 5, avgCycleLength: 28 });
  const stats = cycleRepo.calcStats();
  assert.equal(stats.avgCycle, 30); // 30 Tage zwischen den beiden Starts
  const phase = cycleRepo.getPhaseFor('2026-07-01');
  assert.equal(phase.cycleLen, 30);
});
