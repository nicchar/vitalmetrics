import { state } from '../../appState.js';
import { profileRepo } from '../../infra/db/repositories/profileRepo.js';
import { nutritionRepo } from '../../infra/db/repositories/nutritionRepo.js';
import { getDGERef } from '../../domain/nutrition.js';
import { searchOpenFoodFacts } from '../../infra/external/openFoodFacts.js';
import { showToast } from '../components/toast.js';

// Modul-Status für die Ernährungssuche (übersteht Re-Renders innerhalb des Screens)
let _nutrState = { selectedFood: null, searchProducts: [] };

export function renderNutrition(c) {
  _nutrState.selectedFood = null;
  _nutrState.searchProducts = [];

  const foodDb  = state.get('foodDb') || [];
  const catalog = state.get('catalog') || { biomarkers: [] };
  const today   = new Date().toISOString().slice(0, 10);
  const profile = profileRepo.get();
  const ref     = getDGERef(profile.ageGroup, profile.sex);
  const entries = nutritionRepo.getDay(today);
  const totals  = nutritionRepo.getDayTotals(today);
  // Alltagsreibung-Review Juli 2026: keine manuellen Favoriten noetig - die
  // App leitet "haeufig verwendet" automatisch aus den letzten 30 Tagen ab.
  const frequentFoods = nutritionRepo.getFrequentFoods(30, 8);

  // ── Eintragsliste ─────────────────────────────────────────────────────────
  const entryList = entries.map((e, i) => {
    const food = e.food;
    if (!food) return '';
    const kcal = Math.round(food.kal * e.grams / 100);
    return `<div class="activity-item">
      <div class="activity-item-left">
        <span class="activity-item-emoji">${food.emoji || '🍽️'}</span>
        <div>
          <div class="activity-item-name">${food.name}</div>
          <div class="activity-item-time">${e.grams} g · ${kcal} kcal</div>
        </div>
      </div>
      <span class="activity-item-del" data-idx="${i}">✕</span>
    </div>`;
  }).join('');

  // ── Makro-Kacheln ───────────────────────────────────────────────────────────
  const macrosHtml = entries.length ? `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
      <div style="text-align:center;background:var(--bg);border-radius:8px;padding:8px">
        <div style="font-size:18px;font-weight:700;color:var(--primary)">${Math.round(totals.protein)}g</div>
        <div style="font-size:11px;color:var(--text-secondary)">Protein</div>
      </div>
      <div style="text-align:center;background:var(--bg);border-radius:8px;padding:8px">
        <div style="font-size:18px;font-weight:700;color:#f59e0b">${Math.round(totals.fat)}g</div>
        <div style="font-size:11px;color:var(--text-secondary)">Fett</div>
      </div>
      <div style="text-align:center;background:var(--bg);border-radius:8px;padding:8px">
        <div style="font-size:18px;font-weight:700;color:#3b82f6">${Math.round(totals.carbs)}g</div>
        <div style="font-size:11px;color:var(--text-secondary)">Kohlenhydrate</div>
      </div>
    </div>` : '';

  // ── Mikronährstoff-Balken ───────────────────────────────────────────────────
  // Handlungstipp bei niedriger Zufuhr (Alltagsreibung-Review Juli 2026:
  // "Zahlen ohne Handlungsempfehlung") - nutzt dieselben Lebensmittel-
  // Beispiele wie der Biomarker-Katalog (bm.foods), keine neue Datenquelle.
  const catalogByIntakeKey = Object.fromEntries(
    catalog.biomarkers.filter(b => b.intakeKey).map(b => [b.intakeKey, b])
  );
  const nutrients = Object.entries(ref).map(([key, info]) => {
    const val = totals[key] || 0;
    const pct = Math.min(100, Math.round((val / info.ref) * 100));
    const color = pct >= 100 ? 'var(--primary)' : pct >= 60 ? '#f59e0b' : '#ef4444';
    const foods = catalogByIntakeKey[key]?.foods;
    const tip = pct < 100 && foods?.length
      ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">💡 z.B. ${foods.slice(0, 3).join(', ')}</div>`
      : '';
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px">
        <span style="font-weight:600">${info.label}</span>
        <span style="color:var(--text-secondary)">${val} / ${info.ref} ${info.unit}
          <span style="color:${color};font-weight:700"> ${pct}%</span></span>
      </div>
      <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width .4s"></div>
      </div>
      ${tip}
    </div>`;
  }).join('');

  c.innerHTML = `<div class="screen">
    <div class="screen-header"><h1 class="screen-title">🥗 Ernährung</h1></div>

    <div class="activity-hero">
      <div class="activity-hero-left">
        <div style="font-size:13px;opacity:.85;margin-bottom:4px">Heute gegessen</div>
        <div class="cal-big">${totals.kcal}</div>
        <div class="cal-unit">kcal · ${entries.length} Mahlzeit${entries.length !== 1 ? 'en' : ''}</div>
      </div>
    </div>

    <div class="activity-section">
      <h3>➕ Lebensmittel hinzufügen</h3>

      ${frequentFoods.length ? `
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
        ${frequentFoods.map((f, i) => `
          <button class="quick-add-chip" data-idx="${i}" type="button"
            style="padding:6px 12px;border:1px solid var(--border);border-radius:16px;background:var(--surface);font-size:12px;cursor:pointer;white-space:nowrap">
            ${f.food.emoji || '🍽️'} ${f.food.name.length > 18 ? f.food.name.slice(0, 18) + '…' : f.food.name}
          </button>`).join('')}
      </div>` : ''}

      <div style="position:relative;margin-bottom:8px">
        <input type="text" id="inp-food-search" class="sport-select"
          style="width:100%;padding-right:36px"
          placeholder="🔍 Lebensmittel suchen (${foodDb.length} Einträge, BLS 4.0)…">
        <button id="btn-search-clear"
          style="position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--text-secondary);font-size:18px;display:none;background:none;border:none;cursor:pointer">✕</button>
      </div>

      <div id="nutr-results" style="margin-bottom:8px"></div>

      <div id="nutr-card" style="display:none;background:var(--primary-light);border-radius:10px;padding:12px;margin-bottom:10px">
        <div id="nutr-card-name" style="font-size:13px;font-weight:600;margin-bottom:8px"></div>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" inputmode="numeric" id="inp-grams"
            class="minutes-input" placeholder="Gramm" style="flex:1">
          <button class="btn-primary" id="btn-add-food" style="flex:2">Hinzufügen</button>
        </div>
      </div>

      <button id="btn-custom-toggle"
        style="width:100%;padding:10px;border:2px dashed var(--border);border-radius:8px;
               color:var(--text-secondary);font-size:13px;background:none;cursor:pointer">
        ✏️ Eigenes Lebensmittel manuell eingeben
      </button>

      <div id="nutr-custom-form" style="display:none;background:var(--bg);border-radius:10px;padding:14px;margin-top:8px">
        <div style="font-weight:600;margin-bottom:10px">Eigenes Lebensmittel (pro 100 g)</div>
        <input type="text" id="inp-c-name"   class="sport-select" style="width:100%;margin-bottom:6px" placeholder="Name (z. B. Omas Linseneintopf)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px">
          <input type="text" inputmode="numeric" id="inp-c-kal"     class="minutes-input" placeholder="kcal / 100 g">
          <input type="text" inputmode="numeric" id="inp-c-protein"  class="minutes-input" placeholder="Protein g">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
          <input type="text" inputmode="numeric" id="inp-c-fat"      class="minutes-input" placeholder="Fett g">
          <input type="text" inputmode="numeric" id="inp-c-carbs"    class="minutes-input" placeholder="Kohlenhydrate g">
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" inputmode="numeric" id="inp-c-grams"    class="minutes-input" placeholder="Gramm" style="flex:1">
          <button class="btn-primary" id="btn-add-custom" style="flex:2">Hinzufügen</button>
        </div>
      </div>

      ${entryList ? `<div class="activity-list" style="margin-top:14px">${entryList}</div>` : ''}
    </div>

    <div class="activity-section">
      <h3>📊 Makros heute</h3>
      ${macrosHtml || '<p style="font-size:13px;color:var(--text-secondary)">Noch keine Einträge.</p>'}
      ${entries.length ? `
        <h3 style="margin-top:4px">🧬 Mikronährstoffe</h3>
        <p style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">
          DGE-Referenzwerte · Bei Fertigprodukten können Mikronährstoffe fehlen
        </p>
        ${nutrients}` : ''}
    </div>
  </div>`;

  // ── DOM-Referenzen ────────────────────────────────────────────────────────
  const searchInput  = c.querySelector('#inp-food-search');
  const searchClear  = c.querySelector('#btn-search-clear');
  const resultsBox   = c.querySelector('#nutr-results');
  const card         = c.querySelector('#nutr-card');
  const cardName     = c.querySelector('#nutr-card-name');
  const gramsInput   = c.querySelector('#inp-grams');
  const addBtn       = c.querySelector('#btn-add-food');
  const customToggle = c.querySelector('#btn-custom-toggle');
  const customForm   = c.querySelector('#nutr-custom-form');

  function localSearch(query) {
    const q = query.toLowerCase();
    const results = foodDb.filter(f =>
      f.name.toLowerCase().includes(q) || f.id.includes(q)
    ).slice(0, 12).map(f => ({ ...f, source: f.source || 'local' }));
    showResults(results, true);
  }

  async function offSearch(query) {
    try {
      const foods = await searchOpenFoodFacts(query);
      if (!foods.length) {
        resultsBox.innerHTML = `<div style="text-align:center;padding:12px;color:var(--text-secondary);font-size:13px">
          Keine Ergebnisse. Anderen Suchbegriff probieren oder manuell eingeben.</div>`;
        return;
      }
      showResults(foods, false);
    } catch (err) {
      console.error('[OFF] Fehler:', err);
      resultsBox.innerHTML = `<div style="text-align:center;padding:12px;color:#ef4444;font-size:13px">
        ⚠️ Open Food Facts nicht erreichbar (${err.message || err}).<br>
        <span style="color:var(--text-secondary)">Lokale Suche oder manuelle Eingabe nutzen.</span></div>`;
    }
  }

  function showResults(foods, showOnlineBtn) {
    if (!foods.length) {
      resultsBox.innerHTML = `<div style="padding:12px;color:var(--text-secondary);font-size:13px;text-align:center">
        Nichts gefunden.
        <br><button id="btn-off-search" style="margin-top:8px;padding:6px 14px;border:1px solid var(--border);border-radius:6px;background:var(--surface);font-size:12px;cursor:pointer">🌐 Online suchen (Open Food Facts)</button>
      </div>`;
    } else {
      resultsBox.innerHTML = `<div style="border:1px solid var(--border);border-radius:10px;overflow:hidden">
        ${foods.map((food, i) => `
          <div class="off-result" data-idx="${i}"
            style="padding:10px 12px;${i > 0 ? 'border-top:1px solid var(--border)' : ''};
                   cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--surface)">
            <div style="flex:1;min-width:0;margin-right:8px">
              <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                ${food.emoji} ${food.name}</div>
              ${food.brand ? `<div style="font-size:11px;color:var(--text-secondary)">${food.brand}</div>` : ''}
            </div>
            <div style="font-size:13px;font-weight:700;color:var(--primary);white-space:nowrap">${food.kal} kcal</div>
          </div>`).join('')}
        ${showOnlineBtn ? `<div style="padding:10px 12px;border-top:1px solid var(--border);text-align:center">
          <button id="btn-off-search" style="padding:6px 14px;border:1px solid var(--border);border-radius:6px;background:var(--surface);font-size:12px;cursor:pointer">🌐 Mehr online suchen (Open Food Facts)</button>
        </div>` : ''}
      </div>`;
    }
    _nutrState.searchProducts = foods;
    resultsBox.querySelectorAll('.off-result').forEach(el => {
      el.addEventListener('click', () => {
        const food = _nutrState.searchProducts[parseInt(el.dataset.idx)];
        _nutrState.selectedFood = food;
        cardName.innerHTML = `${food.emoji} <strong>${food.name}</strong>`
          + (food.brand ? ` · <span style="color:var(--text-secondary)">${food.brand}</span>` : '')
          + `<br><span style="font-size:11px;color:var(--text-secondary)">
             ${food.kal} kcal · ${food.protein}g P · ${food.fat}g F · ${food.carbs}g KH pro 100 g</span>`;
        card.style.display = 'block';
        resultsBox.innerHTML = '';
        searchInput.value = food.name.slice(0, 40);
        searchClear.style.display = '';
        gramsInput.value = '';
        gramsInput.focus();
      });
    });
    const offBtn = resultsBox.querySelector('#btn-off-search');
    if (offBtn) offBtn.addEventListener('click', () => {
      resultsBox.innerHTML = `<div style="text-align:center;padding:12px;color:var(--text-secondary);font-size:13px">🔍 Suche online…</div>`;
      offSearch(searchInput.value.trim());
    });
  }

  // ── Quick-Add (häufig verwendete Lebensmittel) ───────────────────────────────
  c.querySelectorAll('.quick-add-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = frequentFoods[parseInt(btn.dataset.idx)];
      if (!item) return;
      nutritionRepo.addEntry(today, { food: item.food, grams: item.grams });
      showToast(`${item.food.emoji || '🍽️'} ${item.food.name} hinzugefügt (${item.grams} g)`);
      renderNutrition(c);
    });
  });

  // ── Suche ─────────────────────────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    searchClear.style.display = q ? '' : 'none';
    card.style.display = 'none';
    _nutrState.selectedFood = null;
    if (q.length < 2) { resultsBox.innerHTML = ''; return; }
    localSearch(q);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    resultsBox.innerHTML = '';
    card.style.display = 'none';
    _nutrState.selectedFood = null;
  });

  // ── Aus Suche hinzufügen ─────────────────────────────────────────────────────
  addBtn.addEventListener('click', () => {
    const grams = parseInt(gramsInput.value);
    if (!grams || grams < 1) { showToast('Bitte Gramm eingeben'); return; }
    if (!_nutrState.selectedFood) return;
    nutritionRepo.addEntry(today, { food: _nutrState.selectedFood, grams });
    showToast(`${_nutrState.selectedFood.emoji} ${_nutrState.selectedFood.name} hinzugefügt`);
    renderNutrition(c);
  });

  // ── Manuelle Eingabe ──────────────────────────────────────────────────────────
  customToggle.addEventListener('click', () => {
    customForm.style.display = customForm.style.display === 'none' ? 'block' : 'none';
  });

  c.querySelector('#btn-add-custom').addEventListener('click', () => {
    const name    = c.querySelector('#inp-c-name').value.trim();
    const kal     = parseFloat(c.querySelector('#inp-c-kal').value)     || 0;
    const protein = parseFloat(c.querySelector('#inp-c-protein').value) || 0;
    const fat     = parseFloat(c.querySelector('#inp-c-fat').value)     || 0;
    const carbs   = parseFloat(c.querySelector('#inp-c-carbs').value)   || 0;
    const grams   = parseInt(c.querySelector('#inp-c-grams').value)     || 0;
    if (!name)  { showToast('Bitte einen Namen eingeben'); return; }
    if (!grams) { showToast('Bitte Gramm eingeben'); return; }
    const food = {
      name, emoji: '🍽️', kal, protein, fat, carbs,
      vit_a: 0, vit_d: 0, vit_e: 0, vit_k: 0, vit_c: 0,
      b1: 0, b2: 0, b3: 0, b6: 0, b12: 0, folat: 0, eisen: 0, zink: 0, mag: 0, cal: 0,
      source: 'custom',
    };
    nutritionRepo.addEntry(today, { food, grams });
    showToast(`✏️ ${name} hinzugefügt`);
    renderNutrition(c);
  });

  // ── Eintrag löschen ───────────────────────────────────────────────────────────
  c.querySelectorAll('.activity-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      nutritionRepo.removeEntry(today, parseInt(btn.dataset.idx));
      renderNutrition(c);
    });
  });
}
