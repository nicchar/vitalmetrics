import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/dashboard.js'), 'utf-8');

const valuesSrc = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/values.js'), 'utf-8');

/**
 * dashboard.test.js
 *
 * Bewusst textbasiert (siehe onboarding.test.js); das echte Rendern deckt
 * tests/ui/screens22.test.js mit jsdom ab.
 *
 * WellANNI 2.2: Die Startseite zeigt Check-in, "Heute auf deinem Teller"
 * (Kalorien, Makros, 8 Kernwerte), Rezept des Tages, Tipp des Tages und eine
 * Zeile Körperwerte. Die Detailkarten aller Vitalstoffe samt Suche sind auf
 * die Seite "Alle Werte" (values.js) umgezogen – die Anforderungen aus
 * Review 9 (Suche, ℹ️-Erklärung) gelten dort unverändert weiter.
 */

test('values.js: Suchfeld für Biomarker-Karten vorhanden und filtert nach Kartenname', () => {
  assert.ok(valuesSrc.includes('id="dash-search"'), 'Suchfeld #dash-search fehlt');
  assert.ok(/dashSearch[\s\S]*addEventListener\('input'/.test(valuesSrc), 'Such-Event-Listener fehlt');
  assert.ok(/card\.querySelector\('\.card-name'\)/.test(valuesSrc), 'Filterlogik sollte auf .card-name matchen');
});

test('values.js: normale Biomarker-Karten zeigen bm.description über einen ℹ️-Toggle (kein neuer Text, bestehendes Feld)', () => {
  assert.ok(valuesSrc.includes('btn-card-info-toggle'), 'ℹ️-Toggle-Button fehlt');
  assert.ok(valuesSrc.includes('${bm.description}'), 'Sollte das bestehende bm.description-Feld verwenden, keinen neuen Text');
  const wiringMatch = valuesSrc.match(/querySelectorAll\('\.btn-card-info-toggle'\)[\s\S]{0,200}/);
  assert.ok(wiringMatch, 'Event-Wiring für .btn-card-info-toggle fehlt');
  assert.ok(wiringMatch[0].includes('stopPropagation'), 'Klick auf ℹ️ darf nicht zur Trend-Navigation führen');
});

test('values.js: Zufuhr wird als "x von y" gezeigt, ohne Ampelfarben (keine roten Prozente mehr)', () => {
  assert.ok(!/#ef4444|#f59e0b|#43A047/.test(valuesSrc), 'Ampel-Hexfarben bei der Zufuhr gefunden');
  assert.ok(valuesSrc.includes('von ${fmtNum(ref)}'), '"x von y"-Formulierung fehlt');
});

test('values.js: Laborwerte, Darm, Longevity und Kognition liegen eingeklappt unter "Erweitert"', () => {
  assert.ok(/ADVANCED_CATEGORIES = \['lab_values', 'gut', 'longevity', 'cognitive'\]/.test(valuesSrc));
  assert.ok(valuesSrc.includes('<details class="w-details" id="values-advanced">'));
});

test('values.js: Zufuhr-Referenz kommt aus getDGERef (eine Zahl pro Tag), Vitamin D mit Hinweis zur Hautbildung', () => {
  assert.ok(valuesSrc.includes('pro Tag'));
  assert.ok(valuesSrc.includes('ohne Bildung über die Haut'));
});

test('values.js: PDF-Export ist von der Startseite hierher umgezogen', () => {
  assert.ok(valuesSrc.includes('exportService.exportReport()'));
  assert.ok(!src.includes('exportService'), 'Startseite sollte keinen PDF-Export mehr enthalten');
});

/**
 * Automatischer Wochenrückblick (03.08.2026): dezenter Hinweis statt Pop-up,
 * nur Premium und nur wenn in der letzten Woche etwas eingetragen wurde.
 */
test('dashboard.js (2.2): Wochenrückblick-Hinweis nur für Premium, Gratis nur montags ein Satz', () => {
  assert.ok(src.includes('if (profile.lastWeeklyRecapShown !== thisMonday)'));
  assert.ok(src.includes('wf.loggedDays > 0'), 'nur wenn letzte Woche etwas eingetragen wurde');
  assert.ok(src.includes('const freeRecapTeaser = !isPremium && !!weekFocus && now.getDay() === 1;'));
  assert.ok(src.includes('if (isPremium && weekFocus)'));
});

test('dashboard.js: Hinweis nutzt getTotalsForWeek() für die VORHERIGE Kalenderwoche', () => {
  assert.ok(src.includes('nutritionRepo.getTotalsForWeek(previousMonday(thisMonday))'));
});

test('dashboard.js: Klick auf den Hinweis markiert die Woche als gesehen und öffnet den Wochenrückblick', () => {
  const idx = src.indexOf("querySelector('#weekly-recap-banner')");
  const block = src.slice(idx, idx + 250);
  assert.ok(block.includes('profileRepo.save({ lastWeeklyRecapShown: thisMonday })'));
  assert.ok(block.includes("navigate('weekly_review')"));
});

test('dashboard.js: ohne Lücken gibt es eine freundliche Bestätigung statt nichts', () => {
  assert.ok(src.includes('im grünen Bereich'));
});

test('dashboard.js (2.2): Kernwerte mit Wochensicht, Lebensmittel unter dem Rezeptvorschlag, Befindens-Hinweise', () => {
  assert.ok(src.includes('last7Totals: nutritionRepo.getLast7DaysTotals()'));
  assert.ok(src.includes('Schnitt der letzten 7 Tage'));
  assert.ok(src.includes('Oder einfach zwischendurch'));
  assert.ok(src.includes('buildCheckinHints('));
  assert.ok(src.includes('vitaminDNote()'));
});

/**
 * "Heute auf deinem Teller": Kalorien und alle drei Makros gemeinsam (Nicole:
 * Eiweiß nicht isoliert), Kernwerte in Worten statt Ampel.
 */
test('dashboard.js: Reihenfolge Check-in → Teller → Rezept des Tages → Tipp → Körperwerte', () => {
  const order = ['renderCheckin(today, hints)', 'renderTeller(', 'Rezept des Tages', 'Tipp des Tages', 'renderBody('];
  const tpl = src.slice(src.indexOf('container.innerHTML = `'));
  let last = -1;
  for (const marker of order) {
    const i = tpl.indexOf(marker);
    assert.ok(i > last, `"${marker}" steht nicht in der erwarteten Reihenfolge`);
    last = i;
  }
});

test('dashboard.js: renderTeller() zeigt Kalorien und alle drei Makros gemeinsam, plus Ballaststoffe', () => {
  const block = src.slice(src.indexOf('function renderTeller('), src.indexOf('function renderBody('));
  for (const k of ['dayTotals.kcal', 'dayTotals.protein', 'dayTotals.carbs', 'dayTotals.fat', 'dayTotals.fiber']) {
    assert.ok(block.includes(k), `${k} fehlt`);
  }
});

test('dashboard.js: Kalorien-Spanne als "Orientierung"/"kein Ziel", nicht als festes Ziel', () => {
  const block = src.slice(src.indexOf('function renderTeller('), src.indexOf('function renderBody('));
  assert.match(block, /Orientierung/);
  assert.match(block, /kein Ziel/);
});

test('dashboard.js: Startseite enthält KEINE Ampelfarben (--ok/--low/--high) und keine Prozentangaben', () => {
  assert.ok(!/var\(--ok\)|var\(--low\)|var\(--high\)/.test(src));
  assert.ok(!/% der/.test(src));
});

test('dashboard.js: Kernwerte nutzen die freundlichen Formulierungen aus coreNutrients.js', () => {
  assert.ok(src.includes('STATUS_TEXT[c.status]'));
  assert.ok(src.includes('coreGaps(core)'), 'Rezeptvorschlag nur für echte Lücken, ohne Vitamin D');
  assert.ok(src.includes("from '../../domain/coreNutrients.js'"));
});

test('dashboard.js: WHR-Hinweis ist rein informativ formuliert', () => {
  const block = src.slice(src.indexOf('function renderBody('), src.indexOf('export function renderDashboard'));
  assert.ok(block.includes('getWHRRefLabel(profile.sex)'));
  assert.match(block, /rein informativ, keine automatische Bewertung/);
});

test('dashboard.js: Gewicht/Taille/Hüfte per measurementRepo.getByBiomarker() und WHR aus energyNeeds.js', () => {
  assert.ok(src.includes("measurementRepo.getByBiomarker('gewicht')"));
  assert.ok(src.includes("measurementRepo.getByBiomarker('taillenumfang')"));
  assert.ok(src.includes("measurementRepo.getByBiomarker('hueftumfang')"));
  assert.ok(src.includes("from '../../domain/energyNeeds.js'"));
});

test('dashboard.js: Kalorien-Orientierung wird nur mit Gewichtseintrag berechnet (kein Rateergebnis)', () => {
  const idx = src.indexOf('const tdee = weightEntry');
  assert.notEqual(idx, -1);
  const block = src.slice(idx, idx + 300);
  assert.ok(block.includes('? calcTDEERange('));
  assert.ok(block.includes(': null'));
});

test('dashboard.js: Buttons führen zu Tagebuch, Gewicht eintragen und "Alle Werte"', () => {
  assert.ok(/btn-heute-nutrition['"]\)\?\.addEventListener\('click', \(\) => navigate\('nutrition'\)\)/.test(src));
  assert.ok(/btn-heute-weight['"]\)\?\.addEventListener\('click', \(\) => navigate\('entry', 'gewicht'\)\)/.test(src));
  assert.ok(src.includes("navigate('values')"));
});

test('dashboard.js: Wildkraut des Monats zeigt immer den Sicherheitshinweis', () => {
  assert.ok(src.includes('getWildHerbTip('));
  const idx = src.indexOf('wildherb-banner');
  assert.ok(src.slice(idx, idx + 300).includes('WILDHERB_SAFETY_NOTE'));
});

test('dashboard.js: kein Affiliate, keine Werbung, keine Person auf der Startseite', () => {
  assert.ok(!/amazon|affiliate|partner|Nicole/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')));
});
