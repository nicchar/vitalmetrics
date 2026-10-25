# Instagram Woche 1: Mo 26.10. – So 1.11.2026
# Pro Tag: 1 Reel (18 Uhr), 1 Post (12 Uhr), 1 Story (abends bzw. wie angegeben)

DISCLAIMER = '*EU-zugelassene gesundheitsbezogene Angabe. WellANNI ist kein Medizinprodukt und ersetzt keine ärztliche Beratung.'
DS = DISCLAIMER.replace('*', '\\*')
APP = 'Über 200 Rezepte mit Wochenplan und Einkaufsliste: WellANNI-App, Link in Bio.'

POSTS = [
# ───────────── Mo 26.10. ─────────────
dict(id='01_post_echtes-essen', folder='01_Mo-26-10', fmt='post', day='Mo 26.10.', time='12:00', serie='Echtes Essen',
  title='Das ist WellANNI: Echtes Essen (Vorstellung)', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Neu hier', title='Echtes Essen.\n*Mit Genuss.*', sub='Kein Pulver, kein Süßstoff, kein Kalorienzählen. Was wir stattdessen machen:'),
    dict(t='list', kicker='Unsere Haltung', title='Das Gesunde\nzurück auf den *Tisch*', items=[
        ('Eiweiß ohne Pulver', 'Quark, Linsen, Eier, Fisch – genug Eiweiß aus echten Lebensmitteln.'),
        ('Süße aus Obst', 'Banane, Datteln, Apfel und Zimt statt Süßstoff.'),
        ('Freude am Kochen', 'Einfache Rezepte, die schmecken und satt machen.'),
        ('Wieder spüren, wann du satt bist', 'Langsamer essen, Durst und Hunger unterscheiden.')]),
    dict(t='list', kicker='Was dich hier erwartet', title='Jeden Tag *neu*', items=[
        ('Rezepte', 'Schnell, saisonal und mit Nährwerten.'),
        ('Wissen vom Teller', 'Vitamin D, Eisen, Eiweiß – verständlich und ohne Panik.'),
        ('Wechseljahre & Morgenroutine', 'Was in dieser Phase auf den Teller gehört.')]),
    dict(t='end', title='Folg uns für\n*echtes Essen.*', sub='Und schick den Post an die Freundin, die immer fragt: „Was essen wir heute?“', hint='wellanni.de'),
  ],
  caption="""Echtes Essen. Mit Genuss. 🌿

Immer mehr Rezepte brauchen Proteinpulver, Süßstoff oder eine Kalorien-App. Wir finden: Das Gesunde gehört wieder auf den Tisch.

Hier bei WellANNI bekommst du:
→ Eiweiß aus Lebensmitteln statt aus der Dose
→ Süße aus Obst statt aus Zucker oder Süßstoff
→ Rezepte, die schmecken und satt machen
→ Wissen vom Teller: Vitamin D, Eisen, Eiweiß, Wechseljahre – verständlich und ohne Panik

Was kochst du diese Woche? Schreib's in die Kommentare 👇

📌 Speichern und folgen, jeden Tag kommt etwas Neues.

#EchtesEssen #GesundeErnährung #GesundeRezepte #OhneZucker #WellANNI""",
  alt='4 Folien im WellANNI-Design: Echtes Essen mit Genuss. Eiweiß ohne Pulver, Süße aus Obst, Freude am Kochen, wieder spüren, wann du satt bist.',
  note='Nach dem Posten oben im Profil anpinnen (… → „Im Profil fixieren“).'),

dict(id='01_reel_zeitumstellung', folder='01_Mo-26-10', fmt='reel', day='Mo 26.10.', time='18:00', serie='Herbst & Winter',
  title='Reel: Seit Sonntag um 17 Uhr dunkel – Vitamin D', link='https://wellanni.de/herbst-winter-immunsystem.html',
  slides=[
    dict(t='photo', photo='vitamin-d-fenster.jpg', photo_h=0.66, kicker='Zeitumstellung', title='Ab jetzt wird’s\num *17 Uhr* dunkel.', size=88, dur=2.6),
    dict(t='big', kicker='Gut zu wissen', big='Okt.–März', title='reicht die Sonne bei uns *nicht*, damit die Haut genug Vitamin D bildet.', size=76, dur=3.4),
    dict(t='list', kicker='Was du tun kannst', title='3 Dinge für die\n*dunkle Zeit*', size=100, items=[
        ('Raus ins Tageslicht', 'Jede Mittagspause zählt.'),
        ('Fetter Fisch 1–2× pro Woche', 'Hering, Lachs, Makrele. Dazu Eier und Pilze.'),
        ('Nicht auf eigene Faust hochdosieren', 'Erst den Wert kennen.')], dur=4.2),
    dict(t='end', title='Speichern\nfür den *Winter*.', sub='Und schick’s der Person, die ab Oktober nur noch friert.', size=110, dur=2.4),
  ],
  caption="""Seit Sonntag wird's um 17 Uhr dunkel 🌙

Von Oktober bis März reicht die Sonne in Deutschland nicht aus, damit die Haut genug Vitamin D bildet. Kein Grund zur Panik, aber ein guter Moment, kurz hinzuschauen.

3 Dinge für die dunkle Zeit:
1️⃣ Raus ins Tageslicht, wann immer es geht.
2️⃣ Fetter Seefisch 1–2× pro Woche: Hering, Lachs oder Makrele gehören zu den besten Quellen. Dazu Eier und Pilze.
3️⃣ Keine hochdosierten Präparate auf eigene Faust. Erst den eigenen Wert kennen und ärztlich abklären.

Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.*

📌 Speichern für den Winter.

Quellen: Verbraucherzentrale, DGE.
""" + DISCLAIMER + """

#VitaminD #Zeitumstellung #Wintergesundheit #GesundeErnährung #WellANNI""",
  alt='Reel: Frau mit Teetasse am Fenster. Text: Ab jetzt wird es um 17 Uhr dunkel. Von Oktober bis März reicht die Sonne nicht für genug Vitamin D. 3 Dinge: Tageslicht, fetter Fisch, nicht hochdosieren.',
  note='Musik: nur lizenzfreien Titel aus der Instagram-Auswahl oder ohne Musik.'),

dict(id='01_story_quiz-vitamin-d', folder='01_Mo-26-10', fmt='story', day='Mo 26.10.', time='abends', serie='Herbst & Winter',
  title='Story: Quiz Vitamin D', link='',
  slides=[dict(t='story', kicker='Quiz', title='Ab welchem Monat reicht die Sonne bei uns *nicht mehr* für Vitamin D?', size=84, foot='')],
  caption='', alt='',
  note='Quiz-Sticker unter die Frage setzen. Antworten: August · Oktober (richtig) · Dezember · Nie. Danach das Reel in die Story teilen.'),

# ───────────── Di 27.10. ─────────────
dict(id='02_post_vitamin-d-winter', folder='02_Di-27-10', fmt='post', day='Di 27.10.', time='12:00', serie='Herbst & Winter',
  title='Karussell: Vitamin D im Winter – 5 Fakten', link='https://wellanni.de/herbst-winter-immunsystem.html',
  slides=[
    dict(t='cover', kicker='Herbst & Winter', title='Vitamin D\nim Winter:\n*5 Fakten.*', sub='Ohne Panik, mit Quellen.'),
    dict(t='big', kicker='Fakt 1 · Sonne', big='Okt.–März', title='reicht die Sonne in Deutschland *nicht aus*, damit die Haut genug Vitamin D bildet.', foot='Quelle: Verbraucherzentrale'),
    dict(t='big', kicker='Fakt 2 · Speicher', big='Sommer-\nvorrat', bigsize=120, title='Der Körper speichert Vitamin D aus den sonnigen Monaten und überbrückt damit *einen Teil* des Winters.'),
    dict(t='big', kicker='Fakt 3 · Teller', big='2–4 µg', title='kommen über das Essen pro Tag rein. Der Referenzwert der DGE liegt bei *20 µg*, wenn die Haut selbst nichts bildet.', foot='Quellen: Verbraucherzentrale, DGE'),
    dict(t='list', kicker='Fakt 4 · Lebensmittel', title='Wo Vitamin D\n*trotzdem* steckt', items=[
        ('Fetter Seefisch', 'Hering, Lachs, Makrele – 1–2× pro Woche.'),
        ('Eier', 'Vor allem im Eigelb.'),
        ('Pilze', 'Champignons und Pfifferlinge, in kleinen Mengen.')]),
    dict(t='big', kicker='Fakt 5 · Vorsicht', big='Mehr ist\nnicht besser.', bigsize=110, title='Hochdosierte Präparate nicht auf eigene Faust. Erst den Wert kennen und *ärztlich abklären*.', foot='Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.\\* \n' + DS),
    dict(t='end', title='Speichern für\nden *Winter.*', sub='Und schick’s der Person, die ab Oktober nur noch friert.'),
  ],
  caption="""Vitamin D im Winter: 5 Fakten ☀️→🌙

Wisch dich durch. Das Wichtigste in Kürze:
→ Von Oktober bis März reicht die Sonne bei uns nicht für die Vitamin-D-Bildung in der Haut.
→ Über das Essen kommen etwa 2–4 µg pro Tag. Der Referenzwert der DGE liegt bei 20 µg, wenn die Haut selbst nichts bildet.
→ Gute Quellen: fetter Seefisch, Eier, Pilze.
→ Mehr ist nicht besser: Hochdosiertes nur nach ärztlicher Rücksprache.

Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.*

Welcher Fakt war neu für dich? Schreib die Nummer in die Kommentare 👇

📌 Speichern für später.

Quellen: Verbraucherzentrale, DGE.
""" + DISCLAIMER + """

#VitaminD #Wintergesundheit #Immunsystem #Ernährung #WellANNI""",
  alt='7 Folien zu Vitamin D im Winter: Von Oktober bis März reicht die Sonne nicht. Über das Essen kommen 2 bis 4 Mikrogramm am Tag, der Referenzwert liegt bei 20. Quellen sind fetter Fisch, Eier und Pilze. Hochdosiertes nur nach ärztlicher Rücksprache.',
  note='Nach dem Posten in die Story teilen.'),

dict(id='02_reel_rosenkohl', folder='02_Di-27-10', fmt='reel', day='Di 27.10.', time='18:00', serie='Echtes Essen',
  title='Reel: Rosenkohl, den alle mögen', link='https://wellanni.de/rezept-geroesteter-rosenkohl.html',
  slides=[
    dict(t='photo', photo='rezept-geroesteter-rosenkohl.jpg', photo_h=0.7, kicker='Für Rosenkohl-Hasser', title='Gib ihm noch\n*eine* Chance.', size=92, dur=2.6),
    dict(t='big', kicker='Der Trick', big='Schnitt-\nfläche\nnach unten.', bigsize=130, title='Halbieren, mit Öl und Salz mischen, bei *220 °C* 15 Minuten rösten.', size=72, dur=3.6),
    dict(t='big', kicker='Dann', big='Nüsse\nzum Schluss.', bigsize=130, title='Erst die letzten 5–7 Minuten drüber – sonst verbrennen sie. Ergebnis: *nussig statt bitter.*', size=72, dur=3.6),
    dict(t='end', title='Rezept in der\n*Caption.*', sub='Schick’s der Person, die Rosenkohl immer vom Teller schiebt.', size=110, dur=2.4),
  ],
  caption="""Gerösteter Rosenkohl mit Nüssen: für alle, die Rosenkohl eigentlich nicht mögen 💚

Der Trick: halbieren und mit der Schnittfläche nach unten rösten. So wird er karamellisiert und nussig statt bitter.

Für 2 Portionen:
• 400 g Rosenkohl
• 1 EL Olivenöl
• 30 g Haselnüsse oder Walnüsse
• 1 Spritzer Zitronensaft
• Salz, Pfeffer
• nach Wunsch 1 TL Honig

1. Ofen auf 220 °C vorheizen. Rosenkohl putzen und halbieren.
2. Mit Öl und Salz mischen, mit der Schnittfläche nach unten aufs Blech legen, 15 Minuten rösten.
3. Nüsse grob hacken, drüberstreuen und weitere 5–7 Minuten rösten.
4. Mit Zitrone (und nach Wunsch Honig) beträufeln.

Pro Portion rund 11 g Eiweiß und 10 g Ballaststoffe.

Liebe oder Hass: Wo stehst du? 👇

Das ganze Rezept mit Nährwerten: wellanni.de (Link in Bio).

#Rosenkohl #RosenkohlRezept #GesundeRezepte #Herbstrezepte #WellANNI""",
  alt='Reel: Gerösteter Rosenkohl mit Nüssen in einer Auflaufform. Text: Schnittfläche nach unten, bei 220 Grad rösten, Nüsse zum Schluss, nussig statt bitter.',
  note='Musik: nur lizenzfrei. Am Abend in die Story teilen mit „Hass-Fraktion, das ist für euch“.'),

dict(id='02_story_umfrage-rosenkohl', folder='02_Di-27-10', fmt='story', day='Di 27.10.', time='mittags', serie='Echtes Essen',
  title='Story: Umfrage Rosenkohl', link='',
  slides=[dict(t='story', kicker='Ehrlich jetzt', title='Rosenkohl:\n*Liebe* oder Hass?', size=110, sub='Heute um 18 Uhr gibt’s das Rezept, das alle umstimmt.')],
  caption='', alt='', note='Umfrage-Sticker unter den Text: „💚 Liebe“ / „🙅‍♀️ Hass“. Gestern Quiz-Auflösung: Oktober.'),

# ───────────── Mi 28.10. ─────────────
dict(id='03_post_eiweiss-ohne-pulver', folder='03_Mi-28-10', fmt='post', day='Mi 28.10.', time='12:00', serie='Echtes Essen',
  title='Karussell: Eiweiß ohne Pulver – 6 Lebensmittel', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Echtes Essen', title='Eiweiß\n*ohne Pulver.*', sub='6 Lebensmittel, mit denen du es ganz einfach schaffst.'),
    dict(t='big', kicker='Wie viel brauche ich?', big='0,8 g', title='Eiweiß pro Kilo Körpergewicht und Tag empfiehlt die DGE für die meisten Erwachsenen. Bei *65 kg* sind das rund *52 g*.', foot='Ab 65 Jahren: 1,0 g pro Kilo. Quelle: DGE'),
    dict(t='list', kicker='Teil 1', title='So viel steckt\n*drin*', items=[
        ('Magerquark · 150 g', '18 g Eiweiß'),
        ('Zwei Eier', '17 g Eiweiß'),
        ('Lachs · 125 g', '25 g Eiweiß – und Vitamin D')]),
    dict(t='list', kicker='Teil 2', title='Auch *pflanzlich*', items=[
        ('Tofu · 100 g', '16 g Eiweiß'),
        ('Linsen · 150 g gekocht', '14 g Eiweiß und 11 g Ballaststoffe'),
        ('Kichererbsen · 150 g gekocht', '13 g Eiweiß und 16 g Ballaststoffe')]),
    dict(t='big', kicker='Der Trick', big='Jede\nMahlzeit.', bigsize=130, title='Nicht alles auf einmal: In *jede* Mahlzeit ein bisschen Eiweiß – dann kommst du fast von allein hin.', foot='Eiweiß trägt zur Erhaltung von Muskelmasse bei.\\* \n' + DS),
    dict(t='end', title='Speichern\nfürs *Einkaufen.*', sub='Welches ist dein Lieblings-Eiweiß? 👇'),
  ],
  caption="""Eiweiß ohne Pulver: so einfach geht's 💪🌿

Die DGE empfiehlt für die meisten Erwachsenen 0,8 g Eiweiß pro Kilo Körpergewicht und Tag. Bei 65 kg sind das rund 52 g. Das schaffst du mit echtem Essen:

• Magerquark (150 g): 18 g
• 2 Eier: 17 g
• Lachs (125 g): 25 g
• Tofu (100 g): 16 g
• Linsen (150 g gekocht): 14 g
• Kichererbsen (150 g gekocht): 13 g

Der Trick: In jede Mahlzeit ein bisschen Eiweiß. Dann brauchst du kein Pulver.

Eiweiß trägt zur Erhaltung von Muskelmasse bei.*

Welches ist dein Lieblings-Eiweiß? 👇
📌 Speichern für den nächsten Einkauf.

Quelle: DGE. Nährwerte gerundet.
""" + DISCLAIMER + """

#EiweißOhnePulver #Proteinreich #EchtesEssen #GesundeErnährung #WellANNI""",
  alt='6 Folien: Eiweiß ohne Pulver. 0,8 Gramm pro Kilo empfiehlt die DGE. Magerquark 18 g, zwei Eier 17 g, Lachs 25 g, Tofu 16 g, Linsen 14 g, Kichererbsen 13 g. Trick: in jede Mahlzeit ein bisschen Eiweiß.',
  note=''),

dict(id='03_reel_skyr', folder='03_Mi-28-10', fmt='reel', day='Mi 28.10.', time='18:00', serie='Echtes Essen',
  title='Reel: Skyr mit Walnüssen und Zimt – 24 g Eiweiß in 3 Minuten', link='https://wellanni.de/rezept-skyr-walnuss-zimt.html',
  slides=[
    dict(t='photo', photo='rezept-skyr-walnuss-zimt.jpg', photo_h=0.7, kicker='Frühstück in 3 Minuten', title='*24 g Eiweiß.*\nOhne Pulver.', size=92, dur=2.6),
    dict(t='list', kicker='Du brauchst', title='Nur *3* Zutaten', size=100, items=[
        ('200 g Skyr', 'glatt rühren'),
        ('20 g Walnüsse', 'grob hacken, drüber'),
        ('½ TL Zimt', 'drüberstäuben – fertig')], dur=4.0),
    dict(t='big', kicker='Süßer?', big='Beeren\nstatt Zucker.', bigsize=120, title='Eine Handvoll Beeren oder ein geriebener Apfel – Zimt macht es *von allein* süßer.', size=72, dur=3.4),
    dict(t='end', title='Speichern\nfür *morgen früh.*', sub='Schick’s der Person, die morgens nie Zeit hat.', size=110, dur=2.4),
  ],
  caption="""Frühstück in 3 Minuten mit 24 g Eiweiß. Ohne Pulver. 🥣

Skyr mit Walnüssen und Zimt (1 Portion):
• 200 g Skyr
• 20 g Walnüsse
• ½ TL Zimt
• nach Wunsch: Beeren oder ein geriebener Apfel

Skyr glatt rühren, Walnüsse grob hacken und drüberstreuen, mit Zimt bestäuben. Fertig.

Süßer magst du's? Nimm Obst statt Zucker – Zimt lässt alles süßer schmecken, ohne dass Zucker dazukommt.

📌 Speichern für morgen früh.
Was frühstückst du gerade am liebsten? 👇

Rezept mit Nährwerten: wellanni.de (Link in Bio).

#ProteinFrühstück #Skyr #EiweißOhnePulver #SchnellesFrühstück #WellANNI""",
  alt='Reel: Schale Skyr mit Walnüssen und Zimt. Text: 24 g Eiweiß ohne Pulver, nur 3 Zutaten, Beeren statt Zucker.',
  note='Musik: nur lizenzfrei.'),

dict(id='03_story_quiz-ei', folder='03_Mi-28-10', fmt='story', day='Mi 28.10.', time='abends', serie='Echtes Essen',
  title='Story: Quiz Eiweiß im Ei', link='',
  slides=[dict(t='story', kicker='Quiz', title='Wie viel Eiweiß steckt in *einem* Ei?', size=110)],
  caption='', alt='', note='Quiz-Sticker: 2 g · 7 g (richtig, ein Ei Größe M) · 15 g. Danach das Reel in die Story teilen.'),

# ───────────── Do 29.10. ─────────────
dict(id='04_post_halloween-snacks', folder='04_Do-29-10', fmt='post', day='Do 29.10.', time='12:00', serie='Echtes Essen',
  title='Karussell: Gesunde Halloween-Snacks – 4 Ideen', link='https://wellanni.de/rezept-energy-balls.html',
  slides=[
    dict(t='cover', dark=True, kicker='Halloween · 31.10.', title='Gesunde\nHalloween-Snacks:\n*4 Ideen.*', sub='In 10 Minuten fertig. Süß durch Obst – ohne Zuckerberg.'),
    dict(t='big', dark=True, kicker='Idee 1', big='Mandarinen-\nKürbisse', bigsize=110, title='Mandarine schälen, ein kleines Stück *Staudensellerie* als Stiel reinstecken.', size=60),
    dict(t='big', dark=True, kicker='Idee 2', big='Bananen-\nGeister', bigsize=110, title='Banane halbieren, Augen und Mund aus *Rosinen* oder Schokodrops andrücken.', size=60),
    dict(t='big', dark=True, kicker='Idee 3', big='Apfel-\nMonstermäuler', bigsize=110, title='Apfelspalten mit *Erdnussmus* bestreichen, Mandelstifte als Zähne reinstecken.', size=60),
    dict(t='big', dark=True, kicker='Idee 4', big='Monster-\nBällchen', bigsize=110, title='Datteln, Haferflocken, Nüsse und Kakao mixen, Kugeln formen. *Ohne Backen.* Rezept morgen im Reel.', size=60),
    dict(t='end', dark=True, title='Speichern\nfür *Samstag.*', sub='Welche Idee machst du? Schreib die Nummer in die Kommentare.'),
  ],
  caption="""Gesunde Halloween-Snacks: 4 Ideen in 10 Minuten 🎃👻

1️⃣ Mandarinen-Kürbisse
2️⃣ Bananen-Geister
3️⃣ Apfel-Monstermäuler
4️⃣ Monster-Bällchen ohne Backen (Rezept morgen im Reel)

Die Süße kommt aus Obst und Datteln – so wird die Party kein Zuckerberg.
Perfekt für die Kita-Feier, die Halloween-Party oder den Sofa-Abend.

Welche Idee machst du? Schreib die Nummer in die Kommentare 👇
📌 Speichern für Samstag und in die Eltern-Gruppe schicken.

Hinweis: Enthält Nüsse. Für Kita und Schule die Nüsse durch Sonnenblumenkerne ersetzen.

#HalloweenSnacks #GesundeSnacks #HalloweenIdeen #KinderSnacks #WellANNI""",
  alt='6 Folien auf dunklem Hintergrund: Gesunde Halloween-Snacks. Mandarinen-Kürbisse, Bananen-Geister, Apfel-Monstermäuler mit Erdnussmus und Mandelzähnen, Monster-Bällchen aus Datteln und Hafer.',
  note=''),

dict(id='04_reel_energy-balls', folder='04_Do-29-10', fmt='reel', day='Do 29.10.', time='18:00', serie='Echtes Essen',
  title='Reel: Monster-Bällchen ohne Backen', link='https://wellanni.de/rezept-energy-balls.html',
  slides=[
    dict(t='photo', photo='energy-balls.jpg', photo_h=0.68, kicker='Halloween-Snack', title='Ohne Backen.\nOhne *Zuckerzusatz.*', size=88, dur=2.6),
    dict(t='list', kicker='Für 16 Stück', title='Das kommt\nin den *Mixer*', size=100, items=[
        ('150 g Datteln', 'die Süße'),
        ('80 g Haferflocken + 60 g Nüsse', 'grob zerkleinert'),
        ('2 EL Kakao + 1 EL Nussmus', 'plus 1 Prise Salz')], dur=4.2),
    dict(t='big', kicker='Dann', big='Formen.\nKühlen.\nFertig.', bigsize=130, title='16 Kugeln rollen, in Kokos wälzen, *30 Minuten* kühlen. Mandelscheiben als Augen.', size=72, dur=3.4),
    dict(t='end', title='Speichern für\nden *31.10.*', sub='Schick’s an alle, die noch einen Party-Snack suchen.', size=110, dur=2.4),
  ],
  caption="""Monster-Bällchen ohne Backen – süß nur durch Datteln 🎃

Für 16 Stück:
• 150 g Datteln, entsteint
• 80 g zarte Haferflocken
• 60 g Haselnüsse oder Mandeln
• 2 EL Kakaopulver
• 1 EL Erdnuss- oder Mandelmus
• 1 Prise Salz
• 2 EL Kokosraspeln zum Wälzen
• für die Augen: Mandelscheiben

1. Nüsse im Mixer grob zerkleinern. Datteln, Haferflocken, Kakao, Nussmus und Salz dazu und mixen, bis die Masse klebt.
2. Mit feuchten Händen 16 Kugeln formen.
3. In Kokos wälzen, Augen andrücken, mindestens 30 Minuten kühlen.

Halten sich eine Woche im Kühlschrank.

📌 Speichern für Samstag.

Rezept mit Nährwerten: wellanni.de (Link in Bio).

#HalloweenSnacks #EnergyBalls #OhneZucker #GesundeSnacks #WellANNI""",
  alt='Reel: Schoko-Energy-Balls auf einem Teller in Herbstdeko. Text: Ohne Backen, ohne Zuckerzusatz. Datteln, Haferflocken, Nüsse, Kakao mixen, Kugeln formen, kühlen.',
  note='Musik: nur lizenzfrei. Enthält Nüsse.'),

dict(id='04_story_umfrage-halloween', folder='04_Do-29-10', fmt='story', day='Do 29.10.', time='abends', serie='Echtes Essen',
  title='Story: Umfrage Halloween', link='',
  slides=[dict(t='story', dark=True, kicker='Halloween', title='Welcher Snack kommt bei dir auf den *Tisch?*', size=100)],
  caption='', alt='', note='Umfrage-Sticker mit 4 Antworten: Mandarinen-Kürbisse · Bananen-Geister · Apfel-Monstermäuler · Monster-Bällchen.'),

# ───────────── Fr 30.10. ─────────────
dict(id='05_post_wechseljahre-teller', folder='05_Fr-30-10', fmt='post', day='Fr 30.10.', time='12:00', serie='Wechseljahre',
  title='Karussell: Wechseljahre – 4 Nährstoffe vom Teller', link='https://wellanni.de/wechseljahre.html',
  slides=[
    dict(t='cover', kicker='Wechseljahre', title='Wechseljahre:\n4 Nährstoffe\n*vom Teller.*', sub='Was in dieser Phase besonders Thema ist – und wo es drinsteckt.'),
    dict(t='list', kicker='1 & 2', title='Für die\n*Knochen*', items=[
        ('Calcium', 'Hartkäse, Joghurt, Grünkohl, Brokkoli, calciumreiches Mineralwasser.'),
        ('Vitamin D', 'Fetter Fisch und Eier – im Winter reicht die Sonne nicht.')],
        foot='Calcium und Vitamin D werden für die Erhaltung normaler Knochen benötigt.\\*'),
    dict(t='list', kicker='3 & 4', title='Für Kraft\nund *Energie*', items=[
        ('Eiweiß', 'Quark, Skyr, Hülsenfrüchte, Eier, Fisch – in jeder Mahlzeit ein bisschen.'),
        ('Magnesium', 'Kürbiskerne, Haferflocken, Vollkornbrot, Hülsenfrüchte.')],
        foot='Eiweiß trägt zur Erhaltung von Muskelmasse bei.\\* Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.\\*'),
    dict(t='big', kicker='Ein Teller, alles drin', big='Grünkohl-\nEintopf', bigsize=120, title='mit Kichererbsen und Kürbiskernen: *22 g Eiweiß* pro Portion, dazu Calcium und Magnesium. Reel heute 18 Uhr.', size=62),
    dict(t='end', title='Speichern und\nan die *Freundin*\nschicken.', size=96, sub='Über die Wechseljahre wird zu wenig gesprochen. Ändern wir das.', foot=DS),
  ],
  caption="""Wechseljahre: 4 Nährstoffe vom Teller 🌿

In den Wechseljahren verändert sich viel – auch, was der Körper braucht. Diese vier sind besonders Thema:

🦴 Calcium: Hartkäse, Joghurt, Grünkohl, Brokkoli, calciumreiches Mineralwasser
☀️ Vitamin D: fetter Fisch und Eier
💪 Eiweiß: Quark, Skyr, Hülsenfrüchte, Eier, Fisch
⚡ Magnesium: Kürbiskerne, Haferflocken, Vollkornbrot

Calcium und Vitamin D werden für die Erhaltung normaler Knochen benötigt.* Eiweiß trägt zur Erhaltung von Muskelmasse bei.* Magnesium trägt zur Verringerung von Müdigkeit und Ermüdung bei.*

Was beschäftigt dich in den Wechseljahren am meisten? 👇

📌 Speichern und an die Freundin schicken, mit der du darüber redest.

""" + DISCLAIMER + """

#Wechseljahre #Perimenopause #Menopause #Frauengesundheit #WellANNI""",
  alt='5 Folien: Wechseljahre, 4 Nährstoffe vom Teller. Calcium und Vitamin D für die Knochen, Eiweiß und Magnesium. Beispiel: Grünkohl-Eintopf mit Kichererbsen.',
  note=''),

dict(id='05_reel_gruenkohl', folder='05_Fr-30-10', fmt='reel', day='Fr 30.10.', time='18:00', serie='Wechseljahre',
  title='Reel: Grünkohl mal anders – Eintopf in 30 Minuten', link='https://wellanni.de/rezept-kichererbsen-gruenkohl-eintopf.html',
  slides=[
    dict(t='photo', photo='rezept-kichererbsen-gruenkohl-eintopf.jpg', photo_h=0.7, kicker='Grünkohl mal anders', title='Ohne Pinkel.\nIn *30 Minuten.*', size=92, dur=2.6),
    dict(t='list', kicker='Ein Topf', title='Das kommt\n*rein*', size=100, items=[
        ('Grünkohl + Kichererbsen', 'frisch oder TK'),
        ('Vollkornnudeln + Tomaten', 'in Gemüsebrühe'),
        ('Geräuchertes Paprikapulver', 'für den rauchigen Geschmack')], dur=4.2),
    dict(t='big', kicker='Pro Portion', big='22 g', title='Eiweiß und *23 g Ballaststoffe*. Geröstete Kürbiskerne obendrauf.', size=76, dur=3.2),
    dict(t='end', title='Rezept in der\n*Caption.*', sub='Speichern für den nächsten kalten Abend.', size=110, dur=2.4),
  ],
  caption="""Grünkohl mal anders: Eintopf mit Kichererbsen und Vollkornnudeln 🥬

Ohne Pinkel, ohne stundenlanges Kochen – herzhaft, rauchig und in 30 Minuten fertig.

Für 3 Portionen:
• 250 g Grünkohl (frisch oder TK)
• 1 Dose Kichererbsen (240 g abgetropft)
• 120 g kleine Vollkornnudeln
• 1 Zwiebel, 2 Knoblauchzehen, 1 Karotte
• 1 EL Olivenöl
• 1 Dose stückige Tomaten (400 g)
• 700 ml Gemüsebrühe
• 1 TL geräuchertes Paprikapulver
• 3 EL Kürbiskerne, Salz, Pfeffer

1. Zwiebel, Knoblauch und Karotte würfeln, Grünkohl klein schneiden.
2. Im Öl 3 Minuten anschwitzen, Paprikapulver kurz mitrösten, Tomaten und Brühe dazu.
3. Grünkohl, Kichererbsen und Nudeln 10–12 Minuten köcheln.
4. Abschmecken, geröstete Kürbiskerne drüber.

Pro Portion rund 22 g Eiweiß und 23 g Ballaststoffe.

📌 Speichern für den nächsten kalten Abend.

Rezept mit Nährwerten: wellanni.de (Link in Bio).

#Grünkohl #GrünkohlRezept #Eintopf #Herbstrezepte #WellANNI""",
  alt='Reel: Teller mit Grünkohl-Eintopf mit Kichererbsen und Vollkornnudeln. Text: Ohne Pinkel, in 30 Minuten, 22 g Eiweiß pro Portion.',
  note='Musik: nur lizenzfrei.'),

dict(id='05_story_umfrage-wechseljahre', folder='05_Fr-30-10', fmt='story', day='Fr 30.10.', time='abends', serie='Wechseljahre',
  title='Story: Umfrage Wechseljahre', link='',
  slides=[dict(t='story', kicker='Wechseljahre', title='Worüber sollen wir *mehr* sprechen?', size=110, sub='Deine Antwort bestimmt die nächsten Beiträge.')],
  caption='', alt='', note='Umfrage-Sticker mit 3–4 Antworten: Schlaf · Energie · Essen · Haut.'),

# ───────────── Sa 31.10. ─────────────
dict(id='06_post_suesse-ohne-zucker', folder='06_Sa-31-10', fmt='post', day='Sa 31.10.', time='12:00', serie='Echtes Essen',
  title='Karussell: Süße ohne Zucker – 6 Ideen', link='https://wellanni.de/echtes-essen.html',
  slides=[
    dict(t='cover', kicker='Echtes Essen', title='Süße\n*ohne Zucker.*', sub='6 Zutaten, die von Natur aus süß machen. Ganz ohne Süßstoff.'),
    dict(t='list', kicker='Obst', title='Süß von\n*Natur aus*', items=[
        ('Reife Banane', 'Zerdrückt im Porridge oder in Pancakes.'),
        ('Datteln', 'Gehackt oder püriert – für Energy Balls und Kuchen.'),
        ('Apfel und Birne', 'Gerieben im Porridge oder warm aus dem Ofen.')]),
    dict(t='list', kicker='Mehr Tricks', title='Und *das*\nauch noch', items=[
        ('Zimt und Vanille', 'Sie lassen Speisen süßer schmecken, ohne dass Zucker dazukommt.'),
        ('Beeren', 'Im Winter tiefgekühlt – süß-säuerlich und voller Farbe.'),
        ('Ofengemüse', 'Süßkartoffel, Karotte und Kürbis werden im Ofen von selbst karamellig.')]),
    dict(t='end', title='Speichern für\nden *Heißhunger.*', sub='Welche Zucker-Alternative nutzt du am liebsten? 👇'),
  ],
  caption="""Süße ohne Zucker – und ohne Süßstoff 🍌🍎

Diese 6 Zutaten machen Essen von Natur aus süß:

🍌 Reife Banane: zerdrückt im Porridge oder in Pancakes
🌴 Datteln: für Energy Balls und Kuchen
🍎 Apfel und Birne: gerieben im Porridge oder warm aus dem Ofen
✨ Zimt und Vanille: lassen alles süßer schmecken
🫐 Beeren: im Winter einfach tiefgekühlt
🍠 Ofengemüse: Süßkartoffel und Kürbis werden im Ofen karamellig

Je weniger Zucker du isst, desto süßer schmeckt Obst. Probier's eine Woche aus.

Was nutzt du am liebsten? 👇
📌 Speichern für den nächsten Heißhunger.

#OhneZucker #ZuckerfreiLeben #EchtesEssen #GesundeErnährung #WellANNI""",
  alt='4 Folien: Süße ohne Zucker. Reife Banane, Datteln, Apfel und Birne, Zimt und Vanille, Beeren, Ofengemüse.',
  note='Happy Halloween: Karussell vom Donnerstag nochmal in die Story teilen.'),

dict(id='06_reel_overnight-oats', folder='06_Sa-31-10', fmt='reel', day='Sa 31.10.', time='18:00', serie='Echtes Essen',
  title='Reel: Overnight Oats – abends 2 Minuten, morgens fertig', link='https://wellanni.de/rezept-overnight-oats-chia.html',
  slides=[
    dict(t='photo', photo='overnight-oats.jpg', photo_h=0.7, kicker='Frühstück vorbereiten', title='Abends 2 Minuten.\nMorgens *fertig.*', size=86, dur=2.6),
    dict(t='list', kicker='Für 2 Gläser', title='Alles ins\n*Glas*', size=100, items=[
        ('100 g Haferflocken', '+ 1 EL Chiasamen'),
        ('200 g Joghurt + 150 ml Milch', 'verrühren'),
        ('½ TL Zimt + Beeren', 'die Süße – ganz ohne Zucker')], dur=4.2),
    dict(t='big', kicker='Pro Portion', big='15 g', title='Eiweiß und *10 g Ballaststoffe*. Hält sich 2 Tage im Kühlschrank.', size=76, dur=3.2),
    dict(t='end', title='Speichern für\n*Sonntagabend.*', sub='Dann ist der Montag schon halb gewonnen.', size=110, dur=2.4),
  ],
  caption="""Overnight Oats: abends 2 Minuten, morgens fertig 🫐

Für 2 Gläser:
• 100 g Haferflocken
• 200 g Naturjoghurt
• 150 ml Milch
• 1 EL Chiasamen
• ½ TL Zimt
• 150 g Beeren (frisch oder TK)

1. Haferflocken, Joghurt, Milch, Chia und Zimt verrühren.
2. Auf zwei Gläser verteilen, über Nacht in den Kühlschrank.
3. Morgens Beeren drauf. TK-Beeren am Vorabend schon mit ins Glas.

Süß nur durch Beeren und Zimt. Pro Portion rund 15 g Eiweiß und 10 g Ballaststoffe.

📌 Speichern für Sonntagabend.

Rezept mit Nährwerten: wellanni.de (Link in Bio).

#OvernightOats #GesundesFrühstück #MealPrep #OhneZucker #WellANNI""",
  alt='Reel: Glas mit Overnight Oats und Beeren. Text: Abends 2 Minuten, morgens fertig. Haferflocken, Joghurt, Milch, Chia, Zimt, Beeren.',
  note='Musik: nur lizenzfrei.'),

dict(id='06_story_halloween', folder='06_Sa-31-10', fmt='story', day='Sa 31.10.', time='mittags', serie='Echtes Essen',
  title='Story: Happy Halloween', link='',
  slides=[dict(t='story', dark=True, kicker='31.10.', title='Happy\n*Halloween!*', size=130, sub='Die 4 Snack-Ideen findest du im Post vom Donnerstag.')],
  caption='', alt='', note='Darunter das Halloween-Karussell vom Donnerstag teilen.'),

# ───────────── So 1.11. ─────────────
dict(id='07_post_haut-vom-teller', folder='07_So-01-11', fmt='post', day='So 1.11.', time='12:00', serie='Morgenroutine',
  title='Karussell: Schönheit vom Teller – 4 Basics für die Haut', link='https://wellanni.de/clean-girl-morgenroutine.html',
  slides=[
    dict(t='cover', kicker='Morgenroutine', title='Schönheit\n*vom Teller.*', sub='Bevor du das nächste Pulver kaufst: 4 Basics für deine Haut.'),
    dict(t='list', kicker='Die Basics', title='Was deine Haut\n*mag*', items=[
        ('Vitamin C', 'Paprika, Beeren, Kiwi, Zitrusfrüchte.'),
        ('Zink', 'Haferflocken, Kürbiskerne, Linsen, Käse.'),
        ('Vitamin A', 'Karotte, Süßkartoffel, Grünkohl.'),
        ('Biotin', 'Eier, Haferflocken, Nüsse.')], gap=18),
    dict(t='big', kicker='Und das steckt dahinter', big='Laut EU', bigsize=120, title='Vitamin C trägt zu einer normalen Kollagenbildung für eine normale Funktion der Haut bei.\\* Zink, Vitamin A und Biotin tragen zur Erhaltung *normaler Haut* bei.\\*', size=50, foot=DS),
    dict(t='end', title='Erst ein Glas\nWasser, dann\n*der Kaffee.*', size=96, sub='Speichern für deine Morgenroutine 📌'),
  ],
  caption="""Schönheit vom Teller ✨

Bevor du das nächste Kollagen-Pulver kaufst: Diese Lebensmittel liefern, was deine Haut braucht.

🍊 Vitamin C: Paprika, Beeren, Kiwi, Zitrusfrüchte
🎃 Zink: Haferflocken, Kürbiskerne, Linsen, Käse
🥕 Vitamin A: Karotte, Süßkartoffel, Grünkohl
🥚 Biotin: Eier, Haferflocken, Nüsse

Vitamin C trägt zu einer normalen Kollagenbildung für eine normale Funktion der Haut bei.* Zink, Vitamin A und Biotin tragen zur Erhaltung normaler Haut bei.*

Und der einfachste Schritt am Morgen: erst ein großes Glas Wasser, dann der Kaffee.

📌 Speichern für deine Morgenroutine.

""" + DISCLAIMER + """

#Morgenroutine #SchönheitVonInnen #Hautpflege #EchtesEssen #WellANNI""",
  alt='4 Folien: Schönheit vom Teller. Vitamin C, Zink, Vitamin A und Biotin mit Lebensmitteln. Erst ein Glas Wasser, dann der Kaffee.',
  note=''),

dict(id='07_reel_quinoa-salat', folder='07_So-01-11', fmt='reel', day='So 1.11.', time='18:00', serie='Echtes Essen',
  title='Reel: Herbstsalat, der satt macht', link='https://wellanni.de/rezept-quinoa-salat-rotkohl.html',
  slides=[
    dict(t='photo', photo='rezept-quinoa-salat-rotkohl.jpg', photo_h=0.7, kicker='Meal Prep für Montag', title='Ein Salat,\nder *satt* macht.', size=92, dur=2.6),
    dict(t='list', kicker='Das Geheimnis', title='Darum hält er\n*lange* vor', size=100, items=[
        ('Quinoa', 'sättigt mit Eiweiß und Ballaststoffen'),
        ('Ofen-Süßkartoffel', 'karamellig und warm'),
        ('Rotkohl + Feta + Kürbiskerne', 'Biss und Würze')], dur=4.2),
    dict(t='big', kicker='Pro Portion', big='18 g', title='Eiweiß und *11 g Ballaststoffe*. Schmeckt warm und kalt – perfekt für die Lunchbox.', size=72, dur=3.2),
    dict(t='end', title='Speichern für\nden *Wochenplan.*', sub='Rezept in der Caption.', size=110, dur=2.4),
  ],
  caption="""Kein Salat, nach dem du in einer Stunde wieder Hunger hast 🥗

Quinoa-Salat mit Rotkohl und Süßkartoffel (2 Portionen):
• 100 g Quinoa
• 1 Süßkartoffel (ca. 300 g)
• 150 g Rotkohl
• 1 Handvoll Feldsalat oder Babyspinat
• 2 EL Kürbiskerne, 60 g Feta
• 2 EL Olivenöl, 1 EL Apfelessig
• 1 TL Senf, 1 TL Honig
• ½ TL Kreuzkümmel, Salz, Pfeffer

1. Ofen auf 210 °C. Süßkartoffel würfeln, mit 1 EL Öl, Kreuzkümmel und Salz rösten.
2. Quinoa heiß abspülen und in der doppelten Menge Salzwasser 15 Minuten garen.
3. Rotkohl fein hobeln und mit einer Prise Salz durchkneten.
4. Dressing aus Essig, Senf, Honig und Öl. Alles mischen, mit Salat, Feta und Kürbiskernen.

Pro Portion rund 18 g Eiweiß und 11 g Ballaststoffe. Für die Lunchbox den Salat erst kurz vorm Essen unterheben.

📌 Speichern für den Wochenplan.

Rezept mit Nährwerten: wellanni.de (Link in Bio).

#MealPrep #Quinoasalat #Herbstsalat #GesundeRezepte #WellANNI""",
  alt='Reel: Schale mit Quinoa-Salat, Rotkohl, Süßkartoffel und Feta. Text: Ein Salat, der satt macht, 18 g Eiweiß pro Portion.',
  note='Musik: nur lizenzfrei.'),

dict(id='07_story_umfrage-themen', folder='07_So-01-11', fmt='story', day='So 1.11.', time='abends', serie='Alle',
  title='Story: Umfrage Wunschthema', link='',
  slides=[dict(t='story', kicker='Deine Woche', title='Was willst du *nächste Woche* sehen?', size=110, sub='Wir richten uns nach dir.')],
  caption='', alt='', note='Umfrage-Sticker: Schnelle Rezepte · Wechseljahre · Süßes ohne Zucker · Morgenroutine.'),
]
