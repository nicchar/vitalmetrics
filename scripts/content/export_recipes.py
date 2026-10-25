"""Rezeptdatenbank als Excel-Übersicht.

Quelle ist immer app/src/data/recipes.json. Website-Status kommt aus der PAGES-Liste des
Website-Generators, Pins und Instagram-Beiträge aus dem Content-Log (CSV).

Aufruf:
  python3 scripts/content/export_recipes.py <Content-Log.csv> <Ziel.xlsx>
"""
import csv, json, pathlib, sys
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts' / 'website'))
from build_recipe_pages import PAGES, no_added_sugar  # noqa: E402

MEAL = {'breakfast': 'Frühstück', 'lunch': 'Hauptgericht', 'snack': 'Snack'}
SEASON = {'g': 'ganzjährig', 'f': 'Frühling', 's': 'Sommer', 'h': 'Herbst', 'w': 'Winter'}
ALLERGEN = {'gluten': 'Gluten', 'milk': 'Milch', 'egg': 'Ei', 'tree_nuts': 'Nüsse', 'peanut': 'Erdnuss', 'soy': 'Soja',
            'fish': 'Fisch', 'sesame': 'Sesam', 'celery': 'Sellerie', 'mustard': 'Senf', 'crustaceans': 'Krebstiere',
            'mollusc': 'Weichtiere', 'lupin': 'Lupine', 'sulphites': 'Sulfite'}


def diet(r):
    if r.get('vegan'):
        return 'vegan'
    if r.get('vegetarian'):
        return 'vegetarisch'
    return 'Fleisch/Fisch'


def main(log_path, out_path):
    recipes = json.load(open(ROOT / 'app/src/data/recipes.json', encoding='utf-8'))
    slug_by_id = {rid: slug for slug, rid, _ in PAGES}
    log = list(csv.DictReader(open(log_path, encoding='utf-8-sig'), delimiter=';')) if log_path else []

    def posts_for(slug, kanal):
        if not slug:
            return []
        return [x['ID'] for x in log if x['Kanal'] == kanal and slug in (x.get('Link') or '')
                and not x['Status'].startswith('nicht veröffentlicht')]

    head = ['ID', 'Titel', 'Mahlzeit', 'Ernährung', 'Low Carb', 'Saison', 'Für Kinder', 'Portionen', 'Dauer',
            'kcal/Portion', 'Eiweiß g', 'Ballaststoffe g', 'ohne Zuckerzusatz', 'eiweißreich', 'Allergene', 'Quelle',
            'Foto', 'Website', 'Pins', 'Instagram', 'Kurzbeschreibung', 'Zutaten']
    rows = []
    for r in sorted(recipes, key=lambda x: x['title'].lower()):
        n = r.get('nutritionPerServing') or {}
        slug = slug_by_id.get(r['id'])
        pins = posts_for(slug, 'Pinterest')
        insta = posts_for(slug, 'Instagram')
        rows.append([
            r['id'], r['title'], MEAL.get(r['mealType'], r['mealType']), diet(r), 'ja' if r.get('lowCarb') else '',
            ', '.join(SEASON.get(s, s) for s in r.get('seasons', [])), 'ja' if r.get('kidFriendly') else '',
            r.get('servings'), r.get('duration'), round(n.get('kal') or 0) or None, round(n.get('protein') or 0, 1),
            round(n.get('fiber') or 0, 1), 'ja' if no_added_sugar(r) else '', 'ja' if (n.get('protein') or 0) >= 20 else '',
            ', '.join(ALLERGEN.get(a, a) for a in r.get('allergens', [])),
            'Nicole' if r.get('source') == 'nicole' else 'WellANNI', r.get('image') or '',
            f'https://wellanni.de/{slug}.html' if slug else '', ', '.join(pins), ', '.join(insta),
            r.get('highlight') or '', ' · '.join(r.get('ingredients', []))])

    wb = Workbook()
    ws = wb.active
    ws.title = 'Rezepte'
    ws.append(head)
    for row in rows:
        ws.append(row)
    widths = [30, 42, 13, 14, 9, 18, 10, 10, 14, 11, 10, 13, 15, 11, 22, 10, 30, 48, 22, 26, 60, 80]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor='5B7B5C')
        c.alignment = Alignment(vertical='center', wrap_text=True)
    ws.freeze_panes = 'C2'
    tab = Table(displayName='Rezepte', ref=f'A1:{get_column_letter(len(head))}{len(rows) + 1}')
    tab.tableStyleInfo = TableStyleInfo(name='TableStyleLight9', showRowStripes=True)
    ws.add_table(tab)

    st = wb.create_sheet('Überblick')
    def count(col, val=None):
        i = head.index(col)
        return sum(1 for r in rows if (r[i] == val if val is not None else bool(r[i])))
    stats = [
        ('Rezepte gesamt', len(rows)),
        ('davon von Nicole', count('Quelle', 'Nicole')),
        ('mit Foto', count('Foto')),
        ('mit Website-Seite', count('Website')),
        ('mit Pin', count('Pins')),
        ('mit Instagram-Beitrag', count('Instagram')),
        ('ohne Zuckerzusatz', count('ohne Zuckerzusatz')),
        ('eiweißreich (ab 20 g pro Portion)', count('eiweißreich')),
        ('vegan', count('Ernährung', 'vegan')),
        ('vegetarisch', count('Ernährung', 'vegetarisch')),
        ('Low Carb', count('Low Carb')),
        ('Frühstück', count('Mahlzeit', 'Frühstück')),
        ('Hauptgericht', count('Mahlzeit', 'Hauptgericht')),
        ('Snack', count('Mahlzeit', 'Snack')),
    ]
    st.append(['Kennzahl', 'Anzahl'])
    for s in stats:
        st.append(list(s))
    st.column_dimensions['A'].width = 38
    st.column_dimensions['B'].width = 10
    for c in st[1]:
        c.font = Font(bold=True)
    st.append([])
    st.append(['Neues Rezept – so läuft es'])
    st[st.max_row][0].font = Font(bold=True)
    for line in [
        '1. Nicole schickt das Rezept als Word-Datei mit Foto.',
        '2. Claude überträgt es in die App-Daten, rechnet die Nährwerte (BLS) und prüft es mit den Tests.',
        '3. Website-Seite und Pins/Instagram-Beiträge entstehen sofort, in der App erscheint es mit dem nächsten Update.',
        '4. Diese Datei wird neu erzeugt – sie ist nur eine Übersicht. Bitte hier nichts von Hand ändern.',
        'Quelle der Daten: app/src/data/recipes.json (App) · Website-Generator · Content-Log.',
    ]:
        st.append([line])
    wb.move_sheet('Überblick', offset=-1)
    wb.active = 0
    wb.save(out_path)
    print(f'{len(rows)} Rezepte -> {out_path}')
    for s in stats[:6]:
        print(f'  {s[0]}: {s[1]}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '', sys.argv[2] if len(sys.argv) > 2 else 'WellANNI_Rezepte.xlsx')
