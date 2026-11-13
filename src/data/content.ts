import { images, type Img } from "./images";

export type Service = {
  slug: string;
  title: string;
  short: string;
  body: string;
  includes: string[];
  image: Img;
};

export const services: Service[] = [
  {
    slug: "domestic",
    title: "Houses & extensions",
    short: "Re-roofs, rendering, windows, gutters and new extensions.",
    body: "Scaffolding for homeowners and the builders working for them. We fit the scaffold around gardens, neighbours and parked cars, and adapt it as walls go up.",
    includes: ["Front, rear and gable elevations", "Extensions built in stages", "Ladder or stair access to suit the job"],
    image: images.extension,
  },
  {
    slug: "chimney",
    title: "Chimneys & roofs",
    short: "Chimney stacks, ridges, valleys and roof-edge protection.",
    body: "Access for roofers and chimney work on terraces and detached houses, including stacks that can only be reached from a neighbour's side.",
    includes: ["Chimney stack scaffolds", "Roof-edge protection and handrails", "Access agreed with neighbours where needed"],
    image: images.chimney,
  },
  {
    slug: "commercial",
    title: "Commercial & new build",
    short: "Full-height façades, phased wraps and stair towers.",
    body: "Façade and access scaffolds for main contractors and developers, planned around the programme and changed as trades come and go.",
    includes: ["Independent and system scaffolds", "Stair towers and loading bays", "Phased erection to suit the programme"],
    image: images.system,
  },
  {
    slug: "temporary-roof",
    title: "Temporary roofs & sheeting",
    short: "Keeping weather and debris in check while work continues.",
    body: "Temporary roofs, sheeting and debris netting so that work can carry on in poor weather and dust stays on site.",
    includes: ["Temporary roof structures", "Sheeting and debris netting", "Designed where loads require it"],
    image: images.sheeted,
  },
  {
    slug: "heritage",
    title: "Heritage & stone",
    short: "Listed buildings, church towers and stone façades.",
    body: "Scaffolds for repair and conservation work, with ties and surface protection agreed with your architect or conservation officer before we start.",
    includes: ["Tower and spire scaffolds", "Protected ties and padded contact points", "Working with architects and conservation officers"],
    image: images.tower,
  },
  {
    slug: "highway",
    title: "Pavements & public highway",
    short: "Gantries, pavement scaffolds and lighting for busy streets.",
    body: "When a scaffold stands on the pavement or road, we apply to the council for the licence and plan pedestrian routes, lighting and barriers.",
    includes: ["Council scaffold licence applications", "Pedestrian gantries and fans", "Lighting and barriers"],
    image: images.pavement,
  },
];

/** The six stages of the "lift by lift" drawing. Keep in step with Method.astro. */
export const steps = [
  {
    no: "01",
    title: "Survey",
    body: "We visit, measure the building and look at what's around it: ground conditions, neighbours, overhead cables and how the street is used.",
    note: "Free site visit",
  },
  {
    no: "02",
    title: "Plan",
    body: "We work out where the standards go, where the scaffold ties into the building and how people will get up it. Scaffolds outside standard configurations get a design from a scaffold engineer.",
    note: "Drawings where needed",
  },
  {
    no: "03",
    title: "Erect",
    body: "Sole boards and base plates, then standards, ledgers and transoms, one lift at a time. Boards, guardrails and toe boards go in as each working level is reached.",
    note: "Built lift by lift",
  },
  {
    no: "04",
    title: "Hand over",
    body: "Before anyone uses it, the scaffold is inspected and handed over in writing. While it stands it's inspected at least every seven days and after bad weather or alterations.",
    note: "Written inspections",
  },
  {
    no: "05",
    title: "Adapt",
    body: "Jobs change. We add lifts, loading bays, sheeting or a temporary roof as the work needs them, and re-inspect after every change.",
    note: "Changes as you go",
  },
  {
    no: "06",
    title: "Strike",
    body: "When the trades have finished, we take it down in reverse order, clear the ground and leave the building as we found it.",
    note: "Site left clear",
  },
];

export type Project = {
  slug: string;
  title: string;
  where: string;
  kind: string;
  summary: string;
  scope: string[];
  image: Img;
};

export const projects: Project[] = [
  {
    slug: "listed-facade",
    title: "Listed façade repairs",
    where: "City centre",
    kind: "Heritage",
    summary: "Full-height scaffold across a classical façade so masons could repair columns and cornices, with the shop entrances below kept open.",
    scope: ["Independent façade scaffold", "Pedestrian gantry at ground level", "Ties agreed with the architect"],
    image: images.colonnade,
  },
  {
    slug: "church-tower",
    title: "Church tower",
    where: "North Somerset",
    kind: "Heritage",
    summary: "A tower scaffold rising past the bell openings for stone and roof repairs, with loading platforms for materials.",
    scope: ["Tower scaffold to parapet level", "Loading platforms", "Protection for stonework"],
    image: images.tower,
  },
  {
    slug: "chimney-rebuild",
    title: "Chimney stack rebuild",
    where: "Clifton",
    kind: "Residential",
    summary: "Scaffold up the side of a stone terrace so a chimney stack could be taken down and rebuilt, with safe roof access for the slaters.",
    scope: ["Independent scaffold above ridge height", "Loading platform for reclaimed stone", "Roof-edge protection"],
    image: images.chimney,
  },
  {
    slug: "residential-block",
    title: "Residential block refurbishment",
    where: "Bristol",
    kind: "Commercial",
    summary: "A long, multi-storey elevation scaffolded in phases so residents kept access while windows and cladding were replaced.",
    scope: ["Phased full-length scaffold", "Stair towers", "Loading bays"],
    image: images.longElevation,
  },
];

/** Towns shown on the coverage diagram (approximate centres). */
export const yard = { name: "Yard", lat: 51.5, lon: -2.699 };

export const towns = [
  { name: "Bristol", lat: 51.4545, lon: -2.5879, size: 3 },
  { name: "Bath", lat: 51.3811, lon: -2.359, size: 2 },
  { name: "Weston-super-Mare", lat: 51.3462, lon: -2.9773, size: 2 },
  { name: "Clevedon", lat: 51.4385, lon: -2.854, size: 1 },
  { name: "Portishead", lat: 51.484, lon: -2.7626, size: 1 },
  { name: "Nailsea", lat: 51.4329, lon: -2.7571, size: 1 },
  { name: "Keynsham", lat: 51.4135, lon: -2.4977, size: 1 },
  { name: "Thornbury", lat: 51.6094, lon: -2.5249, size: 1 },
  { name: "Yate", lat: 51.5407, lon: -2.418, size: 1 },
  { name: "Midsomer Norton", lat: 51.2842, lon: -2.48, size: 1 },
  { name: "Chippenham", lat: 51.4583, lon: -2.116, size: 1, edge: true },
  { name: "Frome", lat: 51.2279, lon: -2.3215, size: 1, edge: true },
  { name: "Wells", lat: 51.2094, lon: -2.645, size: 1, edge: true },
];

/** Outward postcode districts treated as "usual area" by the checker. */
export const coverage = {
  core: [/^BS\d{1,2}$/, /^BA[1-3]$/],
  ask: [/^BA([4-9]|1[0-6])$/, /^GL1[0-3]$/, /^SN1[3-6]$/, /^TA[6-9]$/],
};
