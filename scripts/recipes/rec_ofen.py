from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('kabeljau_ofengericht_rotkohl_suesskartoffel_112','Kabeljau vom Blech mit Rotkohl und Süßkartoffel','lunch','ofen','hw',2,15,35,"""
300 g | Kabeljaufilet (2 Stücke) | kabeljau
1 | Süßkartoffel (ca. 350 g) | suesskartoffel=350
250 g | Rotkohl | rotkohl
1 | rote Zwiebel | rote_zwiebel
2 EL | Olivenöl | olivenoel
1 TL | Kreuzkümmel oder Thymian | gewuerz
½ | Zitrone | zitrone=20
100 g | Naturjoghurt | joghurt
1 EL | Petersilie | petersilie
"""+S%2,["Backofen auf 210 °C Ober-/Unterhitze vorheizen. Süßkartoffel in Spalten, Rotkohl in feine Streifen, Zwiebel in Spalten schneiden.",
"Gemüse mit 1 ½ EL Öl, Gewürz und Salz mischen, auf einem Blech verteilen und 20 Minuten rösten.",
"Kabeljau salzen, mit restlichem Öl beträufeln und mit Zitronenscheiben belegen. Zwischen das Gemüse legen und weitere 12–15 Minuten garen, bis er sich in Lamellen zupfen lässt.",
"Joghurt mit etwas Zitronensaft und Salz verrühren und mit Petersilie zum Blech servieren."],
"Ein Blech, wenig Abwasch: zarter Kabeljau mit ofengeröstetem Rotkohl und Süßkartoffel.",
occ='feierabend',tip="Statt Kabeljau passen Seelachs oder Lachs.")
CH['kabeljau_ofengericht_rotkohl_suesskartoffel_112']='Pin-Rezept: 2 Portionen statt 1 (vorher 729 kcal/Portion), Blech-Schritte statt Pfannen-Vorlage, Joghurt-Dip ergänzt.'

R('ofenkuerbis_feta_kichererbsen','Ofenkürbis mit Feta, Kichererbsen und Kürbiskernen','lunch','ofen','h',4,15,30,"""
1,2 kg | Hokkaido-Kürbis | hokkaido=1200
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
2 | rote Zwiebeln | rote_zwiebel
3 EL | Olivenöl | olivenoel
1 TL | Paprikapulver, ½ TL Zimt, Chiliflocken | gewuerz
150 g | Feta | feta
3 EL | Kürbiskerne | kuerbiskerne
1 EL | Honig | honig
2 Handvoll | Feldsalat oder Rucola | feldsalat=50
"""+S%3,["Backofen auf 210 °C vorheizen. Kürbis entkernen und mit Schale in Spalten schneiden, Zwiebeln in Spalten. Kichererbsen abtropfen und trocken tupfen.",
"Kürbis, Zwiebeln und Kichererbsen mit Öl, Gewürzen und Salz mischen und auf einem großen Blech verteilen. 20 Minuten rösten.",
"Feta darüberbröseln, Kürbiskerne darüberstreuen und weitere 8–10 Minuten backen, bis der Kürbis weich und an den Rändern karamellisiert ist.",
"Mit Honig beträufeln und auf Feldsalat servieren."],
"Karamellisierter Kürbis, salziger Feta und ein Hauch Honig – Herbstglück vom Blech.",
occ='feierabend,gaeste')
CH['ofenkuerbis_feta_kichererbsen']='Neu (Kürbis-Saison).'

R('haehnchenschenkel_wurzelgemuese','Hähnchenschenkel vom Blech mit Wurzelgemüse','lunch','ofen','hw',4,15,45,"""
4 | Hähnchenschenkel | haehnchenschenkel
500 g | Kartoffeln | kartoffel
3 | Karotten | karotte
2 | Pastinaken | pastinake
2 | rote Zwiebeln | rote_zwiebel
4 | Knoblauchzehen | knoblauch=16
2 EL | Olivenöl | olivenoel
1 TL | Paprikapulver, Thymian, Rosmarin | gewuerz
1 | Zitrone | zitrone=30
"""+S%5,["Backofen auf 200 °C Umluft vorheizen. Kartoffeln, Karotten und Pastinaken in Spalten, Zwiebeln in Viertel schneiden.",
"Gemüse mit Öl, Kräutern, Salz und ungeschältem Knoblauch mischen und auf einem Blech verteilen.",
"Hähnchenschenkel mit Paprika und Salz einreiben und mit der Hautseite nach oben auf das Gemüse legen. 40–45 Minuten backen, bis die Haut knusprig und das Fleisch am Knochen durchgegart ist.",
"Mit Zitronensaft beträufeln und direkt vom Blech servieren."],
"Knusprige Haut, saftiges Fleisch und Gemüse, das im Bratensaft gart – Sonntagsbraten ohne Aufwand.",
occ='familie,wochenende',kid=True)
CH['haehnchenschenkel_wurzelgemuese']='Ersetzt 9 Vorlage-Varianten mit Hähnchenschenkel.'

R('gefuellte_paprika_hack_reis','Gefüllte Paprika mit Hackfleisch und Reis','lunch','ofen','sh',4,20,40,"""
4 | große Paprika | paprika=200
350 g | Rinderhackfleisch | rinderhack
80 g | Reis | reis
1 | Zwiebel | zwiebel
1 | Knoblauchzehe | knoblauch=4
1 | Ei | ei
500 ml | passierte Tomaten | passata
150 ml | Gemüsebrühe | gemuesebruehe
1 TL | Paprikapulver, Oregano | gewuerz
50 g | Gouda, gerieben | gouda
"""+S%4,["Reis in Salzwasser 10 Minuten vorgaren und abgießen. Backofen auf 190 °C vorheizen.",
"Von den Paprika einen Deckel abschneiden und die Kerne entfernen. Zwiebel und Knoblauch fein würfeln.",
"Hack mit Reis, Zwiebel, Knoblauch, Ei, Gewürzen, Salz und Pfeffer verkneten und in die Paprika füllen.",
"Passierte Tomaten mit Brühe in eine Auflaufform geben, Paprika hineinsetzen, Deckel auflegen und 30 Minuten backen. Käse darüberstreuen und weitere 10 Minuten backen."],
"Der Klassiker aus Mamas Küche: würzige Füllung, weiche Paprika, Tomatensauce zum Tunken.",
occ='familie,mealprep',kid=True)
CH['gefuellte_paprika_hack_reis']='Neu (Klassiker).'

R('kartoffelgratin_brokkoli','Kartoffelgratin mit Brokkoli','lunch','ofen','hw',4,20,50,"""
800 g | festkochende Kartoffeln | kartoffel
400 g | Brokkoli | brokkoli
300 ml | Milch | milch
150 ml | Sahne | sahne
1 | Knoblauchzehe | knoblauch=4
80 g | Bergkäse, gerieben | bergkaese
1 Prise | Muskat | gewuerz
1 TL | Butter für die Form | butter=5
"""+S%4,["Backofen auf 190 °C vorheizen. Kartoffeln schälen und in 3 mm dünne Scheiben hobeln, Brokkoli in kleine Röschen teilen.",
"Milch und Sahne mit Knoblauch, Muskat, Salz und Pfeffer aufkochen. Kartoffeln darin 5 Minuten unter Rühren vorgaren – das macht das Gratin cremig.",
"Kartoffeln mit Brokkoli in eine gebutterte Form schichten, die Flüssigkeit darübergießen und mit Käse bestreuen.",
"40–45 Minuten backen, bis die Kartoffeln weich sind und die Oberfläche goldbraun ist. 5 Minuten ruhen lassen."],
"Cremige Kartoffeln, grüne Röschen und eine goldene Käsekruste – Wohlfühlessen pur.",
occ='familie,wochenende',kid=True)
CH['kartoffelgratin_brokkoli']='Neu.'

R('ofenkartoffeln_kraeuterquark','Ofenkartoffeln mit Kräuterquark und Leinöl','lunch','ofen','g',4,15,35,"""
1,2 kg | kleine Kartoffeln | kartoffel=1200
1 EL | Rapsöl | rapsoel
500 g | Magerquark | magerquark
150 g | Naturjoghurt | joghurt
1 Bund | Kräuter (Schnittlauch, Petersilie, Dill) | schnittlauch=30
1 | Knoblauchzehe | knoblauch=4
2 EL | Leinöl | leinoel
1 | Salatgurke | gurke
"""+S%5,["Backofen auf 210 °C vorheizen. Kartoffeln waschen, halbieren und mit Öl und Salz auf einem Blech 30–35 Minuten goldbraun backen.",
"Quark mit Joghurt glatt rühren, Kräuter hacken und mit gepresstem Knoblauch unterheben. Mit Salz und Pfeffer abschmecken.",
"Gurke in Scheiben schneiden. Kartoffeln mit Kräuterquark und Gurke anrichten und den Quark mit Leinöl beträufeln."],
"Lausitzer Klassiker in knusprig: Ofenkartoffeln, frischer Kräuterquark und nussiges Leinöl.",
occ='familie,feierabend',kid=True)
CH['ofenkartoffeln_kraeuterquark']='Neu (Klassiker).'

R('suesskartoffel_bohnen_avocado','Gefüllte Süßkartoffel mit schwarzen Bohnen und Avocado','lunch','ofen','hw',2,10,40,"""
2 | Süßkartoffeln (je ca. 250 g) | suesskartoffel=500
1 Dose | schwarze Bohnen (240 g abgetropft) | schwarze_bohnen
½ | rote Zwiebel | rote_zwiebel=40
1 | Avocado | avocado
1 | Limette | limette
1 TL | Kreuzkümmel, Paprika | gewuerz
4 EL | Naturjoghurt | joghurt
1 Handvoll | Koriander | koriander
"""+S%2,["Backofen auf 200 °C vorheizen. Süßkartoffeln waschen, mehrmals einstechen und 40 Minuten backen, bis sie ganz weich sind.",
"Bohnen abspülen und mit Zwiebelwürfeln, Gewürzen und etwas Limettensaft in einer Pfanne 5 Minuten erwärmen.",
"Avocado würfeln und mit Limettensaft und Salz mischen.",
"Süßkartoffeln längs aufschneiden, auflockern, mit Bohnen füllen und mit Avocado, Joghurt und Koriander toppen."],
"Ofensüße Kartoffel, würzige Bohnen und cremige Avocado – mexikanisch, bunt und vegetarisch.",
occ='feierabend')
CH['suesskartoffel_bohnen_avocado']='Ersetzt die Vorlage-Varianten mit schwarzen Bohnen.'

R('auberginen_auflauf_mozzarella','Auberginen-Auflauf mit Tomaten und Mozzarella','lunch','ofen','s',4,25,40,"""
2 | Auberginen | aubergine
3 EL | Olivenöl | olivenoel
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
700 ml | passierte Tomaten | passata
250 g | Mozzarella (2 Kugeln) | mozzarella
40 g | Parmesan | parmesan
1 Handvoll | Basilikum | basilikum
1 Dose | weiße Bohnen (240 g abgetropft) | weisse_bohnen
4 Scheiben | Ciabatta oder Vollkornbrot | vk_brot
"""+S%4,["Auberginen in 1 cm dicke Scheiben schneiden, mit 2 EL Öl bepinseln und unter dem Backofengrill oder in der Grillpfanne von beiden Seiten goldbraun rösten.",
"Zwiebel und Knoblauch im restlichen Öl andünsten, Tomaten und Bohnen zugeben und 10 Minuten köcheln. Salzen, pfeffern und Basilikum zupfen.",
"Backofen auf 190 °C vorheizen. Abwechselnd Sauce, Auberginen und Mozzarella in eine Form schichten, mit Parmesan abschließen.",
"30 Minuten backen und vor dem Anschneiden 10 Minuten ruhen lassen. Mit Brot servieren."],
"Wie Parmigiana aus Süditalien: geröstete Aubergine, Tomaten und geschmolzener Mozzarella.",
occ='gaeste,wochenende')
CH['auberginen_auflauf_mozzarella']='Neu. Weiße Bohnen in der Sauce für mehr Sättigung.'

R('blumenkohl_kaese_auflauf','Blumenkohl-Käse-Auflauf','lunch','ofen','hw',4,15,35,"""
1 | großer Blumenkohl (ca. 1 kg) | blumenkohl=1000
150 g | Kochschinken (oder 1 Dose Kichererbsen) | kochschinken
200 g | Frischkäse | frischkaese
150 ml | Milch | milch
2 | Eier | ei
100 g | Bergkäse, gerieben | bergkaese
1 Prise | Muskat | gewuerz
2 EL | Schnittlauch | schnittlauch
"""+S%3,["Backofen auf 200 °C vorheizen. Blumenkohl in Röschen teilen und in Salzwasser 6 Minuten bissfest vorgaren, gut abtropfen lassen.",
"Frischkäse mit Milch, Eiern und der Hälfte des Käses verrühren, mit Muskat, Salz und Pfeffer würzen.",
"Blumenkohl und Schinkenwürfel in eine Form geben, Sauce darübergießen und mit restlichem Käse bestreuen.",
"25 Minuten goldbraun backen und mit Schnittlauch servieren."],
"Goldene Käsekruste über zartem Blumenkohl – cremig, herzhaft und kohlenhydratarm.",
occ='familie',kid=True)
CH['blumenkohl_kaese_auflauf']='Ersetzt Vorlage-Blumenkohl-Varianten.'

R('hackbaellchen_tomatensauce','Hackbällchen in Tomatensauce aus dem Ofen','lunch','ofen','g',4,20,30,"""
500 g | gemischtes Hackfleisch | hack_gemischt
1 | Ei | ei
30 g | Semmelbrösel | paniermehl
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 TL | Oregano, Paprika | gewuerz
700 ml | passierte Tomaten | passata
1 | Zucchini | zucchini
60 g | Mozzarella | mozzarella
200 g | Vollkornnudeln oder Baguette | vk_nudeln
"""+S%5,["Backofen auf 200 °C vorheizen. Zwiebel und Knoblauch sehr fein würfeln.",
"Hack mit Ei, Semmelbröseln, der Hälfte der Zwiebel, Gewürzen, Salz und Pfeffer verkneten und mit feuchten Händen walnussgroße Bällchen formen.",
"Passierte Tomaten mit restlicher Zwiebel, Knoblauch und gewürfelter Zucchini in eine Auflaufform geben und würzen. Bällchen hineinsetzen und 25 Minuten backen.",
"Mozzarella darüberzupfen und 5 Minuten weiterbacken. Mit Nudeln oder Brot servieren."],
"Saftige Hackbällchen, die in der Tomatensauce schmoren – Kinder lieben es, Erwachsene auch.",
occ='familie,mealprep',kid=True)
CH['hackbaellchen_tomatensauce']='Neu.'

R('zucchini_hack_auflauf','Zucchini-Hack-Auflauf','lunch','ofen','s',4,15,35,"""
3 | Zucchini | zucchini
400 g | Rinderhackfleisch | rinderhack
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
400 g | stückige Tomaten | tomaten_dose
150 g | Frischkäse | frischkaese
80 g | Feta | feta
1 TL | Oregano, Thymian | gewuerz
"""+S%3,["Backofen auf 200 °C vorheizen. Zucchini in Scheiben, Zwiebel und Knoblauch in Würfel schneiden.",
"Öl erhitzen und das Hack krümelig anbraten, Zwiebel und Knoblauch zugeben, mit Tomaten ablöschen und mit Kräutern, Salz und Pfeffer 5 Minuten köcheln.",
"Zucchini und Hacksauce abwechselnd in eine Form schichten. Frischkäse in Klecksen verteilen, Feta darüberbröseln.",
"30 Minuten backen, bis die Zucchini weich und die Oberfläche gebräunt ist."],
"Sommerlich, saftig und fast ohne Kohlenhydrate – Zucchini statt Nudeln.",
occ='familie,mealprep')
CH['zucchini_hack_auflauf']='Neu (Low Carb).'

R('forelle_ofen_fenchel','Forelle aus dem Ofen mit Fenchel und Zitrone','lunch','ofen','g',2,15,30,"""
2 | ganze Forellen, küchenfertig (je ca. 300 g) | forelle_ganz=400
2 | Fenchelknollen | fenchel
300 g | kleine Kartoffeln | kartoffel
1 | Zitrone | zitrone=40
2 EL | Olivenöl | olivenoel
1 Bund | Dill und Petersilie | petersilie=15
"""+S%3,["Backofen auf 200 °C vorheizen. Kartoffeln halbieren, Fenchel in Spalten schneiden, mit 1 EL Öl und Salz mischen und 15 Minuten vorrösten.",
"Forellen innen und außen salzen, mit Zitronenscheiben und Kräutern füllen und mit restlichem Öl bepinseln.",
"Forellen auf das Gemüse legen und weitere 15–18 Minuten garen, bis sich die Rückenflosse leicht herausziehen lässt.",
"Mit Zitronensaft beträufeln und servieren."],
"Ganze Forelle, aromatisch gefüllt – sieht festlich aus und gelingt ganz leicht.",
occ='gaeste,wochenende')
CH['forelle_ofen_fenchel']='Ersetzt 12 Vorlage-Varianten mit Forelle. Essbarer Anteil der ganzen Forelle mit ca. 2/3 gerechnet.'

R('puten_gemuese_blech','Putenbrust vom Blech mit Paprika und Zucchini','lunch','ofen','s',4,15,30,"""
500 g | Putenbrust | putenbrust
2 | Paprika | paprika
2 | Zucchini | zucchini
1 | rote Zwiebel | rote_zwiebel
250 g | Kirschtomaten | kirschtomaten=250
3 EL | Olivenöl | olivenoel
1 TL | Paprikapulver, Oregano | gewuerz
200 g | Naturjoghurt | joghurt
1 | Knoblauchzehe | knoblauch=4
4 | Vollkornfladen oder 200 g Bulgur | bulgur=200
"""+S%4,["Backofen auf 210 °C vorheizen. Gemüse in große Stücke schneiden, mit 2 EL Öl, Gewürzen und Salz mischen und 15 Minuten rösten.",
"Pute in Streifen schneiden, mit restlichem Öl und Paprika würzen, auf das Blech geben und 12–15 Minuten mitgaren, bis sie durchgegart ist. Bulgur nach Packungsangabe garen.",
"Joghurt mit gepresstem Knoblauch und Salz verrühren und zu Blech und Bulgur servieren."],
"Mediterranes Blechessen: würzige Pute, geröstetes Sommergemüse und Knoblauchjoghurt.",
occ='feierabend,familie')
CH['puten_gemuese_blech']='Neu.'

R('lauch_quiche','Lauch-Quiche mit Bergkäse','lunch','ofen','hw',6,25,40,"""
200 g | Dinkelvollkornmehl | vk_mehl
100 g | kalte Butter | butter
1 | Ei (für den Teig) | ei
3 Stangen | Lauch | lauch
1 EL | Rapsöl | rapsoel
3 | Eier | ei
200 g | Schmand | schmand
100 ml | Milch | milch
120 g | Bergkäse, gerieben | bergkaese
1 Prise | Muskat | gewuerz
| Salz, Pfeffer, Feldsalat zum Servieren | salz=4
""",["Mehl, Butter in Stücken, 1 Ei, ½ TL Salz und 2 EL kaltes Wasser rasch zu einem Teig verkneten. In Folie 30 Minuten kühlen.",
"Lauch in Ringe schneiden, gründlich waschen und im Öl 6–8 Minuten weich dünsten, salzen.",
"Backofen auf 190 °C vorheizen. Teig ausrollen, in eine gefettete Tarteform (26 cm) legen, Rand hochziehen und den Boden mit einer Gabel einstechen.",
"Eier mit Schmand, Milch, Käse und Muskat verquirlen, Lauch darauf verteilen, Guss darübergießen und 35–40 Minuten goldbraun backen."],
"Buttriger Vollkornboden, süßlicher Lauch und würziger Bergkäse – herbstliches Soulfood.",
occ='gaeste,mitnehmen,wochenende',wait=30)
CH['lauch_quiche']='Neu.'

R('vollkorn_pizza_gemuese','Vollkorn-Pizza mit Gemüse und Mozzarella','lunch','ofen','g',4,20,15,"""
300 g | Dinkelvollkornmehl | vk_mehl
½ Päckchen | Trockenhefe | hefe
200 ml | lauwarmes Wasser | wasser
2 EL | Olivenöl | olivenoel
250 ml | passierte Tomaten | passata
1 TL | Oregano | gewuerz
250 g | Mozzarella | mozzarella
1 | Paprika | paprika
150 g | Champignons | champignons
1 | Zucchini | zucchini
1 Handvoll | Rucola | rucola
"""+S%5,["Mehl, Hefe, 1 TL Salz, Wasser und 1 EL Öl 5 Minuten zu einem glatten Teig kneten und zugedeckt 45 Minuten gehen lassen.",
"Backofen mit Blech auf 250 °C vorheizen. Passierte Tomaten mit Oregano, Salz und restlichem Öl verrühren. Gemüse in dünne Scheiben schneiden.",
"Teig halbieren, dünn ausrollen, mit Sauce bestreichen, mit Gemüse und Mozzarella belegen.",
"Auf dem heißen Blech 12–15 Minuten knusprig backen und mit Rucola servieren."],
"Selbst belegte Pizza mit knusprigem Vollkornboden – der Freitagabend-Favorit der ganzen Familie.",
occ='familie,wochenende',kid=True,tip="Jede belegt ihre Ecke selbst – Kinder machen besonders gern mit.",wait=45)
CH['vollkorn_pizza_gemuese']='Neu.'

R('flammkuchen_zwiebel_speck','Flammkuchen mit Zwiebeln und Speck','lunch','ofen','h',4,20,15,"""
250 g | Dinkelmehl (Type 630) | dinkelmehl
150 ml | Wasser | wasser
2 EL | Rapsöl | rapsoel
200 g | Schmand | schmand
2 | Zwiebeln | zwiebel
120 g | Speckwürfel | speck
1 Prise | Muskat | gewuerz
2 Handvoll | Feldsalat | feldsalat=80
1 | Apfel | apfel
"""+S%3,["Mehl, Wasser, Öl und ½ TL Salz zu einem glatten, festen Teig kneten und 15 Minuten ruhen lassen. Backofen mit Blech auf höchster Stufe (250 °C) vorheizen.",
"Zwiebeln in sehr dünne Ringe hobeln. Schmand mit Muskat, Salz und Pfeffer verrühren.",
"Teig halbieren und hauchdünn auf Backpapier ausrollen, mit Schmand bestreichen, mit Zwiebeln und Speck belegen.",
"Auf dem heißen Blech 10–12 Minuten knusprig backen. Mit Feldsalat und Apfelscheiben servieren."],
"Hauchdünn, knusprig und herzhaft – wie im Elsass, mit Feldsalat und Apfel dazu.",
occ='gaeste,wochenende')
CH['flammkuchen_zwiebel_speck']='Neu. Ersetzt Vorlage-Speck-Varianten.'
