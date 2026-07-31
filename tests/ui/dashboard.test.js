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
