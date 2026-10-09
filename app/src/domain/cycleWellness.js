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
 * 2. Perimenopause/Menopause werden durchgängig als natürlicher Übergang
 *    beschrieben, nicht als Krankheitszustand (Gynäkologin).
 * 3. EFSA-Formulierungen: die Nährstoff-Claims unten sind ein Stichproben-
 *    Abgleich gegen den amtlichen Wortlaut der Verordnung (EU) 432/2012
 *    (Stand Juli 2026, Calcium/Vitamin D/Vitamin K neu recherchiert;
 *    Magnesium/Eisen/Vitamin B6/Zink/Omega-3 aus insightsByNutrient.json
 *    übernommen, dort bereits geprüft) - KEIN Ersatz für die vollständige
 *    verbatim-Prüfung wie in Entscheidung/Task #60. Vor Veröffentlichung
 *    noch einmal gegenprüfen.
 *
 * Entscheidung 11.09.2026 (Nicole, nach wiederholten Google-Play-Ablehnungen
 * "Diseases and Conditions Management"): Der frühere Pflanzenstoff-Hinweis
 * (nannte zwei konkrete Heilpflanzen mit behördlicher Zulassung als
 * Fertigpräparat beim Namen, inkl. Warnung vor Wechselwirkungen) sowie der
 * frühere Lernabsatz zu
 * einer benannten, klinisch eingeordneten Stimmungsstörung wurden ersatzlos
 * entfernt. Begründung: Wir sind keine Ärzte/Mediziner und geben keine
 * Ratschläge - nur allgemeingültige, rechtlich unbedenkliche Informationen im
 * Ton eines Frauenmagazins, ohne Fachbegriffe aus Pharmazie/Diagnostik. Die
 * beiden früheren Exporte existieren bewusst nicht mehr (siehe Test-Datei
 * cycleWellness.test.js, Regressionsschutz gegen ein Wiederauftauchen der
 * entfernten Begriffe im Modul).
 */

import { EVIDENCE } from './skinVitality.js';

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

