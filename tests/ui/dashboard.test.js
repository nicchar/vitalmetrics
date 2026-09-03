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
 * - Suchfeld für die Biomarker-Karten (damals 47, inzwischen 48, vorher kein Filter).
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

/**
 * Startseiten-Umbau (Review 11, 19.08.2026): der "Heute"-Bereich bündelt
 * Kalorien/Makros (aus dem Ernährungstagebuch) UND Körperwerte (Gewicht/
 * Taille/Hüfte/WHR) EINER gemeinsamen Karte ganz oben - Nicoles zentraler
 * Wunsch, Protein nicht losgelöst von den übrigen Makros zu behandeln.
 * Die Detailkarten aller Vitalstoffe stehen seitdem als sekundärer Bereich
 * darunter ("wirkt schon zu sehr in der App" war ihr Hauptkritikpunkt).
 */
test('dashboard.js: "Heute"-Karte steht vor dem sekundären Detailbereich und vor der Biomarker-Suche', () => {
  const idxHeute = src.indexOf('id="heute-card"');
  const idxDetail = src.indexOf('📊 Meine Werte im Detail');
  const idxSearch = src.indexOf('id="dash-search"');
  assert.notEqual(idxHeute, -1, '"Heute"-Karte fehlt');
  assert.ok(idxHeute < idxDetail, '"Heute"-Karte sollte vor dem Detailbereich stehen');
  assert.ok(idxDetail < idxSearch, 'Die Biomarker-Suche gehört zum Detailbereich, nicht darüber');
});

test('dashboard.js: renderHeuteCard() zeigt Kalorien, alle drei Makros (Protein/Kohlenhydrate/Fett) UND Körperwerte gemeinsam', () => {
  const idx = src.indexOf('function renderHeuteCard(');
  assert.notEqual(idx, -1, 'renderHeuteCard() fehlt');
  const block = src.slice(idx, src.indexOf('export function renderDashboard'));
  assert.ok(block.includes('dayTotals.kcal'), 'Kalorien fehlen in der Heute-Karte');
  assert.ok(block.includes('dayTotals.protein') && block.includes('dayTotals.carbs') && block.includes('dayTotals.fat'),
    'Alle drei Makros sollten gemeinsam angezeigt werden (Nicole: Protein nicht isoliert)');
  assert.ok(block.includes('weightEntry') && block.includes('waistEntry') && block.includes('hipEntry'),
    'Körperwerte (Gewicht/Taille/Hüfte) sollten in derselben Karte stehen');
});

test('dashboard.js: Kalorien-Spanne wird als "Orientierung"/"kein Ziel" formuliert, nicht als festes Ziel', () => {
  const idx = src.indexOf('function renderHeuteCard(');
  const block = src.slice(idx, idx + 1200);
  assert.match(block, /Orientierung/);
  assert.match(block, /kein Ziel/);
});

test('dashboard.js: WHR-Hinweis ist rein informativ formuliert, keine automatische Bewertung durch die App', () => {
  const idx = src.indexOf('function renderHeuteCard(');
  const block = src.slice(idx, idx + 2600);
  assert.ok(block.includes('getWHRRefLabel(profile.sex)'));
  assert.match(block, /rein informativ, keine automatische Bewertung/);
});

test('dashboard.js: "Heute"-Karte enthält KEINE Ampelfarben-Variablen (--ok/--low/--high) - bewusst zurückhaltend wie der Zyklus-Bereich', () => {
  const idx = src.indexOf('function renderHeuteCard(');
  const block = src.slice(idx, src.indexOf('export function renderDashboard'));
  assert.ok(!/var\(--ok\)|var\(--low\)|var\(--high\)/.test(block),
    'Die neue Heute-Karte sollte keine Ampelfarben verwenden (Nicoles Vorgabe: "zurückhaltend wie der Zyklus-Bereich")');
});

test('dashboard.js: importiert Gewicht/Taille/Hüfte per measurementRepo.getByBiomarker() und WHR-Berechnung aus energyNeeds.js', () => {
  assert.ok(src.includes("measurementRepo.getByBiomarker('gewicht')"));
  assert.ok(src.includes("measurementRepo.getByBiomarker('taillenumfang')"));
  assert.ok(src.includes("measurementRepo.getByBiomarker('hueftumfang')"));
  assert.ok(src.includes("from '../../domain/energyNeeds.js'"));
});

test('dashboard.js: TDEE/Protein-Referenz werden nur berechnet, wenn ein Gewichtseintrag existiert (kein Rateergebnis)', () => {
  const idx = src.indexOf('const tdee = weightEntry');
  assert.notEqual(idx, -1);
  const block = src.slice(idx, idx + 300);
  assert.ok(block.includes('? calcTDEERange('));
  assert.ok(block.includes(': null'));
});

test('dashboard.js: "Essen eintragen"/"Gewicht eintragen"-Buttons der Heute-Karte navigieren zu nutrition bzw. entry(gewicht)', () => {
  assert.ok(/btn-heute-nutrition['"]\)\?\.addEventListener\('click', \(\) => navigate\('nutrition'\)\)/.test(src));
  assert.ok(/btn-heute-weight['"]\)\?\.addEventListener\('click', \(\) => navigate\('entry', 'gewicht'\)\)/.test(src));
});

/**
 * Wildkräuter des Monats (Review 11): eigener Banner mit Pflicht-Sicherheits-
 * hinweis (Verwechslungsgefahr), analog zum bestehenden Saisonal-Hinweis-Banner.
 */
test('dashboard.js: Wildkräuter-des-Monats-Banner steht nach dem Saisonal-Hinweis und zeigt den Sicherheitshinweis', () => {
  const idxSeasonal = src.indexOf('seasonal-tip-banner');
  const idxWildherb = src.indexOf('wildherb-banner');
  assert.notEqual(idxWildherb, -1, 'Wildkräuter-Banner fehlt');
  assert.ok(idxSeasonal < idxWildherb);
  assert.ok(src.includes('getWildHerbTip()'));
  assert.ok(src.includes('WILDHERB_SAFETY_NOTE'));
});
