import json,collections,re,importlib
import build
MODS=['rec_nicole','rec_fr','rec_suppen','rec_eintopf','rec_ofen','rec_pfanne','rec_pasta','rec_bowls','rec_snacks','rec_lowcarb']
CH={}
for m in MODS:
    mod=importlib.import_module(m); CH.update(mod.CH)
# 2.2.1: Fotos aus Instagram Woche 2 (Content-Strategie/Bilder/w2_*), als 640x368-WebP in app/assets/recipes/
EXTRA_PHOTOS={'shakshuka':'shakshuka.webp','linsen_dal_spinat_kokos':'linsen-dal-spinat-kokos.webp','ruehrei_raeucherlachs':'ruehrei-raeucherlachs.webp',
 'kuerbis_pasta_salbei':'kuerbis-pasta-salbei.webp','lachsfilet_spinat':'lachsfilet-spinat.webp','gebackene_eier_spinat_feta':'gebackene-eier-spinat-feta.webp',
 'buddha_bowl_kichererbsen_tahini':'buddha-bowl-kichererbsen-tahini.webp','champignon_ruehrei':'champignon-ruehrei.webp',
 'haehnchenschenkel_wurzelgemuese':'haehnchenschenkel-wurzelgemuese.webp','fischsuppe_kabeljau_fenchel':'fischsuppe-kabeljau-fenchel.webp',
 'ofenaepfel_hafer_nuss':'ofenaepfel-hafer-nuss.webp','linsensuppe_zitrone':'linsensuppe-zitrone.webp'}
for _r in build.RECIPES:
    if _r['id'] in EXTRA_PHOTOS and not _r['photo']: _r['photo']=EXTRA_PHOTOS[_r['id']]
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
