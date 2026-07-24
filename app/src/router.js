import { state } from './appState.js';
import { renderDashboard } from './ui/screens/dashboard.js';
import { renderEntry } from './ui/screens/entry.js';
import { renderTrend } from './ui/screens/trend.js';
import { renderProfile } from './ui/screens/profile.js';
import { renderPremium } from './ui/screens/premium.js';
import { renderOnboarding } from './ui/screens/onboarding.js';
import { renderActivity } from './ui/screens/activity.js';
import { renderCycle } from './ui/screens/cycle.js';
import { renderNutrition } from './ui/screens/nutrition.js';
import { renderToolsHub } from './ui/screens/toolsHub.js';
import { renderFasting } from './ui/screens/fasting.js';
import { renderGlucoseDay } from './ui/screens/glucoseDay.js';
import { renderCravings } from './ui/screens/cravings.js';
import { renderMealPlan } from './ui/screens/mealPlan.js';
import { renderWeeklyReview } from './ui/screens/weeklyReview.js';
import { renderSkinVitality } from './ui/screens/skinVitality.js';
import { profileRepo } from './infra/db/repositories/profileRepo.js';

const screenRenderers = {
  dashboard: renderDashboard,
  entry: renderEntry,
  trend: renderTrend,
  profile: renderProfile,
  premium: renderPremium,
  onboarding: renderOnboarding,
  activity: renderActivity,
  cycle: renderCycle,
  nutrition: renderNutrition,
  tools: renderToolsHub,
  fasting: renderFasting,
  glucose_day: renderGlucoseDay,
  cravings: renderCravings,
  mealplan: renderMealPlan,
  weekly_review: renderWeeklyReview,
  skin_vitality: renderSkinVitality
};

// Diese Sub-Screens gehören inhaltlich zum "Tools"-Tab, damit dessen Nav-Icon
// beim Reinklicken aktiv bleibt (statt keinen Tab hervorzuheben).
const TOOLS_SUBSCREENS = ['fasting', 'glucose_day', 'cravings', 'mealplan', 'weekly_review', 'skin_vitality'];

// IA-Umbau (Juli 2026, UX-Review): "Eintragen"/"Verlauf" haben seitdem keinen
// eigenen Bottom-Nav-Tab mehr (Zugriff ausschließlich über die Dashboard-
// Karten) - damit beim Reinklicken trotzdem "Übersicht" hervorgehoben bleibt,
// statt gar kein Tab.
const DASHBOARD_SUBSCREENS = ['entry', 'trend'];

const NO_NAV_SCREENS = ['onboarding'];

// Für Tests (tests/ui/router.test.js): welche Screens es gibt und welche davon
// zum Tools-Tab bzw. zum Dashboard-Tab gehören, ohne die internen Objekte
// selbst exportieren zu müssen.
export const SCREEN_NAMES = Object.keys(screenRenderers);
export const TOOLS_SUBSCREEN_NAMES = [...TOOLS_SUBSCREENS];
export const DASHBOARD_SUBSCREEN_NAMES = [...DASHBOARD_SUBSCREENS];

export function navigate(screen, biomarkerId = null) {
  if (biomarkerId) state.set('currentBiomarkerId', biomarkerId);
  state.set('currentScreen', screen);
  renderCurrentScreen();
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = NO_NAV_SCREENS.includes(screen) ? 'none' : 'flex';
  const activeScreen = TOOLS_SUBSCREENS.includes(screen)
    ? 'tools'
    : DASHBOARD_SUBSCREENS.includes(screen) ? 'dashboard' : screen;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.screen === activeScreen);
  });
  updateCycleNavVisibility();
}

/**
 * Der Zyklus-Tab ist nur für Nutzerinnen relevant, die "weiblich" als
 * Geschlecht angegeben haben. Im Monolithen war dieser Toggle nie verdrahtet
 * (der Tab blieb dauerhaft unsichtbar) – hier nachgeholt.
 */
function updateCycleNavVisibility() {
  const cycleNav = document.querySelector('.nav-cycle');
  if (!cycleNav) return;
  const profile = profileRepo.get();
  cycleNav.style.display = profile.sex === 'f' ? 'flex' : 'none';
}

export function renderCurrentScreen() {
  const screen = state.get('currentScreen');
  const container = document.getElementById('screen-container');
  if (!container) return;
  const renderer = screenRenderers[screen];
  if (renderer) { container.innerHTML = ''; renderer(container); }
}
