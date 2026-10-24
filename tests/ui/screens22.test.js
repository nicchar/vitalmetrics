import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';

/**
 * screens22.test.js – jsdom-Tests der neuen 2.2-Screens: Startseite mit
 * Check-in, Rezepte-Tab, Rezeptseite, "Alle Werte" und "Mehr".
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '../../app');

// ─── localStorage-Polyfill (gleiches Muster wie in tests/infra/*.test.js) ───
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

// ─── DOM-Grundgerüst nachbauen (siehe app/index.html) ───────────────────────
const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <div id="app">
    <main id="screen-container"></main>
    <nav class="bottom-nav">
      <button class="nav-item active" data-screen="dashboard"><span class="nav-label">Heute</span></button>
      <button class="nav-item" data-screen="recipes"><span class="nav-label">Rezepte</span></button>
      <button class="nav-item" data-screen="nutrition"><span class="nav-label">Tagebuch</span></button>
      <button class="nav-item nav-cycle" data-screen="cycle" style="display:none"><span class="nav-label">Zyklus</span></button>
      <button class="nav-item" data-screen="tools"><span class="nav-label">Mehr</span></button>
    </nav>
  </div>
</body></html>`, { url: 'http://localhost/' });

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
// Hinweis: globalThis.navigator wird bewusst NICHT überschrieben - Node 22+
// hat dafür bereits eine eigene, nur lesbare Property; keiner der getesteten
// Render-Pfade braucht sie (nur feedbackService.js nach einem echten Eintrag).

// Chart.js/jsPDF werden nur bei vorhandenen Messwerten bzw. PDF-Export
// aufgerufen (nicht beim reinen Rendern) - hier reicht ein No-Op-Stub, damit
// ein `typeof Chart` im Screen-Code nicht crasht, falls doch mal referenziert.
globalThis.Chart = function Chart() { return { destroy() {} }; };


let navigate, profileRepo, state, checkinRepo, nutritionRepo, mealPlanRepo, recipes;
const $ = sel => document.querySelector(sel);
const today = new Date().toISOString().slice(0, 10);

before(async () => {
  ({ navigate } = await import('../../app/src/router.js'));
  ({ profileRepo } = await import('../../app/src/infra/db/repositories/profileRepo.js'));
  ({ state } = await import('../../app/src/appState.js'));
  ({ checkinRepo } = await import('../../app/src/infra/db/repositories/checkinRepo.js'));
  ({ nutritionRepo } = await import('../../app/src/infra/db/repositories/nutritionRepo.js'));
  ({ mealPlanRepo } = await import('../../app/src/infra/db/repositories/mealPlanRepo.js'));
  state.set('catalog', JSON.parse(readFileSync(path.join(APP_ROOT, 'src/data/biomarkerCatalog.json'), 'utf-8')));
  recipes = JSON.parse(readFileSync(path.join(APP_ROOT, 'src/data/recipes.json'), 'utf-8'));
  state.set('recipes', recipes);
});

beforeEach(() => {
  globalThis.localStorage.clear();
  state.set('recipeFilters', null);
  state.set('recipeServings', null);
  profileRepo.save({ onboardingDone: true, sex: 'f', name: 'Sam' });
});

after(() => dom.window.close());

const click = el => el.dispatchEvent(new window.Event('click', { bubbles: true }));

test('Startseite: Begrüßung mit Namen, Check-in, Teller, Rezept des Tages', () => {
  navigate('dashboard');
  assert.match($('.w-h1').textContent, /Sam/);
  assert.equal(document.querySelectorAll('.w-checkin-row').length, 4);
  assert.equal(document.querySelectorAll('.w-pebble').length, 20);
  assert.equal(document.querySelectorAll('.w-core > div').length, 0, 'ohne Einträge keine 8 leeren Kacheln');
  assert.match($('#heute-card').textContent, /Noch nichts eingetragen/);
  assert.ok($('.w-feature[data-open]'), 'Rezept des Tages fehlt');
});

test('Startseite: Check-in-Antwort wird gespeichert und nach allen vier Bereichen bedankt', () => {
  navigate('dashboard');
  assert.ok($('#checkin-done').hidden);
  for (const area of ['energie', 'schlaf', 'bauch', 'stimmung']) {
    click($(`.w-pebble[data-area="${area}"][data-value="4"]`));
  }
  assert.deepEqual(checkinRepo.getDay(today), { energie: 4, schlaf: 4, bauch: 4, stimmung: 4 });
  assert.equal($('.w-pebble[data-area="energie"][data-value="4"]').getAttribute('aria-pressed'), 'true');
  assert.equal($('#checkin-done').hidden, false);
  navigate('dashboard'); // nach Neuladen weiter ausgewählt
  assert.equal($('.w-pebble[data-area="bauch"][data-value="4"]').getAttribute('aria-pressed'), 'true');
});

test('Startseite: mit Einträgen erscheinen Kalorien, Makros und ein Rezeptvorschlag für die größte Lücke', () => {
  nutritionRepo.addEntry(today, { food: { name: 'Brot', kal: 250, protein: 8, fat: 2, carbs: 45 }, grams: 100 });
  navigate('dashboard');
  assert.match($('#heute-card').textContent, /250/);
  assert.match($('#heute-card').textContent, /Kohlenhydrate/);
  assert.equal(document.querySelectorAll('.w-core > div').length, 8);
  assert.match($('#heute-card').textContent, /Da geht noch was/);
  const hint = $('.w-hint');
  assert.ok(hint, 'Rezeptvorschlag fehlt');
  click(hint);
  assert.ok($('#recipe-screen'), 'Klick sollte die Rezeptseite öffnen');
  click($('#recipe-back'));
  assert.ok($('#dashboard-screen'), 'Zurück sollte zur Startseite führen');
});

test('Rezepte: Filter "Hauptgerichte" + "Vegan" zeigt nur vegane Hauptgerichte, Suche filtert nach Zutat', async () => {
  navigate('recipes');
  const before = document.querySelectorAll('.w-rc').length;
  assert.ok(before > 0);
  click($('[data-meal="lunch"]'));
  click($('[data-tag="vegan"]'));
  const ids = [...document.querySelectorAll('.w-rc')].map(b => b.dataset.open);
  assert.ok(ids.length > 0);
  for (const id of ids) {
    const r = recipes.find(x => x.id === id);
    assert.equal(r.mealType, 'lunch');
    assert.ok(r.vegan, `${r.title} ist nicht vegan`);
  }
  // Suche
  click($('[data-tag="saison"]'));
  const input = $('#recipe-search');
  input.value = 'Linsen';
  input.dispatchEvent(new window.Event('input'));
  await new Promise(r => setTimeout(r, 260));
  const titles = [...document.querySelectorAll('.w-rc')].map(b => recipes.find(x => x.id === b.dataset.open));
  assert.ok(titles.length > 0);
  assert.ok(titles.every(r => /linsen/i.test(r.title + r.ingredients.join(' '))));
});

test('Rezeptseite: Portionsrechner skaliert die Zutaten', () => {
  const r = recipes.find(x => x.servings === 2 && x.ingredientsData.some(i => i.qty === 200 && i.unit === 'g'));
  assert.ok(r, 'Testrezept nicht gefunden');
  state.set('currentRecipeId', r.id);
  navigate('recipe');
  assert.match($('#serv-label').textContent, /2 Portionen/);
  click($('#serv-plus')); click($('#serv-plus'));
  assert.match($('#serv-label').textContent, /4 Portionen/);
  assert.ok([...document.querySelectorAll('#recipe-ingredients .q')].some(q => q.textContent === '400 g'));
});

test('Rezeptseite: Haushaltsgröße aus dem Profil ist der Startwert', () => {
  profileRepo.save({ householdAdults: 2, householdKids: 1 });
  state.set('currentRecipeId', recipes[0].id);
  navigate('recipe');
  assert.match($('#serv-label').textContent, /3 Portionen/);
});

test('Rezeptseite: "Gegessen ✓" trägt das Rezept ins Tagebuch ein', () => {
  const r = recipes.find(x => x.mealType === 'lunch');
  state.set('currentRecipeId', r.id);
  navigate('recipe');
  click($('#recipe-eaten'));
  click($('.log-recipe-submit'));
  const entries = nutritionRepo.getDay(today);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].food.recipeId, r.id);
});

test('Rezeptseite: "In den Wochenplan" legt das Rezept in den gewählten Tag', () => {
  const r = recipes.find(x => x.mealType === 'lunch');
  const days = Array.from({ length: 7 }, (_, i) => ({ date: `2026-10-${String(19 + i).padStart(2, '0')}`, breakfast: null, lunch: null, dinner: null }));
  mealPlanRepo.save({ weekStart: '2026-10-19', category: 'gemischt', pins: {}, days });
  state.set('currentRecipeId', r.id);
  navigate('recipe');
  click($('#recipe-plan'));
  click($('[data-slot="lunch"]'));
  click($('[data-day="2026-10-21"]'));
  assert.equal(mealPlanRepo.get().days[2].lunch, r.id);
});

test('Rezeptseite: Snacks haben keinen Wochenplan-Button, unbekannte ID zeigt einen freundlichen Hinweis', () => {
  state.set('currentRecipeId', recipes.find(x => x.mealType === 'snack').id);
  navigate('recipe');
  assert.equal($('#recipe-plan'), null);
  state.set('currentRecipeId', 'gibt_es_nicht');
  navigate('recipe');
  assert.match(document.getElementById('screen-container').textContent, /nicht gefunden/);
});

test('Alle Werte: Kernwerte oben, Laborwerte unter "Erweitert", Suche öffnet "Erweitert"', () => {
  navigate('values');
  assert.equal(document.querySelectorAll('#values-screen .w-core > div').length, 8);
  const adv = $('#values-advanced');
  assert.equal(adv.open, false);
  assert.ok(adv.querySelectorAll('.biomarker-card').length > 0);
  const search = $('#dash-search');
  const advName = adv.querySelector('.card-name').textContent;
  search.value = advName;
  search.dispatchEvent(new window.Event('input'));
  assert.equal(adv.open, true);
});

test('Mehr: alle Einträge vorhanden, Profil öffnet sich', () => {
  navigate('tools');
  for (const id of ['tool-mealplan', 'tool-my-recipes', 'tool-activity', 'tool-cravings', 'tool-fasting', 'tool-weekly-review', 'tool-cycle', 'tool-cycle-wellness', 'tool-skin-vitality', 'tool-profile']) {
    assert.ok($(`#${id}`), `${id} fehlt`);
  }
  click($('#tool-profile'));
  assert.equal(state.get('currentScreen'), 'profile');
});

test('Wochenplan: Haushalt einstellen, Plan erstellen, "Gegessen" heute ein- und austragen', () => {
  navigate('mealplan');
  click($('[data-hh="householdAdults"][data-step="1"]'));
  click($('[data-hh="householdAdults"][data-step="1"]'));
  click($('[data-hh="householdKids"][data-step="1"]'));
  assert.equal(profileRepo.get().householdAdults, 2);
  assert.equal(profileRepo.get().householdKids, 1);
  assert.match(document.getElementById('screen-container').textContent, /2,5 Portionen/);
  click($('[data-category="vegetarisch"]'));
  click($('#btn-generate-plan'));
  const plan = mealPlanRepo.get();
  assert.equal(plan.category, 'vegetarisch');
  assert.match($('#shopping-list').textContent, /2 Erwachsene und 1 Kind/);
  const btn = $(`.w-eaten[data-date="${today}"][data-mealtype="lunch"]`);
  assert.ok(btn, 'Gegessen-Knopf für heute fehlt');
  click(btn);
  assert.equal(nutritionRepo.getDay(today).length, 1);
  assert.equal($(`.w-eaten[data-date="${today}"][data-mealtype="lunch"]`).getAttribute('aria-pressed'), 'true');
  click($(`.w-eaten[data-date="${today}"][data-mealtype="lunch"]`));
  assert.equal(nutritionRepo.getDay(today).length, 0);
  // Zukunft: kein Knopf
  const future = plan.days.find(d => d.date > today);
  if (future) assert.equal($(`.w-eaten[data-date="${future.date}"]`), null);
});

test('Tagebuch: "wie gestern" übernimmt die Mahlzeit vom Vortag', () => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  nutritionRepo.addEntry(yesterday, { food: { name: 'Porridge', kal: 120, protein: 4, fat: 2, carbs: 20 }, grams: 250, mealType: 'breakfast' });
  nutritionRepo.addEntry(yesterday, { food: { name: 'Suppe', kal: 60, protein: 3, fat: 1, carbs: 8 }, grams: 300, mealType: 'lunch' });
  navigate('nutrition');
  click($('.mealtype-btn[data-mealtype="breakfast"]'));
  const btn = $('#btn-like-yesterday');
  assert.equal(btn.hidden, false);
  assert.match(btn.textContent, /Frühstück wie gestern \(1 Eintrag\)/);
  click(btn);
  const entries = nutritionRepo.getDay(today);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].food.name, 'Porridge');
  assert.equal(entries[0].mealType, 'breakfast');
  click($('.mealtype-btn[data-mealtype="dinner"]'));
  assert.equal($('#btn-like-yesterday').hidden, true);
});

test('Zurück-Taste: Browser-Historie führt zur vorherigen Seite (Android-Hardware-Taste)', async () => {
  navigate('dashboard');
  navigate('tools');
  navigate('profile');
  assert.equal(state.get('currentScreen'), 'profile');
  window.history.back();
  await new Promise(r => setTimeout(r, 30));
  assert.equal(state.get('currentScreen'), 'tools');
  const r = recipes[3];
  state.set('currentRecipeId', r.id);
  navigate('recipe');
  navigate('recipes');
  window.history.back();
  await new Promise(r2 => setTimeout(r2, 30));
  assert.equal(state.get('currentScreen'), 'recipe');
  assert.match($('.w-detail-title').textContent, new RegExp(r.title.slice(0, 10)));
});

test('Startseite: nach 3 schlechten Energie-Tagen erscheint ein Hinweis, Wegtippen blendet ihn 7 Tage aus', async () => {
  const { checkinHintsRepo } = await import('../../app/src/infra/db/repositories/checkinHintsRepo.js');
  for (let i = 1; i <= 2; i++) checkinRepo.setValue(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 'energie', 1);
  navigate('dashboard');
  assert.equal(document.querySelectorAll('.w-checkin-hint').length, 0);
  click($('.w-pebble[data-area="energie"][data-value="2"]'));
  const hint = $('.w-checkin-hint[data-hint="energie"]');
  assert.ok(hint, 'Hinweis sollte nach dem dritten Tag sofort erscheinen');
  assert.match(hint.textContent, /Hausarztpraxis/);
  click(hint.querySelector('.w-hint-dismiss'));
  assert.equal(checkinHintsRepo.getAll().energie, today);
  navigate('dashboard');
  assert.equal($('.w-checkin-hint[data-hint="energie"]'), null);
});

test('Startseite: Stimmung erzeugt nie einen Hinweis', () => {
  for (let i = 0; i < 4; i++) checkinRepo.setValue(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 'stimmung', 1);
  navigate('dashboard');
  assert.equal(document.querySelectorAll('.w-checkin-hint').length, 0);
});

test('Startseite: Vitamine erst ab 3 Tagen bewertet, Lebensmittel-Zeile unter dem Rezeptvorschlag', () => {
  nutritionRepo.addEntry(today, { food: { name: 'Brot', kal: 250, protein: 8, fat: 2, carbs: 45 }, grams: 100 });
  navigate('dashboard');
  assert.match($('[data-core="eisen"]').textContent, /Noch zu wenige Tage/);
  for (let i = 1; i <= 2; i++) {
    nutritionRepo.addEntry(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), { food: { name: 'Brot', kal: 250, protein: 8, fat: 2, carbs: 45 }, grams: 100 });
  }
  navigate('dashboard');
  assert.match($('[data-core="eisen"]').textContent, /Da geht noch was/);
  assert.match($('[data-core="vit_d"]').textContent, /Über Essen kaum zu schaffen/);
  assert.ok($('#vitd-note'));
  assert.match($('.w-quickfoods').textContent, /Oder einfach zwischendurch/);
});

test('Wochenrückblick (Premium): Schwerpunkte mit Rezept, Muster-Hinweis, Rezept öffnet sich', async () => {
  const { entitlements } = await import('../../app/src/domain/entitlements.js');
  const { mondayOf, previousMonday } = await import('../../app/src/domain/dateUtils.js');
  entitlements.setPremium(true);
  const lastMonday = previousMonday(mondayOf(new Date()));
  for (let i = 0; i < 4; i++) {
    const d = new Date(lastMonday + 'T12:00:00'); d.setDate(d.getDate() + i);
    nutritionRepo.addEntry(d.toISOString().slice(0, 10), { food: { name: 'Brot', kal: 250, protein: 8, fat: 2, carbs: 45 }, grams: 100 });
  }
  navigate('weekly_review');
  const screen = document.getElementById('screen-container');
  assert.match(screen.textContent, /So war deine Woche/);
  assert.match(screen.textContent, /Worauf du diese Woche achten kannst/);
  assert.match(screen.textContent, /Ab 14 Tagen/);
  const recipeBtn = screen.querySelector('.w-hint[data-open]');
  assert.ok(recipeBtn);
  click(recipeBtn);
  assert.equal(state.get('currentScreen'), 'recipe');
  entitlements.setPremium(false);
});
