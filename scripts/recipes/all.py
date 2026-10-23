import json,collections,re,importlib
import build
MODS=['rec_nicole','rec_fr','rec_suppen','rec_eintopf','rec_ofen','rec_pfanne','rec_pasta','rec_bowls','rec_snacks','rec_lowcarb']
CH={}
for m in MODS:
    mod=importlib.import_module(m); CH.update(mod.CH)
OUT=[build.finalize(r) for r in build.RECIPES]
if __name__=='__main__':
    import os,sys
    ids=[r['id'] for r in OUT]
    assert len(ids)==len(set(ids)), 'doppelte IDs'
    warn=build.check(OUT)
    for w in warn: print('WARNUNG', w)
    root=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
    txt='[\n'+',\n'.join(json.dumps(r,ensure_ascii=False,separators=(',',':')) for r in OUT)+'\n]\n'
    open(os.path.join(root,'app','src','data','recipes.json'),'w',encoding='utf-8').write(txt)
    print(f'{len(OUT)} Rezepte geschrieben nach app/src/data/recipes.json')
