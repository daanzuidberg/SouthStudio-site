# SouthStudio — content & build

The website is now driven by **one source of truth**. You edit copy in two JSON
files; a generator stamps it into the live pages.

```
content/
  site.en.json     ← all English copy   (→ southstudio.online)
  site.nl.json     ← all Dutch copy      (→ southstudio.nl)
templates/
  index.html       ← page shells with {{placeholders}} — structure only
  timeline.html
  play.html
  privacy.html
build.js           ← the generator
```

## How to change text
1. Open `content/site.nl.json` (Dutch) or `content/site.en.json` (English).
2. Find the key. Keys are grouped **by page**, then **by the section of the page**
   they appear in — e.g. `hero_3`, `the_studio_2`, `footer_5`, `two_ways_to_play_4`.
   The English and Dutch files use the **same keys**, so the same key is the same
   sentence in each language.
3. Edit the value. Leave the key name and the HTML tags (`<em>`, `<br>`) intact.
4. Ask me to **regenerate** (run `build.js`) — the live `.html` pages update.

> ⚠️ Don't edit the generated `index.html` / `nl/index.html` etc. directly —
> they are overwritten on every build. The JSON is the source.

## Per-page structural keys
Each page also has a few non-copy keys, handled automatically:
`lang`, `title`, `desc` (meta description), `alt` (hreflang links),
`switcher` (the EN⇄NL language link).

## Build
The generator reads the templates + both JSON files and writes:
- English → `index.html`, `timeline.html`, `play.html`, `privacy.html` (site root)
- Dutch → `nl/index.html`, `nl/timeline.html`, `nl/play.html`, `nl/privacy.html`

Verified: regenerating reproduces the current site byte-for-byte.

## Forms — going live
Both the **newsletter** and the **pre-order** form submit for real. They look for
one setting in each page's `<head>`:

```html
<meta name="form-endpoint" content="" />
```

- **Leave it empty** (current state): the form falls back to opening the visitor's
  email app, pre-addressed to hello@southstudio — so nothing is lost.
- **To collect submissions automatically:** create a free form endpoint (e.g.
  [Formspree](https://formspree.io) — works with static sites, no server), and
  paste the endpoint URL into `content` of that meta tag. Easiest: set it once in
  each `templates/*.html`, then rebuild.

Each submission is sent as form fields (`email`, or `name`/`email`/`edition`) plus
a `_type` of "Newsletter" / "Pre-order".

## Privacy & consent (AVG/GDPR)
- A **privacy policy** page exists in both languages: `privacy.html` + `nl/privacy.html`
  (linked in every footer). Edit its copy in `content/site.*.json` under the
  `privacy` key group.
- The **pre-order** form has a required consent checkbox; the **newsletter** shows a
  consent notice linking to the policy.
- Update **hello@southstudio** to your real address (search the project) before launch.
