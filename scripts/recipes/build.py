import json,re,collections
from lib import L
import os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
DB={f['id']:f for f in json.load(open(os.path.join(ROOT,'app','src','data','foodDatabase.json'),encoding='utf-8'))}
NK=['kal','protein','fat','carbs','vit_a','vit_d','vit_e','vit_k','vit_c','b1','b2','b3','b6','b12','folat','eisen','zink','mag','cal','fiber','jod']
# DGE-Referenz Frau 25-50 (für Tags/Fokus)
REF={'vit_a':700,'vit_d':20,'vit_e':8,'vit_k':60,'vit_c':110,'b1':1.0,'b2':1.1,'b3':13,'b6':1.4,'b12':4.0,'folat':300,'eisen':14,'zink':8,'mag':300,'cal':1000,'fiber':30,'jod':150,'protein':50}
TAG={'vit_a':'vitamin_a','vit_d':'vitamin_d','vit_e':'vitamin_e','vit_k':'vitamin_k','vit_c':'vitamin_c','b1':'vitamin_b1','b2':'vitamin_b2','b3':'vitamin_b3','b6':'vitamin_b6','b12':'vitamin_b12','folat':'vitamin_b9','eisen':'eisen','zink':'zink','mag':'magnesium','cal':'calcium','jod':'jod'}
LABEL={'vit_a':'Vitamin A','vit_d':'Vitamin D','vit_e':'Vitamin E','vit_k':'Vitamin K','vit_c':'Vitamin C','b1':'Vitamin B1','b2':'Vitamin B2','b3':'Niacin','b6':'Vitamin B6','b12':'Vitamin B12','folat':'Folat','eisen':'Eisen','zink':'Zink','mag':'Magnesium','cal':'Calcium','fiber':'Ballaststoffe','jod':'Jod','protein':'Eiweiß'}
UNIT={'vit_a':'µg','vit_d':'µg','vit_e':'mg','vit_k':'µg','vit_c':'mg','b1':'mg','b2':'mg','b3':'mg','b6':'mg','b12':'µg','folat':'µg','eisen':'mg','zink':'mg','mag':'mg','cal':'mg','fiber':'g','jod':'µg','protein':'g'}
ALLERG={'gl':'gluten','mi':'milk','eg':'egg','fi':'fish','cr':'crustaceans','pe':'peanut','nu':'tree_nuts','se':'sesame','so':'soy','ce':'celery','mu':'mustard','su':'sulphites'}
RECIPES=[]
PLUR={'Scheiben':'Scheibe','Dosen':'Dose','Zehen':'Zehe','Stangen':'Stange','Blätter':'Blatt','Kugeln':'Kugel','Filets':'Filet','Platten':'Platte','Knollen':'Knolle','Köpfe':'Kopf','Bund':'Bund','Beete':'Beet','Prisen':'Prise','Päckchen':'Päckchen'}
def num(q): return float(q.replace(',','.')) if q else None
def fmtq(q):
    if q is None: return ''
    if abs(q-0.5)<1e-9: return '½'
    if abs(q-0.25)<1e-9: return '¼'
    if abs(q-1.5)<1e-9: return '1 ½'
    if abs(q-0.75)<1e-9: return '¾'
    return str(int(q)) if q==int(q) else str(q).replace('.',',')
def parse_ing(block):
    out=[]
    for line in block.strip().splitlines():
        line=line.strip()
        if not line: continue
        left,name,key=[p.strip() for p in line.split('|')]
        grams=None
        if '=' in key: key,g=key.split('='); grams=float(g)
        assert key in L, f'unbekannte Zutat {key} ({line})'
        bls,flags,uw=L[key]
        left=left.replace('1 ½','1.5').replace('½','0.5').replace('¼','0.25').replace('¾','0.75')
        m=re.match(r'^([\d.,]+)?\s*(.*)$',left); q=num(m.group(1)); unit=m.group(2).strip()
        if grams is None:
            if q is None: grams=0
            elif unit in ('g',''): grams=q if unit=='g' else q*uw.get('Stück', next(iter(uw.values())) if uw else 0)
            elif unit=='kg': grams=q*1000
            elif unit in ('ml','l'): grams=q*(1000 if unit=='l' else 1)*uw.get('ml',1)
            elif bls is None: grams=0
            else:
                base=PLUR.get(unit.split()[0],unit.split()[0])
                assert base in uw, f'Einheit {unit} fehlt für {key} ({line})'
                grams=q*uw[base]
        if unit=='' and q is not None and grams==0 and bls: raise Exception(f'Stückgewicht fehlt {key}')
        text=(fmtq(q)+' '+unit+' '+name).strip() if q is not None else name
        text=re.sub(r'\s+',' ',text)
        out.append({'text':text,'qty':q,'unit':unit,'name':name,'key':key,'g':round(grams,1),'bls':bls,'flags':flags})
    return out
def R(id,title,meal,kind,seasons,serv,prep,cook,ing,steps,taste,occ='',tip=None,kid=False,photo=None,src='wellanni',allergens_extra='',lowcarb_ok=None,wait=0):
    RECIPES.append(dict(wait=wait,id=id,title=title,meal=meal,kind=kind,seasons=seasons,serv=serv,prep=prep,cook=cook,ing=parse_ing(ing),steps=steps,taste=taste,occ=[o for o in occ.split(',') if o],tip=tip,kid=kid,photo=photo,src=src,ax=allergens_extra))
def compute(r):
    tot={k:0.0 for k in NK}; contrib=collections.defaultdict(lambda: collections.Counter())
    for i in r['ing']:
        if not i['bls'] or not i['g']: continue
        f=DB[i['bls']]
        for k in NK:
            v=f.get(k) or 0
            x=v*i['g']/100; tot[k]+=x; contrib[k][i['name']]+=x
    per={k:round(v/r['serv'],2) for k,v in tot.items()}
    per['kal']=round(per['kal'])
    return per,contrib
def finalize(r):
    per,contrib=compute(r)
    flags=' '.join(i['flags'] for i in r['ing'])
    meat='M' in flags.split(); fish='F' in flags.split(); animal=meat or fish or 'A' in flags.split()
    alls=sorted({ALLERG[a] for a in flags.split() if a in ALLERG} | set(x for x in r['ax'].split(',') if x))
    vegetarian=not meat and not fish; vegan=vegetarian and not animal
    lowcarb=per['carbs']<=20
    cat='keto' if lowcarb and r['meal']!='snack' else ('vegetarisch' if vegetarian else 'fleisch_fisch')
    tags=[TAG[k] for k in TAG if per[k]>=0.25*REF[k]]
    focus=[]
    for k in ['protein','fiber','eisen','folat','mag','cal','vit_d','b12','jod','vit_c','zink','vit_a']:
        if per[k]>=0.3*REF[k]:
            src=[n for n,v in contrib[k].most_common(2) if v>0]
            focus.append({'key':k,'label':LABEL[k],'amount':round(per[k],1) if per[k]<100 else round(per[k]),'unit':UNIT[k],'sources':src})
    total=r['prep']+r['cook']
    occ=list(r['occ'])
    if total<=20 and 'schnell' not in occ: occ.append('schnell')
    if r['cook']==0 and 'ohne_kochen' not in occ: occ.append('ohne_kochen')
    return {
      'id':r['id'],'title':r['title'],'mealType':r['meal'],'kind':r['kind'],
      'category':cat,'vegetarian':vegetarian,'vegan':vegan,'lowCarb':lowcarb,
      'seasons':list(r['seasons']),'occasions':occ,'kidFriendly':r['kid'],
      'servings':r['serv'],'prepMin':r['prep'],'cookMin':r['cook'],'waitMin':r['wait'],'duration':f'{total} Min.'+((' + über Nacht' if r['wait']>=480 else f" + {fmtwait(r['wait'])} Ruhezeit") if r['wait'] else ''),
      'ingredients':[i['text'] for i in r['ing']],
      'ingredientsData':[{'qty':i['qty'],'unit':i['unit'],'name':i['name'],'g':i['g'],'bls':i['bls']} for i in r['ing']],
      'steps':r['steps'],'highlight':r['taste'],'tip':r['tip'],'focus':focus,'allergens':alls,
      'tags':tags or ['vitamin_c'] ,'nutritionPerServing':per,'nutritionConfidence':'reviewed',
      'image':r['photo'],'source':r['src'],
    }
def fmtwait(m):
    if m>=480: return 'über Nacht'
    if m>=60: return (f'{m//60} Std.' if m%60==0 else f'{m/60:.1f} Std.'.replace('.',','))
    return f'{m} Min.'
def check(out):
    warn=[]
    for r in out:
        n=r['nutritionPerServing']; k=n['kal']
        rng={'breakfast':(220,650),'lunch':(250 if r['kind']=='suppe' else 280,900),'snack':(60,420)}[r['mealType']]
        if not rng[0]<=k<=rng[1]: warn.append(f"{r['id']}: {k} kcal/Portion")
        if r['mealType']=='lunch' and n['protein']<(10 if r['kind']=='suppe' else 12): warn.append(f"{r['id']}: nur {n['protein']} g Eiweiß")
        if len(r['steps'])<2: warn.append(f"{r['id']}: <2 Schritte")
        t=' '.join(r['ingredients']).lower()
    return warn
