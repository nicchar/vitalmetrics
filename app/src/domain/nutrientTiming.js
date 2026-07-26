/**
 * nutrientTiming.js
 *
 * Block F Phase 2 (25.07.2026) - Tageszeit-/Einnahme-Hinweise je Nährstoff,
 * aus Experten-Review 4 (Chronobiologe, Ernährungsberater, Mediziner).
 *
 * WICHTIG (Regulatory-Affairs-Experte/Anwalt, siehe Review 4 Abschnitt 5):
 * Diese Hinweise bewegen sich nahe an "Dosierungsempfehlungen" und sind daher
 * bewusst konsequent lebensmittelbezogen und als "kann"-Formulierung
 * gehalten, NICHT als Anweisung und NICHT supplementbezogen (passt zur
 * bestehenden "Ernährung zuerst"-Positionierung, siehe healthClaims.js).
 * Nicht als individuelle Therapie-/Einnahmeempfehlung verwenden.
 *
 * Format je Nährstoff-ID: { text, evidence }. `evidence` nutzt dieselben zwei
 * Stufen wie skinVitality.js/nutrientInsights.js (EVIDENCE.STRONG/EMERGING) -
 * keine dritte, uneinheitliche Kennzeichnung einführen.
 */
import { EVIDENCE } from './skinVitality.js';

export { EVIDENCE };

const FAT_SOLUBLE_HINT = {
  text: 'Kann zusammen mit einer fetthaltigen Mahlzeit besser aufgenommen werden – die Uhrzeit selbst spielt dabei kaum eine Rolle.',
  evidence: EVIDENCE.STRONG,
};

const B_VITAMIN_HINT = {
  text: 'Wird oft morgens gegessen, da B-Vitamine am Energiestoffwechsel beteiligt sind – ein belegter Zeitfenster-Effekt ist das nicht, eher ein pragmatischer Alltagshinweis.',
  evidence: EVIDENCE.EMERGING,
};

export const NUTRIENT_TIMING = {
  vitamin_a: FAT_SOLUBLE_HINT,
  vitamin_d: FAT_SOLUBLE_HINT,
  vitamin_e: FAT_SOLUBLE_HINT,
  vitamin_k: FAT_SOLUBLE_HINT,
  eisen: {
    text: 'Der zeitliche Abstand zu Kaffee, Tee oder calciumreichen Lebensmitteln (30–60 Minuten) ist wichtiger als eine bestimmte Uhrzeit – siehe Wechselwirkungen oben.',
    evidence: EVIDENCE.STRONG,
  },
  magnesium: {
    text: 'Wird häufig abends gegessen, weil das die Muskelentspannung unterstützen kann – bei gesunden Menschen ohne nachgewiesenen Mangel ist das eher ein traditioneller als ein klinisch belegter Hinweis.',
    evidence: EVIDENCE.EMERGING,
  },
  calcium: {
    text: 'Größere Mengen (über ca. 500 mg) werden auf einmal schlechter aufgenommen – über den Tag verteilt zu essen kann sinnvoller sein als eine einzelne große Menge.',
    evidence: EVIDENCE.STRONG,
  },
  vitamin_b1: B_VITAMIN_HINT,
  vitamin_b2: B_VITAMIN_HINT,
  vitamin_b3: B_VITAMIN_HINT,
  vitamin_b5: B_VITAMIN_HINT,
  vitamin_b6: B_VITAMIN_HINT,
  vitamin_b9: B_VITAMIN_HINT,
  vitamin_b12: B_VITAMIN_HINT,
};

/**
 * @param {string} id Biomarker-ID aus biomarkerCatalog.json
 * @returns {{text: string, evidence: string} | null}
 */
export function getTimingHintFor(id) {
  return NUTRIENT_TIMING[id] || null;
}
