#!/usr/bin/env python3
"""
build_recipe_pages.py – WellANNI Website (wellanni.de)

Erzeugt die Rezeptseiten der Website aus den App-Rezeptdaten, damit Website,
Pins und App immer dieselben Mengen, Zeiten und Nährwerte zeigen.

Nutzung:
    python scripts/website/build_recipe_pages.py <pfad/zur/website>

Liest app/src/data/recipes.json, schreibt rezept-*.html und rezepte.html in
den Website-Ordner. Die Dateinamen (Slugs) bleiben stabil, weil Pins darauf
verlinken. Fotos bleiben die der Website (img/rezepte/<slug>.<ext>).
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECIPES = json.loads((ROOT / 'app/src/data/recipes.json').read_text(encoding='utf-8'))
BY_ID = {r['id']: r for r in RECIPES}

# Slug auf der Website -> Rezept-ID in der App, plus passende Kollektion
PAGES = [
    ('rezept-geroesteter-rosenkohl', 'geroestete_rosenkohl_nuesse_249', 'echtes-essen'),
    ('rezept-halloumi-rosenkohl-eintopf', 'halloumi_eintopf_rosenkohl_vollkornnudeln_9', 'echtes-essen'),
    ('rezept-quinoa-salat-rotkohl', 'quinoa_salat_rotkohl_suesskartoffel_14', 'echtes-essen'),
    ('rezept-skyr-walnuss-zimt', 'skyr_walnuesse_zimt', 'echtes-essen'),
    ('rezept-kabeljau-ofengericht-rotkohl', 'kabeljau_ofengericht_rotkohl_suesskartoffel_112', 'herbst-winter-immunsystem'),
    ('rezept-joghurt-granatapfel-pistazien', 'griechischer_joghurt_granatapfel_pistazien', 'clean-girl-morgenroutine'),
    ('rezept-tempeh-curry', 'tempeh_curry_zucchini_suesskartoffel_24', 'echtes-essen'),
    ('rezept-kichererbsen-gruenkohl-eintopf', 'kichererbsen_eintopf_gruenkohl_vollkornnudeln_10', 'pms-zyklus'),
    ('rezept-rote-linsensuppe', 'linsensuppe_zitrone', 'pms-zyklus'),
    ('rezept-karotten-ingwer-suppe', 'karotten_ingwer_suppe', 'herbst-winter-immunsystem'),
    ('rezept-lachs-auf-spinatbett', 'lachsfilet_spinat', 'herbst-winter-immunsystem'),
    ('rezept-overnight-oats-chia', 'overnight_oats_chia_beeren', 'echtes-essen'),
    ('rezept-buchweizen-porridge', 'buchweizen_porridge_apfel_zimt', 'wechseljahre'),
    ('rezept-energy-balls', 'haferflocken_energy_balls', 'echtes-essen'),
]

COLLECTIONS = {
    'echtes-essen': 'Echtes Essen',
    'herbst-winter-immunsystem': 'Herbst &amp; Winter',
    'clean-girl-morgenroutine': 'Morgenroutine &amp; Haut',
    'pms-zyklus': 'Zyklus Phasen &amp; PMS',
    'wechseljahre': 'Wechseljahre &amp; Perimenopause',
}

SUGAR = re.compile(r'\b(zucker|rohrzucker|puderzucker|honig|ahornsirup|agavendicksaft|dattelsirup|reissirup|sirup)\b', re.I)

PLAY = 'https://play.google.com/store/apps/details?id=com.vitalmetrics.app'


def play_link(campaign):
    return f'{PLAY}&amp;referrer=utm_source%3Dwellanni.de%26utm_medium%3Dwebsite%26utm_campaign%3D{campaign}'


def de(n, digits=0):
    s = f'{n:.{digits}f}'
    return s.replace('.', ',')


def no_added_sugar(r):
    return not any(SUGAR.search(i) for i in r['ingredients'])


def kicker(r):
    meal = {'breakfast': 'Frühstück', 'lunch': 'Hauptgericht', 'snack': 'Snack'}[r['mealType']]
    diet = 'vegan' if r['vegan'] else 'vegetarisch' if r['vegetarian'] else ('mit Fisch' if re.search('lachs|kabeljau|forelle|thunfisch|hering', ' '.join(r['ingredients']), re.I) else 'mit Fleisch')
    return f'{meal} · {diet}'


def icon(r):
    if not r['vegetarian']:
        return 'ph-fish' if re.search('lachs|kabeljau|forelle|thunfisch|hering', ' '.join(r['ingredients']), re.I) else 'ph-cooking-pot'
    return {'breakfast': 'ph-bowl-food', 'snack': 'ph-cookie'}.get(r['mealType'], 'ph-cooking-pot')


def image_for(site, slug):
    for ext in ('jpg', 'webp', 'png', 'svg'):
        if (site / 'img/rezepte' / f'{slug}.{ext}').exists():
            return f'img/rezepte/{slug}.{ext}'
    return None


def iso_duration(minutes):
    h, m = divmod(int(minutes), 60)
    return 'PT' + (f'{h}H' if h else '') + (f'{m}M' if m or not h else '')


def badges(r):
    n = r['nutritionPerServing']
    out = []
    if no_added_sugar(r):
        out.append('ohne Zuckerzusatz')
    if n['protein'] >= 20:
        out.append('eiweißreich')
    if r['vegan']:
        out.append('vegan')
    elif r['vegetarian']:
        out.append('vegetarisch')
    return out


def head(title, desc, canonical, image, extra=''):
    return f'''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{image}">
<meta name="theme-color" content="#F3F4EE">
<meta name="p:domain_verify" content="c04f6af6be05f924b2e9b93d274d0e14"/>
<link rel="preload" href="fonts/figtree-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="style.css">
{extra}</head>
<body>
<div class="page">
  <div class="blobs" aria-hidden="true"><span class="blob-a"></span><span class="blob-b"></span><span class="blob-c"></span></div>
  <div class="shell">
'''


def header(current, campaign):
    def cur(name):
        return ' aria-current="page"' if current == name else ''
    return f'''    <header class="site-header">
      <a class="logo" href="index.html"><span class="logo-dot" aria-hidden="true"></span>WellANNI</a>
      <nav class="site-nav">
        <a class="hide-sm" href="echtes-essen.html"{cur('echtes')}>Echtes Essen</a>
        <a href="index.html#kollektionen"{cur('kollektionen')}>Kollektionen</a>
        <a class="hide-xs" href="rezepte.html"{cur('rezepte')}>Rezepte</a>
      </nav>
      <a class="btn btn-primary btn-sm" href="{play_link(campaign)}" target="_blank" rel="noopener"><i class="ph-duotone ph-device-mobile" aria-hidden="true"></i>App holen</a>
    </header>
'''


FOOTER = '''    <footer class="site-footer">
      <p>Werbung/Anzeige: Produktempfehlungen auf dieser Seite enthalten Affiliate-Links — kommt ein Kauf über diese Links zustande, erhält WellANNI ggf. eine Provision, für dich entstehen keine Mehrkosten. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung, Diagnose oder Behandlung.</p>
      <p>WellANNI gibt es für Android. Eine iPhone-Version ist in Planung – sobald sie da ist, erfährst du es hier.</p>
      <p>© 2026 Nicole Doehring · WellANNI · <a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a>{social}</p>
    </footer>
  </div>
</div>
</body>
</html>
'''


def footer(social_links):
    social = ''.join(f' · <a href="{url}" target="_blank" rel="noopener">{name}</a>' for name, url in social_links)
    return FOOTER.replace('{social}', social)


def recipe_page(site, slug, r, collection, others, social):
    n = r['nutritionPerServing']
    title = r['title']
    total = r['prepMin'] + r['cookMin']
    desc = html.escape(f"{r['highlight']} {r['duration']}, {r['servings']} Portion{'en' if r['servings'] > 1 else ''}, {round(n['kal'])} kcal pro Portion.")
    img = image_for(site, slug)
    img_abs = f'https://wellanni.de/{img}' if img and not img.endswith('.svg') else 'https://wellanni.de/img/hero.webp'
    # Nährwerte-Box: Eiweiß, Ballaststoffe + die zwei stärksten weiteren Fokus-Nährstoffe der App
    nuts = [('Eiweiß', f"{de(n['protein'])} g"), ('Ballaststoffe', f"{de(n['fiber'])} g")]
    for f in r.get('focus', []):
        if f['key'] in ('protein', 'fiber') or len(nuts) >= 4:
            continue
        amt = de(f['amount'], 1 if f['amount'] < 10 else 0)
        nuts.append((f['label'], f"{amt} {f['unit']}"))
    nuts_html = ''.join(f'<div class="nut"><span>{html.escape(k)}</span><b>{v}</b></div>' for k, v in nuts)
    tags = [f'<span><i class="ph-duotone ph-timer" aria-hidden="true"></i> {html.escape(r["duration"])}</span>',
            f'<span><i class="ph-duotone ph-users" aria-hidden="true"></i> {r["servings"]} Portion{"en" if r["servings"] > 1 else ""}</span>',
            f'<span>{round(n["kal"])} kcal pro Portion</span>']
    tags += [f'<span class="tag-accent">{b}</span>' for b in badges(r)]
    allergen_names = {'gluten': 'Gluten', 'milk': 'Milch', 'egg': 'Ei', 'fish': 'Fisch', 'crustaceans': 'Krebstiere', 'peanut': 'Erdnüsse', 'tree_nuts': 'Schalenfrüchte', 'sesame': 'Sesam', 'soy': 'Soja', 'celery': 'Sellerie', 'mustard': 'Senf', 'sulphites': 'Sulfite'}
    allergens = ', '.join(allergen_names.get(a, a) for a in r.get('allergens', []))
    schema = {
        '@context': 'https://schema.org', '@type': 'Recipe', 'name': title, 'description': r['highlight'],
        'image': [img_abs], 'author': {'@type': 'Organization', 'name': 'WellANNI'},
        'prepTime': iso_duration(r['prepMin']), 'cookTime': iso_duration(r['cookMin'] or 0), 'totalTime': iso_duration(total + (r.get('waitMin') or 0)),
        'recipeYield': f"{r['servings']} Portionen", 'recipeCategory': kicker(r).split(' · ')[0], 'recipeCuisine': 'Deutsch',
        'keywords': ', '.join(badges(r)),
        'recipeIngredient': r['ingredients'],
        'recipeInstructions': [{'@type': 'HowToStep', 'text': s} for s in r['steps']],
        'nutrition': {'@type': 'NutritionInformation', 'calories': f"{round(n['kal'])} kcal", 'proteinContent': f"{de(n['protein'])} g",
                      'fiberContent': f"{de(n['fiber'])} g", 'carbohydrateContent': f"{de(n['carbs'])} g", 'fatContent': f"{de(n['fat'])} g"},
    }
    if r.get('vegan'):
        schema['suitableForDiet'] = 'https://schema.org/VeganDiet'
    elif r.get('vegetarian'):
        schema['suitableForDiet'] = 'https://schema.org/VegetarianDiet'
    extra = f'<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>\n'
    others_html = '\n'.join(
        f'<a href="{s}.html"><span class="icon-tile"><i class="ph-duotone {icon(o)}" aria-hidden="true"></i></span>{html.escape(o["title"])}</a>'
        for s, o in others)
    tip = f'<p class="body-txt tip"><i class="ph-duotone ph-lightbulb" aria-hidden="true"></i> {html.escape(r["tip"])}</p>' if r.get('tip') else ''
    visual = (f'<img src="{img}" alt="{html.escape(title)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 70%" loading="eager">'
              if img else f'<i class="ph-duotone {icon(r)} big-icon" aria-hidden="true"></i>')
    return (head(f'{html.escape(title)} – Rezept mit Nährwerten | WellANNI', desc, f'https://wellanni.de/{slug}.html', img_abs, extra)
            + header('rezepte', slug)
            + f'''
    <main class="wrap">
      <div class="back"><a href="rezepte.html"><i class="ph-duotone ph-arrow-left" aria-hidden="true"></i>Alle Rezepte</a></div>
      <section class="c-hero">
        <div class="rise">
          <div class="c-kicker"><i class="ph-duotone {icon(r)}" aria-hidden="true"></i>{kicker(r)}</div>
          <h1>{html.escape(title)}</h1>
          <p class="lead">{html.escape(r['highlight'])}</p>
          <div class="tags">{''.join(tags)}</div>
        </div>
        <div class="c-visual" style="aspect-ratio:4/5;min-height:420px">
          {visual}
          <div class="note"><i class="ph-duotone ph-chart-bar" aria-hidden="true"></i><div><strong>Nährwerte pro Portion</strong><div class="nuts">{nuts_html}</div></div></div>
        </div>
      </section>
      <section class="recipe-grid">
        <div class="panel"><h2>Zutaten <span class="muted">für {r['servings']} Portion{'en' if r['servings'] > 1 else ''}</span></h2><ul class="ing">{''.join(f'<li>{html.escape(i)}</li>' for i in r['ingredients'])}</ul>
          <p class="footnote">{('Enthält: ' + allergens + '. ') if allergens else ''}Nährwerte berechnet mit dem Bundeslebensmittelschlüssel (BLS 4.0), {round(n['kal'])} kcal · {de(n['carbs'])} g Kohlenhydrate · {de(n['fat'])} g Fett pro Portion.</p></div>
        <div class="panel"><h2>Zubereitung</h2><ol class="steps">{''.join(f'<li>{html.escape(s)}</li>' for s in r['steps'])}</ol>{tip}</div>
      </section>
      <section class="c-bottom">
        <div class="panel">
          <h2>Mehr aus der App</h2>
          <p class="body-txt">Dieses Rezept stammt aus der WellANNI-App{' (Foto KI-generiert)' if img and img.endswith('.jpg') else ''}. Dort findest du über 200 geprüfte Rezepte, planst deine Woche für den ganzen Haushalt samt Einkaufsliste und siehst, was dein Teller schon geliefert hat.</p>
          <a class="btn btn-primary" href="{play_link(slug)}" target="_blank" rel="noopener">WellANNI App holen</a>
          <p class="body-txt" style="margin-top:18px">Passende Kollektion: <a href="{collection}.html">{COLLECTIONS[collection]}</a></p>
        </div>
        <div>
          <h2>Weitere Rezepte</h2>
          <div class="others">
{others_html}
          </div>
        </div>
      </section>
    </main>
''' + footer(social))


def overview_page(site, social):
    cards = []
    for slug, rid, _ in PAGES:
        r = BY_ID[rid]
        n = r['nutritionPerServing']
        img = image_for(site, slug)
        media = f'<span class="card-photo"><img src="{img}" alt="" loading="lazy"></span>' if img else f'<span class="icon-tile"><i class="ph-duotone {icon(r)}" aria-hidden="true"></i></span>'
        badge = ' · '.join(badges(r)[:2])
        cards.append(f'''          <a class="collection-card recipe-card" href="{slug}.html">
            {media}
            <div class="kicker">{kicker(r)}</div>
            <h3>{html.escape(r['title'])}</h3>
            <p>{html.escape(r['highlight'])}</p>
            <div class="card-meta"><span>{html.escape(r['duration'])} · {round(n['kal'])} kcal · {de(n['protein'])} g Eiweiß{(' · ' + badge) if badge else ''}</span><i class="ph-duotone ph-arrow-right" aria-hidden="true"></i></div>
          </a>''')
    desc = 'Echtes Essen aus der WellANNI-App: saisonale Rezepte mit viel Eiweiß aus Lebensmitteln, Nährwerten pro Portion und ohne Pulver.'
    return (head('Gesunde Rezepte mit Nährwerten – echtes Essen | WellANNI', desc, 'https://wellanni.de/rezepte.html', 'https://wellanni.de/img/hero.webp')
            + header('rezepte', 'rezepte')
            + f'''
    <main class="wrap">
      <section class="legal-hero rise" style="padding-top:clamp(32px,6vw,72px)">
        <div class="c-kicker"><i class="ph-duotone ph-cooking-pot" aria-hidden="true"></i>Küche</div>
        <h1>Gesunde Rezepte</h1>
        <p class="lead">Echtes Essen aus der WellANNI-App: Eiweiß aus Lebensmitteln statt aus Pulver, Süße aus Obst, Nährwerte pro Portion. In der App warten über 200 weitere.</p>
      </section>
      <div class="collection-grid">
{chr(10).join(cards)}
      </div>
    </main>
''' + footer(social))



FOOD_PROTEIN = [
    ('Magerquark', '150 g', '18 g Eiweiß', 'Cremig als Dip, mit Kräutern aufs Brot oder mit Obst zum Frühstück.'),
    ('Linsen', '150 g gekocht', '14 g Eiweiß · 11 g Ballaststoffe', 'Rote Linsen sind in 15 Minuten weich – für Suppen, Dal oder Salat.'),
    ('Zwei Eier', '120 g', '17 g Eiweiß', 'Gekocht, als Rührei oder Frittata: das schnellste Eiweiß der Küche.'),
    ('Tofu', '100 g', '16 g Eiweiß', 'Knusprig gebraten nimmt er jede Würze an – Sojasauce, Curry, Knoblauch.'),
    ('Kichererbsen', '150 g gekocht', '13 g Eiweiß · 16 g Ballaststoffe', 'Aus dem Ofen als Snack, im Eintopf oder als Hummus.'),
    ('Lachs', '125 g', '25 g Eiweiß', 'Dazu liefert er Vitamin D – im Winter besonders wertvoll.'),
]

FOOD_SWEET = [
    ('Reife Banane', 'Zerdrückt im Porridge oder in Pancakes ersetzt sie Zucker fast vollständig.'),
    ('Datteln', 'Klein gehackt oder püriert – die Süße für Energy Balls und Kuchen.'),
    ('Apfel und Birne', 'Gerieben im Porridge oder warm aus dem Ofen mit Zimt.'),
    ('Zimt und Vanille', 'Sie lassen Speisen süßer schmecken, ohne dass Zucker dazukommt.'),
    ('Beeren', 'Frisch im Sommer, tiefgekühlt im Winter – süß-säuerlich und voller Farbe.'),
    ('Ofengemüse', 'Süßkartoffel, Karotte und Kürbis werden im Ofen von selbst karamellig.'),
]


def echtes_essen_page(site, social):
    picks = ['rezept-skyr-walnuss-zimt', 'rezept-rote-linsensuppe', 'rezept-halloumi-rosenkohl-eintopf', 'rezept-overnight-oats-chia']
    cards = []
    for slug in picks:
        rid = next(i for s, i, _ in PAGES if s == slug)
        r = BY_ID[rid]
        n = r['nutritionPerServing']
        img = image_for(site, slug)
        cards.append(f'''          <a class="collection-card recipe-card" href="{slug}.html">
            <span class="card-photo"><img src="{img}" alt="" loading="lazy"></span>
            <div class="kicker">{kicker(r)}</div>
            <h3>{html.escape(r['title'])}</h3>
            <div class="card-meta"><span>{html.escape(r['duration'])} · {de(n['protein'])} g Eiweiß{' · ohne Zuckerzusatz' if no_added_sugar(r) else ''}</span><i class="ph-duotone ph-arrow-right" aria-hidden="true"></i></div>
          </a>''')
    protein = '\n'.join(f'''          <div class="food-card"><h3>{a}</h3><p>{d}</p><span class="amount">{b}: {c}</span></div>''' for a, b, c, d in FOOD_PROTEIN)
    sweet = '\n'.join(f'''          <div class="food-card"><h3>{a}</h3><p>{d}</p></div>''' for a, d in FOOD_SWEET)
    desc = 'Echtes Essen statt Pulver und Süßstoff: genug Eiweiß aus Lebensmitteln, Süße aus Obst und wieder ein Gespür dafür, wann du satt bist.'
    return (head('Echtes Essen: Eiweiß ohne Pulver, Süße ohne Zucker | WellANNI', desc, 'https://wellanni.de/echtes-essen.html', 'https://wellanni.de/img/hero.webp')
            + header('echtes', 'echtes-essen')
            + f'''
    <main class="wrap">
      <div class="back"><a href="index.html"><i class="ph-duotone ph-arrow-left" aria-hidden="true"></i>Alle Kollektionen</a></div>
      <section class="c-hero">
        <div class="rise">
          <div class="c-kicker"><i class="ph-duotone ph-bowl-food" aria-hidden="true"></i>Unsere Haltung</div>
          <h1>Echtes Essen</h1>
          <p class="lead">Immer mehr Rezepte brauchen Proteinpulver und Süßstoff. Wir finden: Das Gesunde gehört wieder auf den Tisch. Genug Eiweiß aus Lebensmitteln, Süße aus Obst, Freude am Kochen – und wieder ein Gespür dafür, wann du hungrig und wann du satt bist.</p>
          <div class="tags"><span>Eiweiß ohne Pulver</span><span>Süße aus Obst</span><span>Satt werden</span></div>
        </div>
        <div class="c-visual">
          <i class="ph-duotone ph-bowl-food big-icon" aria-hidden="true"></i>
          <div class="note"><i class="ph-duotone ph-device-mobile" aria-hidden="true"></i><div><strong>Mit der WellANNI-App</strong>Über 200 geprüfte Rezepte, alle ohne Pulver und Süßstoff, viele ohne Zuckerzusatz. Die App zeigt dir, was dein Teller schon geliefert hat – Eiweiß, Ballaststoffe, Eisen und mehr.</div></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2>Eiweiß ohne Pulver</h2>
          <p>Für die meisten Erwachsenen empfiehlt die Deutsche Gesellschaft für Ernährung 0,8 g Eiweiß pro Kilogramm Körpergewicht am Tag, für Ältere etwas mehr. Das schaffst du gut mit Lebensmitteln – Pulver ist dafür nicht nötig.</p>
        </div>
        <div class="food-grid">
{protein}
        </div>
        <p class="footnote">Eiweiß und Ballaststoffe berechnet mit dem Bundeslebensmittelschlüssel (BLS 4.0).</p>
      </section>

      <section class="section">
        <div class="section-head">
          <h2>Süße aus Obst statt aus Süßstoff</h2>
          <p>Die Weltgesundheitsorganisation rät seit 2023 davon ab, Süßstoffe zur Gewichtskontrolle einzusetzen – auf Dauer zeigte sich kein Nutzen. Schöner ist ohnehin, wenn die Süße aus dem Essen selbst kommt.</p>
        </div>
        <div class="food-grid">
{sweet}
        </div>
      </section>

      <section class="c-bottom">
        <div class="panel">
          <h2>Wieder spüren, wann du satt bist</h2>
          <ul class="checks">
            <li><i class="ph-duotone ph-check-circle" aria-hidden="true"></i><span>Langsam essen: Das Sättigungsgefühl braucht eine Weile, oft rund 20 Minuten.</span></li>
            <li><i class="ph-duotone ph-check-circle" aria-hidden="true"></i><span>Eiweiß und Ballaststoffe in jede Mahlzeit – sie halten lange satt.</span></li>
            <li><i class="ph-duotone ph-check-circle" aria-hidden="true"></i><span>Hunger zwischendurch? Erst ein Glas Wasser, dann kurz nachspüren.</span></li>
            <li><i class="ph-duotone ph-check-circle" aria-hidden="true"></i><span>Welche Nährstoffe fehlen, spürt der Körper meist nicht. Dafür hilft ein Blick auf den Teller – in der App mit einem Tipp.</span></li>
          </ul>
          <a class="btn btn-primary" href="{play_link('echtes-essen')}" target="_blank" rel="noopener" style="margin-top:18px">WellANNI App holen</a>
        </div>
        <div>
          <h2>Zum Nachkochen</h2>
          <div class="collection-grid" style="grid-template-columns:1fr 1fr">
{chr(10).join(cards)}
          </div>
        </div>
      </section>
    </main>
''' + footer(social))


def main():
    site = Path(sys.argv[1]).resolve()
    social = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
    for i, (slug, rid, collection) in enumerate(PAGES):
        r = BY_ID[rid]
        others = [(s, BY_ID[o]) for s, o, _ in (PAGES[(i + k) % len(PAGES)] for k in range(1, 7))]
        (site / f'{slug}.html').write_text(recipe_page(site, slug, r, collection, others, social), encoding='utf-8')
    (site / 'rezepte.html').write_text(overview_page(site, social), encoding='utf-8')
    (site / 'echtes-essen.html').write_text(echtes_essen_page(site, social), encoding='utf-8')
    print(f'{len(PAGES)} Rezeptseiten + rezepte.html geschrieben nach {site}')


if __name__ == '__main__':
    main()
