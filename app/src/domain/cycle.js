/**
 * cycle.js
 *
 * Statische Referenzdaten für den Zyklustracker (Phasen-Infos + Nährstoff-Tipps
 * je Zyklusphase). Portiert aus dem Monolithen (VitalMetrics.html).
 */

export const CYCLE_NUTRIENTS = {
  menstruation: [
    { emoji: '🩸', name: 'Eisen', why: 'Ausgleich des Blutverlusts' },
    { emoji: '💊', name: 'Vitamin C', why: 'Verbessert Eisenaufnahme' },
    { emoji: '🧘', name: 'Magnesium', why: 'Lindert Krämpfe und Schmerzen' },
    { emoji: '🐟', name: 'Omega-3', why: 'Entzündungshemmend, reduziert Beschwerden' },
  ],
  follicular: [
    { emoji: '🥬', name: 'Folat (B9)', why: 'Unterstützt Zellerneuerung und Östrogenphase' },
    { emoji: '💪', name: 'Protein', why: 'Muskelaufbau in energiereicher Phase' },
    { emoji: '⚡', name: 'Zink', why: 'Fördert Follikelwachstum' },
    { emoji: '🌿', name: 'Eisen', why: 'Auffüllen der Speicher nach Periode' },
  ],
  ovulation: [
    { emoji: '🥕', name: 'Vitamin E', why: 'Antioxidativer Schutz für Eizelle' },
    { emoji: '🍊', name: 'Vitamin C', why: 'Stärkt Immunsystem in Ovulationsphase' },
    { emoji: '⚡', name: 'Zink', why: 'Wichtig für die Eizellenreife' },
    { emoji: '🐟', name: 'Omega-3', why: 'Unterstützt hormonelle Balance' },
  ],
  luteal: [
    { emoji: '🧘', name: 'Magnesium', why: 'Reduziert PMS, Stimmungsschwankungen' },
    { emoji: '💊', name: 'Vitamin B6', why: 'Stimmungsstabilisierung, Progesteronunterstützung' },
    { emoji: '🦴', name: 'Calcium', why: 'Mildert PMS-Symptome nachweislich' },
    { emoji: '🌾', name: 'Komplexe Kohlenhydrate', why: 'Stabilisiert Blutzucker, reduziert Heißhunger' },
  ],
};

export const CYCLE_PHASE_INFO = {
  menstruation: { label: 'Menstruation', desc: 'Dein Körper reinigt sich. Schone dich, achte auf eisenreiche Ernährung und leichte Bewegung.', tipSport: '🧘 Yoga oder leichte Spaziergänge ideal — intensiver Sport eher meiden.' },
  follicular:   { label: 'Follikelphase', desc: 'Östrogen steigt — du hast mehr Energie, bist kreativer und belastbarer. Gute Zeit für neue Projekte.', tipSport: '🏃 Gute Phase für intensiveren Sport und Krafttraining.' },
  ovulation:    { label: 'Eisprung', desc: 'Energiepeak! Du strahlst, bist kommunikativ und körperlich auf dem Höhepunkt.', tipSport: '💪 Beste Zeit für HIIT, Wettkämpfe oder intensive Einheiten.' },
  luteal:       { label: 'Lutealphase', desc: 'Progesteron dominiert. Energie sinkt in zweiter Hälfte. Körper bereitet sich auf nächste Periode vor.', tipSport: '🚶 Moderate Bewegung — Schwimmen, Yoga, Spazieren besonders wohltuend.' },
};

/**
 * Berechnet die Zyklusphase für EIN BELIEBIGES Datum (nicht nur "heute").
 *
 * Extrahiert aus zwei Stellen, die bisher unabhängig voneinander dieselbe
 * Formel implementiert hatten: cycleRepo.getCurrentPhase() (nur für "heute")
 * und der Kalender-Rendering-Loop in ui/screens/cycle.js (für jeden Tag im
 * Monat, nur zur Einfärbung). Block F/Zyklus-Symptom-Tagebuch (25.07.2026)
 * braucht dieselbe Berechnung zusätzlich für beliebige vergangene Daten, um
 * einen Symptom-Eintrag seiner Zyklusphase zuzuordnen - daher hier einmal
 * zentral, rein informativ (keine Bewertung), beide bisherigen Call-Sites
 * nutzen jetzt diese Funktion statt eigener Kopien.
 *
 * @param {{periodStarts: string[], periodLength?: number, avgCycleLength?: number}} cycleData
 * @param {string} dateStr ISO-Datum (yyyy-mm-dd)
 * @param {number|null} avgCycleOverride optional: bereits berechnete Ø-Zykluslänge (z.B. aus calcStats()), sonst Fallback auf avgCycleLength || 28
 * @returns {{phase: string, day: number, cycleLen: number} | null}
 */
export function getPhaseForDate(cycleData, dateStr, avgCycleOverride = null) {
  const starts = [...(cycleData.periodStarts || [])].sort();
  if (!starts.length) return null;
  const last = new Date(starts[starts.length - 1]);
  const target = new Date(dateStr);
  const cl = avgCycleOverride || cycleData.avgCycleLength || 28;
  const pl = cycleData.periodLength || 5;
  const diff = Math.floor((target - last) / 86400000);
  const dayInCycle = ((diff % cl) + cl) % cl + 1;
  let phase;
  if (dayInCycle <= pl) phase = 'menstruation';
  else if (dayInCycle <= Math.round(cl * 0.45)) phase = 'follicular';
  else if (dayInCycle <= Math.round(cl * 0.55)) phase = 'ovulation';
  else phase = 'luteal';
  return { phase, day: dayInCycle, cycleLen: cl };
}
