import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { validateMeasurement } from '../../domain/validation.js';
import { getRefRangeLabel } from '../../domain/ranges.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';
import { feedbackService } from '../../infra/feedback/feedbackService.js';
import { getAccessTierBadge, ACCESS_TIER_DESCRIPTIONS } from '../../domain/biomarkerAccess.js';

export function renderEntry(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const selectedId = state.get('currentBiomarkerId') || 'vitamin_d';

  // Seit Entscheidung 2 (20.07.2026) sind alle Marker frei eintragbar.
  // Seit Entscheidung 7 (Zufuhr-Reframing) sind die 9 infoOnly-Nährstoffe
  // (Jod, Selen, Kupfer, Mangan, Chrom, Molybdän, Pantothensäure, Biotin,
  // Fluorid) davon ausgenommen - dafür fehlt uns eine seriöse Referenzbasis
  // für einen manuellen "Messwert", sie sind nur noch Info-Karten.
  const trackable = catalog.biomarkers.filter(bm => !bm.infoOnly);
  const options = trackable
    .map(bm => `<option value="${bm.id}" ${bm.id === selectedId ? 'selected' : ''}>${bm.name} (${bm.unit})</option>`)
    .join('');

  const today = new Date().toISOString().split('T')[0];
  // Auf "trackable" beschränkt, damit die Vorauswahl nie auf einen infoOnly-
  // Marker faellt, der im Selektor oben gar nicht als Option existiert.
  const selectedBm = trackable.find(bm => bm.id === selectedId) || trackable[0];

  container.innerHTML = `
    <div class="screen entry-screen">
      <div class="screen-header">
        <h1 class="screen-title">Wert eintragen</h1>
      </div>
      <div class="entry-form-card">
        <div class="form-group">
          <label for="bm-select">Vitamin / Mineralstoff / Messwert</label>
          <select id="bm-select" class="form-control">${options}</select>
        </div>
        <div class="form-group">
          <label for="bm-value">Gemessener Wert</label>
          <div class="input-with-unit">
            <input type="number" id="bm-value" class="form-control" placeholder="z. B. 25" step="any" min="0">
            <span class="unit-label" id="unit-label">${selectedBm?.unit ?? ''}</span>
          </div>
          <p class="form-hint" id="ref-hint">Referenzbereich (DGE): ${getRefRangeLabel(selectedBm, profile)}</p>
          <p class="access-tier-hint" id="access-tier-hint">${selectedBm ? `<span class="access-badge access-${selectedBm.accessTier}">${getAccessTierBadge(selectedBm.accessTier) || ''}</span> ${ACCESS_TIER_DESCRIPTIONS[selectedBm.accessTier] || ''}` : ''}</p>
          <p class="self-test-hint" id="self-test-hint">${selectedBm?.selfTestNote ? `🧪 ${selectedBm.selfTestNote}` : ''}</p>
        </div>
        <div class="form-group">
          <label for="bm-date">Datum</label>
          <input type="date" id="bm-date" class="form-control" value="${today}" max="${today}">
        </div>
        <div class="form-group">
          <label for="bm-note">Notiz (optional)</label>
          <input type="text" id="bm-note" class="form-control" placeholder="z. B. nach Arztbesuch, Heimtest">
        </div>
        <p class="error-msg" id="error-msg" style="display:none"></p>
        <button class="btn-primary" id="btn-save">Speichern</button>
        <button class="btn-secondary" id="btn-cancel">Abbrechen</button>
      </div>
      <div class="biomarker-info-card" id="bm-info">${renderBiomarkerInfo(selectedBm, profile)}</div>
    </div>`;

  const select = container.querySelector('#bm-select');
  const unitLabel = container.querySelector('#unit-label');
  const refHintEl = container.querySelector('#ref-hint');
  const accessTierEl = container.querySelector('#access-tier-hint');
  const selfTestEl = container.querySelector('#self-test-hint');
  const bmInfo = container.querySelector('#bm-info');

  select.addEventListener('change', () => {
    const bm = catalog.biomarkers.find(b => b.id === select.value);
    if (!bm) return;
    state.set('currentBiomarkerId', bm.id);
    unitLabel.textContent = bm.unit;
    refHintEl.textContent = `Referenzbereich (DGE): ${getRefRangeLabel(bm, profile)}`;
    accessTierEl.innerHTML = `<span class="access-badge access-${bm.accessTier}">${getAccessTierBadge(bm.accessTier) || ''}</span> ${ACCESS_TIER_DESCRIPTIONS[bm.accessTier] || ''}`;
    selfTestEl.textContent = bm.selfTestNote ? `🧪 ${bm.selfTestNote}` : '';
    bmInfo.innerHTML = renderBiomarkerInfo(bm, profile);
  });

  container.querySelector('#btn-save').addEventListener('click', () => {
    const bm = catalog.biomarkers.find(b => b.id === select.value);
    const value = parseFloat(container.querySelector('#bm-value').value);
    const date = container.querySelector('#bm-date').value;
    const note = container.querySelector('#bm-note').value.trim();
    const errorEl = container.querySelector('#error-msg');
    const { valid, error } = validateMeasurement(value, bm);
    if (!valid) { errorEl.textContent = error; errorEl.style.display = 'block'; return; }
    errorEl.style.display = 'none';
    measurementRepo.add({ biomarkerId: bm.id, value, date, note });
    feedbackService.trackEntryAdded(); // Zähler für automatische Bewertungsanfrage
    showToast(`✅ ${bm.name} gespeichert!`);
    navigate('trend', bm.id);
  });

  container.querySelector('#btn-cancel').addEventListener('click', () => navigate('dashboard'));
}

function renderBiomarkerInfo(bm, profile) {
  if (!bm) return '';
  return `
    <h3>${bm.name}</h3>
    <p class="bm-description">${bm.description}</p>
    <p class="bm-function"><strong>Funktion:</strong> ${bm.function}</p>
    ${bm.tips?.length ? `<div class="tips-section"><strong>💡 Wissenswertes:</strong><ul>${bm.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>` : ''}`;
}
