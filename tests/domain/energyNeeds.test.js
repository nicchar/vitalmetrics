import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ACTIVITY_LEVELS,
  getActivityLevel,
  estimateAge,
  calcBMR,
  calcTDEERange,
  getProteinRefRange,
  calcWHR,
  getWHRRefLabel,
} from '../../app/src/domain/energyNeeds.js';

/**
 * energyNeeds.test.js
 *
 * Review 11 (19.08.2026): Grundumsatz/TDEE, Protein-Referenz und WHR - neue
 * Domain-Logik für den Startseiten-Umbau. Alle Funktionen geben bewusst
 * Spannen statt Einzelwerte zurück und `null`, wenn nötige Angaben fehlen
 * (kein Rateergebnis auf Basis angenommener Durchschnittswerte) - das ist
 * der wichtigste Verhaltensvertrag dieses Moduls und wird hier gezielt
 * getestet.
 */

test('ACTIVITY_LEVELS: vier Stufen mit eindeutigen Keys und aufsteigendem PAL', () => {
  assert.equal(ACTIVITY_LEVELS.length, 4);
  const keys = ACTIVITY_LEVELS.map(a => a.key);
  assert.equal(new Set(keys).size, 4, 'Keys sollten eindeutig sein');
  for (let i = 1; i < ACTIVITY_LEVELS.length; i++) {
    assert.ok(ACTIVITY_LEVELS[i].pal > ACTIVITY_LEVELS[i - 1].pal, 'PAL sollte aufsteigend sein');
  }
});

test('getActivityLevel: findet per Key, liefert null bei unbekanntem/leerem Key', () => {
  assert.equal(getActivityLevel('aktiv').pal, 1.8);
  assert.equal(getActivityLevel('unbekannt'), null);
  assert.equal(getActivityLevel(''), null);
  assert.equal(getActivityLevel(undefined), null);
});

test('estimateAge: nutzt birthYear, falls vorhanden', () => {
  const thisYear = new Date().getFullYear();
  assert.equal(estimateAge({ birthYear: thisYear - 30 }), 30);
});

test('estimateAge: fällt auf die Mitte der Altersgruppe zurück, wenn kein birthYear vorliegt', () => {
  assert.equal(estimateAge({ ageGroup: '25-50' }), 37);
  assert.equal(estimateAge({ ageGroup: '70+' }), 75);
  assert.equal(estimateAge({ ageGroup: '18-19' }), 18);
});

test('estimateAge: liefert null ohne birthYear und ohne bekannte Altersgruppe', () => {
  assert.equal(estimateAge({}), null);
  assert.equal(estimateAge({ ageGroup: '' }), null);
});

test('estimateAge: ignoriert ein unplausibles birthYear (negatives/zu hohes Alter) und fällt auf ageGroup zurück', () => {
  assert.equal(estimateAge({ birthYear: 3000, ageGroup: '25-50' }), 37);
});

test('calcBMR: Mifflin-St-Jeor, weiblich (Beispielwert manuell nachgerechnet)', () => {
  // 10*70 + 6.25*168 - 5*35 - 161 = 700 + 1050 - 175 - 161 = 1414
  assert.equal(calcBMR(70, 168, 35, 'f'), 1414);
});

test('calcBMR: Mifflin-St-Jeor, männlich (Beispielwert manuell nachgerechnet)', () => {
  // 10*85 + 6.25*180 - 5*40 + 5 = 850 + 1125 - 200 + 5 = 1780
  assert.equal(calcBMR(85, 180, 40, 'm'), 1780);
});

test('calcBMR: gibt null zurück, wenn Gewicht, Größe oder Alter fehlen', () => {
  assert.equal(calcBMR(null, 168, 35, 'f'), null);
  assert.equal(calcBMR(70, null, 35, 'f'), null);
  assert.equal(calcBMR(70, 168, null, 'f'), null);
});

test('calcBMR: gibt null zurück, wenn Geschlecht "keine Angabe" ist (keine neutrale Formel-Konstante möglich)', () => {
  assert.equal(calcBMR(70, 168, 35, ''), null);
  assert.equal(calcBMR(70, 168, 35, undefined), null);
});

test('calcTDEERange: liefert eine Spanne um den PAL-multiplizierten BMR, plus das genutzte PAL', () => {
  const range = calcTDEERange(70, 168, 35, 'f', 'leicht_aktiv');
  // BMR=1414, PAL=1.6 -> Mitte 2262.4
  assert.ok(range.min < 2262.4 && range.max > 2262.4);
  assert.equal(range.pal, 1.6);
  assert.ok(range.max - range.min > 0, 'Sollte eine echte Spanne sein, kein Einzelwert');
});

test('calcTDEERange: gibt null zurück ohne gültigen BMR oder ohne Aktivitätslevel', () => {
  assert.equal(calcTDEERange(null, 168, 35, 'f', 'leicht_aktiv'), null);
  assert.equal(calcTDEERange(70, 168, 35, 'f', ''), null);
  assert.equal(calcTDEERange(70, 168, 35, 'f', 'nicht_vorhanden'), null);
});

test('getProteinRefRange: DGE-Basiswert 0,8 g/kg für nicht-sehr-aktive Stufen, kein Mehrbedarf bei moderatem Sport', () => {
  assert.deepEqual(getProteinRefRange(70, 'sitzend', false), { min: 56, max: 56 });
  assert.deepEqual(getProteinRefRange(70, 'aktiv', false), { min: 56, max: 56 });
  assert.deepEqual(getProteinRefRange(70, '', false), { min: 56, max: 56 }, 'Ohne Aktivitätslevel greift trotzdem der DGE-Basiswert');
});

test('getProteinRefRange: 1,0 g/kg für Senioren (ab 70) statt 0,8 g/kg', () => {
  assert.deepEqual(getProteinRefRange(70, 'sitzend', true), { min: 70, max: 70 });
});

test('getProteinRefRange: höhere Spanne (1,2-1,6 g/kg) nur bei "sehr_aktiv"', () => {
  assert.deepEqual(getProteinRefRange(70, 'sehr_aktiv', false), { min: 84, max: 112 });
});

test('getProteinRefRange: gibt null ohne Gewicht zurück (kein Rateergebnis auf Basis eines Durchschnittsgewichts)', () => {
  assert.equal(getProteinRefRange(null, 'sitzend', false), null);
  assert.equal(getProteinRefRange(0, 'sitzend', false), null);
});

test('calcWHR: Taille-Hüft-Verhältnis, gerundet auf 2 Nachkommastellen', () => {
  assert.equal(calcWHR(80, 100), 0.8);
  assert.equal(calcWHR(83, 100), 0.83);
});

test('calcWHR: gibt null zurück, wenn Taille oder Hüfte fehlt', () => {
  assert.equal(calcWHR(null, 100), null);
  assert.equal(calcWHR(80, null), null);
  assert.equal(calcWHR(0, 100), null);
});

test('getWHRRefLabel: geschlechtsspezifische WHO-Grenzwerte, neutraler Text ohne "kein gültiger Wert"', () => {
  assert.match(getWHRRefLabel('f'), /0,85/);
  assert.match(getWHRRefLabel('m'), /0,90/);
  assert.match(getWHRRefLabel(''), /0,80.*0,90/);
});
