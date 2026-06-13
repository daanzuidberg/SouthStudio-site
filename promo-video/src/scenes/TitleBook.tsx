import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, mono, monoCaps, serif } from "../theme";
import { Kicker } from "../components/ui";

// Scene 2 · 0:04–0:09 — first reveal of the product. The Timeline book
// slides onto the desk; the cover's logic grid builds; the title sets.
export const TitleBook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 200 } });
  const bookX = interpolate(slide, [0, 1], [-700, 0]);
  const bookRot = interpolate(slide, [0, 1], [-6, 0]);

  const gridProgress = interpolate(frame, [22, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleS = spring({ frame: frame - 70, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.paper2} 0%, ${COLORS.paper} 60%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* The book */}
      <div
        style={{
          transform: `translateX(${bookX}px) rotate(${bookRot}deg)`,
          width: 520,
          height: 720,
          background: `linear-gradient(155deg, #211C17 0%, ${COLORS.ink} 55%, #0E0B08 100%)`,
          borderRadius: 10,
          boxShadow:
            "0 40px 80px rgba(20,16,12,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // spine highlight on the left edge
          borderLeft: "10px solid #050403",
        }}
      >
        {/* top kicker on the cover */}
        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            color: COLORS.dim,
            fontSize: 17,
            letterSpacing: "0.34em",
            position: "absolute",
            top: 56,
          }}
        >
          The Time Correction Agency
        </div>

        {/* logic grid — paper-colored cells on the dark cover */}
        <div style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>
          <CoverGrid size={220} progress={gridProgress} />
        </div>

        {/* title on the cover */}
        <div
          style={{
            fontFamily: serif,
            color: COLORS.paper,
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: "0.02em",
            marginTop: 54,
            opacity: interpolate(gridProgress, [0.6, 1], [0, 1]),
          }}
        >
          TIMELINE
        </div>

        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            color: COLORS.line2,
            fontSize: 15,
            letterSpacing: "0.3em",
            position: "absolute",
            bottom: 54,
            opacity: interpolate(gridProgress, [0.7, 1], [0, 1]),
          }}
        >
          SouthStudio · No. 001
        </div>
      </div>

      {/* Supporting line below */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          textAlign: "center",
          maxWidth: 820,
          padding: "0 40px",
          transform: `translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
          opacity: titleS,
        }}
      >
        <Kicker delay={70}>A puzzle book · 80 cases</Kicker>
        <div
          style={{
            fontFamily: serif,
            fontSize: 42,
            color: COLORS.ink2,
            lineHeight: 1.25,
            marginTop: 18,
          }}
        >
          Set inside the{" "}
          <span style={{ color: COLORS.ink, fontWeight: 600 }}>
            Time Correction Agency
          </span>
          . Someone&apos;s been editing the past.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A version of the mark tuned for the dark cover (open cells = faint paper outline).
const CoverGrid: React.FC<{ size: number; progress: number }> = ({
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
          kind === "red"
            ? COLORS.red
            : kind === "ink"
            ? COLORS.paper
            : "transparent";
        return (
          <div
            key={i}
            style={{
              border: `2px solid ${
                kind === "open" ? "rgba(250,247,239,0.35)" : "transparent"
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
