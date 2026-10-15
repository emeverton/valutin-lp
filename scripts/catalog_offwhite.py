"""Replace only neutral white backgrounds connected to photo borders.

Run with Pillow and NumPy. Originals are never modified. Outputs are lossless
WebP so pixels outside the background mask remain exactly unchanged.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TARGET = np.array([247, 244, 238], dtype=np.int16)
OUT = ROOT / "public/catalog-offwhite"
REVIEW = ROOT.parent / "output/catalog-offwhite"


def background_mask(rgb):
    lo = rgb.min(axis=2)
    hi = rgb.max(axis=2)
    candidate = (lo >= 235) & ((hi.astype(int) - lo) <= 17)
    padded = np.pad(candidate.astype(np.uint8) * 255, 1, constant_values=255)
    flood = Image.fromarray(padded).copy()
    ImageDraw.floodfill(flood, (0, 0), 128, thresh=0)
    return np.asarray(flood)[1:-1, 1:-1] == 128


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)
    products = json.loads((ROOT / "app/lib/catalog.json").read_text(encoding="utf-8"))
    paths = list(dict.fromkeys(src for product in products for src in product["displayImages"]))
    mapping, report, thumbnails = {}, [], []
    for src in paths:
        photo = Image.open(ROOT / "public" / src.lstrip("/")).convert("RGB")
        rgb = np.asarray(photo)
        sample = photo.copy()
        sample.thumbnail((120, 120))
        a = np.asarray(sample)
        border = np.zeros(a.shape[:2], dtype=bool)
        border[:3] = border[-3:] = True
        border[:, :3] = border[:, -3:] = True
        median = np.median(a[border], axis=0)
        # Already cream/off-white, colored backdrops and close-up views are kept.
        if median.min() < 240 or median.max() - median.min() > 8:
            continue
        mask = background_mask(rgb)
        if mask.mean() < 0.08:
            continue
        # Fade the change into faint shadows. No global filter touches clothes.
        intensity = np.clip((rgb.min(axis=2).astype(float) - 235) / 18, 0, 1)
        weight = (intensity * intensity * (3 - 2 * intensity)) * mask
        delta = (255 - TARGET)[None, None, :] * weight[:, :, None]
        edited = np.clip(np.rint(rgb.astype(float) - delta), 0, 255).astype(np.uint8)
        assert np.array_equal(edited[~mask], rgb[~mask])
        relative = Path(src.lstrip("/"))
        name = relative.parent.name + "--" + relative.stem + ".webp"
        dest = OUT / name
        Image.fromarray(edited).save(dest, "WEBP", lossless=True, method=6, exact=True)
        reopened = np.asarray(Image.open(dest).convert("RGB"))
        assert np.array_equal(edited, reopened), "Lossless verification failed"
        mapping[src] = "/catalog-offwhite/" + name
        report.append({"source": src, "output": mapping[src], "size": list(photo.size),
                       "background_fraction": round(float(mask.mean()), 4),
                       "unchanged_outside_background": True, "bytes": dest.stat().st_size})
        thumb = Image.fromarray(edited)
        thumb.thumbnail((170, 220))
        tile = Image.new("RGB", (200, 260), "white")
        tile.paste(thumb, ((200 - thumb.width) // 2, 0))
        draw = ImageDraw.Draw(tile)
        draw.text((5, 225), str(len(report)) + ": " + relative.stem[:23], fill="black")
        thumbnails.append(tile)
    (ROOT / "app/lib/catalog-offwhite.json").write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (REVIEW / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    for start in range(0, len(thumbnails), 24):
        tiles = thumbnails[start:start + 24]
        sheet = Image.new("RGB", (1200, ((len(tiles) + 5) // 6) * 260), "#eeeeee")
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % 6) * 200, (index // 6) * 260))
        sheet.save(REVIEW / f"review-{start // 24 + 1}.jpg", quality=90)
    print(json.dumps({"photos": len(report), "bytes": sum(row["bytes"] for row in report), "report": str(REVIEW / "report.json")}))


if __name__ == "__main__":
    main()
