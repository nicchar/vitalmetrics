/**
 * mealPlan.js – Wochenplan und Einkaufsliste (WellANNI 2.2)
 *
 * Neu in 2.2:
 * - Haushalt (Erwachsene und Kinder) direkt hier einstellbar, gespeichert im
 *   Profil; die Einkaufsliste rechnet damit (Kind = halbe Portion).
 * - "Gegessen ✓" mit einem Tipp pro Mahlzeit: trägt eine Portion ins
 *   Tagebuch des jeweiligen Tages ein, ein zweiter Tipp nimmt es zurück.
 * - Rezepte öffnen die Rezeptseite (Zutaten, Zubereitung, Portionsrechner).
 * 2.2.1: Tauschen als sichtbarer Knopf mit Vorschlägen und Suche, Mahlzeit
 * freilassen (Auswärts, Reste, Eigenes Gericht – zählt nicht in die
 * Einkaufsliste), Haken der Einkaufsliste bleiben dauerhaft gespeichert.
 * 2.2.1 (19.11.): Plan selbst zusammenstellen (leerer Plan), eigene Einträge
 * auf der Einkaufsliste, Me-Time je Tag („Zeit für dich“).
 * Unverändert: Tauschen ("keine Forelle mag"), fest einplanen ("immer das
 * Porridge"), sanfte Bevorzugung von Rezepten für Nährstoffe, die laut
 * Tagebuch zuletzt zu kurz kamen.
 */
import { state } from '../../appState.js';
import { mealPlanRepo } from '../../infra/db/repositories/mealPlanRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import {
  generatePlan, resolvePlan, buildShoppingList,
  getUnderCoveredTags, INTOLERANCE_LABELS,
  getEligiblePool, setDaySlot, setPin, repairPlan, isEaten, setEaten,
  freeSlot, freeSlotLabel, swapSuggestions, searchSwapOptions, setShoppingChecked, FREE_SLOT_LABELS,
  emptyPlan, addCustomShoppingItem, removeCustomShoppingItem, CUSTOM_ITEM_MAX,
  ME_TIME_IDEAS, ME_TIME_MAX, setMeTime, meTimeFor,
} from '../../domain/mealPlan.js';
import { household, householdPortions, householdLabel, MAX_ADULTS, MAX_KIDS } from '../../domain/household.js';
import { recipeToFoodEntry } from '../../domain/recipeLogging.js';
import { recipePictureHtml } from '../components/recipeArt.js';
import { escapeHtml, fmtNum } from '../components/recipeFormat.js';
import { showToast } from '../components/toast.js';
import { mondayOf } from '../../domain/dateUtils.js';
import { navigate } from '../../router.js';

const CATEGORY_LABEL = { gemischt: 'Gemischt', vegetarisch: 'Vegetarisch', fleisch_fisch: 'Gern mit Fleisch und Fisch', lowcarb: 'Low Carb' };
const MEAL_LABEL = { breakfast: 'Frühstück', lunch: 'Mittag', dinner: 'Abend' };
const SHOPPING_KEY = 'mealplanShoppingChecked';

export function renderMealPlan(container) {
  const recipes = state.get('recipes') || [];
  let plan = mealPlanRepo.get();
  const thisMonday = mondayOf(new Date());

  // 2.2: Rezepte, die es nach der Konsolidierung nicht mehr gibt, still ersetzen.
  if (plan) {
    const { plan: repaired, changed } = repairPlan(plan, recipes, profileRepo.get().intolerances || []);
    if (changed) { plan = repaired; mealPlanRepo.save(plan); }
  }

  // Plan aus einer früheren Woche: Hinweis, aber kein automatisches Neu-Würfeln.
  const isStale = plan && plan.weekStart !== thisMonday;
  renderScreen(container, recipes, plan, isStale, thisMonday);
}

function renderScreen(container, recipes, plan, isStale, thisMonday) {
  const profile = profileRepo.get();
  const hh = household(profile);
  // Einkaufsliste: Haushalt aus dem Profil, sonst die bisherige Personenzahl des Plans
  const portions = householdPortions(profile, plan?.portions || 1);
  const resolved = plan ? resolvePlan(plan, recipes) : null;
  const shoppingList = resolved ? buildShoppingList(resolved, portions) : [];
  const catalog = state.get('catalog');
  const bmName = id => catalog?.biomarkers.find(b => b.id === id)?.name || id;
  const today = new Date().toISOString().slice(0, 10);

  // Nährstoffe, die laut Tagebuch (letzte 7 Tage) unter 70 % der Referenz
  // lagen, werden bei der Rezeptauswahl sanft bevorzugt.
  const dgeRef = getDGERef(profile.ageGroup, profile.sex);
  const underCoveredTags = getUnderCoveredTags(nutritionRepo.getLast7DaysTotals(), dgeRef);

  // Tauschen: derselbe gefilterte Pool wie beim Erstellen – nur App-Rezepte,
  // keine eigenen Rezepte (bewusste Entscheidung 03.08.2026).
  const activeIntolerances = profile.intolerances || [];
  const pool = plan ? getEligiblePool(recipes, plan.category, activeIntolerances) : null;
  const category = plan?.category || 'gemischt';
  const checked = plan?.shoppingChecked || {};
  const shopItem = i => `<li><label><input type="checkbox" data-item="${escapeHtml(i.label)}" ${checked[i.label] ? 'checked' : ''}> ${escapeHtml(i.label)}</label></li>`;

  const daysHtml = resolved ? resolved.days.map(day => `
    <div class="w-card w-day">
      <div class="w-day-title">${day.weekday} <span>${formatDate(day.date)}</span>${day.date === today ? ' <span class="w-pill w-today">Heute</span>' : ''}</div>
      ${mealRow('breakfast', day, day.breakfastRecipe, plan, pool, today)}
      ${mealRow('lunch', day, day.lunchRecipe, plan, pool, today)}
      ${mealRow('dinner', day, day.dinnerRecipe, plan, pool, today)}
      ${meTimeRow(day, plan)}
    </div>`).join('') : '';
  const custom = plan?.customShopping || [];
  const customItem = t => `<li style="display:flex;align-items:center;justify-content:space-between;gap:8px"><label><input type="checkbox" data-item="${escapeHtml(t)}" ${checked[t] ? 'checked' : ''}> ${escapeHtml(t)}</label>
    <button type="button" class="w-link shop-custom-remove" data-remove="${escapeHtml(t)}" aria-label="${escapeHtml(t)} entfernen">✕</button></li>`;

  container.innerHTML = `<div class="w-screen" id="mealplan-screen">
    <h1 class="w-h1">Wochenplan</h1>
    <p class="w-sub">Sieben Tage, einmal einkaufen, entspannt kochen</p>

    <section class="w-block">
      <div class="w-block-title">Dein Haushalt</div>
      <div class="w-card">
        <div class="w-hh-row"><span>Erwachsene <small>(auch Jugendliche)</small></span>
          <div class="w-serv"><button type="button" data-hh="householdAdults" data-step="-1" aria-label="Weniger Erwachsene">–</button><b id="hh-adults">${hh.adults}</b><button type="button" data-hh="householdAdults" data-step="1" aria-label="Mehr Erwachsene">+</button></div></div>
        <div class="w-hh-row"><span>Kinder</span>
          <div class="w-serv"><button type="button" data-hh="householdKids" data-step="-1" aria-label="Weniger Kinder">–</button><b id="hh-kids">${hh.kids}</b><button type="button" data-hh="householdKids" data-step="1" aria-label="Mehr Kinder">+</button></div></div>
        <p class="w-small">${hh.isSet ? `Die Einkaufsliste rechnet mit ${fmtNum(portions)} Portionen pro Mahlzeit – ein Kind zählt als halbe Portion.` : 'Sag uns, für wie viele du kochst – dann stimmen die Mengen auf der Einkaufsliste.'}</p>
      </div>
    </section>

    <section class="w-block">
      <div class="w-block-title">So isst du gern</div>
      <div class="w-chips" role="group" aria-label="Ernährungsform" style="flex-wrap:wrap;margin:0">
        ${Object.entries(CATEGORY_LABEL).map(([k, l]) => `<button type="button" class="w-chip mealplan-category" data-category="${k}" aria-pressed="${category === k}">${l}</button>`).join('')}
      </div>
      <details class="w-details" style="margin-top:12px">
        <summary>Unverträglichkeiten <span aria-hidden="true">›</span></summary>
        <div class="w-card">
          <div style="display:flex;gap:14px;flex-wrap:wrap">
            ${Object.entries(INTOLERANCE_LABELS).map(([key, label]) => `
              <label style="display:flex;align-items:center;gap:6px;font-size:15px">
                <input type="checkbox" class="mealplan-intolerance" value="${key}" ${activeIntolerances.includes(key) ? 'checked' : ''}> ${label}
              </label>`).join('')}
          </div>
          <p class="w-small">Ein Komfort-Filter nach den Zutaten – keine Garantie, gerade bei Allergien. Im Zweifel bitte die Zutatenliste selbst prüfen. Gilt ab dem nächsten neuen Plan.</p>
        </div>
      </details>
      ${isStale ? '<p class="w-small" style="color:var(--accent-dark)">Dieser Plan ist aus einer früheren Woche. Erstell einfach einen neuen.</p>' : ''}
      ${underCoveredTags.length ? `<p class="w-small">Nach deinem Tagebuch der letzten 7 Tage kommen etwas öfter Rezepte mit ${underCoveredTags.map(bmName).join(', ')} dran.</p>` : ''}
      <div class="w-btn-row"><button type="button" class="w-btn w-btn-primary" id="btn-generate-plan">${plan ? 'Neuen Plan erstellen' : 'Plan erstellen'}</button>
        ${!plan || isStale ? '<button type="button" class="w-btn w-btn-ghost" id="btn-empty-plan">Selbst zusammenstellen</button>' : ''}</div>
      ${!plan || isStale ? '<p class="w-small">„Selbst zusammenstellen“ startet mit einer leeren Woche: Du wählst jedes Gericht selbst – hier oder auf der Rezeptseite mit „In den Wochenplan“.</p>' : ''}
    </section>

    ${plan ? `
      <section class="w-block">
        <div class="w-block-title">Deine Woche</div>
        ${daysHtml}
      </section>

      <section class="w-block">
        <div class="w-block-title">Einkaufsliste <span class="w-muted">${shoppingList.filter(i => !i.pantry).length + custom.length} Dinge</span></div>
        <div class="w-card" id="shopping-list">
          <p class="w-small" style="margin-top:0">Für ${hh.isSet ? householdLabel(profile) : `${fmtNum(portions)} Person${portions !== 1 ? 'en' : ''}`}, alle Rezepte der Woche zusammengerechnet.</p>
          <ul class="shopping-list">${shoppingList.filter(i => !i.pantry).map(shopItem).join('')}</ul>
          ${custom.length ? `<p class="w-small" style="margin:10px 0 4px">Eigene Einträge</p><ul class="shopping-list" id="shopping-custom">${custom.map(customItem).join('')}</ul>` : ''}
          <form class="w-shop-add" id="shop-add-form" style="display:flex;gap:8px;margin-top:10px">
            <input type="text" id="shop-add-input" maxlength="${CUSTOM_ITEM_MAX}" placeholder="Eigenen Eintrag hinzufügen, z. B. Kaffee" aria-label="Eigenen Eintrag hinzufügen" style="flex:1">
            <button type="submit" class="w-btn w-btn-ghost" style="flex:none">+</button>
          </form>
          ${shoppingList.some(i => i.pantry) ? `<details class="w-details" style="margin-top:12px">
            <summary>Vorrat prüfen: Gewürze, Öl und Co. <span aria-hidden="true">›</span></summary>
            <ul class="shopping-list">${shoppingList.filter(i => i.pantry).map(shopItem).join('')}</ul>
          </details>` : ''}
        </div>
      </section>` : `<div class="w-card w-muted" style="margin-top:16px">Noch kein Plan da. Wähl oben, wie du gern isst, und tipp auf „Plan erstellen“.</div>`}
  </div>`;

  const rerender = p => renderScreen(container, recipes, p, isStale, thisMonday);

  container.querySelectorAll('[data-hh]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.hh;
      const max = key === 'householdKids' ? MAX_KIDS : MAX_ADULTS;
      const cur = Number(profileRepo.get()[key]) || 0;
      profileRepo.save({ [key]: Math.max(0, Math.min(max, cur + Number(btn.dataset.step))) });
      rerender(plan);
    });
  });

  container.querySelectorAll('.mealplan-intolerance').forEach(cb => {
    cb.addEventListener('change', () => {
      const active = [...container.querySelectorAll('.mealplan-intolerance:checked')].map(el => el.value);
      profileRepo.save({ intolerances: active });
    });
  });

  let chosenCategory = category;
  container.querySelectorAll('.mealplan-category').forEach(b => b.addEventListener('click', () => {
    chosenCategory = b.dataset.category;
    container.querySelectorAll('.mealplan-category').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));

  container.querySelector('#btn-generate-plan').addEventListener('click', () => {
    const activeIntolerancesNow = [...container.querySelectorAll('.mealplan-intolerance:checked')].map(el => el.value);
    // Fest eingeplante Mahlzeiten überleben einen neuen Plan; generatePlan()
    // prüft selbst, ob das Rezept noch existiert.
    const existingPins = plan?.pins || {};
    const sameWeek = plan && plan.weekStart === thisMonday;
    const newPlan = { ...generatePlan(recipes, chosenCategory, thisMonday, underCoveredTags, activeIntolerancesNow, existingPins), portions: plan?.portions || 1,
      ...(sameWeek ? { customShopping: plan.customShopping || [], meTime: plan.meTime || {} } : {}) };
    mealPlanRepo.save(newPlan);
    state.set(SHOPPING_KEY, {});
    renderScreen(container, recipes, newPlan, false, thisMonday);
  });

  container.querySelector('#btn-empty-plan')?.addEventListener('click', () => {
    const newPlan = { ...emptyPlan(thisMonday, chosenCategory), portions: plan?.portions || 1 };
    mealPlanRepo.save(newPlan);
    showToast('Deine Woche ist leer – such dir die Gerichte aus, die du kochen willst');
    renderScreen(container, recipes, newPlan, false, thisMonday);
  });

  container.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => {
    state.set('currentRecipeId', b.dataset.open);
    state.set('recipeBackTo', 'mealplan');
    navigate('recipe');
  }));

  // ── Gegessen ✓ ───────────────────────────────────────────────────────────
  container.querySelectorAll('.w-eaten').forEach(btn => {
    btn.addEventListener('click', () => {
      const { date, mealtype: mealType, recipeId } = btn.dataset;
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;
      const diaryMeal = mealType === 'dinner' ? 'dinner' : mealType;
      if (isEaten(plan, date, mealType)) {
        // Rückgängig: den zuletzt eingetragenen passenden Eintrag entfernen
        const entries = nutritionRepo.getDay(date);
        for (let i = entries.length - 1; i >= 0; i--) {
          if (entries[i].food?.recipeId === recipeId && entries[i].mealType === diaryMeal) { nutritionRepo.removeEntry(date, i); break; }
        }
        const p = setEaten(plan, date, mealType, false);
        mealPlanRepo.save(p);
        rerender(p);
        return;
      }
      const entry = recipeToFoodEntry(recipe, 1);
      if (!entry) return;
      nutritionRepo.addEntry(date, { ...entry, mealType: diaryMeal });
      const p = setEaten(plan, date, mealType, true);
      mealPlanRepo.save(p);
      showToast(`${recipe.title} steht jetzt im Tagebuch`);
      rerender(p);
    });
  });

  // ── Rezept tauschen (nur dieser eine Tag) – 2.2.1: Vorschläge, Suche, Freilassen ──
  const swapTo = (date, mealType, newRecipeId) => {
    if (!newRecipeId) return;
    const newPlan = setEaten(setDaySlot(plan, date, mealType, newRecipeId), date, mealType, false);
    mealPlanRepo.save(newPlan);
    const r = recipes.find(x => x.id === newRecipeId);
    showToast(r ? `${r.title} ist eingeplant, die Einkaufsliste ist aktualisiert` : 'Getauscht');
    rerender(newPlan);
  };
  container.querySelectorAll('[data-swap-id]').forEach(btn => {
    btn.addEventListener('click', () => swapTo(btn.dataset.date, btn.dataset.mealtype, btn.dataset.swapId));
  });
  container.querySelectorAll('[data-free-label]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newPlan = freeSlot(plan, btn.dataset.date, btn.dataset.mealtype, btn.dataset.freeLabel);
      mealPlanRepo.save(newPlan);
      showToast(`${btn.dataset.freeLabel} – fällt aus der Einkaufsliste`);
      rerender(newPlan);
    });
  });
  container.querySelectorAll('.mealplan-swap-search').forEach(input => {
    const out = input.parentElement.querySelector('.mealplan-swap-results');
    input.addEventListener('input', () => {
      const { date, mealtype: mealType, current } = input.dataset;
      const hits = searchSwapOptions(pool, mealType, input.value, current || null);
      out.innerHTML = input.value.trim().length < 2 ? ''
        : hits.length ? hits.map(r => `<button type="button" class="w-swap-option" data-date="${date}" data-mealtype="${mealType}" data-pick="${r.id}">${escapeHtml(r.title)}</button>`).join('')
          : '<p class="w-small">Nichts gefunden – versuch ein anderes Wort.</p>';
      out.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => swapTo(b.dataset.date, b.dataset.mealtype, b.dataset.pick)));
    });
  });

  // ── Mahlzeit fest einplanen/lösen (gilt für die ganze Woche) ─────────────
  container.querySelectorAll('.mealplan-pin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mealType = btn.dataset.mealtype;
      const alreadyPinned = plan.pins?.[mealType] === btn.dataset.recipeId;
      const newPlan = setPin(plan, mealType, alreadyPinned ? null : btn.dataset.recipeId);
      mealPlanRepo.save(newPlan);
      showToast(alreadyPinned
        ? 'Beim nächsten Plan wird diese Mahlzeit wieder frei gewählt'
        : `Ab jetzt jeden Tag zum ${MEAL_LABEL[mealType]}`);
      rerender(newPlan);
    });
  });

  // Einkaufsliste: 2.2.1 – Haken werden im Plan gespeichert und bleiben auch
  // nach dem Schließen der App erhalten (ein neuer Plan startet leer).
  container.querySelectorAll('#shopping-list input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      plan = setShoppingChecked(plan, cb.dataset.item, cb.checked);
      mealPlanRepo.save(plan);
    });
  });

  // 2.2.1: eigene Einträge auf der Einkaufsliste
  container.querySelector('#shop-add-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = container.querySelector('#shop-add-input');
    const next = addCustomShoppingItem(plan, input.value);
    if (next === plan) { input.value = ''; return; }
    mealPlanRepo.save(next);
    rerender(next);
    container.querySelector('#shop-add-input')?.focus();
  });
  container.querySelectorAll('.shop-custom-remove').forEach(b => b.addEventListener('click', () => {
    const next = removeCustomShoppingItem(plan, b.dataset.remove);
    mealPlanRepo.save(next);
    rerender(next);
  }));

  // 2.2.1: Me-Time je Tag
  const saveMeTime = (date, text) => {
    const next = setMeTime(plan, date, text);
    mealPlanRepo.save(next);
    if (text) showToast(`Eingeplant: ${text}`);
    rerender(next);
  };
  container.querySelectorAll('[data-metime-pick]').forEach(b => b.addEventListener('click', () => saveMeTime(b.dataset.date, b.dataset.metimePick)));
  container.querySelectorAll('[data-metime-remove]').forEach(b => b.addEventListener('click', () => saveMeTime(b.dataset.metimeRemove, null)));
  container.querySelectorAll('.metime-own').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const v = form.querySelector('input').value.trim();
    if (v) saveMeTime(form.dataset.date, v);
  }));
}

function meTimeRow(day, plan) {
  const mt = meTimeFor(plan, day.date);
  if (mt) {
    return `<div class="w-meal w-metime"><div class="w-meal-body"><span class="w-meal-label">Zeit für dich</span>
      <span>🌿 ${escapeHtml(mt)}</span>
      <button type="button" class="w-link" data-metime-remove="${day.date}" aria-label="Zeit für dich entfernen">Entfernen</button></div></div>`;
  }
  return `<div class="w-meal w-metime"><div class="w-meal-body">
      <details class="w-meal-more"><summary class="w-swap-btn">🌿 + Zeit für dich</summary>
        <div class="w-swap-panel">
          <div class="w-swap-sugg">${ME_TIME_IDEAS.map(t => `<button type="button" class="w-swap-option" data-date="${day.date}" data-metime-pick="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}</div>
          <form class="metime-own" data-date="${day.date}" style="display:flex;gap:8px;margin-top:8px">
            <input type="text" maxlength="${ME_TIME_MAX}" placeholder="Oder eigene Idee …" aria-label="Eigene Me-Time-Idee" style="flex:1">
            <button type="submit" class="w-btn w-btn-ghost" style="flex:none">OK</button>
          </form>
        </div>
      </details></div></div>`;
}

function swapPanel(mealType, day, currentId, plan, pool) {
  const sugg = swapSuggestions(pool, mealType, plan, currentId, 4);
  const attrs = `data-date="${day.date}" data-mealtype="${mealType}"`;
  return `<details class="w-meal-more">
        <summary class="w-swap-btn">${currentId ? '⇄ Tauschen' : '+ Rezept wählen'}</summary>
        <div class="w-swap-panel">
          ${sugg.length ? `<p class="w-small" style="margin:6px 0 4px">Vorschläge</p>
          <div class="w-swap-sugg">${sugg.map(r => `<button type="button" class="w-swap-option" ${attrs} data-swap-id="${r.id}">${escapeHtml(r.title)}</button>`).join('')}</div>` : ''}
          <input type="search" class="mealplan-swap-search" ${attrs} data-current="${currentId || ''}" placeholder="Oder Rezept suchen …" aria-label="Rezept suchen">
          <div class="mealplan-swap-results"></div>
          <p class="w-small" style="margin:8px 0 4px">Oder freilassen</p>
          <div class="w-swap-sugg">${FREE_SLOT_LABELS.map(l => `<button type="button" class="w-swap-option w-swap-free" ${attrs} data-free-label="${escapeHtml(l)}">${escapeHtml(l)}</button>`).join('')}</div>
          ${currentId ? `<button type="button" class="w-link mealplan-pin-btn" style="margin-top:8px" data-mealtype="${mealType}" data-recipe-id="${currentId}">
            ${plan.pins?.[mealType] === currentId ? 'Nicht mehr fest einplanen' : `Jeden Tag zum ${MEAL_LABEL[mealType]}`}
          </button>` : ''}
        </div>
      </details>`;
}

function mealRow(mealType, day, recipe, plan, pool, today) {
  if (!recipe) {
    const free = freeSlotLabel(plan, day.date, mealType);
    return `<div class="w-meal"><div class="w-meal-body"><span class="w-meal-label">${MEAL_LABEL[mealType]}</span>
      <span class="${free ? '' : 'w-muted'}">${free ? `${escapeHtml(free)} <small class="w-muted">· nicht auf der Einkaufsliste</small>` : (plan.selfBuilt ? 'Noch nichts geplant' : 'Für diese Auswahl haben wir gerade kein passendes Rezept.')}</span>
      ${swapPanel(mealType, day, null, plan, pool)}</div></div>`;
  }
  const isPinned = plan.pins?.[mealType] === recipe.id;
  const eaten = isEaten(plan, day.date, mealType);
  const canEat = day.date <= today;
  return `<div class="w-meal">
    <button type="button" class="w-thumb" data-open="${recipe.id}" aria-label="${escapeHtml(recipe.title)} öffnen">${recipePictureHtml(recipe)}</button>
    <div class="w-meal-body">
      <span class="w-meal-label">${MEAL_LABEL[mealType]}${isPinned ? ' · fest eingeplant' : ''}</span>
      <button type="button" class="w-meal-title" data-open="${recipe.id}">${escapeHtml(recipe.title)}</button>
      ${swapPanel(mealType, day, recipe.id, plan, pool)}
    </div>
    ${canEat ? `<button type="button" class="w-eaten" data-date="${day.date}" data-mealtype="${mealType}" data-recipe-id="${recipe.id}" aria-pressed="${eaten}" aria-label="${eaten ? 'Gegessen, antippen zum Rückgängigmachen' : 'Als gegessen eintragen'}">${eaten ? '✓' : 'Gegessen'}</button>` : ''}
  </div>`;
}

function formatDate(isoDate) {
  const [, m, d] = isoDate.split('-');
  return `${d}.${m}.`;
}
