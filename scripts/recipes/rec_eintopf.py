from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('kichererbsen_eintopf_gruenkohl_vollkornnudeln_10','Grünkohl-Eintopf mit Kichererbsen und Vollkornnudeln','lunch','eintopf','hw',3,10,20,"""
250 g | Grünkohl (frisch oder TK) | gruenkohl
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
120 g | Vollkornnudeln (kleine Sorte) | vk_nudeln
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 | Karotte | karotte
1 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
700 ml | Gemüsebrühe | gemuesebruehe
1 TL | geräuchertes Paprikapulver | gewuerz
3 EL | Kürbiskerne | kuerbiskerne
"""+S%3,["Zwiebel, Knoblauch und Karotte würfeln. Grünkohl von den Stielen zupfen und klein schneiden.",
"Öl erhitzen, Zwiebel, Knoblauch und Karotte 3 Minuten anschwitzen. Paprikapulver kurz mitrösten, Tomaten und Brühe zugeben.",
"Grünkohl, Kichererbsen und Nudeln zugeben und 10–12 Minuten köcheln, bis die Nudeln gar sind.",
"Abschmecken. Kürbiskerne ohne Fett rösten und darüberstreuen."],
"Grünkohl ohne Pinkel und ohne stundenlanges Kochen – herzhaft, rauchig und in 30 Minuten fertig.",
occ='mealprep,familie',tip="Mit TK-Grünkohl geht es noch schneller.")
CH['kichererbsen_eintopf_gruenkohl_vollkornnudeln_10']='Pin-Rezept: Portionen korrigiert (vorher 1 Portion mit 1.406 kcal, jetzt 3), echte Schritte statt Vorlage, Tomaten und Rauchpaprika für Geschmack.'

R('halloumi_eintopf_rosenkohl_vollkornnudeln_9','Halloumi-Eintopf mit Rosenkohl und Vollkornnudeln','lunch','eintopf','hw',4,10,15,"""
225 g | Halloumi | halloumi
400 g | Rosenkohl | rosenkohl
200 g | Vollkornnudeln | vk_nudeln
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
800 ml | Gemüsebrühe | gemuesebruehe
1 | Zitrone (Schale und Saft) | zitrone=30
1 TL | Thymian | gewuerz
| Pfeffer | pfeffer
""",["Rosenkohl putzen und halbieren, Zwiebel und Knoblauch würfeln, Halloumi in Würfel schneiden.",
"Halloumi in einem großen Topf ohne Fett von allen Seiten goldbraun und knusprig braten, herausnehmen.",
"Öl in den Topf geben, Zwiebel und Knoblauch anschwitzen, Rosenkohl kurz mitbraten. Brühe, Thymian und Nudeln zugeben und 10–12 Minuten köcheln, bis die Nudeln gar sind.",
"Mit Zitronenschale, Zitronensaft und Pfeffer abschmecken (Halloumi ist salzig) und den knusprigen Halloumi obendrauf geben."],
"Ein Topf, 25 Minuten: goldbrauner, quietschender Halloumi auf Rosenkohl und Nudeln.",
occ='familie,schnell')
CH['halloumi_eintopf_rosenkohl_vollkornnudeln_9']='Pin-Rezept beibehalten; Trick für knusprigen Halloumi (zuerst separat anbraten) und Zitrone ergänzt.'

R('linseneintopf_moehren_kartoffeln','Linseneintopf mit Möhren und Kartoffeln','lunch','eintopf','hw',4,15,40,"""
250 g | braune Tellerlinsen | linsen
400 g | Kartoffeln | kartoffel
3 | Möhren | karotte
150 g | Knollensellerie | knollensellerie
1 Stange | Lauch | lauch
1 | Zwiebel | zwiebel
1 EL | Rapsöl | rapsoel
1,3 l | Gemüsebrühe | gemuesebruehe=1300
1 | Lorbeerblatt | gewuerz
2 EL | Apfel- oder Rotweinessig | essig
1 TL | Senf | senf
2 EL | Petersilie | petersilie
"""+S%5,["Linsen abspülen. Kartoffeln, Möhren und Sellerie schälen und würfeln, Lauch in Ringe schneiden, Zwiebel würfeln.",
"Öl erhitzen und Zwiebel anschwitzen. Linsen, Gemüse, Lorbeer und Brühe zugeben und zugedeckt 35–40 Minuten köcheln, bis die Linsen weich sind.",
"Mit Essig, Senf, Salz und Pfeffer kräftig abschmecken – die Säure macht den Eintopf erst rund.",
"Mit Petersilie servieren. Wer mag, erwärmt Wiener Würstchen darin."],
"Schwäbisch-ehrlich: Linsen, Gemüse und ein Schuss Essig – Hausmannskost, die wärmt.",
occ='mealprep,familie',kid=True)
CH['linseneintopf_moehren_kartoffeln']='Neu (Klassiker).'

R('linsen_dal_spinat_kokos','Linsen-Dal mit Spinat und Kokos','lunch','curry','g',4,10,25,"""
250 g | rote Linsen | linsen_rot
1 | Zwiebel | zwiebel
3 | Knoblauchzehen | knoblauch=12
3 cm | Ingwer | ingwer
1 EL | Kokosöl | kokosoel
2 TL | Currypulver, 1 TL Kurkuma, 1 TL Kreuzkümmel | currypulver
1 Dose | stückige Tomaten (400 g) | tomaten_dose
400 ml | Kokosmilch (fettreduziert oder ½ Dose + Wasser) | kokosmilch=250
500 ml | Wasser | wasser
150 g | Babyspinat | spinat
1 | Limette | limette
160 g | Basmati- oder Vollkornreis | reis
"""+S%4,["Reis nach Packungsangabe garen. Zwiebel, Knoblauch und Ingwer fein hacken, Linsen abspülen.",
"Kokosöl erhitzen, Zwiebel 3 Minuten anschwitzen, Knoblauch, Ingwer und Gewürze 1 Minute mitrösten.",
"Linsen, Tomaten, Kokosmilch und Wasser zugeben und 20 Minuten köcheln, bis die Linsen cremig zerfallen.",
"Spinat unterrühren, mit Limettensaft und Salz abschmecken und mit Reis servieren."],
"Indisches Wohlfühlessen: cremige Linsen, warme Gewürze und frischer Spinat.",
occ='mealprep,familie')
CH['linsen_dal_spinat_kokos']='Neu (vegan).'

R('tempeh_curry_zucchini_suesskartoffel_24','Tempeh-Curry mit Zucchini und Süßkartoffel','lunch','curry','g',4,15,25,"""
200 g | Tempeh | tempeh
1 | Süßkartoffel (ca. 400 g) | suesskartoffel=400
1 | Zucchini | zucchini
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 cm | Ingwer | ingwer
2 EL | Rapsöl | rapsoel
2 TL | Currypulver oder 1 EL Currypaste | currypulver
250 ml | Kokosmilch | kokosmilch
350 ml | Gemüsebrühe | gemuesebruehe
1 EL | Sojasauce | sojasauce
1 | Limette | limette
160 g | Vollkornreis | vollkornreis
"""+S%2,["Reis nach Packungsangabe garen. Süßkartoffel schälen und würfeln, Zucchini in Halbmonde schneiden, Zwiebel, Knoblauch und Ingwer hacken.",
"Tempeh in Würfel schneiden und in 1 EL Öl rundum knusprig braten, mit Sojasauce ablöschen und herausnehmen.",
"Restliches Öl erhitzen, Zwiebel, Knoblauch und Ingwer anschwitzen, Curry 1 Minute mitrösten. Süßkartoffel, Kokosmilch und Brühe zugeben und 12 Minuten köcheln.",
"Zucchini zugeben und 5 Minuten mitgaren. Tempeh unterheben, mit Limettensaft und Salz abschmecken und mit Reis servieren."],
"Knusprig gebratener Tempeh in cremiger Kokos-Currysauce – rein pflanzlich und richtig sättigend.",
occ='mealprep')
CH['tempeh_curry_zucchini_suesskartoffel_24']='Pin-Rezept: Curry, Kokosmilch, Brühe und Gewürze in die Zutaten aufgenommen (vorher nur Tempeh und Gemüse ohne Flüssigkeit). Hinweis: Für Tempeh gibt es im BLS keinen Eintrag, gerechnet mit gegarten Sojabohnen.'

R('kuerbis_kichererbsen_curry','Kürbis-Kichererbsen-Curry mit Kokosmilch','lunch','curry','h',4,15,25,"""
700 g | Hokkaido-Kürbis | hokkaido
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
3 cm | Ingwer | ingwer
1 EL | Kokosöl | kokosoel
1 EL | gelbe oder rote Currypaste | currypaste
250 ml | Kokosmilch | kokosmilch
350 ml | Gemüsebrühe | gemuesebruehe
100 g | Babyspinat | spinat
1 | Limette | limette
2 EL | Cashews, geröstet | cashews
160 g | Basmatireis | reis
"""+S%3,["Reis nach Packungsangabe garen. Kürbis entkernen und mit Schale in 2 cm große Würfel schneiden. Zwiebel, Knoblauch und Ingwer hacken.",
"Kokosöl erhitzen, Zwiebel, Knoblauch und Ingwer 3 Minuten anschwitzen, Currypaste 1 Minute mitrösten.",
"Kürbis, Kokosmilch und Brühe zugeben und 15 Minuten köcheln, bis der Kürbis weich ist. Kichererbsen zugeben und 3 Minuten mitkochen.",
"Spinat unterheben, mit Limettensaft und Salz abschmecken und mit Reis und gerösteten Cashews servieren."],
"Goldgelb, samtig und wärmend – Herbst trifft Thai-Küche.",
occ='mealprep,gaeste')
CH['kuerbis_kichererbsen_curry']='Neu (Kürbis-Saison).'

R('blumenkohl_erbsen_curry','Gemüse-Curry mit Blumenkohl und Erbsen','lunch','curry','g',4,15,25,"""
1 | Blumenkohl (ca. 700 g) | blumenkohl=700
2 | Kartoffeln | kartoffel=250
200 g | Erbsen (TK) | erbsen
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 cm | Ingwer | ingwer
2 EL | Rapsöl | rapsoel
2 TL | Garam Masala oder Currypulver, 1 TL Kurkuma | currypulver
1 Dose | stückige Tomaten (400 g) | tomaten_dose
200 g | Naturjoghurt | joghurt
200 g | Basmatireis | reis
2 EL | Koriander | koriander
"""+S%4,["Reis garen. Blumenkohl in kleine Röschen teilen, Kartoffeln würfeln, Zwiebel, Knoblauch und Ingwer fein hacken.",
"Öl erhitzen, Zwiebel goldgelb braten, Knoblauch, Ingwer und Gewürze 1 Minute mitrösten.",
"Kartoffeln, Blumenkohl, Tomaten und 150 ml Wasser zugeben und zugedeckt 15 Minuten köcheln. Erbsen zugeben und 3 Minuten mitgaren.",
"Vom Herd nehmen, die Hälfte des Joghurts einrühren und abschmecken. Mit Reis, restlichem Joghurt und Koriander servieren."],
"Wie Aloo Gobi aus dem Lieblingsinder: würzig, gemüsig und mit kühlem Joghurt.",
occ='mealprep,familie')
CH['blumenkohl_erbsen_curry']='Ersetzt 14 Vorlage-„Currys“ ohne Currypulver oder Flüssigkeit.'

R('haehnchenbrust_curry_spinat_kartoffeln_114','Hähnchen-Curry mit Spinat und Kartoffeln','lunch','curry','g',4,15,25,"""
500 g | Hähnchenbrust | haehnchenbrust
500 g | Kartoffeln | kartoffel
200 g | Babyspinat | spinat
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
2 TL | Currypulver | currypulver
1 Dose | stückige Tomaten (400 g) | tomaten_dose
200 ml | Kokosmilch | kokosmilch
"""+S%4,["Kartoffeln schälen und würfeln, Hähnchen in mundgerechte Stücke schneiden. Zwiebel, Knoblauch und Ingwer hacken.",
"Öl erhitzen, Hähnchen rundum anbraten, salzen und herausnehmen. Zwiebel, Knoblauch und Ingwer im Bratfett anschwitzen und Curry 1 Minute mitrösten.",
"Kartoffeln, Tomaten, Kokosmilch und 150 ml Wasser zugeben und 15 Minuten köcheln, bis die Kartoffeln fast weich sind.",
"Hähnchen zurück in den Topf geben und 5 Minuten mitköcheln, bis es durchgegart ist. Spinat unterheben und abschmecken."],
"Ein Curry, das die ganze Familie mag: zartes Hähnchen, Kartoffeln und viel Spinat.",
occ='familie,mealprep',kid=True)
CH['haehnchenbrust_curry_spinat_kartoffeln_114']='Jetzt mit Currypulver, Tomaten und Kokosmilch (vorher nur Hähnchen, Spinat, Kartoffeln und „nach Packungsanweisung garen“).'

R('garnelen_curry_kokos_paprika','Garnelen-Curry mit Kokos und Paprika','lunch','curry','g',4,10,15,"""
400 g | Garnelen (TK, aufgetaut) | garnelen
2 | rote Paprika | paprika
150 g | Zuckerschoten | zuckerschoten
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 EL | Kokosöl | kokosoel
1 EL | rote Currypaste | currypaste
400 ml | Kokosmilch | kokosmilch
1 EL | Sojasauce | sojasauce
1 | Limette | limette
200 g | Jasminreis | reis
1 Handvoll | Thai-Basilikum oder Koriander | basilikum
""",["Reis garen. Paprika in Streifen, Zwiebel in Spalten schneiden, Knoblauch hacken.",
"Kokosöl erhitzen, Zwiebel und Knoblauch anschwitzen, Currypaste 1 Minute mitrösten. Kokosmilch zugeben und aufkochen.",
"Paprika und Zuckerschoten 4 Minuten darin garen. Garnelen zugeben und 3–4 Minuten ziehen lassen, bis sie rosa sind.",
"Mit Sojasauce und Limettensaft abschmecken und mit Basilikum und Reis servieren."],
"Knackige Garnelen in duftender roter Kokos-Currysauce – in 25 Minuten auf dem Tisch.",
occ='schnell,gaeste')
CH['garnelen_curry_kokos_paprika']='Ersetzt die Vorlage-Garnelen-Currys.'

R('lachs_kokos_curry_bohnen','Lachs-Kokos-Curry mit grünen Bohnen','lunch','curry','s',4,10,20,"""
500 g | Lachsfilet | lachs
400 g | grüne Bohnen | gruene_bohnen
1 | rote Paprika | paprika
1 | Zwiebel | zwiebel
2 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
1 EL | gelbe Currypaste | currypaste
400 ml | Kokosmilch | kokosmilch
1 | Limette | limette
1 EL | Sojasauce | sojasauce
"""+S%1,["Bohnen putzen und halbieren, Paprika in Streifen, Zwiebel in Spalten schneiden, Ingwer hacken. Lachs in große Würfel schneiden.",
"Öl erhitzen, Zwiebel und Ingwer anschwitzen, Currypaste mitrösten. Kokosmilch zugeben, Bohnen darin 6 Minuten köcheln, Paprika 2 Minuten mitgaren.",
"Lachs leicht salzen, in das Curry legen und bei kleiner Hitze 5–6 Minuten garziehen lassen.",
"Mit Limettensaft und Sojasauce abschmecken. Für Low Carb ohne Beilage, sonst mit Reis servieren."],
"Zarter Lachs in sämiger Kokossauce mit knackigen Bohnen – ganz ohne Beilage ein volles Essen.",
occ='schnell,gaeste')
CH['lachs_kokos_curry_bohnen']='Ersetzt mehrere Lachs-Vorlagen.'

R('eier_curry_spinat_tomaten','Eier-Curry mit Spinat und Tomaten','lunch','curry','g',4,10,20,"""
8 | Eier | ei
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
2 TL | Currypulver, ½ TL Kurkuma | currypulver
1 Dose | stückige Tomaten (400 g) | tomaten_dose
200 ml | Kokosmilch | kokosmilch
200 g | Babyspinat | spinat
200 g | Basmatireis | reis
"""+S%3,["Reis garen. Eier 8 Minuten kochen, abschrecken, pellen und rundum einritzen, damit sie die Sauce aufnehmen.",
"Zwiebel, Knoblauch und Ingwer hacken und im Öl 4 Minuten anbraten, Gewürze 1 Minute mitrösten.",
"Tomaten und Kokosmilch zugeben und 10 Minuten sämig köcheln. Spinat unterheben und die Eier darin 3 Minuten erwärmen.",
"Abschmecken und mit Reis servieren."],
"Günstig, schnell und überraschend gut: Eier in würziger Tomaten-Kokos-Sauce.",
occ='familie')
CH['eier_curry_spinat_tomaten']='Ersetzt die Vorlage-Ei-Currys (z. B. „Ei-Curry mit Grüne Bohnen“).'

R('chili_con_carne','Chili con Carne','lunch','eintopf','hw',4,15,40,"""
400 g | Rinderhackfleisch | rinderhack
1 Dose | Kidneybohnen (240 g abgetropft) | kidneybohnen
140 g | Mais | mais
2 | Zwiebeln | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 | rote Paprika | paprika
1 EL | Rapsöl | rapsoel
2 EL | Tomatenmark | tomatenmark
1 Dose | stückige Tomaten (400 g) | tomaten_dose
200 ml | Gemüsebrühe | gemuesebruehe
2 TL | Kreuzkümmel, Paprika edelsüß, Chili nach Geschmack | gewuerz
10 g | Zartbitterschokolade | zartbitter
150 g | Naturjoghurt | joghurt
"""+S%4,["Zwiebeln, Knoblauch und Paprika würfeln.",
"Öl stark erhitzen und das Hack krümelig braun anbraten. Zwiebeln, Knoblauch und Paprika 3 Minuten mitbraten, Gewürze und Tomatenmark kurz mitrösten.",
"Tomaten und Brühe zugeben und zugedeckt 25 Minuten köcheln. Bohnen und Mais zugeben und weitere 10 Minuten offen einkochen lassen.",
"Schokolade einrühren (macht es rund), abschmecken und mit Joghurt servieren. Dazu passen Brot oder Reis."],
"Der Party-Klassiker, langsam geschmort – mit einem Stück Schokolade als Geheimzutat.",
occ='gaeste,mealprep,familie')
CH['chili_con_carne']='Neu.'

R('weisse_bohnen_eintopf_rosmarin','Weiße-Bohnen-Eintopf mit Tomaten und Rosmarin','lunch','eintopf','hw',4,10,25,"""
2 Dosen | weiße Bohnen (480 g abgetropft) | weisse_bohnen
1 | Zwiebel | zwiebel
2 | Karotten | karotte
2 Stangen | Staudensellerie | sellerie
3 | Knoblauchzehen | knoblauch=12
2 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
500 ml | Gemüsebrühe | gemuesebruehe
2 Zweige | Rosmarin | rosmarin
150 g | Grünkohl oder Spinat | spinat
40 g | Parmesan | parmesan
4 Scheiben | Ciabatta oder Vollkornbrot | vk_brot
"""+S%3,["Zwiebel, Karotten, Sellerie und Knoblauch fein würfeln.",
"Öl erhitzen und das Gemüse 6 Minuten weich dünsten. Rosmarin, Tomaten, Brühe und Bohnen zugeben.",
"20 Minuten köcheln lassen. Ein Viertel der Bohnen mit dem Löffel zerdrücken, das macht den Eintopf sämig. Spinat unterheben.",
"Abschmecken, Rosmarin entfernen und mit Parmesan, einem Schuss Olivenöl und Brot servieren."],
"Toskanische Bauernküche: cremige Bohnen, Rosmarin und ein guter Schuss Olivenöl.",
occ='mealprep')
CH['weisse_bohnen_eintopf_rosmarin']='Ersetzt Vorlage-Bohneneintöpfe.'

R('rindergulasch_paprika','Rindergulasch mit Paprika','lunch','eintopf','w',4,20,120,"""
600 g | Rindergulasch | rindergulasch
3 | Zwiebeln | zwiebel
2 | rote Paprika | paprika
2 | Knoblauchzehen | knoblauch=8
1 EL | Butterschmalz | butterschmalz
2 EL | Tomatenmark | tomatenmark
2 EL | edelsüßes Paprikapulver | gewuerz
600 ml | Rinderbrühe | gemuesebruehe
1 TL | Kümmel, Majoran | gewuerz
500 g | Kartoffeln oder Vollkornnudeln | kartoffel
"""+S%5,["Fleisch trocken tupfen, Zwiebeln grob würfeln, Paprika in Streifen schneiden.",
"Butterschmalz stark erhitzen und das Fleisch portionsweise kräftig anbraten. Zwiebeln zugeben und 8 Minuten goldbraun schmoren.",
"Tomatenmark und Paprikapulver kurz mitrösten (nicht verbrennen lassen), mit Brühe ablöschen. Kümmel und Majoran zugeben und zugedeckt bei kleiner Hitze 1 ½ Stunden schmoren.",
"Paprika zugeben und weitere 20–30 Minuten schmoren, bis das Fleisch zart ist. Abschmecken und mit Salzkartoffeln servieren."],
"Langsam geschmort, bis das Fleisch zerfällt – Sonntagsessen für kalte Wintertage.",
occ='wochenende,gaeste,mealprep',kid=True,tip="Am Vortag kochen: Gulasch schmeckt aufgewärmt am besten.")
CH['rindergulasch_paprika']='Ersetzt Vorlage-Rindfleischeintöpfe (z. B. 1 Portion mit 555 kcal und 76 g Eiweiß).'

R('graupen_gemuese_eintopf','Gemüseeintopf mit Graupen','lunch','eintopf','w',4,15,40,"""
120 g | Perlgraupen | graupen
2 | Karotten | karotte
1 | Pastinake | pastinake
150 g | Knollensellerie | knollensellerie
1 Stange | Lauch | lauch
300 g | Kartoffeln | kartoffel
200 g | Wirsing | wirsing
1 | Zwiebel | zwiebel
1 EL | Rapsöl | rapsoel
1,5 l | Gemüsebrühe | gemuesebruehe=1500
1 | Lorbeerblatt, Majoran | gewuerz
4 | Mettenden oder 1 Dose weiße Bohnen | weisse_bohnen=240
2 EL | Petersilie | petersilie
"""+S%5,["Graupen in einem Sieb abspülen. Gemüse schälen und würfeln, Lauch und Wirsing in Streifen schneiden.",
"Öl erhitzen, Zwiebel und Lauch anschwitzen. Graupen, Wurzelgemüse, Kartoffeln, Lorbeer und Brühe zugeben und 30 Minuten köcheln.",
"Wirsing und Bohnen (oder Mettenden in Scheiben) zugeben und 10 Minuten mitgaren.",
"Mit Majoran, Salz und Pfeffer abschmecken und mit Petersilie servieren."],
"Deftig, sättigend und günstig – ein Eintopf wie aus Großmutters Küche.",
occ='mealprep,familie',kid=True)
CH['graupen_gemuese_eintopf']='Neu (Winter). Nährwerte mit Bohnen gerechnet.'

R('ratatouille_kichererbsen','Ratatouille mit Kichererbsen','lunch','eintopf','s',4,20,35,"""
1 | Aubergine | aubergine
2 | Zucchini | zucchini
2 | Paprika (rot und gelb) | paprika
1 | Zwiebel | zwiebel
3 | Knoblauchzehen | knoblauch=12
3 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
1 TL | Kräuter der Provence | kraeuter
1 Handvoll | Basilikum | basilikum
100 g | Feta oder Ziegenfrischkäse | feta
4 Scheiben | Baguette oder Vollkornbrot | vk_brot
"""+S%4,["Aubergine, Zucchini und Paprika in 2 cm große Würfel schneiden, Zwiebel und Knoblauch hacken.",
"2 EL Öl in einem breiten Topf stark erhitzen und die Aubergine 5 Minuten anbraten, dann Zucchini und Paprika zugeben und weitere 5 Minuten braten.",
"Restliches Öl, Zwiebel und Knoblauch zugeben, Tomaten, Kichererbsen und Kräuter einrühren und 20 Minuten sanft schmoren.",
"Abschmecken, Basilikum unterheben und mit zerbröseltem Feta und Brot servieren."],
"Provence-Sommer im Topf: geschmortes Gemüse, Kräuter und viel Olivenöl.",
occ='mealprep,gaeste',tip="Schmeckt warm, lauwarm und kalt – am nächsten Tag noch besser.")
CH['ratatouille_kichererbsen']='Neu.'
