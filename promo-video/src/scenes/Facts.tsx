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

// Scene 3 · 0:09–0:15 — the spec stack. Big numbers count up; the five
// clearance levels build as a ladder. "Five clearance levels. Each harder."
export const Facts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const casesCount = Math.round(
    interpolate(frame, [10, 55], [0, 80], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const levels = ["I", "II", "III", "IV", "V"];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Kicker delay={4}>The Dossier</Kicker>

      {/* 80 cases */}
      <div style={{ display: "flex", alignItems: "baseline", marginTop: 28 }}>
        <div
          style={{
            fontFamily: serif,
            fontSize: 280,
            fontWeight: 700,
            color: COLORS.ink,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
          }}
        >
          {casesCount}
        </div>
        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            fontSize: 30,
            color: COLORS.dim,
            letterSpacing: "0.2em",
            marginLeft: 24,
          }}
        >
          unique
          <br />
          cases
        </div>
      </div>

      <div
        style={{
          fontFamily: serif,
          fontSize: 34,
          color: COLORS.ink2,
          marginTop: 8,
          marginBottom: 64,
          opacity: interpolate(frame, [40, 56], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        One provable answer each.
      </div>

      {/* Five clearance levels — a rising ladder */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 18,
          height: 220,
        }}
      >
        {levels.map((lvl, i) => {
          const delay = 60 + i * 9;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200 },
          });
          const h = 80 + i * 34;
          const isLast = i === levels.length - 1;
          return (
            <div
              key={lvl}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
                opacity: s,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: h * s,
                  background: isLast ? COLORS.red : COLORS.ink,
                  borderRadius: 4,
                  opacity: isLast ? 1 : 0.18 + i * 0.16,
                }}
              />
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 26,
                  fontWeight: 600,
                  color: isLast ? COLORS.red : COLORS.dim,
                }}
              >
                {lvl}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...monoCaps,
          fontFamily: mono,
          fontSize: 22,
          letterSpacing: "0.26em",
          color: COLORS.ink2,
          marginTop: 40,
          opacity: interpolate(frame, [110, 128], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Five clearance levels · each one harder
      </div>
    </AbsoluteFill>
  );
};
