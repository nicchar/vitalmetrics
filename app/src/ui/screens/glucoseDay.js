import { glucoseDayRepo } from '../../infra/db/repositories/glucoseDayRepo.js';
import { GLUCOSE_SLOTS, assessGlucosePattern } from '../../domain/glucose.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';

export function renderGlucoseDay(c) {
  let currentDate = new Date().toISOString().slice(0, 10);

  function fmtDisplayDate(iso) {
    const d = new Date(iso + 'T12:00:00');
    const today = new Date().toISOString().slice(0, 10);
    if (iso === today) return 'Heute';
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (iso === yesterday) return 'Gestern';
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
  }
  function shiftDate(iso, days) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function buildChart(entry) {
    if (!entry) return '';
    const points = GLUCOSE_SLOTS.map(s => entry[s.key] || null);
    if (points.filter(Boolean).length < 2) return '';
    const maxV = Math.max(200, ...points.filter(Boolean));
    const minV = 50;
    const w = 280, h = 100, pad = 24;
    const xs = [0, 1, 2, 3].map(i => pad + i * ((w - pad * 2) / 3));
    const ys = points.map(v => v ? h - pad - ((v - minV) / (maxV - minV)) * (h - pad * 2) : null);
    let path = '';
    let dots = '';
    let prevX = null;
    points.forEach((v, i) => {
      if (v === null) { prevX = null; return; }
      const x = xs[i], y = ys[i];
      path += prevX !== null ? ` L${x},${y}` : `M${x},${y}`;
      const col = v >= 140 ? '#e53935' : v >= 100 ? '#ff9800' : '#43a047';
      dots += `<circle cx="${x}" cy="${y}" r="5" fill="${col}"/>`;
      dots += `<text x="${x}" y="${y - 9}" text-anchor="middle" font-size="10" fill="${col}" font-weight="700">${v}</text>`;
      prevX = x;
    });
    const labels = GLUCOSE_SLOTS.map((s, i) => `<text x="${xs[i]}" y="${h - 6}" text-anchor="middle" font-size="9" fill="#999">${s.icon}</text>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:110px">
      <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#eee" stroke-width="1"/>
      <path d="${path}" stroke="#43a047" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}${labels}
    </svg>`;
  }

  function build() {
    const entry = glucoseDayRepo.getDay(currentDate);
    const assessment = assessGlucosePattern(entry);
    const chart = buildChart(entry);
    const tomorrow = shiftDate(currentDate, 1);
    const canGoForward = tomorrow <= new Date().toISOString().slice(0, 10);
    return `<div class="glucose-day-screen">
      <div style="display:flex;align-items:center;gap:12px;padding:20px 16px 8px">
        <button id="btn-back-glucose" style="background:none;font-size:22px;cursor:pointer">←</button>
        <span style="font-size:20px;font-weight:800">🩸 Tagesgang</span>
      </div>
      <div class="glucose-date-nav">
        <button class="glucose-date-btn" id="btn-glu-prev">‹</button>
        <span class="glucose-date-label">${fmtDisplayDate(currentDate)}</span>
        <button class="glucose-date-btn" id="btn-glu-next" ${!canGoForward ? 'disabled style="opacity:.4"' : ''}>›</button>
      </div>
      <div class="glucose-slots">
        ${GLUCOSE_SLOTS.map(s => `
          <div class="glucose-slot ${(entry[s.key] && entry[s.key] > 0) ? 'has-value' : ''}">
            <div class="glucose-slot-icon">${s.icon}</div>
            <div class="glucose-slot-info">
              <div class="glucose-slot-label">${s.label}</div>
              <div class="glucose-slot-hint">${s.hint}</div>
            </div>
            <input type="number" class="glucose-slot-input" data-key="${s.key}"
              value="${entry[s.key] || ''}" placeholder="–" min="40" max="400">
            <span class="glucose-slot-unit">mg/dL</span>
          </div>`).join('')}
      </div>
      <div style="padding:0 16px 12px">
        <button class="btn-primary" id="btn-save-glucose" style="padding:13px">💾 Tageswerte speichern</button>
      </div>
      ${chart ? `<div class="glucose-chart-card"><div class="glucose-chart-title">📈 Tagesverlauf</div>${chart}</div>` : ''}
      ${assessment ? `<div class="glucose-status-card ${assessment.level}">
        <div class="glucose-status-title">${assessment.title}</div>
        <div class="glucose-status-text">${assessment.text}</div>
      </div>` : ''}
      <div class="glucose-info-box">
        💡 <strong>Wie du Spikes vermeidest:</strong> Ballaststoffe und Protein zuerst essen (vor den Kohlenhydraten) · 10–15 Minuten nach dem Essen spazieren gehen · 1 TL Apfelessig in Wasser vor der Mahlzeit · langsam essen und gut kauen.
      </div>
    </div>`;
  }

  function attachEvents() {
    c.querySelector('#btn-back-glucose').addEventListener('click', () => navigate('tools'));
    c.querySelector('#btn-glu-prev').addEventListener('click', () => {
      currentDate = shiftDate(currentDate, -1); c.innerHTML = build(); attachEvents();
    });
    const nextBtn = c.querySelector('#btn-glu-next');
    if (nextBtn && !nextBtn.disabled) nextBtn.addEventListener('click', () => {
      currentDate = shiftDate(currentDate, 1); c.innerHTML = build(); attachEvents();
    });
    c.querySelector('#btn-save-glucose').addEventListener('click', () => {
      const entry = {};
      c.querySelectorAll('.glucose-slot-input').forEach(inp => {
        const v = parseFloat(inp.value);
        if (!isNaN(v) && v > 0) entry[inp.dataset.key] = v;
      });
      glucoseDayRepo.saveDay(currentDate, entry);
      showToast('✅ Tageswerte gespeichert!');
      c.innerHTML = build();
      attachEvents();
    });
  }

  c.innerHTML = build();
  attachEvents();
}
