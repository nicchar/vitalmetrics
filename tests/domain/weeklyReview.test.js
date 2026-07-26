import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyReview, FREE_INTAKE_KEYS } from '../../app/src/domain/weeklyReview.js';

function day(date, steps, activities = []) {
  return { date, day: 'Mo', steps, totalCalories: activities.reduce((s,a)=>s+(a.calories||0),0), activities, isToday: false };
}

test('buildWeeklyReview: aggregiert Bewegung ueber 7 Tage', () => {
  const activityDays = [
    day('2026-07-16', 5000),
    day('2026-07-17', 0),
    day('2026-07-18', 8000, [{ calories: 300 }]),
    day('2026-07-19', 3000),
    day('2026-07-20', 0),
    day('2026-07-21', 6000, [{ calories: 200 }]),
    day('2026-07-22', 4000),
  ];
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0, protein: 0, fat: 0, carbs: 0 }));
  const fastingData = { streak: 0, log: [] };

  const review = buildWeeklyReview(activityDays, nutritionDays, fastingData);
  assert.equal(review.movement.totalSteps, 26000);
  assert.equal(review.movement.activeDays, 5); // Tage mit steps>0 ODER activities
  assert.equal(review.movement.totalWorkouts, 2);
  assert.equal(review.movement.totalWorkoutCalories, 500);
});

test('buildWeeklyReview: Ernaehrung nur ueber Tage mit tatsaechlichen Eintraegen mitteln', () => {
  const activityDays = Array.from({length:7}, (_,i) => day(`2026-07-1${i}`, 0));
  const nutritionDays = [
    { date: '2026-07-16', kcal: 2000 },
    { date: '2026-07-17', kcal: 0 },
    { date: '2026-07-18', kcal: 1800 },
    { date: '2026-07-19', kcal: 0 },
    { date: '2026-07-20', kcal: 0 },
    { date: '2026-07-21', kcal: 0 },
    { date: '2026-07-22', kcal: 0 },
  ];
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] });
  assert.equal(review.nutrition.loggedDays, 2);
  assert.equal(review.nutrition.avgKcal, 1900);
});

test('buildWeeklyReview: Makro-Info-Spiegel mittelt Protein/Kohlenhydrate/Fett nur ueber geloggte Tage (Block F)', () => {
  const activityDays = Array.from({length:7}, (_,i) => day(`2026-07-1${i}`, 0));
  const nutritionDays = [
    { date: '2026-07-16', kcal: 2000, protein: 100, fat: 70, carbs: 200 },
    { date: '2026-07-17', kcal: 0, protein: 0, fat: 0, carbs: 0 },
    { date: '2026-07-18', kcal: 1800, protein: 80, fat: 60, carbs: 180 },
    { date: '2026-07-19', kcal: 0, protein: 0, fat: 0, carbs: 0 },
    { date: '2026-07-20', kcal: 0, protein: 0, fat: 0, carbs: 0 },
    { date: '2026-07-21', kcal: 0, protein: 0, fat: 0, carbs: 0 },
    { date: '2026-07-22', kcal: 0, protein: 0, fat: 0, carbs: 0 },
  ];
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] });
  assert.equal(review.nutrition.avgProtein, 90);
  assert.equal(review.nutrition.avgFat, 65);
  assert.equal(review.nutrition.avgCarbs, 190);
});

test('buildWeeklyReview: Makro-Durchschnitte sind 0 ohne geloggte Tage, kein Crash bei fehlenden Feldern', () => {
  const activityDays = Array.from({length:7}, (_,i) => day(`2026-07-1${i}`, 0));
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0 })); // kein protein/fat/carbs-Feld
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] });
  assert.equal(review.nutrition.avgProtein, 0);
  assert.equal(review.nutrition.avgFat, 0);
  assert.equal(review.nutrition.avgCarbs, 0);
});

test('buildWeeklyReview: Fasten-Sessions nur innerhalb der letzten 7 Tage zaehlen', () => {
  const activityDays = Array.from({length:7}, (_,i) => day(`2026-07-1${i}`, 0));
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0 }));
  const fastingData = {
    streak: 4,
    log: [
      { date: '2026-06-01', duration: 900, completed: true },  // zu alt, nicht mitzaehlen
      { date: '2026-07-16', duration: 960, completed: true },
      { date: '2026-07-18', duration: 480, completed: false },
    ],
  };
  const review = buildWeeklyReview(activityDays, nutritionDays, fastingData);
  assert.equal(review.fasting.sessions, 2);
  assert.equal(review.fasting.completed, 1);
  assert.equal(review.fasting.avgFastMinutes, 720);
  assert.equal(review.fasting.streak, 4);
});

// Mehrwochen-Ernaehrungsverlauf (Premium-Idee 25.07.2026)

function week(avgKcal, avgProtein, avgFat, avgCarbs, loggedDays = 5) {
  return { weekStart: '2026-01-01', weekEnd: '2026-01-07', loggedDays, avgKcal, avgProtein, avgFat, avgCarbs, vit_d: 0, eisen: 0, mag: 0, zink: 0, cal: 0 };
}

test('FREE_INTAKE_KEYS: enthaelt genau die 5 bestaetigten Mikronaehrstoffe', () => {
  assert.deepEqual([...FREE_INTAKE_KEYS].sort(), ['cal', 'eisen', 'mag', 'vit_d', 'zink'].sort());
});

test('buildWeeklyReview: ohne weeklyTotals bleibt nutritionTrend null (Rueckwaertskompatibilitaet)', () => {
  const activityDays = Array.from({length:7}, (_,i) => ({ date: `2026-07-1${i}`, steps: 0, totalCalories: 0, activities: [] }));
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0 }));
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] });
  assert.equal(review.nutritionTrend, null);
});

test('buildWeeklyReview: berechnet Vorwochenvergleich (Delta-%) aus den letzten zwei Wochenbloecken', () => {
  const activityDays = Array.from({length:7}, (_,i) => ({ date: `2026-07-1${i}`, steps: 0, totalCalories: 0, activities: [] }));
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0 }));
  const weeklyTotals = [week(1000, 50, 30, 100), week(2000, 100, 60, 200)]; // aelteste, aktuelle
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] }, weeklyTotals);
  assert.ok(review.nutritionTrend);
  assert.equal(review.nutritionTrend.hasPreviousData, true);
  assert.equal(review.nutritionTrend.deltaKcalPct, 100); // 2000 vs 1000 -> +100%
  assert.equal(review.nutritionTrend.deltaProteinPct, 100);
});

test('buildWeeklyReview: hasPreviousData ist false wenn die Vorwoche 0 geloggte Tage hatte (kein Vergleich, keine Division durch 0)', () => {
  const activityDays = Array.from({length:7}, (_,i) => ({ date: `2026-07-1${i}`, steps: 0, totalCalories: 0, activities: [] }));
  const nutritionDays = activityDays.map(d => ({ date: d.date, kcal: 0 }));
  const weeklyTotals = [week(0, 0, 0, 0, 0), week(2000, 100, 60, 200)];
  const review = buildWeeklyReview(activityDays, nutritionDays, { streak: 0, log: [] }, weeklyTotals);
  assert.equal(review.nutritionTrend.hasPreviousData, false);
  assert.equal(review.nutritionTrend.deltaKcalPct, null);
});
