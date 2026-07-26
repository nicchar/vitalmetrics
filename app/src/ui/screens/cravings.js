import { cravingsRepo } from '../../infra/db/repositories/cravingsRepo.js';
import { CRAVING_MOODS, CRAVING_TRIGGERS, analyzeCravings } from '../../domain/cravings.js';
import { navigate } from '../../router.js';
import { showToast } from '../components/toast.js';

const MOOD_MAP = Object.fromEntries(CRAVING_MOODS.map(m => [m.key, m.label]));

/**
 * Escaped Text fuer die Wiedereinfuegung in ein value="..."-Attribut bzw.
 * einen Textarea-Inhalt. Noetig seit selWhat/selNote wieder ins Markup
 * zurueckgeschrieben werden (Bugfix 25.07.2026) - ohne das wuerde z.B. ein
 * Anfuehrungszeichen im Snack-Namen das value-Attribut aufbrechen.
 */
function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderCravings(c) {
  let cravings = cravingsRepo.getAll();
  let formOpen = false;
  let selHunger = null, selMood = null, selTrigger = null;
  // Bugfix (25.07.2026): Klick auf Hunger-Level/Stimmung/Auslöser baut das
  // Formular per innerHTML komplett neu auf. Ohne eigenen State gingen dabei
  // bereits eingetippter Snack-Name und Notiz verloren (Nicole: "Snack löscht
  // sich automatisch wieder raus"), weil nur die Button-Auswahl, nicht aber
  // der Inhalt der Textfelder ausserhalb des DOM gehalten wurde.
  let selWhat = '', selNote = '';

  function buildPattern() {
    const a = analyzeCravings(cravings);
    if (!a) return '';
    const moodLabel = a.topMood ? MOOD_MAP[a.topMood] : '';
    return `<div class="craving-pattern-card">
      <div class="craving-pattern-title">🔍 Dein Muster (${a.total} Einträge)</div>
      ${a.peakHour ? `<div class="craving-pattern-stat">🕐 Häufigste Zeit: <strong>${a.peakHour}:00–${a.peakHour}:59 Uhr</strong></div>` : ''}
      ${a.topTrig ? `<div class="craving-pattern-stat">⚡ Häufigster Auslöser: <strong>${a.topTrig}</strong></div>` : ''}
      ${moodLabel ? `<div class="craving-pattern-stat">😶 Häufigste Stimmung: <strong>${moodLabel}</strong></div>` : ''}
      ${a.avgHunger ? `<div class="craving-pattern-stat">🍽️ Durchschn. Hunger-Level: <strong>${a.avgHunger}/5</strong></div>` : ''}
    </div>`;
  }

  function buildForm() {
    if (!formOpen) return '';
    return `<div class="craving-form-card open">
      <div class="craving-form-title">➕ Heißhunger eintragen</div>
      <div class="craving-form-row">
        <div class="craving-form-label">Was hast du gegessen / wolltest du essen?</div>
        <input type="text" class="craving-what-input" id="craving-what" placeholder="z. B. Schokolade, Chips, Süßes..." value="${escapeAttr(selWhat)}">
      </div>
      <div class="craving-form-row">
        <div class="craving-form-label">Hunger-Level (1 = schwach, 5 = extrem)</div>
        <div class="craving-hunger-row">
          ${[1, 2, 3, 4, 5].map(n => `<button class="craving-hunger-btn ${selHunger === n ? 'active' : ''}" data-hunger="${n}">${['😐', '🙁', '😟', '😣', '🤤'][n - 1]}<br><small>${n}</small></button>`).join('')}
        </div>
      </div>
      <div class="craving-form-row">
        <div class="craving-form-label">Stimmung gerade</div>
        <div class="craving-mood-row">
          ${CRAVING_MOODS.map(m => `<button class="craving-mood-btn ${selMood === m.key ? 'active' : ''}" data-mood="${m.key}">${m.label}</button>`).join('')}
        </div>
      </div>
      <div class="craving-form-row">
        <div class="craving-form-label">Was hat es ausgelöst?</div>
        <div class="craving-trigger-row">
          ${CRAVING_TRIGGERS.map(t => `<button class="craving-trigger-btn ${selTrigger === t ? 'active' : ''}" data-trigger="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="craving-form-row">
        <div class="craving-form-label">Notiz (optional)</div>
        <textarea class="craving-note-input" id="craving-note" placeholder="Was ist gerade los?">${escapeAttr(selNote)}</textarea>
      </div>
      <button class="btn-save-craving" id="btn-save-craving">💾 Eintrag speichern</button>
    </div>`;
  }

  function buildList() {
    if (!cravings.length) return `<div class="craving-empty">📓 Noch keine Einträge.<br>Tippe oben auf „+ Eintrag", wenn Heißhunger aufkommt.</div>`;
    return `<div class="craving-list">
      <div class="craving-list-header">📓 Alle Einträge (${cravings.length})</div>
      ${[...cravings].reverse().map(cr => {
        const dt = new Date(cr.timestamp);
        const moodLabel = MOOD_MAP[cr.mood] || '';
        return `<div class="craving-item">
          <button class="btn-delete-craving" data-cid="${cr.id}">🗑️</button>
          <div class="craving-item-top">
            <span class="craving-item-what">${cr.what || '(unbenannt)'}</span>
            <span class="craving-item-time">${dt.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} ${dt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="craving-item-tags">
            ${cr.hungerLevel ? `<span class="craving-tag hunger">Hunger ${cr.hungerLevel}/5</span>` : ''}
            ${moodLabel ? `<span class="craving-tag mood">${moodLabel}</span>` : ''}
            ${cr.trigger ? `<span class="craving-tag trigger">${cr.trigger}</span>` : ''}
          </div>
          ${cr.note ? `<div style="font-size:12px;color:var(--text-hint);margin-top:6px">${cr.note}</div>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }

  function build() {
    return `<div class="cravings-screen">
      <div class="cravings-header">
        <div style="display:flex;align-items:center;gap:10px">
          <button id="btn-back-cravings" style="background:none;font-size:22px;cursor:pointer">←</button>
          <span class="cravings-title">🍫 Heißhunger-Journal</span>
        </div>
        <button class="btn-add-craving" id="btn-toggle-form">${formOpen ? '✕ Schließen' : '+ Eintrag'}</button>
      </div>
      ${buildPattern()}
      ${buildForm()}
      ${buildList()}
    </div>`;
  }

  function attachEvents() {
    c.querySelector('#btn-back-cravings').addEventListener('click', () => navigate('tools'));
    c.querySelector('#btn-toggle-form').addEventListener('click', () => {
      formOpen = !formOpen; selHunger = null; selMood = null; selTrigger = null; selWhat = ''; selNote = '';
      c.innerHTML = build(); attachEvents();
    });
    if (formOpen) {
      // Snack-Name/Notiz laufend in den State spiegeln, damit ein Rebuild
      // durch Hunger-/Stimmungs-/Auslöser-Klicks sie nicht mehr loescht.
      c.querySelector('#craving-what').addEventListener('input', e => { selWhat = e.target.value; });
      c.querySelector('#craving-note').addEventListener('input', e => { selNote = e.target.value; });

      c.querySelectorAll('.craving-hunger-btn').forEach(btn => btn.addEventListener('click', () => {
        selHunger = parseInt(btn.dataset.hunger); c.innerHTML = build(); attachEvents();
      }));
      c.querySelectorAll('.craving-mood-btn').forEach(btn => btn.addEventListener('click', () => {
        selMood = btn.dataset.mood; c.innerHTML = build(); attachEvents();
      }));
      c.querySelectorAll('.craving-trigger-btn').forEach(btn => btn.addEventListener('click', () => {
        selTrigger = btn.dataset.trigger; c.innerHTML = build(); attachEvents();
      }));
      c.querySelector('#btn-save-craving').addEventListener('click', () => {
        const what = c.querySelector('#craving-what').value.trim();
        if (!what) { showToast('Bitte Was eingeben'); return; }
        const note = c.querySelector('#craving-note').value.trim();
        cravings.push({ id: Date.now(), timestamp: new Date().toISOString(), what, hungerLevel: selHunger, mood: selMood, trigger: selTrigger, note });
        cravingsRepo.saveAll(cravings);
        formOpen = false; selHunger = null; selMood = null; selTrigger = null; selWhat = ''; selNote = '';
        showToast('✅ Eintrag gespeichert!');
        c.innerHTML = build(); attachEvents();
      });
    }
    c.querySelectorAll('.btn-delete-craving').forEach(btn => btn.addEventListener('click', () => {
      if (confirm('Eintrag löschen?')) {
        cravings = cravings.filter(cr => cr.id !== parseInt(btn.dataset.cid));
        cravingsRepo.saveAll(cravings); c.innerHTML = build(); attachEvents();
      }
    }));
  }

  c.innerHTML = build();
  attachEvents();
}
