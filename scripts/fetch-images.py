"""Download the licensed Unsplash photographs and bake the site's grade into them.

Run from the project root:  python3 scripts/fetch-images.py

Each photo is fetched with curl (avoids Python certificate issues on macOS),
graded once with Pillow, and written to public/images/<name>-<width>.webp.
Sources and licences are listed in IMAGE-CREDITS.md.
"""
import io
import pathlib
import subprocess
import sys

from PIL import Image, ImageEnhance, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
RAW = ROOT / "scripts" / ".raw"  # ignored by git

# name: (unsplash photo id, image path id, saturation, widths)
PHOTOS = {
    "extension":   ("jEP4vsHrSM8", "1593786267440-550458cc882a", 0.30, (640, 1024, 1600)),
    "long-elevation": ("6NrnN_L8Pvg", "1653837105223-63912447c7a0", 0.25, (640, 1024, 1600, 2200)),
    "colonnade":   ("WN9QRESOu5c", "1504964670878-71b73cec0ce1", 0.30, (640, 1024, 1600, 2200)),
    "tower":       ("NA1_Qyovxrc", "1758330995685-dd55e18c1063", 0.25, (640, 1024, 1600)),
    "system":      ("y-IbPO2pLS0", "1646608220368-c604d8e8130f", 0.30, (640, 1024, 1600)),
    "sheeted":     ("thAgQthrXU0", "1699021565893-e8aaa1f72aba", 0.25, (640, 1024, 1600)),
    "pavement":    ("qdbb6ujIO8o", "1789051983927-4917694a3e22", 0.30, (640, 1024, 1600)),
    "chimney":     ("_U9tH0rFJQ8", "1787459608069-c2f1f9a9bc0b", 0.25, (640, 1024, 1600)),
    "erecting":    ("I_Y9Kpijoyo", "1758798349125-5c297b18b8b2", 0.25, (640, 1024, 1600)),
    "night-glow":  ("IGI_LJtO3nI", "1762255141967-877c2b657a1b", 0.70, (640, 1024, 1600, 2200)),
}


def fetch(path_id: str) -> Image.Image:
    RAW.mkdir(parents=True, exist_ok=True)
    cached = RAW / f"{path_id}.jpg"
    if not cached.exists():
        url = f"https://images.unsplash.com/photo-{path_id}?w=2400&q=90&fm=jpg"
        subprocess.run(["curl", "-sfL", "-o", str(cached), url], check=True)
    return Image.open(io.BytesIO(cached.read_bytes())).convert("RGB")


def grade(img: Image.Image, saturation: float) -> Image.Image:
    """Galvanised grade: most colour drained, cool steel shadows, gentle contrast."""
    img = ImageEnhance.Color(img).enhance(saturation)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    r, g, b = img.split()
    # Cool the shadows slightly and keep highlights neutral.
    lut_r = [round(v * 0.97 + 2) for v in range(256)]
    lut_b = [min(255, round(v * 0.98 + 7 * (1 - v / 255))) for v in range(256)]
    img = Image.merge("RGB", (r.point(lut_r), g, b.point(lut_b)))
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])
    for name, (_, path_id, sat, widths) in PHOTOS.items():
        if only and name not in only:
            continue
        src = grade(fetch(path_id), sat)
        for w in widths:
            if w > src.width:
                continue
            h = round(src.height * w / src.width)
            src.resize((w, h), Image.LANCZOS).save(OUT / f"{name}-{w}.webp", "WEBP", quality=78, method=6)
        print(f"{name}: {src.width}x{src.height}")


if __name__ == "__main__":
    main()
