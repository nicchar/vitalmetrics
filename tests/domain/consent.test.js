import { test } from 'node:test';
import assert from 'node:assert/strict';
import { needsHealthConsent, healthConsentFields, HEALTH_CONSENT_VERSION, HEALTH_CONSENT_TEXT } from '../../app/src/domain/consent.js';

test('needsHealthConsent: Neuinstallation (Onboarding offen) -> Onboarding fragt selbst, kein Extra-Screen', () => {
  assert.equal(needsHealthConsent({ onboardingDone: false }), false);
});

test('needsHealthConsent: Bestandsnutzerin ohne Gesundheits-Einwilligung -> muss bestätigen', () => {
  assert.equal(needsHealthConsent({ onboardingDone: true, consentGiven: true }), true);
});

test('needsHealthConsent: aktuelle Einwilligung vorhanden -> nichts zu tun', () => {
  assert.equal(needsHealthConsent({ onboardingDone: true, ...healthConsentFields() }), false);
});

test('needsHealthConsent: ältere Einwilligungsversion -> erneut fragen', () => {
  assert.equal(needsHealthConsent({ onboardingDone: true, healthConsentGiven: true, healthConsentVersion: HEALTH_CONSENT_VERSION - 1 }), true);
});

test('healthConsentFields: speichert Zeitpunkt und Version', () => {
  const f = healthConsentFields(new Date('2026-09-28T08:00:00Z'));
  assert.equal(f.healthConsentGiven, true);
  assert.equal(f.healthConsentDate, '2026-09-28T08:00:00.000Z');
  assert.equal(f.healthConsentVersion, HEALTH_CONSENT_VERSION);
});

test('HEALTH_CONSENT_TEXT: nennt Art. 9, Datenkategorien und Widerrufsweg', () => {
  assert.match(HEALTH_CONSENT_TEXT, /Art\. 9 Abs\. 2 lit\. a DSGVO/);
  assert.match(HEALTH_CONSENT_TEXT, /Gesundheitsdaten/);
  assert.match(HEALTH_CONSENT_TEXT, /widerrufen/);
});
