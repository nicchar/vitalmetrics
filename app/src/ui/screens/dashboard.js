import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { getStatus, getStatusColor, getStatusLabel } from '../../domain/status.js';
import { getRefRangeLabel } from '../../domain/ranges.js';
import { entitlements, FREE_BIOMARKER_IDS } from '../../domain/entitlements.js';
import { navigate } from '../../router.js';

export function renderDashboard(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const latestAll = measurementRepo.getLatestAll();
  const isPremium = entitlements.isPremium();

  // Group biomarkers by category
  const grouped = {};
  for (const bm of catalog.biomarkers) {
    if (!grouped[bm.category]) grouped[bm.category] = [];
    grouped[bm.category].push(bm);
  }

  // Summary
  const trackedBms = catalog.biomarkers.filter(bm => latestAll[bm.id]);
  const statuses = trackedBms.map(bm => getStatus(latestAll[bm.id]?.value, bm, profile));
  const okCount = statuses.filter(s => s === 'ok').length;
  const lowCount = statuses.filter(s => s === 'low').length;
  const highCount = statuses.filter(s => s === 'high').length;

  let html = `<div class="screen dashboard-screen">
    <div class="screen-header">
      <h1 class="app-title">VitalMetrics</h1>
      <p class="app-subtitle">${profile.name ? `Hallo ${profile.name} · ` : ''}Deine Übersicht</p>
    </div>`;

  // Premium banner (if not premium)
  if (!isPremium) {
    html += `<div class="premium-banner" id="premium-banner">
      <span>⭐ 4 Werte gratis · <strong>Alle 28 Werte mit Premium</strong></span>
      <button class="btn-upgrade-sm" id="btn-upgrade-banner">Upgrade</button>
    </div>`;
  }

  if (trackedBms.length > 0) {
    html += `<div class="summary-bar">
      <div class="summary-item ok"><span class="summary-count">${okCount}</span><span class="summary-label">Normal</span></div>
      <div class="summary-item low"><span class="summary-count">${lowCount}</span><span class="summary-label">Zu niedrig</span></div>
      <div class="summary-item high"><span class="summary-count">${highCount}</span><span class="summary-label">Zu hoch</span></div>
    </div>`;
  }

  for (const [catKey, biomarkers] of Object.entries(grouped)) {
    html += `<div class="category-section">
      <h2 class="category-title">${catalog.categories[catKey]}</h2>
      <div class="biomarker-grid">`;

    for (const bm of biomarkers) {
      const canTrack = entitlements.canTrack(bm.id);
      const latest = latestAll[bm.id];
      const status = latest ? getStatus(latest.value, bm, profile) : 'unknown';
      const color = canTrack ? getStatusColor(status) : '#E0E0E0';
      const valueLabel = latest ? `${latest.value} ${bm.unit}` : '– –';
      const refLabel = getRefRangeLabel(bm, profile);

      if (canTrack) {
        html += `<div class="biomarker-card" data-id="${bm.id}" style="border-left: 4px solid ${color}">
          <div class="card-header">
            <span class="card-name">${bm.name}</span>
            <span class="status-dot" style="background:${color}"></span>
          </div>
          <div class="card-value">${valueLabel}</div>
          <div class="card-ref">Ref: ${refLabel}</div>
          ${bm.selfTestAvailable ? `<div class="self-test-badge">🧪 Heimtest verfügbar</div>` : ''}
          <div class="card-actions">
            <button class="btn-card btn-entry" data-id="${bm.id}">+ Eintragen</button>
            ${latest ? `<button class="btn-card btn-trend" data-id="${bm.id}">📈 Verlauf</button>` : ''}
          </div>
        </div>`;
      } else {
        html += `<div class="biomarker-card biomarker-locked" data-id="${bm.id}">
          <div class="card-header">
            <span class="card-name">${bm.name}</span>
            <span class="lock-icon">🔒</span>
          </div>
          <div class="card-value locked-value">Premium</div>
          <div class="card-ref">Ref: ${refLabel}</div>
          <div class="card-actions">
            <button class="btn-card btn-unlock" data-id="${bm.id}">⭐ Freischalten</button>
          </div>
        </div>`;
      }
    }
    html += `</div></div>`;
  }

  html += `<div class="disclaimer"><p>ℹ️ VitalMetrics ist kein Medizinprodukt. Referenzwerte nach DGE${profile.sex ? ` (${profile.sex === 'f' ? 'weiblich' : 'männlich'})` : ''}. Ersetzt keine ärztliche Beratung.</p></div></div>`;

  container.innerHTML = html;

  // Events
  container.querySelectorAll('.btn-entry').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('entry', btn.dataset.id); });
  });
  container.querySelectorAll('.btn-trend').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('trend', btn.dataset.id); });
  });
  container.querySelectorAll('.biomarker-card:not(.biomarker-locked)').forEach(card => {
    card.addEventListener('click', () => navigate('trend', card.dataset.id));
  });
  container.querySelectorAll('.btn-unlock, #btn-upgrade-banner').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('premium'); });
  });
}
