import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initMethod } from "./method";
import { initForms } from "./forms";

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const motion = () => !reduced.matches;

/* ---------------- Header: solid after the hero, hides while scrolling down ---------------- */
function initHeader() {
  const hdr = $("[data-header]");
  if (!hdr) return;
  let last = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 40);
    const down = y > last && y > window.innerHeight * 0.6;
    const menuOpen = !!$("[data-menu][open]");
    hdr.classList.toggle("is-hidden", down && !menuOpen);
    last = y;
  };
  window.addEventListener("scroll", update, { passive: true });
  update();

  // Current-section marker in the nav.
  const links = $$<HTMLAnchorElement>(".hdr__nav a");
  const targets = links.map((a) => $(a.hash)).filter(Boolean) as HTMLElement[];
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.setAttribute("aria-current", String(a.hash === `#${e.target.id}`)));
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------------- Mobile menu (native dialog) ---------------- */
function initMenu() {
  const dlg = $<HTMLDialogElement>("[data-menu]");
  const open = $("[data-menu-open]");
  if (!dlg || !open) return;
  open.addEventListener("click", () => {
    dlg.showModal();
    open.setAttribute("aria-expanded", "true");
  });
  $("[data-menu-close]", dlg)?.addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", () => open.setAttribute("aria-expanded", "false"));
  $$<HTMLAnchorElement>("[data-menu-link]", dlg).forEach((a) =>
    a.addEventListener("click", () => dlg.close()),
  );
}

/* ---------------- Hero video: loaded only when it will be seen ---------------- */
function initHeroVideo() {
  const v = $<HTMLVideoElement>("[data-hero-video]");
  const btn = $<HTMLButtonElement>("[data-hero-pause]");
  if (!v || !btn) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (!motion() || conn?.saveData) return; // poster only

  const tall = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
  v.src = (tall ? v.dataset.tall : v.dataset.wide) ?? "";
  v.preload = "auto";
  v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
  v.addEventListener("error", () => v.remove());
  const label = $("[data-hero-pause-label]", btn);
  let userPaused = false;
  const setBtn = () => {
    btn.setAttribute("aria-pressed", String(userPaused));
    if (label) label.textContent = userPaused ? "Play background video" : "Pause background video";
  };
  btn.hidden = false;
  btn.addEventListener("click", () => {
    userPaused = !userPaused;
    if (userPaused) v.pause();
    else v.play().catch(() => {});
    setBtn();
  });
  // Play only while on screen and visible (saves battery); retry when ready.
  let onScreen = true;
  const sync = () => {
    if (onScreen && !userPaused && !document.hidden) v.play().catch(() => {});
    else v.pause();
  };
  v.autoplay = true;
  v.addEventListener("canplay", sync, { once: true });
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    sync();
  }).observe(v);
  reduced.addEventListener("change", () => {
    if (reduced.matches) { v.pause(); userPaused = true; setBtn(); }
  });
}

/* ---------------- Opening + scroll motion ---------------- */
function initMotion() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // Hero: lines rise, then supporting copy, then the ledger draws across.
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo("[data-hero-line]", { yPercent: 105, y: 0 }, { yPercent: 0, duration: 1.15, stagger: 0.1 }, 0.1)
      .to(".hero [data-hero-in]", { opacity: 1, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.45)
      .to("[data-hero-ledger]", { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.55);

    // Hero media drifts slower than the page as it leaves.
    gsap.to(".hero__media", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // Statement: words darken as they pass the middle of the screen.
    const words = $$("[data-words] span");
    if (words.length) {
      ScrollTrigger.create({
        trigger: "[data-words]",
        start: "top 80%",
        end: "bottom 45%",
        onUpdate: (st) => {
          const n = Math.round(st.progress * words.length);
          words.forEach((w, i) => w.classList.toggle("is-on", i < n));
        },
      });
    }

    // Board-slat reveals: five boards slide away in sequence.
    $$("[data-slats]").forEach((fig) => {
      const slats = $$("i", fig);
      const img = $("img", fig);
      gsap.set(slats, { scaleX: 1 });
      const t = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 82%", toggleActions: "play none none none" } });
      t.to(slats, { scaleX: 0, duration: 0.9, ease: "power3.inOut", stagger: { each: 0.08, from: "end" }, transformOrigin: "100% 50%" });
      if (img) t.from(img, { scale: 1.12, duration: 1.6, ease: "expo.out" }, 0.1);
    });

    // Gentle parallax inside project frames.
    $$("[data-parallax]").forEach((img) => {
      gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Night interlude.
    gsap.fromTo("[data-night-img]", { yPercent: -7 }, {
      yPercent: 7,
      ease: "none",
      scrollTrigger: { trigger: ".night", start: "top bottom", end: "bottom top", scrub: true },
    });

    // Coverage rings expand once.
    gsap.from(".ring circle", {
      scale: 0.2,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.15,
      scrollTrigger: { trigger: ".cov__map", start: "top 75%", toggleActions: "play none none none" },
    });

    // Footer: the transom slides across the wordmark.
    gsap.to("[data-footer-bar]", {
      scaleX: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-footer-word]", start: "top bottom", end: "top 55%", scrub: 0.6 },
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set("[data-slats] i", { scaleX: 0 });
    gsap.set("[data-footer-bar]", { scaleX: 1 });
  });
}

/* ---------------- Services: preview follows the row in view / hovered ---------------- */
function initServices() {
  const rows = $$<HTMLDetailsElement>("[data-svc]");
  const imgs = $$<HTMLImageElement>("[data-svc-img]");
  const readout = $("[data-svc-readout]");
  if (!rows.length) return;
  let current = rows[0].dataset.svc;
  const show = (slug?: string) => {
    if (!slug || slug === current) return;
    imgs.forEach((im) => {
      im.classList.remove("was-on");
      if (im.dataset.svcImg === current) im.classList.add("was-on");
      im.classList.toggle("is-on", im.dataset.svcImg === slug);
    });
    current = slug;
    const i = rows.findIndex((r) => r.dataset.svc === slug);
    rows.forEach((r, j) => r.classList.toggle("is-active", j === i));
    if (readout) readout.textContent = `${String(i + 1).padStart(2, "0")} / ${String(rows.length).padStart(2, "0")}`;
  };
  rows[0].classList.add("is-active");
  // The preview images sit clipped until hovered, so lazy loading never
  // fetches them. Load them as the section approaches (desktop only: the
  // preview is hidden on phones).
  const preview = $("[data-svc-preview]");
  if (preview && getComputedStyle(preview).display !== "none") {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      imgs.forEach((im) => (im.loading = "eager"));
      io.disconnect();
    }, { rootMargin: "800px 0px" });
    io.observe(preview);
  }
  rows.forEach((r) => {
    const sum = $("summary", r)!;
    sum.addEventListener("pointerenter", () => show(r.dataset.svc));
    sum.addEventListener("focus", () => show(r.dataset.svc));
    r.addEventListener("toggle", () => r.open && show(r.dataset.svc));
  });
}

/* ---------------- Coverage: list ↔ map, postcode check ---------------- */
function initCoverage() {
  const dots = new Map($$<SVGGElement>("[data-town-dot]").map((g) => [g.dataset.townDot, g]));
  $$<HTMLButtonElement>("[data-town]").forEach((b) => {
    const on = (v: boolean) => {
      b.classList.toggle("is-on", v);
      dots.get(b.dataset.town)?.classList.toggle("is-on", v);
    };
    b.addEventListener("pointerenter", () => on(true));
    b.addEventListener("pointerleave", () => on(false));
    b.addEventListener("focus", () => on(true));
    b.addEventListener("blur", () => on(false));
    b.addEventListener("click", () => on(!b.classList.contains("is-on")));
  });
}

/* ---------------- Contact actions open the demo explanation ---------------- */
function initContactDialog() {
  const dlg = $<HTMLDialogElement>("[data-contact-dialog]");
  if (!dlg) return;
  const titles: Record<string, [string, string]> = {
    phone: ["Phone", "This would call the yard"],
    whatsapp: ["WhatsApp", "This would open WhatsApp"],
    email: ["Email", "This would start an email"],
  };
  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("[data-contact]");
    if (!a) return;
    e.preventDefault();
    const kind = a.dataset.contact ?? "phone";
    $("[data-cd-kind]", dlg)!.textContent = titles[kind][0];
    $("[data-cd-title]", dlg)!.textContent = titles[kind][1];
    $$<HTMLElement>("[data-cd-panel]", dlg).forEach((p) => (p.hidden = p.dataset.cdPanel !== kind));
    $<HTMLDialogElement>("[data-menu][open]")?.close();
    dlg.showModal();
  });
  // Click on the backdrop closes it.
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

(window as Window & { __motionReady?: boolean }).__motionReady = true;
initHeader();
initMenu();
initHeroVideo();
initMotion();
initServices();
initMethod(reduced);
initCoverage();
initContactDialog();
initForms();

// Fonts and lazy images change layout; keep triggers accurate.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener("load", () => ScrollTrigger.refresh());
