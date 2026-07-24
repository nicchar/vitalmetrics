/**
 * reportPdf.js
 *
 * Baut den VitalMetrics-Biomarker-Bericht als echtes PDF (jsPDF-Core-API,
 * ohne autoTable-Plugin -> Tabellen werden manuell spaltenweise positioniert).
 * Ersetzt den alten window.print()-Ansatz des Monolithen; das Ergebnis wird
 * über exportService.js nativ geteilt/gespeichert statt im Browser gedruckt.
 *
 * Emojis werden hier bewusst NICHT verwendet (Helvetica/WinAnsi-Standardfont
 * von jsPDF kann sie nicht darstellen -> würden als Kästchen erscheinen).
 */
import { getStatus } from '../../domain/status.js';
import { getRefRange } from '../../domain/ranges.js';

const BRAND = [26, 122, 110];       // #1a7a6e
const STATUS_LABEL = { ok: 'Optimal', low: 'Niedrig', high: 'Erhöht', unknown: '–' };
const STATUS_COLOR = { ok: [46, 125, 50], low: [230, 81, 0], high: [183, 28, 28], unknown: [100, 100, 100] };

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '–';
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Sammelt alle Daten für den Bericht (analog zur Logik in printReport() im
 * Monolithen, aber mit dynamischen Kategorien aus dem aktuellen Katalog statt
 * einer fest verdrahteten catOrder-Liste, die in app/src nicht mehr passt).
 *
 * @returns {object|null} null, wenn keine Messwerte vorhanden sind.
 */
export function gatherReportData({ profile, catalog, measurementRepo }) {
  const allBm = catalog.biomarkers.filter(b => b.category !== 'body');
  const latestAll = {};
  allBm.forEach(bm => {
    const ms = measurementRepo.getByBiomarker(bm.id);
    if (ms.length > 0) latestAll[bm.id] = ms[ms.length - 1];
  });

  const trackedBms = allBm.filter(b => latestAll[b.id]);
  if (trackedBms.length === 0) return null;

  const statusCounts = { ok: 0, low: 0, high: 0, unknown: 0 };
  trackedBms.forEach(bm => {
    const s = getStatus(latestAll[bm.id].value, bm, profile);
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  // Gruppierung folgt der Reihenfolge der Kategorien im geladenen Katalog
  // (statt einer hartcodierten Liste alter Kategorie-Keys aus dem Monolithen).
  const grouped = {};
  for (const catKey of Object.keys(catalog.categories)) {
    const bms = trackedBms.filter(b => b.category === catKey);
    if (bms.length > 0) grouped[catKey] = bms;
  }

  const actionItems = trackedBms
    .map(bm => ({ bm, status: getStatus(latestAll[bm.id].value, bm, profile), val: latestAll[bm.id].value }))
    .filter(x => x.status === 'low' || x.status === 'high')
    .slice(0, 5);

  return { profile, catalog, latestAll, trackedBms, statusCounts, grouped, actionItems };
}

/**
 * Baut das jsPDF-Dokument aus den von gatherReportData() gelieferten Daten.
 * @returns {jsPDF} fertiges Dokument (noch nicht gespeichert/geteilt)
 */
export function buildReportPdf(data) {
  const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!jsPDFCtor) throw new Error('jsPDF nicht geladen (window.jspdf fehlt).');

  const doc = new jsPDFCtor({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const bottomLimit = pageH - 18;
  let y = 18;

  function ensureSpace(h) {
    if (y + h > bottomLimit) { doc.addPage(); y = 18; return true; }
    return false;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setTextColor(...BRAND);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
  doc.text('VitalMetrics', marginX, y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(85, 85, 85);
  doc.text('Biomarker-Übersicht · Ernährungsberatung', marginX, y + 6);

  const genderLabel = data.profile.sex === 'm' ? 'Männlich' : data.profile.sex === 'f' ? 'Weiblich' : null;
  const metaLines = [`Erstellt am: ${dateStr}`];
  if (data.profile.name) metaLines.push(`Name: ${data.profile.name}`);
  if (data.profile.birthYear) metaLines.push(`Jahrgang: ${data.profile.birthYear}`);
  if (genderLabel) metaLines.push(`Geschlecht: ${genderLabel}`);
  doc.setFontSize(9); doc.setTextColor(85, 85, 85);
  metaLines.forEach((line, i) => doc.text(line, pageW - marginX, y - 4 + i * 4.2, { align: 'right' }));

  y += 12;
  doc.setDrawColor(...BRAND); doc.setLineWidth(0.8);
  doc.line(marginX, y, pageW - marginX, y);
  y += 8;

  // ── Summary-Strip (4 Boxen) ─────────────────────────────────────────────
  const chips = [
    { n: data.trackedBms.length, l: 'Werte erfasst', bg: [227, 242, 253], fg: [21, 101, 192] },
    { n: data.statusCounts.ok || 0, l: 'Optimal', bg: [232, 245, 233], fg: [46, 125, 50] },
    { n: data.statusCounts.low || 0, l: 'Niedrig', bg: [255, 243, 224], fg: [230, 81, 0] },
    { n: data.statusCounts.high || 0, l: 'Erhöht', bg: [255, 235, 238], fg: [183, 28, 28] }
  ];
  const gap = 4;
  const chipW = (pageW - marginX * 2 - gap * 3) / 4;
  chips.forEach((chip, i) => {
    const x = marginX + i * (chipW + gap);
    doc.setFillColor(...chip.bg);
    doc.roundedRect(x, y, chipW, 16, 2, 2, 'F');
    doc.setTextColor(...chip.fg); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.text(String(chip.n), x + chipW / 2, y + 8, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text(chip.l, x + chipW / 2, y + 13, { align: 'center' });
  });
  y += 24;

  // ── Prioritäten & Handlungsempfehlungen ─────────────────────────────────
  if (data.actionItems.length > 0) {
    ensureSpace(10);
    doc.setTextColor(...BRAND); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text('Prioritäten & Handlungsempfehlungen', marginX, y);
    y += 2;
    doc.setDrawColor(208, 237, 233); doc.setLineWidth(0.3);
    doc.line(marginX, y, pageW - marginX, y);
    y += 6;

    const wrapWidth = pageW - marginX * 2 - 6;

    data.actionItems.forEach(x => {
      const tips = (x.bm.tips || []).slice(0, 2);
      const foods = (x.bm.foods || []).slice(0, 3).join(', ');
      const isLower = !!x.bm.lowerIsBetter;
      const actionText = x.status === 'high'
        ? (isLower ? `Dein ${x.bm.name}-Wert ist erhöht — möglichst senken.` : `Dein ${x.bm.name}-Wert ist zu hoch — Ernährung & Lifestyle anpassen.`)
        : `Dein ${x.bm.name}-Wert ist zu niedrig — gezielte Versorgung prüfen.`;

      const bodyLines = [{ text: actionText, color: [68, 68, 68] }];
      if (foods) bodyLines.push({ text: `Relevante Lebensmittel: ${foods}`, color: [46, 125, 50] });
      tips.forEach(t => bodyLines.push({ text: `Tipp: ${t}`, color: [85, 85, 85] }));

      const wrapped = bodyLines.map(bl => ({ ...bl, lines: doc.splitTextToSize(bl.text, wrapWidth) }));
      const totalLineCount = wrapped.reduce((s, bl) => s + bl.lines.length, 0);
      const boxH = 8 + totalLineCount * 4.2;

      if (ensureSpace(boxH + 4)) { /* neue Seite bereits begonnen */ }

      doc.setFillColor(249, 249, 249);
      doc.setDrawColor(224, 224, 224);
      doc.roundedRect(marginX, y, pageW - marginX * 2, boxH, 1.5, 1.5, 'FD');
      doc.setFillColor(...BRAND);
      doc.rect(marginX, y, 1.2, boxH, 'F');

      let ty = y + 6;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(26, 26, 26);
      doc.text(x.bm.name, marginX + 4, ty);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...BRAND);
      doc.text(`${x.val} ${x.bm.unit}`, pageW - marginX - 4, ty, { align: 'right' });
      ty += 5;

      doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
      wrapped.forEach(bl => {
        doc.setTextColor(...bl.color);
        bl.lines.forEach(l => { doc.text(l, marginX + 4, ty); ty += 4.2; });
      });

      y += boxH + 4;
    });
    y += 4;
  }

  // ── Kategorie-Tabellen ───────────────────────────────────────────────────
  const cols = [
    { label: 'Biomarker', w: 46 },
    { label: 'Wert', w: 26 },
    { label: 'Referenz', w: 40 },
    { label: 'Status', w: 26 },
    { label: 'Datum', w: 26 }
  ];
  const tableW = cols.reduce((s, c) => s + c.w, 0);
  let cx = marginX;
  const colX = cols.map(c => { const x = cx; cx += c.w; return x; });

  function drawTableHeader() {
    doc.setFillColor(240, 249, 248);
    doc.rect(marginX, y, tableW, 6, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(68, 68, 68);
    cols.forEach((c, i) => doc.text(c.label.toUpperCase(), colX[i] + 2, y + 4));
    y += 6;
    doc.setDrawColor(208, 237, 233); doc.setLineWidth(0.2);
    doc.line(marginX, y, marginX + tableW, y);
  }

  for (const [catKey, bms] of Object.entries(data.grouped)) {
    ensureSpace(16);
    doc.setTextColor(...BRAND); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    doc.text(data.catalog.categories[catKey] || catKey, marginX, y);
    y += 2;
    doc.setDrawColor(208, 237, 233); doc.setLineWidth(0.3);
    doc.line(marginX, y, pageW - marginX, y);
    y += 6;

    drawTableHeader();

    bms.forEach((bm, idx) => {
      const broke = ensureSpace(8);
      if (broke) drawTableHeader();

      const m = data.latestAll[bm.id];
      const s = getStatus(m.value, bm, data.profile);
      const r = getRefRange(bm, data.profile);
      const refLabel = r.min != null && r.max != null
        ? `${r.min}–${r.max} ${bm.unit}`
        : r.max != null ? `< ${r.max} ${bm.unit}` : '–';

      if (idx % 2 === 1) { doc.setFillColor(250, 250, 250); doc.rect(marginX, y, tableW, 7, 'F'); }

      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(26, 26, 26);
      doc.text(bm.name, colX[0] + 2, y + 5);
      doc.setTextColor(...BRAND);
      doc.text(`${m.value} ${bm.unit}`, colX[1] + 2, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(102, 102, 102);
      doc.text(refLabel, colX[2] + 2, y + 5);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...(STATUS_COLOR[s] || STATUS_COLOR.unknown));
      doc.text(STATUS_LABEL[s] || '–', colX[3] + 2, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(136, 136, 136);
      doc.text(fmtDate(m.date), colX[4] + 2, y + 5);

      y += 7;
    });
    y += 6;
  }

  // ── Footer / Disclaimer ──────────────────────────────────────────────────
  ensureSpace(34);
  doc.setDrawColor(221, 221, 221); doc.setLineWidth(0.2);
  doc.line(marginX, y, pageW - marginX, y);
  y += 5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(136, 136, 136);

  // Hinweis: Die Datenschutz-Zeile weicht bewusst vom Monolith-Wortlaut ab.
  // Der alte Text ("keine Übertragung an Server") stimmt seit der optionalen
  // Open-Food-Facts-Anbindung in der Ernährungssuche nicht mehr uneingeschränkt.
  const footerParas = [
    'Wichtiger Hinweis: Dieser Bericht dient ausschließlich Informationszwecken und ersetzt keine medizinische Diagnose oder Therapieempfehlung. Referenzwerte basieren auf DGE-Empfehlungen und allgemeinen Laborrichtwerten. Individuelle Gegebenheiten können abweichen. Für medizinische Entscheidungen wende dich an eine Ärztin oder einen Arzt.',
    'Datenquelle: Max Rubner-Institut (2025): Bundeslebensmittelschlüssel (BLS), Version 4.0 – Deutsche Nährstoffdatenbank, Karlsruhe (CC BY 4.0) · DGE-Referenzwerte · Eigene Messungen.',
    'Datenschutz: Deine Mess- und Gesundheitsdaten werden ausschließlich lokal auf diesem Gerät gespeichert. Nur wenn du in der Ernährungssuche aktiv die optionale Online-Suche nutzt, wird dein Suchbegriff an Open Food Facts übertragen – sonst findet keine Datenübertragung an Server statt.',
    `Erstellt mit VitalMetrics · ${dateStr}`
  ];
  footerParas.forEach((para, i) => {
    const lines = doc.splitTextToSize(para, pageW - marginX * 2);
    lines.forEach(l => {
      ensureSpace(4);
      doc.text(l, marginX, y);
      y += 3.6;
    });
    if (i < footerParas.length - 1) y += 2;
  });

  return doc;
}
