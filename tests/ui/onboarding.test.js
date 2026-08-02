import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * onboarding.test.js
 *
 * QA-Fund (App-Tester-Durchlauf Juli 2026): das Onboarding bot lange nur die
 * Altersgruppen '18-19'/'19-25'/'25-50' an, obwohl domain/nutrition.js schon
 * eigene DGE-Referenzwerte für '51-70'/'70+' hatte, die dadurch nie griffen.
 * Dieser Test ist bewusst ein einfacher Text-basierter Regressionsschutz
 * (kein DOM-Rendering wie router.test.js) - stellt sicher, dass alle fünf
 * Altersgruppen im Markup vorhanden bleiben.
 */
test('onboarding.js bietet alle 5 Altersgruppen an (inkl. 51-70/70+, QA-Fund Juli 2026)', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  for (const age of ['18-19', '19-25', '25-50', '51-70', '70+']) {
    assert.ok(src.includes(`data-age="${age}"`), `Altersgruppe "${age}" fehlt im Onboarding-Markup`);
  }
});

/**
 * Tester-Fund Review 8 (30.07.2026), Befund 3: Erstnutzer:innen fanden die
 * App ohne jede Einführung schwer verständlich. Fix: neue erste Karte
 * "Was ist WellANNI?" vor der Datenschutz-Karte.
 */
test('onboarding.js: Einführungs-Karte "Was ist WellANNI?" steht vor der Datenschutz-Karte (QA-Fund Review 8)', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idxIntro   = src.indexOf('Was ist WellANNI?');
  const idxConsent = src.indexOf('Bevor es losgeht');
  assert.notEqual(idxIntro, -1, 'Einführungs-Karte fehlt');
  assert.notEqual(idxConsent, -1, 'Datenschutz-Karte fehlt');
  assert.ok(idxIntro < idxConsent, 'Einführungs-Karte sollte vor der Datenschutz-Karte stehen');
});

test('onboarding.js: Einführungs-Karte hat keine eigenen Pflichtfelder (darf den "Los geht\'s"-Button nicht blockieren)', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  // updateDoneButton() darf weiterhin nur von consent-check/sex/age abhängen.
  const fnMatch = src.match(/function updateDoneButton\(\)[\s\S]*?\n  \}/);
  assert.ok(fnMatch, 'updateDoneButton() nicht gefunden');
  assert.ok(/consentChecked|selectedSex|selectedAge/.test(fnMatch[0]));
  assert.ok(!/intro/i.test(fnMatch[0]), 'Einführungs-Karte sollte den Button-Status nicht beeinflussen');
});

/**
 * Review 9 (30.07.2026), Priorisierungsvorschlag Punkt 6: Fortschrittsanzeige
 * für die 3 Datenerfassungs-Schritte (Einführungskarte zählt laut
 * Expertenrunde nicht mit, da kein Pflichtfeld).
 */
test('onboarding.js: Fortschrittsanzeige "Schritt X von 3" für alle 3 Datenerfassungs-Schritte vorhanden', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  for (const step of ['SCHRITT 1 VON 3', 'SCHRITT 2 VON 3', 'SCHRITT 3 VON 3']) {
    assert.ok(src.includes(step), `Fortschrittsanzeige "${step}" fehlt`);
  }
  // Reihenfolge: Datenschutz -> Geschlecht -> Alter, jeweils direkt vor der passenden Karte.
  const idx1 = src.indexOf('SCHRITT 1 VON 3');
  const idx2 = src.indexOf('SCHRITT 2 VON 3');
  const idx3 = src.indexOf('SCHRITT 3 VON 3');
  const idxConsent = src.indexOf('Bevor es losgeht');
  const idxSex     = src.indexOf('Dein Geschlecht');
  const idxAge      = src.indexOf('Deine Altersgruppe');
  assert.ok(idx1 < idxConsent && idx1 > src.indexOf('Was ist WellANNI?'));
  assert.ok(idx2 < idxSex);
  assert.ok(idx3 < idxAge);
  assert.ok(idx1 < idx2 && idx2 < idx3, 'Schritte sollten in aufsteigender Reihenfolge stehen');
});

/**
 * Tester-Feedback (31.07.2026): Die Einführungskarte war zu oberflächlich
 * ("Trage deine Werte ein" - welche Werte?). Fix: konkrete Beispiel-Nährstoffe
 * nennen und in einfacher Sprache erklären, damit auch Einsteiger:innen ohne
 * Tracking-Vorerfahrung (z. B. Teenager oder Erstnutzer:innen 70+) sofort
 * verstehen, worum es in der App geht.
 */
test('onboarding.js: Einführungs-Karte nennt konkrete Beispiel-Nährstoffe statt nur "deine Werte"', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idxIntro = src.indexOf('Was ist WellANNI?');
  const idxConsentCard = src.indexOf('Bevor es losgeht');
  const introBlock = src.slice(idxIntro, idxConsentCard);
  for (const example of ['Eisen', 'Vitamin D', 'Magnesium']) {
    assert.ok(introBlock.includes(example), `Beispiel-Nährstoff "${example}" fehlt in der Einführungskarte`);
  }
  assert.ok(introBlock.includes('DGE'), 'Bezug zu den DGE-Empfehlungen sollte weiterhin erklärt werden');
  assert.ok(!/Diagnose(?!wert)/.test(introBlock), 'Wellness-Sprache: keine Diagnose-Formulierungen (siehe healthClaims.js)');
});

/**
 * Nutzer-Korrektur (31.07.2026): Kernidee der App war in Marketing-/Onboarding-
 * Texten unklar - es geht nicht ums Eintragen von Vitaminwerten, sondern ums
 * Tracken der Ernährung, woraus die App die Nährstoffzufuhr berechnet. Ziel:
 * verstehen, ob man genug bekommt, ob Supplements sinnvoll wären, und was die
 * Nährstoffe im Körper bewirken.
 */
test('onboarding.js: Einführungs-Karte stellt Ernährungs-Tracking (nicht Werte-Eingabe) als Mechanismus dar und erwähnt Supplements', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idxIntro = src.indexOf('Was ist WellANNI?');
  const idxConsentCard = src.indexOf('Bevor es losgeht');
  const introBlock = src.slice(idxIntro, idxConsentCard);
  assert.ok(/trackt nicht die Nährstoffe direkt, sondern\s*\n?\s*deine Ernährung/.test(introBlock),
    'Sollte klarstellen, dass Ernährung (nicht Nährstoffwerte direkt) getrackt wird');
  assert.ok(/Supplement/i.test(introBlock), 'Sollte Supplements als möglichen Alltagstipp erwähnen');
});
