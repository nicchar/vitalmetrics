import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { getStatus, getStatusColor, getStatusLabel, getEscalationHint } from '../../domain/status.js';
import { getRefRange, getRefRangeLabel } from '../../domain/ranges.js';
import { entitlements } from '../../domain/entitlements.js';
import { getAffiliateLink, getTestLink, AFFILIATE_LINKS_ENABLED } from '../../domain/affiliateLinks.js';
import { getRecipesForBiomarkers } from '../../domain/recommendations.js';
import { getInteractionsFor } from '../../domain/nutrientInteractions.js';
import { getMedicationWarnings, MEDICATION_CATEGORIES, MEDICATION_SOURCE_NOTE } from '../../domain/medicationInteractions.js';
import { getAccessTierBadge, ACCESS_TIER_DESCRIPTIONS } from '../../domain/biomarkerAccess.js';
import { navigate } from '../../router.js';

export function renderTrend(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const biomarkerId = state.get('currentBiomarkerId') || 'vitamin_d';
  const bm = catalog.biomarkers.find(b => b.id === biomarkerId) || catalog.biomarkers[0];

  // Entscheidung 7 (Zufuhr-Reframing): die 9 infoOnly-Nährstoffe haben keinen
  // manuellen Messwert und keinen Status mehr - nur noch Info-Inhalte.
  if (bm.infoOnly) {
    renderInfoOnlyTrend(container, catalog, bm, profile);
    return;
  }

  // Seit Entscheidung 2 (20.07.2026) ist Tracking für alle Marker frei --
  // Premium schaltet nur noch Verlaufs-Chart + Status-Einordnung frei.
  const canSeeAnalysis = entitlements.canSeeAnalysis();

  const measurements = measurementRepo.getByBiomarker(bm.id);
  const latestM = measurements[measurements.length - 1];
  const status = latestM ? getStatus(latestM.value, bm, profile) : 'unknown';
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const { min: refMin } = getRefRange(bm, profile);

  // Entscheidung 7 (Zufuhr-Reframing): zusätzlich zum manuellen Messwert
  // zeigen wir für intakeTracking-Nährstoffe die Zufuhr-Deckung der letzten
  // 14 Tage aus dem Ernährungstagebuch (unabhängig vom Messwert oben).
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const intakeInfo = bm.intakeTracking ? dgeRef[bm.intakeKey] : null;
  const coverageHistory = intakeInfo ? nutritionRepo.getCoverageHistory(bm.intakeKey, intakeInfo.ref, 14) : [];

  // Selektor zeigt wieder den kompletten Katalog (nicht mehr auf "trackable" begrenzt).
  const options = catalog.biomarkers.map(b => `<option value="${b.id}" ${b.id === bm.id ? 'selected' : ''}>${b.name}</option>`).join('');

  const escalationHint = latestM ? getEscalationHint(status) : null;

  const statusBannerHtml = canSeeAnalysis
    ? `<div class="status-banner" style="background:${statusColor}20; border-left:4px solid ${statusColor}">
         <span class="status-dot" style="background:${statusColor}"></span>
         <span class="status-text">${statusLabel}</span>
         ${latestM ? `<span class="latest-value">${latestM.value} ${bm.unit}</span>` : ''}
         ${refMin != null ? `<span class="ref-text">Ref: ${getRefRangeLabel(bm, profile)}${profile.sex ? ` (${profile.sex === 'f' ? '♀' : '♂'})` : ''}</span>` : ''}
         <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span>
         ${bm.selfTestAvailable ? `<span class="ref-text">🧪 ${bm.selfTestNote}</span>` : ''}
         ${escalationHint ? `<p class="escalation-hint">ℹ️ ${escalationHint}</p>` : ''}
       </div>`
    : `<div class="status-banner status-banner-locked">
         ${latestM ? `<span class="latest-value">${latestM.value} ${bm.unit}</span>` : `<span class="latest-value">Noch kein Wert</span>`}
         <span class="analysis-upsell-text">🔒 Farbliche Einordnung mit Premium</span>
       </div>`;

  const historyRows = [...measurements].reverse();

  const chartOrHistoryHtml = measurements.length === 0
    ? `<div class="no-data-card">
         <p>Noch keine Einträge für <strong>${bm.name}</strong>.</p>
         <button class="btn-primary" id="btn-add-first">Ersten Wert eintragen</button>
       </div>`
    : canSeeAnalysis
      ? `<div class="chart-container"><canvas id="trend-chart"></canvas></div>
         <div class="measurements-history">
           <h3>Verlauf</h3>
           <table class="history-table">
             <thead><tr><th>Datum</th><th>Wert</th><th>Status</th><th></th></tr></thead>
             <tbody>
               ${historyRows.map(m => {
                 const s = getStatus(m.value, bm, profile);
                 return `<tr>
                   <td>${formatDate(m.date)}</td>
                   <td>${m.value} ${bm.unit}</td>
                   <td><span class="status-badge" style="background:${getStatusColor(s)}">${getStatusLabel(s)}</span></td>
                   <td><button class="btn-delete" data-id="${m.id}">🗑️</button></td>
                 </tr>`;
               }).join('')}
             </tbody>
           </table>
         </div>`
      : `<div class="measurements-history">
           <h3>Verlauf</h3>
           <table class="history-table history-table-plain">
             <thead><tr><th>Datum</th><th>Wert</th><th></th></tr></thead>
             <tbody>
               ${historyRows.map(m => `<tr>
                 <td>${formatDate(m.date)}</td>
                 <td>${m.value} ${bm.unit}</td>
                 <td><button class="btn-delete" data-id="${m.id}">🗑️</button></td>
               </tr>`).join('')}
             </tbody>
           </table>
           <div class="analysis-upsell-card">
             <p>📈 Verlaufs-Chart und farbliche Einordnung gegen deinen Referenzbereich sind Teil von Premium.</p>
             <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-trend">⭐ Premium ansehen</button>
           </div>
         </div>`;

  const intakeChartHtml = intakeInfo ? `
    <div class="info-section">
      <h3>🥗 Zufuhr aus deinem Ernährungstagebuch</h3>
      <p class="intake-chart-hint">Letzte 14 Tage · Deckung des DGE-Tagesbedarfs (${intakeInfo.ref} ${intakeInfo.unit}) über geloggte Mahlzeiten – unabhängig vom oben eingetragenen Messwert.</p>
      <div class="intake-chart-container"><canvas id="intake-chart"></canvas></div>
    </div>` : '';

  container.innerHTML = `
    <div class="screen trend-screen">
      <div class="screen-header">
        <select id="trend-bm-select" class="form-control trend-select">${options}</select>
      </div>

      ${statusBannerHtml}
      ${chartOrHistoryHtml}
      ${intakeChartHtml}

      ${renderMedicationWarnings(bm, profile)}
      ${bm.category !== 'body' ? renderFoodsSection(bm, status) : ''}
      ${bm.category !== 'body' ? renderInteractionsSection(bm) : ''}
      <button class="btn-primary btn-add-entry" id="btn-add-entry">+ Neuen Wert eintragen</button>
    </div>`;

  if (measurements.length > 0 && canSeeAnalysis) drawChart(measurements, bm, profile);
  if (intakeInfo) drawIntakeChart(coverageHistory, intakeInfo);

  container.querySelector('#trend-bm-select').addEventListener('change', e => navigate('trend', e.target.value));
  container.querySelector('#btn-add-entry')?.addEventListener('click', () => navigate('entry', bm.id));
  container.querySelector('#btn-add-first')?.addEventListener('click', () => navigate('entry', bm.id));
  container.querySelector('#btn-upgrade-trend')?.addEventListener('click', () => navigate('premium'));
  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Eintrag löschen?')) { measurementRepo.delete(parseInt(btn.dataset.id)); navigate('trend', bm.id); }
    });
  });
  container.querySelector('#btn-show-recipes')?.addEventListener('click', () => {
    const el = container.querySelector('#recipes-list');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });
}

const LIFESTYLE_LABELS = { alkohol: 'Alkohol', koffein: 'Kaffee/Tee (Koffein)', rauchen: 'Rauchen', fett: 'Nahrungsfett' };

function partnerLabel(id) {
  if (LIFESTYLE_LABELS[id]) return LIFESTYLE_LABELS[id];
  const catalog = state.get('catalog');
  return catalog?.biomarkers?.find(b => b.id === id)?.name || id;
}

function renderMedicationWarnings(bm, profile) {
  const warnings = getMedicationWarnings(profile.medications, bm.id);
  if (!warnings.length) return '';
  return `<div class="info-section medication-warning-box">
    <h3>💊 Hinweis für deine Medikamente</h3>
    <ul class="interactions-list">
      ${warnings.map(w => `<li class="interaction-item interaction-hemmt">
        <span class="interaction-icon">⚠️</span>
        <span><strong>${MEDICATION_CATEGORIES[w.med] || w.med}:</strong> ${w.text}</span>
      </li>`).join('')}
    </ul>
    <p style="font-size:11px;color:var(--text-secondary);margin-top:6px">Allgemeiner Hinweis, keine individuelle Bewertung – bei Fragen bitte Arzt oder Apotheke ansprechen.</p>
    <p style="font-size:11px;color:var(--text-hint);margin-top:2px">${MEDICATION_SOURCE_NOTE}</p>
  </div>`;
}

function renderInteractionsSection(bm) {
  const interactions = getInteractionsFor(bm.id);
  if (!interactions.length) return '';
  return `<div class="info-section">
    <h3>🔄 Wechselwirkungen</h3>
    <p style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">Allgemein bekannte Effekte – kein Ersatz für individuelle Ernährungsberatung.</p>
    <ul class="interactions-list">
      ${interactions.map(i => `<li class="interaction-item interaction-${i.effect}">
        <span class="interaction-icon">${i.effect === 'foerdert' ? '⬆️' : '⬇️'}</span>
        <span><strong>${partnerLabel(i.partner)}</strong> ${i.effect === 'foerdert' ? 'fördert' : 'hemmt'} ${partnerLabel(bm.id)}: ${i.text}</span>
      </li>`).join('')}
    </ul>
  </div>`;
}

function renderFoodsSection(bm, status) {
  // Dynamische Rezeptsuche über recipes.json (258 Rezepte: vegetarisch,
  // Fleisch/Fisch, Keto) statt der frueheren hardcoded 8-Rezept-Map.
  const allRecipes = state.get('recipes') || [];
  const matches = getRecipesForBiomarkers(allRecipes, [bm.id], 6);

  const categoryLabel = { vegetarisch: '🥬 Vegetarisch', fleisch_fisch: '🍗 Fleisch/Fisch', keto: '🥑 Keto' };
  const recipesHtml = matches.length
    ? matches.map(r => `
        <div class="recipe-card">
          <div class="recipe-header">
            <span class="recipe-title">${r.title}</span>
            <span class="recipe-duration">⏱ ${r.duration}</span>
          </div>
          <div class="recipe-meta">${categoryLabel[r.category] || ''} · ${r.servings} Portion${r.servings !== 1 ? 'en' : ''}</div>
          <p class="recipe-highlight">${r.highlight}</p>
          <details class="recipe-details">
            <summary>Zutaten &amp; Zubereitung</summary>
            <ul class="recipe-ingredients">${(r.ingredients || []).map(i => `<li>${i}</li>`).join('')}</ul>
            <ol class="recipe-steps">${(r.steps || []).map(s => `<li>${s}</li>`).join('')}</ol>
          </details>
        </div>`).join('')
    : '<p style="color:#9e9e9e;font-size:13px">Keine Rezepte verfügbar.</p>';

  // Amazon-Supplement-/Schnelltest-Box: seit Entscheidung 2 für ALLE Nutzer
  // sichtbar (nicht Premium-gated), aber erst live sobald AFFILIATE_LINKS_ENABLED
  // auf true steht (siehe affiliateLinks.js -- wartet auf Amazon-Zulassung).
  const affLink = AFFILIATE_LINKS_ENABLED ? getAffiliateLink(bm.id) : null;
  const testLink = AFFILIATE_LINKS_ENABLED ? getTestLink(bm.id) : null;
  const affiliateHtml = affLink ? `
    <div class="ernaehrung-banner">
      <span class="ernaehrung-banner-icon">🥦</span>
      <div>
        <strong>Ernährung zuerst!</strong>
        <span>Supplements sind kein Ersatz für eine ausgewogene Ernährung. Versuche deinen Bedarf immer zuerst über natürliche Lebensmittel zu decken.</span>
      </div>
    </div>
    <div class="affiliate-box">
      <div class="affiliate-box-text">
        <strong>💊 Supplement entdecken</strong>
        <small>Passende Nahrungsergänzung zu ${bm.name} bei Amazon.</small>
      </div>
      <div class="affiliate-btn-group">
        <a href="${affLink}" target="_blank" rel="noopener sponsored" class="affiliate-btn">🛒 Supplement</a>
        ${testLink ? `<a href="${testLink}" target="_blank" rel="noopener sponsored" class="affiliate-btn affiliate-btn-test">🧪 Schnelltest</a>` : ''}
      </div>
      <span class="affiliate-disclaimer">* Affiliate-Links · kleine Provision bei Kauf, ohne Mehrkosten für dich · Kein medizinischer Rat – bitte Arzt konsultieren.</span>
    </div>` : '';

  return `<div class="info-section">
    <h3>🥗 Lebensmittelquellen</h3>
    <div class="foods-grid">${(bm.foods || []).map(f => `<span class="food-tag">${f}</span>`).join('')}</div>
    ${affiliateHtml}
    ${status === 'low' && bm.deficiencySymptoms?.length ? `
      <div class="symptoms-box">
        <h4>⚠️ Typische Mangelsymptome</h4>
        <ul>${bm.deficiencySymptoms.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>` : ''}
    ${status === 'high' && bm.highSymptoms?.length ? `
      <div class="symptoms-box">
        <h4>⚠️ Mögliche Auswirkungen bei erhöhtem Wert</h4>
        <ul>${bm.highSymptoms.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>` : ''}
    ${bm.tips?.length ? `<div class="tips-section"><h4>💡 Tipps</h4>${bm.tips.map(t => `<p class="tip-text">${t}</p>`).join('')}</div>` : ''}
    ${matches.length ? `
      <button class="btn-secondary" id="btn-show-recipes">🍽️ Passende Rezepte anzeigen</button>
      <div id="recipes-list" style="display:none">${recipesHtml}</div>` : ''}
  </div>`;
}

function drawChart(measurements, bm, profile) {
  const canvas = document.getElementById('trend-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  if (canvas._chartInstance) { canvas._chartInstance.destroy(); }

  const { min: refMin, max: refMax } = getRefRange(bm, profile);
  const labels = measurements.map(m => formatDate(m.date));
  const values = measurements.map(m => m.value);
  const pointColors = values.map(v => getStatusColor(getStatus(v, bm, profile)));

  const datasets = [{
    label: bm.name, data: values,
    borderColor: '#1a7a6e', backgroundColor: 'rgba(26,122,110,0.1)',
    pointBackgroundColor: pointColors, pointRadius: 6, pointHoverRadius: 8,
    tension: 0.3, fill: true
  }];

  if (refMin != null && refMax != null) {
    datasets.push({ label: `Min (${refMin} ${bm.unit})`, data: measurements.map(() => refMin), borderColor: '#43A04788', borderDash:[6,4], borderWidth:1.5, pointRadius:0, fill:false });
    datasets.push({ label: `Max (${refMax} ${bm.unit})`, data: measurements.map(() => refMax), borderColor: '#43A04788', borderDash:[6,4], borderWidth:1.5, pointRadius:0, fill:'-1', backgroundColor:'rgba(67,160,71,0.07)' });
  }

  const chart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { display: refMin != null, position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} ${bm.unit}` } }
      },
      scales: { y: { title: { display: true, text: bm.unit } } }
    }
  });
  canvas._chartInstance = chart;
}

function drawIntakeChart(coverageHistory, intakeInfo) {
  const canvas = document.getElementById('intake-chart');
  if (!canvas || typeof Chart === 'undefined' || !coverageHistory.length) return;
  if (canvas._chartInstance) { canvas._chartInstance.destroy(); }

  const labels = coverageHistory.map(d => formatDate(d.date));
  const values = coverageHistory.map(d => d.pct);
  const barColors = values.map(v => v >= 100 ? '#43A047' : v >= 60 ? '#f59e0b' : '#ef4444');

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Zufuhr-Deckung', data: values, backgroundColor: barColors, borderRadius: 4 },
        { label: '100 % Tagesbedarf', data: values.map(() => 100), type: 'line',
          borderColor: '#1a7a6e88', borderDash: [6, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.dataset.type === 'line' ? '100 % Tagesbedarf' : `${ctx.parsed.y}% (${coverageHistory[ctx.dataIndex].amount} ${intakeInfo.unit})` } },
      },
      scales: { y: { title: { display: true, text: '% des Tagesbedarfs' } } },
    },
  });
  canvas._chartInstance = chart;
}

/**
 * Vereinfachte Trend-Ansicht für infoOnly-Biomarker (Entscheidung 7): kein
 * manueller Messwert, kein Status, keine Chart - nur Nachschlage-Inhalte
 * (Funktion, Lebensmittel, Tipps). Grund: für diese 9 Nährstoffe (Jod,
 * Selen, Kupfer, Mangan, Chrom, Molybdän, Pantothensäure, Biotin, Fluorid)
 * hat die BLS-Lebensmitteldatenbank keine Werte hinterlegt, daher wäre
 * weder ein Blutwert-Status noch eine Zufuhr-Deckung seriös berechenbar.
 */
function renderInfoOnlyTrend(container, catalog, bm, profile) {
  const options = catalog.biomarkers.map(b => `<option value="${b.id}" ${b.id === bm.id ? 'selected' : ''}>${b.name}</option>`).join('');

  container.innerHTML = `
    <div class="screen trend-screen">
      <div class="screen-header">
        <select id="trend-bm-select" class="form-control trend-select">${options}</select>
      </div>

      <div class="info-section">
        <h3>${bm.name} <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span></h3>
        <p class="bm-description">${bm.description || ''}</p>
        <p class="bm-function"><strong>Funktion:</strong> ${bm.function || ''}</p>
        <p style="font-size:12px;color:var(--text-secondary);margin-top:8px">
          ℹ️ Für diesen Nährstoff gibt es aktuell keinen Mess- oder Zufuhr-Tracking in VitalMetrics –
          unsere Lebensmitteldatenbank hat dafür noch keine verlässlichen Werte hinterlegt.
          ${ACCESS_TIER_DESCRIPTIONS[bm.accessTier] ? ` ${ACCESS_TIER_DESCRIPTIONS[bm.accessTier]}` : ''}
        </p>
      </div>

      ${renderMedicationWarnings(bm, profile)}
      ${renderFoodsSection(bm, 'unknown')}
      ${renderInteractionsSection(bm)}
    </div>`;

  container.querySelector('#trend-bm-select').addEventListener('change', e => navigate('trend', e.target.value));
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}
