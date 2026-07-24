import { activityRepo } from '../../infra/db/repositories/activityRepo.js';
import { measurementRepo } from '../../infra/db/repositories/measurementRepo.js';
import { SPORTS, calcCalories, calcStepCalories } from '../../domain/activity.js';
import { showToast } from '../components/toast.js';

const CHART_H = 80;

export function renderActivity(c) {
  const today = new Date().toISOString().slice(0, 10);

  // Aktuellstes Gewicht aus den Messwerten (nicht aus dem Profil – dort wird
  // kein Gewicht gepflegt, "Gewicht" ist ein normaler getrackter Biomarker).
  const latestWeight = measurementRepo.getByBiomarker('gewicht').slice(-1)[0];
  const weightKg = latestWeight ? latestWeight.value : 70;

  const week = activityRepo.getLast7Days();
  const dayData = activityRepo.getDay(today);
  const sportCal = dayData.activities.reduce((s, a) => s + (a.calories || 0), 0);
  const totalMin = dayData.activities.reduce((s, a) => s + (a.minutes || 0), 0);
  const stepCal = calcStepCalories(dayData.steps, weightKg);
  // "Heute verbrannt" zählt Sport- UND Schrittkalorien zusammen – Schritte sind Bewegung.
  const totalCal = sportCal + stepCal;

  const sportOptions = SPORTS.map(s => `<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('');

  const activityItems = dayData.activities.map((a, i) => {
    const sport = SPORTS.find(s => s.id === a.sport) || { emoji: '🏃', name: a.sport };
    return `<div class="activity-item">
      <div class="activity-item-left">
        <span class="activity-item-emoji">${sport.emoji}</span>
        <div>
          <div class="activity-item-name">${sport.name}</div>
          <div class="activity-item-time">${a.minutes} Min</div>
        </div>
      </div>
      <span class="activity-item-cal">${a.calories} kcal</span>
      <span class="activity-item-del" data-idx="${i}">✕</span>
    </div>`;
  }).join('');

  // Wochenverlauf Kalorien (Sport + Schritte zusammen)
  const weekWithSteps = week.map(d => ({
    ...d,
    totalCalories: d.totalCalories + calcStepCalories(d.steps, weightKg),
  }));
  const maxCal = Math.max(...weekWithSteps.map(d => d.totalCalories), 1);
  const yMax = Math.ceil(maxCal / 50) * 50 || 50;
  const yMid = Math.round(yMax / 2);
  const bars = weekWithSteps.map(d => {
    const barH = yMax > 0 ? Math.max(3, Math.round((d.totalCalories / yMax) * CHART_H)) : 3;
    return `<div class="week-bar-wrap">
      <div class="week-bar-val">${d.totalCalories > 0 ? d.totalCalories : ''}</div>
      <div class="week-bar${d.isToday ? ' today' : ''}" style="height:${barH}px"></div>
      <span class="week-bar-label">${d.day}</span>
    </div>`;
  }).join('');

  // Wochenverlauf aktive Minuten
  const minData = week.map(d => ({
    day: d.day,
    isToday: d.isToday,
    minutes: (d.activities || []).reduce((s, a) => s + (a.minutes || 0), 0),
  }));
  const maxMin = Math.max(...minData.map(d => d.minutes), 1);
  const yMaxM = Math.ceil(maxMin / 10) * 10 || 10;
  const yMidM = Math.round(yMaxM / 2);
  const minBars = minData.map(d => {
    const bh = Math.max(d.minutes > 0 ? 3 : 0, Math.round((d.minutes / yMaxM) * CHART_H));
    return `<div class="week-bar-wrap">
      <div class="week-bar-val">${d.minutes > 0 ? d.minutes : ''}</div>
      <div class="week-bar${d.isToday ? ' today' : ''}" style="height:${bh}px;background:var(--primary-light);border:2px solid var(--primary)"></div>
      <span class="week-bar-label">${d.day}</span>
    </div>`;
  }).join('');

  c.innerHTML = `<div class="screen activity-screen">
    <div class="screen-header"><h1 class="screen-title">🏃 Bewegung</h1></div>

    <div class="activity-hero">
      <div class="activity-hero-left">
        <div style="font-size:13px;opacity:.85;margin-bottom:4px">Heute verbrannt</div>
        <div class="cal-big">${totalCal}</div>
        <div class="cal-unit">kcal gesamt · ${totalMin} Min Sport</div>
      </div>
      <div class="activity-hero-right">
        <div class="steps-num">${(dayData.steps || 0).toLocaleString('de-DE')}</div>
        <div class="steps-label">👟 Schritte · ${stepCal} kcal</div>
      </div>
    </div>

    <div class="activity-section">
      <h3>👟 Heutige Schritte</h3>
      <input type="text" inputmode="numeric" id="inp-steps" class="sport-select" style="width:100%;margin-bottom:8px" placeholder="z. B. 8500" value="${dayData.steps || ''}">
      ${stepCal > 0 ? `<p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">≈ ${stepCal} kcal durch Schritte</p>` : ''}
      <button class="btn-primary" id="btn-save-steps" style="width:100%">Schritte speichern</button>
    </div>

    <div class="activity-section">
      <h3>➕ Sportart hinzufügen</h3>
      <div class="sport-picker-row">
        <select id="sel-sport" class="sport-select">${sportOptions}</select>
        <input type="text" inputmode="numeric" id="inp-minutes" class="minutes-input" placeholder="Min">
      </div>
      <button class="btn-primary" id="btn-add-sport" style="width:100%">Hinzufügen</button>
      ${activityItems ? `<div class="activity-list">${activityItems}</div>` : ''}
    </div>

    <div class="activity-section">
      <h3>📊 Wochenverlauf Kalorien</h3>
      <div style="display:flex;gap:6px;align-items:flex-end">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:${CHART_H+16}px;padding-bottom:20px;min-width:32px">
          <span style="font-size:10px;color:var(--text-hint);text-align:right">${yMax}</span>
          <span style="font-size:10px;color:var(--text-hint);text-align:right">${yMid}</span>
          <span style="font-size:10px;color:var(--text-hint);text-align:right">0</span>
        </div>
        <div style="flex:1;display:flex;gap:4px;align-items:flex-end;height:${CHART_H+16}px;padding-bottom:20px;border-left:1px solid var(--border);padding-left:4px">${bars}</div>
      </div>
    </div>

    <div class="activity-section">
      <h3>⏱️ Wochenverlauf Aktive Zeit</h3>
      <div style="display:flex;gap:6px;align-items:flex-end">
        <div style="display:flex;flex-direction:column;justify-content:space-between;height:${CHART_H+16}px;padding-bottom:20px;min-width:32px">
          <span style="font-size:10px;color:var(--text-hint);text-align:right">${yMaxM}</span>
          <span style="font-size:10px;color:var(--text-hint);text-align:right">${yMidM}</span>
          <span style="font-size:10px;color:var(--text-hint);text-align:right">0</span>
        </div>
        <div style="flex:1;display:flex;gap:4px;align-items:flex-end;height:${CHART_H+16}px;padding-bottom:20px;border-left:1px solid var(--border);padding-left:4px">${minBars}</div>
      </div>
      <p style="font-size:11px;color:var(--text-secondary);margin-top:6px">Minuten aktive Sportzeit pro Tag</p>
    </div>
  </div>`;

  c.querySelector('#btn-save-steps').addEventListener('click', () => {
    const steps = parseInt(c.querySelector('#inp-steps').value) || 0;
    const current = activityRepo.getDay(today);
    activityRepo.saveDay(today, { ...current, steps });
    showToast('Schritte gespeichert ✓');
    renderActivity(c);
  });

  c.querySelector('#btn-add-sport').addEventListener('click', () => {
    const sportId = c.querySelector('#sel-sport').value;
    const minutes = parseInt(c.querySelector('#inp-minutes').value);
    if (!minutes || minutes < 1) { showToast('Bitte Minuten eingeben'); return; }
    const sport = SPORTS.find(s => s.id === sportId);
    const calories = calcCalories(sport.met, minutes, weightKg);
    const current = activityRepo.getDay(today);
    current.activities = current.activities || [];
    current.activities.push({ sport: sportId, minutes, calories });
    activityRepo.saveDay(today, current);
    showToast(`${sport.emoji} ${sport.name} gespeichert`);
    renderActivity(c);
  });

  c.querySelectorAll('.activity-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const current = activityRepo.getDay(today);
      current.activities.splice(idx, 1);
      activityRepo.saveDay(today, current);
      renderActivity(c);
    });
  });
}
