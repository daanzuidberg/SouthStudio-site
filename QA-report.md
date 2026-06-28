# SouthStudio — QA Report (error sweep)
_Last run: June 2026 · covers the Puzzlebook (book) + the website (EN + NL)._

This sweep ran in three passes: **automated** (puzzle proofs + consistency scan),
**language** (needs your eye), and **technical** (links + render).

---

## ✅ Pass 1 — Automated (done)

### Puzzles — the critical one (book + game)
Every one of the **80 book puzzles** was machine-verified, not eyeballed:
- I wrote an *inverse parser* that reads each printed clue sentence back into a
  logical constraint, then ran the puzzle solver on it.
- For all 80: the printed **solution is a valid grid** (each item used once),
  **every printed clue is satisfied** by that solution, and the clue set yields
  **exactly one** solution — with the deliberate "corrupted record" clues correctly
  excluded.
- **Result: 80 / 80 PASS.** The deduction layer is sound; no unsolvable or
  ambiguous case ships.

### Consistency scan — clean
- Price **€24 / €29 / €32** — consistent everywhere (EN + NL).
- **200 pages**, **80 cases** (book) / **30 cases** (free online) — consistent.

### Fixed in this sweep
| # | Issue | Where | Fix |
|---|-------|-------|-----|
| 1 | Sample teaser claimed the *interactive edition* has **"79 more cases"** — contradicted "online = free 30-case taster, book = 80". | timeline (EN + NL) | Reframed: "This is one of 80 cases in the book. Play a free set online — with hints and auto-save." |
| 2 | Stale **southstudio.com** (old domain) | README + Launch-Plan docs | → southstudio.online. *(Live pages were already correct: 0 occurrences.)* |
| 3 | **Dead `#dispatch` anchors** — privacy page linked to a newsletter section it doesn't contain | privacy (EN + NL), ×3 each | → `index.html#dispatch` |

---

## ⚠️ Action needed from you (launch blocker)

**Real contact email.** The site currently uses a placeholder:
- Visible text reads `hello@southstudio` (no `.com`/`.nl` — looks unfinished).
- The `mailto:` uses `info@southstudio.online` (a reserved placeholder; mail bounces).
- Form fallback + error messages repeat it.

This is the email that newsletter/pre-order submissions fall back to, and that the
privacy policy points people to. **Tell me the real address** (e.g. `info@southstudio.onlinenl`)
and I'll wire it everywhere in one pass.

---

## ⏳ Pass 2 — Language review (needs your eye — recommended next)

The puzzle logic and facts are verified, but **copy quality is a human call** —
especially Dutch, where you're native. I haven't blind-edited prose. Next step,
when you're ready: I produce a **flagged table** (file → text → suggestion) for
NL and EN — you approve, I apply at the source (`content/site.*.json`) and rebuild.

Known stylistic things to decide on:
- Kept-in-English brand terms by design: _Time Correction Agency_, _Timeline_,
  artifact/figure names, `Live`, `FORMAAT`. Confirm these stay English.
- Tone consistency: informal **je/jou** throughout (as chosen).

---

## ✅ Pass 3 — Technical (done)
- **Links/anchors:** 0 broken across all 8 pages (in-page anchors, relative links,
  language switcher EN⇄NL all resolve).
- **Build:** regenerating from source reproduces the site; no console errors.
- **SEO/social** (from step ②): canonical, hreflang, OG, favicon, JSON-LD intact.

### Minor / cosmetic (non-blocking)
- The `alt` keys still stored in `content/site.*.json` contain the old `.com`, but
  `build.js` **overwrites** them with computed `.online`/`.nl` on every build, so
  live pages are correct. Harmless; can be blanked for tidiness.
