/**
 * traditionalPerspectives.js
 *
 * Block F Phase 2 (25.07.2026) - "Traditionelle Perspektiven" (Heilpraktiker,
 * TCM-Experte), aus Experten-Review 4.
 *
 * VERBINDLICHE EINORDNUNG (Regulatory-Affairs-Experte/Anwalt, Review 4
 * Abschnitt 6): Diese Inhalte arbeiten mit einem anderen Modell als der Rest
 * der App (Qi, Yin/Yang, Organuhr statt EFSA-Wortlaut/DGE-Referenzwerte) und
 * dürfen NUR als klar gekennzeichneter, separater Infobereich erscheinen -
 * ausdrücklich als "traditionelle/komplementäre Sichtweise, wissenschaftlich
 * nicht im schulmedizinischen Sinne belegt, keine EFSA-zugelassene Aussage".
 * Vermischung mit den EFSA-geprüften Kernaussagen (healthClaims.js,
 * nutrientInsights.js) würde sowohl gegen die Health-Claims-Verordnung
 * verstoßen als auch die "kein Medizinprodukt"-Position der App gefährden.
 *
 * TRADITIONAL_DISCLAIMER MUSS bei jeder Anzeige sichtbar mit ausgegeben
 * werden - nicht nur einmalig irgendwo verlinkt.
 */

export const TRADITIONAL_DISCLAIMER =
  'Traditionelle/komplementäre Sichtweise – wissenschaftlich nicht im schulmedizinischen Sinne belegt, keine EFSA-zugelassene Aussage. Kein Ersatz für ärztliche oder ernährungsmedizinische Beratung.';

// Allgemeiner, nicht nährstoffspezifischer Hintergrund (Heilpraktiker + TCM),
// wird zusammen mit einer nährstoffspezifischen Perspektive angezeigt.
export const TRADITIONAL_GENERAL_NOTE =
  'Heilpraktische Sicht: Wie gut ein Nährstoff wirkt, hängt stark von der individuellen Aufnahmefähigkeit ab – insbesondere von einer gesunden Darmflora als Voraussetzung. ' +
  'TCM-Sicht: Die "Organuhr" ordnet bestimmten Tageszeiten die Regeneration einzelner Organe zu (z. B. 23–1 Uhr der Gallenblase, 1–3 Uhr der Leber) – ein traditionelles Konzept ohne schulmedizinischen Nachweis für eine Nährstoff-Zeitfenster-Wirkung.';

/**
 * Nährstoffspezifische traditionelle Perspektiven. Bewusst nicht für alle 47
 * Nährstoffe befüllt - nur dort, wo die Runde einen konkreten, sauber
 * einordnbaren Bezug gefunden hat.
 */
export const TRADITIONAL_PERSPECTIVES = {
  eisen: 'In der Traditionellen Chinesischen Medizin (TCM) wird ein niedriger Eisenwert oft mit dem Konzept "Blutschwäche" (Xue Xu) in Verbindung gebracht. Traditionell empfohlene, "blutaufbauende" Lebensmittel wie Rote Bete, dunkles Blattgemüse und Datteln überschneiden sich interessanterweise mit tatsächlich eisen- und folatreichen Lebensmitteln aus schulmedizinischer Sicht – auch wenn die Begründung dahinter eine andere ist.',
};

/**
 * @param {string} id Biomarker-ID
 * @returns {string | null}
 */
export function getTraditionalPerspectiveFor(id) {
  return TRADITIONAL_PERSPECTIVES[id] || null;
}
