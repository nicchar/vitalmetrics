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
