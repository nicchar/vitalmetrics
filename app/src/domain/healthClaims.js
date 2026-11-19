/**
 * healthClaims.js
 *
 * Zentrale Bibliothek für konsistente, nicht-diagnostische Formulierungen
 * (Block E / Entscheidung 10: Wellness- statt Healthcare-Positionierung).
 * Ziel: dieselbe Sprache über App, PDF-Bericht, Store-Listing und
 * TikTok-Content hinweg - "Tracking/Beobachtung" statt "Diagnose/Auswertung".
 *
 * WICHTIG: Wenn neue Disclaimer-Texte an anderer Stelle in der App nötig
 * werden, bitte hier ergänzen statt neue Ad-hoc-Formulierungen zu schreiben -
 * so bleibt die Sprache über die ganze App konsistent und auditierbar.
 */

export const DISCLAIMER_SHORT =
  'WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.';

export const DISCLAIMER_FULL =
  'WellANNI ist eine Wellness- und Self-Tracking-App, kein Medizinprodukt. ' +
  'Die App dient der Selbstbeobachtung von Ernährung und Lebensstil und ersetzt ' +
  'keine ärztliche Diagnose, Beratung oder Behandlung. Bei gesundheitlichen ' +
  'Beschwerden wende dich bitte an eine Ärztin, einen Arzt oder eine Apotheke.';

export const REFERENCE_VALUES_NOTE =
  'Referenzwerte nach den Empfehlungen der Deutschen Gesellschaft für Ernährung (DGE).';

// Bevorzugte (Wellness-konforme) Formulierungen für wiederkehrende Konzepte -
// bewusst "Tracking/Beobachtung" statt "Diagnose/Auswertung/Befund".
export const PREFERRED_TERMS = {
  tracking: 'Tracking / Selbstbeobachtung',
  status: 'Einordnung (kein Diagnosewert)',
  deficiency: 'niedrige Zufuhr / niedriger Trackingwert',
  recommendation: 'allgemeiner Hinweis (keine individuelle Therapieempfehlung)',
};

/**
 * Kurzer Wellness-Claim für Store-Listing/Marketing-Content - konsistent zu
 * verwenden statt Ad-hoc-Formulierungen mit Heilversprechen.
 */
export const MARKETING_TAGLINE =
  'Behalte deine Vitalstoffe im Blick – für mehr Energie im Alltag.';

/**
 * Zugelassene gesundheitsbezogene Angaben (VO (EU) 432/2012), WORTGLEICH.
 * Nur diese Sätze dürfen in App-Texten (Fakt des Tages, Rezept-Hinweise),
 * auf wellanni.de und in Social-Media-Beiträgen als Nährstoff-Aussage stehen.
 * Neue Angabe? Wortlaut im EU-Register prüfen und hier ergänzen.
 */
export const APPROVED_CLAIMS = [
  'Vitamin C erhöht die Eisenaufnahme.',
  'Vitamin C trägt zu einer normalen Funktion des Immunsystems bei.',
  'Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.',
  'Eiweiß trägt zur Erhaltung von Muskelmasse bei.',
  'Calcium wird für die Erhaltung normaler Knochen benötigt.',
  'Vitamin B12 trägt zu einem normalen Energiestoffwechsel bei.',
  'Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.',
  'Eisen trägt zur Verringerung von Müdigkeit und Ermüdung bei.',
  'Folat trägt zur Verringerung von Müdigkeit und Ermüdung bei.',
  'Jod trägt zu einer normalen Schilddrüsenfunktion bei.',
  'Vitamin B6 trägt zur Regulierung der Hormontätigkeit bei.',
];
