import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthsAgo, groupByMonth, weekCheckinAverage, nearestMeasurement, buildLookback, firstEntryDate } from '../../app/src/domain/journal.js';
import { MINDFULNESS_TIPS, getMindfulnessTip } from '../../app/src/domain/mindfulnessTips.js';

test('monthsAgo: kappt Monatsende', () => {
  assert.equal(monthsAgo('2026-10-30', 1), '2026-09-30');
  assert.equal(monthsAgo('2026-03-31', 1), '2026-02-28');
  assert.equal(monthsAgo('2026-02-15', 6), '2025-08-15');
});

test('groupByMonth: neueste zuerst, leere Einträge fallen raus', () => {
  const g = groupByMonth({
    '2026-09-02': { good: 'Spaziergang' },
    '2026-10-01': { note: 'Erster Tag' },
    '2026-10-05': { good: ' ', note: '' },
  });
  assert.deepEqual(g.map(x => x.label), ['Oktober 2026', 'September 2026']);
  assert.equal(g[0].entries.length, 1);
});

test('weekCheckinAverage: Schnitt der 7 Tage bis zum Datum', () => {
  const c = { '2026-10-30': { energie: 5, schlaf: 3 }, '2026-10-25': { stimmung: 2 }, '2026-10-20': { energie: 1 } };
  assert.equal(weekCheckinAverage(c, '2026-10-30'), 3);
  assert.equal(weekCheckinAverage({}, '2026-10-30'), null);
});

test('nearestMeasurement: nächster Wert innerhalb der Grenze', () => {
  const w = [{ date: '2026-04-28', value: 82 }, { date: '2026-05-20', value: 80 }];
  assert.equal(nearestMeasurement(w, '2026-04-30').value, 82);
  assert.equal(nearestMeasurement(w, '2026-07-30'), null);
});

test('buildLookback: nur Zeitpunkte mit Daten, Vergleich mit heute', () => {
  const r = buildLookback({
    today: '2026-10-30',
    journal: { '2026-07-29': { good: 'Erster Lauf seit Jahren' } },
    checkins: { '2026-10-30': { energie: 4 }, '2026-07-30': { energie: 2 } },
    weights: [{ date: '2026-10-29', value: 74 }, { date: '2026-04-30', value: 81 }],
  });
  assert.deepEqual(r.map(x => x.months), [3, 6]);
  assert.equal(r[0].checkin, 2);
  assert.equal(r[0].checkinNow, 4);
  assert.equal(r[0].moment.text, 'Erster Lauf seit Jahren');
  assert.equal(r[1].weight, 81);
  assert.equal(r[1].weightNow, 74);
});

test('firstEntryDate', () => {
  assert.equal(firstEntryDate({ '2026-10-02': { good: 'a' }, '2026-09-01': { note: '' } }), '2026-10-02');
  assert.equal(firstEntryDate({}), null);
});

test('Achtsamkeitstipps: genug Abwechslung, keine Wirkversprechen', () => {
  assert.ok(MINDFULNESS_TIPS.length >= 60);
  assert.equal(new Set(MINDFULNESS_TIPS.map(t => t.text)).size, MINDFULNESS_TIPS.length);
  const verboten = /(heilt|senkt|stärkt dein immun|nimmst ab|abnehmen|kalorien|diät|verbrennt)/i;
  for (const t of MINDFULNESS_TIPS) assert.ok(!verboten.test(t.text), t.text);
  const a = getMindfulnessTip(new Date('2026-10-30T09:00:00'));
  const b = getMindfulnessTip(new Date('2026-10-31T09:00:00'));
  assert.notEqual(a.text, b.text);
  assert.equal(getMindfulnessTip(new Date('2026-10-30T23:00:00')).text, a.text);
});
