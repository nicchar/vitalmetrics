from build import R
CH={}  # Prüfprotokoll: id -> Änderungen
N='nicole'
R('avocado_ei_toast','Avocado-Ei-Vollkornbrot','breakfast','brot','g',2,10,8,"""
4 Scheiben | Vollkornbrot | vk_brot
1 | reife Avocado | avocado
2 | Eier | ei
1 TL | Zitronensaft | zitronensaft
4 | Radieschen | radieschen
1 Beet | Kresse | kresse=10
| Salz, Pfeffer | salz=1
""",["Eier in kochendem Wasser 7–8 Minuten garen, kalt abschrecken und pellen.",
"Avocado halbieren, den Stein entfernen und das Fruchtfleisch mit Zitronensaft zerdrücken. Mit wenig Salz und Pfeffer würzen.",
"Brot nach Wunsch toasten und mit der Avocado bestreichen. Eier und Radieschen in Scheiben schneiden und darauf verteilen. Mit Kresse servieren."],
"Cremige Avocado, wachsweiches Ei und knackige Radieschen – ein Frühstück, das nach Wochenende schmeckt.",
occ='brotzeit,fruehstueck',tip="Avocadocreme am besten frisch zubereiten. Für die Lunchbox Brot und Belag getrennt einpacken.",kid=True,photo='avocado-ei-vollkornbrot.webp',src=N)
CH['avocado_ei_toast']='Rezept von Nicole übernommen (ersetzt den alten Avocado-Ei-Toast). Kresse-Menge konkretisiert.'

R('kraeuterquark_gurkenbrot','Kräuterquark mit Gurke auf Brot','breakfast','brot','fs',2,8,0,"""
4 Scheiben | Vollkornbrot | vk_brot
150 g | Magerquark | magerquark
1 EL | Naturjoghurt | joghurt
½ | Salatgurke | gurke=200
1 EL | Schnittlauch, fein geschnitten | schnittlauch
1 TL | Dill, gehackt | dill
| Salz, Pfeffer | salz=1
""",["Quark mit Joghurt glatt rühren. Schnittlauch und Dill fein schneiden und unterheben, mit Salz und Pfeffer abschmecken.",
"Gurke waschen und in dünne Scheiben oder Streifen schneiden.",
"Kräuterquark auf das Brot streichen und mit Gurke belegen."],
"Frisch, kühl und herrlich unkompliziert – Kräuterquark wie bei Oma, nur mit ganz viel Gurke.",
occ='brotzeit,fruehstueck',tip="Kräuterquark abgedeckt kühl lagern und das Brot erst kurz vor dem Essen bestreichen.",kid=True,photo='kraeuterquark-gurkenbrot.webp',src=N)
CH['kraeuterquark_gurkenbrot']='Mengenangabe Gurke korrigiert (0.5 Stück → ½ Gurke, ca. 200 g); Salz beim Abschmecken ergänzt.'

R('overnight_oats_chia_beeren','Beeren-Overnight-Oats mit Chia','breakfast','bowl_suess','g',2,10,0,"""
100 g | Haferflocken | haferflocken
200 g | Naturjoghurt | joghurt
150 ml | Milch | milch
150 g | Beeren, frisch oder tiefgekühlt | beeren
1 EL | Chiasamen | chiasamen
½ TL | Zimt | gewuerz
""",["Haferflocken, Joghurt, Milch, Chiasamen und Zimt in einer Schüssel verrühren.",
"Auf zwei verschließbare Gläser verteilen und abgedeckt über Nacht in den Kühlschrank stellen.",
"Morgens die Beeren daraufgeben. Tiefgekühlte Beeren am Vorabend schon mit ins Glas geben, dann tauen sie über Nacht auf."],
"Abends zwei Minuten, morgens sofort fertig: cremige Haferflocken mit fruchtigen Beeren.",
occ='mealprep,mitnehmen,fruehstueck',tip="In zwei Gläsern vorbereitet hält sich das Frühstück zwei Tage im Kühlschrank. Sind die Haferflocken zu fest, einen Schluck Milch unterrühren.",kid=True,photo='beeren-overnight-oats.webp',src=N,wait=480)
CH['overnight_oats_chia_beeren']='Pin-Rezept und Nicoles „Beeren-Overnight-Oats“ zu einem Rezept zusammengeführt (ID vom Pin, Inhalt und Foto von Nicole).'

R('mini_gemueseeier','Mini-Gemüseeier aus dem Ofen','snack','herzhaft','g',3,12,20,"""
4 | Eier | ei
50 ml | Milch | milch
50 g | Babyspinat | spinat
½ | rote Paprika | paprika
40 g | Mais | mais
30 g | geriebener Käse (z. B. Gouda) | gouda
1 TL | Rapsöl für die Form | rapsoel
| Salz, Pfeffer | salz=1
""",["Backofen auf 180 °C Ober-/Unterhitze vorheizen. Sechs Mulden einer Muffinform leicht einölen.",
"Spinat und Paprika klein schneiden. Eier mit Milch, Salz und Pfeffer verquirlen, Gemüse, Mais und Käse einrühren.",
"Masse auf die sechs Mulden verteilen und 18–20 Minuten backen, bis die Eier gestockt sind. Kurz abkühlen lassen und aus der Form lösen."],
"Kleine, bunte Eier-Muffins zum Mitnehmen – warm und kalt ein Genuss.",
occ='mealprep,mitnehmen,familie',tip="Abgekühlt halten sie sich drei Tage im Kühlschrank. Dazu passen Gurken- oder Paprikasticks.",kid=True,photo='mini-gemueseeier.webp',src=N)
CH['mini_gemueseeier']='Rezept von Nicole übernommen (ersetzt Mini-Frittata-Muffins). Salz ergänzt.'

R('milde_linsen_tomaten_pasta','Milde Linsen-Tomaten-Pasta','lunch','pasta','g',4,15,25,"""
300 g | Vollkornnudeln | vk_nudeln
150 g | rote Linsen, trocken | linsen_rot
400 ml | passierte Tomaten | passata
500 ml | Gemüsebrühe | gemuesebruehe
1 | Karotte | karotte
1 | kleine Zucchini | zucchini=200
1 | Zwiebel | zwiebel
1 EL | Rapsöl | rapsoel
1 TL | Oregano | gewuerz
40 g | geriebener Parmesan (nach Wunsch) | parmesan
| Salz, Pfeffer | salz=3
""",["Zwiebel, Karotte und Zucchini fein würfeln. Linsen in einem Sieb abspülen.",
"Öl in einem Topf erhitzen und Zwiebel und Gemüse 3–4 Minuten anschwitzen. Linsen, passierte Tomaten, Brühe und Oregano zugeben.",
"Bei kleiner bis mittlerer Hitze 15–20 Minuten köcheln lassen, bis die Linsen zerfallen und die Sauce sämig ist. Bei Bedarf etwas Wasser ergänzen.",
"Währenddessen die Nudeln in Salzwasser nach Packungsangabe kochen. Sauce mild abschmecken, mit den Nudeln servieren und nach Wunsch Käse darüberstreuen."],
"Die Sauce schmeckt wie Bolognese, nur ganz ohne Fleisch – die Linsen zerfallen und machen sie herrlich sämig.",
occ='familie,mealprep',tip="Die Sauce lässt sich gut vorbereiten und getrennt von den Nudeln kühlen. Beim Aufwärmen etwas Wasser zugeben.",kid=True,photo='milde-linsen-tomaten-pasta.webp',src=N)
CH['milde_linsen_tomaten_pasta']='Reihenfolge der Schritte angepasst (Nudeln parallel zur Sauce). Ersetzt die geplante Linsen-Bolognese.'

R('lachs_kartoffel_brokkoli','Lachs mit Kartoffeln und Brokkoli','lunch','fisch','g',4,15,25,"""
500 g | Lachsfilet | lachs
700 g | kleine Kartoffeln | kartoffel
500 g | Brokkoli | brokkoli
1 | Zitrone | zitrone
1 EL | Olivenöl | olivenoel
1 EL | Dill, gehackt | dill
| Salz, Pfeffer | salz=3
""",["Kartoffeln waschen und in Salzwasser je nach Größe 15–20 Minuten garen.",
"Backofen auf 200 °C Ober-/Unterhitze vorheizen. Lachs in eine geölte Auflaufform legen, salzen, mit Zitronenscheiben und Dill belegen und 12–15 Minuten backen, bis er innen gerade glasig ist.",
"Brokkoli in Röschen teilen und 5–7 Minuten bissfest dämpfen. Alles zusammen anrichten und mit Zitronensaft beträufeln. Für Kinder die Gräten sorgfältig prüfen."],
"Saftiger Ofenlachs mit Zitrone und Dill – so einfach, dass er zum Familienklassiker wird.",
occ='familie',tip="Reste zügig abkühlen und abgedeckt im Kühlschrank lagern. Lachs schmeckt am nächsten Tag auch kalt auf Salat.",kid=True,photo='lachs-kartoffel-brokkoli.webp',src=N)
CH['lachs_kartoffel_brokkoli']='Rezept von Nicole übernommen (ersetzt den geplanten Ofenlachs). Garpunkt präzisiert.'

R('kichererbsen_couscous_salat','Kichererbsen-Couscous-Salat','lunch','salat','sg',4,20,5,"""
200 g | Couscous | couscous
250 ml | heiße Gemüsebrühe | gemuesebruehe
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
½ | Salatgurke | gurke=200
250 g | Kirschtomaten | kirschtomaten=250
80 g | Feta | feta
1 | Zitrone (Saft) | zitrone
2 EL | Olivenöl | olivenoel
2 EL | Petersilie, gehackt | petersilie
| Salz, Pfeffer | salz=2
""",["Couscous mit der heißen Brühe übergießen, abdecken und 5 Minuten quellen lassen. Mit einer Gabel auflockern und abkühlen lassen.",
"Kichererbsen abspülen und abtropfen lassen. Gurke würfeln, Tomaten halbieren, Petersilie hacken.",
"Zitronensaft mit Olivenöl, Salz und Pfeffer verrühren. Couscous, Gemüse und Kichererbsen mischen, das Dressing unterheben und Feta darüberbröseln."],
"Bunt, frisch und zitronig – der Salat, den alle auf der Party nachfragen.",
occ='mealprep,mitnehmen,gaeste',tip="Für unterwegs das Dressing getrennt mitnehmen und kurz vor dem Essen untermischen.",kid=False,photo='kichererbsen-couscous-salat.webp',src=N)
CH['kichererbsen_couscous_salat']='Rezept von Nicole übernommen (ersetzt den geplanten Couscous-Salat mit Minze). Salz ergänzt.'

R('ofengemuese_kichererbsen_feta','Ofengemüse mit Kichererbsen und Feta','lunch','ofen','sh',4,15,30,"""
2 | rote oder gelbe Paprika | paprika
1 | Zucchini | zucchini
2 | rote Zwiebeln | rote_zwiebel
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
200 g | Feta | feta
2 EL | Olivenöl | olivenoel
1 TL | edelsüßes Paprikapulver | gewuerz
½ TL | Kreuzkümmel | gewuerz
150 g | Naturjoghurt | joghurt
½ | Zitrone (Saft) | zitrone=20
| Salz, Pfeffer | salz=2
""",["Backofen auf 210 °C Ober-/Unterhitze vorheizen. Paprika, Zucchini und Zwiebeln in mundgerechte Stücke schneiden. Kichererbsen abspülen und gut abtropfen lassen.",
"Gemüse und Kichererbsen mit Öl, Gewürzen und Salz mischen, auf einem Blech verteilen und 20 Minuten backen. Feta darüberbröseln und weitere 8–10 Minuten backen.",
"Joghurt mit Zitronensaft und einer Prise Salz verrühren. Das Blechgemüse mit dem Zitronenjoghurt servieren."],
"Geröstetes Gemüse, knusprige Kichererbsen und warmer Feta – alles auf einem Blech.",
occ='gaeste,familie',tip="Dazu passen Vollkornbrot oder Couscous. Für Gäste die Gewürze mild halten und Chiliflocken separat anbieten.",kid=False,photo='ofengemuese-mit-kichererbsen.webp',src=N)
CH['ofengemuese_kichererbsen_feta']='Rezept von Nicole übernommen (ersetzt das Ofengemüse mit Halloumi).'

R('bananen_erdnuss_brot','Bananen-Erdnuss-Vollkornbrot','breakfast','brot','g',2,5,0,"""
4 Scheiben | Vollkornbrot | vk_brot
2 EL | Erdnussmus | erdnussmus
1 | Banane | banane
¼ TL | Zimt | gewuerz
40 g | Heidelbeeren (nach Wunsch) | heidelbeeren
""".replace('¼ TL','0.25 TL'),["Banane schälen und in Scheiben schneiden.",
"Brot nach Wunsch toasten und mit Erdnussmus bestreichen. Bananenscheiben darauf verteilen und leicht mit Zimt bestäuben.",
"Nach Wunsch mit Heidelbeeren servieren."],
"Nussig, süß und in fünf Minuten fertig – Kinder lieben es, Erwachsene heimlich auch.",
occ='brotzeit,fruehstueck',tip="Erdnussmus kann durch Sonnenblumenkernmus ersetzt werden, etwa für die Kita-Brotdose.",kid=True,photo='bananen-erdnuss-vollkornbrot.webp',src=N)
CH['bananen_erdnuss_brot']='Unverändert übernommen.'

R('hummus_paprika_gurkenbrot','Hummus-Paprika-Gurkenbrot','breakfast','brot','g',2,8,0,"""
4 Scheiben | Vollkornbrot | vk_brot
100 g | Hummus | hummus
½ | rote Paprika | paprika
¼ | Salatgurke | gurke=100
1 TL | Zitronensaft | zitronensaft
1 EL | Petersilie, gehackt | petersilie
""".replace('½ |','0.5 |').replace('¼ |','0.25 |'),["Paprika und Gurke waschen und in dünne Streifen schneiden.",
"Hummus mit Zitronensaft verrühren und auf das Brot streichen.",
"Mit Paprika, Gurke und gehackter Petersilie belegen."],
"Cremiger Hummus und knackiges Gemüse – rein pflanzlich und richtig sättigend.",
occ='brotzeit,mitnehmen',tip="Hummus und Gemüse getrennt gekühlt mitnehmen und erst kurz vor dem Essen aufs Brot geben.",kid=True,photo='hummus-paprika-gurkenbrot.webp',src=N)
CH['hummus_paprika_gurkenbrot']='Rezept von Nicole übernommen (ersetzt das geplante Hummus-Brot). Allergen Sesam (Hummus) eingetragen.'

R('tomaten_mozzarella_brot','Tomaten-Mozzarella-Vollkornbrot','breakfast','brot','s',2,8,0,"""
4 Scheiben | Vollkornbrot | vk_brot
125 g | Mozzarella | mozzarella
2 | reife Tomaten | tomate
1 Handvoll | Basilikum | basilikum
1 TL | Olivenöl | olivenoel
| Salz, Pfeffer | salz=1
""",["Tomaten waschen und in Scheiben schneiden. Mozzarella abtropfen lassen und ebenfalls in Scheiben schneiden.",
"Brot nach Wunsch toasten und mit Tomaten und Mozzarella belegen.",
"Basilikum darübergeben, mit etwas Olivenöl beträufeln, salzen und pfeffern."],
"Sommer auf dem Brot: sonnenreife Tomaten, zarter Mozzarella und frisches Basilikum.",
occ='brotzeit',tip="Tomaten geben Saft ab – für unterwegs Brot und Belag getrennt einpacken.",kid=True,photo='tomaten-mozzarella-vollkornbrot.webp',src=N)
CH['tomaten_mozzarella_brot']='Saison auf Sommer gesetzt (Tomaten). Salz ergänzt.'

R('apfel_zimt_porridge','Apfel-Zimt-Porridge','breakfast','porridge','hw',2,5,10,"""
100 g | Haferflocken | haferflocken
300 ml | Milch | milch
100 ml | Wasser | wasser
1 ½ | Äpfel | apfel
½ TL | Zimt | gewuerz
2 EL | Naturjoghurt (nach Wunsch) | joghurt
""".replace('1 ½ |','1.5 |').replace('½ TL','0.5 TL'),["Haferflocken, Milch und Wasser in einem Topf aufkochen und bei kleiner Hitze 5–7 Minuten rühren, bis der Brei cremig ist.",
"Äpfel waschen, entkernen und klein würfeln. Die Hälfte in den letzten 2 Minuten mitköcheln lassen.",
"Mit Zimt und den übrigen Apfelstücken servieren und nach Wunsch einen Löffel Joghurt daraufgeben."],
"Duftet nach Zimt und Bratapfel – das warme Frühstück für kalte Morgen.",
occ='fruehstueck,familie',tip="Lässt sich am Vorabend kochen. Beim Erwärmen einen Schuss Milch einrühren.",kid=True,photo='apfel-zimt-porridge.webp',src=N)
CH['apfel_zimt_porridge']='Unverändert übernommen (ersetzt das geplante Birnen-Porridge).'

R('bananen_hafer_pancakes','Bananen-Hafer-Pancakes','breakfast','pfannkuchen','g',2,8,12,"""
1 | reife Banane | banane
2 | Eier | ei
80 g | Haferflocken | haferflocken
50 ml | Milch | milch
1 TL | Rapsöl | rapsoel
4 EL | Naturjoghurt zum Servieren | joghurt
""",["Banane mit einer Gabel zerdrücken. Eier, Haferflocken und Milch einrühren und die Masse 5 Minuten quellen lassen.",
"Eine beschichtete Pfanne dünn mit Öl ausstreichen und bei mittlerer Hitze erwärmen. Kleine Teigportionen hineingeben.",
"Pancakes je Seite etwa 2 Minuten backen, bis sie fest und goldbraun sind. Mit Joghurt servieren."],
"Fluffig, natürlich süß durch die Banane und ganz ohne Zucker.",
occ='wochenende,familie',tip="Abgekühlt im Kühlschrank lagern und kurz in der Pfanne aufwärmen.",kid=True,photo='bananen-hafer-pancakes.webp',src=N)
CH['bananen_hafer_pancakes']='Joghurt-Menge zum Servieren an zwei Portionen angepasst (2 → 4 EL).'

R('joghurt_apfel_nuss_bowl','Joghurt-Bowl mit Apfel und Nüssen','breakfast','bowl_suess','hw',2,7,0,"""
300 g | Naturjoghurt | joghurt
1 | Apfel | apfel
40 g | Haferflocken | haferflocken
20 g | Walnüsse | walnuesse
1 EL | Rosinen | rosinen
¼ TL | Zimt | gewuerz
""".replace('¼ TL','0.25 TL'),["Joghurt auf zwei Schalen verteilen.",
"Apfel waschen, entkernen und in kleine Stücke schneiden. Walnüsse grob hacken.",
"Apfel, Haferflocken, Walnüsse und Rosinen auf dem Joghurt anrichten und mit Zimt bestäuben. Für kleinere Kinder die Nüsse fein hacken."],
"Knackiger Apfel, nussiger Crunch und ein Hauch Zimt – schmeckt wie Apfelstrudel zum Löffeln.",
occ='fruehstueck,mitnehmen',tip="Toppings getrennt mitnehmen, dann bleiben sie knackig.",kid=True,photo='joghurt-apfel-nuss-bowl.webp',src=N)
CH['joghurt_apfel_nuss_bowl']='Unverändert übernommen.'

R('moehren_linsen_suppe','Möhren-Linsen-Suppe','lunch','suppe','hw',4,12,25,"""
400 g | Möhren | karotte
150 g | rote Linsen, trocken | linsen_rot
1 | Zwiebel | zwiebel
750 ml | Gemüsebrühe | gemuesebruehe
1 EL | Rapsöl | rapsoel
½ TL | mildes Currypulver | currypulver
100 ml | Kokosmilch | kokosmilch
4 Scheiben | Vollkornbrot zum Servieren | vk_brot
| Salz, Pfeffer | salz=3
""".replace('½ TL','0.5 TL'),["Zwiebel würfeln, Möhren waschen und in Scheiben schneiden. Linsen abspülen.",
"Öl in einem Topf erhitzen und die Zwiebel 2 Minuten anschwitzen. Currypulver kurz mitrösten, dann Möhren, Linsen und Brühe zugeben.",
"18–20 Minuten köcheln lassen, bis Möhren und Linsen weich sind. Pürieren, Kokosmilch einrühren und mit Salz und Pfeffer abschmecken."],
"Samtig, mild und goldgelb – die Kokosmilch macht diese Suppe besonders cremig.",
occ='mealprep,familie',tip="Portionsweise einfrieren. Beim Aufwärmen gut durchrühren.",kid=True,photo='moehren-linsen-suppe.webp',src=N)
CH['moehren_linsen_suppe']='Curry wird mit angeröstet (mehr Aroma); Kokosmilch fest eingeplant statt optional.'

R('chili_sin_carne','Mildes Chili sin Carne','lunch','eintopf','g',4,15,30,"""
2 Dosen | Kidneybohnen (480 g abgetropft) | kidneybohnen
150 g | Mais | mais
400 ml | passierte Tomaten | passata
1 | rote Paprika | paprika
1 | Zwiebel | zwiebel
1 | Knoblauchzehe | knoblauch=4
250 ml | Gemüsebrühe | gemuesebruehe
1 EL | Rapsöl | rapsoel
1 TL | edelsüßes Paprikapulver | gewuerz
½ TL | Kreuzkümmel | gewuerz
200 g | Vollkornreis | vollkornreis
| Salz, Pfeffer | salz=3
""".replace('½ TL','0.5 TL'),["Reis nach Packungsangabe garen. Zwiebel und Knoblauch würfeln, Paprika klein schneiden. Bohnen und Mais abspülen und abtropfen lassen.",
"Öl erhitzen und Zwiebel, Knoblauch und Paprika 3 Minuten anschwitzen. Gewürze kurz mitrösten, dann Tomaten, Brühe, Bohnen und Mais zugeben.",
"Bei kleiner Hitze 20–25 Minuten köcheln lassen und gelegentlich umrühren. Mild abschmecken und mit Reis servieren."],
"Würzig, wärmend und rein pflanzlich – Schärfe kann sich jede am Tisch selbst nachlegen.",
occ='mealprep,familie',tip="Chili und Reis getrennt abkühlen und gekühlt lagern. Scharfe Gewürze oder Chiliflocken separat anbieten.",kid=True,photo='mildes-chili-sin-carne.webp',src=N)
CH['chili_sin_carne']='Bohnenmenge verdoppelt (240 → 480 g), damit das Chili als Hauptgericht satt macht (vorher ca. 9 g Eiweiß pro Portion). Knoblauch ergänzt, Gewürze werden angeröstet.'

R('suesskartoffel_kraeuterquark','Süßkartoffel mit Kräuterquark','lunch','ofen','hw',2,10,35,"""
2 | Süßkartoffeln | suesskartoffel
200 g | Magerquark | magerquark
2 EL | Naturjoghurt | joghurt
½ | Salatgurke | gurke=200
1 EL | Schnittlauch, fein geschnitten | schnittlauch
1 TL | Zitronensaft | zitronensaft
1 TL | Olivenöl | olivenoel
2 EL | Kürbiskerne | kuerbiskerne
| Salz, Pfeffer | salz=2
""".replace('½ |','0.5 |'),["Backofen auf 200 °C Ober-/Unterhitze vorheizen. Süßkartoffeln waschen, längs halbieren und mit der Schnittfläche nach oben auf ein Blech legen. Mit Öl bestreichen und salzen.",
"30–35 Minuten backen, bis das Fruchtfleisch weich ist. Quark mit Joghurt, Schnittlauch, Zitronensaft, Salz und Pfeffer verrühren.",
"Gurke klein würfeln und unter den Quark heben. Süßkartoffeln mit Kräuterquark anrichten und mit Kürbiskernen bestreuen."],
"Ofensüße Kartoffel trifft auf kühlen Kräuterquark – einfach und unglaublich gut.",
occ='familie',tip="Quark getrennt kühl lagern. Gebackene Süßkartoffeln lassen sich am nächsten Tag im Ofen aufwärmen.",kid=True,photo='suesskartoffel-kraeuterquark.webp',src=N)
CH['suesskartoffel_kraeuterquark']='Kürbiskerne als Topping ergänzt (Crunch, Magnesium); Quark als Magerquark konkretisiert.'

R('kartoffel_gemuese_frittata','Kartoffel-Gemüse-Frittata','lunch','pfanne','g',4,15,25,"""
400 g | gekochte Kartoffeln (vom Vortag) | kartoffel
6 | Eier | ei
100 g | Erbsen (TK) | erbsen
50 g | Babyspinat | spinat
½ | rote Paprika | paprika
50 ml | Milch | milch
30 g | geriebener Käse | gouda
1 EL | Rapsöl | rapsoel
| Salz, Pfeffer | salz=3
""".replace('½ |','0.5 |'),["Backofen auf 190 °C Ober-/Unterhitze vorheizen. Kartoffeln in Scheiben schneiden, Paprika würfeln, Spinat waschen.",
"Öl in einer ofenfesten Pfanne erhitzen und Kartoffeln, Paprika und Erbsen 4–5 Minuten anbraten. Spinat kurz unterheben.",
"Eier mit Milch, Salz und Pfeffer verquirlen, über das Gemüse gießen und Käse darüberstreuen. Im Ofen 15–20 Minuten stocken lassen, kurz ruhen lassen und in Stücke schneiden."],
"Goldbraun, saftig und perfekt für Reste – schmeckt warm und kalt.",
occ='mealprep,familie,mitnehmen',tip="In Stücke geschnitten lässt sie sich gut mitnehmen. Gekühlt zwei Tage haltbar.",kid=True,photo='kartoffel-gemuese-frittata.webp',src=N)
CH['kartoffel_gemuese_frittata']='Rezept von Nicole übernommen (ersetzt die Spinat-Feta-Frittata). Salz ergänzt.'

R('haehnchen_reis_pfanne','Hähnchen-Reis-Pfanne mit Erbsen','lunch','pfanne','g',4,15,35,"""
350 g | Hähnchenbrust | haehnchenbrust
200 g | Vollkornreis | vollkornreis
150 g | Erbsen (TK) | erbsen
1 | Möhre | karotte
½ | rote Paprika | paprika
1 | Zwiebel | zwiebel
550 ml | Gemüsebrühe | gemuesebruehe
1 EL | Rapsöl | rapsoel
½ TL | edelsüßes Paprikapulver | gewuerz
1 EL | Petersilie, gehackt | petersilie
| Salz, Pfeffer | salz=2
""".replace('½ |','0.5 |').replace('½ TL','0.5 TL'),["Hähnchen in mundgerechte Stücke schneiden. Zwiebel, Möhre und Paprika klein würfeln.",
"Öl in einem breiten Topf erhitzen, das Hähnchen rundherum goldbraun anbraten, salzen und herausnehmen.",
"Zwiebel und Gemüse im Bratfett 2 Minuten anschwitzen, Reis und Paprikapulver kurz mitrühren. Brühe angießen und zugedeckt bei kleiner Hitze 30–35 Minuten garen.",
"Hähnchen und Erbsen in den letzten 5 Minuten zugeben und mitgaren, bis das Fleisch vollständig durchgegart ist. Mit Petersilie bestreuen."],
"Ein-Topf-Glück: würziger Reis, saftiges Hähnchen und süße Erbsen.",
occ='familie,mealprep',tip="In flachen Behältern zügig abkühlen lassen und gekühlt lagern. Beim Aufwärmen vollständig erhitzen.",kid=True,photo='haehnchen-reis-pfanne.webp',src=N)
CH['haehnchen_reis_pfanne']='Hähnchen wird angebraten und erst zum Schluss zurück in den Topf gegeben – vorher garte es 30 Minuten mit und wurde trocken. Garzeit an Vollkornreis angepasst (30–35 Min.), Brühe leicht reduziert.'

R('brokkoli_kaese_pasta','Vollkornpasta mit Brokkoli-Käsesauce','lunch','pasta','g',4,10,20,"""
300 g | Vollkornnudeln | vk_nudeln
350 g | Brokkoli | brokkoli
250 ml | Milch | milch
80 g | geriebener Käse (z. B. Bergkäse) | bergkaese
1 EL | Mehl | mehl
1 EL | Butter | butter
| Salz, Pfeffer, Muskat | salz=3
""",["Nudeln in Salzwasser nach Packungsangabe kochen. Brokkoli in kleine Röschen teilen und in den letzten 5 Minuten mitgaren. Etwas Nudelwasser auffangen.",
"Butter in einem kleinen Topf schmelzen, Mehl einrühren und nach und nach die Milch zugießen. Unter Rühren 2–3 Minuten köcheln lassen, bis die Sauce bindet.",
"Käse in der Sauce schmelzen lassen und mit Pfeffer und Muskat würzen. Nudeln und Brokkoli abgießen, mit der Sauce mischen und mit etwas Nudelwasser cremig rühren."],
"Cremige Käsesauce, grüne Röschen – Mac and Cheese in der Familienversion.",
occ='familie,schnell',tip="Beim Aufwärmen einen Schluck Milch zugeben, damit die Sauce cremig bleibt.",kid=True,photo='brokkoli-kaese-vollkornpasta.webp',src=N)
CH['brokkoli_kaese_pasta']='Muskat ergänzt (klassisch zur Käsesauce).'

R('bohnen_mais_wraps','Bohnen-Mais-Wraps','lunch','brot','g',4,15,0,"""
4 | Vollkornwraps | tortilla
1 Dose | Kidneybohnen (240 g abgetropft) | kidneybohnen
100 g | Mais | mais
80 g | geriebener Käse | gouda
1 | Tomate | tomate
4 Blatt | Salatblätter | kopfsalat
80 g | Naturjoghurt | joghurt
½ TL | edelsüßes Paprikapulver | gewuerz
1 TL | Limetten- oder Zitronensaft | zitronensaft
""".replace('½ TL','0.5 TL'),["Bohnen abspülen und mit einer Gabel grob zerdrücken. Mit Mais und Paprikapulver mischen.",
"Tomate würfeln, Salat waschen. Joghurt mit Limetten- oder Zitronensaft glatt rühren.",
"Wraps mit Bohnenmischung, Tomate, Salat und Käse füllen. Joghurt daraufgeben, die Seiten einschlagen und eng aufrollen."],
"Mexikanisch, bunt und zum Selbstrollen – jede füllt ihren Wrap, wie sie mag.",
occ='mitnehmen,familie,mealprep',tip="Für die Lunchbox Füllung und Wrap getrennt transportieren, damit nichts durchweicht.",kid=True,photo='bohnen-mais-wraps.webp',src=N)
CH['bohnen_mais_wraps']='Unverändert übernommen (Zitronensaft als feste Zutat aufgenommen).'

R('pesto_erbsen_nudelsalat','Pesto-Erbsen-Nudelsalat','lunch','salat','s',4,15,10,"""
250 g | Vollkornnudeln | vk_nudeln
150 g | Erbsen (TK) | erbsen
150 g | Kirschtomaten | kirschtomaten=150
40 g | Babyspinat | spinat
3 EL | Basilikumpesto | pesto
125 g | Mozzarella | mozzarella
1 TL | Zitronensaft | zitronensaft
| Salz, Pfeffer | salz=2
""",["Nudeln in Salzwasser nach Packungsangabe kochen, Erbsen in den letzten 3 Minuten mitgaren. Abgießen und abkühlen lassen.",
"Tomaten halbieren, Spinat waschen und Mozzarella würfeln oder zupfen.",
"Pesto mit Zitronensaft und 1–2 EL Wasser verrühren. Mit Nudeln, Erbsen und Gemüse mischen, abschmecken und Mozzarella daraufgeben."],
"Der Nudelsalat, der auf jedem Buffet als Erstes leer ist – frisch, grün und mit Pesto.",
occ='mitnehmen,gaeste,mealprep',tip="Gekühlt transportieren. Nudeln ziehen beim Stehen Flüssigkeit, daher etwas Pesto zum Nachwürzen aufheben.",kid=True,photo='pesto-erbsen-nudelsalat.webp',src=N)
CH['pesto_erbsen_nudelsalat']='Pesto von 2 auf 3 EL und Mozzarella auf eine Kugel (125 g) angepasst – für 4 Portionen Salat sonst zu trocken. Ersetzt den geplanten Nudelsalat mit Rucola.'

R('gemuese_lasagne_spinat','Gemüse-Lasagne mit Spinat','lunch','ofen','g',6,25,45,"""
250 g | Lasagneplatten (ohne Vorkochen) | lasagneplatten
500 ml | passierte Tomaten | passata
1 Dose | stückige Tomaten (400 g) | tomaten_dose
1 | Zucchini | zucchini
1 | Aubergine | aubergine
150 g | Babyspinat | spinat
250 g | Ricotta | ricotta
100 g | geriebener Mozzarella oder Gouda | gouda
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
2 EL | Olivenöl | olivenoel
150 ml | Wasser | wasser
1 TL | Oregano | gewuerz
| Salz, Pfeffer | salz=5
""",["Backofen auf 190 °C Ober-/Unterhitze vorheizen. Zwiebel und Knoblauch würfeln, Zucchini und Aubergine klein schneiden.",
"Öl erhitzen und das Gemüse 6–8 Minuten anbraten. Spinat unterheben, bis er zusammenfällt. Passierte und stückige Tomaten, Wasser und Oregano zugeben, 5 Minuten köcheln und kräftig abschmecken.",
"Ricotta mit 2–3 EL Wasser glatt rühren. In einer Auflaufform abwechselnd Gemüsesauce, Lasagneplatten und Ricotta schichten, mit Sauce abschließen und mit Käse bestreuen.",
"Abgedeckt 25 Minuten backen, dann ohne Abdeckung weitere 15–20 Minuten goldbraun backen. Vor dem Anschneiden 10 Minuten ruhen lassen."],
"Schicht für Schicht Gemüse, cremiger Ricotta und goldener Käse – Sonntagsessen für alle.",
occ='gaeste,familie,mealprep',tip="Lässt sich am Vortag schichten und gekühlt aufbewahren. Vor dem Backen aus dem Kühlschrank nehmen, während der Ofen vorheizt.",kid=True,photo='gemuese-lasagne.webp',src=N)
CH['gemuese_lasagne_spinat']='Mehr Flüssigkeit (zusätzlich 400 g stückige Tomaten): Platten ohne Vorkochen brauchen das, sonst bleibt die Lasagne trocken. Gemüse auf eine ganze Aubergine erhöht (6 Portionen), Knoblauch ergänzt, Backen erst abgedeckt. Ersetzt die geplante Spinat-Ricotta-Lasagne.'

R('kichererbsen_spinat_curry','Mildes Kichererbsen-Spinat-Curry','lunch','curry','g',4,12,25,"""
2 Dosen | Kichererbsen (480 g abgetropft) | kichererbsen
150 g | Babyspinat | spinat
400 ml | passierte Tomaten | passata
200 ml | Kokosmilch | kokosmilch
1 | Zwiebel | zwiebel
2 | Knoblauchzehen | knoblauch=8
1 TL | Ingwer, gerieben | ingwer
2 TL | mildes Currypulver | currypulver
1 EL | Rapsöl | rapsoel
200 g | Vollkornreis | vollkornreis
| Salz | salz=3
""",["Reis nach Packungsangabe garen. Zwiebel, Knoblauch und Ingwer fein hacken, Kichererbsen abspülen und abtropfen lassen.",
"Öl erhitzen und Zwiebel glasig anschwitzen. Knoblauch, Ingwer und Currypulver 1 Minute mitrösten. Tomaten, Kokosmilch und Kichererbsen einrühren.",
"15 Minuten köcheln lassen. Spinat portionsweise unterheben, bis er zusammenfällt, salzen und mit dem Reis servieren."],
"Cremig, mild und wärmend – ein Curry, das auch Kinder mögen.",
occ='mealprep,familie',tip="Curry und Reis getrennt portionieren. Beim Aufwärmen etwas Wasser ergänzen.",kid=True,photo='kichererbsen-spinat-curry.webp',src=N)
CH['kichererbsen_spinat_curry']='Kichererbsen verdoppelt und Tomaten auf 400 ml erhöht – vorher zu wenig für 4 Hauptportionen. Knoblauch und Ingwer ergänzt, Currymenge erhöht.'

R('tomaten_kichererbsen_suppe','Tomaten-Kichererbsen-Suppe','lunch','suppe','hw',4,12,25,"""
1 Dose | Kichererbsen (240 g abgetropft) | kichererbsen
1 Dose | gehackte Tomaten (400 g) | tomaten_dose
600 ml | Gemüsebrühe | gemuesebruehe
2 | Möhren | karotte
1 | Zwiebel | zwiebel
1 | Knoblauchzehe | knoblauch=4
1 EL | Olivenöl | olivenoel
1 TL | Oregano | gewuerz
4 EL | Naturjoghurt | joghurt
4 Scheiben | Vollkornbrot zum Servieren | vk_brot
| Salz, Pfeffer | salz=3
""",["Zwiebel und Knoblauch würfeln, Möhren klein schneiden. Kichererbsen abspülen und abtropfen lassen.",
"Öl in einem Topf erhitzen und Zwiebel, Knoblauch und Möhren 3 Minuten anschwitzen. Tomaten, Brühe, Kichererbsen und Oregano zugeben.",
"18–20 Minuten köcheln lassen, bis die Möhren weich sind. Einen Teil der Suppe pürieren, abschmecken und mit einem Klecks Joghurt und Vollkornbrot servieren."],
"Halb püriert, halb stückig – eine sämige Tomatensuppe, die richtig satt macht.",
occ='mealprep',tip="Portionsweise einfrieren. Brot separat aufbewahren.",kid=True,photo='tomaten-kichererbsen-suppe.webp',src=N)
CH['tomaten_kichererbsen_suppe']='Zweite Möhre, Knoblauch und ein Klecks Joghurt ergänzt; Brühe auf 600 ml erhöht.'

R('gefuellte_paprika_reis_linsen','Gefüllte Paprika mit Reis und Linsen','lunch','ofen','sh',4,20,40,"""
4 | Paprika | paprika
100 g | Vollkornreis | vollkornreis
160 g | gekochte Linsen | linsen_gekocht
400 ml | passierte Tomaten | passata
1 | Zwiebel | zwiebel
150 ml | Gemüsebrühe | gemuesebruehe
80 g | Feta | feta
1 EL | Olivenöl | olivenoel
1 TL | Paprikapulver | gewuerz
| Salz, Pfeffer | salz=3
""",["Reis nach Packungsangabe knapp garen. Backofen auf 190 °C Ober-/Unterhitze vorheizen. Paprika längs halbieren und entkernen.",
"Zwiebel fein würfeln und in Öl anschwitzen. Mit Reis, Linsen, Paprikapulver und der Hälfte der Tomaten mischen, kräftig abschmecken und in die Paprikahälften füllen.",
"Paprika in eine Auflaufform setzen, übrige Tomaten und Brühe angießen. Abgedeckt 25 Minuten backen, dann Feta darüberbröseln und weitere 10–15 Minuten backen, bis die Paprika weich ist."],
"Sommerliche Paprika, würzige Füllung und Feta obendrauf – wie im Urlaub am Mittelmeer.",
occ='familie,mealprep',tip="Die Füllung lässt sich vorbereiten. Reste gekühlt lagern und vollständig erhitzen.",kid=True,photo='gefuellte-paprika-reis-linsen.webp',src=N)
CH['gefuellte_paprika_reis_linsen']='Tomaten auf 400 ml erhöht (Sauce für 4 Portionen), Feta fest eingeplant und auf 80 g erhöht, Gewürze ergänzt. Ersetzt die geplante Paprika mit Couscous.'

R('apfel_quark_auflauf','Apfel-Quark-Auflauf','snack','suess','hw',4,12,30,"""
250 g | Magerquark | magerquark
2 | Eier | ei
2 | Äpfel | apfel
50 g | Haferflocken | haferflocken
50 ml | Milch | milch
1 EL | Rosinen | rosinen
1 EL | Honig | honig
½ TL | Vanille oder Zimt | gewuerz
1 TL | Rapsöl für die Form | rapsoel
""".replace('½ TL','0.5 TL'),["Backofen auf 180 °C Ober-/Unterhitze vorheizen und eine kleine Auflaufform einölen.",
"Quark, Eier, Milch, Haferflocken, Honig und Vanille verrühren. Äpfel waschen, entkernen, würfeln und mit den Rosinen unterheben.",
"Masse in die Form geben und 25–30 Minuten backen, bis die Oberfläche goldbraun ist. Vor dem Portionieren kurz abkühlen lassen."],
"Warm aus dem Ofen wie Omas Quarkauflauf – nur mit viel Apfel und wenig Zucker.",
occ='familie',tip="Schmeckt warm oder kalt, auch zum Frühstück. Reste abgedeckt im Kühlschrank lagern.",kid=True,photo='apfel-quark-auflauf.webp',src=N)
CH['apfel_quark_auflauf']='Zweiter Apfel und 1 EL Honig ergänzt – ohne jede Süße schmeckt der Auflauf vielen Kindern zu sauer.'

R('ofenaepfel_hafer_nuss','Ofenäpfel mit Hafer-Nuss-Füllung','snack','suess','hw',4,12,30,"""
4 | Äpfel (z. B. Boskoop) | apfel
40 g | Haferflocken | haferflocken
30 g | gehackte Haselnüsse | haselnuesse
1 EL | Butter, weich | butter
1 EL | Honig | honig
½ TL | Zimt | gewuerz
150 g | Naturjoghurt zum Servieren | joghurt
""".replace('½ TL','0.5 TL'),["Backofen auf 180 °C Ober-/Unterhitze vorheizen. Äpfel waschen und das Kerngehäuse vorsichtig ausstechen.",
"Haferflocken, Haselnüsse, Zimt, Butter und Honig verkneten und die Äpfel damit füllen.",
"Äpfel in eine kleine Auflaufform setzen und 25–30 Minuten backen, bis sie weich sind. Mit Joghurt servieren. Für kleine Kinder die Nüsse fein hacken."],
"Der Duft von Bratapfel zieht durchs ganze Haus – Winterglück zum Löffeln.",
occ='gaeste,familie',tip="Die Füllung lässt sich vorher mischen. Äpfel erst kurz vor dem Backen füllen, damit sie nicht braun werden.",kid=True,photo='ofenaepfel-hafer-nuss.webp',src=N)
CH['ofenaepfel_hafer_nuss']='Butter von 1 TL auf 1 EL erhöht, damit die Füllung bindet. Ersetzt den geplanten Bratapfel.'
