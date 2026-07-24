/**
 * skinVitality.js
 *
 * "Hautgesundheit & Vitalität" (Beauty-Feature, Premium).
 *
 * Entstanden aus einem 3-Experten-Panel (Ernährungsmedizin/Nutritional
 * Biochemistry, Ernährungsdermatologie, Healthy-Aging-Forschung), das sich auf
 * folgende Leitplanken geeinigt hat - bitte bei Änderungen respektieren:
 *
 * 1. KEIN aggregierter Score / Index. Nur Bausteine zeigen, keine
 *    Gesundheitsbewertung eines Organs (Dermatologie: das wäre eine
 *    diagnostische Aussage, die dem "kein Medizinprodukt"-Anspruch der App
 *    widerspricht).
 * 2. Jeder Punkt bekommt ein sichtbares Evidenz-Label ('gut belegt' vs.
 *    'vielversprechend, Forschung läuft') - keine einheitliche Darstellung
 *    unterschiedlich starker Evidenz.
 * 3. Nährstoff-Texte nutzen ausschließlich EFSA-Formulierungen (Health-Claims-
 *    Verordnung (EG) 1924/2006 i.V.m. Durchführungsverordnung (EU) 432/2012,
 *    Anhang). Stand Juli 2026 verbatim gegen den amtlichen deutschen Wortlaut
 *    des Anhangs geprüft (ABl. L 136 vom 25.5.2012, S. 1-40) - dabei wurden
 *    mehrere Abweichungen korrigiert: Vitamin E/Selen nutzten die falsche
 *    Satzkonstruktion ("trägt zum Schutz ... bei" statt korrekt "trägt dazu
 *    bei, ... zu schützen"), Biotin und Kupfer fassten mehrere separat
 *    zugelassene Einzelclaims zu einem Satz zusammen statt sie als eigene
 *    Aussagen zu verwenden. Zink UND Vitamin A/C waren bereits korrekt.
 *    Falls neue Nährstoff-Claims ergänzt werden: immer gegen den Anhang der
 *    Verordnung (EU) 432/2012 prüfen, nicht aus dem Gedächtnis formulieren.
 * 4. Keine Verwendung des Begriffs "Anti-Aging" (wissenschaftlich unpräzise,
 *    suggeriert Umkehrbarkeit eines Prozesses - Healthy-Aging-Forschung).
 * 5. Nur bereits im Datenmodell vorhandene Werte nutzen, keine neuen
 *    Laborwerte erfinden. Einzige neue Datenpunkte: Hydration und Schlaf
 *    (von allen drei Experten als sinnvollste Ergänzung befürwortet).
 */

export const EVIDENCE = {
  STRONG: 'gut belegt',
  EMERGING: 'vielversprechend, Forschung läuft',
};

export const SKIN_VITALITY_CLUSTERS = [
  {
    id: 'haut_haare_naegel',
    title: 'Haut, Haare & Nägel',
    icon: '✨',
    intro: 'Nährstoffe mit einer belegten Rolle für Hautbarriere, Kollagenbildung und Zellschutz.',
    items: [
      {
        id: 'vitamin_c',
        kind: 'intake',
        intakeKey: 'vit_c',
        label: 'Vitamin C',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin C trägt zu einer normalen Kollagenbildung für eine normale Funktion der Haut bei (ab 12 mg/Tag gedeckt).',
      },
      {
        id: 'zink',
        kind: 'intake',
        intakeKey: 'zink',
        label: 'Zink',
        evidence: EVIDENCE.STRONG,
        text: 'Zink trägt zur Erhaltung normaler Haut, normaler Haare und normaler Nägel bei.',
      },
      {
        id: 'vitamin_a',
        kind: 'intake',
        intakeKey: 'vit_a',
        label: 'Vitamin A',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin A trägt zur Erhaltung normaler Haut bei.',
      },
      {
        id: 'vitamin_e',
        kind: 'intake',
        intakeKey: 'vit_e',
        label: 'Vitamin E',
        evidence: EVIDENCE.STRONG,
        text: 'Vitamin E trägt dazu bei, die Zellen vor oxidativem Stress zu schützen.',
      },
      {
        id: 'vitamin_b7',
        kind: 'biomarker',
        biomarkerId: 'vitamin_b7',
        label: 'Biotin',
        evidence: EVIDENCE.STRONG,
        text: 'Biotin trägt zur Erhaltung normaler Haut bei. Biotin trägt zur Erhaltung normaler Haare bei.',
      },
      {
        id: 'selen',
        kind: 'biomarker',
        biomarkerId: 'selen',
        label: 'Selen',
        evidence: EVIDENCE.STRONG,
        text: 'Selen trägt dazu bei, die Zellen vor oxidativem Stress zu schützen.',
      },
      {
        id: 'kupfer',
        kind: 'biomarker',
        biomarkerId: 'kupfer',
        label: 'Kupfer',
        evidence: EVIDENCE.STRONG,
        text: 'Kupfer trägt zu einer normalen Hautpigmentierung bei. Kupfer trägt zu einer normalen Haarpigmentierung bei. Kupfer trägt dazu bei, die Zellen vor oxidativem Stress zu schützen.',
      },
      {
        id: 'omega3',
        kind: 'biomarker',
        biomarkerId: 'omega3',
        label: 'Omega-3-Fettsäuren',
        evidence: EVIDENCE.EMERGING,
        text: 'Omega-3-Fettsäuren sind Bestandteil der Zellmembranen der Haut. Ein eigener EFSA-Claim speziell zur Haut liegt aktuell nicht vor, daher bewusst als allgemeine Information ohne Gesundheitsversprechen formuliert.',
      },
    ],
  },
  {
    id: 'glykation',
    title: 'Blutzucker & Hautalterung',
    icon: '🩸',
    intro: 'Dauerhaft erhöhter Blutzucker begünstigt die Glykierung von Kollagenfasern (AGEs) - einer der am besten belegten Mechanismen für vorzeitige Hautalterung neben UV-Strahlung.',
    items: [
      {
        id: 'hba1c',
        kind: 'biomarker',
        biomarkerId: 'hba1c',
        label: 'HbA1c (Langzeitblutzucker)',
        evidence: EVIDENCE.STRONG,
        text: 'Ein stabiler Langzeitblutzucker wird mit einer geringeren Glykierungsrate von Kollagen in Verbindung gebracht.',
      },
      {
        id: 'glucose',
        kind: 'biomarker',
        biomarkerId: 'glucose',
        label: 'Nüchternblutzucker',
        evidence: EVIDENCE.STRONG,
        text: 'Große Blutzuckerschwankungen im Tagesverlauf sind ein zusätzlicher Risikofaktor - dafür gibt es den Blutzucker-Tagesgang-Tracker in den Health Tools.',
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle-Faktoren',
    icon: '🚬',
    intro: 'Konsumfaktoren mit direktem Einfluss auf oxidativen Stress und Kollagen-Stoffwechsel der Haut.',
    items: [
      {
        id: 'alkohol',
        kind: 'biomarker',
        biomarkerId: 'alkohol',
        label: 'Alkohol',
        evidence: EVIDENCE.STRONG,
        text: 'Regelmäßiger Alkoholkonsum wirkt dehydrierend und steht mit erhöhtem oxidativem Stress in der Haut in Verbindung.',
      },
      {
        id: 'rauchen',
        kind: 'info',
        label: 'Rauchen',
        evidence: EVIDENCE.STRONG,
        text: 'Rauchen erhöht den Vitamin-C-Bedarf spürbar und beschleunigt über oxidativen Stress und reduzierte Kollagensynthese nachweislich die Hautalterung. Aktuell ohne eigenen Tracker - allgemeiner Hinweis.',
      },
      {
        id: 'koffein',
        kind: 'biomarker',
        biomarkerId: 'koffein',
        label: 'Koffein',
        evidence: EVIDENCE.EMERGING,
        text: 'Hoher Koffeinkonsum kann die Flüssigkeitsbilanz beeinflussen - Zusammenhang mit Hautzustand ist schwächer belegt als bei Alkohol/Rauchen.',
      },
    ],
  },
  {
    id: 'darm_haut_achse',
    title: 'Darm-Haut-Achse',
    icon: '🦠',
    intro: 'Ein aktives Forschungsfeld: Darmgesundheit und Hautzustand hängen über systemische Entzündungsprozesse zusammen.',
    items: [
      {
        id: 'gut_diversity',
        kind: 'biomarker',
        biomarkerId: 'gut_diversity',
        label: 'Mikrobiom-Diversität',
        evidence: EVIDENCE.EMERGING,
        text: 'Eine geringere mikrobielle Vielfalt im Darm wird in Beobachtungsstudien mit Hautbildern wie Akne, Rosacea und atopischer Dermatitis assoziiert - kausale Belege stehen noch aus.',
      },
      {
        id: 'zonulin',
        kind: 'biomarker',
        biomarkerId: 'zonulin',
        label: 'Zonulin (Darmbarriere)',
        evidence: EVIDENCE.EMERGING,
        text: 'Eine durchlässigere Darmbarriere wird mit systemischer Entzündung in Verbindung gebracht, die sich auch auf die Haut auswirken kann.',
      },
      {
        id: 'scfa',
        kind: 'biomarker',
        biomarkerId: 'scfa',
        label: 'Kurzkettige Fettsäuren (SCFA)',
        evidence: EVIDENCE.EMERGING,
        text: 'Kurzkettige Fettsäuren wie Butyrat wirken entzündungshemmend - ein möglicher Mechanismus der Darm-Haut-Achse.',
      },
      {
        id: 'hscrp',
        kind: 'biomarker',
        biomarkerId: 'hscrp',
        label: 'hsCRP (Entzündungsmarker)',
        evidence: EVIDENCE.STRONG,
        text: 'Chronisch niedriggradige Entzündung ("Inflammaging") ist einer der etablierten biologischen Alterungsmechanismen, auch für die Haut.',
      },
    ],
  },
];

/**
 * Reichert die statischen Cluster-Definitionen mit dem aktuellen
 * Tracking-Status je Punkt an ("bereits getrackt: X" vs. "noch nicht
 * getrackt"). Bewusst OHNE jede Bewertung/Ampel - reine Statusanzeige,
 * siehe Leitplanke 1 oben.
 *
 * @param {object} ctx
 * @param {object} ctx.latestAll        measurementRepo.getLatestAll()
 * @param {object} ctx.dayTotals        nutritionRepo.getDayTotals(heute)
 * @param {object} ctx.dgeRef           getDGERef(ageGroup, sex)
 * @param {object} ctx.catalog          biomarkerCatalog.json
 */
export function buildSkinVitalityView(ctx) {
  const { latestAll = {}, dayTotals = {}, dgeRef = {}, catalog = { biomarkers: [] } } = ctx;
  const catalogById = Object.fromEntries(catalog.biomarkers.map(b => [b.id, b]));

  return SKIN_VITALITY_CLUSTERS.map(cluster => ({
    ...cluster,
    items: cluster.items.map(item => ({
      ...item,
      status: _resolveStatus(item, { latestAll, dayTotals, dgeRef, catalogById }),
    })),
  }));
}

function _resolveStatus(item, { latestAll, dayTotals, dgeRef, catalogById }) {
  if (item.kind === 'intake') {
    const ref = dgeRef[item.intakeKey];
    const amount = dayTotals[item.intakeKey];
    if (!ref || amount === undefined) return { tracked: false };
    const pct = Math.min(150, Math.round((amount / ref.ref) * 100));
    return { tracked: true, text: `${pct}% der heutigen Zufuhr (Ernährungstagebuch)` };
  }
  if (item.kind === 'biomarker') {
    const latest = latestAll[item.biomarkerId];
    if (!latest) return { tracked: false };
    const unit = catalogById[item.biomarkerId]?.unit || '';
    return { tracked: true, text: `Letzter Wert: ${latest.value} ${unit}`.trim() };
  }
  return { tracked: false, infoOnly: true };
}
