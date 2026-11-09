"""Neue Gemini-Bilder aus Downloads (älteste zuerst) als <ID>.png nach Rezeptbilder_Original übernehmen.
Aufruf: python uebernehmen.py WA-N0003 WA-N0004 ..."""
import sys, pathlib, json, time
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parents[2]
DL = ROOT.parent / 'Downloads'
OUT = ROOT / 'Rezeptbilder_Original'
DONE = OUT / '_uebernommen.json'
ids = sys.argv[1:]
done = json.loads(DONE.read_text()) if DONE.exists() else {}
START = (DL / 'Gemini_Generated_Image_w9vm36w9vm36w9vm.jpg').stat().st_mtime - 1  # erstes Bild der Serie (30.10.)
for _ in range(20):
    cands = sorted([p for p in DL.glob('Gemini_Generated_Image_*') if p.name not in done and p.stat().st_mtime >= START and p.suffix.lower() in ('.jpg', '.jpeg', '.png')], key=lambda p: p.stat().st_mtime)
    if len(cands) >= len(ids):
        break
    time.sleep(1)
if len(cands) != len(ids):
    print(f'ACHTUNG: {len(cands)} neue Bilder für {len(ids)} IDs')
for rid, src in zip(ids, cands):
    im = Image.open(src).convert('RGB')
    im.save(OUT / f'{rid}.png')
    done[src.name] = rid
    print(f'OK {rid} <- {src.name} {im.size}')
DONE.write_text(json.dumps(done, indent=0))
