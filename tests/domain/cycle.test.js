import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getPhaseForDate, CYCLE_PHASE_INFO } from '../../app/src/domain/cycle.js';

test('getPhaseForDate: gibt null zurueck ohne periodStarts', () => {
  assert.equal(getPhaseForDate({ periodStarts: [] }, '2026-07-25'), null);
});

test('getPhaseForDate: Tag 1 einer 28-Tage-Zyklus ist Menstruation', () => {
  const data = { periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  const r = getPhaseForDate(data, '2026-07-01');
  assert.equal(r.phase, 'menstruation');
  assert.equal(r.day, 1);
  assert.equal(r.cycleLen, 28);
});

test('getPhaseForDate: letzter Tag der Periodenlaenge ist noch Menstruation, Tag danach Follikelphase', () => {
  const data = { periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  assert.equal(getPhaseForDate(data, '2026-07-05').phase, 'menstruation'); // Tag 5
  assert.equal(getPhaseForDate(data, '2026-07-06').phase, 'follicular'); // Tag 6
});

test('getPhaseForDate: Eisprung liegt um die Zyklusmitte (0.45-0.55 von 28 Tagen)', () => {
  const data = { periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  // round(28*0.45)=13 -> Tag <=13 ist noch Follikelphase, Tag 14-15 (round(28*0.55)=15) ist Eisprung
  assert.equal(getPhaseForDate(data, '2026-07-13').phase, 'follicular');
  assert.equal(getPhaseForDate(data, '2026-07-14').phase, 'ovulation');
  assert.equal(getPhaseForDate(data, '2026-07-15').phase, 'ovulation');
  assert.equal(getPhaseForDate(data, '2026-07-16').phase, 'luteal');
});

test('getPhaseForDate: naechster Zyklus (Tag 29) beginnt wieder bei Tag 1 (Menstruation)', () => {
  const data = { periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  const r = getPhaseForDate(data, '2026-07-29');
  assert.equal(r.phase, 'menstruation');
  assert.equal(r.day, 1);
});

test('getPhaseForDate: Datum VOR dem letzten Periodenstart wird sauber normalisiert (kein Crash/negativer Tag)', () => {
  const data = { periodStarts: ['2026-07-15'], periodLength: 5, avgCycleLength: 28 };
  const r = getPhaseForDate(data, '2026-07-01');
  assert.ok(r.day >= 1 && r.day <= 28);
});

test('getPhaseForDate: avgCycleOverride hat Vorrang vor avgCycleLength', () => {
  const data = { periodStarts: ['2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  const r = getPhaseForDate(data, '2026-07-01', 30);
  assert.equal(r.cycleLen, 30);
});

test('getPhaseForDate: benutzt mehrere Perioden-Eintraege den JUENGSTEN Start als Referenz', () => {
  const data = { periodStarts: ['2026-06-01', '2026-07-01'], periodLength: 5, avgCycleLength: 28 };
  const r = getPhaseForDate(data, '2026-07-01');
  assert.equal(r.day, 1); // bezogen auf 2026-07-01, nicht 2026-06-01
});

test('CYCLE_PHASE_INFO: alle vier von getPhaseForDate gelieferten Phasen haben eine Beschreibung', () => {
  for (const phase of ['menstruation', 'follicular', 'ovulation', 'luteal']) {
    assert.ok(CYCLE_PHASE_INFO[phase]?.label, `Phase ${phase} hat kein Label`);
  }
});
