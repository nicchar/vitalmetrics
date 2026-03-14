import { state } from '../../appState.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { getStatus, getStatusColor, getStatusLabel } from '../../domain/status.js';
import { getRefRange, getRefRangeLabel } from '../../domain/ranges.js';
import { entitlements } from '../../domain/entitlements.js';
import { navigate } from '../../router.js';

export function renderTrend(container) {
  const catalog = state.get('catalog');
  const profile = profileRepo.get();
  const biomarkerId = state.get('currentBiomarkerId') || 'vitamin_d';
  const bm = catalog.biomarkers.find(b => b.id === biomarkerId) || catalog.biomarkers[0];

  // Redirect if not entitled
  if (!entitlements.canTrack(bm.id)) {
    navigate('premium');
    return;
  }

  const measurements = measurementRepo.getByBiomarker(bm.id);
  const latestM = measurements[measurements.length - 1];
  const status = latestM ? getStatus(latestM.value, bm, profile) : 'unknown';
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const { min: refMin, max: refMax } = getRefRange(bm, profile);

  // Build selector (only trackable)
  const trackable = catalog.biomarkers.filter(b => entitlements.canTrack(b.id));
  const options = trackable.map(b => `<option value="${b.id}" ${b.id === bm.id ? 'selected' : ''}>${b.name}</option>`).join('');

  container.innerHTML = `
    <div class="screen trend-screen">
      <div class="screen-header">
        <select id="trend-bm-select" class="form-control trend-select">${options}</select>
      </div>

      <div class="status-banner" style="background:${statusColor}20; border-left:4px solid ${statusColor}">
        <span class="status-dot" style="background:${statusColor}"></span>
        <span class="status-text">${statusLabel}</span>
        ${latestM ? `<span class="latest-value">${latestM.value} ${bm.unit}</span>` : ''}
        ${refMin != null ? `<span class="ref-text">Ref: ${getRefRangeLabel(bm, profile)}${profile.sex ? ` (${profile.sex === 'f' ? '♀' : '♂'})` : ''}</span>` : ''}
        ${bm.selfTestAvailable ? `<span class="ref-text">🧪 ${bm.selfTestNote}</span>` : ''}
      </div>

      ${measurements.length === 0
        ? `<div class="no-data-card">
             <p>Noch keine Einträge für <strong>${bm.name}</strong>.</p>
             <button class="btn-primary" id="btn-add-first">Ersten Wert eintragen</button>
           </div>`
        : `<div class="chart-container"><canvas id="trend-chart"></canvas></div>
           <div class="measurements-history">
             <h3>Verlauf</h3>
             <table class="history-table">
               <thead><tr><th>Datum</th><th>Wert</th><th>Status</th><th></th></tr></thead>
               <tbody>
                 ${[...measurements].reverse().map(m => {
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
      }

      ${bm.category !== 'body' ? renderFoodsSection(bm, status) : ''}
      <button class="btn-primary btn-add-entry" id="btn-add-entry">+ Neuen Wert eintragen</button>
    </div>`;

  if (measurements.length > 0) drawChart(measurements, bm, profile);

  container.querySelector('#trend-bm-select').addEventListener('change', e => navigate('trend', e.target.value));
  container.querySelector('#btn-add-entry')?.addEventListener('click', () => navigate('entry', bm.id));
  container.querySelector('#btn-add-first')?.addEventListener('click', () => navigate('entry', bm.id));
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

function renderFoodsSection(bm, status) {
  const recipeMap = {
    vitamin_d: ['lachsfilet_spinat','brokkoli_lachs_pfanne'],
    vitamin_b12: ['lachsfilet_spinat','spinat_omelett'],
    vitamin_a: ['karotten_ingwer_suppe'],
    vitamin_c: ['linsensuppe_zitrone','erdbeeren_joghurt_bowl'],
    eisen: ['linsensuppe_zitrone','spinat_omelett','vollkorn_bowl'],
    ferritin: ['linsensuppe_zitrone','spinat_omelett'],
    selen: ['paranuss_smoothie','brokkoli_lachs_pfanne'],
    omega3: ['lachsfilet_spinat','brokkoli_lachs_pfanne'],
    vitamin_b7: ['spinat_omelett','erdbeeren_joghurt_bowl'],
    vitamin_b9: ['linsensuppe_zitrone','vollkorn_bowl'],
    vitamin_k: ['brokkoli_lachs_pfanne'],
    zink: ['vollkorn_bowl'],
    vitamin_e: ['paranuss_smoothie'],
    vitamin_b1: ['linsensuppe_zitrone','vollkorn_bowl'],
    vitamin_b2: ['spinat_omelett','erdbeeren_joghurt_bowl'],
    jod: ['lachsfilet_spinat','erdbeeren_joghurt_bowl'],
    magnesium: ['vollkorn_bowl','paranuss_smoothie']
  };
  const recipeDetails = {
    lachsfilet_spinat: { title:'Lachsfilet auf Spinatbett', duration:'25 Min.', highlight:'Reich an Vitamin D, B12 und Selen.' },
    linsensuppe_zitrone: { title:'Rote Linsensuppe mit Zitrone', duration:'30 Min.', highlight:'Eisen + Vitamin C für optimale Aufnahme.' },
    spinat_omelett: { title:'Spinat-Omelett mit Käse', duration:'15 Min.', highlight:'Biotin, B12, Eisen und Vitamin K.' },
    karotten_ingwer_suppe: { title:'Karotten-Ingwer-Suppe', duration:'25 Min.', highlight:'Beta-Carotin + Fett = optimale Vitamin-A-Aufnahme.' },
    vollkorn_bowl: { title:'Vollkorn-Power-Bowl', duration:'20 Min.', highlight:'B-Vitamine, Eisen, Zink und Magnesium.' },
    paranuss_smoothie: { title:'Selen-Booster-Smoothie', duration:'5 Min.', highlight:'2–3 Paranüsse = Tagesbedarf an Selen.' },
    brokkoli_lachs_pfanne: { title:'Brokkoli-Lachs-Pfanne', duration:'20 Min.', highlight:'Vitamin D, K, Omega-3 und Selen.' },
    erdbeeren_joghurt_bowl: { title:'Erdbeer-Joghurt-Bowl', duration:'5 Min.', highlight:'Vitamin C, B2 und Biotin.' }
  };

  const ids = recipeMap[bm.id] || [];
  const recipesHtml = ids.length
    ? ids.map(id => {
        const r = recipeDetails[id];
        return r ? `<div class="recipe-card"><div class="recipe-header"><span class="recipe-title">${r.title}</span><span class="recipe-duration">⏱ ${r.duration}</span></div><p class="recipe-highlight">${r.highlight}</p></div>` : '';
      }).join('')
    : '<p style="color:#9e9e9e;font-size:13px">Keine Rezepte verfügbar.</p>';

  return `<div class="info-section">
    <h3>🥗 Lebensmittelquellen</h3>
    <div class="foods-grid">${(bm.foods || []).map(f => `<span class="food-tag">${f}</span>`).join('')}</div>
    ${status === 'low' && bm.deficiencySymptoms?.length ? `
      <div class="symptoms-box">
        <h4>⚠️ Typische Mangelsymptome</h4>
        <ul>${bm.deficiencySymptoms.map(s => `<li>${s}</li>`).join('')}</ul>
      </div>` : ''}
    ${bm.tips?.length ? `<div class="tips-section"><h4>💡 Tipps</h4>${bm.tips.map(t => `<p class="tip-text">${t}</p>`).join('')}</div>` : ''}
    ${ids.length ? `
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

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}
