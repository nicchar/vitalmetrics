import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyReview } from '../../app/src/domain/weeklyReview.js';

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
