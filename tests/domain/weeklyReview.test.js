import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWeeklyReview, buildWeeklyRecommendations, FREE_INTAKE_KEYS } from '../../app/src/domain/weeklyReview.js';

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

// Automatischer Wochenrückblick mit Empfehlungen (Feature-Wunsch 03.08.2026)

const dgeRef = { vit_a: { label: 'Vitamin A', unit: 'µg', ref: 800 }, eisen: { label: 'Eisen', unit: 'mg', ref: 14 } };
const biomarkers = [
  { intakeKey: 'vit_a', foods: ['Karotten', 'Süßkartoffeln', 'Spinat', 'Kürbis'] },
  { intakeKey: 'eisen', foods: ['Linsen', 'Spinat'] },
];

function weekDay(date, kcal, values = {}) {
  return { date, kcal, ...values };
}

test('buildWeeklyRecommendations: keine geloggten Tage -> loggedDays 0, keine Empfehlungen (kein Rauschen)', () => {
  const weekTotals = Array.from({ length: 7 }, (_, i) => weekDay(`2026-08-0${i + 1}`, 0));
  const result = buildWeeklyRecommendations(weekTotals, dgeRef, biomarkers);
  assert.equal(result.loggedDays, 0);
  assert.deepEqual(result.recommendations, []);
});

test('buildWeeklyRecommendations: Naehrstoff unter 70% Referenz erzeugt eine Empfehlung mit Lebensmittel-Beispielen', () => {
  const weekTotals = [
    weekDay('2026-08-03', 1800, { vit_a: 100, eisen: 14 }), // vit_a stark unter Referenz, eisen genau 100%
    weekDay('2026-08-04', 1800, { vit_a: 100, eisen: 14 }),
  ];
  const result = buildWeeklyRecommendations(weekTotals, dgeRef, biomarkers);
  assert.equal(result.loggedDays, 2);
  assert.equal(result.recommendations.length, 1);
  assert.equal(result.recommendations[0].intakeKey, 'vit_a');
  assert.equal(result.recommendations[0].label, 'Vitamin A');
  assert.deepEqual(result.recommendations[0].foods, ['Karotten', 'Süßkartoffeln', 'Spinat']); // max. 3
});

test('buildWeeklyRecommendations: keine Empfehlung, wenn alle Werte ausreichend gedeckt sind', () => {
  const weekTotals = [weekDay('2026-08-03', 1800, { vit_a: 800, eisen: 14 })];
  const result = buildWeeklyRecommendations(weekTotals, dgeRef, biomarkers);
  assert.deepEqual(result.recommendations, []);
});

test('buildWeeklyRecommendations: mittelt nur ueber tatsaechlich geloggte Tage (kcal>0), nicht ueber die ganze Woche', () => {
  const weekTotals = [
    weekDay('2026-08-03', 1800, { vit_a: 800, eisen: 14 }), // beide gut gedeckt
    weekDay('2026-08-04', 0, { vit_a: 0, eisen: 0 }),        // nicht geloggt, darf den Schnitt nicht verfaelschen
  ];
  const result = buildWeeklyRecommendations(weekTotals, dgeRef, biomarkers);
  assert.equal(result.loggedDays, 1);
  assert.deepEqual(result.recommendations, []); // 800/800 & 14/14 = 100%, nicht durch den 0-Tag verwaessert
});

test('buildWeeklyRecommendations: fehlender Lebensmittel-Katalog-Eintrag liefert leere foods-Liste statt Fehler', () => {
  const weekTotals = [weekDay('2026-08-03', 1800, { vit_a: 100 })];
  const result = buildWeeklyRecommendations(weekTotals, dgeRef, []); // kein Katalog
  assert.equal(result.recommendations[0].foods.length, 0);
});
