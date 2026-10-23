# Rezeptdatenbank (WellANNI 2.2)

Die Rezepte werden hier als Python-Quelltext gepflegt und daraus nach
`app/src/data/recipes.json` exportiert. Nährwerte werden **nicht** von Hand
eingetragen, sondern aus den Einzelzutaten gegen `foodDatabase.json` (BLS 4.0)
berechnet. `tests/domain/recipeQuality.test.js` rechnet jeden Wert nach.

- `lib.py` – Zutatenbibliothek: Schlüssel → BLS-Code, Allergene/Flags, Stückgewichte
- `build.py` – Parser für Zutatenzeilen, Nährwertberechnung, Flags (vegetarisch, Low Carb, Allergene)
- `rec_*.py` – die Rezepte, nach Bereichen; `CH` = Prüfprotokoll-Eintrag je Rezept
- `all.py` – sammelt alles und schreibt die JSON-Datei

Zutatenzeile: `Menge Einheit | Anzeige-Name | zutat_key[=Gramm]`

Neu bauen: `python scripts/recipes/all.py` und danach `npm test`.
