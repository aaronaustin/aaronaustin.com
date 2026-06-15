import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://aaronaustin.com",
  // base: "/repo-name/",
  integrations: [react(), sitemap()]
});
