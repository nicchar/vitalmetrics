import { CYCLE_WELLNESS_CLUSTERS, TRADITIONAL_PHYTO_NOTE, PMDS_LEARNING_CONTENT } from '../../domain/cycleWellness.js';
import { TRADITIONAL_DISCLAIMER } from '../../domain/traditionalPerspectives.js';
import { navigate } from '../../router.js';

export function renderCycleWellness(container) {
  let html = `<div class="screen skin-vitality-screen">
    <div class="screen-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button id="btn-back-cycle-wellness" style="background:none;font-size:22px;cursor:pointer">←</button>
        <h1 class="screen-title">🌸 PMS, Prämenopause &amp; Menopause</h1>
      </div>
      <p class="app-subtitle">Reiner Lerninhalt - unabhängig von deinen eigenen Trackingdaten, keine Bewertung.</p>
    </div>
  `;

  for (const cluster of CYCLE_WELLNESS_CLUSTERS) {
    html += `<div class="category-section">
      <h2 class="category-title">${cluster.icon} ${cluster.title}</h2>
      <p class="hint-text" style="padding:0 4px">${cluster.intro}</p>
      <div class="biomarker-grid">`;
    for (const item of cluster.items) {
      html += `<div class="biomarker-card biomarker-card-info">
        <div class="card-header">
          <span class="card-name">${item.label}</span>
          <span class="evidence-badge evidence-${item.evidence === 'gut belegt' ? 'strong' : 'emerging'}">${item.evidence}</span>
        </div>
        <div class="card-info-desc">${item.text}</div>
      </div>`;
    }
    html += `</div></div>`;
  }

  html += `<div class="category-section traditional-section" style="padding:14px;border-radius:10px">
    <h2 class="category-title">🌿 Traditionelle/pflanzliche Perspektive</h2>
    <p class="card-info-desc">${TRADITIONAL_PHYTO_NOTE}</p>
    <p class="traditional-disclaimer" style="margin-top:8px">${TRADITIONAL_DISCLAIMER}</p>
  </div>`;

  html += `<div class="category-section">
    <h2 class="category-title">ℹ️ ${PMDS_LEARNING_CONTENT.title}</h2>
    <p class="card-info-desc">${PMDS_LEARNING_CONTENT.text}</p>
    <p class="hint-text" style="margin-top:8px">${PMDS_LEARNING_CONTENT.hint}</p>
  </div>`;

  html += `<div class="disclaimer"><p>ℹ️ Perimenopause und Menopause sind ein natürlicher Übergang, kein Krankheitszustand. Diese Übersicht ersetzt keine ärztliche Beratung. Nährstoff-Angaben folgen den zugelassenen EFSA-Health-Claims.</p></div></div>`;

  container.innerHTML = html;
  container.querySelector('#btn-back-cycle-wellness').addEventListener('click', () => navigate('tools'));
}
