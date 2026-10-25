"""WellANNI Instagram-Renderer: Folien als HTML -> PNG (Playwright), Reels -> MP4 (ffmpeg).

Aufruf: python3 render.py <spec-modul> <ausgabeordner>
Das Spec-Modul definiert POSTS (Liste von Dicts).
"""
import html, importlib, json, os, subprocess, sys, pathlib

HERE = pathlib.Path(__file__).parent.resolve()
SIZES = {'post': (1080, 1350), 'reel': (1080, 1920), 'story': (1080, 1920)}

CSS = """
@font-face{font-family:Figtree;font-weight:400;src:url(figtree-400.woff2)}
@font-face{font-family:Figtree;font-weight:500;src:url(figtree-500.woff2)}
@font-face{font-family:Figtree;font-weight:600;src:url(figtree-600.woff2)}
@font-face{font-family:Figtree;font-weight:700;src:url(figtree-700.woff2)}
:root{--ink:#23342A;--ink2:rgba(35,52,42,.72);--bg:#F3F4EE;--green:#5B7B5C;--green-d:#46634A;--mint:#E3EBDD;--cream:#FBF8F1;--warm:#C9773E}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:WPX;height:HPX;overflow:hidden}
body{font-family:Figtree,sans-serif;color:var(--ink);background:var(--bg);position:relative;-webkit-font-smoothing:antialiased}
.bg-soft{position:absolute;inset:0;background:
 radial-gradient(60% 45% at 15% 10%,#DDE8D6 0,transparent 70%),
 radial-gradient(55% 40% at 90% 85%,#EADFCB 0,transparent 70%),var(--bg)}
.bg-dark{position:absolute;inset:0;background:radial-gradient(70% 50% at 20% 10%,#3E5A45 0,transparent 70%),radial-gradient(60% 50% at 90% 90%,#5A3F2A 0,transparent 70%),#1F2D24}
.dark{color:#F3F4EE}.dark .sub,.dark .item p{color:rgba(243,244,238,.8)}.dark .kicker{background:rgba(255,255,255,.12);color:#DDE8D6}
.dark .item{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.12)}.dark .num{background:#DDE8D6;color:#1F2D24}
.pad{position:absolute;inset:0;padding:120px 88px 190px;display:flex;flex-direction:column}
.center{justify-content:center}
body.reel .pad,body.story .pad{padding:260px 88px 440px}
body.reel .brand,body.story .brand{top:130px;bottom:auto}
body.reel .hint,body.story .hint{top:130px;bottom:auto}
body.reel .foot,body.story .foot{bottom:300px}
.kicker{display:inline-block;align-self:flex-start;font-weight:600;font-size:30px;letter-spacing:.08em;text-transform:uppercase;color:var(--green-d);background:rgba(91,123,92,.12);padding:12px 22px;border-radius:999px;margin-bottom:40px}
h1{font-weight:700;letter-spacing:-.03em;line-height:1.02}
h1 em{font-style:normal;color:var(--green)}.dark h1 em{color:#B9D3B0}
.sub{font-size:44px;line-height:1.35;color:var(--ink2);margin-top:32px}
.brand{position:absolute;left:88px;bottom:80px;display:flex;align-items:center;gap:14px;font-weight:600;font-size:34px}
.dot{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#9DB892,#C6D8BC);box-shadow:inset 0 0 0 6px rgba(255,255,255,.55)}
.hint{position:absolute;right:88px;bottom:72px;font-weight:600;font-size:30px;color:var(--green-d)}
.dark .hint,body.darkbody .hint{color:#B9D3B0}
body.darkbody .brand{color:#F3F4EE}
.dark .big{color:#B9D3B0}
body.darkbody .page{color:rgba(243,244,238,.7)}
.page{position:absolute;right:88px;top:96px;font-size:26px;color:var(--ink2);font-weight:500}
.items{display:flex;flex-direction:column;gap:22px;margin-top:44px}
.item{display:flex;gap:28px;align-items:center;background:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.9);border-radius:32px;padding:34px 38px;box-shadow:0 8px 30px rgba(35,52,42,.06)}
.num{flex:none;width:68px;height:68px;border-radius:50%;background:var(--green);color:#fff;font-weight:700;font-size:34px;display:grid;place-items:center}
.item h3{font-size:44px;font-weight:700;letter-spacing:-.01em}
.item p{font-size:34px;line-height:1.35;color:var(--ink2);margin-top:6px}
.foot{position:absolute;left:88px;right:88px;bottom:150px;font-size:24px;line-height:1.35;color:var(--ink2)}
.dark .foot{color:rgba(243,244,238,.6)}
.photo{position:absolute;left:0;right:0;top:0;background-size:cover;background-position:center}
.card{position:absolute;left:56px;right:56px;background:rgba(251,248,241,.94);border-radius:40px;padding:52px 56px;box-shadow:0 20px 60px rgba(35,52,42,.18)}
.card .kicker{margin-bottom:26px}
.tags{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px}
.tag{font-size:26px;font-weight:600;background:var(--mint);color:var(--green-d);padding:10px 20px;border-radius:999px}
.big{font-size:150px;font-weight:700;letter-spacing:-.04em;line-height:.95;color:var(--green)}
.sticker{position:absolute;left:120px;right:120px;border:3px dashed rgba(91,123,92,.0);border-radius:40px}
.cta{display:inline-flex;align-self:flex-start;margin-top:44px;background:var(--green);color:#fff;font-weight:600;font-size:34px;padding:22px 36px;border-radius:999px}
"""


def esc(s):
    """HTML-escapen, *Text* wird zur grünen Hervorhebung."""
    s = html.escape(s.replace('\\*', '\x00'))
    parts = s.split('*')
    return ''.join(f'<em>{p}</em>' if i % 2 else p for i, p in enumerate(parts)).replace('\n', '<br>').replace('\x00', '*')


def brand(hint=''):
    h = f'<div class="hint">{esc(hint)}</div>' if hint else ''
    return f'<div class="brand"><span class="dot"></span>WellANNI</div>{h}'


def slide_html(fmt, s, idx, total):
    w, h = SIZES[fmt]
    t = s['t']
    dark = s.get('dark')
    bg = '<div class="bg-dark"></div>' if dark else '<div class="bg-soft"></div>'
    cls = 'dark' if dark else ''
    page = f'<div class="page">{idx}/{total}</div>' if fmt == 'post' and total > 1 and idx > 1 else ''
    hint = s.get('hint', 'Wisch mal →' if (fmt == 'post' and total > 1 and idx == 1) else ('wellanni.de' if idx == total else ''))
    size = s.get('size', 128 if fmt == 'post' else 132)
    kick = f'<div class="kicker">{esc(s["kicker"])}</div>' if s.get('kicker') else ''
    sub = f'<p class="sub">{esc(s["sub"])}</p>' if s.get('sub') else ''
    foot = f'<div class="foot">{esc(s["foot"])}</div>' if s.get('foot') else ''
    if t == 'cover':
        top = s.get('top', 260 if fmt != 'post' else 150)
        body = f'{bg}<div class="pad center {cls}">{kick}<h1 style="font-size:{size}px">{esc(s["title"])}</h1>{sub}{foot}</div>'
    elif t == 'big':
        body = f'{bg}<div class="pad center {cls}">{kick}<div class="big" style="font-size:{s.get("bigsize",170)}px">{esc(s["big"])}</div><h1 style="font-size:{s.get("size",64 if fmt=="post" else 72)}px;margin-top:34px">{esc(s["title"])}</h1>{sub}{foot}</div>'
    elif t == 'list':
        items = ''.join(
            f'<div class="item"><span class="num">{i+1 if not s.get("icons") else s["icons"][i]}</span><div><h3>{esc(a)}</h3>{f"<p>{esc(b)}</p>" if b else ""}</div></div>'
            for i, (a, b) in enumerate(s['items']))
        body = f'{bg}<div class="pad center {cls}">{kick}<h1 style="font-size:{s.get("size",88 if fmt=="post" else 96)}px">{esc(s["title"])}</h1>{sub}<div class="items" style="gap:{s.get("gap",22)}px">{items}</div>{foot}</div>'
    elif t == 'photo':
        ph = s.get('photo_h', 0.62) if fmt == 'post' else 0.66
        pos = s.get('pos', 'center')
        tags = ''.join(f'<span class="tag">{esc(x)}</span>' for x in s.get('tags', []))
        tags = f'<div class="tags">{tags}</div>' if tags else ''
        card_bottom = s.get('card_bottom', 400 if fmt != 'post' else 120)
        body = (f'<div class="bg-soft"></div><div class="photo" style="height:{int(h*ph)}px;background-image:url(photos/{s["photo"]});background-position:{pos}"></div>'
                f'<div class="card" style="bottom:{card_bottom}px">{kick}<h1 style="font-size:{s.get("size",78)}px">{esc(s["title"])}</h1>{sub.replace("sub","sub").replace("margin-top:32px","")}{tags}</div>')
    elif t == 'end':
        cta = f'<div class="cta">{esc(s["cta"])}</div>' if s.get('cta') else ''
        body = f'{bg}<div class="pad center {cls}">{kick}<h1 style="font-size:{size}px">{esc(s["title"])}</h1>{sub}{cta}{foot}</div>'
    elif t == 'story':
        body = f'{bg}<div class="pad {cls}" style="padding-top:{s.get("top",380)}px">{kick}<h1 style="font-size:{s.get("size",96)}px">{esc(s["title"])}</h1>{sub}{foot}</div>'
        hint = s.get('hint', '')
    else:
        raise ValueError(t)
    css = CSS.replace('WPX', f'{w}px').replace('HPX', f'{h}px')
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body class="{fmt} {'darkbody' if dark else ''}">{body}{page}{brand(hint)}</body></html>'


def main():
    spec = importlib.import_module(sys.argv[1])
    out = pathlib.Path(sys.argv[2]).resolve()
    out.mkdir(parents=True, exist_ok=True)
    jobs = []
    for p in spec.POSTS:
        d = out / p['folder']
        d.mkdir(parents=True, exist_ok=True)
        n = len(p['slides'])
        for i, s in enumerate(p['slides'], 1):
            hp = HERE / f'_tmp_{p["id"]}_{i:02d}.html'
            hp.write_text(slide_html(p['fmt'], s, i, n), encoding='utf-8')
            w, h = SIZES[p['fmt']]
            png = d / (f'{p["id"]}_{i:02d}.png' if n > 1 else f'{p["id"]}.png')
            jobs.append({'html': str(hp), 'png': str(png), 'w': w, 'h': h})
    (HERE / '_jobs.json').write_text(json.dumps(jobs))
    subprocess.run(['node', str(HERE / 'shoot.js'), str(HERE / '_jobs.json')], check=True)
    for j in jobs:
        os.remove(j['html'])
    # Reels
    for p in spec.POSTS:
        if p['fmt'] != 'reel':
            continue
        d = out / p['folder']
        n = len(p['slides'])
        pngs = [d / f'{p["id"]}_{i:02d}.png' for i in range(1, n + 1)]
        durs = [s.get('dur', 3.2) for s in p['slides']]
        make_reel(pngs, durs, d / f'{p["id"]}.mp4')
        # Cover = erste Folie, Einzelfolien als Cover behalten, Rest löschen
        os.replace(pngs[0], d / f'{p["id"]}_cover.png')
        for x in pngs[1:]:
            os.remove(x)


def make_reel(pngs, durs, mp4, fade=0.45, fps=30):
    args = ['ffmpeg', '-y', '-loglevel', 'error']
    for png, du in zip(pngs, durs):
        args += ['-loop', '1', '-t', f'{du + fade:.2f}', '-i', str(png)]
    filt = []
    for i, du in enumerate(durs):
        frames = int((du + fade) * fps)
        # sanfter Zoom 1.00 -> 1.035
        filt.append(f"[{i}:v]fps={fps},scale=w='trunc(1080*(1+0.03*t/{du+fade:.2f})/2)*2':h=-2:eval=frame,crop=1080:1920,setsar=1,format=yuv420p[v{i}]")
    last = 'v0'
    t = durs[0]
    for i in range(1, len(durs)):
        filt.append(f'[{last}][v{i}]xfade=transition=fade:duration={fade}:offset={t:.2f}[x{i}]')
        last = f'x{i}'
        t += durs[i]
    args += ['-filter_complex', ';'.join(filt), '-map', f'[{last}]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-preset', 'medium', '-movflags', '+faststart', '-r', str(fps), str(mp4)]
    subprocess.run(args, check=True)


if __name__ == '__main__':
    sys.path.insert(0, str(HERE))
    main()
