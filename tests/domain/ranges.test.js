import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRefRange, getRefRangeLabel } from '../../app/src/domain/ranges.js';

const bmWithGender = {
  unit: 'mg',
  refMin: 11, refMax: 16,
  refByGender: { m: { min: 10, max: 12 }, f: { min: 14, max: 16 } },
};

const bmNoGender = {
  unit: '%',
  refMin: 8, refMax: 12,
  refByGender: null,
};

const bmNoRange = {
  unit: 'kg',
  refMin: null, refMax: null,
  refByGender: null,
};

const bmMaxOnly = {
  unit: 'mg/Tag',
  refMin: null, refMax: 400,
  refByGender: null,
};

test('getRefRange: gibt null/null zurueck, wenn kein Referenzbereich definiert ist (z.B. Gewicht)', () => {
  const { min, max } = getRefRange(bmNoRange, { sex: 'f' });
  assert.equal(min, null);
  assert.equal(max, null);
});

test('getRefRange: nutzt geschlechtsspezifischen Bereich, wenn Profil-Geschlecht gesetzt ist', () => {
  const m = getRefRange(bmWithGender, { sex: 'm' });
  assert.deepEqual(m, { min: 10, max: 12 });

  const f = getRefRange(bmWithGender, { sex: 'f' });
  assert.deepEqual(f, { min: 14, max: 16 });
});

test('getRefRange: faellt auf unisex refMin/refMax zurueck, wenn kein Geschlecht gesetzt ist', () => {
  const noSex = getRefRange(bmWithGender, {});
  assert.deepEqual(noSex, { min: 11, max: 16 });
});

test('getRefRange: faellt auf unisex zurueck, wenn Biomarker keinen refByGender hat', () => {
  const result = getRefRange(bmNoGender, { sex: 'm' });
  assert.deepEqual(result, { min: 8, max: 12 });
});

test('getRefRange: funktioniert mit nur einer Obergrenze (z.B. Koffein)', () => {
  const result = getRefRange(bmMaxOnly, {});
  assert.deepEqual(result, { min: null, max: 400 });
});

test('getRefRangeLabel: formatiert Bereich mit Einheit', () => {
  const label = getRefRangeLabel(bmWithGender, { sex: 'f' });
  assert.equal(label, '14–16 mg');
});

test('getRefRangeLabel: gibt Platzhalter zurueck, wenn kein Bereich existiert', () => {
  const label = getRefRangeLabel(bmNoRange, {});
  assert.equal(label, '–');
});
