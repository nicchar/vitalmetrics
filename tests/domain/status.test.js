import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getStatus, getStatusLabel, getStatusColor, getStatusEmoji, getEscalationHint } from '../../app/src/domain/status.js';

const eisen = {
  unit: 'mg',
  refMin: 11, refMax: 16,
  refByGender: { m: { min: 10, max: 12 }, f: { min: 14, max: 16 } },
};

const gewicht = { unit: 'kg', refMin: null, refMax: null, refByGender: null };
const koffein = { unit: 'mg/Tag', refMin: null, refMax: 400, refByGender: null };

test('getStatus: unknown bei leerem/null Wert', () => {
  assert.equal(getStatus(null, eisen, { sex: 'f' }), 'unknown');
  assert.equal(getStatus('', eisen, { sex: 'f' }), 'unknown');
  assert.equal(getStatus('abc', eisen, { sex: 'f' }), 'unknown');
});

test('getStatus: unknown bei Biomarker ohne Referenzbereich (z.B. Gewicht)', () => {
  assert.equal(getStatus(70, gewicht, { sex: 'f' }), 'unknown');
});

test('getStatus: low, wenn Wert unter dem geschlechtsspezifischen Minimum liegt', () => {
  assert.equal(getStatus(9, eisen, { sex: 'f' }), 'low'); // f-min 14
  assert.equal(getStatus(9, eisen, { sex: 'm' }), 'low'); // m-min 10
});

test('getStatus: ok, wenn Wert im geschlechtsspezifischen Bereich liegt', () => {
  assert.equal(getStatus(15, eisen, { sex: 'f' }), 'ok');
  assert.equal(getStatus(11, eisen, { sex: 'm' }), 'ok');
});

test('getStatus: high, wenn Wert ueber dem geschlechtsspezifischen Maximum liegt', () => {
  assert.equal(getStatus(20, eisen, { sex: 'f' }), 'high');
  assert.equal(getStatus(13, eisen, { sex: 'm' }), 'high');
});

test('getStatus: Grenzwerte selbst zaehlen als ok (inklusive Min/Max)', () => {
  assert.equal(getStatus(14, eisen, { sex: 'f' }), 'ok'); // == min
  assert.equal(getStatus(16, eisen, { sex: 'f' }), 'ok'); // == max
});

test('getStatus: funktioniert mit nur einer Obergrenze (Koffein) - ok unterhalb, high oberhalb', () => {
  assert.equal(getStatus(200, koffein, {}), 'ok');
  assert.equal(getStatus(400, koffein, {}), 'ok'); // Grenzwert selbst
  assert.equal(getStatus(450, koffein, {}), 'high');
});

test('getStatusLabel: liefert rein deskriptives Label je Status (keine Wertung wie "zu niedrig")', () => {
  assert.equal(getStatusLabel('low'), 'Unterhalb Referenzbereich');
  assert.equal(getStatusLabel('ok'), 'Im Referenzbereich');
  assert.equal(getStatusLabel('high'), 'Oberhalb Referenzbereich');
  assert.equal(getStatusLabel('unknown'), 'Kein Wert');
  assert.equal(getStatusLabel('__invalid__'), 'Unbekannt');
});

test('getStatusColor: liefert eine Farbe fuer jeden Status', () => {
  for (const s of ['low', 'ok', 'high', 'unknown']) {
    assert.match(getStatusColor(s), /^#[0-9A-Fa-f]{6}$/);
  }
});

test('getStatusColor: keine Ampelfarben mehr (Regulatory-Affairs-Review Juli 2026)', () => {
  const AMPEL_ROT = '#E53935';
  const AMPEL_GRUEN = '#43A047';
  const AMPEL_ORANGE = '#FB8C00';
  assert.notEqual(getStatusColor('low'), AMPEL_ROT);
  assert.notEqual(getStatusColor('ok'), AMPEL_GRUEN);
  assert.notEqual(getStatusColor('high'), AMPEL_ORANGE);
});

test('getStatusEmoji: liefert ein Emoji fuer jeden Status', () => {
  assert.equal(getStatusEmoji('ok'), '🟢');
  assert.equal(getStatusEmoji('low'), '🔴');
  assert.equal(getStatusEmoji('high'), '🟡');
  assert.equal(getStatusEmoji('unknown'), '⚪');
});

test('getEscalationHint: liefert einen Hinweistext bei Abweichung vom Referenzbereich', () => {
  assert.equal(typeof getEscalationHint('low'), 'string');
  assert.equal(typeof getEscalationHint('high'), 'string');
  assert.match(getEscalationHint('low'), /ärztlich/);
});

test('getEscalationHint: kein Hinweis bei ok/unknown', () => {
  assert.equal(getEscalationHint('ok'), null);
  assert.equal(getEscalationHint('unknown'), null);
});
