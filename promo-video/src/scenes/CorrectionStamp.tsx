import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, mono, monoCaps } from "../theme";

// Scene 5 · 0:24–0:27 — payoff. A stamp comes down on the completed
// document: "CORRECTION FILED." Mirrors the hook, closes the loop.
export const CorrectionStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slam = spring({
    frame: frame - 14,
    fps,
    config: { damping: 10, mass: 0.7, stiffness: 200 },
  });
  const scale = interpolate(slam, [0, 1], [2.2, 1]);
  const opacity = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = frame > 16 && frame < 28 ? Math.sin(frame * 4) * (28 - frame) * 0.5 : 0;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shake}px, ${shake * 0.4}px)`,
      }}
    >
      {/* a faint "document" behind the stamp */}
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 820,
          background: COLORS.paper2,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 4,
          boxShadow: "0 30px 60px rgba(20,16,12,0.12)",
        }}
      >
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              background: COLORS.line,
              margin: "44px 56px",
              opacity: 0.6,
              width: i % 3 === 2 ? "40%" : "auto",
            }}
          />
        ))}
      </div>

      <div
        style={{
          opacity,
          transform: `scale(${scale}) rotate(-7deg)`,
          border: `7px solid ${COLORS.red}`,
          color: COLORS.red,
          padding: "30px 50px",
          borderRadius: 10,
          textAlign: "center",
          boxShadow: "inset 0 0 0 2px rgba(210,54,43,0.25)",
          background: "rgba(250,247,239,0.4)",
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Correction
          <br />
          Filed
        </div>
        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.3em",
            marginTop: 16,
            opacity: 0.8,
          }}
        >
          TCA · Case Closed
        </div>
      </div>
    </AbsoluteFill>
  );
};
