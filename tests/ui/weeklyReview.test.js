import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/weeklyReview.js'), 'utf-8');

/**
 * weeklyReview.test.js
 *
 * Feature "Automatischer Wochenrückblick mit Empfehlungen" (03.08.2026).
 * Bewusst textbasiert statt jsdom-Rendering, siehe nutrition.test.js.
 */

test('weeklyReview.js: importiert buildWeeklyRecommendations und die Kalenderwochen-Hilfsfunktionen', () => {
  assert.ok(src.includes('buildWeeklyRecommendations'));
  assert.ok(src.includes("from '../../domain/dateUtils.js'"));
});

test('weeklyReview.js: berechnet die Empfehlungen für die VORHERIGE Kalenderwoche (previousMonday), nicht die laufende', () => {
  assert.ok(src.includes('previousMonday(mondayOf(new Date()))'));
  assert.ok(src.includes('nutritionRepo.getTotalsForWeek(lastWeekMonday)'));
});

test('weeklyReview.js: Empfehlungs-Sektion steht vor der Bewegungs-Sektion (zuerst das Wichtigste)', () => {
  const idxRec = src.indexOf('renderRecommendations(weeklyRecap)');
  const idxMovement = src.indexOf('🏃 Bewegung');
  assert.notEqual(idxRec, -1);
  assert.ok(idxRec < idxMovement);
});

test('weeklyReview.js: renderRecommendations() zeigt nichts, wenn letzte Woche gar nichts geloggt wurde', () => {
  const idxFn = src.indexOf('function renderRecommendations');
  const block = src.slice(idxFn, idxFn + 300);
  assert.ok(/if\s*\(\s*!recap\.loggedDays\s*\)\s*return\s*''/.test(block));
});

test('weeklyReview.js: Empfehlungstext nennt Lebensmittel-Beispiele, keine Dosierung/Gramm-Angabe (Wellness-Sprache)', () => {
  const idxFn = src.indexOf('function renderRecommendations');
  const idxEnd = src.indexOf('function renderWeekComparison');
  const block = src.slice(idxFn, idxEnd);
  assert.ok(block.includes('gute Quellen'));
  assert.ok(!/\d+\s*(g|Gramm|mg|µg)\b.*mehr/i.test(block), 'Sollte keine Gramm-Dosierungsangabe enthalten');
});

test('weeklyReview.js: erklärt, dass es sich um allgemeine Hinweise handelt, keine individuelle Therapieempfehlung (healthClaims.js-Konvention)', () => {
  assert.ok(src.includes('keine individuelle Therapieempfehlung'));
});

test('weeklyReview.js: positive Rückmeldung, wenn keine Nährstoffe niedrig waren', () => {
  assert.ok(src.includes('im grünen Bereich'));
});
