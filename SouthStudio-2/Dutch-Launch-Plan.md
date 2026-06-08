# SouthStudio — Bilingual Launch Plan (NL + EN)

_Status: PLAN ONLY — approved decisions captured below. No build yet._

## Goal
Reach the **Dutch** market and the **international (English)** market first, with a site that ranks and reads natively in both.

---

## Decisions captured
| Topic | Decision |
|---|---|
| Scope (this round) | **Plan only.** Build target when greenlit: the 3 website pages first. |
| Dutch tone | **Informal — "je / jou"** (friendly, consumer-brand voice) |
| Domains | **Separate domains:** `southstudio.nl` (Dutch) + `southstudio.online` (English) |
| Default language | **Domain-based** (decided for you — see below) |
| Dutch review | **You** review (native/fluent) |
| Brand terms | Keep proper nouns in English for now (SouthStudio, TIMELINE, Time Correction Agency). "manual" → **"uitleg"**. Full glossary below; you can adjust anytime. |
| In-game text | **English for now** (decided) — translate later inside the game's own project |

---

## Architecture: two domains, ONE source of truth

The key principle: **never hand-maintain two copies of the same page** — they drift. Instead:

```
/content/
   site.en.json        ← all English copy, one file
   site.nl.json        ← all Dutch copy, mirror keys
/templates/            ← the current pages, with {{placeholders}} instead of hard copy
   home.html  timeline.html  play.html  partials (header, footer, modal)
/build.js              ← stamps templates × content → outputs both sites
→ outputs:
   /          (English site, for southstudio.online)
   /nl/       (Dutch site, for southstudio.nl)   ← deployed to the .nl domain root
```

Edit copy once per language in the JSON; regenerate both sites. Layout/CSS/assets are shared, so visual changes happen in one place.

> Because you chose **separate domains**, the `/nl/` output folder becomes the **root** of `southstudio.nl`. (If you ever consolidate to one domain, the same output works as a `/nl` subfolder — zero rework.)

---

## Default-language behavior (decided)

With separate country domains this is clean and SEO-correct:
- **`southstudio.nl`** serves Dutch by default; **`southstudio.online`** serves English by default. Google geo-targets `.nl` to the Netherlands automatically.
- **No forced JS redirects** (they cause SEO and UX problems).
- **Header language switcher (NL | EN)** that cross-links the *same* page on the other domain.
- **One-time, dismissible suggestion banner:** if a Dutch-browser visitor lands on `.com`, show a thin bar — _"Liever Nederlands? → southstudio.nl"_ — and the inverse on `.nl` for non-Dutch browsers. Remembered in `localStorage`, never auto-redirects.

---

## SEO wiring (this is what wins the markets)
On **every** page, in both languages:
- Correct `<html lang="nl">` / `lang="en">`
- Translated `<title>` + `<meta name="description">`
- **`hreflang` alternates** linking the two versions + `x-default`:
  ```html
  <link rel="alternate" hreflang="nl" href="https://southstudio.nl/…">
  <link rel="alternate" hreflang="en" href="https://southstudio.online/…">
  <link rel="alternate" hreflang="x-default" href="https://southstudio.online/…">
  ```
- Open Graph / share text per language (title, description, image)
- Per-domain `sitemap.xml` + `robots.txt`
- Localized URL slugs optional (e.g. `/het-boek` vs `/timeline`) — nice-to-have, decide later

---

## Localization checklist (beyond words)
- Currency stays **€** (already correct for both)
- Date / number formats (e.g. "Q4 2026" → "Q4 2026" or "eind 2026")
- Button + form labels, validation messages, success states
- Pre-order modal + newsletter copy
- `alt` text on the logo/images
- 404 page copy
- Email/footer links, legal line

---

## Suggested Dutch glossary (je-form) — review & adjust
**Kept in English (proper nouns):** SouthStudio · TIMELINE · Time Correction Agency

| English | Proposed Dutch |
|---|---|
| Play online | Speel online |
| Two ways to play | Twee manieren om te spelen |
| The book | Het boek |
| Pre-order | Reserveer (je exemplaar) |
| History has been edited. You are the correction. | De geschiedenis is herschreven. Jij bent de correctie. |
| Deduction cases | Deductiezaken |
| Evidence | Bewijs |
| Solutions | Oplossingen |
| Manual / how-to | **Uitleg** |
| Field Manual (cover subtitle) | keep EN for now (or "Veldhandboek") |
| The Dispatch (newsletter) | De Nieuwsbrief (or keep "Dispatch") |
| Difficulty tiers | Niveaus |
| Ranks: Recruit → Chronovist | Optional: Rekruut · Veldagent · Onderzoeker · Specialist · Chronovist |

(I'll draft the *full* page copy idiomatically — this table is just the anchor terms for you to lock.)

---

## Phased rollout
1. **Refactor to source-of-truth** — extract English copy into `site.en.json` + templates. English site looks identical; nothing visible changes. _(Foundation.)_
2. **Add Dutch** — write `site.nl.json`, generate `/nl/` site, add switcher + suggestion banner + hreflang/meta.
3. **Your review loop** — you read the Dutch, we polish.
4. **Deploy** — `.com` from root output, `.nl` from `/nl/` output; submit both sitemaps.

---

## Deferred (not in the first website round)
- **The 198-page book** + **cover** — translatable through the same generator (the puzzle-prose bank gets Dutch strings). Big but mechanical. **English-first; Dutch book later.**
- **The embedded game** — your separate build; in-game text translated there, English for now.

---

## What I need from you to start building (when ready)
- Confirm/adjust the glossary above (esp. ranks, "Dispatch", "Field Manual")
- Confirm both domains are secured
- Say "go" — and whether to start with **Phase 1 (refactor)** or jump straight to a **Dutch draft of one page** so you can feel the tone first
