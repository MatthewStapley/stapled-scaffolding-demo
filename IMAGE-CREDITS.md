# Image and video credits

All third-party media was checked on 2026-11-13. Each Unsplash page showed
"Free Photo on Unsplash" (not Unsplash+), and the Pexels video page listed the
licence as Free. None of it is presented as work by Transom or any real firm:
on the site every photograph is tagged "Illustrative image" or "Illustrative
project", and `/concept/` credits each one.

## Video

| File | Source | Creator | Licence |
| --- | --- | --- | --- |
| `public/video/facade-wide.mp4`, `facade-tall.mp4`, posters `facade-*.webp` | [Pexels video 3584628](https://www.pexels.com/video/scaffolding-erected-on-a-building-under-construction-3584628/) | Kapaw | [Pexels License](https://www.pexels.com/license/) |

Trimmed, cross-faded into a seamless 12-second loop, colour-graded, cropped to
a portrait version for phones and re-encoded without audio by
`scripts/make-video.sh`. Attribution isn't required, but it's given on `/concept/`.

## Photographs

From Unsplash under the [Unsplash License](https://unsplash.com/license), which
allows commercial use without permission. It doesn't allow selling the photos
unaltered or implying endorsement. Colour-graded and resized by
`scripts/fetch-images.py` into `public/images/<name>-<width>.webp`.

| File | Used for | Photographer | Source |
| --- | --- | --- | --- |
| `extension-*` | Homeowners block, houses service | Brett Jordan | https://unsplash.com/photos/jEP4vsHrSM8 |
| `erecting-*` | Contractors block | Khanh Do | https://unsplash.com/photos/I_Y9Kpijoyo |
| `long-elevation-*` | Residential block project | Karen Barrett | https://unsplash.com/photos/6NrnN_L8Pvg |
| `colonnade-*` | Listed façade project | Reto Simonet | https://unsplash.com/photos/WN9QRESOu5c |
| `tower-*` | Church tower project, heritage service | Jon McCallon | https://unsplash.com/photos/NA1_Qyovxrc |
| `system-*` | Commercial service | Etienne Girardet | https://unsplash.com/photos/y-IbPO2pLS0 |
| `sheeted-*` | Temporary roofs service | Julian Tong | https://unsplash.com/photos/thAgQthrXU0 |
| `pavement-*` | Public highway service | Pau Ros | https://unsplash.com/photos/qdbb6ujIO8o |
| `chimney-*` | Chimney project and service | C | https://unsplash.com/photos/_U9tH0rFJQ8 |
| `night-glow-*` | Town-centre interlude | Konstantin Kitsenuik | https://unsplash.com/photos/IGI_LJtO3nI |

## Made for this concept

No third-party licence applies to these:

- The "lift by lift" elevation drawing (`src/components/Method.astro`).
- The coverage map (`src/components/Coverage.astro`), plotted from approximate
  public coordinates of towns, with a simplified coastline and motorways.
- The Transom mark, favicon and line icons.

## Fonts

Big Shoulders, Schibsted Grotesk and JetBrains Mono, self-hosted through
Fontsource, under the SIL Open Font License 1.1.

## Before using this for a real client

- Replace every photograph and the video with the client's own site footage.
- `colonnade-*`, `system-*` and `erecting-*` show continental system
  scaffolds, and `extension-*` shows a UK tube-and-fitting job. That's fine for
  illustration, but not as anyone's own work.
- Some photos show identifiable buildings and people. They're used here as
  illustration only.
