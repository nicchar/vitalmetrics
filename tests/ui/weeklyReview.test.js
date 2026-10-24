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

test('weeklyReview.js (2.2): nutzt buildWeekFocus für die VORHERIGE Kalenderwoche', () => {
  assert.ok(src.includes('buildWeekFocus(weekTotals, dgeRef, proteinRef)'));
  assert.ok(src.includes('previousMonday(thisMonday)'));
  assert.ok(src.includes('nutritionRepo.getTotalsForWeek(lastWeekMonday)'));
  assert.ok(src.includes("from '../../domain/dateUtils.js'"));
});

test('weeklyReview.js (2.2): Reihenfolge Woche → Schwerpunkte → Muster → Details', () => {
  const tpl = src.slice(src.indexOf('container.innerHTML = `<div class="w-screen weeklyreview-screen">\n    <button class="w-link" id="btn-back-tools"'));
  const order = ['renderWeekSummary(', 'renderFocus(', 'renderPatterns(', 'Die letzten 7 Tage im Detail'];
  let last = -1;
  for (const m of order) { const i = tpl.indexOf(m); assert.ok(i > last, m); last = i; }
});

test('weeklyReview.js (2.2): Schwerpunkte mit Rezept und Lebensmitteln, ohne Mengenvorgabe, mit Hinweis "keine Therapieempfehlung"', () => {
  const block = src.slice(src.indexOf('function renderFocus('), src.indexOf('function renderPatterns('));
  assert.ok(block.includes('recipeForNutrient(pool, f.key, today)'));
  assert.ok(block.includes('quickFoodsFor(f.key, diet, today)'));
  assert.ok(block.includes('keine individuelle Therapieempfehlung'));
  assert.ok(block.includes('im grünen Bereich'));
  assert.ok(!/\d+\s*(g|Gramm|mg|µg)\b.*mehr/i.test(block));
});

test('weeklyReview.js (2.2): Muster mit Mindestdauer und Beobachtungs-Hinweis', () => {
  const block = src.slice(src.indexOf('function renderPatterns('));
  assert.ok(block.includes('MIN_CHECKIN_DAYS'));
  assert.ok(block.includes('PATTERN_NOTE'));
});

test('weeklyReview.js (2.2): Öffnen markiert den Montags-Hinweis als gesehen', () => {
  assert.ok(src.includes('profileRepo.save({ lastWeeklyRecapShown: thisMonday })'));
});

test('weeklyReview.js (2.2): Verlaufsbalken ohne Ampelrot', () => {
  assert.ok(!/#ef4444|#43A047/.test(src));
});
