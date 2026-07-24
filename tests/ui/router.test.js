import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { JSDOM } from 'jsdom';

/**
 * router.test.js
 *
 * DOM-/Router-Smoke-Tests (technische Grundlagen, Juli 2026).
 *
 * Bisher deckten die Tests nur reine Domain-Logik ab (node --test auf
 * Funktionen ohne DOM). Genau deshalb ist der Wochenplan-Bug ("Rezeptklick
 * navigiert zum falschen Screen") unbemerkt durchgerutscht - kein Test hat je
 * einen echten Screen gerendert. Diese Datei schließt diese Lücke, bewusst als
 * Smoke-Test (jeder Screen rendert ohne Fehler + befüllt den Container),
 * NICHT als vollständiger UI-Test jedes Screens im Detail.
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
      <button class="nav-item active" data-screen="dashboard"><span class="nav-label">Übersicht</span></button>
      <button class="nav-item" data-screen="activity"><span class="nav-label">Bewegung</span></button>
      <button class="nav-item" data-screen="nutrition"><span class="nav-label">Ernährung</span></button>
      <button class="nav-item nav-cycle" data-screen="cycle" style="display:none"><span class="nav-label">Zyklus</span></button>
      <button class="nav-item" data-screen="tools"><span class="nav-label">Tools</span></button>
      <button class="nav-item" data-screen="profile"><span class="nav-label">Profil</span></button>
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

let navigate, SCREEN_NAMES, TOOLS_SUBSCREEN_NAMES, DASHBOARD_SUBSCREEN_NAMES, profileRepo, state;

before(async () => {
  const router = await import('../../app/src/router.js');
  navigate = router.navigate;
  SCREEN_NAMES = router.SCREEN_NAMES;
  TOOLS_SUBSCREEN_NAMES = router.TOOLS_SUBSCREEN_NAMES;
  DASHBOARD_SUBSCREEN_NAMES = router.DASHBOARD_SUBSCREEN_NAMES;
  ({ profileRepo } = await import('../../app/src/infra/db/repositories/profileRepo.js'));
  ({ state } = await import('../../app/src/appState.js'));

  // Echten Biomarker-Katalog laden (entry.js/dashboard.js greifen ohne
  // Fallback auf catalog.biomarkers zu - ohne das crasht das Rendern).
  const catalog = JSON.parse(readFileSync(path.join(APP_ROOT, 'src/data/biomarkerCatalog.json'), 'utf-8'));
  state.set('catalog', catalog);
});

beforeEach(() => {
  globalThis.localStorage.clear();
});

after(() => {
  dom.window.close();
});

test('SCREEN_NAMES enthält alle bekannten Screens (Regressionsschutz gegen fehlendes Router-Wiring)', () => {
  const expected = [
    'dashboard', 'entry', 'trend', 'profile', 'premium', 'onboarding',
    'activity', 'cycle', 'nutrition', 'tools', 'fasting', 'glucose_day',
    'cravings', 'mealplan', 'weekly_review', 'skin_vitality',
  ];
  for (const name of expected) {
    assert.ok(SCREEN_NAMES.includes(name), `Screen "${name}" fehlt in SCREEN_NAMES`);
  }
});

test('jeder Screen rendert ohne Fehler und befüllt den Container', () => {
  // Onboarding übersprungen (verlangt onboardingDone=false + eigenen Consent-
  // Flow, wird separat abgedeckt) - hier geht es um die 15 "normalen" Screens.
  const screensToTest = SCREEN_NAMES.filter(s => s !== 'onboarding');
  profileRepo.save({ onboardingDone: true, sex: 'f' }); // 'f' damit auch der Zyklus-Tab-Pfad mitgetestet wird

  for (const screen of screensToTest) {
    assert.doesNotThrow(() => navigate(screen), `navigate("${screen}") hat einen Fehler geworfen`);
    const container = document.getElementById('screen-container');
    assert.ok(container.innerHTML.trim().length > 0, `Screen "${screen}" hat den Container nicht befüllt`);
  }
});

test('navigate: aktive Nav-Klasse wandert zum angeklickten Screen', () => {
  profileRepo.save({ onboardingDone: true, sex: 'm' });
  navigate('nutrition');
  const active = document.querySelector('.nav-item.active');
  assert.equal(active.dataset.screen, 'nutrition');
});

test('navigate: Tools-Subscreens markieren den "tools"-Tab als aktiv, nicht sich selbst', () => {
  profileRepo.save({ onboardingDone: true, sex: 'm' });
  for (const sub of TOOLS_SUBSCREEN_NAMES) {
    navigate(sub);
    const active = document.querySelector('.nav-item.active');
    assert.equal(active?.dataset.screen, 'tools', `Subscreen "${sub}" haette den Tools-Tab aktiv markieren sollen`);
  }
});

test('navigate: Entry/Trend haben keinen eigenen Tab mehr, markieren aber "dashboard" als aktiv (IA-Umbau Juli 2026)', () => {
  profileRepo.save({ onboardingDone: true, sex: 'm' });
  for (const sub of DASHBOARD_SUBSCREEN_NAMES) {
    navigate(sub);
    const active = document.querySelector('.nav-item.active');
    assert.equal(active?.dataset.screen, 'dashboard', `"${sub}" haette den Dashboard-Tab aktiv markieren sollen`);
  }
  // Es darf tatsaechlich keinen eigenen Tab mehr fuer entry/trend geben.
  assert.equal(document.querySelector('[data-screen="entry"]'), null);
  assert.equal(document.querySelector('[data-screen="trend"]'), null);
});

test('navigate: Zyklus-Tab ist nur für sex="f" sichtbar', () => {
  profileRepo.save({ onboardingDone: true, sex: 'm' });
  navigate('dashboard');
  assert.equal(document.querySelector('.nav-cycle').style.display, 'none');

  profileRepo.save({ onboardingDone: true, sex: 'f' });
  navigate('dashboard');
  assert.equal(document.querySelector('.nav-cycle').style.display, 'flex');
});

test('navigate: onboarding blendet die Bottom-Nav aus', () => {
  navigate('onboarding');
  const nav = document.querySelector('.bottom-nav');
  assert.equal(nav.style.display, 'none');
  navigate('dashboard');
  assert.equal(nav.style.display, 'flex');
});
