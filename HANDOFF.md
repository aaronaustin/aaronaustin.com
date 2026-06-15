# Handoff

_Last updated: 2026-06-15_

## Current state
- **Social image follow-ups** (after first Facebook share only showed the title —
  the SEO commit hadn't been pushed yet):
  - `public/og-default.png` is now padded to 1200×630 on a white background
    (was a bare 975×139 logo crop — Facebook requires ≥200×200 share images).
  - Release pages now generate a 1200px-wide JPEG of the cover via
    `getImage()` for `og:image`/`twitter:image`/JSON-LD instead of shipping the
    full 3000×3000 source PNG to crawlers (298KB → 78KB / 216KB → 55KB).
  - Verified via `astro build`.
- **SEO & social sharing** set up across the site:
  - `BaseLayout.astro` now renders per-page `<meta name="description">`,
    `<link rel="canonical">`, Open Graph, and Twitter card tags, plus an optional
    JSON-LD `structuredData` block. Defaults to the homepage tagline and
    `public/og-default.png` (copied from `src/img/aa-header.png`) when a page
    doesn't override `description`/`image`.
  - `releases/[slug].astro` passes the release `summary` as `description`, the
    release `cover` (resolved to an absolute URL) as `image`, `type="music.album"`,
    and a `MusicAlbum` JSON-LD block (name, byArtist, datePublished, image, url).
  - `sing.astro` got its own `title`/`description` (was previously reusing the
    homepage's title).
  - Added `@astrojs/sitemap` integration — **pinned to `3.2.1`** because `3.6+`
    relies on an Astro 5 integration API and threw `Cannot read properties of
    undefined (reading 'reduce')` at build time on Astro 4.16. Generates
    `sitemap-index.xml` / `sitemap-0.xml`.
  - Added `public/robots.txt` (allow all, points at the sitemap).
  - Verified via `astro build`: meta/OG/Twitter/JSON-LD tags render correctly on
    the homepage and both release pages, sitemap and robots.txt generate in `dist/`.
  - Not yet committed.

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
  `0` via `transition: box-shadow 0.2s ease`. The `.primary.small` button variant
  that was used in the earlier "View Release" button design has been removed
  (no longer referenced anywhere).
- **"Connect" section** on the homepage replaces the old separate "Read & Connect" /
  podcast / "Be Social" / "Sing!" sections. It's a `.link-grid` of `.link-card-sm`
  cards (`src/styles/components/_link-grid.scss`) — Substack, Podcast, Facebook,
  Instagram, and a link to `/sing` (No Kings Song Sheets) — sharing the same
  box-shadow hover effect as the release cards for visual consistency.
- **New `.outline` button variant** in `input/_button.scss`: transparent background,
  2px black border, black text; inverts to filled black on hover. Used for the
  "← All Releases" link on release detail pages.
- `CLAUDE.md` documents the release-authoring template, release-card pattern, hover
  effect convention, link-grid pattern, and both button variants (`.primary`,
  `.outline`).
- Verified via `astro build` + dev server: both releases build, homepage shows both
  cards (newest first), each links to its detail page, and "All Will Be Well"'s
  streaming links (Spotify/Bandcamp/YouTube/Amazon) render with no video/donation
  sections.
- **Site-wide nav + footer** in `BaseLayout.astro`: a `.site-nav` containing just the
  logo SVGs (`HeaderAaron`/`HeaderAustin`) linking to `/`, centered, and a
  `.site-footer` with the `© {year} Aaron Austin` line. Styles in
  `layout/_container.scss` (`.site-nav`, `.site-logo`, `.site-footer`).
- **Git hygiene cleanup + push**: `.gitignore` now ignores `.astro`, `.claude`, and
  `dist` (generated/local-only files); the duplicate `cname` (lowercase) index entry
  was removed, leaving only `CNAME`. Two commits pushed to `origin/main`
  (`2cdc33b..b815888`):
  - `a876ad5` — "Stop tracking generated/local files and remove duplicate CNAME entry"
  - `b815888` — "Add multi-release architecture, site nav/footer, and card redesign"

## Next steps
- **Add more releases** as needed — follow the template in `CLAUDE.md`.
- **`public/og-default.png`** is currently a copy of `src/img/aa-header.png`
  (975×139 — a wide logo banner, not the ideal ~1200×630 OG aspect ratio). Works
  as a fallback for non-release pages (homepage, `/sing`) but consider a
  purpose-made square/landscape share image later.
- **Nav** currently only has the logo (per request) — no nav links yet. Could add
  links to `/`, releases, `/sing`, etc. if the page count grows.
- **Optional cleanup** (not blocking):
  - `src/styles/components/_streaming.scss` is unused legacy CSS (uses an undefined
    `--step--1` token) — safe to delete.
  - `src/styles/layout/_container.scss` still has the old `.link-card` rules — still
    used by `DonationCards.astro`, so keep, but no longer used for release cards.
- **Possible future enhancement**: if the release list grows, consider a "featured"
  flag, limiting the homepage grid, or an archive/pagination page.
