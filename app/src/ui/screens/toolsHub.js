/**
 * toolsHub.js – Tab "Mehr" (WellANNI 2.2)
 *
 * Seit 2.2 liegen hier auch Bewegung und Profil, die vorher eigene Tabs in
 * der unteren Leiste hatten. Gruppen: Planen und Kochen · Dein Alltag ·
 * Zyklus und Wechseljahre · Wissen · Du.
 *
 * Google-Play-Ablehnung 29.09.2026: Zyklus-Tracker und die PMS-/
 * Wechseljahre-Seite müssen für ALLE erreichbar sein, unabhängig vom
 * Geschlecht im Profil. Der Zyklus-Tab unten bleibt nur bei 'f' sichtbar.
 */
import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { cravingsRepo } from '../../infra/db/repositories/cravingsRepo.js';
import { customRecipeRepo } from '../../infra/db/repositories/customRecipeRepo.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { entitlements } from '../../domain/entitlements.js';
import { navigate } from '../../router.js';

function item(id, icon, title, desc, meta = '') {
  return `<button type="button" class="w-list-item" id="${id}">
    <span class="w-list-icon" aria-hidden="true">${icon}</span>
    <span class="w-list-body">
      <span class="w-list-title" style="display:block">${title}</span>
      <span class="w-list-desc" style="display:block">${desc}</span>
      ${meta ? `<span class="w-list-meta" style="display:block">${meta}</span>` : ''}
    </span>
    <span class="w-chev" aria-hidden="true">›</span>
  </button>`;
}

export function renderToolsHub(c) {
  const fd = fastingRepo.get();
  const streak = fd.streak || 0;
  const cravings = cravingsRepo.getAll();
  const recipeCount = customRecipeRepo.getAll().length;
  const isPremium = entitlements.isPremium();
  const profile = profileRepo.get();
  const isFemale = profile.sex === 'f';
  const hasPlan = !!mealPlanRepo.get()?.days?.length;
  const premiumMeta = isPremium ? '' : 'Mit Premium';

  c.innerHTML = `<div class="w-screen" id="more-screen">
    <h1 class="w-h1">Mehr</h1>
    <p class="w-sub">Alles Weitere für deinen Alltag</p>

    <div class="w-group-title">Planen und Kochen</div>
    <div class="w-list">
      ${item('tool-mealplan', '📅', 'Wochenplan und Einkaufsliste', 'Sieben Tage, passend für deinen Haushalt', hasPlan ? 'Dein Plan für diese Woche steht' : '')}
      ${item('tool-my-recipes', '📖', 'Eigene Rezepte', 'Deine Lieblingsrezepte, nur auf deinem Gerät', recipeCount > 0 ? `${recipeCount} eigene${recipeCount !== 1 ? '' : 's'} Rezept${recipeCount !== 1 ? 'e' : ''}` : 'Noch keine eigenen Rezepte')}
    </div>

    <div class="w-group-title">Dein Alltag</div>
    <div class="w-list">
      ${item('tool-activity', '🚶', 'Bewegung', 'Schritte, Sport und Schlaf festhalten')}
      ${item('tool-cravings', '🍫', 'Heißhunger-Tagebuch', 'Wann kommt der Hunger auf etwas Bestimmtes?', cravings.length > 0 ? `${cravings.length} Einträge` : 'Noch keine Einträge')}
      ${item('tool-fasting', '⏱️', 'Intervallfasten', '16:8, 14:10 oder 12:12 mit Timer', isPremium ? (streak > 0 ? `${streak} Tage in Folge` : '') : premiumMeta)}
      ${item('tool-weekly-review', '🗓️', 'Wochenrückblick', 'Essen, Bewegung und Fasten der letzten 7 Tage', premiumMeta)}
    </div>

    <div class="w-group-title">Zyklus und Wechseljahre</div>
    <div class="w-list">
      ${item('tool-cycle', '🌙', 'Zyklus', 'Phasen, Beschwerden-Tagebuch und passende Nährstoffe', isFemale ? '' : 'Für alle mit Menstruationszyklus')}
      ${item('tool-cycle-wellness', '🌸', 'PMS, Perimenopause und Menopause', 'Was in welcher Lebensphase guttut – zum Nachlesen')}
    </div>

    <div class="w-group-title">Wissen</div>
    <div class="w-list">
      ${item('tool-skin-vitality', '✨', 'Haut, Haare und Nägel', 'Welche Nährstoffe dahinterstecken', premiumMeta)}
    </div>

    <div class="w-group-title">Du</div>
    <div class="w-list">
      ${item('tool-profile', '👤', 'Profil und Einstellungen', 'Haushalt, Erinnerung, Daten und Rechtliches')}
      ${isPremium ? '' : item('tool-premium', '⭐', 'Premium', 'Verläufe, Einordnung und Wochenrückblick')}
    </div>
  </div>`;

  c.querySelector('#tool-fasting').addEventListener('click', () => navigate('fasting'));
  c.querySelector('#tool-cravings').addEventListener('click', () => navigate('cravings'));
  c.querySelector('#tool-mealplan').addEventListener('click', () => navigate('mealplan'));
  c.querySelector('#tool-my-recipes').addEventListener('click', () => navigate('my_recipes'));
  c.querySelector('#tool-weekly-review').addEventListener('click', () => navigate('weekly_review'));
  c.querySelector('#tool-skin-vitality').addEventListener('click', () => navigate('skin_vitality'));
  c.querySelector('#tool-cycle').addEventListener('click', () => navigate('cycle'));
  c.querySelector('#tool-cycle-wellness').addEventListener('click', () => navigate('cycle_wellness'));
  c.querySelector('#tool-activity').addEventListener('click', () => navigate('activity'));
  c.querySelector('#tool-profile').addEventListener('click', () => navigate('profile'));
  c.querySelector('#tool-premium')?.addEventListener('click', () => navigate('premium'));
}
