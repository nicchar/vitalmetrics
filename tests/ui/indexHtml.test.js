import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Datenschutz-Gap-Analyse 28.09.2026: Chart.js und jsPDF wurden bei jedem
 * App-Start von cdnjs.cloudflare.com geladen (IP-Übermittlung an Cloudflare,
 * USA; ohne Internet keine Diagramme/PDF). Seitdem lokal in app/vendor/.
 */
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../app');
const html = readFileSync(path.join(APP, 'index.html'), 'utf-8');

test('index.html lädt keine Skripte/Styles von externen Servern', () => {
  const external = [...html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(external, [], `Externe Ressourcen gefunden: ${external.join(', ')}`);
});

test('lokal eingebundene Bibliotheken existieren', () => {
  for (const m of html.matchAll(/<script src="\.\/(vendor\/[^"]+)"/g)) {
    assert.ok(existsSync(path.join(APP, m[1])), `${m[1]} fehlt`);
  }
});

/**
 * WellANNI 2.2: Keine Affiliate- oder Partner-Links in der App (nur auf
 * wellanni.de). Das Material liegt in website-material/, nicht in app/.
 */
test('2.2: App enthält keinen Affiliate-/Amazon-Code', async () => {
  const { readdirSync, statSync } = await import('node:fs');
  const walk = dir => readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) return f === 'vendor' ? [] : walk(p);
    return /\.(js|html|css)$/.test(f) ? [p] : [];
  });
  for (const file of walk(APP)) {
    const text = readFileSync(file, 'utf-8');
    assert.ok(!/amazon\.|affiliate|tag=wellanni|rel="noopener sponsored"/i.test(text), `Affiliate-Spuren in ${path.relative(APP, file)}`);
  }
});

test('2.2: Navigation hat genau Heute, Rezepte, Tagebuch, Zyklus, Mehr', () => {
  const labels = [...html.matchAll(/<span class="nav-label">([^<]+)<\/span>/g)].map(m => m[1]);
  assert.deepEqual(labels, ['Heute', 'Rezepte', 'Tagebuch', 'Zyklus', 'Mehr']);
});

test('2.2: Schrift Figtree liegt lokal vor (inkl. Lizenz)', () => {
  for (const w of [400, 500, 600, 700, 800]) assert.ok(existsSync(path.join(APP, `assets/fonts/figtree-${w}.woff2`)));
  assert.ok(existsSync(path.join(APP, 'assets/fonts/LICENSE-Figtree-OFL.txt')));
});
