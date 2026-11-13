// @ts-check
import { defineConfig } from "astro/config";

// Runs at the site root locally. For a GitHub Pages project site, build with
// SITE_BASE=/<repo-name>. Every internal link and public file goes through
// asset() in src/data/site.ts, so it follows the base.
export default defineConfig({
  site: "https://matthewstapley.github.io",
  base: process.env.SITE_BASE || "/",
  trailingSlash: "always",
  devToolbar: { enabled: false },
});
