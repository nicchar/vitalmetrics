import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FASTING_STAGES, FASTING_PROTOCOLS, HEALING_FAST_INFO } from '../../app/src/domain/fasting.js';

test('FASTING_STAGES/FASTING_PROTOCOLS: weiterhin unveraendert vorhanden (Regressionsschutz)', () => {
  assert.ok(FASTING_STAGES.length >= 5);
  assert.deepEqual(FASTING_PROTOCOLS, { '16:8': 16, '14:10': 14, '12:12': 12 });
});

test('HEALING_FAST_INFO (Block F Phase 2): reiner Lerninhalt mit Titel, Einleitung, Punkten und Disclaimer', () => {
  assert.equal(typeof HEALING_FAST_INFO.title, 'string');
  assert.ok(HEALING_FAST_INFO.title.length > 0);
  assert.ok(HEALING_FAST_INFO.intro.length > 20);
  assert.ok(Array.isArray(HEALING_FAST_INFO.points) && HEALING_FAST_INFO.points.length >= 3);
  assert.ok(HEALING_FAST_INFO.disclaimer.length > 20);
});

test('HEALING_FAST_INFO: Disclaimer stellt klar, dass es kein aktives Tracking/Programm gibt', () => {
  const text = HEALING_FAST_INFO.disclaimer.toLowerCase();
  assert.ok(text.includes('kein aktives tracking') || text.includes('keine anleitung'));
});

test('HEALING_FAST_INFO: nennt mindestens eine Kontraindikation/Risikogruppe', () => {
  const allText = HEALING_FAST_INFO.points.join(' ').toLowerCase();
  assert.ok(allText.includes('schwangerschaft') || allText.includes('diabetes') || allText.includes('essstörungen') || allText.includes('essstoerungen'));
});
