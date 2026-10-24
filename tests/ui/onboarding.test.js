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
 * für die Datenerfassungs-Schritte (Einführungskarte zählt laut Expertenrunde
 * nicht mit, da kein Pflichtfeld).
 *
 * Review 11 (19.08.2026): um Körpergröße (Schritt 4) und Aktivitätslevel
 * (Schritt 5) auf "VON 5" erweitert - beide OPTIONAL, siehe Test weiter unten.
 */
test('onboarding.js: Fortschrittsanzeige "Schritt X von 5" für alle 5 Datenerfassungs-Schritte vorhanden', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  for (const step of ['Schritt 1 von 5', 'Schritt 2 von 5', 'Schritt 3 von 5', 'Schritt 4 von 5', 'Schritt 5 von 5']) {
    assert.ok(src.includes(step), `Fortschrittsanzeige "${step}" fehlt`);
  }
  // Reihenfolge: Datenschutz -> Geschlecht -> Alter -> Größe -> Aktivitätslevel.
  const idx1 = src.indexOf('Schritt 1 von 5');
  const idx2 = src.indexOf('Schritt 2 von 5');
  const idx3 = src.indexOf('Schritt 3 von 5');
  const idx4 = src.indexOf('Schritt 4 von 5');
  const idx5 = src.indexOf('Schritt 5 von 5');
  const idxConsent = src.indexOf('Bevor es losgeht');
  const idxSex     = src.indexOf('Dein Geschlecht');
  const idxAge     = src.indexOf('Deine Altersgruppe');
  const idxHeight  = src.indexOf('Deine Körpergröße und dein Gewicht');
  const idxActivity = src.indexOf('Wie aktiv bist du im Alltag?');
  assert.ok(idx1 < idxConsent && idx1 > src.indexOf('Was ist WellANNI?'));
  assert.ok(idx2 < idxSex);
  assert.ok(idx3 < idxAge);
  assert.ok(idx4 < idxHeight);
  assert.ok(idx5 < idxActivity);
  assert.ok(idx1 < idx2 && idx2 < idx3 && idx3 < idx4 && idx4 < idx5, 'Schritte sollten in aufsteigender Reihenfolge stehen');
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
 * Tracken der Ernährung, woraus die App die Nährstoffzufuhr berechnet.
 *
 * Bugfix 09.09.2026 (Google-Play-Compliance): Die explizite Supplement-
 * Erwähnung ("ob ein Supplement sinnvoll sein könnte") wurde bewusst entfernt
 * - las sich zu sehr nach individueller Behandlungsempfehlung. Die Karte
 * erklärt weiterhin den Ernährungs-Tracking-Mechanismus, ohne Supplements
 * ins Spiel zu bringen.
 */
test('onboarding.js: Einführungs-Karte stellt Ernährungs-Tracking (nicht Werte-Eingabe) als Mechanismus dar, ohne Supplement-Empfehlung', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idxIntro = src.indexOf('Was ist WellANNI?');
  const idxConsentCard = src.indexOf('Bevor es losgeht');
  const introBlock = src.slice(idxIntro, idxConsentCard);
  assert.ok(/trackt nicht die Nährstoffe direkt, sondern\s*\n?\s*deine Ernährung/.test(introBlock),
    'Sollte klarstellen, dass Ernährung (nicht Nährstoffwerte direkt) getrackt wird');
  assert.ok(!/Supplement/i.test(introBlock), 'Sollte keine Supplement-Empfehlung mehr enthalten (Compliance-Grund)');
});

/**
 * Review 11 (19.08.2026): Körpergröße (Schritt 4) und Aktivitätslevel
 * (Schritt 5) sind bewusst OPTIONAL - Nicoles Wunsch nach einer groben
 * Grundumsatz-/Protein-Einschätzung darf das Onboarding nicht zusätzlich
 * verlängern/blockieren. updateDoneButton() darf sich also NICHT ändern.
 */
test('onboarding.js: Körpergröße/Aktivitätslevel sind optional - updateDoneButton() hängt weiterhin nur von Geschlecht/Alter/Consent ab', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const fnMatch = src.match(/function updateDoneButton\(\)[\s\S]*?\n  \}/);
  assert.ok(fnMatch, 'updateDoneButton() nicht gefunden');
  assert.ok(!/selectedActivity|onb-height/.test(fnMatch[0]),
    'Körpergröße/Aktivitätslevel dürfen den "Los geht\'s"-Button nicht blockieren (siehe SCHRITT 4/5 · OPTIONAL im Markup)');
  assert.ok(src.includes('Schritt 4 von 5 · freiwillig'));
  assert.ok(src.includes('Schritt 5 von 5 · freiwillig'));
});

test('onboarding.js: importiert ACTIVITY_LEVELS aus energyNeeds.js und rendert einen Button je Aktivitätsstufe', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.ok(src.includes("from '../../domain/energyNeeds.js'"), 'Import von domain/energyNeeds.js fehlt');
  assert.ok(src.includes('ACTIVITY_LEVELS.map'), 'Aktivitätsstufen sollten aus ACTIVITY_LEVELS gerendert werden, nicht hartkodiert');
  assert.ok(src.includes('data-activity="${a.key}"'), 'activity-btn sollte data-activity=a.key setzen');
});

test('onboarding.js: Körpergröße-Feld ist ein numerisches Input mit id="onb-height"', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.match(src, /<input type="number" id="onb-height"/);
});

test('onboarding.js: .activity-btn-Klicks setzen die .selected-Klasse (analog zu .sex-btn/.age-btn)', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idx = src.indexOf("querySelectorAll('.activity-btn')");
  assert.notEqual(idx, -1, 'Event-Wiring für .activity-btn fehlt');
  const block = src.slice(idx, idx + 350);
  assert.ok(block.includes("classList.add('selected')"));
  assert.ok(block.includes('selectedActivity = btn.dataset.activity'));
});

test('onboarding.js: btn-done speichert height (geparst) und activityLevel im Profil, zusätzlich zu sex/ageGroup', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  const idx = src.indexOf("querySelector('#btn-done').addEventListener");
  const block = src.slice(idx, idx + 1100);
  assert.match(block, /height:\s*heightVal\s*>\s*0\s*\?\s*heightVal\s*:\s*null/);
  assert.match(block, /activityLevel:\s*selectedActivity\s*\|\|\s*''/);
  assert.ok(block.includes('sex: selectedSex'), 'sex sollte weiterhin gespeichert werden');
  assert.ok(block.includes('ageGroup: selectedAge'), 'ageGroup sollte weiterhin gespeichert werden');
});

/**
 * Datenschutz-Gap-Analyse 28.09.2026: Gesundheitsdaten-Einwilligung (Art. 9
 * DSGVO) ist eine EIGENE Checkbox, getrennt von AGB/Datenschutzerklärung, und
 * ist Pflicht für den "Los geht's"-Button.
 */
test('onboarding.js: separate Pflicht-Checkbox für Gesundheitsdaten, gespeichert mit Version', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.ok(src.includes('id="consent-check"'), 'AGB-Checkbox fehlt');
  assert.ok(src.includes('id="health-consent-check"'), 'Gesundheitsdaten-Checkbox fehlt');
  const fnMatch = src.match(/function updateDoneButton\(\)[\s\S]*?\n  \}/);
  assert.ok(fnMatch[0].includes('#health-consent-check'), 'Button muss auch von der Gesundheits-Einwilligung abhängen');
  assert.ok(src.includes('...healthConsentFields()'), 'Einwilligung (Zeitpunkt/Version) muss gespeichert werden');
  assert.ok(src.includes('mindestens 18 Jahre'), 'Altersbestätigung fehlt');
});

/**
 * WellANNI 2.2: warmes, geschlechtsneutrales Onboarding ohne Pillen-Symbol,
 * mit optionalem Gewicht (wird als erster Messwert gespeichert).
 */
test('onboarding.js (2.2): kein 💊, keine ♀/♂-Symbole, Genuss im Vordergrund', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.ok(!src.includes('💊'));
  assert.ok(!/[♀♂]/.test(src));
  assert.match(src, /genießen/);
});

test('onboarding.js (2.2): optionales Gewicht wird als Messwert "gewicht" gespeichert, nur bei plausiblem Wert', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.match(src, /<input type="number" id="onb-weight"/);
  assert.ok(src.includes("measurementRepo.add({ biomarkerId: 'gewicht', value: weightVal"));
  assert.ok(/if \(weightVal >= 30 && weightVal <= 300\)/.test(src));
  const fnMatch = src.match(/function updateDoneButton\(\)[\s\S]*?\n  \}/);
  assert.ok(!/onb-weight/.test(fnMatch[0]), 'Gewicht darf den Button nicht blockieren');
});

test('onboarding.js (2.2): zeigt, was zum Start noch fehlt', () => {
  const src = readFileSync(path.resolve(__dirname, '../../app/src/ui/screens/onboarding.js'), 'utf-8');
  assert.ok(src.includes('id="onb-missing"'));
});
