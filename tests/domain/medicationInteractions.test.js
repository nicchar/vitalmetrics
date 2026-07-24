import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getMedicationWarnings, MEDICATION_CATEGORIES, MEDICATION_SOURCE_NOTE } from '../../app/src/domain/medicationInteractions.js';

test('getMedicationWarnings: leeres Array ohne aktive Medikamente', () => {
  assert.deepEqual(getMedicationWarnings([], 'vitamin_k'), []);
  assert.deepEqual(getMedicationWarnings(undefined, 'vitamin_k'), []);
});

test('getMedicationWarnings: findet Warnung fuer passende Kombination', () => {
  const warnings = getMedicationWarnings(['blutverduenner'], 'vitamin_k');
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].med, 'blutverduenner');
});

test('getMedicationWarnings: keine Warnung fuer nicht betroffenen Naehrstoff', () => {
  assert.deepEqual(getMedicationWarnings(['blutverduenner'], 'zink'), []);
});

test('getMedicationWarnings: mehrere aktive Medikamente koennen mehrere Warnungen fuer denselben Naehrstoff liefern', () => {
  const warnings = getMedicationWarnings(['schilddruese', 'antibiotika'], 'calcium');
  assert.equal(warnings.length, 2);
});

test('MEDICATION_CATEGORIES: jede in MEDICATION_INTERACTIONS referenzierte Kategorie existiert', async () => {
  const { MEDICATION_INTERACTIONS } = await import('../../app/src/domain/medicationInteractions.js');
  for (const i of MEDICATION_INTERACTIONS) {
    assert.ok(MEDICATION_CATEGORIES[i.med], `Kategorie fehlt: ${i.med}`);
  }
});

test('MEDICATION_SOURCE_NOTE: vorhanden und nennt eine nachvollziehbare Quelle (Mediziner-Review Juli 2026)', () => {
  assert.equal(typeof MEDICATION_SOURCE_NOTE, 'string');
  assert.ok(MEDICATION_SOURCE_NOTE.length > 10);
  assert.match(MEDICATION_SOURCE_NOTE, /Quelle/);
});
