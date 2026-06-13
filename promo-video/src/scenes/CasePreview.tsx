import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, mono, monoCaps, serif } from "../theme";

// Scene: real case preview — "Gears in the Pyramid", Case 001.
// Shows the actual case-file layout from the book.
export const CasePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: { damping: 200 } });

  // Slow upward pan on the case image (parallax feel)
  const panY = interpolate(frame, [0, 150], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelS = spring({ frame: frame - 30, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        overflow: "hidden",
      }}
    >
      {/* Case file image — pans slowly upward */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          transform: `translateY(${panY}px)`,
          opacity: fadeIn,
        }}
      >
        <Img
          src={staticFile("case-preview.png")}
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </div>

      {/* Red gradient fade at bottom to blend into next scene */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 320,
          background: `linear-gradient(to bottom, transparent, ${COLORS.paper})`,
          pointerEvents: "none",
        }}
      />

      {/* "Case 001 of 80" badge at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          transform: `translateY(${interpolate(labelS, [0, 1], [20, 0])}px)`,
          opacity: labelS,
        }}
      >
        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.28em",
            color: COLORS.red,
          }}
        >
          Case 001 of 80
        </div>
        <div
          style={{
            fontFamily: serif,
            fontSize: 32,
            color: COLORS.ink,
            fontStyle: "italic",
          }}
        >
          From easy warm-ups to genuine head-scratchers.
        </div>
      </div>
    </AbsoluteFill>
  );
};
