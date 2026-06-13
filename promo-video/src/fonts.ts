// Load brand fonts from Google Fonts and expose them as CSS variables.
import type React from "react";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const newsreader = loadNewsreader("normal", {
  weights: ["400", "500", "600", "700"],
});
const plexMono = loadPlexMono("normal", {
  weights: ["400", "500", "600"],
});

export const fontFamilies = {
  serif: newsreader.fontFamily,
  mono: plexMono.fontFamily,
};

export const waitForFonts = () =>
  Promise.all([newsreader.waitUntilDone(), plexMono.waitUntilDone()]);

// Inject the brand font families as CSS custom properties so theme.ts can
// reference them via var(--font-serif) / var(--font-mono).
export const fontVars: React.CSSProperties = {
  // @ts-expect-error custom properties
  "--font-serif": `${fontFamilies.serif}, Georgia, serif`,
  "--font-mono": `${fontFamilies.mono}, ui-monospace, monospace`,
};
