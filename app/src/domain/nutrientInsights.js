/**
 * nutrientInsights.js
 *
 * Block F Phase 1 (25.07.2026) - "Körper & Geist"-Vertiefung je Nährstoff,
 * aus Experten-Review 4 (Anti-Aging-Experte, Dermatologin, Mediziner,
 * Ernährungsberater; Regulatory-Affairs-Experte für die Einordnung).
 *
 * Datenquelle: app/src/data/insightsByNutrient.json - eine bereits zuvor
 * angelegte, bis Block F aber leere und ungenutzte Datei. Wird wie
 * biomarkerCatalog.json/recipes.json einmalig in main.js per fetch() geladen
 * und in state.get('insightsByNutrient') abgelegt - dieses Modul bleibt bewusst
 * eine reine Funktionsbibliothek ohne eigenen fetch/Import, damit es wie
 * skinVitality.js unabhängig von Lade-Timing testbar bleibt.
 *
 * Format je Nährstoff-ID: Liste von { cluster, evidence, text }.
 * `evidence` nutzt bewusst dieselben zwei Stufen wie skinVitality.js
 * (EVIDENCE.STRONG / EVIDENCE.EMERGING), damit Sicherheit/Unsicherheit einer
 * Aussage app-weit einheitlich dargestellt wird - keine neue, uneinheitliche
 * Kennzeichnung erfinden.
 *
 * WICHTIG (Regulatory-Affairs-Experte, wie schon bei skinVitality.js
 * dokumentiert): Als "gut belegt" gekennzeichnete Texte sind an EFSA-Wortlaut
 * angelehnt (Verordnung (EU) 432/2012). Stand Juli 2026 stichprobenartig,
 * NICHT vollständig verbatim wie beim dedizierten Health-Claims-Check aus
 * Entscheidung 60 geprüft - vor Veröffentlichung denselben verbatim-Abgleich
 * gegen den amtlichen Anhang durchführen wie dort beschrieben.
 */
import { EVIDENCE } from './skinVitality.js';

export { EVIDENCE };

/**
 * @param {object} insightsData state.get('insightsByNutrient') - das geladene
 *   insightsByNutrient.json
 * @param {string} id Biomarker-ID aus biomarkerCatalog.json
 * @returns {Array<{cluster: string, evidence: string, text: string}>}
 */
export function getInsightsFor(insightsData, id) {
  return (insightsData && insightsData[id]) || [];
}

/**
 * Gruppiert die Insights über mehrere Nährstoffe hinweg nach Cluster - für
 * eine mögliche spätere Gesamtübersicht (aktuell nicht genutzt, aber ohne
 * Mehraufwand mit vorzubereiten, da dieselbe Datenquelle).
 */
export function groupByCluster(insightsData, idList) {
  const grouped = {};
  for (const id of idList) {
    for (const insight of getInsightsFor(insightsData, id)) {
      if (!grouped[insight.cluster]) grouped[insight.cluster] = [];
      grouped[insight.cluster].push({ ...insight, biomarkerId: id });
    }
  }
  return grouped;
}
