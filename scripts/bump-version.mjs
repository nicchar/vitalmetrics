/**
 * bump-version.mjs
 *
 * Erhoeht Versionsnummern konsistent an beiden Stellen, die Android/Play
 * Store betreffen:
 *   - android/app/build.gradle: versionCode (+1, IMMER, das ist Play-Store-
 *     Pflicht: jeder hochgeladene Build braucht einen hoeheren versionCode)
 *   - android/app/build.gradle: versionName (SemVer, Teil per Argument)
 *   - package.json: "version" (wird an versionName angeglichen)
 *
 * Nutzung:
 *   node scripts/bump-version.mjs patch   (1.1.3 -> 1.1.4, Standard)
 *   node scripts/bump-version.mjs minor   (1.1.3 -> 1.2.0)
 *   node scripts/bump-version.mjs major   (1.1.3 -> 2.0.0)
 *
 * Wird automatisch von scripts/release.mjs vor jedem Release-Build
 * aufgerufen (Standard: patch), damit ein Versions-Update nie vergessen
 * wird. Ueberspringen mit: npm run release -- --no-bump
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GRADLE_PATH = path.join(ROOT, 'android', 'app', 'build.gradle');
const PKG_PATH = path.join(ROOT, 'package.json');

const part = process.argv[2] || 'patch';
if (!['patch', 'minor', 'major'].includes(part)) {
  console.error(`Unbekannter Versionsteil "${part}". Erlaubt: patch | minor | major`);
  process.exit(1);
}

function bumpSemver(version, part) {
  const [maj, min, pat] = version.split('.').map(Number);
  if (part === 'major') return `${maj + 1}.0.0`;
  if (part === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

async function main() {
  let gradle = await fs.readFile(GRADLE_PATH, 'utf8');

  const codeMatch = gradle.match(/versionCode\s+(\d+)/);
  const nameMatch = gradle.match(/versionName\s+"([^"]+)"/);
  if (!codeMatch || !nameMatch) {
    throw new Error('versionCode/versionName nicht in android/app/build.gradle gefunden - Format geaendert?');
  }

  const oldCode = parseInt(codeMatch[1], 10);
  const oldName = nameMatch[1];
  const newCode = oldCode + 1;
  const newName = bumpSemver(oldName, part);

  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${newName}"`);
  await fs.writeFile(GRADLE_PATH, gradle, 'utf8');

  const pkg = JSON.parse(await fs.readFile(PKG_PATH, 'utf8'));
  pkg.version = newName;
  await fs.writeFile(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

  console.log(`Version gebumpt (${part}):`);
  console.log(`  versionCode: ${oldCode} -> ${newCode}`);
  console.log(`  versionName: ${oldName} -> ${newName}`);
  console.log(`  package.json "version": ${newName}`);
}

main().catch((err) => {
  console.error('Versions-Bump fehlgeschlagen:', err.message || err);
  process.exit(1);
});
