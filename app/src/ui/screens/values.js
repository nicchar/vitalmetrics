/**
 * values.js – WellANNI 2.2
 *
 * "Alle Werte": hierher sind die Detailkarten aller Vitalstoffe und
 * Messwerte von der Startseite umgezogen. Oben stehen die 8 Kernwerte mit
 * Menge und Referenz, darunter alle übrigen Nährstoffe des Tages, dann die
 * Karten zum Eintragen. Labor- und Spezialwerte (Darm, Longevity, Kognition,
 * Laborwerte) liegen eingeklappt unter "Erweitert".
 *
 * Bewusst ohne Ampelfarben bei der Zufuhr: "x von y" statt roter Prozente.
 * Die farbliche Einordnung gemessener Werte bleibt Teil von Premium.
 */
import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { getStatus, getStatusColor } from '../../domain/status.js';
import { getRefRangeLabel } from '../../domain/ranges.js';
import { entitlements } from '../../domain/entitlements.js';
import { getAccessTierBadge } from '../../domain/biomarkerAccess.js';
import { DISCLAIMER_SHORT, REFERENCE_VALUES_NOTE } from '../../domain/healthClaims.js';
import { CORE_KEYS, coreStatus, STATUS_TEXT, defaultProteinRef, vitaminDNote } from '../../domain/coreNutrients.js';
import { getProteinRefRange } from '../../domain/energyNeeds.js';
import { navigate } from '../../router.js';
import { exportService } from '../../infra/pdf/exportService.js';
import { showToast } from '../components/toast.js';
import { fmtNum } from '../components/recipeFormat.js';

export const ADVANCED_CATEGORIES = ['lab_values', 'gut', 'longevity', 'cognitive'];

function amountText(amount, ref, unit) {
  return `${fmtNum(amount || 0)} von ${fmtNum(ref)} ${unit}`;
}

function biomarkerCard(bm, { latestAll, profile, isPremium, dgeRef, dayTotals }) {
  if (bm.infoOnly) {
    return `<div class="biomarker-card biomarker-card-info" data-id="${bm.id}">
      <div class="card-header">
        <span class="card-name">${bm.name}</span>
        <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span>
      </div>
      <div class="card-info-desc">${bm.description || ''}</div>
      <div class="card-actions"><button class="btn-card btn-info" data-id="${bm.id}">Mehr erfahren</button></div>
    </div>`;
  }
  const latest = latestAll[bm.id];
  const status = latest ? getStatus(latest.value, bm, profile) : 'unknown';
  const color = isPremium ? getStatusColor(status) : 'var(--border)';
  const valueLabel = latest ? `${latest.value} ${bm.unit}` : '– –';

  // Zufuhr-Nährstoffe: Referenz pro Tag direkt aus den D-A-CH-Werten
  // (getDGERef), damit Karte und Startseite dieselbe Zahl zeigen.
  let refLine = `Referenz: ${getRefRangeLabel(bm, profile)}`;
  let intakeHtml = '';
  if (bm.intakeTracking && dgeRef[bm.intakeKey]) {
    const info = dgeRef[bm.intakeKey];
    refLine = `Referenz: ${fmtNum(info.ref)} ${info.unit} pro Tag${bm.intakeKey === 'vit_d' ? ' (ohne Bildung über die Haut)' : ''}`;
    intakeHtml = `<div class="card-intake">Heute gegessen: ${amountText(dayTotals[bm.intakeKey], info.ref, info.unit)}</div>`;
  }

  return `<div class="biomarker-card" data-id="${bm.id}" style="border-left: 4px solid ${color}">
    <div class="card-header">
      <span class="card-name">${bm.name}</span>
      ${bm.description ? `<button class="btn-card-info-toggle" data-id="${bm.id}" type="button" aria-label="Was ist ${bm.name}?">ℹ️</button>` : ''}
      <span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span>
      ${isPremium ? `<span class="status-dot" style="background:${color}"></span>` : ''}
    </div>
    ${bm.description ? `<div class="card-info-desc" id="card-desc-${bm.id}" style="display:none">${bm.description}</div>` : ''}
    <div class="card-value">${valueLabel}</div>
    <div class="card-ref">${refLine}</div>
    ${intakeHtml}
    ${!isPremium && latest ? `<div class="analysis-upsell-badge">Verlauf und Einordnung mit Premium</div>` : ''}
    <div class="card-actions">
      <button class="btn-card btn-entry" data-id="${bm.id}">+ Eintragen</button>
      ${latest ? `<button class="btn-card btn-trend" data-id="${bm.id}">Verlauf</button>` : ''}
    </div>
  </div>`;
}

export function renderValues(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const latestAll = measurementRepo.getLatestAll();
  const isPremium = entitlements.isPremium();
  const today = new Date().toISOString().slice(0, 10);
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const dayTotals = nutritionRepo.getDayTotals(today);

  const weightHistory = measurementRepo.getByBiomarker('gewicht');
  const weightEntry = weightHistory[weightHistory.length - 1] || null;
  const proteinRange = weightEntry ? getProteinRefRange(weightEntry.value, profile.activityLevel, profile.ageGroup === '70+') : null;
  const proteinRef = proteinRange ? proteinRange.min : defaultProteinRef(profile.sex);
  const core = coreStatus({ dayTotals, last7Totals: nutritionRepo.getLast7DaysTotals(), dgeRef, proteinRef });

  // Eiweiß/Ballaststoffe: heute; Vitamine/Mineralstoffe: Schnitt der letzten 7 Tage
  const coreRows = core.map(c => `<div class="${c.status === 'more' ? 'more' : c.status === 'sun' ? 'sun' : 'ok'}"><b>${c.label}</b><small>${c.scope === 'week' ? 'Ø 7 Tage: ' : 'Heute: '}${amountText(c.amount, c.ref, c.unit)}${c.status !== 'none' ? ` · ${STATUS_TEXT[c.status]}` : ''}</small></div>`).join('');

  const otherKeys = Object.keys(dgeRef).filter(k => !CORE_KEYS.includes(k));
  const otherRows = otherKeys.map(k => `<li><span class="q">${dgeRef[k].label}</span><span>${amountText(dayTotals[k], dgeRef[k].ref, dgeRef[k].unit)}</span></li>`).join('');

  const ctx = { latestAll, profile, isPremium, dgeRef, dayTotals };
  const grouped = {};
  for (const bm of catalog.biomarkers) (grouped[bm.category] ||= []).push(bm);
  const section = ([catKey, list]) => `<div class="category-section">
      <h2 class="category-title">${catalog.categories[catKey]}</h2>
      <div class="biomarker-grid">${list.map(bm => biomarkerCard(bm, ctx)).join('')}</div>
    </div>`;
  const mainSections = Object.entries(grouped).filter(([k]) => !ADVANCED_CATEGORIES.includes(k)).map(section).join('');
  const advancedSections = Object.entries(grouped).filter(([k]) => ADVANCED_CATEGORIES.includes(k)).map(section).join('');

  container.innerHTML = `<div class="w-screen" id="values-screen">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <button class="w-link" id="values-back" type="button">← Heute</button>
      <button class="w-link" id="btn-pdf-export" type="button">Als PDF teilen</button>
    </div>
    <h1 class="w-h1" style="margin-top:12px">Alle Werte</h1>
    <p class="w-sub">Was heute auf deinem Teller war und was du gemessen hast</p>

    <section class="w-block">
      <div class="w-block-title">Deine Kernwerte</div>
      <div class="w-card"><div class="w-core" style="margin-top:0">${coreRows}</div>
      <p class="w-small">${weightEntry ? 'Eiweiß-Referenz nach deinem Gewicht.' : 'Eiweiß-Referenz für ein durchschnittliches Körpergewicht – trag dein Gewicht ein, dann rechnen wir genauer.'} Vitamine und Mineralstoffe als Schnitt der letzten 7 Tage mit Einträgen, bewertet ab 3 Tagen. Referenzwerte der Fachgesellschaften für Deutschland, Österreich und die Schweiz (D-A-CH).</p>
      ${core.find(c => c.key === 'vit_d')?.status === 'sun' ? `<p class="w-small">${vitaminDNote()}</p>` : ''}</div>
    </section>

    <section class="w-block">
      <details class="w-details" style="margin-top:0">
        <summary>Weitere Nährstoffe heute <span aria-hidden="true">›</span></summary>
        <div class="w-card"><ul class="w-ing">${otherRows}</ul></div>
      </details>
    </section>

    <section class="w-block">
      <div class="w-block-title">Messwerte und Vitalstoffe</div>
      <input type="search" id="dash-search" class="sport-select" style="width:100%" placeholder="Wert suchen, z. B. Vitamin D oder Eisen" aria-label="Wert suchen">
      ${mainSections}
      <details class="w-details" id="values-advanced">
        <summary>Erweitert: Laborwerte und Spezialdiagnostik <span aria-hidden="true">›</span></summary>
        <p class="w-muted" style="margin:0 4px 8px">Für alle, die Befunde aus Arztpraxis oder Labor festhalten möchten.</p>
        ${advancedSections}
      </details>
    </section>

    <div class="disclaimer"><p><strong>${DISCLAIMER_SHORT}</strong> ${REFERENCE_VALUES_NOTE}${profile.sex ? ` (${profile.sex === 'f' ? 'weiblich' : 'männlich'})` : ''}</p></div>
  </div>`;

  // Suche (Review 9): filtert nach Kartenname, öffnet "Erweitert" bei Treffern dort.
  const dashSearch = container.querySelector('#dash-search');
  dashSearch.addEventListener('input', () => {
    const q = dashSearch.value.trim().toLowerCase();
    container.querySelectorAll('.category-section').forEach(sec => {
      let any = false;
      sec.querySelectorAll('.biomarker-card').forEach(card => {
        const name = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
        const match = !q || name.includes(q);
        card.style.display = match ? '' : 'none';
        if (match) any = true;
      });
      sec.style.display = any ? '' : 'none';
    });
    const adv = container.querySelector('#values-advanced');
    if (q && adv.querySelector('.biomarker-card:not([style*="display: none"])')) adv.open = true;
  });

  container.querySelector('#values-back').addEventListener('click', () => navigate('dashboard'));
  container.querySelectorAll('.btn-entry').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); navigate('entry', btn.dataset.id); }));
  container.querySelectorAll('.btn-trend, .btn-info').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); navigate('trend', btn.dataset.id); }));
  container.querySelectorAll('.btn-card-info-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const desc = container.querySelector(`#card-desc-${btn.dataset.id}`);
      if (desc) desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
    });
  });
  container.querySelectorAll('.biomarker-card').forEach(card => card.addEventListener('click', () => navigate('trend', card.dataset.id)));

  const pdfBtn = container.querySelector('#btn-pdf-export');
  pdfBtn.addEventListener('click', async () => {
    pdfBtn.disabled = true;
    const label = pdfBtn.textContent;
    pdfBtn.textContent = 'Einen Moment …';
    try {
      const result = await exportService.exportReport();
      if (result.ok) showToast(result.mode === 'share' ? 'Bericht ist bereit zum Teilen' : 'Bericht heruntergeladen');
      else if (result.reason === 'no-data') showToast('Noch keine Messwerte da. Trag zuerst ein paar Werte ein.');
      else { showToast('Das hat leider nicht geklappt. Versuch es bitte noch einmal.'); console.error('[Werte] PDF-Export:', result); }
    } catch (err) {
      showToast('Das hat leider nicht geklappt. Versuch es bitte noch einmal.');
      console.error('[Werte] PDF-Export:', err);
    } finally {
      pdfBtn.disabled = false;
      pdfBtn.textContent = label;
    }
  });
}
