"""Generate sandbox HTML previews for 2nd-page card designs. NOT published."""
from pathlib import Path

ROOT = Path(__file__).parent
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">'

BASE_CSS = """
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:Montserrat,system-ui,sans-serif;background:#08080a;color:#e8e4dc;line-height:1.6;padding:1.5rem}
a{color:#e8c97a}
.wrap{max-width:720px;margin:0 auto}
.tag{font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#6b6560;margin-bottom:.5rem}
h1{font-family:"Cormorant Garamond",serif;font-size:2rem;margin:0 0 1rem;color:#f5f0e8}
.note{font-size:.8rem;color:#6b6560;margin-bottom:1.5rem;font-style:italic}
.btn{display:inline-block;padding:.75rem 1.4rem;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:#08080a;background:linear-gradient(90deg,#3b82f6,#22c55e);border-radius:8px;margin-top:1rem}
.ghost{display:inline-block;margin-left:.5rem;padding:.75rem 1.2rem;font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;color:#e8c97a;border:1px solid rgba(201,166,107,.45);border-radius:8px}
"""


def shell(title: str, badge: str, tagline: str, body: str, style_note: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — Sandbox</title>{FONTS}<style>{BASE_CSS}{body}</style></head>
<body><div class="wrap">
<p class="tag">SANDBOX · NOT PUBLISHED · {badge}</p>
<h1>{title}</h1>
<p class="note">{style_note}</p>
{tagline}
</div></body></html>"""


AMERICA = [
    ("style-01-tickets", "America 250 · Style 01 — Ticket Strip",
     "Three event tickets in a row — scan-and-pick energy.",
     """
.tickets{display:grid;gap:.75rem;margin:1.25rem 0}
.ticket{padding:1rem 1.1rem;border-radius:10px;border:2px solid rgba(201,166,107,.35);background:#12121a;position:relative;overflow:hidden}
.ticket::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--c,#e8c97a)}
.ticket h3{margin:0 0 .25rem;font-family:"Cormorant Garamond",serif;font-size:1.2rem;color:#f5f0e8}
.ticket .price{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--c,#e8c97a)}
.ticket p{margin:.35rem 0 0;font-size:.82rem;color:#8a8580}
.ticket.free{--c:#f87171}.ticket.mid{--c:#e8c97a}.ticket.both{--c:#6ec0ff}
.vet{margin:1rem 0;padding:.85rem;border-radius:8px;border:1px dashed rgba(201,166,107,.4);font-size:.82rem;color:#b8b2ac;text-align:center}
""",
     """<div class="tickets">
<div class="ticket free"><h3>Community Flyer</h3><p class="price">Free · July 4 only</p><p>Official Kuna 250 poster. Your name. Generic badge. Request on site.</p></div>
<div class="ticket mid"><h3>Custom 250</h3><p class="price">$250 · one event</p><p>Your logo, QR, custom back. July 4 or Kuna Days. PDF + PNG.</p></div>
<div class="ticket both"><h3>Kuna 250 ×2</h3><p class="price">$420 · both events</p><p>Both custom flyers + cling + social graphics. Save $80.</p></div>
</div>
<p class="vet"><strong>Kuna Legends &amp; Veteran-Owned Businesses:</strong> 50% off paid — $125 / $210</p>
<p style="font-size:.9rem;color:#9a9590">Free for the 4th. Kuna Days is where custom shines.</p>
<a class="btn" href="#">Request My Flyer</a>"""),

    ("style-02-hero-stack", "America 250 · Style 02 — Hero Stack",
     "Big event hero, stacked offer rows — main-site america section vibe.",
     """
.hero{padding:1.25rem;border-radius:14px;background:linear-gradient(135deg,#1a2744,#2a1a1a);border:1px solid rgba(255,255,255,.1);margin-bottom:1rem;text-align:center}
.hero h2{margin:0;font-family:"Cormorant Garamond",serif;font-size:1.5rem;color:#f5f0e8}
.hero p{margin:.5rem 0 0;font-size:.85rem;color:#b8b2ac}
.row{display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.08)}
.row:last-child{border:0}
.row strong{font-family:"Cormorant Garamond",serif;font-size:1.1rem;color:#f5f0e8}
.row span{font-weight:700;color:#e8c97a;font-size:.9rem}
.row p{margin:.2rem 0 0;font-size:.78rem;color:#6b6560}
""",
     """<div class="hero"><h2>★ USA 250 · Kuna Edition ★</h2><p>July 4 party at Bernie Fisher Park. Kuna Days parade ~1 month later.</p></div>
<div class="row"><div><strong>Community</strong><p>Free July 4 window poster — site request</p></div><span>FREE</span></div>
<div class="row"><div><strong>Custom 250</strong><p>Logo + QR + custom back · one event</p></div><span>$250</span></div>
<div class="row"><div><strong>Kuna 250 ×2</strong><p>Both events · cling · social · save $80</p></div><span>$420</span></div>
<p style="margin-top:1rem;font-size:.82rem;color:#8a8580">Veteran-Owned Businesses &amp; Kuna Legends — half off paid tiers.</p>
<a class="btn" href="#">Light That Fuse</a>"""),

    ("style-03-grid", "America 250 · Style 03 — Offer Grid",
     "2-column grid, free tile highlighted — sticky and scannable.",
     """
.grid{display:grid;grid-template-columns:1fr 1fr;gap:.65rem}
.tile{padding:1rem;border-radius:10px;background:#0c0c12;border:1px solid rgba(255,255,255,.08)}
.tile.wide{grid-column:1/-1;border-color:rgba(248,113,113,.45);background:rgba(248,113,113,.08)}
.tile h3{margin:0 0 .35rem;font-size:.95rem;color:#f5f0e8}
.tile .p{font-size:1.1rem;font-weight:700;color:#e8c97a;margin-bottom:.35rem}
.tile p{margin:0;font-size:.78rem;color:#8a8580}
.addon{margin-top:1rem;padding:1rem;border-radius:10px;border:1px solid rgba(110,231,160,.3);background:rgba(110,231,160,.06)}
.addon h4{margin:0 0 .35rem;font-size:.85rem;color:#6ee7a0}
.addon p{margin:0;font-size:.8rem;color:#9a9590}
""",
     """<div class="grid">
<div class="tile wide"><h3>July 4 Community</h3><p class="p">FREE</p><p>My gift to Kuna SMBs. Request on site. No parade — just the party.</p></div>
<div class="tile"><h3>Custom 250</h3><p class="p">$250</p><p>One event fully yours</p></div>
<div class="tile"><h3>Kuna 250 ×2</h3><p class="p">$420</p><p>Both events bundled</p></div>
</div>
<div class="addon"><h4>+ Logo Motion Reel (optional)</h4><p>6–10 sec animated logo clip for social — great add-on for Custom 250 and ×2 packages. Ask when you request.</p></div>
<a class="btn" href="#">Request at america-250</a>"""),

    ("style-04-timeline", "America 250 · Style 04 — Event Timeline",
     "Shows the two-beat story then drops pricing — drives the upsell.",
     """
.timeline{margin:1rem 0;padding-left:1.25rem;border-left:2px solid rgba(201,166,107,.4)}
.step{margin-bottom:1.25rem;position:relative}
.step::before{content:"";position:absolute;left:-1.45rem;top:.35rem;width:10px;height:10px;border-radius:50%;background:#e8c97a}
.step h3{margin:0;font-size:.9rem;color:#e8c97a;letter-spacing:.08em;text-transform:uppercase}
.step p{margin:.25rem 0 0;font-size:.85rem;color:#b8b2ac}
.pricing{margin-top:1.5rem;padding:1.1rem;border-radius:12px;background:linear-gradient(180deg,#12121a,#0c0c10);border:1px solid rgba(201,166,107,.35)}
.pricing h2{margin:0 0 .75rem;font-family:"Cormorant Garamond",serif;font-size:1.35rem;color:#f5f0e8}
.pill{display:inline-block;margin:.2rem .35rem .2rem 0;padding:.35rem .65rem;border-radius:999px;font-size:.72rem;font-weight:600;background:rgba(201,166,107,.15);color:#e8c97a}
""",
     """<div class="timeline">
<div class="step"><h3>July 4</h3><p>Bernie Fisher Park · fireworks · food trucks · <strong>free community flyer</strong> (site request)</p></div>
<div class="step"><h3>Kuna Days</h3><p>The parade · bigger crowd · <strong>custom packages</strong> — where your brand shines</p></div>
</div>
<div class="pricing"><h2>Pick your package</h2>
<span class="pill">Community FREE</span><span class="pill">Custom $250</span><span class="pill">Both $420</span>
<p style="margin:.75rem 0 0;font-size:.82rem;color:#8a8580">Veteran-Owned Businesses &amp; Kuna Legends: $125 / $210</p></div>
<a class="btn" href="#">Get on the list</a>"""),

    ("style-05-bold-bar", "America 250 · Style 05 — Bold Bar",
     "One giant $420 anchor, two supporting offers — hard sell, simple read.",
     """
.anchor{text-align:center;padding:1.5rem 1rem;margin:1rem 0;border-radius:14px;background:linear-gradient(135deg,#e8c97a,#34d399);color:#08080a}
.anchor .big{font-family:"Cormorant Garamond",serif;font-size:3rem;font-weight:700;line-height:1;margin:0}
.anchor p{margin:.5rem 0 0;font-size:.88rem;font-weight:600}
.side{display:grid;grid-template-columns:1fr 1fr;gap:.65rem;margin:1rem 0}
.side div{padding:.9rem;border-radius:8px;background:#12121a;border:1px solid rgba(255,255,255,.1);text-align:center}
.side strong{display:block;font-size:1.2rem;color:#f5f0e8}
.side span{font-size:.75rem;color:#8a8580}
""",
     """<p style="text-align:center;font-size:.95rem;color:#b8b2ac">Free for the 4th. Kuna Days is where custom shines.</p>
<div class="side"><div><strong>FREE</strong><span>July 4 community</span></div><div><strong>$250</strong><span>Custom · one event</span></div></div>
<div class="anchor"><p class="big">$420</p><p>Kuna 250 ×2 — both events · save $80 · done before the parade</p></div>
<p style="text-align:center;font-size:.8rem;color:#6b6560">Veteran-Owned Businesses &amp; Kuna Legends → $125 / $210</p>
<a class="btn" href="#" style="display:block;text-align:center;max-width:16rem;margin:1rem auto 0">Request Now</a>"""),
]

KAVEMAN = [
    ("style-01-club", "Kaveman Style · Style 01 — The Club",
     "Membership ladder — local story tiers.",
     """
.tier{padding:1rem;margin-bottom:.65rem;border-radius:10px;background:#12121a;border-left:4px solid #5eb3ff}
.tier h3{margin:0 0 .3rem;font-family:"Cormorant Garamond",serif;color:#f5f0e8}
.tier .tag{font-size:.68rem;color:#5eb3ff;letter-spacing:.12em;margin:0 0 .35rem}
.tier p{margin:0;font-size:.82rem;color:#8a8580}
""",
     """<div class="tier"><p class="tag">Starter</p><h3>Local Voice Kit</h3><p>Welcome copy, about blurb, and one-page story that sounds like you — not a template.</p></div>
<div class="tier"><p class="tag">Popular</p><h3>Kaveman Club Page</h3><p>Full welcome page, photo direction, social snippets. Kuna Legends &amp; Vet-Owned Biz pricing.</p></div>
<div class="tier"><p class="tag">Full Send</p><h3>Tell My Story</h3><p>Deep-dive interview → website copy → print handout. For businesses ready to stand out.</p></div>
<a class="btn" href="#">Get the Club</a><a class="ghost" href="#">Let's Talk</a>"""),

    ("style-02-cards", "Kaveman Style · Style 02 — Story Cards",
     "Three equal cards — pick your shine level.",
     """
.cards{display:grid;gap:.75rem}
.card{padding:1.1rem;border-radius:12px;background:linear-gradient(180deg,#141420,#0c0c12);border:1px solid rgba(94,179,255,.25)}
.card h3{margin:0 0 .4rem;font-family:"Cormorant Garamond",serif;font-size:1.15rem;color:#8ec5ff}
.card p{margin:0;font-size:.84rem;color:#9a9590}
""",
     """<div class="cards">
<div class="card"><h3>Sound Like You</h3><p>Fix the words on your site, menu, or window sign. Local voice, zero corporate fluff.</p></div>
<div class="card"><h3>Look Like You</h3><p>Logo cleanup, color pass, print-ready assets that match your story.</p></div>
<div class="card"><h3>Show Like You</h3><p>Welcome page + social kit + handout. The full Kaveman treatment.</p></div></div>
<p style="margin-top:1rem;font-size:.82rem;color:#6b6560">Been here 30 years or 30 minutes — I help you shine.</p>
<a class="btn" href="#">Get the Club</a>"""),

    ("style-03-quote", "Kaveman Style · Style 03 — Quote Block",
     "Big italic lead + actionable bullets.",
     """
.lead{font-family:"Cormorant Garamond",serif;font-size:1.45rem;font-style:italic;color:#f5f0e8;text-align:center;margin:1rem 0 1.25rem;line-height:1.35}
ul{margin:0;padding:0;list-style:none}
li{padding:.65rem 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.88rem;color:#b8b2ac}
li strong{color:#8ec5ff}
""",
     """<p class="lead">"Your business has a story. Most websites bury it under jargon."</p>
<ul>
<li><strong>Welcome pages</strong> — first impression that feels local</li>
<li><strong>Story handouts</strong> — print + digital, Kaveman voice</li>
<li><strong>Club pricing</strong> — Kuna Legends &amp; Veteran-Owned Businesses</li>
</ul>
<a class="btn" href="#">Tell My Story</a>"""),

    ("style-04-split", "Kaveman Style · Style 04 — Split Panel",
     "Image-left energy, offers-right — magazine layout.",
     """
.split{display:grid;grid-template-columns:1fr 1.2fr;gap:1rem;align-items:start}
.brand{padding:1.25rem;border-radius:12px;background:rgba(94,179,255,.1);border:1px solid rgba(94,179,255,.3);text-align:center}
.brand img{width:100px;opacity:.9}
.brand p{margin:.75rem 0 0;font-size:.8rem;color:#8a8580}
.offer{padding:.75rem 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:.85rem}
.offer:last-child{border:0}
@media(max-width:560px){.split{grid-template-columns:1fr}}
""",
     """<div class="split"><div class="brand"><img src="../assets/kavemannobg.png" alt="Kaveman"><p>Kaveman Style · Idahome</p></div><div>
<div class="offer"><strong>Get the Club</strong> — branding + story packages</div>
<div class="offer"><strong>Local Voice</strong> — copy that sounds like your shop</div>
<div class="offer"><strong>Special pricing</strong> — Kuna Legends &amp; Vet-Owned Biz</div></div></div>
<a class="btn" href="#">Start Here</a>"""),

    ("style-05-sticky", "Kaveman Style · Style 05 — Sticky CTA Bar",
     "One panel, bottom action locked — mobile-friendly.",
     """
.panel{padding:1.25rem;border-radius:14px;background:#12121a;border:1px solid rgba(94,179,255,.3)}
.panel h2{margin:0 0 .5rem;font-family:"Cormorant Garamond",serif;font-size:1.4rem;color:#f5f0e8}
.sticky-bar{margin-top:1.25rem;padding:1rem;border-radius:10px;background:linear-gradient(90deg,rgba(59,130,246,.2),rgba(34,197,94,.15));display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;justify-content:space-between}
.sticky-bar p{margin:0;font-size:.85rem;font-weight:600;color:#e8c97a}
""",
     """<div class="panel"><h2>Get the Club</h2><p style="margin:0;font-size:.88rem;color:#9a9590">Story-driven materials for Kuna businesses. More options than you might think.</p>
<div class="sticky-bar"><p>Ready to sound like YOU?</p><a class="btn" href="#" style="margin:0">Let's Go</a></div></div>"""),
]

SOLVER = [
    ("style-01-menu", "Problem Solver · Style 01 — Fix Menu",
     "Restaurant-menu style problem → fix list.",
     """
.item{display:flex;justify-content:space-between;gap:1rem;padding:.85rem 0;border-bottom:1px dashed rgba(255,255,255,.1)}
.item:last-child{border:0}
.item h3{margin:0;font-size:.92rem;color:#6ee7a0}
.item p{margin:.2rem 0 0;font-size:.78rem;color:#6b6560}
.item .fix{font-size:.75rem;font-weight:700;color:#4ade80;white-space:nowrap}
""",
     """<div class="item"><div><h3>Menu is a mess</h3><p>Readable layout, print + web, done fast</p></div><span class="fix">Fix it</span></div>
<div class="item"><div><h3>No online presence</h3><p>One-page site or landing that works</p></div><span class="fix">Build it</span></div>
<div class="item"><div><h3>Repeat tasks eating your day</h3><p>Small automation / helper tool with xAI</p></div><span class="fix">Automate it</span></div>
<div class="item"><div><h3>Something weird &amp; specific</h3><p>Tell me — that's usually where we start</p></div><span class="fix">Solve X</span></div>
<a class="btn" href="#">Solve For X</a>"""),

    ("style-02-scope", "Problem Solver · Style 02 — Scope Cards",
     "Three scope tiers — quick / medium / custom build.",
     """
.scope{display:grid;gap:.65rem}
.s{padding:1rem;border-radius:10px;background:#0c0c12;border:1px solid rgba(110,231,160,.2)}
.s h3{margin:0 0 .3rem;font-size:.95rem;color:#6ee7a0}
.s p{margin:0;font-size:.8rem;color:#8a8580}
""",
     """<div class="scope">
<div class="s"><h3>Quick Hit</h3><p>One problem, one fix. Hours not weeks.</p></div>
<div class="s"><h3>Tool Build</h3><p>Custom helper for your shop — spreadsheet, script, or mini app.</p></div>
<div class="s"><h3>Solve For X</h3><p>Bigger ops headache. We scope it honest, build the smallest thing that works.</p></div></div>
<p style="font-size:.82rem;color:#6b6560;margin-top:1rem">Real problems. Real fixes. Real fast.</p>
<a class="btn" href="#">Describe Your Problem</a>"""),

    ("style-03-x", "Problem Solver · Style 03 — Big X",
     "Giant X branding — bold, minimal, confident.",
     """
.xwrap{text-align:center;padding:1.5rem 0}
.x{font-family:"Cormorant Garamond",serif;font-size:5rem;font-weight:700;color:#4ade80;line-height:1;margin:0}
.sub{margin:.5rem 0 1rem;font-size:.9rem;color:#9a9590}
.box{text-align:left;padding:1rem;border-radius:10px;background:#12121a;font-size:.85rem;color:#b8b2ac}
""",
     """<div class="xwrap"><p class="x">X</p><p class="sub">What's broken? That's the variable.</p></div>
<div class="box"><p style="margin:0">I know how the big guys operate. Now I use xAI to build tools that help small businesses like yours win. No bloated projects — smallest fix that works.</p></div>
<a class="btn" href="#">Solve For X</a><a class="ghost" href="#">Let's Talk</a>"""),

    ("style-04-checklist", "Problem Solver · Style 04 — Checklist",
     "Actionable checkboxes — feels like hiring a hand.",
     """
.check{list-style:none;margin:1rem 0;padding:0}
.check li{padding:.55rem 0 .55rem 1.75rem;position:relative;font-size:.88rem;color:#b8b2ac;border-bottom:1px solid rgba(255,255,255,.05)}
.check li::before{content:"✓";position:absolute;left:0;color:#4ade80;font-weight:700}
""",
     """<p style="font-size:.9rem;color:#9a9590">Bring me the headache. I bring the fix.</p>
<ul class="check">
<li>Inventory or scheduling pain</li>
<li>Customer follow-up gaps</li>
<li>Print / web / sign coordination</li>
<li>Weird one-off that needs a brain</li>
</ul>
<a class="btn" href="#">Ping Kelly_NWB</a>"""),

    ("style-05-retainer", "Problem Solver · Style 05 — On Call",
     "Single sticky 'on call' card — relationship sell.",
     """
.oncall{padding:1.35rem;border-radius:14px;border:1px solid rgba(110,231,160,.35);background:linear-gradient(160deg,rgba(34,197,94,.12),rgba(12,12,18,.9))}
.oncall h2{margin:0 0 .5rem;font-family:"Cormorant Garamond",serif;font-size:1.5rem;color:#f5f0e8}
.price{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6ee7a0;margin-bottom:.75rem}
""",
     """<div class="oncall"><p class="price">Problem Solver</p><h2>On-Call Fixes</h2>
<p style="margin:0;font-size:.88rem;color:#9a9590">Something broken? Something brewing? Good — that's usually where we start. Tell me what's wrong. We'll figure out the smallest fix that actually works.</p></div>
<a class="btn" href="#">Solve For X</a>"""),
]


def write_group(folder: str, items: list) -> None:
    d = ROOT / folder
    d.mkdir(parents=True, exist_ok=True)
    for slug, title, note, css, html in items:
        (d / f"{slug}.html").write_text(shell(title, folder, html, css, note), encoding="utf-8")
        print(f"  {folder}/{slug}.html")


def main():
    for folder, items in [("america-250", AMERICA), ("kaveman", KAVEMAN), ("problem-solver", SOLVER)]:
        write_group(folder, items)
    print("Sandbox HTML generated. Hub: sandbox/index.html")


if __name__ == "__main__":
    main()