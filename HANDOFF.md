# Handoff

_Last updated: 2026-06-15_

## Current state
All pushed to `origin/main` (`b815888..24bea91`).

- **SEO & social sharing** — `BaseLayout.astro` takes `title`, `description`,
  `image`, `imageWidth`/`imageHeight`, `type`, `structuredData` and renders
  per-page `<meta name="description">`, `<link rel="canonical">`, Open Graph,
  Twitter card, and optional JSON-LD tags. Defaults: homepage tagline,
  `/og-default.png` (1200×630), `1200×630`, `"website"`.
  - Release pages (`releases/[slug].astro`) pass the release `summary`,
    `type="music.album"`, a `MusicAlbum` JSON-LD block (square 1200×1200 cover
    via `getImage()`), and `image="/og/<slug>.jpg"`.
  - `sing.astro` has its own title/description.
  - `@astrojs/sitemap` integration — **pinned to `3.2.1`** (3.6+ needs an Astro 5
    API and crashes on Astro 4.16). Generates `sitemap-index.xml`.
  - `public/robots.txt` allows all crawlers, points at the sitemap.
- **Per-release OG images** (`scripts/generate-og-images.mjs`, runs via
  `predev`/`prebuild`, uses `sharp` + `gray-matter` — both added as
  devDependencies): letterboxes each release's square cover onto a 1200×630
  white canvas → `public/og/<slug>.jpg` (gitignored, regenerated every build).
  Needed because Facebook's link-preview card center-crops square images even
  when `og:image:width/height` is set correctly to 1200×1200.
  - `public/og-default.png` padded to 1200×630 on white (was a bare 975×139
    logo crop — Facebook requires ≥200×200 share images).
  - **Known non-issue**: Facebook's debugger flags `fb:app_id` as missing —
    that's only for Insights/analytics, not the preview itself. Skipped (would
    need a real Facebook App ID from the user).
- **Favicon** — `public/favicon.svg` (the "aa" mark), linked via
  `<link rel="icon" type="image/svg+xml">` in `BaseLayout.astro`. Inline
  `<style>` with `prefers-color-scheme: dark` makes it black in light mode,
  white in dark mode (Safari may not honor the media query but degrades to the
  light version).

## Previous state
- Multi-release architecture is in place:
  - `src/content/config.ts` defines the `releases` content collection schema
    (title, releaseDate, cover, summary, optional streaming/video/donation blocks).
  - Two releases live in `src/content/releases/`:
    - `dear-minneapolis.md` — full treatment (streaming, video, donation/charity
      section).
    - `all-will-be-well.md` — lighter release (cover, summary, streaming only;
      released 2026-06-14, no video/donation). Cover art copied to
      `src/img/all-will-be-well.png`.
  - `src/pages/releases/[slug].astro` — dynamic release detail page, renders cover,
    streaming links, video, donation cards, and Markdown body conditionally based on
    which frontmatter fields are present. The `<header>` has a scoped
    `margin-top: var(--space-xl)` so the title doesn't crowd the site nav. Ends with
    an `.outline` "← All Releases" link back to `/`.
  - `src/pages/index.astro` — release index (`.grid` of `ReleaseCard`s, sorted
    newest-first by `releaseDate`), plus a "Connect" section.
- **`ReleaseCard.astro` is a button-less full-card link** (`src/styles/components/_release-card.scss`):
  cover image on top, title below, the whole card is the click target. Hover effect
  is a solid black `box-shadow` (spread-only, `0 0 0 6px black`) that expands from
  `0` via `transition: box-shadow 0.2s ease`.
- **"Connect" section** on the homepage is a `.link-grid` of `.link-card-sm` cards
  (`src/styles/components/_link-grid.scss`) — Substack, Podcast, Facebook,
  Instagram, and a link to `/sing` (No Kings Song Sheets) — sharing the same
  box-shadow hover effect as the release cards for visual consistency.
- **`.outline` button variant** in `input/_button.scss`: transparent background,
  2px black border, black text; inverts to filled black on hover. Used for the
  "← All Releases" link on release detail pages.
- **Site-wide nav + footer** in `BaseLayout.astro`: a `.site-nav` containing just the
  logo SVGs (`HeaderAaron`/`HeaderAustin`) linking to `/`, centered, and a
  `.site-footer` with the `© {year} Aaron Austin` line. Styles in
  `layout/_container.scss` (`.site-nav`, `.site-logo`, `.site-footer`).
- `.gitignore` ignores `.astro`, `.claude`, `dist`, and (as of this session)
  `public/og`.

## Next steps
- **Add more releases** as needed — follow the template in `CLAUDE.md`.
- **Nav** currently only has the logo (per request) — no nav links yet. Could add
  links to `/`, releases, `/sing`, etc. if the page count grows.
- **Optional cleanup** (not blocking):
  - `src/styles/components/_streaming.scss` is unused legacy CSS (uses an undefined
    `--step--1` token) — safe to delete.
  - `src/styles/layout/_container.scss` still has the old `.link-card` rules — still
    used by `DonationCards.astro`, so keep, but no longer used for release cards.
- **Possible future enhancement**: if the release list grows, consider a "featured"
  flag, limiting the homepage grid, or an archive/pagination page.
- **Verify on Facebook**: after deploy, re-run the Sharing Debugger's "Scrape
  Again" on a release URL to confirm the letterboxed 1200×630 image now shows
  without cropping.
