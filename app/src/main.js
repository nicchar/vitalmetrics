import { state }         from './appState.js';
import { navigate }       from './router.js';
import { profileRepo }    from './infra/db/repositories/profileRepo.js';
import { billingService } from './infra/billing/billingService.js';

async function init() {
  // ── Biomarker-Katalog laden ───────────────────────────────────────────────
  const resp = await fetch('./src/data/biomarkerCatalog.json');
  const catalog = await resp.json();
  state.set('catalog', catalog);

  // ── Lebensmitteldatenbank laden (echte BLS 4.0, 7.140 Einträge) ───────────
  const foodResp = await fetch('./src/data/foodDatabase.json');
  const foodDb = await foodResp.json();
  state.set('foodDb', foodDb);

  // ── Rezept-Datenbank laden (272 Rezepte: vegetarisch/Fleisch-Fisch/Keto) ──
  const recipesResp = await fetch('./src/data/recipes.json');
  const recipes = await recipesResp.json();
  state.set('recipes', recipes);

  // ── Körper-Geist-Insights je Nährstoff laden (Block F, Experten-Review 4) ─
  const insightsResp = await fetch('./src/data/insightsByNutrient.json');
  const insightsByNutrient = await insightsResp.json();
  state.set('insightsByNutrient', insightsByNutrient);

  // ── Navigation verdrahten ─────────────────────────────────────────────────
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.screen));
  });

  // ── Billing initialisieren ────────────────────────────────────────────────
  // Läuft im Hintergrund und re-verifiziert vorhandene Käufe bei Google Play.
  // Im Browser-Modus (Entwicklung) wird dies sauber übersprungen.
  billingService.initialize().catch(err => {
    console.warn('[App] Billing-Init fehlgeschlagen:', err.message);
  });

  // ── Erststart-Onboarding oder Dashboard ───────────────────────────────────
  const profile = profileRepo.get();
  if (!profile.onboardingDone) {
    navigate('onboarding');
  } else {
    navigate('dashboard');
  }
}

document.addEventListener('DOMContentLoaded', init);
