import { fastingRepo } from '../../infra/db/repositories/fastingRepo.js';
import { cravingsRepo } from '../../infra/db/repositories/cravingsRepo.js';
import { customRecipeRepo } from '../../infra/db/repositories/customRecipeRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { entitlements } from '../../domain/entitlements.js';
import { navigate } from '../../router.js';
import { state } from '../../appState.js';

export function renderToolsHub(c) {
  const fd = fastingRepo.get();
  const streak = fd.streak || 0;
  const cravings = cravingsRepo.getAll();
  const recipeCount = customRecipeRepo.getAll().length;
  const isPremium = entitlements.isPremium();
  // Google-Play-Ablehnung 29.09.2026 ("Funktionen in Screenshots nicht
  // vorhanden"): Prüfer, die im Onboarding nicht "weiblich" wählen, fanden
  // den Zyklus-Tracker nicht, weil der Zyklus-Tab in der Bottom-Nav nur bei
  // sex === 'f' sichtbar ist. Deshalb sind Zyklus-Tracker UND die PMS-/
  // Menopause-Karte hier jetzt für ALLE erreichbar (eigene Gruppe
  // "Frauengesundheit"). Der Bottom-Nav-Tab bleibt weiterhin nur bei 'f'.
  // (Löst die frühere Regel vom Tester-Fund 18.08.2026 bewusst ab.)
  const isFemale = profileRepo.get().sex === 'f';
  // Rezeptanzahl dynamisch statt fest '272' (tatsächlich 310) - Store-Angaben
  // und App müssen übereinstimmen (Google-Play-Ablehnung 29.09.2026).
  const appRecipeCount = (state.get('recipes') || []).length;
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
          <div class="tool-card-desc">7 Tage Frühstück/Mittag/Abend aus ${appRecipeCount} Rezepten · automatische Einkaufsliste</div>
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
          <div class="tool-card-title">Beauty-Nährstoffe</div>
          <div class="tool-card-desc">Vitamin C, Zink, Biotin & Co. sowie Darm-Haut-Achse neu eingeordnet</div>
          ${isPremium ? '' : '<div class="tool-card-meta">🔒 Premium</div>'}
        </div>
        <div class="tool-card-arrow">›</div>
      </div>
      <div class="tools-hub-group-label">Frauengesundheit</div>
      <div class="tool-card" id="tool-cycle">
        <div class="tool-card-icon">🌙</div>
        <div class="tool-card-body">
          <div class="tool-card-title">Zyklus-Tracker</div>
          <div class="tool-card-desc">Zyklusphasen, Symptom-Tagebuch und passende Nährstoffe je Phase</div>
          ${isFemale ? '' : '<div class="tool-card-meta">Für Menschen mit Menstruationszyklus</div>'}
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
  c.querySelector('#tool-cravings').addEventListener('click', () => navigate('cravings'));
  c.querySelector('#tool-mealplan').addEventListener('click', () => navigate('mealplan'));
  c.querySelector('#tool-my-recipes').addEventListener('click', () => navigate('my_recipes'));
  c.querySelector('#tool-weekly-review').addEventListener('click', () => navigate('weekly_review'));
  c.querySelector('#tool-skin-vitality').addEventListener('click', () => navigate('skin_vitality'));
  c.querySelector('#tool-cycle').addEventListener('click', () => navigate('cycle'));
  c.querySelector('#tool-cycle-wellness').addEventListener('click', () => navigate('cycle_wellness'));
}
