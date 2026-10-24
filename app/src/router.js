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
import { renderCravings } from './ui/screens/cravings.js';
import { renderMealPlan } from './ui/screens/mealPlan.js';
import { renderWeeklyReview } from './ui/screens/weeklyReview.js';
import { renderSkinVitality } from './ui/screens/skinVitality.js';
import { renderCycleWellness } from './ui/screens/cycleWellness.js';
import { renderMyRecipes } from './ui/screens/myRecipes.js';
import { renderHealthConsent } from './ui/screens/healthConsent.js';
import { renderRecipes } from './ui/screens/recipes.js';
import { renderRecipe } from './ui/screens/recipe.js';
import { renderValues } from './ui/screens/values.js';
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
  cravings: renderCravings,
  mealplan: renderMealPlan,
  weekly_review: renderWeeklyReview,
  skin_vitality: renderSkinVitality,
  cycle_wellness: renderCycleWellness,
  my_recipes: renderMyRecipes,
  health_consent: renderHealthConsent,
  recipes: renderRecipes,
  recipe: renderRecipe,
  values: renderValues,
};

// 2.2-Navigation: Heute · Rezepte · Tagebuch · Zyklus · Mehr.
// Unterseiten markieren ihren Eltern-Tab als aktiv, damit man sich nicht
// verliert. Bewegung und Profil haben seit 2.2 keinen eigenen Tab mehr,
// sondern liegen unter "Mehr" (Tab-Kennung bleibt technisch 'tools').
const TOOLS_SUBSCREENS = ['fasting', 'cravings', 'mealplan', 'weekly_review', 'skin_vitality', 'cycle_wellness', 'my_recipes', 'activity', 'profile', 'premium'];

// "Eintragen"/"Verlauf" und die Seite "Alle Werte" gehören zu "Heute".
const DASHBOARD_SUBSCREENS = ['entry', 'trend', 'values'];

// Die Rezept-Detailseite gehört zum Tab "Rezepte".
const RECIPES_SUBSCREENS = ['recipe'];

const NO_NAV_SCREENS = ['onboarding', 'health_consent'];

// Für Tests (tests/ui/router.test.js): welche Screens es gibt und welche davon
// zum Tools-Tab bzw. zum Dashboard-Tab gehören, ohne die internen Objekte
// selbst exportieren zu müssen.
export const SCREEN_NAMES = Object.keys(screenRenderers);
export const TOOLS_SUBSCREEN_NAMES = [...TOOLS_SUBSCREENS];
export const DASHBOARD_SUBSCREEN_NAMES = [...DASHBOARD_SUBSCREENS];
export const RECIPES_SUBSCREEN_NAMES = [...RECIPES_SUBSCREENS];

// 2.2: Zurück-Taste auf Android. Capacitor geht bei der Hardware-Zurück-Taste
// in der WebView-Historie zurück, solange es eine gibt – deshalb legt jede
// Navigation einen Eintrag an. Start-, Onboarding- und Einwilligungsseite
// ersetzen den Eintrag nur (von dort soll "Zurück" die App verlassen).
const ROOT_SCREENS = ['onboarding', 'health_consent'];
let historyReady = false;

function recordHistory(screen) {
  if (typeof window === 'undefined' || !window.history?.pushState) return;
  const entry = { screen, biomarkerId: state.get('currentBiomarkerId') || null, recipeId: state.get('currentRecipeId') || null };
  try {
    if (!historyReady || ROOT_SCREENS.includes(screen)) {
      window.history.replaceState(entry, '');
      historyReady = true;
    } else {
      window.history.pushState(entry, '');
    }
  } catch { /* z. B. file:// ohne History-API */ }
}

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('popstate', e => {
    const entry = e.state;
    if (!entry?.screen) return;
    if (entry.recipeId) state.set('currentRecipeId', entry.recipeId);
    navigate(entry.screen, entry.biomarkerId, { fromHistory: true });
  });
}

export function navigate(screen, biomarkerId = null, { fromHistory = false } = {}) {
  if (biomarkerId) state.set('currentBiomarkerId', biomarkerId);
  // Nach Onboarding/Einwilligung darf "Zurück" nicht wieder dorthin führen
  if (!fromHistory && ROOT_SCREENS.includes(state.get('currentScreen')) && !ROOT_SCREENS.includes(screen)) historyReady = false;
  if (!fromHistory) recordHistory(screen);
  state.set('currentScreen', screen);
  renderCurrentScreen();
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = NO_NAV_SCREENS.includes(screen) ? 'none' : 'flex';
  const activeScreen = TOOLS_SUBSCREENS.includes(screen) ? 'tools'
    : DASHBOARD_SUBSCREENS.includes(screen) ? 'dashboard'
    : RECIPES_SUBSCREENS.includes(screen) ? 'recipes'
    : screen;
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
  if (renderer) { container.innerHTML = ''; renderer(container); container.scrollTop = 0; if (document.scrollingElement) document.scrollingElement.scrollTop = 0; }
}
