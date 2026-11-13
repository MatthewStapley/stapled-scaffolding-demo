
/**
 * Drives the "lift by lift" elevation. Each element has data-a="s,e" (appears
 * over that slice of progress) and optionally data-z="s,e" (removed again).
 * data-k="d" draws a stroke along its length; "f" fades it.
 * With reduced motion the drawing jumps to each stage's finished state.
 */
type Item = { el: SVGGraphicsElement; k: string; a: [number, number]; z?: [number, number] };

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (p: number, [s, e]: [number, number]) => clamp((p - s) / (e - s));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const NAMES = ["Survey", "Plan", "Erect", "Hand over", "Adapt", "Strike"];

export function initMethod(reduced: MediaQueryList) {
  const root = document.querySelector<HTMLElement>("[data-method]");
  const svg = root?.querySelector<SVGSVGElement>("[data-m-svg]");
  if (!root || !svg) return;

  const pair = (v?: string) => (v ? (v.split(",").map(Number) as [number, number]) : undefined);
  const items: Item[] = [...svg.querySelectorAll<SVGGraphicsElement>("[data-a]")].map((el) => ({
    el,
    k: el.dataset.k ?? "d",
    a: pair(el.dataset.a)!,
    z: pair(el.dataset.z),
  }));
  for (const it of items) if (it.k === "d") it.el.style.strokeDasharray = "1 1";

  const sweep = svg.querySelector<SVGGraphicsElement>(".sweep");
  const glow = svg.querySelector<SVGGraphicsElement>("[data-m-sweep-glow]");
  const tag = svg.querySelector<SVGGElement>(".tag-text");
  const dims = svg.querySelector<SVGGElement>(".dim-text");
  const stageEl = root.querySelector("[data-m-stage]");
  const nameEl = root.querySelector("[data-m-name]");
  const liftsEl = root.querySelector("[data-m-lifts]");
  const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];

  let lastStage = -1;
  const render = (p: number) => {
    for (const it of items) {
      let v = ease(span(p, it.a));
      if (it.z) v *= 1 - ease(span(p, it.z));
      if (it.k === "d") {
        it.el.style.strokeDashoffset = String(1 - v);
        it.el.style.opacity = v > 0.001 ? "1" : "0";
      } else {
        it.el.style.opacity = String(v);
      }
    }
    // Inspection sweep travels down the scaffold.
    const sw = span(p, [0.52, 0.615]);
    const y = 250 + sw * 360;
    sweep?.setAttribute("transform", `translate(0 ${y})`);
    glow?.setAttribute("transform", `translate(0 ${y})`);
    if (glow) glow.style.opacity = String(sw > 0 && sw < 1 ? 1 : 0);
    if (tag) tag.style.opacity = String(span(p, [0.615, 0.63]) * (1 - span(p, [0.845, 0.855])));
    if (dims) dims.style.opacity = String(span(p, [0.1, 0.15]) * (1 - span(p, [0.335, 0.35])));

    const stage = Math.min(5, Math.floor(p * 6));
    if (stage !== lastStage) {
      lastStage = stage;
      if (stageEl) stageEl.textContent = `0${stage + 1}`;
      if (nameEl) nameEl.textContent = NAMES[stage];
      steps.forEach((s, i) => s.classList.toggle("is-active", i === stage));
    }
    const built = Math.round(clamp((p - 0.343) / (0.497 - 0.343)) * 5);
    const struck = Math.round(clamp((p - 0.875) / (0.965 - 0.875)) * 5);
    if (liftsEl) liftsEl.textContent = String(Math.max(0, built - struck));
  };

  // Smoothly follow the scroll position (no scroll hijacking, just eased drawing).
  let target = 0;
  let shown = 0;
  let raf = 0;
  const tick = () => {
    shown += (target - shown) * 0.16;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    render(shown);
    raf = shown === target ? 0 : requestAnimationFrame(tick);
  };
  const go = (p: number, instant = false) => {
    target = p;
    if (instant) { shown = p; render(p); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const mobile = window.matchMedia("(max-width: 900px)");
  let cleanup: (() => void) | undefined;
  let io: IntersectionObserver | undefined;

  const setup = () => {
    cleanup?.();
    cleanup = undefined;
    io?.disconnect();
    if (reduced.matches) {
      // Jump to the finished state of whichever stage is being read.
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const i = steps.indexOf(e.target as HTMLElement);
            go(i === 5 ? 1 : (i + 1) / 6 - 0.004, true);
          }
        },
        { rootMargin: mobile.matches ? "-60% 0px -20% 0px" : "-45% 0px -45% 0px" },
      );
      steps.forEach((s) => io!.observe(s));
      go(0.16, true);
    } else {
      // Progress comes from live positions: which step crosses the reading
      // line, and how far through it. Immune to layout shifts from images/fonts.
      // Desktop: a step runs while it crosses the middle of the screen.
      // Phone: the drawing is pinned over the top half, so a step runs from
      // entering at the bottom until its heading slides under the drawing.
      const panel = root.querySelector<HTMLElement>(".method__drawing")!;
      const stage = root.querySelector<HTMLElement>(".method__stage")!;
      const measure = () => {
        const vh = window.innerHeight;
        let start: number, end: number;
        if (mobile.matches) {
          end = stage.getBoundingClientRect().bottom + 12;
          start = vh * 0.94;
        } else {
          start = vh * 0.5;
          end = 0; // replaced per step by its height
        }
        let p = 0;
        for (let i = 0; i < steps.length; i++) {
          const r = steps[i].getBoundingClientRect();
          if (r.top > start) break;
          const span = mobile.matches ? Math.max(1, start - end) : r.height;
          p = (i + clamp((start - r.top) / span)) / steps.length;
        }
        // Lead-in: the house draws itself as the drawing scrolls into view,
        // so it's never an empty frame on arrival.
        const lead = clamp((vh - panel.getBoundingClientRect().top) / (vh * 0.45));
        return Math.max(p, lead * 0.1);
      };
      const onScroll = () => go(measure());
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
      go(measure(), true);
    }
  };
  setup();
  reduced.addEventListener("change", setup);
  mobile.addEventListener("change", setup);
}
