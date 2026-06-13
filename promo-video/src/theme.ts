// SouthStudio brand tokens — single source of truth for the promo.
// Mirrors "SouthStudio Brand Identity.md" (Palette + Typography).

export const COLORS = {
  ink: "#1A1612", // primary text / dark surfaces
  ink2: "#46413A", // body text
  dim: "#6B6256", // secondary / mono labels
  red: "#D2362B", // the one accent — use sparingly
  paper: "#FAF7EF", // primary background
  paper2: "#F1EBDD", // cards / panels
  line: "#DDD4C2", // hairlines
  line2: "#C8BDA6", // stronger borders
} as const;

// Font families are loaded in fonts.ts and exposed here for convenience.
export const serif = "var(--font-serif)";
export const mono = "var(--font-mono)";

// Letter-spaced mono caps — the studio's "system text" tic.
export const monoCaps = {
  fontFamily: mono,
  textTransform: "uppercase" as const,
  letterSpacing: "0.22em",
  fontWeight: 600,
};
