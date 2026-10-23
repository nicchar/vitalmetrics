from build import R
CH={}
S='| Salz, Pfeffer | salz=%s'
R('kuerbis_pasta_salbei','Kürbis-Pasta mit Salbei und Parmesan','lunch','pasta','h',4,15,25,"""
600 g | Hokkaido-Kürbis | hokkaido
350 g | Vollkorn- oder Hartweizenpasta | vk_nudeln
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
300 ml | Gemüsebrühe | gemuesebruehe
100 g | Frischkäse | frischkaese
1 EL | Butter | butter
12 | Salbeiblätter | salbei
50 g | Parmesan | parmesan
2 EL | Walnüsse oder Kürbiskerne | walnuesse
1 Prise | Muskat, Chili | gewuerz
"""+S%4,["Kürbis entkernen und mit Schale klein würfeln. Zwiebel und Knoblauch hacken.",
"Öl erhitzen, Zwiebel und Knoblauch anschwitzen, Kürbis zugeben, mit Brühe ablöschen und zugedeckt 15 Minuten weich köcheln. Mit Frischkäse fein pürieren und mit Muskat, Salz und Pfeffer abschmecken.",
"Pasta in Salzwasser kochen, etwas Nudelwasser auffangen. Butter in einer Pfanne aufschäumen und die Salbeiblätter darin knusprig braten.",
"Pasta mit der Kürbissauce und etwas Nudelwasser mischen, mit Parmesan, Salbeibutter und gehackten Walnüssen servieren."],
"Samtige, goldorange Sauce, knuspriger Salbei in brauner Butter – Herbst auf der Gabel.",
occ='feierabend,gaeste',kid=True)
CH['kuerbis_pasta_salbei']='Neu (Kürbis-Saison).'

R('ofen_feta_pasta','Ofen-Feta-Pasta mit Kirschtomaten','lunch','pasta','s',4,10,30,"""
200 g | Feta (1 Block) | feta
500 g | Kirschtomaten | kirschtomaten=500
2 | Knoblauchzehen | knoblauch=8
3 EL | Olivenöl | olivenoel
1 TL | Oregano, Chiliflocken | gewuerz
350 g | Vollkornpasta | vk_nudeln
150 g | Babyspinat | spinat
1 Handvoll | Basilikum | basilikum
"""+S%3,["Backofen auf 200 °C vorheizen. Tomaten und Knoblauch in eine Auflaufform geben, den Feta-Block in die Mitte legen, mit Öl beträufeln und mit Oregano, Chili, Salz und Pfeffer würzen.",
"30 Minuten backen, bis die Tomaten aufplatzen und der Feta weich ist.",
"Währenddessen die Pasta kochen. Feta und Tomaten direkt in der Form zu einer cremigen Sauce verrühren.",
"Pasta und Spinat unterheben, bis er zusammenfällt, und mit Basilikum servieren."],
"Der Internet-Hit zu Recht: Der Ofen macht aus Feta und Tomaten eine cremige Sauce, ganz ohne Aufwand.",
occ='feierabend,familie',kid=True)
CH['ofen_feta_pasta']='Neu. Spinat für mehr Gemüse.'

R('spaghetti_bolognese','Spaghetti Bolognese mit Gemüse','lunch','pasta','g',4,15,45,"""
400 g | Rinderhackfleisch | rinderhack
1 | Zwiebel | zwiebel
2 | Karotten | karotte
2 Stangen | Staudensellerie | sellerie
2 | Knoblauchzehen | knoblauch=8
1 EL | Olivenöl | olivenoel
2 EL | Tomatenmark | tomatenmark
700 ml | passierte Tomaten | passata
100 ml | Gemüsebrühe oder Rotwein | gemuesebruehe
1 TL | Oregano | gewuerz
300 g | Vollkornspaghetti | vk_nudeln
40 g | Parmesan | parmesan
"""+S%4,["Zwiebel, Karotten, Sellerie und Knoblauch sehr fein würfeln.",
"Öl stark erhitzen und das Hack krümelig braun anbraten. Gemüse zugeben und 5 Minuten mitbraten, Tomatenmark 1 Minute mitrösten.",
"Mit Brühe ablöschen, passierte Tomaten und Oregano zugeben und zugedeckt mindestens 30 Minuten sanft köcheln lassen.",
"Spaghetti kochen, abschmecken und mit Parmesan servieren."],
"Lange geschmort und mit viel Gemüse – die Bolognese, die jedes Kind liebt.",
occ='familie,mealprep',kid=True,tip="Doppelte Menge kochen und portionsweise einfrieren.")
CH['spaghetti_bolognese']='Ersetzt Vorlage-Rinderhack-Varianten.'

R('pasta_spinat_ricotta','Pasta mit Spinat-Ricotta-Sauce','lunch','pasta','g',4,10,15,"""
350 g | Vollkornpasta | vk_nudeln
300 g | Blattspinat (frisch oder TK) | spinat
250 g | Ricotta | ricotta
1 | Knoblauchzehe | knoblauch=4
1 EL | Olivenöl | olivenoel
1 | Zitrone (Schale) | gewuerz
40 g | Parmesan | parmesan
2 EL | Pinienkerne oder Mandeln | mandeln
1 Prise | Muskat | gewuerz
"""+S%3,["Pasta in Salzwasser kochen, 1 Tasse Nudelwasser auffangen.",
"Knoblauch im Öl anschwitzen, Spinat zugeben und zusammenfallen lassen.",
"Ricotta, Parmesan, Zitronenschale und Muskat einrühren und mit Nudelwasser zu einer cremigen Sauce verrühren.",
"Mit der Pasta mischen und mit gerösteten Mandeln servieren."],
"Grün, cremig und zitronig frisch – in 20 Minuten auf dem Tisch.",
occ='feierabend,schnell',kid=True)
CH['pasta_spinat_ricotta']='Neu.'

R('pasta_raeucherlachs_erbsen','Pasta mit Räucherlachs, Erbsen und Zitrone','lunch','pasta','g',4,10,15,"""
350 g | Pasta (Penne oder Farfalle) | vk_nudeln
200 g | Räucherlachs | raeucherlachs
200 g | Erbsen (TK) | erbsen
150 g | Frischkäse | frischkaese
1 | Zitrone | zitrone=30
1 Bund | Dill | dill
| Pfeffer | pfeffer
""",["Pasta in Salzwasser kochen, Erbsen 3 Minuten vor Ende mitkochen. 1 Tasse Nudelwasser auffangen.",
"Frischkäse mit Zitronenschale, Zitronensaft und etwas Nudelwasser glatt rühren.",
"Pasta und Erbsen abgießen, mit der Sauce mischen und den Lachs in Streifen unterheben (nicht mehr kochen).",
"Mit Dill und Pfeffer servieren."],
"Rosa Lachs, grüne Erbsen und Zitrone – frisch, fein und sehr schnell.",
occ='feierabend,schnell')
CH['pasta_raeucherlachs_erbsen']='Neu.'

R('pasta_thunfisch_tomate','Pasta mit Thunfisch-Tomaten-Sauce','lunch','pasta','g',4,10,20,"""
350 g | Vollkornspaghetti | vk_nudeln
2 Dosen | Thunfisch im eigenen Saft (260 g abgetropft) | thunfisch=260
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 EL | Olivenöl | olivenoel
2 EL | Kapern | kapern
10 | schwarze Oliven | oliven_schwarz
1 Prise | Chiliflocken | gewuerz
2 EL | Petersilie | petersilie
"""+S%3,["Pasta in Salzwasser kochen.",
"Zwiebel und Knoblauch im Öl anschwitzen, Tomaten, Chili, Kapern und Oliven zugeben und 10 Minuten köcheln.",
"Thunfisch zerpflücken und in der Sauce nur erwärmen.",
"Mit der Pasta mischen und mit Petersilie servieren."],
"Vorratsschrank-Retter mit italienischer Seele: Kapern, Oliven und Thunfisch.",
occ='feierabend,schnell')
CH['pasta_thunfisch_tomate']='Ersetzt Vorlage-Thunfisch-Varianten.'

R('pilzrisotto','Pilzrisotto mit Parmesan','lunch','pasta','h',4,15,30,"""
300 g | Risottoreis | risottoreis
500 g | Champignons oder Pilzmix | champignons
1 | Zwiebel | zwiebel
2 EL | Olivenöl | olivenoel
100 ml | Weißwein (oder Brühe) | weisswein
1 l | heiße Gemüsebrühe | gemuesebruehe=1000
60 g | Parmesan | parmesan
1 EL | Butter | butter
2 EL | Petersilie, Thymian | petersilie
2 Handvoll | Rucola als Salat | rucola=60
"""+S%2,["Pilze putzen und in Scheiben schneiden, Zwiebel fein würfeln.",
"1 EL Öl stark erhitzen, Pilze braun braten, salzen und herausnehmen.",
"Restliches Öl erhitzen, Zwiebel glasig dünsten, Reis 1 Minute mitrösten und mit Wein ablöschen. Nach und nach heiße Brühe zugießen und unter Rühren 18–20 Minuten garen, bis der Reis cremig und noch bissfest ist.",
"Pilze, Parmesan und Butter unterrühren, 2 Minuten ruhen lassen, mit Kräutern bestreuen und mit Rucola servieren."],
"Cremig gerührt, nach Wald duftend – ein Risotto, das sich nach Wochenende anfühlt.",
occ='gaeste,wochenende')
CH['pilzrisotto']='Neu.'

R('spargelrisotto','Spargelrisotto mit Zitrone','lunch','pasta','f',4,15,30,"""
300 g | Risottoreis | risottoreis
500 g | grüner Spargel | spargel
150 g | Erbsen (TK) | erbsen
1 | Zwiebel | zwiebel
1 EL | Olivenöl | olivenoel
100 ml | Weißwein (oder Brühe) | weisswein
1 l | heiße Gemüsebrühe | gemuesebruehe=1000
60 g | Parmesan | parmesan
1 EL | Butter | butter
1 | Zitrone (Schale und Saft) | zitrone=30
"""+S%2,["Spargel im unteren Drittel schälen, holzige Enden abschneiden, in Stücke schneiden, Spitzen beiseitelegen.",
"Zwiebel im Öl glasig dünsten, Reis 1 Minute mitrösten, mit Wein ablöschen und nach und nach Brühe zugießen.",
"Nach 10 Minuten die Spargelstücke, nach weiteren 5 Minuten Spitzen und Erbsen zugeben und fertig garen.",
"Parmesan, Butter, Zitronenschale und -saft unterrühren und kurz ruhen lassen."],
"Frühling im Topf: grüner Spargel, zarte Erbsen und frische Zitrone.",
occ='gaeste')
CH['spargelrisotto']='Neu (Frühling).'

R('kaesespaetzle','Käsespätzle mit Röstzwiebeln','lunch','pasta','w',4,15,25,"""
400 g | Spätzle (getrocknet oder frisch aus dem Kühlregal) | spaetzle
150 g | Bergkäse, gerieben | bergkaese
3 | Zwiebeln | zwiebel
2 EL | Butter | butter
1 Prise | Muskat | gewuerz
1 Kopf | Kopfsalat mit Essig-Öl-Dressing | kopfsalat=300
1 EL | Rapsöl, 1 EL Essig für den Salat | rapsoel
2 EL | Schnittlauch | schnittlauch
"""+S%4,["Zwiebeln in feine Ringe schneiden und in 1 EL Butter bei mittlerer Hitze 15 Minuten langsam goldbraun rösten. Backofen auf 180 °C vorheizen.",
"Spätzle in Salzwasser nach Packungsangabe garen und abgießen.",
"Spätzle und Käse abwechselnd in eine gebutterte Form schichten, mit Muskat und Pfeffer würzen und 10 Minuten im Ofen schmelzen lassen.",
"Mit Röstzwiebeln und Schnittlauch bestreuen und mit grünem Salat servieren."],
"Allgäuer Seelenfutter: fädenziehender Bergkäse, süße Röstzwiebeln und ein frischer Salat dazu.",
occ='wochenende,familie',kid=True,tip="Der grüne Salat gehört dazu – er macht das Essen leicht genug für einen Wochentag.")
CH['kaesespaetzle']='Neu (Genuss-Klassiker). Salat als fester Bestandteil eingeplant.'

R('nudelauflauf_brokkoli_schinken','Nudelauflauf mit Brokkoli und Schinken','lunch','pasta','g',4,15,30,"""
300 g | Vollkornpenne | vk_nudeln
500 g | Brokkoli | brokkoli
150 g | Kochschinken | kochschinken
3 | Eier | ei
200 ml | Milch | milch
100 g | Schmand | schmand
100 g | Gouda, gerieben | gouda
1 Prise | Muskat | gewuerz
"""+S%3,["Backofen auf 200 °C vorheizen. Nudeln 3 Minuten kürzer als angegeben kochen, Brokkoli-Röschen die letzten 3 Minuten mitgaren. Abgießen.",
"Eier mit Milch, Schmand, Muskat, Salz und Pfeffer verquirlen.",
"Nudeln, Brokkoli und Schinkenwürfel in eine Form geben, Guss darübergießen und mit Käse bestreuen.",
"25 Minuten goldbraun backen."],
"Der Auflauf, um den sich alle streiten – mit knuspriger Käsekruste.",
occ='familie,mealprep',kid=True)
CH['nudelauflauf_brokkoli_schinken']='Neu.'

R('asia_nudeln_erdnuss','Asia-Nudeln mit Gemüse und Erdnusssauce','lunch','pasta','g',4,15,10,"""
250 g | Reisnudeln oder Vollkornspaghetti | reisnudeln
200 g | Naturtofu | tofu
2 | Karotten | karotte
1 | rote Paprika | paprika
200 g | Weißkohl oder Spitzkohl | spitzkohl
150 g | Edamame (TK) | edamame
4 EL | Erdnussmus | erdnussmus
3 EL | Sojasauce | sojasauce
2 | Limetten | limette
1 EL | Ahornsirup | ahornsirup
2 cm | Ingwer | ingwer
1 EL | Rapsöl | rapsoel
3 EL | Erdnüsse, Koriander | erdnuesse=20
""",["Nudeln nach Packungsangabe garen und abschrecken. Gemüse in feine Streifen schneiden, Tofu würfeln.",
"Erdnussmus mit Sojasauce, Limettensaft, Ahornsirup, geriebenem Ingwer und 6 EL warmem Wasser glatt rühren.",
"Öl erhitzen, Tofu knusprig braten, Gemüse und Edamame 3 Minuten mitbraten.",
"Nudeln und Sauce unterheben, mit Erdnüssen und Koriander servieren – warm oder kalt."],
"Nussig, frisch, ein bisschen scharf – schmeckt warm zum Abendessen und kalt am nächsten Tag im Büro.",
occ='mealprep,mitnehmen,feierabend')
CH['asia_nudeln_erdnuss']='Neu (vegan).'

R('pasta_e_fagioli','Pasta e Fagioli','lunch','suppe','hw',4,10,25,"""
1 Dose | Borlotti- oder weiße Bohnen (240 g abgetropft) | weisse_bohnen
150 g | kleine Nudeln (Ditalini) | nudeln
1 | Zwiebel | zwiebel
1 | Karotte | karotte
1 Stange | Staudensellerie | sellerie
2 | Knoblauchzehen | knoblauch=8
2 EL | Olivenöl | olivenoel
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 l | Gemüsebrühe | gemuesebruehe=1000
1 Zweig | Rosmarin | rosmarin
40 g | Parmesan | parmesan
"""+S%3,["Zwiebel, Karotte, Sellerie und Knoblauch fein würfeln und im Öl 5 Minuten anschwitzen.",
"Tomaten, Brühe, Rosmarin und Bohnen zugeben und 10 Minuten köcheln. Ein Drittel der Bohnen grob zerdrücken.",
"Nudeln zugeben und darin garen, bis sie al dente sind – die Suppe wird dabei schön sämig.",
"Rosmarin entfernen, abschmecken und mit Parmesan und einem Schuss Olivenöl servieren."],
"Italienische Großmutterküche: halb Suppe, halb Pasta, ganz gemütlich.",
occ='familie,mealprep',kid=True)
CH['pasta_e_fagioli']='Neu. Ohne Parmesan vegan.'

R('haehnchen_paprika_pasta','Hähnchen-Paprika-Pasta','lunch','pasta','g',4,15,20,"""
400 g | Hähnchenbrust | haehnchenbrust
2 | rote Paprika | paprika
1 | Zwiebel | zwiebel
1 EL | Olivenöl | olivenoel
1 TL | Paprikapulver | gewuerz
400 ml | passierte Tomaten | passata
100 g | Frischkäse | frischkaese
300 g | Vollkornpenne | vk_nudeln
1 Handvoll | Basilikum | basilikum
"""+S%3,["Pasta kochen. Hähnchen in Streifen, Paprika in Würfel, Zwiebel fein schneiden.",
"Öl erhitzen, Hähnchen 4 Minuten anbraten, salzen und herausnehmen. Paprika und Zwiebel 4 Minuten braten, Paprikapulver kurz mitrösten.",
"Passierte Tomaten und Frischkäse einrühren und 5 Minuten köcheln. Hähnchen zugeben und 2 Minuten ziehen lassen.",
"Mit der Pasta mischen und mit Basilikum servieren."],
"Cremige Paprika-Tomaten-Sauce mit zartem Hähnchen – ein sicherer Familienliebling.",
occ='familie,feierabend',kid=True)
CH['haehnchen_paprika_pasta']='Ersetzt Vorlage-Hähnchenbrust-Varianten.'

R('pasta_garnelen_tomaten','Pasta mit Garnelen, Knoblauch und Tomaten','lunch','pasta','s',4,10,15,"""
350 g | Linguine oder Spaghetti | nudeln
400 g | Garnelen (TK, aufgetaut) | garnelen
400 g | Kirschtomaten | kirschtomaten=400
4 | Knoblauchzehen | knoblauch=16
3 EL | Olivenöl | olivenoel
1 Prise | Chiliflocken | gewuerz
1 | Zitrone | zitrone=30
1 Handvoll | Petersilie und Rucola | rucola=40
"""+S%3,["Pasta in Salzwasser kochen, 1 Tasse Nudelwasser auffangen.",
"Knoblauch in Scheiben mit Chili im Öl sanft anschwitzen, Tomaten halbieren und 3 Minuten mitbraten.",
"Garnelen zugeben und 3 Minuten braten, bis sie rosa sind.",
"Pasta mit etwas Nudelwasser, Zitronensaft und Kräutern unterschwenken und sofort servieren."],
"Wie in einer Trattoria am Meer: Knoblauch, Garnelen und süße Tomaten.",
occ='gaeste,feierabend')
CH['pasta_garnelen_tomaten']='Ersetzt Vorlage-Garnelen-Varianten.'
