# Timeline — Promo Video

A Remotion project that renders the promotional video for **Timeline**
(No. 001), SouthStudio's debut deduction book.

It's a ~35-second **9:16 vertical** motion-graphics piece built entirely in
code — on-brand typography (Newsreader + IBM Plex Mono), the studio palette,
the logic-grid mark, and the voice-over script from the TikTok production brief
rendered as kinetic type. No external footage or AI credits required.

## Structure

```
src/
  Root.tsx            Compositions: TimelinePromo (1080×1920), TimelineSquare (1080×1080)
  TimelinePromo.tsx   Stitches the scenes + atmosphere/timecode overlays
  theme.ts            Brand palette + type tokens
  fonts.ts            Newsreader + IBM Plex Mono via @remotion/google-fonts
  scenes/
    Hook.tsx              0:00–0:04  "What if history was being rewritten…" + CLASSIFIED stamp
    TitleBook.tsx         0:04–0:09  Book reveal, cover logic-grid builds
    Facts.tsx             0:09–0:15  80 cases counter, five-clearance ladder
    Method.tsx            0:15–0:24  Self-solving deduction grid + method lines
    CorrectionStamp.tsx   0:24–0:27  "CORRECTION FILED" payoff
    EndCard.tsx           0:27–0:35  TIMELINE + pre-order CTA + tagline
  components/         LogicGridMark, CornerBrackets, Atmosphere (grain/dust/lamp), ui helpers
```

## Develop

```bash
npm install
npm run dev        # opens Remotion Studio
```

## Render

This environment ships only Playwright's Chromium and intercepts TLS for
Google Fonts, so point Remotion at the `headless_shell` binary (the config
already ignores cert errors):

```bash
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npm run render          # -> out/timeline-promo.mp4  (9:16)
npm run render-square   # -> out/timeline-square.mp4 (1:1)
```

On a normal machine with a full Chrome install, drop the env var — Remotion
finds a browser automatically.

## Notes

- The video has a silent audio track. To add the brief's voice-over + ambient
  bed, drop an audio file in `public/` and mount it with Remotion's `<Audio>`
  in `TimelinePromo.tsx`.
- Want the cinematic AI-footage version instead (Kling/Sora per the TikTok
  brief)? That's a separate path via Higgsfield — ask and I'll set it up.
