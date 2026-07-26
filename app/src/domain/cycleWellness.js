/**
 * cycleWellness.js
 *
 * "PMS, Prämenopause & Menopause" - reiner Lerninhalt (Experten-Review 5 +
 * Ergänzung, 25.07.2026: Ernährungsberaterin, Heilpraktikerin, Gynäkologin,
 * Wissenschaftlerin, danach Regulatory-Affairs-Experte, App-Entwickler,
 * UI-Expertin). Bewusst getrennt vom Zyklus-Symptom-Tagebuch
 * (cycleSymptomsRepo.js) - dieser Screen liest KEINE Trackingdaten der
 * Nutzerin und bewertet nichts, siehe Leitplanken unten.
 *
 * Leitplanken aus dem Review (bitte bei Änderungen respektieren):
 * 1. Kein Bezug zu den eigenen Trackingdaten der Nutzerin - reines,
 *    für alle Nutzerinnen gleiches Lernmaterial (Regulatory-Affairs).
 * 2. Mönchspfeffer (Vitex agnus-castus) und Traubensilberkerze (Cimicifuga
 *    racemosa) sind in Deutschland Wirkstoffe zugelassener Arzneimittel,
 *    kein "nur traditionelles Kraut" - deshalb NUR generisch ohne
 *    Wirkversprechen erwähnt, mit Verweis auf ärztliche/apothekerliche
 *    Beratung vor Anwendung. Kein Produktname, keine Dosierung.
 * 3. PMDS wird NUR als eigenständiger Lernabsatz erwähnt (Definition,
 *    wann ärztliche/therapeutische Abklärung sinnvoll ist) - niemals als
 *    Bewertung, Score oder Label für die eigenen getrackten Symptome.
 * 4. Perimenopause/Menopause werden durchgängig als natürlicher Übergang
 *    beschrieben, nicht als Krankheitszustand (Gynäkologin).
 * 5. EFSA-Formulierungen: die Nährstoff-Claims unten sind ein Stichproben-
 *    Abgleich gegen den amtlichen Wortlaut der Verordnung (EU) 432/2012
 *    (Stand Juli 2026, Calcium/Vitamin D/Vitamin K neu recherchiert;
 *    Magnesium/Eisen/Vitamin B6/Zink/Omega-3 aus insightsByNutrient.json
 *    übernommen, dort bereits geprüft) - KEIN Ersatz für die vollständige
 *    verbatim-Prüfung wie in Entscheidung/Task #60. Vor Veröffentlichung
 *    noch einmal gegenprüfen.
 */

import { EVIDENCE } from './skinVitality.js';
import { TRADITIONAL_DISCLAIMER } from './traditionalPerspectives.js';

export { EVIDENCE };

export const CYCLE_WELLNESS_CLUSTERS = [
  {
    id: 'pms',
    title: 'PMS (prämenstruelles Syndrom)',
    icon: '🌙',
    intro: 'In der Lutealphase (zweite Zyklushälfte) können Beschwerden wie Reizbarkeit, Wassereinlagerungen oder Heißhunger auftreten. Diese Nährstoffe spielen dabei eine Rolle:',
    items: [
      {
        id: 'magnesium',
        label: 'Magnesium',
        evidence: EVIDENCE.STRONG,
        text: 'Magnesium trägt zu einer normalen psychischen Funktion und zur Verringerung von Müdigkeit und Ermüdung bei.',
      },
      {
        id: 'vitamin_b6',
        label: 'Vitamin B6',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin B6 trägt zu einer normalen psychischen Funktion und einem normalen Energiestoffwechsel bei.',
      },
      {
        id: 'calcium',
        label: 'Calcium',
        evidence: EVIDENCE.EMERGING,
        text: 'Calcium trägt zur Erhaltung normaler Knochen und zu einer normalen Muskelfunktion bei. Ein zusätzlicher lindernder Effekt speziell bei PMS-Symptomen wird in Studien diskutiert, ist aber nicht Teil des zugelassenen EFSA-Claims.',
      },
    ],
  },
  {
    id: 'praemenopause',
    title: 'Prämenopause (Übergangsjahre)',
    icon: '🍂',
    intro: 'Zyklen können unregelmäßiger werden, Blutungen stärker oder schwächer ausfallen. Ein natürlicher Übergang, kein Krankheitszustand - diese Nährstoffe verdienen dabei besondere Aufmerksamkeit:',
    items: [
      {
        id: 'eisen',
        label: 'Eisen',
        evidence: EVIDENCE.STRONG,
        text: 'Eisen trägt zur normalen Bildung von roten Blutkörperchen und Hämoglobin sowie zur Verringerung von Müdigkeit und Ermüdung bei - besonders relevant bei stärkeren Blutungen.',
      },
      {
        id: 'omega3',
        label: 'Omega-3-Fettsäuren',
        evidence: EVIDENCE.EMERGING,
        text: 'Omega-3-Fettsäuren sind struktureller Bestandteil von Nervenzellmembranen im Gehirn; ein zusätzlicher Stimmungseffekt wird erforscht, ist aber noch nicht eindeutig belegt.',
      },
    ],
  },
  {
    id: 'menopause',
    title: 'Menopause',
    icon: '🌸',
    intro: 'Mit sinkendem Östrogenspiegel steigt insbesondere das Risiko für Knochendichteverlust. Diese Nährstoffe sind dafür gut belegt:',
    items: [
      {
        id: 'calcium_knochen',
        label: 'Calcium',
        evidence: EVIDENCE.STRONG,
        text: 'Calcium trägt zur Erhaltung normaler Knochen und normaler Zähne bei.',
      },
      {
        id: 'vitamin_d',
        label: 'Vitamin D',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin D trägt zu einer normalen Aufnahme/Verwertung von Calcium und zur Erhaltung normaler Knochen bei sowie zu einer normalen Funktion des Immunsystems.',
      },
      {
        id: 'vitamin_k',
        label: 'Vitamin K',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin K trägt zur Erhaltung normaler Knochen bei.',
      },
      {
        id: 'zink',
        label: 'Zink',
        evidence: EVIDENCE.STRONG,
        text: 'Zink trägt zu einer normalen Funktion des Immunsystems bei.',
      },
    ],
  },
];

/**
 * Traditionelle/pflanzliche Perspektive - siehe Leitplanke 2 oben. Bewusst
 * ohne Wirkversprechen, ohne Produktname, ohne Dosierungshinweis.
 */
export const TRADITIONAL_PHYTO_NOTE =
  'In der Phytotherapie werden bei PMS traditionell Präparate auf Basis von Mönchspfeffer (Vitex agnus-castus) eingesetzt, bei Wechseljahresbeschwerden Präparate auf Basis von Traubensilberkerze (Cimicifuga racemosa). ' +
  'Beide sind in Deutschland Wirkstoffe zugelassener Arzneimittel, keine reinen Nahrungsergänzungsmittel - deshalb hier bewusst ohne Wirkversprechen genannt. ' +
  'Vor einer Anwendung ärztliche oder apothekerliche Beratung einholen, insbesondere bei Wechselwirkungen mit anderen Medikamenten.';

/**
 * PMDS-Lerninhalt - komplett unabhängig vom Zyklus-Symptom-Tagebuch, siehe
 * Leitplanke 3. Wird nirgends mit cycleSymptomsRepo-Daten verknüpft.
 */
export const PMDS_LEARNING_CONTENT = {
  title: 'Was ist PMDS?',
  text:
    'Die prämenstruelle dysphorische Störung (PMDS) ist eine deutlich stärkere, behandlungsbedürftige Form des PMS - mit ausgeprägten Stimmungssymptomen bis hin zu depressiven Verstimmungen in der Lutealphase. ' +
    'Sie unterscheidet sich von "normalem" PMS durch Intensität und Dauer der Beschwerden.',
  hint: 'Wenn du wiederkehrend stark belastet bist, kann ärztliche oder therapeutische Abklärung helfen. Dieser Text bewertet keine eigenen Trackingdaten - er ist ein allgemeiner Lerninhalt.',
};
