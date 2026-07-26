import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { getStatus, getStatusColor } from '../../domain/status.js';
import { getRefRangeLabel } from '../../domain/ranges.js';
import { entitlements } from '../../domain/entitlements.js';
import { getSeasonalTip } from '../../domain/seasonalTips.js';
import { getUnderCoveredTags } from '../../domain/mealPlan.js';
import { getAccessTierBadge } from '../../domain/biomarkerAccess.js';
import { DISCLAIMER_SHORT, REFERENCE_VALUES_NOTE } from '../../domain/healthClaims.js';
import { navigate } from '../../router.js';
import { exportService } from '../../infra/pdf/exportService.js';
import { showToast } from '../components/toast.js';

export function renderDashboard(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const latestAll = measurementRepo.getLatestAll();
  const isPremium = entitlements.isPremium();

  // Entscheidung 7 (Zufuhr-Reframing): für Biomarker mit intakeTracking
  // zusätzlich die heutige Zufuhr-Deckung aus dem Ernährungstagebuch zeigen.
  const today = new Date().toISOString().slice(0, 10);
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const dayTotals = nutritionRepo.getDayTotals(today);

  // Group biomarkers by category
  const grouped = {};
  for (const bm of catalog.biomarkers) {
    if (!grouped[bm.category]) grouped[bm.category] = [];
    grouped[bm.category].push(bm);
  }

  // Summary (Status-Einordnung ist seit Entscheidung 2 Premium)
  const trackedBms = catalog.biomarkers.filter(bm => latestAll[bm.id]);
  const statuses = trackedBms.map(bm => getStatus(latestAll[bm.id]?.value, bm, profile));
  const okCount = statuses.filter(s => s === 'ok').length;
  const lowCount = statuses.filter(s => s === 'low').length;
  const highCount = statuses.filter(s => s === 'high').length;

  let html = `<div class="screen dashboard-screen">
    <div class="screen-header">
      <div class="screen-header-row">
        <div>
          <h1 class="app-title">WellANNI</h1>
          <p class="app-subtitle">${profile.name ? `Hallo ${profile.name} · ` : ''}Deine Übersicht</p>
        </div>
        <button class="btn-pdf-export" id="btn-pdf-export" title="Bericht als PDF exportieren">📄 PDF</button>
      </div>
    </div>`;

  // Saisonaler Hinweis (Block E) - rein informativ, keine individuelle Bewertung.
  const seasonalTip = getSeasonalTip();
  if (seasonalTip) {
    html += `<div class="seasonal-tip-banner"><span>${seasonalTip.icon}</span><span>${seasonalTip.text}</span></div>`;
  }

  // Premium banner (if not premium)
  if (!isPremium) {
    html += `<div class="premium-banner" id="premium-banner">
      <span>⭐ Alle Werte gratis eintragen · <strong>Verlauf & Einordnung mit Premium</strong></span>
      <button class="btn-upgrade-sm" id="btn-upgrade-banner">Upgrade</button>
    </div>`;
  }

  // Die Status-Zusammenfassung (ok/niedrig/hoch) ist Teil der Premium-Analyse.
  if (isPremium && trackedBms.length > 0) {
    html += `<div class="summary-bar">
      <div class="summary-item ok"><span class="summary-count">${okCount}</span><span class="summary-label">Im Bereich</span></div>
      <div class="summary-item low"><span class="summary-count">${lowCount}</span><span class="summary-label">Unterhalb</span></div>
      <div class="summary-item high"><span class="summary-count">${highCount}</span><span class="summary-label">Oberhalb</span></div>
    </div>`;
  }

  // Erstnutzer-Führung (UX-Review Juli 2026): dieselbe Unterversorgungs-
  // Berechnung, die schon den Wochenplan mit beeinflusst, hier zusätzlich
  // proaktiv sichtbar machen - genau der Punkt, den Prof. Marchetti bemängelt
  // hatte ("die App berechnet das schon, zeigt es aber nirgends von selbst").
  const underCoveredTags = getUnderCoveredTags(nutritionRepo.getLast7DaysTotals(), dgeRef);
  if (underCoveredTags.length > 0) {
    const names = underCoveredTags
      .map(tag => catalog.biomarkers.find(b => b.id === tag)?.name || tag)
      .join(', ');
    html += `<div class="focus-card" id="focus-card">
      <div class="focus-card-icon">🎯</div>
      <div class="focus-card-body">
        <div class="focus-card-title">Diese Woche im Blick behalten</div>
        <div class="focus-card-desc">Deine Zufuhr lag laut Ernährungstagebuch zuletzt niedriger bei: <strong>${names}</strong>. Der Wochenplan berücksichtigt das bereits bei der Rezeptauswahl.</div>
      </div>
      <div class="tool-card-arrow">›</div>
    </div>`;
  }

  for (const [catKey, biomarkers] of Object.entries(grouped)) {
    html += `<div class="category-section">
      <h2 class="category-title">${catalog.categories[catKey]}</h2>
      <div class="biomarker-grid">`;

    for (const bm of biomarkers) {
      // Entscheidung 7: die 9 Nährstoffe ohne BLS-Lebensmitteldaten (Jod,
      // Selen, Kupfer, Mangan, Chrom, Molybdän, Pantothensäure, Biotin,
      // Fluorid) werden zu reinen Info-Karten - kein Eintrag, kein Status,
      // da wir dafür keine seriöse Referenz-/Zufuhrbasis haben.
      if (bm.infoOnly) {
        html += `<div class="biomarker-card biomarker-card-info" data-id="${bm.id}">
          <div class="card-header">
            <span class="card-name">${bm.name}</span>
            <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span>
          </div>
          <div class="card-info-desc">${bm.description || ''}</div>
          <div class="card-actions">
            <button class="btn-card btn-info" data-id="${bm.id}">ℹ️ Mehr erfahren</button>
          </div>
        </div>`;
        continue;
      }

      const latest = latestAll[bm.id];
      const status = latest ? getStatus(latest.value, bm, profile) : 'unknown';
      // Seit Entscheidung 2 (20.07.2026): Wert eintragen/sehen ist für ALLE
      // Biomarker frei. Die farbliche Einordnung bleibt Premium.
      const color = isPremium ? getStatusColor(status) : '#BDBDBD';
      const valueLabel = latest ? `${latest.value} ${bm.unit}` : '– –';
      const refLabel = getRefRangeLabel(bm, profile);

      // Entscheidung 7: bei intakeTracking-Nährstoffen zusätzlich zeigen,
      // wie viel vom DGE-Tagesbedarf schon über das Ernährungstagebuch
      // gedeckt ist (unabhängig vom manuell eingetragenen Messwert oben).
      let intakeHtml = '';
      if (bm.intakeTracking && dgeRef[bm.intakeKey]) {
        const info = dgeRef[bm.intakeKey];
        const amount = dayTotals[bm.intakeKey] || 0;
        const pct = Math.min(150, Math.round((amount / info.ref) * 100));
        const intakeColor = pct >= 100 ? '#43A047' : pct >= 60 ? '#f59e0b' : '#ef4444';
        intakeHtml = `<div class="card-intake" style="color:${intakeColor}">🥗 ${pct}% der Zufuhr heute (Ernährung)</div>`;
      }

      html += `<div class="biomarker-card" data-id="${bm.id}" style="border-left: 4px solid ${color}">
        <div class="card-header">
          <span class="card-name">${bm.name}</span>
          <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span>
          ${isPremium ? `<span class="status-dot" style="background:${color}"></span>` : ''}
        </div>
        <div class="card-value">${valueLabel}</div>
        <div class="card-ref">Ref: ${refLabel}</div>
        ${intakeHtml}
        ${!isPremium ? `<div class="analysis-upsell-badge">🔒 Verlauf & Einordnung mit Premium</div>` : ''}
        <div class="card-actions">
          <button class="btn-card btn-entry" data-id="${bm.id}">+ Eintragen</button>
          ${latest ? `<button class="btn-card btn-trend" data-id="${bm.id}">📈 Verlauf</button>` : ''}
        </div>
      </div>`;
    }
    html += `</div></div>`;
  }

  html += `<div class="disclaimer"><p>ℹ️ <strong>${DISCLAIMER_SHORT}</strong> ${REFERENCE_VALUES_NOTE}${profile.sex ? ` (${profile.sex === 'f' ? 'weiblich' : 'männlich'})` : ''}</p></div></div>`;

  container.innerHTML = html;

  // Events
  container.querySelectorAll('.btn-entry').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('entry', btn.dataset.id); });
  });
  container.querySelectorAll('.btn-trend').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('trend', btn.dataset.id); });
  });
  container.querySelectorAll('.btn-info').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('trend', btn.dataset.id); });
  });
  container.querySelectorAll('.biomarker-card').forEach(card => {
    card.addEventListener('click', () => navigate('trend', card.dataset.id));
  });
  container.querySelectorAll('#btn-upgrade-banner').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); navigate('premium'); });
  });
  container.querySelector('#focus-card')?.addEventListener('click', () => navigate('mealplan'));

  const pdfBtn = container.querySelector('#btn-pdf-export');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', async () => {
      pdfBtn.disabled = true;
      const originalLabel = pdfBtn.textContent;
      pdfBtn.textContent = '⏳ …';
      try {
        const result = await exportService.exportReport();
        if (result.ok) {
          showToast(result.mode === 'share' ? '✅ Bericht bereit zum Teilen' : '✅ Bericht heruntergeladen');
        } else if (result.reason === 'no-data') {
          showToast('Keine Messwerte vorhanden. Trage zuerst einige Werte ein.');
        } else {
          showToast('PDF-Export fehlgeschlagen. Bitte erneut versuchen.');
          console.error('[Dashboard] PDF-Export fehlgeschlagen:', result);
        }
      } catch (err) {
        showToast('PDF-Export fehlgeschlagen. Bitte erneut versuchen.');
        console.error('[Dashboard] PDF-Export Fehler:', err);
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.textContent = originalLabel;
      }
    });
  }
}
