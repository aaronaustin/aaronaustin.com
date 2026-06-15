# Handoff

_Last updated: 2026-06-15_

## Current state
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
    which frontmatter fields are present.
  - `src/pages/index.astro` — release index (`.grid` of `ReleaseCard`s, sorted
    newest-first by `releaseDate`), plus site-wide sections (logo header, Substack,
    podcast, social links, link to `/sing`).
- **Redesigned `ReleaseCard.astro`** (+ new `src/styles/components/_release-card.scss`,
  `.primary.small` button variant in `_button.scss`): the whole card is one link —
  cover image on top, title bottom-left, small "View Release" button bottom-right.
  Replaces the old `.link-card`-based card that had an awkward empty `.spacer` area.
- `CLAUDE.md` documents the release-authoring template and the release-card pattern.
- Verified via `astro build` + dev server: both releases build, homepage shows both
  cards (newest first), each links to its detail page, and "All Will Be Well"'s
  streaming links (Spotify/Bandcamp/YouTube/Amazon) render with no video/donation
  sections.
- `CNAME` accidental-edit issue from earlier was fixed and is clean.
- **Site-wide nav + footer added to `BaseLayout.astro`**: a `.site-nav` containing
  just the logo SVGs (`HeaderAaron`/`HeaderAustin`) linking to `/`, and a
  `.site-footer` with the `© {year} Aaron Austin` line. New styles in
  `layout/_container.scss` (`.site-nav`, `.site-logo`, `.site-footer`). Removed the
  per-page duplicated logo block and footer from `index.astro`, `sing.astro`, and
  `releases/[slug].astro` — the homepage keeps only its tagline in its own
  `<header>`. Also trimmed `sing.astro`'s leftover boilerplate imports (it only
  used `BaseLayout`). Verified the nav/footer render on all four pages.

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
