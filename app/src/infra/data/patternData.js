/**
 * patternData.js – WellANNI 2.2
 * Sammelt für die persönlichen Muster (domain/checkinPatterns.js) je Tag die
 * vorhandenen Einträge aus den lokalen Repositories.
 */
import { checkinRepo } from '../db/repositories/checkinRepo.js';
import { activityRepo } from '../db/repositories/activityRepo.js';
import { hydrationRepo } from '../db/repositories/hydrationRepo.js';
import { fastingRepo } from '../db/repositories/fastingRepo.js';
import { measurementRepo } from '../db/repositories/measurementRepo.js';
import { nutritionRepo } from '../db/repositories/nutritionRepo.js';
import { cycleRepo } from '../db/repositories/cycleRepo.js';

export function collectPatternDays(numDays = 60, today = new Date()) {
  const checkins = checkinRepo.getAll();
  const fastingLog = fastingRepo.get()?.log || [];
  const fastingTracked = fastingLog.length > 0;
  const caffeine = Object.fromEntries(measurementRepo.getByBiomarker('koffein').map(m => [String(m.date).slice(0, 10), Number(m.value)]));
  const hasCycle = (cycleRepo.get()?.periodStarts || []).length > 0;
  const days = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const totals = nutritionRepo.getDayTotals(date);
    const entries = nutritionRepo.getDay(date);
    const dinnerKcal = entries.filter(e => e.mealType === 'dinner')
      .reduce((s, e) => s + (e.food?.kal || 0) * (e.grams || 0) / 100, 0);
    const fasts = fastingLog.filter(f => f.date === date);
    days.push({
      date,
      checkin: checkins[date] || {},
      steps: activityRepo.getDay(date)?.steps || 0,
      waterMl: hydrationRepo.getDay(date) || 0,
      fastingTracked,
      fastCompleted: fasts.some(f => f.completed),
      caffeineMg: caffeine[date],
      kcal: totals.kcal || 0,
      fiber: totals.fiber || 0,
      dinnerShare: totals.kcal ? dinnerKcal / totals.kcal : 0,
      phase: hasCycle ? cycleRepo.getPhaseFor(date)?.phase || null : null,
    });
  }
  return days;
}
