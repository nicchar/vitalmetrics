import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lowAreas, buildCheckinHints, isSnoozed, HINT_TEXT, DOCTOR_NOTE, HINT_AREAS } from '../../app/src/domain/checkinHints.js';

const d = (energie, schlaf, bauch, stimmung) => ({ energie, schlaf, bauch, stimmung });

test('lowAreas: erst ab 3 von 4 Tagen mit 1 oder 2', () => {
  assert.deepEqual(lowAreas([d(2, 4), d(1, 4), d(3, 4), d(4, 4)]), []);
  assert.deepEqual(lowAreas([d(2, 4), d(1, 4), d(3, 4), d(2, 4)]), ['energie']);
  assert.deepEqual(lowAreas([d(5, 1, 2), d(5, 2, 1), d(5, 1, 2), d(5, 3, 5)]), ['schlaf', 'bauch']);
});

test('Stimmung erzeugt nie einen Hinweis', () => {
  assert.ok(!HINT_AREAS.includes('stimmung'));
  assert.deepEqual(lowAreas([d(4, 4, 4, 1), d(4, 4, 4, 1), d(4, 4, 4, 1), d(4, 4, 4, 1)]), []);
  assert.equal(HINT_TEXT.stimmung, undefined);
});

test('Wegtippen gilt 7 Tage', () => {
  assert.equal(isSnoozed({ energie: '2026-10-20' }, 'energie', '2026-10-24'), true);
  assert.equal(isSnoozed({ energie: '2026-10-17' }, 'energie', '2026-10-24'), false);
  const recent = [d(1), d(1), d(1), d(1)];
  assert.equal(buildCheckinHints({ recent, dismissed: { energie: '2026-10-22' }, today: '2026-10-24' }).length, 0);
  assert.equal(buildCheckinHints({ recent, dismissed: {}, today: '2026-10-24' }).length, 1);
});

test('Energie: Nährstoff-Bezug nur, wenn Eisen/B12/Magnesium in der Woche wirklich zu kurz kamen', () => {
  const recent = [d(1), d(2), d(1), d(4)];
  const none = buildCheckinHints({ recent, today: '2026-10-24', core: [{ key: 'eisen', status: 'ok' }] })[0];
  assert.equal(none.extra, null);
  const low = buildCheckinHints({ recent, today: '2026-10-24', core: [{ key: 'eisen', status: 'more' }, { key: 'b12', status: 'ok' }] })[0];
  assert.deepEqual(low.nutrients, ['eisen']);
  assert.match(low.extra, /tragen zur Verringerung von Müdigkeit und Ermüdung bei/);
});

test('Texte: keine Diagnose, keine Heilversprechen, immer der Hinweis auf die Hausarztpraxis', () => {
  const all = JSON.stringify(HINT_TEXT) + DOCTOR_NOTE;
  assert.ok(!/Mangel|Krankheit|Depression|Diagnose|heilt|Therapie|Störung|Supplement|Präparat/i.test(all));
  assert.match(DOCTOR_NOTE, /Hausarztpraxis/);
});
