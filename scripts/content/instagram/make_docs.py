"""Erzeugt Posting-Plan (Markdown), Caption-Dateien und Content-Log-Zeilen aus einem Wochen-Spec."""
import csv, importlib, pathlib, sys

spec = importlib.import_module(sys.argv[1])
out = pathlib.Path(sys.argv[2])
log = pathlib.Path(sys.argv[3])
week_title = sys.argv[4]
intro = pathlib.Path(sys.argv[5]).read_text(encoding='utf-8') if len(sys.argv) > 5 else ''

KIND = {'reel': 'Reel', 'post': 'Post', 'story': 'Story'}
lines = [f'# {week_title}', '', intro, '', '## Plan auf einen Blick', '', '| Tag | 12 Uhr Post | 18 Uhr Reel | Story |', '|---|---|---|---|']
days = []
for p in spec.POSTS:
    if p['day'] not in days:
        days.append(p['day'])
for d in days:
    ps = {p['fmt']: p for p in spec.POSTS if p['day'] == d}
    lines.append(f"| {d} | {ps['post']['title']} | {ps['reel']['title'].replace('Reel: ', '')} | {ps['story']['title'].replace('Story: ', '')} ({ps['story']['time']}) |")
lines += ['', '---', '']
for d in days:
    lines += [f'## {d}', '']
    for p in [x for x in spec.POSTS if x['day'] == d]:
        folder = p['folder']
        n = len(p['slides'])
        if p['fmt'] == 'reel':
            files = f"`{folder}/{p['id']}.mp4` + Titelbild `{p['id']}_cover.png`"
        elif n > 1:
            files = f"`{folder}/{p['id']}_01–{n:02d}.png` ({n} Folien)"
        else:
            files = f"`{folder}/{p['id']}.png`"
        lines += [f"### {KIND[p['fmt']]} · {p['time']} · {p['title']}", '', f'Dateien: {files}']
        if p.get('link'):
            lines.append(f"Link zum Thema: {p['link']}")
        if p.get('note'):
            lines.append(f"**Hinweis:** {p['note']}")
        if p.get('caption'):
            lines += ['', '**Caption** (auch als Textdatei im Tagesordner):', '', '```', p['caption'], '```']
            (out / folder / f"{p['id']}_caption.txt").write_text(p['caption'], encoding='utf-8')
        if p.get('alt'):
            lines += ['', f"**Alt-Text** (Erweiterte Einstellungen → Barrierefreiheit): {p['alt']}"]
        lines += ['']
(out / '00_LIES_MICH_Posting-Plan.md').write_text('\n'.join(lines), encoding='utf-8')

# Content-Log ergänzen
rows = list(csv.DictReader(open(log, encoding='utf-8-sig'), delimiter=';'))
H = list(rows[0].keys())
ids = {r['ID'] for r in rows}
FMT = {'reel': 'Reel 9:16', 'post': 'Karussell 4:5', 'story': 'Story 9:16'}
for p in spec.POSTS:
    rid = 'I-' + p['id']
    r = {h: '' for h in H}
    r.update(ID=rid, Kanal='Instagram', Format=FMT[p['fmt']] if not (p['fmt'] == 'post' and len(p['slides']) == 1) else 'Post 4:5',
             Serie=p['serie'], Termin=f"{p['day']} {p['time']}", Status='geplant', Titel=p['title'],
             Beschreibung_Caption=p.get('caption', ''), Link=p.get('link', ''),
             Bilddatei=f"Instagram/{out.name}/{p['folder']}/", Hinweis=p.get('note', ''))
    if rid in ids:
        rows = [r if x['ID'] == rid else x for x in rows]
    else:
        rows.append(r)
w = csv.DictWriter(open(log, 'w', encoding='utf-8-sig', newline=''), H, delimiter=';')
w.writeheader(); w.writerows(rows)
print(len(rows), 'Zeilen im Log')
