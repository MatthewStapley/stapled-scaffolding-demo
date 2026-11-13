import { coverage } from "../data/content";

/** UK postcode: full (BS8 1AB) or outward code only (BS8). */
const FULL = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
const OUTWARD = /^[A-Z]{1,2}\d[A-Z\d]?$/;

export function outward(raw: string): string | null {
  const v = raw.toUpperCase().replace(/\s+/g, " ").trim();
  const m = v.replace(/\s/g, "").match(FULL);
  if (m) return m[1];
  return OUTWARD.test(v) ? v : null;
}

function initPostcode() {
  const form = document.querySelector<HTMLFormElement>("[data-postcode]");
  const out = document.querySelector<HTMLElement>("[data-postcode-out]");
  if (!form || !out) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.elements.namedItem("postcode") as HTMLInputElement;
    const code = outward(input.value);
    out.className = "pc__out";
    if (!code) {
      out.innerHTML = "<b>Check that postcode.</b> Try the full postcode, for example BS8 1AB.";
      input.setAttribute("aria-invalid", "true");
      return;
    }
    input.removeAttribute("aria-invalid");
    if (coverage.core.some((r) => r.test(code))) {
      out.classList.add("is-in");
      out.innerHTML = `<b>${code} is in our usual area.</b> <a href="#quote" data-prefill="${code}">Start a quote</a>`;
    } else if (coverage.ask.some((r) => r.test(code))) {
      out.innerHTML = `<b>${code} is at the edge of our area.</b> We often cover it, so ask us.`;
    } else {
      out.innerHTML = `<b>${code} is outside our usual area.</b> Call us anyway, and if it's not for us we'll say so.`;
    }
  });
  out.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("[data-prefill]");
    const pc = document.querySelector<HTMLInputElement>("#f-postcode");
    if (a && pc) pc.value = (form.elements.namedItem("postcode") as HTMLInputElement).value.toUpperCase();
  });
}

function initEnquiry() {
  const form = document.querySelector<HTMLFormElement>("[data-enquiry]");
  if (!form) return;
  const done = form.querySelector<HTMLElement>("[data-done]")!;
  const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  const err = (n: string) => form.querySelector<HTMLElement>(`[data-error="${n}"]`)!;
  const jobSet = form.querySelector<HTMLFieldSetElement>("fieldset")!;

  // Pre-select a job type from service links (and ?service= on load).
  const pick = (slug: string | null) => {
    if (!slug) return;
    const r = form.querySelector<HTMLInputElement>(`input[name="job"][value="${CSS.escape(slug)}"]`);
    if (r) { r.checked = true; validate("job"); }
  };
  pick(new URLSearchParams(location.search).get("service"));
  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("[data-service-link]");
    if (!a) return;
    e.preventDefault();
    pick(a.dataset.serviceLink ?? null);
    document.querySelector("#quote")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", "#quote");
    setTimeout(() => field("name").focus({ preventScroll: true }), 700);
  });

  const touched = new Set<string>();
  const set = (name: string, el: Element, msg: string) => {
    err(name).textContent = msg;
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
    return !msg;
  };

  function validate(name: string): boolean {
    switch (name) {
      case "job": {
        const ok = !!form!.querySelector('input[name="job"]:checked');
        return set("job", jobSet, ok ? "" : "Choose the type of job.");
      }
      case "name": {
        const v = field("name").value.trim();
        return set("name", field("name"), v.length >= 2 ? "" : "Tell us your name.");
      }
      case "postcode": {
        const v = field("postcode").value;
        const msg = !v.trim() ? "We need the site postcode to price the job." : outward(v) ? "" : "That doesn't look like a UK postcode.";
        return set("postcode", field("postcode"), msg);
      }
      case "contact": {
        const phone = field("phone").value.trim();
        const email = field("email").value.trim();
        const phoneOk = /^[+\d][\d\s()-]{8,}$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        const none = !phone && !email;
        const badPhone = none || (!!phone && !phoneOk);
        const badEmail = none || (!!email && !emailOk);
        let msg = "";
        if (none) msg = "Add a phone number or an email so we can reply.";
        else if (badPhone) msg = "Check the phone number. It looks too short.";
        else if (badEmail) msg = "Check the email address.";
        err("contact").textContent = msg;
        const mark = (n: string, bad: boolean) =>
          bad ? field(n).setAttribute("aria-invalid", "true") : field(n).removeAttribute("aria-invalid");
        mark("phone", badPhone);
        mark("email", badEmail);
        return !msg;
      }
    }
    return true;
  }

  const fieldOf = (el: Element): string | null => {
    const n = (el as HTMLInputElement).name;
    if (n === "phone" || n === "email") return "contact";
    return ["job", "name", "postcode"].includes(n) ? n : null;
  };
  form.addEventListener("focusout", (e) => {
    const f = fieldOf(e.target as Element);
    if (!f || f === "job") return;
    touched.add(f);
    validate(f);
  });
  form.addEventListener("input", (e) => {
    const f = fieldOf(e.target as Element);
    if (f && (touched.has(f) || f === "job")) validate(f);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const order = ["job", "name", "postcode", "contact"];
    const results = order.map((n) => { touched.add(n); return validate(n); });
    const first = results.indexOf(false);
    if (first !== -1) {
      const n = order[first];
      const target =
        n === "job" ? form.querySelector<HTMLInputElement>('input[name="job"]')
        : n === "contact" ? (form.querySelector<HTMLInputElement>('[name="phone"][aria-invalid], [name="email"][aria-invalid]') ?? field("phone"))
        : field(n);
      target?.focus();
      return;
    }
    // Demo only: nothing leaves the browser and nothing is stored.
    const who = field("name").value.trim().split(" ")[0];
    const text = done.querySelector("[data-done-text]");
    if (text) text.textContent = `Thanks, ${who}. On a live site this would go straight to the yard, and someone would reply the way you asked.`;
    done.hidden = false;
    done.focus();
  });

  done.querySelector("[data-reset]")?.addEventListener("click", () => {
    form.reset();
    touched.clear();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    form.querySelectorAll<HTMLElement>("[data-error]").forEach((el) => (el.textContent = ""));
    done.hidden = true;
    form.querySelector<HTMLInputElement>('input[name="job"]')?.focus();
  });
}

export function initForms() {
  initPostcode();
  initEnquiry();
}
