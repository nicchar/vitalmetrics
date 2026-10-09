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
