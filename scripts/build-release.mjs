/**
 * build-release.mjs
 *
 * Erstellt eine minifizierte/obfuskierte Kopie von app/ unter dist-release/app/,
 * die fuer den Play-Store-Release genutzt wird (kleinere APK/AAB, erschwertes
 * Reverse-Engineering). Der Entwicklungsordner app/ selbst bleibt unveraendert
 * und lesbar - Capacitor zeigt waehrend der Entwicklung weiter auf webDir "app".
 *
 * Nutzung: npm run build:release
 * Ergebnis: dist-release/app/ (gleiche Struktur wie app/, aber minifiziert)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify as minifyJs } from 'terser';
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'app');
const OUT_DIR = path.join(ROOT, 'dist-release', 'app');

let totalBefore = 0;
let totalAfter = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

async function copyTree(src, dest) {
  // WICHTIG: Keine Nutzung von fs.rm/fs.cp(force) - beide loesen intern
  // unlink() aus, um Zieldateien vor dem Kopieren zu entfernen. In diesem
  // Projektordner ist das Loeschen bestehender Dateien nicht erlaubt (siehe
  // wiederkehrende EPERM-Fehler). Stattdessen wird jede Datei einzeln
  // gelesen und per writeFile (truncate+overwrite, kein unlink) in das Ziel
  // geschrieben - das funktioniert sowohl beim ersten Build als auch beim
  // Ueberschreiben bei spaeteren Builds.
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyTree(s, d);
    } else if (entry.isSymbolicLink()) {
      continue; // Symlinks aus Sicherheitsgruenden ueberspringen
    } else {
      await fs.mkdir(path.dirname(d), { recursive: true });
      const content = await fs.readFile(s);
      await fs.writeFile(d, content);
    }
  }
}

async function minifyJsFile(file) {
  const code = await fs.readFile(file, 'utf8');
  const before = Buffer.byteLength(code, 'utf8');
  const result = await minifyJs(code, {
    module: true,
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false },
  });
  if (result.error) throw result.error;
  await fs.writeFile(file, result.code, 'utf8');
  const after = Buffer.byteLength(result.code, 'utf8');
  totalBefore += before;
  totalAfter += after;
  return { before, after };
}

async function minifyHtmlFile(file) {
  const html = await fs.readFile(file, 'utf8');
  const before = Buffer.byteLength(html, 'utf8');
  const result = await minifyHtml(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    // Inline <script type="module"> bleibt unminifiziert - die referenzierten
    // externen .js-Dateien wurden bereits separat minifiziert.
    minifyJS: false,
    removeRedundantAttributes: true,
    useShortDoctype: true,
  });
  await fs.writeFile(file, result, 'utf8');
  const after = Buffer.byteLength(result, 'utf8');
  totalBefore += before;
  totalAfter += after;
  return { before, after };
}

async function minifyCssFile(file) {
  const css = await fs.readFile(file, 'utf8');
  const before = Buffer.byteLength(css, 'utf8');
  const result = new CleanCSS({}).minify(css);
  if (result.errors?.length) throw new Error(result.errors.join('\n'));
  await fs.writeFile(file, result.styles, 'utf8');
  const after = Buffer.byteLength(result.styles, 'utf8');
  totalBefore += before;
  totalAfter += after;
  return { before, after };
}

async function minifyJsonFile(file) {
  const raw = await fs.readFile(file, 'utf8');
  const before = Buffer.byteLength(raw, 'utf8');
  if (raw.trim() === '') {
    // Bekannte leere Platzhalter-Dateien (z.B. foodsByNutrient.json) - nicht
    // referenziert im Code, aber vorhanden. Nicht als Fehler behandeln, nur
    // ueberspringen, damit der Release-Build nicht unnoetig rot wird.
    console.warn(`WARNUNG: ${path.relative(OUT_DIR, file)} ist leer - wird unveraendert uebernommen.`);
    return { before, after: before };
  }
  const compact = JSON.stringify(JSON.parse(raw));
  await fs.writeFile(file, compact, 'utf8');
  const after = Buffer.byteLength(compact, 'utf8');
  totalBefore += before;
  totalAfter += after;
  return { before, after };
}

async function main() {
  console.log(`Kopiere ${SRC_DIR} -> ${OUT_DIR} ...`);
  await copyTree(SRC_DIR, OUT_DIR);

  const files = await walk(OUT_DIR);
  let jsCount = 0, htmlCount = 0, cssCount = 0, jsonCount = 0;

  for (const file of files) {
    const ext = path.extname(file);
    try {
      if (ext === '.js') { await minifyJsFile(file); jsCount++; }
      else if (ext === '.html') { await minifyHtmlFile(file); htmlCount++; }
      else if (ext === '.css') { await minifyCssFile(file); cssCount++; }
      else if (ext === '.json') { await minifyJsonFile(file); jsonCount++; }
    } catch (err) {
      console.error(`FEHLER beim Minifizieren von ${file}:`, err.message || err);
      process.exitCode = 1;
    }
  }

  const pct = totalBefore ? (100 - (totalAfter / totalBefore) * 100).toFixed(1) : '0.0';
  console.log(`\nFertig: ${jsCount} JS, ${htmlCount} HTML, ${cssCount} CSS, ${jsonCount} JSON Dateien verarbeitet.`);
  console.log(`Groesse: ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (-${pct}%)`);
  console.log(`Output: ${OUT_DIR}`);
}

main();
