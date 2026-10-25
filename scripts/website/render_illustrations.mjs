// Rendert die App-Illustration (recipeArt.js) für Rezepte ohne Foto als SVG-Datei.
// Nutzung: node scripts/website/render_illustrations.mjs <website-ordner> slug=rezeptId ...
import { readFileSync, writeFileSync } from 'node:fs';
import { recipeIllustration } from '../../app/src/ui/components/recipeArt.js';
const [site, ...pairs] = process.argv.slice(2);
const recipes = JSON.parse(readFileSync(new URL('../../app/src/data/recipes.json', import.meta.url), 'utf-8'));
for (const pair of pairs) {
  const [slug, id] = pair.split('=');
  const r = recipes.find(x => x.id === id);
  let svg = recipeIllustration(r);
  if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  writeFileSync(`${site}/img/rezepte/${slug}.svg`, svg);
  console.log(slug, svg.length);
}
