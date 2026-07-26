import { cycleRepo } from '../../infra/db/repositories/cycleRepo.js';
import { cycleSymptomsRepo } from '../../infra/db/repositories/cycleSymptomsRepo.js';
import { CYCLE_NUTRIENTS, CYCLE_PHASE_INFO, getPhaseForDate } from '../../domain/cycle.js';
import { SYMPTOM_TAGS, SYMPTOM_LABELS } from '../../domain/cycleSymptoms.js';
import { showToast } from '../components/toast.js';

// Modul-Status für den Symptom-Quick-Picker (übersteht Re-Renders innerhalb
// des Screens, analog _nutrState in nutrition.js). Rein UI-Zustand, nicht
// persistiert - die eigentlichen Einträge liegen in cycleSymptomsRepo.
let _pickerDate = null;
let _pickerTags = [];

export function renderCycle(c) {
  const data = cycleRepo.get();
  const stats = cycleRepo.calcStats();
  const phase = cycleRepo.getCurrentPhase();
  const next = cycleRepo.predictNext();
  const phaseKey = phase ? phase.phase : 'unknown';
  const phaseInfo = CYCLE_PHASE_INFO[phaseKey] || {};
  const nutrients = CYCLE_NUTRIENTS[phaseKey] || [];
  const today = new Date().toISOString().slice(0, 10);
  const starts = [...data.periodStarts].sort();
  const avgCycle = stats.avgCycle || data.avgCycleLength || 28;

  // ── Eingabeliste aller Zyklusstarts ──────────────────────────────────────
  const startsList = starts.slice().reverse().map((s, i) => {
    const realIdx = starts.length - 1 - i;
    const prev = starts[realIdx - 1];
    const len = prev ? Math.round((new Date(s) - new Date(prev)) / 86400000) : null;
    return `<div style="display:flex;justify-content:space-between;align-items:center;
                         padding:8px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-weight:600;font-size:13px">${new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        ${len ? `<div style="font-size:11px;color:var(--text-secondary)">${len} Tage seit vorherigem Zyklus</div>` : '<div style="font-size:11px;color:var(--text-secondary)">Erster Eintrag</div>'}
      </div>
      <button class="activity-item-del" data-date="${s}" style="font-size:18px;color:var(--text-secondary);background:none;border:none;cursor:pointer">✕</button>
    </div>`;
  }).join('');

  // ── Monatskalender ────────────────────────────────────────────────────────
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const symptomEntries = cycleSymptomsRepo.getAll();
  const symptomDatesSet = new Set(symptomEntries.map(e => e.date));
  let calHTML = '';
  for (let i = 0; i < offset; i++) calHTML += '<div class="cycle-day other-month"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === today;
    const dayPhase = starts.length ? getPhaseForDate(data, dateStr, avgCycle).phase : '';
    const hasSymptoms = symptomDatesSet.has(dateStr);
    calHTML += `<div class="cycle-day ${dayPhase}${isToday ? ' today' : ''}" data-symptom-date="${dateStr}">${d}${hasSymptoms ? '<span class="cycle-day-symptom-dot">•</span>' : ''}</div>`;
  }

  // ── Symptom-Quick-Picker (reines Tracking, keine Bewertung) ───────────────
  const pickerHTML = _pickerDate ? `
    <div class="cycle-section cycle-symptom-picker">
      <h3>📝 Symptome – ${new Date(_pickerDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</h3>
      <p style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">Reines Tagebuch – wird nicht bewertet oder ausgewertet.</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${SYMPTOM_TAGS.map(t => `<button type="button" class="cycle-symptom-chip" data-tag="${t.key}"
          style="padding:6px 12px;border:1px solid var(--border);border-radius:16px;font-size:12px;cursor:pointer;
                 background:${_pickerTags.includes(t.key) ? 'var(--primary)' : 'var(--surface)'};
                 color:${_pickerTags.includes(t.key) ? '#fff' : 'inherit'}">${t.label}</button>`).join('')}
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-primary" id="btn-save-symptoms" style="flex:2">Speichern</button>
        <button class="btn-secondary" id="btn-cancel-symptoms" style="flex:1">Abbrechen</button>
      </div>
    </div>` : '';

  // ── Symptom-Eintragsliste (unbewertet, chronologisch) ─────────────────────
  const symptomList = symptomEntries.length ? [...symptomEntries].sort((a, b) => b.date.localeCompare(a.date)).map(e => `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
      <div>
        <div style="font-weight:600;font-size:13px">${new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
          ${e.tags.map(tag => `<span style="font-size:11px;background:var(--bg);padding:2px 8px;border-radius:10px">${SYMPTOM_LABELS[tag] || tag}</span>`).join('')}
        </div>
        ${e.note ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:4px">${e.note}</div>` : ''}
      </div>
      <button class="activity-item-del" data-symptom-id="${e.id}" style="font-size:18px;color:var(--text-secondary);background:none;border:none;cursor:pointer">✕</button>
    </div>`).join('') : '';

  const nutrientHTML = nutrients.map(n => `
    <div class="cycle-nutrient-item">
      <span class="cycle-nutrient-emoji">${n.emoji}</span>
      <div><div class="cycle-nutrient-name">${n.name}</div><div class="cycle-nutrient-why">${n.why}</div></div>
    </div>`).join('');

  c.innerHTML = `<div class="screen cycle-screen">
    <div class="screen-header"><h1 class="screen-title">🌙 Zyklustracker</h1></div>

    <!-- Aktuelle Phase -->
    <div class="cycle-phase-card ${phaseKey}">
      <div class="cycle-phase-label">${phase ? `Tag ${phase.day} · Zykluslänge ${phase.cycleLen} Tage` : 'Noch keine Daten'}</div>
      <div class="cycle-phase-name">${phase ? phaseInfo.label : 'Ersten Zyklus eintragen'}</div>
      ${phase ? `<div class="cycle-phase-tip">${phaseInfo.desc}<br><br>${phaseInfo.tipSport}</div>`
               : '<div class="cycle-phase-tip">Trage deinen ersten Periodenstart ein. Ab zwei Einträgen wird dein Zyklus automatisch berechnet.</div>'}
    </div>

    <!-- Statistik -->
    <div class="cycle-section">
      <div class="cycle-stats-row">
        <div class="cycle-stat">
          <div class="cycle-stat-num">${stats.avgCycle ? stats.avgCycle : '–'}</div>
          <div class="cycle-stat-label">Ø Zykluslänge</div>
        </div>
        <div class="cycle-stat">
          <div class="cycle-stat-num">${data.periodLength || 5}</div>
          <div class="cycle-stat-label">Periodenlänge</div>
        </div>
        <div class="cycle-stat">
          <div class="cycle-stat-num">${next ? (next.daysUntil >= 0 ? next.daysUntil : 0) : '–'}</div>
          <div class="cycle-stat-label">Tage bis nächste</div>
        </div>
      </div>
      ${next ? `<p style="font-size:12px;color:var(--text-secondary);margin-top:10px;text-align:center">
        Nächste Periode voraussichtlich: <strong>${next.date}</strong>
        ${stats.cycles.length >= 2 ? `<br><span style="font-size:11px">(aus ${stats.cycles.length} gemessenen Zyklen berechnet)</span>` : ''}
      </p>` : ''}
    </div>

    <!-- Neuen Periodenstart eintragen -->
    <div class="cycle-section">
      <h3>➕ Periodenstart eintragen</h3>
      <p style="font-size:12px;color:var(--text-secondary);margin-bottom:10px">
        Trage jeden Monat den ersten Tag deiner Periode ein. Die Zykluslänge wird automatisch aus den Abständen berechnet.
      </p>
      <input type="date" id="inp-period-start"
        style="width:100%;padding:10px;border:2px solid var(--border);border-radius:10px;font-size:15px;margin-bottom:8px"
        value="${today}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <label style="font-size:13px;color:var(--text-secondary);flex:1">Periodenlänge (Tage)</label>
        <input type="text" inputmode="numeric" id="inp-period-len"
          style="width:60px;padding:8px;border:2px solid var(--border);border-radius:8px;font-size:15px;text-align:center"
          value="${data.periodLength || 5}">
      </div>
      <button class="btn-primary" id="btn-log-period" style="width:100%">Periodenstart speichern</button>
    </div>

    <!-- Kalender -->
    <div class="cycle-section">
      <h3>🗓️ ${now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</h3>
      <div class="cycle-cal-header">
        <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
      </div>
      <div class="cycle-calendar">${calHTML}</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:10px">
        <span style="font-size:11px">🔴 Periode</span>
        <span style="font-size:11px">🟠 Follikelphase</span>
        <span style="font-size:11px">🟢 Eisprung</span>
        <span style="font-size:11px">🟣 Lutealphase</span>
      </div>
      <p style="font-size:11px;color:var(--text-secondary);margin-top:8px">Tag antippen, um Symptome einzutragen (● = bereits eingetragen).</p>
    </div>

    ${pickerHTML}

    ${nutrients.length ? `<div class="cycle-section">
      <h3>💊 Nährstoffe für diese Phase</h3>
      <div class="cycle-nutrient-list">${nutrientHTML}</div>
    </div>` : ''}

    <!-- Symptom-Tagebuch -->
    ${symptomEntries.length ? `<div class="cycle-section">
      <h3>📝 Symptom-Tagebuch (${symptomEntries.length})</h3>
      ${symptomList}
    </div>` : ''}

    <!-- Eintragshistorie -->
    ${starts.length ? `<div class="cycle-section">
      <h3>📋 Eingetragene Perioden (${starts.length})</h3>
      ${startsList}
    </div>` : ''}
  </div>`;

  c.querySelector('#btn-log-period').addEventListener('click', () => {
    const dateStr = c.querySelector('#inp-period-start').value;
    const pl = parseInt(c.querySelector('#inp-period-len').value) || 5;
    if (!dateStr) { showToast('Bitte Datum wählen'); return; }
    const d = cycleRepo.get();
    d.periodStarts = [...(d.periodStarts || []).filter(s => s !== dateStr), dateStr].sort();
    d.periodLength = pl;
    cycleRepo.save(d);
    const computed = cycleRepo.calcStats();
    if (computed.avgCycle) { d.avgCycleLength = computed.avgCycle; cycleRepo.save(d); }
    showToast('✓ Periodenstart gespeichert');
    renderCycle(c);
  });

  c.querySelectorAll('[data-date]').forEach(btn => {
    btn.addEventListener('click', () => {
      const date = btn.dataset.date;
      if (!confirm(`Eintrag vom ${new Date(date).toLocaleDateString('de-DE')} löschen?`)) return;
      const d = cycleRepo.get();
      d.periodStarts = d.periodStarts.filter(s => s !== date);
      const computed = cycleRepo.calcStats();
      if (computed.avgCycle) d.avgCycleLength = computed.avgCycle;
      cycleRepo.save(d);
      renderCycle(c);
    });
  });

  // ── Symptom-Tagebuch: Tag antippen öffnet den Quick-Picker ────────────────
  c.querySelectorAll('.cycle-day[data-symptom-date]').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const dateStr = dayEl.dataset.symptomDate;
      const existing = cycleSymptomsRepo.getForDate(dateStr)[0];
      _pickerDate = dateStr;
      _pickerTags = existing ? [...existing.tags] : [];
      renderCycle(c);
    });
  });

  c.querySelectorAll('.cycle-symptom-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag;
      _pickerTags = _pickerTags.includes(tag) ? _pickerTags.filter(t => t !== tag) : [..._pickerTags, tag];
      renderCycle(c);
    });
  });

  c.querySelector('#btn-cancel-symptoms')?.addEventListener('click', () => {
    _pickerDate = null;
    _pickerTags = [];
    renderCycle(c);
  });

  c.querySelector('#btn-save-symptoms')?.addEventListener('click', () => {
    const dateStr = _pickerDate;
    const remaining = cycleSymptomsRepo.getAll().filter(e => e.date !== dateStr);
    cycleSymptomsRepo.saveAll(remaining);
    if (_pickerTags.length) {
      cycleSymptomsRepo.addEntry({ date: dateStr, tags: _pickerTags, note: '' });
    }
    showToast(_pickerTags.length ? '📝 Symptome gespeichert' : 'Eintrag entfernt (keine Symptome ausgewählt)');
    _pickerDate = null;
    _pickerTags = [];
    renderCycle(c);
  });

  c.querySelectorAll('[data-symptom-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      cycleSymptomsRepo.removeEntry(parseInt(btn.dataset.symptomId));
      renderCycle(c);
    });
  });
}
