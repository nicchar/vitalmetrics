import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/nutrition.js'), 'utf-8');

/**
 * nutrition.test.js
 *
 * Tester-Fund Review 8 (30.07.2026), Befund 4: Einträge im Ernährungstagebuch
 * waren zwar korrekt gespeichert/gerendert, aber ohne eigene Überschrift ganz
 * unten in der "Lebensmittel hinzufügen"-Sektion versteckt. Fix: eigene
 * Sektion "Deine Einträge heute" direkt nach der kcal-Kachel, vor der
 * Hinzufügen-Sektion.
 *
 * Bewusst textbasiert statt jsdom-Rendering (siehe onboarding.test.js) - in
 * dieser Sandbox hängt sich das Laden von jsdom unabhängig vom Projekt-Code
 * auf (reproduziert auch mit `import('jsdom')` ganz ohne Projekt-Import).
 */

test('nutrition.js: "Deine Einträge heute" ist eine eigene Sektion vor "Lebensmittel hinzufügen"', () => {
  const idxEntries = src.indexOf('Deine Einträge heute');
  const idxAdd = src.indexOf('Lebensmittel hinzufügen');
  assert.notEqual(idxEntries, -1, 'Neue Sektion "Deine Einträge heute" fehlt');
  assert.notEqual(idxAdd, -1, 'Sektion "Lebensmittel hinzufügen" fehlt');
  assert.ok(idxEntries < idxAdd, '"Deine Einträge heute" sollte vor "Lebensmittel hinzufügen" stehen (Sichtbarkeits-Fix)');
});

test('nutrition.js: entryListHtml wird nicht mehr doppelt gerendert (Mahlzeiten-Kategorisierung 03.08.2026 loeste die vorherige entryList-Variable ab)', () => {
  const matches = src.match(/\$\{entryListHtml/g) || [];
  assert.equal(matches.length, 1, 'entryListHtml sollte genau 1x in der Sektion referenziert werden');
});

test('nutrition.js: Leerzustand-Hinweis vorhanden, wenn noch keine Einträge existieren', () => {
  assert.ok(src.includes('Noch keine Einträge heute'), 'Leerzustand-Text fehlt');
});

test('nutrition.js: Barcode-Scan prüft vor scan() das Google-Barcode-Scanner-Modul (ML-Kit-Doku-Hinweis)', () => {
  assert.ok(src.includes('isGoogleBarcodeScannerModuleAvailable'), 'Modul-Check vor scan() fehlt');
  const idxCheck = src.indexOf('isGoogleBarcodeScannerModuleAvailable');
  const idxScan = src.indexOf('Scanner.scan(');
  assert.ok(idxCheck < idxScan, 'Modul-Check sollte vor dem eigentlichen scan()-Aufruf stehen');
});

/**
 * Review 9 (30.07.2026), Priorisierungsvorschlag Punkt 1+3: Barcode-Button
 * hatte nur ein Icon ohne Textlabel; Quick-Add-Chips hatten keinen Hinweis,
 * dass sie sich automatisch aufbauen.
 */
test('nutrition.js: Barcode-Button hat ein sichtbares Textlabel, nicht nur das Icon', () => {
  assert.ok(/btn-barcode-scan[\s\S]{0,300}?Scan/.test(src), 'Barcode-Button sollte ein sichtbares "Scan"-Label haben');
});

test('nutrition.js: Hinweistext erklärt, dass "häufig verwendet" sich automatisch aufbaut', () => {
  assert.ok(src.includes('automatisch aus deinen letzten 30 Tagen'), 'Erklärender Hinweistext zu den Quick-Add-Chips fehlt');
});

/**
 * Feature "Mahlzeiten-Kategorisierung" (03.08.2026): Frühstück/Mittag/Abend/
 * Snack statt flacher Liste. Nicole: "erst die Mahlzeit-Kategorie wählen und
 * danach so wie immer handhaben" - der Selector muss also VOR allen
 * Eintragswegen (Quick-Add-Chips, Suche, Custom-Formular) im Markup stehen
 * und für alle drei gelten.
 */
test('nutrition.js: importiert das mealType-Domain-Modul', () => {
  assert.ok(src.includes("from '../../domain/mealType.js'"), 'Import von domain/mealType.js fehlt');
  assert.ok(/MEAL_TYPES[,\s]/.test(src) && src.includes('guessMealTypeByTime') && src.includes('groupEntriesByMealType'));
});

test('nutrition.js: Mahlzeit-Selector steht vor den Quick-Add-Chips und der Suche', () => {
  const idxSelector = src.indexOf('mealtype-selector');
  const idxQuickAdd = src.indexOf('quick-add-chip');
  const idxSearch = src.indexOf('inp-food-search');
  assert.notEqual(idxSelector, -1, 'Mahlzeit-Selector fehlt im Markup');
  assert.ok(idxSelector < idxQuickAdd, 'Selector sollte vor den Quick-Add-Chips stehen');
  assert.ok(idxSelector < idxSearch, 'Selector sollte vor dem Suchfeld stehen');
});

test('nutrition.js: mealType wird NICHT bei jedem Render zurückgesetzt (Auswahl gilt für mehrere Eintragungen)', () => {
  const idxReset = src.indexOf('export function renderNutrition');
  const resetBlock = src.slice(idxReset, idxReset + 400);
  assert.ok(!/mealType\s*=/.test(resetBlock), '_nutrState.mealType darf im Render-Reset-Block nicht überschrieben werden');
});

test('nutrition.js: alle drei Eintragswege (Quick-Add, Suche, eigene Eingabe) übergeben mealType an addEntry', () => {
  const addEntryCalls = src.match(/nutritionRepo\.addEntry\([^)]*\)/gs) || [];
  assert.equal(addEntryCalls.length, 3, 'Es sollten genau 3 addEntry-Aufrufe existieren (Quick-Add/Suche/Custom)');
  for (const call of addEntryCalls) {
    assert.ok(/mealType\s*:\s*_nutrState\.mealType/.test(call), `addEntry-Aufruf ohne mealType: ${call}`);
  }
});
