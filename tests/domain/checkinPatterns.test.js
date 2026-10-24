import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPatterns, MIN_CHECKIN_DAYS, PATTERN_NOTE } from '../../app/src/domain/checkinPatterns.js';

function makeDays(n, fn) {
  return Array.from({ length: n }, (_, i) => ({ date: `d${i}`, checkin: {}, steps: 0, waterMl: 0, kcal: 0, fiber: 0, dinnerShare: 0, phase: null, ...fn(i) }));
}

test('findPatterns: vor 14 Check-in-Tagen keine Muster', () => {
  const r = findPatterns(makeDays(13, () => ({ checkin: { energie: 3 }, steps: 8000 })));
  assert.equal(r.ready, false);
  assert.equal(r.checkinDays, 13);
  assert.equal(MIN_CHECKIN_DAYS, 14);
});

test('findPatterns: deutlicher Unterschied bei Schritten wird erkannt und als Beobachtung formuliert', () => {
  const days = makeDays(20, i => ({ steps: i % 2 ? 9000 : 3000, checkin: { energie: i % 2 ? 4 : 2 } }));
  const r = findPatterns(days);
  assert.equal(r.ready, true);
  const p = r.patterns.find(x => x.id === 'steps:energie');
  assert.ok(p, JSON.stringify(r.patterns));
  assert.match(p.text, /mehr als 7\.000 Schritten war deine Energie im Schnitt besser: 4 statt 2 von 5/);
  assert.match(PATTERN_NOTE, /kein Beweis/);
});

test('findPatterns: kleine Unterschiede oder zu kleine Gruppen werden nicht gemeldet', () => {
  const small = makeDays(20, i => ({ steps: i % 2 ? 9000 : 3000, checkin: { energie: i % 2 ? 3.4 : 3 } }));
  assert.equal(findPatterns(small).patterns.length, 0);
  const fewYes = makeDays(20, i => ({ steps: i < 3 ? 9000 : 3000, checkin: { energie: i < 3 ? 5 : 2 } }));
  assert.ok(!findPatterns(fewYes).patterns.some(p => p.id === 'steps:energie'));
});

test('findPatterns: Schlaf wird mit dem Vortag verglichen, Stimmung nie ausgewertet', () => {
  // Koffein am Vortag > 200 mg -> schlechter Schlaf in der Folgenacht
  const days = makeDays(24, i => ({ caffeineMg: i % 2 ? 300 : 50, checkin: { schlaf: i % 2 ? 4 : 2, stimmung: i % 2 ? 1 : 5 } }));
  const r = findPatterns(days);
  const p = r.patterns.find(x => x.id === 'caffeine:schlaf');
  assert.ok(p);
  assert.match(p.text, /schlechter/);
  assert.ok(!r.patterns.some(x => /Stimmung/.test(x.text)));
});

test('findPatterns: höchstens 3 Muster', () => {
  const days = makeDays(30, i => ({ steps: i % 2 ? 9000 : 3000, waterMl: i % 2 ? 2000 : 800, kcal: 1800, fiber: i % 2 ? 30 : 10, dinnerShare: i % 2 ? 0.2 : 0.6,
    checkin: { energie: i % 2 ? 5 : 1, schlaf: i % 2 ? 1 : 5, bauch: i % 2 ? 5 : 1 } }));
  assert.ok(findPatterns(days).patterns.length <= 3);
});
