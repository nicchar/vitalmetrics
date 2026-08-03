import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { cravingsRepo } from '../../infra/db/repositories/cravingsRepo.js';
import { glucoseDayRepo } from '../../infra/db/repositories/glucoseDayRepo.js';
import { customRecipeRepo } from '../../infra/db/repositories/customRecipeRepo.js';
import { entitlements } from '../../domain/entitlements.js';
import { navigate } from '../../router.js';

export function renderToolsHub(c) {
  const fd = fastingRepo.get();
  const streak = fd.streak || 0;
  const cravings = cravingsRepo.getAll();
  const today = new Date().toISOString().slice(0, 10);
  const todayGlu = Object.keys(glucoseDayRepo.getDay(today)).length;
  const recipeCount = customRecipeRepo.getAll().length;
  const isPremium = entitlements.isPremium();
  // Einheitliche Kennzeichnung aller Premium-Karten (Experten-Review 7,
  // 26.07.2026) - vorher nur uneinheitlicher Text, kein gemeinsames Muster.
  const premiumCls = isPremium ? '' : ' tool-card-premium';

  c.innerHTML = `<div class="tools-hub">
    <div class="tools-hub-header">
      <div class="tools-hub-title">⚡ Health Tools</div>
      <div class="tools-hub-sub">Dein persönliches Stoffwechsel-Toolkit</div>
    </div>
    <div class="tools-hub-cards" style="padding:0 16px">
      <div class="tools-hub-group-label">Tracking</div>
      <div class="tool-card${premiumCls}" id="tool-fasting">
        <div class="tool-card-icon">⏱️</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Intervallfasten-Tracker</div>
          <div class="tool-card-desc">16:8 · 14:10 · 12:12 — Timer, Autophagie-Phasen & Streak</div>
          ${isPremium
            ? (streak > 0 ? `<div class="tool-card-meta">🔥 ${streak} Tage Streak</div>` : `<div class="tool-card-meta">Noch kein Fasten gestartet</div>`)
            : '<div class="tool-card-meta">🔒 Premium</div>'}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card${premiumCls}" id="tool-glucose">
        <div class="tool-card-icon">🩸</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Blutzucker Tagesgang</div>
          <div class="tool-card-desc">Nüchtern · nach Mahlzeiten · abends — Insulinresistenz erkennen</div>
          ${isPremium
            ? (todayGlu > 0 ? `<div class="tool-card-meta">✅ Heute ${todayGlu} Wert${todayGlu > 1 ? 'e' : ''} eingetragen</div>` : `<div class="tool-card-meta">Noch keine Tageswerte heute</div>`)
            : '<div class="tool-card-meta">🔒 Premium</div>'}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card" id="tool-cravings">
        <div class="tool-card-icon">🍫</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Heißhunger-Journal</div>
          <div class="tool-card-desc">Stimmung, Auslöser & Muster — verstehe deinen Hunger wirklich</div>
          ${cravings.length > 0 ? `<div class="tool-card-meta">📓 ${cravings.length} Einträge gespeichert</div>` : `<div class="tool-card-meta">Noch keine Einträge</div>`}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tools-hub-group-label">Auswertungen &amp; Pläne</div>
      <div class="tool-card" id="tool-mealplan">
        <div class="tool-card-icon">📅</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Wochenplan & Einkaufsliste</div>
          <div class="tool-card-desc">7 Tage Frühstück/Mittag/Abend aus 272 Rezepten · automatische Einkaufsliste</div>
          <div class="tool-card-meta">Vegetarisch · Fleisch/Fisch · Keto</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card" id="tool-my-recipes">
        <div class="tool-card-icon">📖</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Eigene Rezepte</div>
          <div class="tool-card-desc">Deine eigene Rezept-Sammlung, lokal gespeichert – direkt ins Ernährungstagebuch eintragbar</div>
          <div class="tool-card-meta">${recipeCount > 0 ? `${recipeCount} eigene Rezept${recipeCount !== 1 ? 'e' : ''}` : 'Noch keine eigenen Rezepte'}</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card${premiumCls}" id="tool-weekly-review">
        <div class="tool-card-icon">🗓️</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Wochenrückblick</div>
          <div class="tool-card-desc">Bewegung, Ernährung und Fasten der letzten 7 Tage auf einen Blick</div>
          ${isPremium ? '' : '<div class="tool-card-meta">🔒 Premium</div>'}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card${premiumCls}" id="tool-skin-vitality">
        <div class="tool-card-icon">✨</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Hautgesundheit & Vitalität</div>
          <div class="tool-card-desc">Vitamin C, Zink & Co., Blutzucker und Darm-Haut-Achse neu eingeordnet</div>
          ${isPremium ? '' : '<div class="tool-card-meta">🔒 Premium</div>'}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tool-card" id="tool-cycle-wellness">
        <div class="tool-card-icon">🌸</div>
        <div class="tool-card-body">
          <div class="tool-card-title">PMS, Prämenopause & Menopause</div>
          <div class="tool-card-desc">Mikronährstoffe je Lebensphase, traditionelle Perspektiven – reiner Lerninhalt</div>
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
    </div>
  </div>`;

  c.querySelector('#tool-fasting').addEventListener('click', () => navigate('fasting'));
  c.querySelector('#tool-glucose').addEventListener('click', () => navigate('glucose_day'));
  c.querySelector('#tool-cravings').addEventListener('click', () => navigate('cravings'));
  c.querySelector('#tool-mealplan').addEventListener('click', () => navigate('mealplan'));
  c.querySelector('#tool-my-recipes').addEventListener('click', () => navigate('my_recipes'));
  c.querySelector('#tool-weekly-review').addEventListener('click', () => navigate('weekly_review'));
  c.querySelector('#tool-skin-vitality').addEventListener('click', () => navigate('skin_vitality'));
  c.querySelector('#tool-cycle-wellness').addEventListener('click', () => navigate('cycle_wellness'));
}
