/**
 * release.mjs
 *
 * Fuehrt den kompletten Release-Build aus:
 *   0. Versions-Bump (versionCode +1 IMMER, versionName per Standard "patch")
 *      - Play Store akzeptiert keinen bereits hochgeladenen versionCode erneut,
 *        daher ist dieser Schritt fest eingebaut und nicht optional per Default.
 *   1. app/ -> dist-release/app/ minifizieren (build-release.mjs)
 *   2. capacitor.config.json voruebergehend auf webDir "dist-release/app" umstellen
 *   3. npx cap sync android
 *   4. cd android && gradlew bundleRelease
 *   5. capacitor.config.json IMMER zurueck auf webDir "app" stellen (auch bei Fehlern)
 *
 * Nutzung:
 *   npm run release                    (Standard: versionName patch-bump)
 *   npm run release -- --bump=minor    (versionName minor-bump)
 *   npm run release -- --no-bump       (Versions-Bump ueberspringen)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'capacitor.config.json');
const DEV_WEBDIR = 'app';
const RELEASE_WEBDIR = 'dist-release/app';

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} beendet mit Code ${code}`))));
  });
}

async function setWebDir(webDir) {
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
  config.webDir = webDir;
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

async function main() {
  const args = process.argv.slice(2);
  const noBump = args.includes('--no-bump');
  const bumpArg = args.find((a) => a.startsWith('--bump='));
  const bumpPart = bumpArg ? bumpArg.split('=')[1] : 'patch';

  if (noBump) {
    console.log('=== Schritt 0/4: Versions-Bump uebersprungen (--no-bump) ===');
  } else {
    console.log(`=== Schritt 0/4: Versions-Bump (${bumpPart}) ===`);
    await run('node', ['scripts/bump-version.mjs', bumpPart], ROOT);
  }

  console.log('\n=== Schritt 1/4: Release-Build minifizieren ===');
  await run('node', ['scripts/build-release.mjs'], ROOT);

  console.log('\n=== Schritt 2/4: capacitor.config.json auf dist-release/app umstellen ===');
  await setWebDir(RELEASE_WEBDIR);

  try {
    console.log('\n=== Schritt 3/4: npx cap sync android ===');
    await run('npx', ['cap', 'sync', 'android'], ROOT);

    console.log('\n=== Schritt 4/4: gradlew bundleRelease ===');
    // Windows/PowerShell kennt "./gradlew" nicht (nur Mac/Linux-Shells lösen
    // relative Skriptpfade so auf) - unter Windows muss gradlew.bat direkt
    // aufgerufen werden. Nicoles Rechner ist Windows (Bugfix 26.07.2026).
    const gradleCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    await run(gradleCmd, ['bundleRelease'], path.join(ROOT, 'android'));

    console.log('\nRelease-Build fertig. AAB liegt unter android/app/build/outputs/bundle/release/.');
  } finally {
    console.log('\ncapacitor.config.json zurueck auf webDir "app" (Entwicklungsmodus) ...');
    await setWebDir(DEV_WEBDIR);
  }
}

main().catch((err) => {
  console.error('\nRelease-Build fehlgeschlagen:', err.message || err);
  process.exitCode = 1;
});
