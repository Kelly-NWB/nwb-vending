"""Build high-res gallery assets from source masters (run after printables change)."""
from __future__ import annotations

import fitz
import shutil
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent / "250"
PRINTABLES = Path(r"D:\GrokBuild\Launch Printables")
PARADE = Path(r"D:\GrokBuild\experiments\250 Parade\250 Idea - Pitch")
SUPERC = Path(r"D:\GrokBuild\experiments\pitches\superc")

DISPLAY_W = 1400
LIGHTBOX_W = 2200


def save_png(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    img.save(path, "PNG", optimize=True)


def resize_width(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img
    h = int(img.height * width / img.width)
    return img.resize((width, h), Image.Resampling.LANCZOS)


def from_png(src: Path, stem: str) -> None:
    img = Image.open(src)
    save_png(resize_width(img, DISPLAY_W), OUT / f"{stem}-display.png")
    save_png(resize_width(img, LIGHTBOX_W), OUT / f"{stem}-full.png")
    print(stem, img.size)


def from_pdf_page(src: Path, page: int, stem: str) -> None:
    doc = fitz.open(src)
    pix = doc[page].get_pixmap(matrix=fitz.Matrix(DISPLAY_W / doc[page].rect.width, DISPLAY_W / doc[page].rect.width))
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    save_png(img, OUT / f"{stem}-display.png")
    pix_full = doc[page].get_pixmap(matrix=fitz.Matrix(LIGHTBOX_W / doc[page].rect.width, LIGHTBOX_W / doc[page].rect.width))
    img_full = Image.frombytes("RGB", (pix_full.width, pix_full.height), pix_full.samples)
    save_png(img_full, OUT / f"{stem}-full.png")
    doc.close()
    print(stem, img.size)


def main() -> None:
    if OUT.exists():
        for f in OUT.glob("*"):
            if f.is_file():
                f.unlink()

    from_png(PARADE / "SuperCfront.png", "superc-window")
    from_pdf_page(SUPERC / "assets" / "print-both.pdf", 0, "superc-appreciation")
    from_pdf_page(SUPERC / "assets" / "print-both.pdf", 1, "superc-photo")

    from_pdf_page(PRINTABLES / "NWB-Both-Final.pdf", 0, "nwb-window")
    from_pdf_page(PRINTABLES / "NWB-Both-Final.pdf", 1, "nwb-story")

    import sys

    sys.path.insert(0, str(Path(r"D:\GrokBuild\experiments\250 Parade\06-process\delivery")))
    from fulfill_free_customer import stamp_front

    free_img = stamp_front("Your Business")
    save_png(resize_width(free_img, DISPLAY_W), OUT / "free-window-display.png")
    save_png(resize_width(free_img, LIGHTBOX_W), OUT / "free-window-full.png")
    print("free-window", free_img.size)

    pairs = [
        (PRINTABLES / "Kettle Korn - window.pdf", "kettle-korn-window"),
        (PRINTABLES / "Kettle Korn - story.pdf", "kettle-korn-story"),
        (PRINTABLES / "IPC - window.pdf", "ipc-window"),
        (PRINTABLES / "IPC - story.pdf", "ipc-story"),
    ]
    for pdf, stem in pairs:
        from_pdf_page(pdf, 0, stem)

    shutil.copy2(SUPERC / "assets" / "banner2.jpg", OUT / "superc-banner.jpg")
    print("superc-banner")
    video_src = SUPERC / "upload" / "assets" / "store-video.mp4"
    if video_src.exists():
        shutil.copy2(video_src, OUT / "superc-store.mp4")
        print("superc-store")


if __name__ == "__main__":
    main()