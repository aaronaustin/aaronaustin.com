import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://aaronaustin.com",
  // base: "/repo-name/",
  integrations: [react()]
});
