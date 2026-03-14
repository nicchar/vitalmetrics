import { state } from './appState.js';
import { renderDashboard } from './ui/screens/dashboard.js';
import { renderEntry } from './ui/screens/entry.js';
import { renderTrend } from './ui/screens/trend.js';
import { renderProfile } from './ui/screens/profile.js';
import { renderPremium } from './ui/screens/premium.js';
import { renderOnboarding } from './ui/screens/onboarding.js';

const screenRenderers = {
  dashboard: renderDashboard,
  entry: renderEntry,
  trend: renderTrend,
  profile: renderProfile,
  premium: renderPremium,
  onboarding: renderOnboarding
};

const NO_NAV_SCREENS = ['onboarding'];

export function navigate(screen, biomarkerId = null) {
  if (biomarkerId) state.set('currentBiomarkerId', biomarkerId);
  state.set('currentScreen', screen);
  renderCurrentScreen();
  const nav = document.querySelector('.bottom-nav');
  if (nav) nav.style.display = NO_NAV_SCREENS.includes(screen) ? 'none' : 'flex';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.screen === screen);
  });
}

export function renderCurrentScreen() {
  const screen = state.get('currentScreen');
  const container = document.getElementById('screen-container');
  if (!container) return;
  const renderer = screenRenderers[screen];
  if (renderer) { container.innerHTML = ''; renderer(container); }
}
