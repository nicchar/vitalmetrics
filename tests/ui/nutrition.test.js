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

test('nutrition.js: entryList wird nicht mehr doppelt gerendert', () => {
  const matches = src.match(/\$\{entryList/g) || [];
  assert.equal(matches.length, 2, 'entryList sollte genau 2x referenziert werden: einmal in der Berechnung, einmal in der neuen Sektion');
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
