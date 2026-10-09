/**
 * consent.js
 *
 * Einwilligungen (Datenschutz-Gap-Analyse 28.09.2026).
 *
 * Zwei getrennte Zustimmungen, weil sie rechtlich Verschiedenes sind:
 * 1. AGB akzeptieren + Datenschutzerklärung zur Kenntnis nehmen + Alter 18+
 *    (profile.consentGiven, gab es schon seit Block C).
 * 2. AUSDRÜCKLICHE Einwilligung in die Verarbeitung von Gesundheitsdaten nach
 *    Art. 9 Abs. 2 lit. a DSGVO (profile.healthConsentGiven, NEU). Sie darf
 *    nicht mit den AGB gebündelt werden und muss die Datenkategorien benennen.
 *
 * HEALTH_CONSENT_VERSION erhöhen, wenn sich der Einwilligungstext inhaltlich
 * ändert (z. B. neue Datenkategorie) - dann wird die Zustimmung beim nächsten
 * App-Start erneut abgefragt (siehe main.js / needsHealthConsent()).
 */

export const HEALTH_CONSENT_VERSION = 1;

export const HEALTH_CONSENT_TEXT =
  'Ich willige ausdrücklich ein, dass WellANNI meine Gesundheitsdaten – z. B. Messwerte, '
  + 'Gewicht, Ernährungstagebuch, Zyklus- und Symptomangaben, Schlaf und Fastenzeiten – '
  + 'ausschließlich lokal auf meinem Gerät verarbeitet, um mir Auswertungen und Hinweise '
  + 'anzuzeigen (Art. 9 Abs. 2 lit. a DSGVO). Ich kann diese Einwilligung jederzeit '
  + 'widerrufen, indem ich im Profil „Alle Daten löschen“ wähle oder die App deinstalliere.';

/** true, wenn eine (erneute) Gesundheitsdaten-Einwilligung eingeholt werden muss. */
export function needsHealthConsent(profile) {
  if (!profile || !profile.onboardingDone) return false; // Onboarding fragt selbst
  return !profile.healthConsentGiven
    || (profile.healthConsentVersion || 0) < HEALTH_CONSENT_VERSION;
}

/** Felder, die beim Erteilen der Einwilligung im Profil gespeichert werden. */
export function healthConsentFields(now = new Date()) {
  return {
    healthConsentGiven: true,
    healthConsentDate: now.toISOString(),
    healthConsentVersion: HEALTH_CONSENT_VERSION,
  };
}
