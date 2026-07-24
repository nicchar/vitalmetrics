/**
 * affiliateLinks.js
 *
 * Amazon-Supplement- und Schnelltest-Empfehlungen, portiert aus dem Monolithen
 * (VitalMetrics.html). Diese Links sind seit Entscheidung 2 (20.07.2026) für
 * ALLE Nutzer sichtbar, nicht nur Premium – das ist Voraussetzung für die
 * Amazon-PartnerNet-Zulassung als "Zugelassene Mobile Anwendung" (verlangt
 * freien Zugriff auf alle Partnerlinks für alle Nutzer).
 *
 * AFFILIATE_LINKS_ENABLED ist bewusst als eigener Schalter ausgelagert:
 * Amazon PartnerNet verlangt für native Apps eine gesondert beantragte
 * Zulassung (separate App-Partner-ID + Play-Store-URL hinterlegen + Prüfung
 * durch Amazon). Ohne diese schriftliche Genehmigung gilt das Einbinden von
 * Partnerlinks in einer mobilen App laut Amazons eigener Dokumentation als
 * Verstoß gegen die Teilnahmebedingungen ("wird zu einem Betrug"), mit
 * Sperr-Risiko für den ganzen Account. Nicole hat die Zulassung am 20.07.2026
 * beantragt, die Bestätigung steht noch aus.
 *
 * WICHTIG: Erst auf true setzen, wenn die schriftliche Amazon-Bestätigung da ist.
 */
export const AFFILIATE_LINKS_ENABLED = false;

// Tag der bisherigen PartnerNet-Website-ID. Amazon empfiehlt für Apps eine
// separate, dediziertes App-Partner-ID/Tracking-ID – sobald die Zulassung
// durch ist, hier durch die neue App-spezifische Tracking-ID ersetzen.
const AFFILIATE_TAG = 'vitalmetrics-21';

// ── Entscheidung 3 (bereits entschieden, 19.07.2026) ──────────────────────
// Diagnostiknahe Selbsttest-Kauf-Links (Zonulin, Calprotectin, Cortisol,
// Testosteron, Mikrobiom, SCFA, Serotonin) wurden entfernt. Die Marker selbst
// bleiben für manuelle Werteingabe (z. B. von echten Arzt-/Labortests)
// erhalten – nur die Amazon-Test-Kit-Kauflinks fallen weg.
const EXCLUDED_TEST_MARKER_IDS = [
  'zonulin', 'calprotectin', 'cortisol', 'testosteron',
  'gut_diversity', 'scfa', 'serotonin_gut'
];

const SUPPLEMENT_LINKS = {
  vitamin_d:    { label: 'Vitamin D3 Tropfen', q: 'Vitamin+D3+Tropfen+Nahrungsergaenzung' },
  vitamin_b12:  { label: 'Vitamin B12 Tropfen', q: 'Vitamin+B12+Tropfen+Kapseln' },
  eisen:        { label: 'Eisen Kapseln', q: 'Eisen+Kapseln+Nahrungsergaenzung' },
  magnesium:    { label: 'Magnesium Kapseln', q: 'Magnesium+Kapseln+Hochdosiert' },
  omega3:       { label: 'Omega-3 Fischöl', q: 'Omega+3+Fischoel+Kapseln' },
  zink:         { label: 'Zink Kapseln', q: 'Zink+Kapseln+Nahrungsergaenzung' },
  vitamin_c:    { label: 'Vitamin C Kapseln', q: 'Vitamin+C+Kapseln+Hochdosiert' },
  folsaeure:    { label: 'Folsäure Kapseln', q: 'Folsaeure+Kapseln+400+Mikrogramm' },
  vitamin_k2:   { label: 'Vitamin K2 Tropfen', q: 'Vitamin+K2+Tropfen+MK7' },
  jod:          { label: 'Jod Tabletten', q: 'Jod+Tabletten+Nahrungsergaenzung' },
  selen:        { label: 'Selen Kapseln', q: 'Selen+Kapseln+Nahrungsergaenzung' },
  calcium:      { label: 'Calcium Tabletten', q: 'Calcium+Tabletten+Nahrungsergaenzung' },
  vitamin_b6:   { label: 'Vitamin B6 Kapseln', q: 'Vitamin+B6+Kapseln' },
  vitamin_a:    { label: 'Vitamin A Kapseln', q: 'Vitamin+A+Kapseln+Retinol' },
  vitamin_e:    { label: 'Vitamin E Kapseln', q: 'Vitamin+E+Kapseln+Nahrungsergaenzung' },
  coq10:        { label: 'Coenzym Q10 Kapseln', q: 'Coenzym+Q10+Kapseln' },
  probiotika:   { label: 'Probiotika Kapseln', q: 'Probiotika+Kapseln+Kulturen' },
  kollagen:     { label: 'Kollagen Pulver', q: 'Kollagen+Pulver+Hydrolysat' },
  vitamin_b1:   { label: 'Vitamin B1 Kapseln', q: 'Vitamin+B1+Thiamin+Kapseln' },
  vitamin_b2:   { label: 'Vitamin B2 Kapseln', q: 'Vitamin+B2+Riboflavin+Kapseln' },
  vitamin_b3:   { label: 'Vitamin B3 Niacin', q: 'Vitamin+B3+Niacin+Kapseln' },
  biotin:       { label: 'Biotin Kapseln', q: 'Biotin+Kapseln+Haare' },
  kupfer:       { label: 'Kupfer Kapseln', q: 'Kupfer+Kapseln+Nahrungsergaenzung' },
  mangan:       { label: 'Mangan Kapseln', q: 'Mangan+Kapseln+Nahrungsergaenzung' },
  chrom:        { label: 'Chrom Kapseln', q: 'Chrom+Kapseln+Nahrungsergaenzung' },
  phosphor:     { label: 'Phosphor Kapseln', q: 'Phosphor+Kapseln+Nahrungsergaenzung' },
  // Im Monolithen gab es den Schlüssel "ashwagandha" zweimal (einmal generisch,
  // einmal Cortisol-spezifisch); JS-Objektliterale behalten nur den letzten
  // Wert – das war zur Laufzeit ohnehin schon diese Version.
  ashwagandha:  { label: 'Ashwagandha (Cortisol)', q: 'Ashwagandha+Kapseln+Stress+Cortisol' },
  resveratrol:  { label: 'Resveratrol Kapseln', q: 'Resveratrol+Kapseln+Antioxidantien' },
  // ── Kognitive Gesundheit ──
  phosphatidylserine: { label: 'Phosphatidylserin Kapseln', q: 'Phosphatidylserin+PS+Kapseln+Gedaechtnis' },
  cholin:             { label: 'Alpha-GPC Cholin Kapseln',  q: 'Alpha-GPC+Cholin+Kapseln+Gehirn' },
  bdnf:               { label: 'Lions Mane Pilz Extrakt',   q: 'Lions+Mane+Pilz+Extrakt+Kapseln+BDNF' },
  // ── Darm & Mikrobiom (Supplement-Empfehlung bleibt bestehen – Entscheidung 3
  // betrifft nur die Test-Kauf-Links für diese Marker, nicht die
  // Supplement-Empfehlungen selbst) ──
  gut_diversity: { label: 'Probiotika Hochdosiert', q: 'Probiotika+Hochdosiert+Kulturen+Darmbakterien' },
  scfa:          { label: 'Präbiotikum Inulin', q: 'Inulin+Praebiotikum+Pulver+Darmgesundheit' },
  zonulin:       { label: 'L-Glutamin Pulver', q: 'L-Glutamin+Pulver+Darm+Leaky+Gut' },
  calprotectin:  { label: 'Probiotika Darmflora', q: 'Probiotika+Darmflora+Kapseln+Darmsanierung' },
  serotonin_gut: { label: 'L-Tryptophan Kapseln', q: 'L-Tryptophan+Kapseln+Serotonin+Schlaf' },
};

// Amazon Schnelltest / Home-Test-Kit Links. Die 7 in EXCLUDED_TEST_MARKER_IDS
// gelisteten Marker sind hier absichtlich NICHT enthalten (Entscheidung 3).
const TEST_LINKS = {
  vitamin_d:   'Vitamin+D+Selbsttest+Schnelltest',
  vitamin_b12: 'Vitamin+B12+Bluttest+Heimtest',
  eisen:       'Ferritin+Eisen+Selbsttest+Heimtest',
  omega3:      'Omega+3+Index+Test+Heimtest',
  zink:        'Zink+Bluttest+Selbsttest',
  folsaeure:   'Folsaeure+Bluttest+Heimtest',
  cholesterin: 'Cholesterin+Schnelltest+Heimtest',
  blutzucker:  'Blutzucker+Messgeraet+Teststreifen',
  blutdruck:   'Blutdruckmessgeraet+Oberarm',
  selen:       'Selen+Bluttest+Heimtest',
  haemoglobin: 'Haemoglobin+Bluttest+Heimtest',
  hba1c:       'HbA1c+Selbsttest+Heimtest',
  magnesium:   'Magnesium+Bluttest+Heimtest',
  calcium:     'Calcium+Bluttest+Heimtest',
  hscrp:       'hsCRP+Entzuendungsmarker+Bluttest',
  glucose:     'Blutzucker+Messgeraet+Teststreifen',
  coq10:       'CoQ10+Ubiquinol+Bluttest+Heimtest',
};

function buildAmazonLink(query) {
  return `https://www.amazon.de/s?k=${query}&tag=${AFFILIATE_TAG}`;
}

export function getAffiliateLink(bmId) {
  const s = SUPPLEMENT_LINKS[bmId];
  if (!s) return null;
  return buildAmazonLink(s.q);
}

export function getTestLink(bmId) {
  if (EXCLUDED_TEST_MARKER_IDS.includes(bmId)) return null;
  const q = TEST_LINKS[bmId];
  if (!q) return null;
  return buildAmazonLink(q);
}
