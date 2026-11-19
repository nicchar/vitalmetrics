/**
 * recipeShare.js – Rezept als Karte teilen (WellANNI 2.2.1, 19.11.2026)
 *
 * Erzeugt eine Bildkarte (1080×1200, Canvas, offline) mit Foto bzw.
 * Illustration, Titel, Zeit und Eiweiß und teilt sie zusammen mit einem
 * kurzen Text über den nativen Teilen-Dialog (WhatsApp, Signal …).
 * Weitergeleitete Inhalte sind das stärkste Signal für Empfehlungen –
 * deshalb steht der Play-Store-Link mit utm-Kennung im Text.
 * Fallback ohne Capacitor: Web Share API, sonst Text in die Zwischenablage.
 * Datenschutz: Es wird nur das Rezept geteilt, keine persönlichen Daten.
 */
import { recipePictureHtml } from '../../ui/components/recipeArt.js';

export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.vitalmetrics.app&referrer=utm_source%3Dapp%26utm_medium%3Dshare%26utm_campaign%3Drezeptkarte';

/** Kurztext für den Teilen-Dialog (reine Funktion, testbar). */
export function shareText(recipe) {
  const n = recipe.nutritionPerServing || {};
  const bits = [recipe.duration, n.protein ? `${Math.round(n.protein)} g Eiweiß pro Portion` : null].filter(Boolean).join(' · ');
  const ing = (recipe.ingredients || []).slice(0, 6).join(', ');
  return `${recipe.title}${bits ? ` (${bits})` : ''}\n\nDu brauchst: ${ing}${(recipe.ingredients || []).length > 6 ? ' …' : ''}\n\nDas ganze Rezept mit Zubereitung und Wochenplan findest du in der WellANNI-App: ${PLAY_URL}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/); const lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width <= maxW) cur = t; else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function pictureImage(recipe) {
  if (recipe.image) return loadImage(`./assets/recipes/${recipe.image}`);
  const svg = recipePictureHtml(recipe).replace('<svg ', '<svg width="1080" height="1080" ');
  return loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
}

/** Zeichnet die Karte und gibt ein PNG als Data-URL zurück. */
export async function renderRecipeCard(recipe) {
  const W = 1080, H = 1200, P = 72;
  try { await Promise.all(['700 66px Figtree', '600 34px Figtree', '500 38px Figtree'].map(f => document.fonts?.load(f))); } catch { /* Systemschrift */ }
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#F3F4EE'; ctx.fillRect(0, 0, W, H);
  const photoH = 760;
  try {
    const img = await pictureImage(recipe);
    const s = Math.max(W / img.width, photoH / img.height);
    const w = img.width * s, h = img.height * s;
    ctx.drawImage(img, (W - w) / 2, (photoH - h) / 2, w, h);
  } catch { ctx.fillStyle = '#E3EBDD'; ctx.fillRect(0, 0, W, photoH); }
  // Karte
  ctx.fillStyle = '#FBF8F1';
  ctx.beginPath(); ctx.roundRect?.(40, photoH - 80, W - 80, H - photoH + 40, 40); ctx.fill();
  ctx.fillStyle = '#46634A'; ctx.font = '600 30px Figtree, sans-serif';
  ctx.fillText('REZEPT AUS DER WELLANNI-APP', P, photoH - 10);
  ctx.fillStyle = '#23342A'; ctx.font = '700 66px Figtree, sans-serif';
  let y = photoH + 70;
  for (const line of wrap(ctx, recipe.title, W - 2 * P).slice(0, 3)) { ctx.fillText(line, P, y); y += 76; }
  const n = recipe.nutritionPerServing || {};
  const meta = [recipe.duration, n.protein ? `${Math.round(n.protein)} g Eiweiß` : null, n.kal ? `${Math.round(n.kal)} kcal` : null].filter(Boolean).join('  ·  ');
  ctx.fillStyle = 'rgba(35,52,42,.72)'; ctx.font = '500 38px Figtree, sans-serif';
  ctx.fillText(meta, P, y + 10);
  ctx.fillStyle = '#5B7B5C'; ctx.font = '600 34px Figtree, sans-serif';
  ctx.fillText('WellANNI · Rezepte & Wochenplan', P, H - 70);
  return c.toDataURL('image/png');
}

/** Teilt das Rezept. Gibt { ok, mode } zurück. */
export async function shareRecipe(recipe) {
  const text = shareText(recipe);
  const plugins = typeof window !== 'undefined' ? window.Capacitor?.Plugins : null;
  try {
    if (plugins?.Share && plugins?.Filesystem && window.Capacitor?.isNativePlatform?.()) {
      const dataUrl = await renderRecipeCard(recipe);
      const path = `wellanni-rezept-${recipe.id}.png`;
      const res = await plugins.Filesystem.writeFile({ path, data: dataUrl.split(',')[1], directory: 'CACHE' });
      const uri = res?.uri || (await plugins.Filesystem.getUri({ directory: 'CACHE', path }))?.uri;
      await plugins.Share.share({ title: recipe.title, text, files: uri ? [uri] : undefined, dialogTitle: 'Rezept teilen' });
      return { ok: true, mode: 'native' };
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: recipe.title, text });
      return { ok: true, mode: 'web' };
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return { ok: true, mode: 'clipboard' };
    }
  } catch (err) {
    if (err?.name === 'AbortError' || /cancel/i.test(String(err?.message))) return { ok: false, mode: 'cancelled' };
    console.warn('[recipeShare] Teilen fehlgeschlagen:', err);
  }
  return { ok: false, mode: 'none' };
}
