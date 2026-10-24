/**
 * recipeArt.js – WellANNI 2.2
 *
 * Rezept-Illustrationen (inline SVG, offline) für alle Rezepte ohne Foto.
 * Jedes Rezept bekommt eine eigene Illustration: Draufsicht der Kochart
 * (Schale, Teller, Blech, Pfanne, Glas ...), Farben aus den Hauptzutaten,
 * Toppings deterministisch aus der Rezept-ID gestreut.
 */
const INK = '#2F4234';
const COLORS = [
  [/kürbis|hokkaido|karotte|möhre|süßkartoffel|orange|mango|aprikose|pfirsich/i, '#E8914F'],
  [/rote bete/i, '#A8355A'],
  [/tomate|paprika|chili|ketchup|passiert/i, '#D65F45'],
  [/himbeer|erdbeer|beere|granatapfel|kirsch|zwetschg|pflaume|cranberr/i, '#B8456A'],
  [/heidelbeer|brombeer/i, '#5E5A8E'],
  [/spinat|grünkohl|brokkoli|zucchini|erbsen|edamame|bohnen, grün|grüne bohnen|rucola|feldsalat|salat|kräuter|petersilie|basilikum|dill|schnittlauch|lauch|kiwi|gurke|rosenkohl|wirsing|spargel|avocado|pesto|minze|koriander|fenchel/i, '#7FA35E'],
  [/rotkohl/i, '#7A3E78'],
  [/linsen|curry|kurkuma/i, '#D9934A'],
  [/lachs|garnele|krabbe/i, '#EE8D6E'],
  [/hähnchen|pute|tofu|tempeh|halloumi/i, '#E7C48F'],
  [/rind|hack|gulasch|steak|schwein|speck|salami|schinken|frikadelle/i, '#94604A'],
  [/kakao|schoko|zartbitter|dattel/i, '#6E4A3A'],
  [/ei\b|eier|eigelb/i, '#F2C14E'],
  [/champignon|pilz/i, '#B89A7A'],
  [/ananas|banane|apfel|birne|honig|ahorn|zitrone|limette|mais/i, '#F2C65A'],
  [/kichererbse|bohne|hafer|quark|joghurt|skyr|reis|nudel|pasta|spaghetti|penne|kartoffel|gnocchi|couscous|bulgur|quinoa|hirse|graupen|milch|feta|mozzarella|ricotta|käse|frischkäse|brot|wrap|tortilla|blumenkohl|sellerie|pastinake|kokos|mehl|nüsse|nuss|mandel|walnuss|haselnuss|cashew|pekannuss/i, '#EBDDBE'],
];
const BG = ['#EEF1E7', '#F4EBDC', '#F1E6E6', '#E8EEEC', '#F3EDDA', '#ECEDE3'];

function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = seed || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

function palette(recipe) {
  const out = [];
  for (const line of recipe.ingredients || []) {
    for (const [re, col] of COLORS) {
      if (re.test(line)) { if (!out.includes(col)) out.push(col); break; }
    }
    if (out.length >= 4) break;
  }
  while (out.length < 3) out.push(['#7FA35E', '#EBDDBE', '#F2C65A'][out.length]);
  return out;
}
const isLight = c => ['#EBDDBE', '#F2C65A', '#E7C48F', '#F2C14E'].includes(c);

// Toppings innerhalb eines Kreises streuen (keine symmetrischen "Gesichter")
function scatter(R, cx, cy, r, n, colors, kinds) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    const col = colors[Math.floor(R() * colors.length)];
    const k = kinds[Math.floor(R() * kinds.length)];
    const rot = Math.floor(R() * 180);
    if (k === 'dot') out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.2 + R() * 2.4).toFixed(1)}" fill="${col}"/>`;
    if (k === 'chunk') out += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8" rx="2.5" fill="${col}" stroke="${INK}" stroke-opacity=".25" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    if (k === 'leaf') out += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}c3-5 9-5 10 0-3 4-8 4-10 0z" fill="#6E9A55" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    if (k === 'slice') out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${col}" stroke="${INK}" stroke-opacity=".3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#fff" opacity=".5"/>`;
    if (k === 'seed') out += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="1.4" ry="2.6" fill="${col}" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return out;
}
const line = (extra = '') => `stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}`;
const spoon = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="5" ry="7" fill="#D8D2C4" ${line()}/><path d="M${x} ${y + 7}v22" ${line('stroke-width="3"')}/></g>`;
const napkin = (col) => `<path d="M0 92l28-6 6 34H0z" fill="${col}" opacity=".55"/><path d="M4 96l22-5M6 104l22-5M8 112l22-5" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/>`;

const SHAPES = {
  bowl(R, p, opt) { // Suppe, Porridge, Bowl
    const fill = opt.fill || p[0];
    let s = `<circle cx="62" cy="60" r="38" fill="#fff" ${line()}/><circle cx="62" cy="60" r="31" fill="${fill}"/>`;
    if (opt.swirl) s += `<path d="M50 58c6-7 18-5 20 2s-8 9-12 5" fill="none" stroke="#FFF7E8" stroke-width="3.2" stroke-linecap="round" opacity=".9"/>`;
    s += scatter(R, 62, 60, 24, opt.n || 9, opt.top || p.slice(1).concat(['#6E9A55']), opt.kinds || ['dot', 'leaf', 'seed']);
    return s + (opt.spoon ? spoon(100, 86, -35) : '');
  },
  plate(R, p, opt) {
    let s = `<circle cx="60" cy="60" r="40" fill="#fff" ${line()}/><circle cx="60" cy="60" r="33" fill="none" stroke="${INK}" stroke-opacity=".12"/>`;
    if (opt.half) s += `<path d="M33 60a27 27 0 0 1 27-27v54a27 27 0 0 1-27-27z" fill="#F6F1E4"/>` + scatter(R, 46, 60, 14, 10, ['#E7DDC6'], ['seed']);
    s += `<path d="${opt.half ? 'M60 33a27 27 0 0 1 0 54z' : 'M60 60m-27 0a27 27 0 1 0 54 0a27 27 0 1 0-54 0'}" fill="${opt.fill || p[0]}"/>`;
    s += scatter(R, opt.half ? 72 : 60, 60, opt.half ? 14 : 22, opt.n || 9, p.slice(1).concat(['#6E9A55']), opt.kinds || ['chunk', 'leaf', 'dot']);
    return s;
  },
  pasta(R, p) {
    let s = `<circle cx="60" cy="60" r="40" fill="#fff" ${line()}/>`;
    for (let i = 0; i < 9; i++) { const y = 40 + i * 5 + R() * 2; s += `<path d="M${36 + R() * 6} ${y}c8-6 12 6 20 0s12 6 20 0" fill="none" stroke="#E9C877" stroke-width="3.2" stroke-linecap="round"/>`; }
    s += `<circle cx="60" cy="60" r="12" fill="${p[0]}" opacity=".9"/>` + scatter(R, 60, 60, 20, 7, p.slice(1).concat(['#6E9A55']), ['dot', 'leaf']);
    return s;
  },
  tray(R, p) {
    let s = `<rect x="16" y="28" width="88" height="64" rx="9" fill="#C9CFC2" ${line()}/><rect x="23" y="35" width="74" height="50" rx="5" fill="#E3C9A0"/>`;
    s += scatter(R, 60, 60, 26, 16, p.concat(['#6E9A55']), ['chunk', 'chunk', 'slice', 'leaf']);
    return s;
  },
  pan(R, p) {
    let s = `<path d="M92 62h26" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="56" cy="62" r="38" fill="#4E5A52" ${line()}/><circle cx="56" cy="62" r="31" fill="#66726A"/>`;
    s += scatter(R, 56, 62, 23, 14, p.concat(['#6E9A55']), ['chunk', 'chunk', 'leaf', 'dot']);
    return s;
  },
  pot(R, p) {
    let s = `<circle cx="60" cy="62" r="40" fill="#5E7D63" ${line()}/><path d="M16 62h8M96 62h8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="62" r="32" fill="${p[0]}"/>`;
    s += scatter(R, 60, 62, 25, 14, p.slice(1).concat(['#6E9A55', '#EBDDBE']), ['chunk', 'dot', 'leaf']);
    return s;
  },
  bread(R, p) {
    let s = `<path d="M26 50c0-14 14-22 34-22s34 8 34 22v42H26z" fill="#C79A63" ${line()}/><path d="M33 52c0-9 10-16 27-16s27 7 27 16v34H33z" fill="#EBD7AF"/>`;
    s += `<rect x="36" y="46" width="48" height="36" rx="12" fill="${p[0]}" opacity=".9"/>` + scatter(R, 60, 64, 16, 8, p.slice(1).concat(['#6E9A55']), ['slice', 'leaf', 'dot']);
    return s;
  },
  egg(R, p) {
    let s = `<circle cx="60" cy="60" r="40" fill="#fff" ${line()}/><path d="M38 56c-2-16 14-22 26-17 14 5 20 20 9 30-11 10-33 7-35-13z" fill="#FFFDF7" ${line()}/><circle cx="56" cy="58" r="9" fill="#F2B53A" ${line()}/>`;
    s += scatter(R, 74, 74, 10, 6, p.concat(['#6E9A55']), ['leaf', 'dot']);
    return s;
  },
  glass(R, p) {
    return `<path d="M38 26h44l-6 70H44z" fill="#fff" ${line()}/><path d="M40.5 42h39l-4.6 52H45.1z" fill="${p[0]}"/><path d="M68 12l-6 36" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="84" cy="30" r="8" fill="${p[1]}" ${line()}/>` + scatter(R, 60, 50, 7, 4, ['#fff'], ['dot']);
  },
  cake(R, p) {
    return `<path d="M34 60h52l-7 34H41z" fill="#E7D3AE" ${line()}/><path d="M32 60c0-16 12-26 28-26s28 10 28 26z" fill="${p[0] === '#EBDDBE' ? '#C9925A' : p[0]}" ${line()}/>` +
      scatter(R, 60, 48, 12, 6, ['#FFF7E8', p[1]], ['dot', 'seed']) + `<path d="M48 68v20M60 68v20M72 68v20" stroke="${INK}" stroke-opacity=".25" stroke-width="1.4"/>`;
  },
  dip(R, p) {
    let s = `<circle cx="58" cy="60" r="40" fill="#fff" ${line()}/><circle cx="48" cy="56" r="17" fill="${p[0]}" ${line()}/><path d="M40 54c4-5 12-5 15 1" fill="none" stroke="#FFF7E8" stroke-width="2.6" stroke-linecap="round"/>`;
    const sticks = ['#E8914F', '#7FA35E', '#D65F45', '#F2C65A'];
    for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.36; const x = 72 + Math.cos(a) * 6, y = 62 + Math.sin(a) * 22; s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${(16 + R() * 6).toFixed(1)} ${(Math.sin(a) * 6).toFixed(1)}" stroke="${sticks[i % 4]}" stroke-width="6" stroke-linecap="round"/>`; }
    return s;
  },
  stack(R, p) {
    let s = `<circle cx="60" cy="62" r="40" fill="#fff" ${line()}/>`;
    [70, 62, 54].forEach((y, i) => { s += `<ellipse cx="60" cy="${y}" rx="27" ry="10" fill="${i === 2 ? '#EFC56E' : '#E2B04F'}" ${line()}/>`; });
    return s + scatter(R, 60, 52, 12, 7, p.filter(c => !isLight(c)).concat(['#B8456A']), ['dot']);
  },
};

const KIND = {
  suppe: ['bowl', { swirl: true, spoon: true, n: 7, kinds: ['leaf', 'dot', 'seed'] }],
  porridge: ['bowl', { fill: '#EBDDBE', spoon: true, n: 10, kinds: ['dot', 'slice', 'seed'] }],
  bowl_suess: ['bowl', { fill: '#F7F1E3', n: 12, kinds: ['dot', 'slice', 'seed'] }],
  salat: ['bowl', { fill: '#8DB46A', n: 12, kinds: ['chunk', 'slice', 'leaf', 'dot'] }],
  bowl: ['plate', { half: true }], bowl_herzhaft: ['plate', {}],
  curry: ['plate', { half: true, kinds: ['chunk', 'leaf', 'dot'] }],
  eintopf: ['pot', {}], ofen: ['tray', {}], pfanne: ['pan', {}], fisch: ['plate', {}],
  pasta: ['pasta', {}], brot: ['bread', {}], ei: ['egg', {}], smoothie: ['glass', {}],
  suess: ['cake', {}], gebaeck: ['cake', {}], dip: ['dip', {}], herzhaft: ['plate', { kinds: ['dot', 'chunk', 'leaf'] }],
  beilage: ['plate', { kinds: ['chunk', 'leaf'] }], pfannkuchen: ['stack', {}],
};

export function recipeIllustration(recipe) {
  const R = rng(hash(recipe.id));
  const p = palette(recipe);
  const [shape, opt] = KIND[recipe.kind] || ['plate', {}];
  const bg = BG[hash(recipe.id + 'bg') % BG.length];
  const deco = (shape === 'bowl' || shape === 'plate') ? napkin(['#9FB8C8', '#D9B48A', '#B9C9A8'][hash(recipe.id) % 3]) : '';
  return `<svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="120" height="120" fill="${bg}"/>${deco}${SHAPES[shape](R, p, opt)}</svg>`;
}

/** Foto (falls vorhanden) oder Illustration als HTML. */
export function recipePictureHtml(recipe) {
  if (recipe?.image) return `<img src="./assets/recipes/${recipe.image}" alt="" loading="lazy">`;
  return recipeIllustration(recipe || { id: 'x', kind: 'plate', ingredients: [] });
}
