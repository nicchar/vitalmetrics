import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { FASTING_STAGES, FASTING_PROTOCOLS } from '../../domain/fasting.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';

export function renderFasting(c) {
  let fd = fastingRepo.get();
  let timerInterval = null;

  function elapsedMs() {
    if (!fd.isActive || !fd.startTime) return 0;
    return Date.now() - new Date(fd.startTime).getTime();
  }
  function fmtDuration(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  function currentStage(ms) {
    const h = ms / 3600000;
    let stage = null;
    for (const s of FASTING_STAGES) { if (h >= s.h) stage = s; }
    return stage;
  }

  function buildHTML() {
    const targetH = FASTING_PROTOCOLS[fd.protocol] || 16;
    const ms = elapsedMs();
    const pct = Math.min(100, Math.round((ms / (targetH * 3600000)) * 100));
    const stage = currentStage(ms);
    const logReversed = [...(fd.log || [])].reverse().slice(0, 5);
    return `<div class="fasting-screen">
      <div style="display:flex;align-items:center;gap:12px;padding:20px 16px 8px">
        <button id="btn-back-fasting" style="background:none;font-size:22px;cursor:pointer">←</button>
        <span style="font-size:20px;font-weight:800">⏱️ Intervallfasten</span>
      </div>
      <div class="fasting-protocol-row">
        ${Object.keys(FASTING_PROTOCOLS).map(p => `
          <button class="fasting-proto-btn ${fd.protocol === p ? 'active' : ''}" data-proto="${p}" ${fd.isActive ? 'disabled' : ''}>
            ${p}<div class="fasting-proto-label">${FASTING_PROTOCOLS[p]}h fasten</div>
          </button>`).join('')}
      </div>
      <div class="fasting-timer-card">
        <div class="fasting-status-label">${fd.isActive ? '⏱ Fasten läuft' : 'Bereit zum Fasten'}</div>
        <div class="fasting-clock" id="fasting-clock">${fd.isActive ? fmtDuration(ms) : '00:00:00'}</div>
        <div class="fasting-progress-wrap">
          <div class="fasting-progress-bar" id="fasting-bar" style="width:${pct}%"></div>
        </div>
        <div class="fasting-progress-text" id="fasting-pct">${pct}% von ${targetH}h Ziel</div>
        ${stage ? `<div class="fasting-stage">${stage.emoji} ${stage.name}</div>` : ''}
      </div>
      <button class="btn-fasting-toggle ${fd.isActive ? 'active' : ''}" id="btn-fasting-toggle">
        ${fd.isActive ? '⏹ Fasten beenden' : '▶ Fasten starten'}
      </button>
      <div class="fasting-streak">
        <div class="fasting-streak-num">🔥 ${fd.streak || 0}</div>
        <div><div style="font-weight:700">Tage Streak</div><div class="fasting-streak-label">Tage in Folge ein Fastenprotokoll abgeschlossen</div></div>
      </div>
      <div style="padding:0 16px;margin-bottom:8px;font-size:14px;font-weight:700">Phasen des Fastens</div>
      <div class="fasting-stages-list">
        ${FASTING_STAGES.map(s => {
          const reached = ms >= s.h * 3600000 && fd.isActive;
          return `<div class="fasting-stage-item ${reached ? 'reached' : ''}">
            <div class="fasting-stage-h">${s.emoji}<br>${s.h}h</div>
            <div><div class="fasting-stage-name">${s.name}</div><div class="fasting-stage-desc">${s.desc}</div></div>
          </div>`;
        }).join('')}
      </div>
      ${logReversed.length ? `<div style="padding:0 16px;margin-bottom:8px;font-size:14px;font-weight:700">Letzte Einträge</div>
      <div class="fasting-history" style="margin:0 16px 24px">
        ${logReversed.map(l => `<div class="fasting-history-row">
          <span>${l.date}</span>
          <span>${l.protocol}</span>
          <span>${Math.floor(l.duration / 60)}h ${l.duration % 60}min</span>
          <span class="status-badge" style="background:${l.completed ? '#43a04720' : '#e5393520'};color:${l.completed ? '#43a047' : '#e53935'}">${l.completed ? '✓ Ziel' : 'Abgebrochen'}</span>
        </div>`).join('')}
      </div>` : ''}
    </div>`;
  }

  function updateTimer() {
    const ms = elapsedMs();
    const targetH = FASTING_PROTOCOLS[fd.protocol] || 16;
    const pct = Math.min(100, Math.round((ms / (targetH * 3600000)) * 100));
    const clockEl = c.querySelector('#fasting-clock');
    const barEl = c.querySelector('#fasting-bar');
    const pctEl = c.querySelector('#fasting-pct');
    if (clockEl) clockEl.textContent = fmtDuration(ms);
    if (barEl) barEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = `${pct}% von ${targetH}h Ziel`;
  }

  function attachEvents() {
    c.querySelector('#btn-back-fasting').addEventListener('click', () => {
      if (timerInterval) clearInterval(timerInterval);
      navigate('tools');
    });
    c.querySelectorAll('.fasting-proto-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (fd.isActive) return;
        fd.protocol = btn.dataset.proto;
        fastingRepo.save(fd);
        c.innerHTML = buildHTML();
        attachEvents();
      });
    });
    c.querySelector('#btn-fasting-toggle').addEventListener('click', () => {
      if (fd.isActive) {
        if (timerInterval) clearInterval(timerInterval);
        const ms = elapsedMs();
        const targetH = FASTING_PROTOCOLS[fd.protocol] || 16;
        const completed = ms >= targetH * 3600000;
        const durationMin = Math.floor(ms / 60000);
        if (!fd.log) fd.log = [];
        fd.log.push({ date: new Date().toISOString().slice(0, 10), protocol: fd.protocol, duration: durationMin, completed });
        fd.streak = completed ? (fd.streak || 0) + 1 : 0;
        fd.isActive = false;
        fd.startTime = null;
        fastingRepo.save(fd);
        showToast(completed ? `🎉 ${fd.protocol} geschafft! Streak: ${fd.streak} 🔥` : '⏹ Fasten beendet.');
      } else {
        fd.isActive = true;
        fd.startTime = new Date().toISOString();
        fastingRepo.save(fd);
        showToast('▶ Fasten gestartet — viel Erfolg!');
      }
      c.innerHTML = buildHTML();
      attachEvents();
      if (fd.isActive) timerInterval = setInterval(updateTimer, 1000);
    });
  }

  c.innerHTML = buildHTML();
  attachEvents();
  if (fd.isActive) timerInterval = setInterval(updateTimer, 1000);
}
