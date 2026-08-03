import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mondayOf, previousMonday } from '../../app/src/domain/dateUtils.js';

test('mondayOf: liefert fuer einen Mittwoch den Montag derselben Woche', () => {
  assert.equal(mondayOf('2026-08-05'), '2026-08-03'); // Mittwoch -> Montag
});

test('mondayOf: ein Montag liefert sich selbst', () => {
  assert.equal(mondayOf('2026-08-03'), '2026-08-03');
});

test('mondayOf: ein Sonntag gehoert noch zur Woche, die am Montag davor begann', () => {
  assert.equal(mondayOf('2026-08-09'), '2026-08-03'); // Sonntag -> Montag derselben Woche
});

test('previousMonday: liegt exakt 7 Tage vor dem uebergebenen Montag', () => {
  assert.equal(previousMonday('2026-08-10'), '2026-08-03');
});

test('mondayOf: funktioniert auch ueber Jahreswechsel/verschiedene Wochentage hinweg', () => {
  assert.equal(mondayOf('2026-01-01'), '2025-12-29'); // Donnerstag -> Montag der Vorwoche (Jahreswechsel)
  assert.equal(mondayOf('2026-06-15'), '2026-06-15'); // bereits ein Montag
  assert.equal(mondayOf('2026-12-31'), '2026-12-28'); // Donnerstag -> Montag derselben Woche
});
