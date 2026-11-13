import { asset } from "./site";

export type Img = {
  name: string;
  widths: number[];
  ratio: number; // width / height
  alt: string;
  /** Object position for crops. */
  pos?: string;
};

const img = (name: string, ratio: number, alt: string, widths = [640, 1024, 1600], pos?: string): Img => ({
  name,
  widths,
  ratio,
  alt,
  pos,
});

export const images = {
  extension: img("extension", 4 / 3, "Tube-and-fitting scaffold around a two-storey rear extension in blockwork, with a ladder to the first lift"),
  longElevation: img("long-elevation", 4 / 3, "Scaffold running the full length of a long multi-storey building, seen from below", [640, 1024, 1600, 2200]),
  colonnade: img("colonnade", 2400 / 1612, "System scaffold with yellow guardrails across a classical façade with columns", [640, 1024, 1600, 2200]),
  tower: img("tower", 3 / 2, "Scaffold wrapped around a stone church tower against a cloudy sky", undefined, "50% 30%"),
  system: img("system", 2400 / 1597, "Workers climbing a system scaffold with stair access on a large building"),
  sheeted: img("sheeted", 3 / 2, "City-centre building site with edge protection and a sheeted scaffold beside a brick building"),
  pavement: img("pavement", 2400 / 3596, "Scaffold over a pavement with red and white road barriers along the kerb"),
  chimney: img("chimney", 4 / 3, "Scaffold rising beside a stone chimney stack and slate roofs"),
  erecting: img("erecting", 2400 / 3554, "Scaffolders assembling a tall scaffold frame high above the ground"),
  nightGlow: img("night-glow", 2400 / 1622, "Sheeted scaffold glowing amber at night with a worker silhouetted on a lift", [640, 1024, 1600, 2200]),
} satisfies Record<string, Img>;

export const src = (i: Img, w: number) => asset(`/images/${i.name}-${w}.webp`);
export const srcset = (i: Img) => i.widths.map((w) => `${src(i, w)} ${w}w`).join(", ");
