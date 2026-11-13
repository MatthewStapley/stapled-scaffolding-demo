# Transom Scaffolding: a Stapled. website concept

A concept website for UK scaffolding firms, built by
[Stapled.](https://stapled.co.uk) to show prospective clients. **Transom
Scaffolding is a fictional business.** The site says so in the bar on every
page, in the footer and on `/concept/`. All pages are `noindex`.

The enquiry form validates but sends and stores nothing. The phone numbers come
from Ofcom's drama ranges (0117 496 0xxx and 07700 900xxx), and the email uses
the reserved `.example` domain. Phone, WhatsApp and email actions open an
explanation instead of dialling or messaging.

## Run it

Requires Node 22.12 or newer. Astro is pinned to `~7.3.8` (7.4 raises the Node
minimum).

```sh
npm install
npm run dev       # http://localhost:4321/
npm run build     # static output in dist/
npm run preview   # serves the build
npm run check     # Astro and TypeScript checks
```

## Publishing

Live at <https://matthewstapley.github.io/stapled-scaffolding-demo/> from
[MatthewStapley/stapled-scaffolding-demo](https://github.com/MatthewStapley/stapled-scaffolding-demo)
(public, GitHub Pages with GitHub Actions as the source).

`.github/workflows/deploy.yml` builds and deploys, but **only when run by
hand**. Pushing does not deploy. To publish changes, push `main`, then open
**Actions → Deploy to GitHub Pages → Run workflow** (or run
`gh workflow run deploy.yml`).

The workflow builds with `SITE_BASE=/<repo-name>`. Internal links and public
files go through `asset()` in `src/data/site.ts`, so they follow the base. To
check a sub-path build locally:

```sh
SITE_BASE=/stapled-scaffolding-demo npm run build
```

## How it's built

Astro (static) with GSAP ScrollTrigger. There's no backend, no smooth-scroll
library and no scroll hijacking.

- **Hero** (`src/components/Hero.astro`). A graded, muted, `playsinline` video
  loop, with separate landscape and portrait encodes (1.6 MB and 0.9 MB) and a
  poster image for each. The video loads only when motion is allowed and Save-Data
  is off, pauses off-screen, and has a pause control. The first screen is
  designed to look finished on the poster alone.
- **Lift by lift** (`src/components/Method.astro`, `src/scripts/method.ts`). A
  scale elevation of a townhouse is surveyed, planned, scaffolded lift by lift,
  inspected, given a temporary roof and struck as the six stages are read. Every
  SVG element carries the slice of progress over which it draws in or out.
  Progress is measured from the live position of each step against a reading
  line, so it never drifts when images load. On phones the drawing is pinned
  over the top half of the screen and the text reads beneath it.
- **Board-slat reveals.** Project and client images arrive as five boards
  sliding away in sequence.
- **Services index** (`src/components/Services.astro`). Native `<details>` rows.
  On desktop a pinned preview wipes to each service. Phones show the image inside
  the open row. "Ask about…" links pre-select the job type in the form.
- **Coverage** (`src/components/Coverage.astro`). An SVG map projected from real
  town coordinates, with 10, 20 and 30-mile rings from the yard and a postcode
  checker (`src/scripts/forms.ts`).
- **Enquiry** (`src/components/Quote.astro`). Accessible inline validation
  (`aria-invalid` and messages tied to their fields, focus moves to the first
  problem), a direct-contact panel and a success state that says nothing was sent.
- **Reduced motion.** No video (poster only), no opening animation, no slats or
  parallax, and the drawing jumps to each stage's finished state. CSS transitions
  are cut to near zero.
- If the motion script fails to start, a 4-second fallback removes the
  hidden-until-animated states, so content is never stuck invisible.

## Adapting it for a real client

1. `src/data/site.ts`: name, area, yard, hours and contact details.
2. `src/data/content.ts`: services, process wording, projects, towns and postcode areas.
3. `src/data/images.ts` and `scripts/fetch-images.py`: the client's own photographs.
4. `scripts/make-video.sh`: the client's own footage.
5. `src/scripts/forms.ts`: connect the submit handler to a form service (for example Formspree or Netlify Forms).
6. Remove `DemoBar`, `ContactDialog`, the click interception in `initContactDialog()`, the concept page and the `noindex` tag.
7. Add genuine reviews, accreditations (with links to verify them) and insurance details only if they're real.

## Regenerating media

Needs Python 3 with Pillow, ffmpeg and curl. Raw downloads go to `scripts/.raw/`
(ignored by git).

```sh
python3 scripts/fetch-images.py
sh scripts/make-video.sh
```

Sources and licences are in [IMAGE-CREDITS.md](IMAGE-CREDITS.md).
