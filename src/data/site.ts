// ---------------------------------------------------------------------------
// Business facts live here and in the other files in src/data. Components hold
// layout. To adapt this concept for a real client, start with this file.
// ---------------------------------------------------------------------------

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, "/");

/** Prefix a site-root path with the deployment base. */
export const asset = (path: string) => BASE + path.replace(/^\//, "");

export const brand = {
  name: "Transom",
  fullName: "Transom Scaffolding",
  strapline: "First on site. Last to leave.",
  area: "Bristol, Bath and North Somerset",
  yard: "Yard near Avonmouth, Bristol",
  hours: "Monday to Friday, 7am to 5pm",
  // Ofcom keeps 0117 496 0000–0999 (Bristol) and 07700 900000–900999 (mobile)
  // aside for drama, and .example is reserved by the IETF. None of these can
  // reach a real person.
  phone: "0117 496 0418",
  phoneHref: "tel:+441174960418",
  whatsapp: "07700 900 418",
  whatsappHref: "https://wa.me/447700900418",
  email: "quotes@transom.example",
};

export const stapled = {
  url: "https://stapled.co.uk",
  // The real enquiry form. Nothing on this concept ever goes to it automatically.
  enquiryUrl: "https://stapled.co.uk/#preview",
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Method", href: "#method" },
  { label: "Work", href: "#work" },
  { label: "Coverage", href: "#coverage" },
];

/** Pre-filled WhatsApp text shown in the demo dialog. */
export const whatsappMessage =
  "Hi Transom, I'd like a scaffolding quote. Postcode: … Job: … I can send photos.";
