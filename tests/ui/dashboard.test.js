import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/dashboard.js'), 'utf-8');

/**
 * dashboard.test.js
 *
 * Review 9 (30.07.2026), Priorisierungsvorschlag Punkt 3+4 (nach Expertenrunde
 * UI-Designerin/App-Entwicklerin/Ernährungsberaterin umgesetzt):
 * - Suchfeld für die 47 Biomarker-Karten (vorher kein Filter).
 * - ℹ️-Kurzerklärung auch bei normalen (nicht nur Info-Only-) Karten, nutzt
 *   das bereits vorhandene, fachlich geprüfte bm.description-Feld - kein
 *   neuer, ungeprüfter Text.
 *
 * Bewusst textbasiert statt jsdom-Rendering (siehe onboarding.test.js) - in
 * dieser Sandbox hängt sich jsdom unabhängig vom Projekt-Code auf.
 */

test('dashboard.js: Suchfeld für Biomarker-Karten vorhanden und filtert nach Kartenname', () => {
  assert.ok(src.includes('id="dash-search"'), 'Suchfeld #dash-search fehlt');
  assert.ok(/dashSearch[\s\S]*addEventListener\('input'/.test(src), 'Such-Event-Listener fehlt');
  assert.ok(/card\.querySelector\('\.card-name'\)/.test(src), 'Filterlogik sollte auf .card-name matchen');
});

test('dashboard.js: normale Biomarker-Karten zeigen bm.description über einen ℹ️-Toggle (kein neuer Text, bestehendes Feld)', () => {
  assert.ok(src.includes('btn-card-info-toggle'), 'ℹ️-Toggle-Button fehlt');
  assert.ok(src.includes('${bm.description}'), 'Sollte das bestehende bm.description-Feld verwenden, keinen neuen Text');
  const wiringMatch = src.match(/querySelectorAll\('\.btn-card-info-toggle'\)[\s\S]{0,200}/);
  assert.ok(wiringMatch, 'Event-Wiring für .btn-card-info-toggle fehlt');
  assert.ok(wiringMatch[0].includes('stopPropagation'),
    'Klick auf ℹ️ darf nicht gleichzeitig zur Trend-Navigation der Karte führen (stopPropagation fehlt)');
});

/**
 * Feature "Automatischer Wochenrückblick" (03.08.2026): dezenter Banner statt
 * Interstitial, sobald eine neue Kalenderwoche begonnen hat. Nur Premium
 * (Wochenrückblick selbst ist komplett Premium) und nur wenn in der letzten
 * Woche tatsächlich etwas geloggt wurde (kein Rauschen).
 */
test('dashboard.js: Wochenrückblick-Banner erscheint nur für Premium UND wenn letzte Woche etwas geloggt wurde', () => {
  const idx = src.indexOf('let weeklyRecap = null');
  const block = src.slice(idx, idx + 400);
  assert.ok(/if\s*\(\s*isPremium\s*&&\s*profile\.lastWeeklyRecapShown\s*!==\s*thisMonday\s*\)/.test(block));
  assert.ok(block.includes('recap.loggedDays > 0'), 'Banner sollte nur bei tatsächlich geloggten Tagen erscheinen');
});

test('dashboard.js: Banner nutzt getTotalsForWeek() für die VORHERIGE Kalenderwoche, nicht das rollierende 7-Tage-Fenster', () => {
  assert.ok(src.includes('nutritionRepo.getTotalsForWeek(previousMonday(thisMonday))'));
});

test('dashboard.js: Klick auf den Banner markiert die Woche als gesehen und navigiert zum vollen Wochenrückblick', () => {
  const idx = src.indexOf("querySelector('#weekly-recap-banner')");
  const block = src.slice(idx, idx + 250);
  assert.ok(block.includes('profileRepo.save({ lastWeeklyRecapShown: thisMonday })'));
  assert.ok(block.includes("navigate('weekly_review')"));
});

test('dashboard.js: Banner zeigt bei fehlenden Defiziten eine positive Bestätigung statt zu verschwinden', () => {
  assert.ok(src.includes('im grünen Bereich'));
});
