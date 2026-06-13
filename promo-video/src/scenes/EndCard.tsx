import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, mono, monoCaps, serif } from "../theme";

// Scene 6 · 0:27–0:35 — the reveal / CTA, on the dark "cover" ground.
// TIMELINE → editions → Pre-order at SouthStudio.online → tagline.
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markS = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const titleS = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const gridProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaS = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const taglineO = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // gentle breathing pulse on the CTA button
  const pulse = 1 + Math.sin(frame / 12) * 0.012;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 30%, #241E18 0%, ${COLORS.ink} 55%, #0C0907 100%)`,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(markS, [0, 1], [0.7, 1])})`,
          opacity: markS,
          filter: "drop-shadow(0 0 1px rgba(0,0,0,0.4))",
        }}
      >
        <DarkMark size={140} progress={gridProgress} />
      </div>

      <div
        style={{
          fontFamily: serif,
          fontSize: 132,
          fontWeight: 700,
          color: COLORS.paper,
          letterSpacing: "0.04em",
          marginTop: 40,
          transform: `translateY(${interpolate(titleS, [0, 1], [40, 0])}px)`,
          opacity: titleS,
        }}
      >
        TIMELINE
      </div>

      <div
        style={{
          ...monoCaps,
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: "0.34em",
          color: COLORS.line2,
          marginTop: 10,
          opacity: titleS,
        }}
      >
        SouthStudio · No. 001
      </div>

      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 38,
          color: COLORS.line2,
          marginTop: 30,
          opacity: interpolate(frame, [50, 66], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        A puzzle book for people who think.
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 64,
          transform: `translateY(${interpolate(ctaS, [0, 1], [30, 0])}px) scale(${pulse})`,
          opacity: ctaS,
          background: COLORS.red,
          padding: "26px 56px",
          borderRadius: 8,
          boxShadow: "0 18px 50px rgba(210,54,43,0.35)",
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.paper,
          }}
        >
          Pre-order at SouthStudio.online
        </div>
      </div>

      <div
        style={{
          ...monoCaps,
          fontFamily: mono,
          fontSize: 19,
          letterSpacing: "0.26em",
          color: COLORS.dim,
          marginTop: 26,
          opacity: ctaS,
        }}
      >
        €24 · Ships Q4 2026 · Link in bio →
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          fontFamily: serif,
          fontSize: 30,
          color: COLORS.line2,
          opacity: taglineO,
          letterSpacing: "0.01em",
        }}
      >
        Things worth thinking about.
      </div>
    </AbsoluteFill>
  );
};

// Mark tuned for the dark end-card (uses LogicGridMark's structure but
// inverts the "ink" cell to paper so it reads on black).
const DarkMark: React.FC<{ size: number; progress: number }> = ({
  size,
  progress,
}) => {
  const LAYOUT: ("open" | "red" | "ink")[] = [
    "open", "red", "open",
    "open", "open", "ink",
    "ink", "open", "open",
  ];
  const gap = size * 0.08;
  const cell = (size - gap * 2) / 3;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${cell}px)`,
        gridTemplateRows: `repeat(3, ${cell}px)`,
        gap,
      }}
    >
      {LAYOUT.map((kind, i) => {
        const start = i / LAYOUT.length;
        const local = interpolate(progress, [start, start + 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fill =
          kind === "red" ? COLORS.red : kind === "ink" ? COLORS.paper : "transparent";
        return (
          <div
            key={i}
            style={{
              border: `2px solid ${
                kind === "open" ? "rgba(250,247,239,0.3)" : "transparent"
              }`,
              background: fill,
              transform: `scale(${local})`,
              opacity: local,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};
