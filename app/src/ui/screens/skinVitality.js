import { state } from '../../appState.js';
import { entitlements } from '../../domain/entitlements.js';
import { buildSkinVitalityView } from '../../domain/skinVitality.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { hydrationRepo, HYDRATION_REF_ML } from '../../infra/db/repositories/hydrationRepo.js';
import { sleepRepo, SLEEP_REF_HOURS } from '../../infra/db/repositories/sleepRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';

export function renderSkinVitality(container) {
  const isPremium = entitlements.isPremium();

  if (!isPremium) {
    container.innerHTML = `
      <div class="screen skin-vitality-screen">
        <div class="screen-header">
          <h1 class="screen-title">✨ Hautgesundheit & Vitalität</h1>
        </div>
        <p class="hint-text" style="padding:0 16px">
          Vitamin C, Zink, Biotin & Co. neu betrachtet: welche bereits getrackten Werte
          eine belegte Rolle für Haut, Haare und Nägel spielen - inklusive Blutzucker/
          Glykation, Lifestyle-Faktoren und Darm-Haut-Achse. Kein Score, keine Diagnose -
          nur ehrlich eingeordnete Bausteine mit Evidenz-Angabe.
        </p>
        <div class="analysis-upsell-card" style="margin:16px">
          <p>✨ "Hautgesundheit & Vitalität" ist Teil von Premium.</p>
          <button class="btn-secondary btn-upgrade-inline" id="btn-upgrade-skin">⭐ Premium ansehen</button>
        </div>
      </div>`;
    container.querySelector('#btn-upgrade-skin').addEventListener('click', () => navigate('premium'));
    return;
  }

  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const today = new Date().toISOString().slice(0, 10);
  const latestAll = measurementRepo.getLatestAll();
  const dayTotals = nutritionRepo.getDayTotals(today);
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const clusters = buildSkinVitalityView({ latestAll, dayTotals, dgeRef, catalog });

  const hydrationToday = hydrationRepo.getDay(today);
  const sleepToday = sleepRepo.getDay(today);

  let html = `<div class="screen skin-vitality-screen">
    <div class="screen-header">
      <h1 class="screen-title">✨ Hautgesundheit & Vitalität</h1>
      <p class="app-subtitle">Bereits getrackte Werte neu betrachtet - kein Score, keine Diagnose.</p>
    </div>

    <div class="profile-card">
      <h3>💧 Hydration heute</h3>
      <p class="hint-text">Richtgröße: ca. ${HYDRATION_REF_ML} ml Getränke/Tag (allgemeine Wellness-Orientierung, keine medizinische Vorgabe).</p>
      <div class="card-intake" style="margin-bottom:8px">${hydrationToday} ml erfasst</div>
      <div class="form-group" style="display:flex;gap:8px">
        <button class="btn-secondary btn-hydration-add" data-ml="250">+250 ml</button>
        <button class="btn-secondary btn-hydration-add" data-ml="500">+500 ml</button>
      </div>
    </div>

    <div class="profile-card">
      <h3>😴 Schlaf letzte Nacht</h3>
      <p class="hint-text">Richtgröße: ca. ${SLEEP_REF_HOURS} Std./Nacht (allgemeine Orientierung für Erwachsene). Rein subjektives Self-Tracking, keine Schlafanalyse.</p>
      <div class="form-group">
        <label for="sleep-hours">Stunden geschlafen</label>
        <input type="number" id="sleep-hours" class="form-control" min="0" max="14" step="0.5" value="${sleepToday?.hours ?? ''}">
      </div>
      <div class="form-group">
        <label for="sleep-quality">Gefühlte Qualität (1-5)</label>
        <input type="number" id="sleep-quality" class="form-control" min="1" max="5" step="1" value="${sleepToday?.quality ?? ''}">
      </div>
      <button class="btn-primary" id="btn-save-sleep">Speichern</button>
    </div>
  `;

  for (const cluster of clusters) {
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
        <div class="card-intake">${item.status.tracked ? '📊 ' + item.status.text : (item.status.infoOnly ? 'ℹ️ Allgemeiner Hinweis, kein Tracker' : '– noch nicht getrackt –')}</div>
      </div>`;
    }
    html += `</div></div>`;
  }

  html += `<div class="disclaimer"><p>ℹ️ Diese Übersicht ordnet bereits getrackte Werte ein, ersetzt aber keine dermatologische Beratung. Angaben zu Nährstoffen folgen den zugelassenen EFSA-Health-Claims.</p></div></div>`;

  container.innerHTML = html;

  container.querySelectorAll('.btn-hydration-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const ml = parseInt(btn.dataset.ml, 10);
      hydrationRepo.addMl(today, ml);
      showToast(`💧 +${ml} ml erfasst`);
      renderSkinVitality(container);
    });
  });

  container.querySelector('#btn-save-sleep').addEventListener('click', () => {
    const hours = parseFloat(container.querySelector('#sleep-hours').value);
    const quality = parseInt(container.querySelector('#sleep-quality').value, 10);
    if (!hours || !quality) {
      showToast('Bitte Stunden und Qualität angeben.');
      return;
    }
    sleepRepo.setDay(today, { hours, quality });
    showToast('✅ Schlaf gespeichert');
  });
}
