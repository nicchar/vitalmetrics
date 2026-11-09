#!/usr/bin/env python3
"""
gemini_bilder.py – WellANNI Rezeptbilder mit Gemini erzeugen

Liest die Bildprompts aus WellANNI_Rezeptergaenzung_782_bereinigt.xlsx (Blatt
"Bildprompts"), erzeugt die Bilder in Paketen (Standard: 20) und speichert sie
als <Rezept-ID>.png in Rezeptbilder_Original. Bilder, die schon da sind, werden
übersprungen. Du kannst also jederzeit abbrechen und später weitermachen.

Start unter Windows: Doppelklick auf Bilder_generieren.bat
Optionen (in der Eingabeaufforderung):
  --anzahl 20            Bilder pro Paket
  --ids WA-N0001,WA-N0007  nur diese IDs (vorhandene werden neu erzeugt)
  --modell NAME          anderes Gemini-Bildmodell
  --probe                nichts erzeugen, nur zeigen, was als Nächstes dran wäre

Der API-Schlüssel kommt aus der Umgebungsvariable GEMINI_API_KEY. Ist sie nicht
gesetzt, fragt das Programm einmal danach (die Eingabe wird nicht angezeigt
und nirgends gespeichert).
"""
import argparse
import csv
import datetime
import getpass
import io
import os
import pathlib
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parents[2]
XLSX = ROOT / 'WellANNI_Rezeptergaenzung_782_bereinigt.xlsx'
OUT = ROOT / 'Rezeptbilder_Original'
LOG = OUT / '_protokoll.csv'

# Bildmodell: Bei Bedarf in Google AI Studio nachsehen, welche Bildmodelle dein
# Schlüssel nutzen darf, und hier oder mit --modell ändern.
MODELL = 'gemini-2.5-flash-image'
SEITENVERHAELTNIS = '2:3'


def lade_prompts():
    import openpyxl
    if not XLSX.exists():
        sys.exit(f'Excel-Datei nicht gefunden: {XLSX}')
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb['Bildprompts']
    kopf = None
    daten = []
    for row in ws.iter_rows(values_only=True):
        if kopf is None:
            if row and row[0] == 'Rezept-ID':
                kopf = list(row)
            continue
        if not row or not row[0]:
            continue
        r = dict(zip(kopf, row))
        prompt = (r.get('Vollständiger Bildprompt (Englisch)') or '').strip()
        negativ = (r.get('Negativ-Prompt') or '').strip()
        if not prompt:
            continue
        if negativ and 'negative prompt' not in prompt.lower():
            # Gemini kennt kein eigenes Negativ-Feld, daher als Satz anhängen.
            prompt += f'\n\nDo not show: {negativ}.'
        daten.append((str(r['Rezept-ID']).strip(), str(r.get('Rezepttitel') or ''), prompt))
    wb.close()
    return daten


def protokoll(rid, titel, status, info=''):
    neu = not LOG.exists()
    with open(LOG, 'a', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f, delimiter=';')
        if neu:
            w.writerow(['Zeit', 'Rezept-ID', 'Titel', 'Status', 'Info'])
        w.writerow([datetime.datetime.now().strftime('%d.%m.%Y %H:%M'), rid, titel, status, info])


def erzeuge(client, modell, prompt):
    from google.genai import types
    cfg = types.GenerateContentConfig(
        response_modalities=['IMAGE'],
        image_config=types.ImageConfig(aspect_ratio=SEITENVERHAELTNIS),
    )
    resp = client.models.generate_content(model=modell, contents=prompt, config=cfg)
    for cand in resp.candidates or []:
        for part in (cand.content.parts if cand.content else []) or []:
            if getattr(part, 'inline_data', None) and part.inline_data.data:
                return part.inline_data.data
    grund = ''
    try:
        grund = str(resp.candidates[0].finish_reason)
    except Exception:
        pass
    raise RuntimeError(f'Kein Bild zurückbekommen {grund}'.strip())


def speichere_png(daten, ziel):
    from PIL import Image
    img = Image.open(io.BytesIO(daten))
    tmp = ziel.with_suffix('.tmp')
    img.save(tmp, 'PNG')
    os.replace(tmp, ziel)
    return img.size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--anzahl', type=int, default=20)
    ap.add_argument('--ids', default='')
    ap.add_argument('--modell', default=MODELL)
    ap.add_argument('--probe', action='store_true')
    a = ap.parse_args()

    OUT.mkdir(exist_ok=True)
    alle = lade_prompts()
    if a.ids:
        wunsch = {x.strip() for x in a.ids.split(',') if x.strip()}
        offen = [d for d in alle if d[0] in wunsch]
    else:
        offen = [d for d in alle if not (OUT / f'{d[0]}.png').exists()]
    print(f'{len(alle)} Prompts gefunden, {len(offen)} Bilder fehlen noch.')
    if not offen:
        print('Alles fertig.')
        return
    if a.probe:
        for rid, titel, prompt in offen[:a.anzahl]:
            print(f'  {rid}  {titel}')
        print(f'\nBeispiel-Prompt für {offen[0][0]}:\n{offen[0][2]}')
        return

    schluessel = os.environ.get('GEMINI_API_KEY') or getpass.getpass('Gemini-API-Schlüssel (wird nicht angezeigt): ').strip()
    if not schluessel:
        sys.exit('Ohne Schlüssel geht es nicht.')
    from google import genai
    client = genai.Client(api_key=schluessel)

    i = 0
    while i < len(offen):
        paket = offen[i:i + a.anzahl]
        print(f'\nPaket: {paket[0][0]} bis {paket[-1][0]} ({len(paket)} Bilder)')
        for rid, titel, prompt in paket:
            ziel = OUT / f'{rid}.png'
            for versuch in range(1, 4):
                try:
                    groesse = speichere_png(erzeuge(client, a.modell, prompt), ziel)
                    print(f'  ✓ {rid}  {titel}  ({groesse[0]}×{groesse[1]})')
                    protokoll(rid, titel, 'ok', f'{groesse[0]}x{groesse[1]} {a.modell}')
                    break
                except Exception as e:
                    meldung = str(e)
                    if any(k in meldung for k in ('API key', 'API_KEY', 'PERMISSION_DENIED', 'not found', 'NOT_FOUND')):
                        sys.exit(f'Abbruch: {meldung[:300]}')
                    if 'exceeded your current quota' in meldung or 'limit: 0' in meldung:
                        sys.exit('\nAbbruch: Dein Gemini-Schlüssel hat kein Kontingent für Bilder.\n'
                                 'In Google AI Studio die Abrechnung für das Projekt aktivieren (Billing),\n'
                                 'ein paar Minuten warten und dann neu starten.\n'
                                 f'Originalmeldung: {meldung[:400]}')
                    warte = 20 * versuch if ('429' in meldung or 'RESOURCE_EXHAUSTED' in meldung) else 5 * versuch
                    if versuch < 3:
                        print(f'  … {rid}: {meldung[:120]} – neuer Versuch in {warte} s')
                        time.sleep(warte)
                    else:
                        print(f'  ✗ {rid}: {meldung[:200]}')
                        protokoll(rid, titel, 'fehler', meldung[:300])
            time.sleep(2)
        i += a.anzahl
        rest = len(offen) - i
        if rest <= 0:
            break
        try:
            antwort = input(f'\nPaket fertig. Bilder prüfen in {OUT}\nNoch {rest} offen. Nächstes Paket starten? (j/n) ').strip().lower()
        except EOFError:
            antwort = 'n'
        if antwort not in ('j', 'ja', 'y', ''):
            break
    print('\nFertig für heute. Beim nächsten Start geht es mit den fehlenden Bildern weiter.')
    print(f'Protokoll: {LOG}')


if __name__ == '__main__':
    main()
