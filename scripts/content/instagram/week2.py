# Instagram Woche 2: Mo 2.11. – So 8.11.2026
# Pro Tag: 08:00 Reel · 12:00 Karussell (nur Text) · 18:00 Reel. Reels mit KI-Bildern der Nutzerin.
import json, pathlib

KI = '\n\nBilder KI-generiert.'
DISCLAIMER = '*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.'
DS = DISCLAIMER.replace('*', '\\*')
APP = 'Mehr als 200 Rezepte mit Wochenplan und Einkaufsliste: WellANNI-App, Link in Bio.'
WEB = 'Rezept mit Nährwerten: wellanni.de (Link in Bio).'
POS = 'center 88%'

_R = {r['id']: r for r in json.load(open(pathlib.Path('/home/claude/wa/app/src/data/recipes.json'), encoding='utf-8'))}


def recipe_block(rid, name=None):
    r = _R[rid]
    ing = '\n'.join('• ' + i for i in r['ingredients'])
    steps = '\n'.join(f'{i}. {s}' for i, s in enumerate(r['steps'], 1))
    return f"{name or r['title']} ({r['servings']} {'Portion' if r['servings'] == 1 else 'Portionen'}, {r['duration']}):\n{ing}\n\n{steps}"


def reel(id, folder, day, time, serie, title, rid, photo, slides, intro, outro, tags, alt, link='', name=None, pos=POS):
    slides[0].update(photo=photo, pos=pos)
    cap = f"{intro}\n\n{recipe_block(rid, name)}\n\n{outro}\n\n{WEB if link else APP}\n\n{tags}" + KI
    return dict(id=id, folder=folder, fmt='reel', day=day, time=time, serie=serie, title=title, link=link,
                slides=slides, caption=cap, alt=alt, note='Nach dem Veröffentlichen in der App das KI-Label setzen.')


POSTS = [
# ───────────── Mo 2.11. ─────────────
reel('w2-01_reel_shakshuka', '01_Mo-02-11', 'Mo 2.11.', '08:00', 'Echtes Essen',
  'Reel: Shakshuka – Eier in Tomatensauce, eine Pfanne', 'shakshuka', 'w2_01_shakshuka.jpg',
  [dict(t='photo', kicker='Frühstück für zwei', title='Eier in Tomatensauce.\n*Eine Pfanne.*', size=84, dur=2.6),
   dict(t='list', kicker='So geht’s', title='In *3* Schritten', size=100, items=[
       ('Gemüse weich dünsten', 'Zwiebel, Paprika, Knoblauch, 5 Min.'),
       ('Tomaten einköcheln', '8 Min., bis es sämig ist'),
       ('Eier in Mulden', 'zugedeckt 5–7 Min. stocken lassen')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='25 g', title='Eiweiß aus Eiern, Feta und Vollkornbrot – *ganz ohne Pulver.*', size=72, dur=3.2),
   dict(t='end', title='Speichern fürs\n*Wochenende.*', sub='Brot zum Dippen ist Pflicht. 🍞', size=110, dur=2.4)],
  'Eier, die in würziger Tomatensauce garen – Shakshuka ist Frühstück zum Teilen 🍳',
  'Pro Portion rund 25 g Eiweiß und 9 g Ballaststoffe – Eiweiß ohne Pulver, einfach aus echten Lebensmitteln.\n\n📌 Speichern fürs Wochenende.\nMit wem würdest du die Pfanne teilen? 👇',
  '#Shakshuka #GesundesFrühstück #EiweißOhnePulver #EchtesEssen #WellANNI',
  'Reel: Gusseiserne Pfanne mit Shakshuka, vier Eier in Tomatensauce mit Feta und Petersilie. Text: Eier in Tomatensauce, eine Pfanne, 25 g Eiweiß pro Portion.'),

dict(id='w2-01_post_satt-werden', folder='01_Mo-02-11', fmt='post', day='Mo 2.11.', time='12:00', serie='Echtes Essen',
  title='Karussell: Satt werden ohne Zählen – 4 Regeln', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Echtes Essen', title='Satt werden,\nohne zu\n*zählen.*', sub='4 einfache Regeln statt Kalorien-App.'),
    dict(t='list', kicker='Die 4 Regeln', title='So hält dein\nEssen *länger vor*', items=[
        ('Eiweiß in jede Mahlzeit', 'Ei, Quark, Linsen, Fisch, Käse'),
        ('Die Hälfte Gemüse', 'füllt den Teller, bringt Ballaststoffe'),
        ('Langsam essen', 'Gabel zwischendurch ablegen'),
        ('Erst trinken', 'Durst fühlt sich oft wie Hunger an')]),
    dict(t='big', kicker='Warum langsam?', big='ca. 20 Min.', bigsize=130, title='dauert es, bis das Sattsein im Kopf ankommt. Wer schlingt, merkt es *zu spät.*'),
    dict(t='big', kicker='Und Süßes?', big='Gehört\ndazu.', bigsize=130, title='Nach einer sättigenden Mahlzeit reicht oft *ein Stück* – statt der halben Tafel am Nachmittag.'),
    dict(t='end', title='Welche Regel\nfällt dir am\n*schwersten?*', size=104, sub='Schreib die Zahl in die Kommentare 👇'),
  ],
  caption="""Satt werden, ohne zu zählen 🌿

Keine Kalorien-App, kein Verbot. Diese 4 Regeln helfen dir, wieder zu spüren, wann du genug hast:

1️⃣ Eiweiß in jede Mahlzeit – Ei, Quark, Linsen, Fisch oder Käse.
2️⃣ Die Hälfte des Tellers Gemüse – das füllt und bringt Ballaststoffe.
3️⃣ Langsam essen – es dauert etwa 20 Minuten, bis das Sattsein im Kopf ankommt.
4️⃣ Erst trinken – Durst fühlt sich oft an wie Hunger.

Und Süßes? Gehört dazu. Nach einer Mahlzeit, die wirklich satt macht, reicht oft ein Stück.

Welche Regel fällt dir am schwersten? Schreib die Zahl in die Kommentare 👇

📌 Speichern und für die nächste Mahlzeit merken.

#EchtesEssen #IntuitivEssen #GesundeErnährung #SattWerden #WellANNI""",
  alt='5 Folien: Satt werden ohne zu zählen. 4 Regeln: Eiweiß in jede Mahlzeit, die Hälfte Gemüse, langsam essen, erst trinken. Es dauert etwa 20 Minuten, bis das Sattsein ankommt.',
  note=''),

reel('w2-01_reel_linsen-dal', '01_Mo-02-11', 'Mo 2.11.', '18:00', 'Echtes Essen',
  'Reel: Linsen-Dal – Wohlfühlessen aus einem Topf', 'linsen_dal_spinat_kokos', 'w2_02_linsen-dal.jpg',
  [dict(t='photo', kicker='Vegan · ein Topf', title='Wohlfühlessen\n*aus einem Topf.*', size=84, dur=2.6),
   dict(t='big', kicker='Das Geheimnis', big='Rote\nLinsen', bigsize=130, title='zerfallen nach 20 Minuten von selbst – so wird das Dal *cremig ohne Sahne.*', size=68, dur=3.6),
   dict(t='big', kicker='Pro Portion', big='12 g', title='Ballaststoffe und *24 g Eiweiß* – rein pflanzlich, für 4 Personen.', size=72, dur=3.2),
   dict(t='end', title='Speichern für\nden *nächsten\nkalten Abend.*', sub='Rezept in der Caption.', size=100, dur=2.4)],
  'Cremige Linsen, warme Gewürze, frischer Spinat – Dal ist Wohlfühlessen pur 🍛',
  'Pro Portion rund 12 g Ballaststoffe und 24 g Eiweiß, ohne Zuckerzusatz. Reste schmecken am nächsten Tag noch besser.\n\n📌 Speichern für den nächsten kalten Abend.',
  '#LinsenDal #VeganKochen #Hülsenfrüchte #EchtesEssen #WellANNI',
  'Reel: Schale mit goldgelbem Linsen-Dal mit Spinat und Kokosmilch, daneben Reis und Limette. Text: Wohlfühlessen aus einem Topf, 12 g Ballaststoffe pro Portion.'),

# ───────────── Di 3.11. ─────────────
reel('w2-02_reel_ruehrei-lachs', '02_Di-03-11', 'Di 3.11.', '08:00', 'Echtes Essen',
  'Reel: Rührei mit Räucherlachs – 10 Minuten wie im Hotel', 'ruehrei_raeucherlachs', 'w2_03_ruehrei-lachs.jpg',
  [dict(t='photo', kicker='Frühstück in 10 Minuten', title='Wie im Hotel.\n*Nur zu Hause.*', size=88, dur=2.6),
   dict(t='list', kicker='Der Trick', title='*Kleine* Hitze', size=100, items=[
       ('Eier nur pfeffern', 'der Lachs bringt das Salz mit'),
       ('Langsam stocken lassen', 'bei kleiner Hitze, so wird es cremig'),
       ('Lachs zum Schluss', 'vom Herd nehmen, dann unterheben')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='26 g', title='Eiweiß – aus 2 Eiern und Lachs. *Ohne Shake.*', size=76, dur=3.0),
   dict(t='end', title='Speichern für\n*morgen früh.*', sub='Rührei: cremig oder fest? 👇', size=110, dur=2.4)],
  'Cremiges Rührei mit Räucherlachs – Hotelfrühstück in 10 Minuten 🐟',
  'Pro Portion rund 26 g Eiweiß. Der Trick ist die kleine Hitze: Dann wird das Rührei cremig statt trocken.\n\n📌 Speichern für morgen früh.\nTeam cremig oder Team fest? 👇',
  '#Rührei #Räucherlachs #EiweißOhnePulver #GesundesFrühstück #WellANNI',
  'Reel: Cremiges Rührei mit Räucherlachs und Schnittlauch auf Vollkornbrot. Text: Wie im Hotel, nur zu Hause. Kleine Hitze, 26 g Eiweiß.'),

dict(id='w2-02_post_vitamin-d-mythen', folder='02_Di-03-11', fmt='post', day='Di 3.11.', time='12:00', serie='Herbst & Winter',
  title='Karussell: Vitamin D – 5 Mythen', link='https://wellanni.de/herbst-winter-immunsystem.html',
  slides=[
    dict(t='cover', kicker='Herbst & Winter', title='Vitamin D:\n*5 Mythen.*', sub='Und was wirklich stimmt.'),
    dict(t='big', kicker='Mythos 1', big='„Durchs\nFenster\nreicht.“', bigsize=110, title='Stimmt nicht: Fensterglas lässt die UVB-Strahlung *kaum durch*. Für Vitamin D musst du raus.', size=56),
    dict(t='big', kicker='Mythos 2', big='„Ein bisschen\nSonne reicht.“', bigsize=96, title='Von Oktober bis März steht die Sonne bei uns zu tief. Die Haut bildet dann *kaum* Vitamin D.', size=56, foot='Quelle: Verbraucherzentrale'),
    dict(t='big', kicker='Mythos 3', big='„Das Essen\ndeckt das.“', bigsize=100, title='Nur wenige Lebensmittel enthalten nennenswert Vitamin D. Am meisten steckt in *fettem Seefisch* wie Hering, Lachs und Makrele.', size=54),
    dict(t='big', kicker='Mythos 4', big='„Viel hilft\nviel.“', bigsize=110, title='Vitamin D wird im Körper gespeichert, zu viel kann *schaden*. Hochdosierte Präparate nur nach ärztlicher Abklärung.', size=54),
    dict(t='big', kicker='Mythos 5', big='„Solarium\nhilft.“', bigsize=110, title='Das Bundesamt für Strahlenschutz rät davon ab: Die UV-Strahlung *erhöht das Hautkrebsrisiko.*', size=56, foot='Quelle: Bundesamt für Strahlenschutz'),
    dict(t='end', title='Welchen Mythos\nhast du *geglaubt?*', size=100, sub='Speichern und an die Person schicken, die gerne am Fenster sonnt.',
         foot='Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.\\* \n' + DS),
  ],
  caption="""Vitamin D: 5 Mythen – und was wirklich stimmt ☀️

❌ „Durchs Fenster reicht.“ Fensterglas lässt die UVB-Strahlung kaum durch.
❌ „Ein bisschen Sonne reicht.“ Von Oktober bis März steht die Sonne bei uns zu tief, die Haut bildet kaum Vitamin D.
❌ „Das Essen deckt das.“ Nur wenige Lebensmittel enthalten nennenswert Vitamin D – am meisten fetter Seefisch wie Hering, Lachs und Makrele.
❌ „Viel hilft viel.“ Vitamin D wird gespeichert, zu viel kann schaden. Hochdosiertes nur nach ärztlicher Abklärung.
❌ „Solarium hilft.“ Das Bundesamt für Strahlenschutz rät ab, weil die UV-Strahlung das Hautkrebsrisiko erhöht.

Welchen Mythos hast du geglaubt? 👇

Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.*
*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.

Quellen: Verbraucherzentrale, Bundesamt für Strahlenschutz.

#VitaminD #Herbst #Wintergesundheit #Ernährungswissen #WellANNI""",
  alt='7 Folien zu Vitamin-D-Mythen: Fensterglas lässt UVB kaum durch, von Oktober bis März reicht die Sonne nicht, nur wenige Lebensmittel enthalten Vitamin D, zu viel kann schaden, das Solarium ist keine Lösung.',
  note=''),

reel('w2-02_reel_kuerbis-pasta', '02_Di-03-11', 'Di 3.11.', '18:00', 'Herbst & Winter',
  'Reel: Kürbis-Pasta mit Salbei – Herbst auf der Gabel', 'kuerbis_pasta_salbei', 'w2_04_kuerbis-pasta.jpg',
  [dict(t='photo', kicker='Herbstküche', title='Herbst\n*auf der Gabel.*', size=92, dur=2.6),
   dict(t='list', kicker='3 Kniffe', title='So wird sie\n*samtig*', size=96, items=[
       ('Hokkaido mit Schale', 'kein Schälen, wird beim Kochen weich'),
       ('Salbei in Butter', 'knusprig braten, als Topping'),
       ('Ein Schluck Nudelwasser', 'bindet die Sauce')], dur=4.4),
   dict(t='big', kicker='Pro Portion', big='11 g', title='Ballaststoffe – mit Vollkornpasta und Walnüssen. *Für 4 Personen.*', size=72, dur=3.0),
   dict(t='end', title='Speichern für\nden *Feierabend.*', sub='Rezept in der Caption.', size=110, dur=2.4)],
  'Samtige Kürbissauce, knuspriger Salbei – Herbst auf der Gabel 🎃',
  'Pro Portion rund 11 g Ballaststoffe und 23 g Eiweiß, ohne Zuckerzusatz.\n\n📌 Speichern für den Feierabend.',
  '#Kürbispasta #Kürbisrezepte #Herbstrezepte #EchtesEssen #WellANNI',
  'Reel: Schale Pasta mit cremiger orangefarbener Kürbissauce, knusprigem Salbei und Parmesan. Text: Herbst auf der Gabel, 3 Kniffe, 11 g Ballaststoffe.'),

# ───────────── Mi 4.11. ─────────────
dict(id='w2-03_reel_glas-wasser', folder='03_Mi-04-11', fmt='reel', day='Mi 4.11.', time='08:00', serie='Morgenroutine',
  title='Reel: Morgenroutine – erst ein Glas Wasser', link='https://wellanni.de/clean-girl-morgenroutine.html',
  slides=[
    dict(t='photo', photo='w2_05_glas-wasser.jpg', pos=POS, kicker='Morgenroutine', title='Bevor der Kaffee\n*kommt …*', size=88, dur=2.6),
    dict(t='big', kicker='… ein Glas Wasser', big='8 Std.', bigsize=150, title='hast du über Nacht *nichts getrunken.* Ein großes Glas am Morgen ist der einfachste Start in den Tag.', size=64, dur=3.6),
    dict(t='list', kicker='So klappt’s', title='Leichter\n*gemacht*', size=100, items=[
        ('Abends bereitstellen', 'Glas und Karaffe neben den Wasserkocher'),
        ('Geschmack dazu', 'Zitrone, Ingwer oder Minze'),
        ('Erst trinken', 'dann aufs Handy schauen')], dur=4.4),
    dict(t='end', title='Morgen\n*ausprobieren?*', sub='Speichern als Erinnerung. 💧', size=110, dur=2.4),
  ],
  caption="""Bevor der Kaffee kommt: ein großes Glas Wasser 💧

Über Nacht trinkst du rund 8 Stunden nichts. Ein Glas direkt nach dem Aufstehen ist der einfachste Start in den Tag – kein Aufwand, kein Kauf, keine App.

So wird's zur Gewohnheit:
→ Abends Glas und Karaffe bereitstellen
→ Mit Zitrone, Ingwer oder Minze schmeckt's besser
→ Erst trinken, dann aufs Handy schauen

Und danach? Kaffee oder Tee in Ruhe genießen ☕

📌 Speichern als Erinnerung für morgen früh.
Was trinkst du als Erstes am Morgen? 👇

#Morgenroutine #GesundeGewohnheiten #Wohlbefinden #Selbstfürsorge #WellANNI""" + KI,
  alt='Reel: Hand greift nach einem Glas Wasser mit Zitronenscheibe auf einer hellen Küchenarbeitsplatte. Text: Bevor der Kaffee kommt, ein Glas Wasser.',
  note='Nach dem Veröffentlichen in der App das KI-Label setzen.'),

dict(id='w2-03_post_wechseljahre-schlaf', folder='03_Mi-04-11', fmt='post', day='Mi 4.11.', time='12:00', serie='Wechseljahre',
  title='Karussell: Wechseljahre – besser schlafen', link='https://wellanni.de/wechseljahre.html',
  slides=[
    dict(t='cover', kicker='Wechseljahre', title='Besser\nschlafen in den\n*Wechseljahren.*', size=112, sub='Was am Abend und auf dem Teller helfen kann.'),
    dict(t='list', kicker='Am Abend', title='Ruhe *einladen*', items=[
        ('Kühl schlafen', '16–18 °C, leichte Decke gegen Hitzewallungen'),
        ('Feste Zeiten', 'auch am Wochenende ähnlich ins Bett'),
        ('Früher und leichter essen', '2–3 Stunden vor dem Schlafen'),
        ('Koffein bis mittags', 'Alkohol am Abend lieber weglassen')]),
    dict(t='list', kicker='Auf dem Teller', title='Gut mit\n*Magnesium* versorgt', items=[
        ('Kürbiskerne', 'eine Handvoll als Snack'),
        ('Haferflocken & Vollkorn', 'zum Frühstück und Abendbrot'),
        ('Hülsenfrüchte', 'Linsen, Bohnen, Kichererbsen'),
        ('Nüsse', 'Walnüsse, Mandeln, Cashews')]),
    dict(t='big', kicker='Ehrlich gesagt', big='Kein\nWundermittel.', bigsize=110, title='Ob Magnesium beim Einschlafen hilft, ist *nicht belegt*. Gut versorgt zu sein lohnt sich trotzdem – über den ganzen Tag.', size=56,
         foot='Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.\\*'),
    dict(t='end', title='Was hilft dir\nbeim *Einschlafen?*', size=100, sub='Bei anhaltenden Schlafproblemen: ärztlich abklären lassen.', foot=DS),
  ],
  caption="""Besser schlafen in den Wechseljahren 🌙

Hitzewallungen, Grübeln, um 3 Uhr wach – Schlaf wird in dieser Phase oft schwieriger. Was am Abend helfen kann:

→ Kühl schlafen: 16–18 °C und eine leichte Decke
→ Feste Zeiten, auch am Wochenende
→ Früher und leichter essen, 2–3 Stunden vor dem Schlafen
→ Koffein nur bis mittags, Alkohol am Abend lieber weglassen

Und auf dem Teller? Kürbiskerne, Haferflocken, Vollkorn, Hülsenfrüchte und Nüsse liefern Magnesium. Ein Wundermittel fürs Einschlafen ist es nicht – gut versorgt zu sein lohnt sich trotzdem.

Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.*
*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung. Bei anhaltenden Schlafproblemen bitte ärztlich abklären lassen.

Was hilft dir beim Einschlafen? 👇

📌 Speichern und an die Freundin schicken, die gerade schlecht schläft.

#Wechseljahre #Menopause #BesserSchlafen #Frauengesundheit #WellANNI""",
  alt='5 Folien: Besser schlafen in den Wechseljahren. Kühl schlafen, feste Zeiten, früher essen, Koffein nur bis mittags. Magnesium aus Kürbiskernen, Haferflocken, Hülsenfrüchten und Nüssen.',
  note=''),

reel('w2-03_reel_lachs-spinat', '03_Mi-04-11', 'Mi 4.11.', '18:00', 'Echtes Essen',
  'Reel: Lachs auf Spinat – 20 Minuten, 35 g Eiweiß', 'lachsfilet_spinat', 'w2_06_lachs-spinat.jpg',
  [dict(t='photo', kicker='Feierabend in 20 Minuten', title='Knusprige Haut.\n*Zarter Spinat.*', size=84, dur=2.6),
   dict(t='list', kicker='Der Trick', title='Lachs *nicht*\nbewegen', size=96, items=[
       ('Hautseite zuerst', '5 Min. bei mittlerer Hitze liegen lassen'),
       ('Wenden, 2–3 Min.', 'dann herausnehmen'),
       ('Spinat ins Bratfett', 'mit Knoblauch und Zitrone')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='35 g', title='Eiweiß aus *echtem Fisch* – und fetter Seefisch gehört zu den besten Vitamin-D-Quellen.', size=66, dur=3.4),
   dict(t='end', title='Speichern für\n*heute Abend.*', sub='Rezept mit Nährwerten auf wellanni.de', size=110, dur=2.4)],
  'Knusprige Lachshaut auf Knoblauchspinat – fertig in 20 Minuten 🐟',
  'Pro Portion rund 35 g Eiweiß. Der Trick: Den Lachs auf der Hautseite 5 Minuten in Ruhe lassen, dann wird sie knusprig.\n\n📌 Speichern für heute Abend.',
  '#Lachs #SchnellesAbendessen #LowCarb #EiweißOhnePulver #WellANNI',
  'Reel: Gebratenes Lachsfilet mit knuspriger Haut auf Spinat mit Pinienkernen und Zitrone. Text: Knusprige Haut, zarter Spinat, 35 g Eiweiß.',
  link='https://wellanni.de/rezept-lachs-auf-spinatbett.html'),

# ───────────── Do 5.11. ─────────────
reel('w2-04_reel_gebackene-eier', '04_Do-05-11', 'Do 5.11.', '08:00', 'Echtes Essen',
  'Reel: Gebackene Eier mit Spinat und Feta', 'gebackene_eier_spinat_feta', 'w2_07_gebackene-eier.jpg',
  [dict(t='photo', kicker='Frühstück aus dem Ofen', title='Spinat, Ei, Feta.\n*Fertig.*', size=88, dur=2.6),
   dict(t='list', kicker='So geht’s', title='Ofen an,\n*Füße hoch*', size=96, items=[
       ('Spinat zusammenfallen lassen', 'mit Knoblauch, in kleine Formen'),
       ('Mulden, Eier, Feta', 'je zwei Eier pro Form'),
       ('10–12 Min. bei 200 °C', 'bis das Eiweiß gestockt ist')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='21 g', title='Eiweiß bei nur *272 kcal* – sättigt bis mittags.', size=76, dur=3.0),
   dict(t='end', title='Speichern für\n*Sonntag früh.*', sub='Rezept in der Caption.', size=110, dur=2.4)],
  'Gebackene Eier auf Knoblauchspinat mit Feta – das Ofen-Frühstück 🥚',
  'Pro Portion rund 21 g Eiweiß bei 272 kcal. Während der Ofen arbeitet, hast du Zeit für einen Kaffee.\n\n📌 Speichern für Sonntag früh.',
  '#Ofeneier #GesundesFrühstück #LowCarb #EiweißOhnePulver #WellANNI',
  'Reel: Kleine Auflaufform mit gebackenen Eiern auf Spinat, Feta und Chiliflocken. Text: Spinat, Ei, Feta, fertig. 21 g Eiweiß pro Portion.'),

dict(id='w2-04_post_haut-winter', folder='04_Do-05-11', fmt='post', day='Do 5.11.', time='12:00', serie='Herbst & Winter',
  title='Karussell: Haut im Winter – von innen pflegen', link='https://wellanni.de/herbst-winter-immunsystem.html',
  slides=[
    dict(t='cover', kicker='Herbst & Winter', title='Haut im Winter:\n*von innen*\npflegen.', size=116, sub='Heizungsluft, Kälte, wenig Licht – das hilft.'),
    dict(t='list', kicker='4 Gewohnheiten', title='Was deiner Haut\njetzt *guttut*', items=[
        ('Über den Tag trinken', 'Heizungsluft ist trocken'),
        ('Gute Fette', 'Lachs, Walnüsse, Leinöl, Avocado'),
        ('Orangefarbenes Gemüse', 'Karotte, Kürbis, Süßkartoffel'),
        ('Lauwarm statt heiß duschen', 'und danach eincremen')]),
    dict(t='big', kicker='Karotte & Kürbis', big='Beta-\nCarotin', bigsize=130, title='macht der Körper zu *Vitamin A*. Am besten mit etwas Öl essen – so wird es besser aufgenommen.', size=56,
         foot='Vitamin A trägt zur Erhaltung normaler Haut bei.\\*'),
    dict(t='list', kicker='Rezept-Ideen', title='Diese Woche\n*auf dem Teller*', items=[
        ('Kürbis-Pasta mit Salbei', 'Dienstag im Feed'),
        ('Lachs auf Spinat', 'Mittwoch im Feed'),
        ('Buddha-Bowl mit Süßkartoffel', 'heute Abend um 18 Uhr')]),
    dict(t='end', title='Speichern für\n*graue Tage.*', size=104, sub='Was ist dein Winter-Tipp für die Haut? 👇', foot=DS),
  ],
  caption="""Haut im Winter: von innen pflegen 🧡

Heizungsluft, Kälte und wenig Licht – im Winter spannt die Haut schneller. Neben der Creme hilft auch der Teller:

→ Über den Tag trinken, Heizungsluft ist trocken
→ Gute Fette: Lachs, Walnüsse, Leinöl, Avocado
→ Orangefarbenes Gemüse: Karotte, Kürbis, Süßkartoffel. Ihr Beta-Carotin macht der Körper zu Vitamin A – am besten mit etwas Öl essen
→ Lauwarm statt heiß duschen und danach eincremen

Vitamin A trägt zur Erhaltung normaler Haut bei.*
*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.

Was ist dein Winter-Tipp für die Haut? 👇

📌 Speichern für graue Tage.

#HautImWinter #SchönheitVonInnen #Hautpflege #EchtesEssen #WellANNI""",
  alt='5 Folien: Haut im Winter von innen pflegen. Trinken, gute Fette, orangefarbenes Gemüse mit Beta-Carotin, lauwarm duschen. Rezept-Ideen: Kürbis-Pasta, Lachs auf Spinat, Buddha-Bowl.',
  note=''),

reel('w2-04_reel_buddha-bowl', '04_Do-05-11', 'Do 5.11.', '18:00', 'Echtes Essen',
  'Reel: Buddha-Bowl – bunt essen, satt werden', 'buddha_bowl_kichererbsen_tahini', 'w2_08_buddha-bowl.jpg',
  [dict(t='photo', kicker='Vegan · für 2', title='Bunt essen.\n*Satt werden.*', size=92, dur=2.6),
   dict(t='list', kicker='Der Baukasten', title='*4* Bausteine', size=100, items=[
       ('Basis', 'Quinoa oder Bulgur'),
       ('Aus dem Ofen', 'Süßkartoffel und Kichererbsen, 25 Min.'),
       ('Frisch', 'Rotkohl, Spinat, Avocado'),
       ('Sauce', 'Tahin, Zitrone, Wasser')], gap=16, dur=4.8),
   dict(t='big', kicker='Pro Portion', big='25 g', title='Ballaststoffe und *23 g Eiweiß* – rein pflanzlich.', size=76, dur=3.0),
   dict(t='end', title='Speichern für\n*Meal Prep.*', sub='Was kommt bei dir in die Bowl? 👇', size=110, dur=2.4)],
  'Bunt wie ein Regenbogen, mit nussiger Tahin-Sauce – die Bowl, die wirklich satt macht 🥗',
  'Pro Portion rund 25 g Ballaststoffe und 23 g Eiweiß, rein pflanzlich und ohne Zuckerzusatz. Hält sich in Dosen 2 Tage im Kühlschrank – Sauce extra.\n\n📌 Speichern für Meal Prep.\nWas kommt bei dir in die Bowl? 👇',
  '#BuddhaBowl #VeganeRezepte #MealPrep #EchtesEssen #WellANNI',
  'Reel: Bunte Buddha-Bowl mit Quinoa, Süßkartoffel, Kichererbsen, Rotkohl, Spinat und Avocado, mit Tahin-Sauce. Text: Bunt essen, satt werden, 25 g Ballaststoffe.'),

# ───────────── Fr 6.11. ─────────────
reel('w2-05_reel_champignon-ruehrei', '05_Fr-06-11', 'Fr 6.11.', '08:00', 'Echtes Essen',
  'Reel: Champignon-Rührei – Pilze zuerst', 'champignon_ruehrei', 'w2_09_champignon-ruehrei.jpg',
  [dict(t='photo', kicker='Frühstück in 13 Minuten', title='Pilze zuerst.\n*Dann die Eier.*', size=88, dur=2.6),
   dict(t='list', kicker='Richtig gemacht', title='So werden\nPilze *goldbraun*', size=96, items=[
       ('Starke Hitze', 'Pfanne richtig heiß werden lassen'),
       ('Nicht zu viel rühren', '4 Min., dann sind sie goldbraun'),
       ('Eier bei kleiner Hitze', 'große, saftige Flocken ziehen')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='22 g', title='Eiweiß und *6 g Ballaststoffe* – mit einer Scheibe Vollkornbrot.', size=72, dur=3.0),
   dict(t='end', title='Speichern für\n*morgen früh.*', sub='Rezept in der Caption.', size=110, dur=2.4)],
  'Goldbraune Pilze und cremiges Rührei – ein Klassiker, richtig gemacht 🍄',
  'Pro Portion rund 22 g Eiweiß und 6 g Ballaststoffe. Wichtig: Die Pilze bei starker Hitze braten und nicht ständig rühren, sonst ziehen sie Wasser.\n\n📌 Speichern für morgen früh.',
  '#Rührei #Pilze #GesundesFrühstück #EiweißOhnePulver #WellANNI',
  'Reel: Rührei mit gebratenen Champignons und Schnittlauch auf Vollkornbrot. Text: Pilze zuerst, dann die Eier. 22 g Eiweiß.'),

dict(id='w2-05_post_ballaststoffe', folder='05_Fr-06-11', fmt='post', day='Fr 6.11.', time='12:00', serie='Echtes Essen',
  title='Karussell: Ballaststoffe – so kommst du auf 30 g', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Echtes Essen', title='Ballaststoffe:\nso kommst du\nauf *30 g.*', size=116, sub='Ohne Pulver, ohne Kapseln.'),
    dict(t='big', kicker='Die Empfehlung', big='30 g', title='Ballaststoffe am Tag empfiehlt die DGE für Erwachsene. Die meisten essen *deutlich weniger.*', foot='Quelle: Deutsche Gesellschaft für Ernährung (DGE)'),
    dict(t='list', kicker='Warum sie gut vorhalten', title='Mehr Kauen,\n*mehr Teller*', items=[
        ('Mehr Volumen', 'Gemüse und Vollkorn füllen den Teller'),
        ('Mehr Kauen', 'du isst automatisch langsamer'),
        ('Länger gut versorgt', 'statt Heißhunger am Nachmittag')]),
    dict(t='list', kicker='Ein Beispieltag', title='So einfach\nsind es *30 g*', items=[
        ('Haferflocken, 50 g', 'rund 5 g'),
        ('2 Scheiben Vollkornbrot', 'rund 7 g'),
        ('Linsen-Dal, 1 Portion', 'rund 12 g'),
        ('1 Apfel + 1 Handvoll Nüsse', 'rund 5 g')], gap=16),
    dict(t='end', title='Langsam\n*steigern.*', size=110, sub='Und genug dazu trinken – dann klappt es auch mit dem Bauch.'),
  ],
  caption="""Ballaststoffe: so kommst du auf 30 g 🌾

Die DGE empfiehlt Erwachsenen mindestens 30 g Ballaststoffe am Tag. Die meisten von uns essen deutlich weniger.

Warum ballaststoffreiche Mahlzeiten gut vorhalten:
→ Mehr Volumen auf dem Teller
→ Mehr Kauen, du isst automatisch langsamer
→ Weniger Heißhunger am Nachmittag

Ein Beispieltag:
• 50 g Haferflocken – rund 5 g
• 2 Scheiben Vollkornbrot – rund 7 g
• 1 Portion Linsen-Dal – rund 12 g
• 1 Apfel und 1 Handvoll Nüsse – rund 5 g

Tipp: Langsam steigern und genug trinken, dann macht der Bauch gut mit.

📌 Speichern für deinen nächsten Einkauf.

Quelle: Deutsche Gesellschaft für Ernährung (DGE).

#Ballaststoffe #Vollkorn #Hülsenfrüchte #EchtesEssen #WellANNI""",
  alt='5 Folien: Ballaststoffe, so kommst du auf 30 g. Die DGE empfiehlt 30 g am Tag. Beispieltag: Haferflocken, Vollkornbrot, Linsen-Dal, Apfel und Nüsse.',
  note=''),

reel('w2-05_reel_haehnchen-blech', '05_Fr-06-11', 'Fr 6.11.', '18:00', 'Herbst & Winter',
  'Reel: Hähnchen vom Blech – ein Blech, alle satt', 'haehnchenschenkel_wurzelgemuese', 'w2_10_haehnchen-blech.jpg',
  [dict(t='photo', kicker='Freitagabend', title='Ein Blech.\n*Alle satt.*', size=96, dur=2.6),
   dict(t='list', kicker='So einfach', title='Der Ofen\n*macht’s*', size=100, items=[
       ('Wurzelgemüse in Spalten', 'Kartoffel, Karotte, Pastinake, Zwiebel'),
       ('Hähnchen obendrauf', 'Hautseite nach oben'),
       ('40–45 Min. bei 200 °C', 'Gemüse gart im Bratensaft')], dur=4.4),
   dict(t='big', kicker='Pro Portion', big='35 g', title='Eiweiß – und nur *ein Blech* zum Abwaschen.', size=76, dur=3.0),
   dict(t='end', title='Speichern fürs\n*Wochenende.*', sub='Rezept in der Caption.', size=110, dur=2.4)],
  'Knusprige Haut, Gemüse im Bratensaft – Sonntagsbraten ohne Aufwand 🍗',
  'Pro Portion rund 35 g Eiweiß. Alles kommt auf ein Blech, der Ofen macht den Rest – Zeit für den Tisch und die Leute daran.\n\n📌 Speichern fürs Wochenende.',
  '#Ofengericht #Blechgericht #Familienessen #Herbstrezepte #WellANNI',
  'Reel: Backblech mit goldbraunen Hähnchenschenkeln, Kartoffeln, Karotten, Pastinaken und roten Zwiebeln. Text: Ein Blech, alle satt, 35 g Eiweiß.'),

# ───────────── Sa 7.11. ─────────────
dict(id='w2-06_reel_abendritual', folder='06_Sa-07-11', fmt='reel', day='Sa 7.11.', time='08:00', serie='Wechseljahre',
  title='Reel: Dein Abendritual für besseren Schlaf', link='https://wellanni.de/wechseljahre.html',
  slides=[
    dict(t='photo', photo='w2_11_abendritual.jpg', pos='center 80%', kicker='Für heute Abend', title='Runterfahren.\n*Mit Absicht.*', size=88, dur=2.6),
    dict(t='list', kicker='Dein Abendritual', title='*4* kleine Dinge', size=100, items=[
        ('Kräutertee statt Wein', 'Melisse, Kamille oder Fenchel'),
        ('Buch statt Bildschirm', 'die letzte halbe Stunde'),
        ('Kühl schlafen', '16–18 °C im Schlafzimmer'),
        ('Kleiner Snack, wenn nötig', 'ein paar Nüsse und Kürbiskerne')], gap=16, dur=5.0),
    dict(t='big', kicker='Gerade in den Wechseljahren', big='Ruhe\nist Pflege.', bigsize=120, title='Feste Rituale helfen dem Körper, *abends abzuschalten.*', size=68, dur=3.0),
    dict(t='end', title='Was ist dein\n*Abendritual?*', sub='Speichern für heute Abend. 🌙', size=110, dur=2.4),
  ],
  caption="""Runterfahren – mit Absicht 🌙

Gerade in den Wechseljahren wird Schlaf oft schwieriger. Ein festes Abendritual hilft dem Körper, abzuschalten:

→ Kräutertee statt Wein – Melisse, Kamille oder Fenchel
→ Buch statt Bildschirm in der letzten halben Stunde
→ Kühl schlafen: 16–18 °C im Schlafzimmer
→ Wenn der Magen knurrt: ein paar Nüsse und Kürbiskerne

Was ist dein Abendritual? 👇

📌 Speichern für heute Abend.

Bei anhaltenden Schlafproblemen bitte ärztlich abklären lassen.

#Wechseljahre #Abendroutine #BesserSchlafen #Selbstfürsorge #WellANNI""" + KI,
  alt='Reel: Nachttisch mit Tasse Kräutertee, aufgeschlagenem Buch, Brille und einer Schale Nüsse im warmen Lampenlicht. Text: Runterfahren mit Absicht, 4 kleine Dinge.',
  note='Nach dem Veröffentlichen in der App das KI-Label setzen.'),

dict(id='w2-06_post_gemeinsam-essen', folder='06_Sa-07-11', fmt='post', day='Sa 7.11.', time='12:00', serie='Echtes Essen',
  title='Karussell: Gemeinsam essen tut gut', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Am Tisch', title='Gemeinsam\nessen\n*tut gut.*', size=124, sub='Warum der Tisch wichtiger ist als das perfekte Rezept.'),
    dict(t='list', kicker='Was am Tisch passiert', title='Mehr als\n*nur essen*', items=[
        ('Man isst langsamer', 'und merkt eher, wann man satt ist'),
        ('Kinder probieren mehr', 'wenn die Großen mitessen'),
        ('Gespräche statt Bildschirm', 'der Tag bekommt eine Pause'),
        ('Genuss teilen', 'schmeckt einfach besser')]),
    dict(t='big', kicker='Klein anfangen', big='1× pro\nWoche', bigsize=130, title='ein fester Tisch-Termin mit Familie, Freundinnen oder Nachbarn. *Mehr braucht es nicht.*', size=60),
    dict(t='list', kicker='Ideen fürs Wochenende', title='Einfach\n*einladen*', items=[
        ('Suppen-Abend', 'ein großer Topf, jeder bringt Brot mit'),
        ('Sonntagsfrühstück', 'Shakshuka in der Pfanne auf den Tisch'),
        ('Ofenäpfel zum Kaffee', 'morgen früh im Feed')]),
    dict(t='end', title='Mit wem isst du\n*am liebsten?*', size=100, sub='Markier die Person 👇'),
  ],
  caption="""Gemeinsam essen tut gut 🤍

Das perfekte Rezept ist nicht so wichtig wie der Tisch, an dem es gegessen wird. Wenn wir zusammen essen:

→ essen wir langsamer und merken eher, wann wir satt sind
→ probieren Kinder mehr, wenn die Großen mitessen
→ gibt es Gespräche statt Bildschirm
→ schmeckt Genuss einfach besser

Klein anfangen: einmal pro Woche ein fester Tisch-Termin mit Familie, Freundinnen oder Nachbarn.

Ideen fürs Wochenende: ein Suppen-Abend, ein Sonntagsfrühstück mit Shakshuka oder Ofenäpfel zum Kaffee.

Mit wem isst du am liebsten? Markier die Person 👇

#GemeinsamEssen #Familienessen #Genuss #EchtesEssen #WellANNI""",
  alt='5 Folien: Gemeinsam essen tut gut. Man isst langsamer, Kinder probieren mehr, Gespräche statt Bildschirm. Einmal pro Woche ein fester Tisch-Termin. Ideen: Suppen-Abend, Sonntagsfrühstück, Ofenäpfel.',
  note=''),

reel('w2-06_reel_fischsuppe', '06_Sa-07-11', 'Sa 7.11.', '18:00', 'Herbst & Winter',
  'Reel: Fischsuppe mit Kabeljau und Fenchel', 'fischsuppe_kabeljau_fenchel', 'w2_12_fischsuppe.jpg',
  [dict(t='photo', kicker='Für 4 · 40 Minuten', title='Wie am Meer.\n*Nur bei dir.*', size=92, dur=2.6),
   dict(t='big', kicker='Der wichtigste Schritt', big='Nicht\nkochen.', bigsize=130, title='Den Fisch zum Schluss 5–6 Minuten nur *garziehen lassen* – sonst zerfällt er.', size=68, dur=3.6),
   dict(t='big', kicker='Pro Portion', big='28 g', title='Eiweiß bei nur *274 kcal*. Mit Fenchel, Tomate und einem Hauch Orange.', size=68, dur=3.2),
   dict(t='end', title='Speichern für\nden *Suppen-Abend.*', sub='Rezept in der Caption.', size=104, dur=2.4)],
  'Zarter Kabeljau, Fenchel und ein Hauch Orange – Fischsuppe wie an der Küste 🐟',
  'Pro Portion rund 28 g Eiweiß bei 274 kcal. Perfekt für einen Suppen-Abend mit Freunden: großer Topf in die Mitte, Brot dazu, fertig.\n\n📌 Speichern für den Suppen-Abend.',
  '#Fischsuppe #Kabeljau #Suppenzeit #GemeinsamEssen #WellANNI',
  'Reel: Tiefe Schale mediterrane Fischsuppe mit Kabeljau, Fenchel, Kartoffeln und Dill, daneben Brot. Text: Wie am Meer, nicht kochen, 28 g Eiweiß.'),

# ───────────── So 8.11. ─────────────
reel('w2-07_reel_ofenaepfel', '07_So-08-11', 'So 8.11.', '08:00', 'Herbst & Winter',
  'Reel: Ofenäpfel am Sonntagstisch', 'ofenaepfel_hafer_nuss', 'w2_13_ofenaepfel.jpg',
  [dict(t='photo', kicker='Sonntag', title='Alle am Tisch.\n*Ofenäpfel.*', size=92, dur=2.6),
   dict(t='list', kicker='Die Füllung', title='Hafer, Nuss,\n*Zimt*', size=96, items=[
       ('Äpfel aushöhlen', 'z. B. Boskoop, Kerngehäuse raus'),
       ('Füllung verkneten', 'Haferflocken, Haselnüsse, Butter, Zimt'),
       ('25–30 Min. bei 180 °C', 'mit Joghurt servieren')], dur=4.4),
   dict(t='big', kicker='Süße vor allem vom Apfel', big='1 EL', bigsize=150, title='Honig für *4 Äpfel* – mehr braucht es nicht. Der Bratapfel-Duft macht den Rest.', size=64, dur=3.2),
   dict(t='end', title='Mit wem teilst\ndu *heute?*', sub='Speichern für den nächsten Sonntag. 🍎', size=110, dur=2.4)],
  'Der Duft von Bratapfel zieht durchs ganze Haus – und alle kommen an den Tisch 🍎',
  'Die Süße kommt vor allem vom Apfel: 1 EL Honig reicht für vier. Für kleine Kinder die Nüsse fein hacken.\n\n📌 Speichern für den nächsten Sonntag.\nMit wem teilst du heute? 👇',
  '#Bratapfel #Ofenäpfel #Sonntagsfrühstück #GemeinsamEssen #WellANNI',
  'Reel: Ofenäpfel mit Hafer-Nuss-Füllung in einer Keramikform, mehrere Hände greifen am Sonntagstisch zu, daneben Joghurt. Text: Alle am Tisch, Ofenäpfel, 1 EL Honig für 4 Äpfel.'),

dict(id='w2-07_post_wochenplan', folder='07_So-08-11', fmt='post', day='So 8.11.', time='12:00', serie='Echtes Essen',
  title='Karussell: Sonntag ist Wochenplan-Tag', link='',
  slides=[
    dict(t='cover', kicker='Sonntag', title='Sonntag ist\n*Wochenplan-*\nTag.', size=124, sub='15 Minuten, die dir die ganze Woche erleichtern.'),
    dict(t='list', kicker='In 4 Schritten', title='So planst du\n*entspannt*', items=[
        ('3 Abendessen festlegen', 'nicht 7 – der Rest bleibt flexibel'),
        ('Ein Gericht doppelt kochen', 'Reste = Mittagessen am nächsten Tag'),
        ('Einkaufsliste nach Abteilungen', 'Obst & Gemüse, Kühlregal, Vorrat'),
        ('Basics vorbereiten', 'Gemüse schneiden, Linsen oder Quinoa kochen')], gap=16),
    dict(t='big', kicker='Der Effekt', big='15 Min.', title='am Sonntag sparen dir unter der Woche *jeden Abend* die Frage: Was essen wir heute?', size=60),
    dict(t='list', kicker='Ideen aus dieser Woche', title='Gute\n*Wochen-Gerichte*', items=[
        ('Linsen-Dal', 'schmeckt am zweiten Tag noch besser'),
        ('Buddha-Bowl', 'perfekt für Meal Prep'),
        ('Hähnchen vom Blech', 'ein Blech, alle satt')]),
    dict(t='end', title='Planst du\n*schon?*', size=110, sub='Wochenplan und Einkaufsliste mit über 200 Rezepten: WellANNI-App, Link in Bio.'),
  ],
  caption="""Sonntag ist Wochenplan-Tag 🗓️

15 Minuten heute – und unter der Woche fällt die Frage „Was essen wir heute?“ weg.

So geht's:
1️⃣ 3 Abendessen festlegen, nicht 7. Der Rest bleibt flexibel.
2️⃣ Ein Gericht doppelt kochen – die Reste sind das Mittagessen am nächsten Tag.
3️⃣ Einkaufsliste nach Abteilungen sortieren: Obst & Gemüse, Kühlregal, Vorrat.
4️⃣ Basics vorbereiten: Gemüse schneiden, Linsen oder Quinoa vorkochen.

Gute Wochen-Gerichte aus dieser Woche: Linsen-Dal, Buddha-Bowl, Hähnchen vom Blech.

Planst du schon oder kochst du spontan? 👇

""" + APP + """

#Wochenplan #MealPrep #Essensplanung #EchtesEssen #WellANNI""",
  alt='5 Folien: Sonntag ist Wochenplan-Tag. 3 Abendessen festlegen, ein Gericht doppelt kochen, Einkaufsliste nach Abteilungen, Basics vorbereiten. 15 Minuten sparen die Frage, was es heute gibt.',
  note=''),

reel('w2-07_reel_linsensuppe', '07_So-08-11', 'So 8.11.', '18:00', 'Echtes Essen',
  'Reel: Rote Linsensuppe mit Zitrone', 'linsensuppe_zitrone', 'w2_14_linsensuppe.jpg',
  [dict(t='photo', kicker='Vegan · für 4', title='Samtig.\n*Mit Zitrone.*', size=96, dur=2.6),
   dict(t='list', kicker='So geht’s', title='In *35* Minuten', size=100, items=[
       ('Gemüse anschwitzen', 'Zwiebel, Karotte, Knoblauch'),
       ('Kreuzkümmel & Tomatenmark', '1 Minute mitrösten'),
       ('Linsen und Brühe', '20 Min. köcheln, grob pürieren')], dur=4.2),
   dict(t='big', kicker='Pro Portion', big='12 g', title='Ballaststoffe und *21 g Eiweiß* – aus roten Linsen, ganz pflanzlich.', size=72, dur=3.2),
   dict(t='end', title='Speichern für\n*Montag.*', sub='Zitrone erst zum Schluss – das ist der Trick. 🍋', size=110, dur=2.4)],
  'Samtige rote Linsen, Kreuzkümmel und ein kräftiger Spritzer Zitrone 🍋',
  'Pro Portion rund 12 g Ballaststoffe und 21 g Eiweiß, vegan und ohne Zuckerzusatz. Die Zitrone erst zum Schluss dazu – dann bleibt sie frisch.\n\n📌 Speichern für Montag.',
  '#Linsensuppe #VeganeRezepte #Suppenzeit #EchtesEssen #WellANNI',
  'Reel: Rustikale Schale rote Linsensuppe mit Joghurt, Petersilie und Zitronenspalte. Text: Samtig mit Zitrone, 12 g Ballaststoffe, 21 g Eiweiß.',
  link='https://wellanni.de/rezept-rote-linsensuppe.html'),
]
