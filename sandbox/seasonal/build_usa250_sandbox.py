"""Mirror live NWB pages into sandbox/seasonal/usa250 with theme hooks. Bio text untouched."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

SITE = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "usa250"
THEME_ASSETS = OUT / "theme" / "assets"

PAGES = [
    "index.html",
    "2nd-pages/bio/index.html",
    "2nd-pages/how-to-start/index.html",
    "2nd-pages/tell-my-story/index.html",
    "2nd-pages/solve-for-x/index.html",
    "2nd-pages/lets-talk/index.html",
    "2nd-pages/america-250/index.html",
    "2nd-pages/america-250/gallery/index.html",
]

PAGE_IDS = {
    "index.html": "home",
    "2nd-pages/bio/index.html": "bio",
    "2nd-pages/how-to-start/index.html": "how-to-start",
    "2nd-pages/tell-my-story/index.html": "tell-my-story",
    "2nd-pages/solve-for-x/index.html": "solve-for-x",
    "2nd-pages/lets-talk/index.html": "lets-talk",
    "2nd-pages/america-250/index.html": "america-250",
    "2nd-pages/america-250/gallery/index.html": "gallery",
}

ASSET_RE = re.compile(r'((?:href|src)=")\.\./(?:\.\./)*(assets/)')
INLINE_ASSET_RE = re.compile(r'url\("assets/')


def asset_prefix(dest_rel: str) -> str:
    page_depth = len(Path(dest_rel).parent.parts)
    total = 3 + page_depth
    return "../" * total + "assets/"


def theme_prefix(dest_rel: str) -> str:
    page_depth = len(Path(dest_rel).parent.parts)
    if page_depth == 0:
        return "theme/"
    return "../" * page_depth + "theme/"


def copy_theme_assets() -> None:
    THEME_ASSETS.mkdir(parents=True, exist_ok=True)
    copies = [
        (SITE / "assets" / "usa250-kaveman-button.png", "usa250-button.png"),
        (SITE / "assets" / "usa250-kaveman-badge.png", "usa250-badge.png"),
        (SITE / "assets" / "gallery" / "250" / "superc-banner.jpg", "kuna-superc.jpg"),
        (SITE / "assets" / "gallery" / "250" / "nwb-window-display.png", "nwb-poster.png"),
        (SITE / "assets" / "nwb-logo.png", "nwb-logo.png"),
    ]
    for src, name in copies:
        if src.exists():
            shutil.copy2(src, THEME_ASSETS / name)
            print("theme asset", name)


def rewrite_assets(html: str, dest_rel: str) -> str:
    prefix = asset_prefix(dest_rel)

    def repl(m: re.Match[str]) -> str:
        return m.group(1) + prefix

    html = ASSET_RE.sub(repl, html)
    if dest_rel == "index.html":
        html = INLINE_ASSET_RE.sub(f'url("{prefix}', html)
        html = html.replace('src="assets/', f'src="{prefix}')
    return html


def inject_usa250_skin(html: str, dest_rel: str) -> str:
    if "usa250-skin-badge" in html:
        return html

    ap = asset_prefix(dest_rel)
    badge = (
        f'    <img class="usa250-skin-badge" src="{ap}usa250-kaveman-button.png" '
        f'alt="" width="140" height="140" aria-hidden="true">\n'
    )
    html = re.sub(
        r'(<img class="landing-logo"[^>]*>)',
        r"\1\n" + badge.rstrip(),
        html,
        count=1,
    )

    if dest_rel == "index.html" and "usa250-skin-hero" not in html:
        hero_badge = (
            '        <img class="usa250-skin-hero" src="theme/assets/usa250-button.png" '
            'alt="" width="120" height="120" aria-hidden="true">\n'
        )
        html = html.replace(
            '      <p class="hero-tagline">',
            hero_badge + '      <p class="hero-tagline">',
            1,
        )
    return html


def inject_theme(html: str, dest_rel: str) -> str:
    tp = theme_prefix(dest_rel)
    depth = len(Path(dest_rel).parent.parts)
    page_id = PAGE_IDS.get(dest_rel, "page")
    inject_head = (
        f'  <link rel="stylesheet" href="{tp}sandbox-chrome.css">\n'
        f'  <link rel="stylesheet" href="{tp}usa250-theme.css">\n'
    )
    if "</head>" in html:
        html = html.replace("</head>", inject_head + "</head>", 1)

    inject_body = f'  <script src="{tp}theme-toggle.js" defer></script>\n'
    if "</body>" in html:
        html = html.replace("</body>", inject_body + "</body>", 1)

    if re.search(r"<html\b", html):
        html = re.sub(
            r"<html(\s[^>]*)?>",
            f'<html lang="en" data-sandbox-depth="{depth}" data-page="{page_id}">',
            html,
            count=1,
        )
    return html


def patch_gallery_free_tag(html: str) -> str:
    return html.replace(
        "Community tier · July 4 free",
        "Free · Community Tier · July 4 / 250",
    )


def patch_sandbox_nav(html: str, dest_rel: str) -> str:
    page_depth = len(Path(dest_rel).parent.parts)
    if page_depth == 0:
        return html
    home = "../" * page_depth + "index.html"
    return html.replace('href="../../index.html"', f'href="{home}"')


def build() -> None:
    copy_theme_assets()
    for rel in PAGES:
        src = SITE / rel
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        html = src.read_text(encoding="utf-8")
        html = rewrite_assets(html, rel)
        html = patch_sandbox_nav(html, rel)
        html = inject_usa250_skin(html, rel)
        html = inject_theme(html, rel)
        if "gallery/index.html" in rel:
            html = patch_gallery_free_tag(html)
        dest.write_text(html, encoding="utf-8")
        print("wrote", dest.relative_to(SITE))


if __name__ == "__main__":
    build()
    print("Done — open sandbox/seasonal/usa250/index.html")