import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://username.github.io",
  // base: "/repo-name/",
  integrations: [react()]
});
