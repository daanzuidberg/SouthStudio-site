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

// Scene 1 · 0:00–0:04 — "What if history was being rewritten,
// and it was your job to fix it?" A red CLASSIFIED stamp crashes down.
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp slams at ~frame 30, with a tiny overshoot + recoil.
  const slam = spring({
    frame: frame - 28,
    fps,
    config: { damping: 9, mass: 0.6, stiffness: 180 },
  });
  const stampScale = interpolate(slam, [0, 1], [2.6, 1]);
  const stampOpacity = interpolate(frame, [22, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Impact shake.
  const shake =
    frame > 30 && frame < 42 ? Math.sin(frame * 4) * (42 - frame) * 0.6 : 0;

  const line1 = interpolate(frame, [48, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2 = interpolate(frame, [66, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ink,
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shake}px, ${shake * 0.4}px)`,
      }}
    >
      <Kicker color={COLORS.dim} delay={6}>
        Time Correction Agency
      </Kicker>

      {/* The stamp */}
      <div
        style={{
          marginTop: 60,
          marginBottom: 60,
          opacity: stampOpacity,
          transform: `scale(${stampScale}) rotate(-8deg)`,
        }}
      >
        <div
          style={{
            border: `6px solid ${COLORS.red}`,
            color: COLORS.red,
            padding: "22px 44px",
            borderRadius: 8,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 84,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            // slightly "inked" / imperfect
            boxShadow: "inset 0 0 0 2px rgba(210,54,43,0.25)",
            filter: "saturate(1.1)",
          }}
        >
          Classified
        </div>
      </div>

      {/* Hook line */}
      <div
        style={{
          maxWidth: 880,
          textAlign: "center",
          fontFamily: serif,
          color: COLORS.paper,
          fontSize: 60,
          lineHeight: 1.18,
          fontWeight: 500,
          padding: "0 40px",
        }}
      >
        <div style={{ opacity: line1 }}>What if history was being rewritten</div>
        <div style={{ opacity: line2 }}>
          — and it was{" "}
          <span style={{ color: COLORS.red, fontStyle: "italic" }}>your job</span>{" "}
          to fix it?
        </div>
      </div>

      <div
        style={{
          ...monoCaps,
          fontFamily: mono,
          color: COLORS.dim,
          fontSize: 18,
          letterSpacing: "0.34em",
          marginTop: 70,
          opacity: interpolate(frame, [90, 105], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Case File · No. 001
      </div>
    </AbsoluteFill>
  );
};
