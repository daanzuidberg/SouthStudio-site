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

// Scene 4 · 0:15–0:24 — the core feeling. A deduction grid fills itself
// with X's and one correction, while the method lines build.
// "Rule out the impossible. Find the correction. No luck. No guessing."

const N = 4;
// Solution cell (row, col) gets the check; everything in its row/col gets X'd.
const SOL = { r: 1, c: 2 };

export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });

  // Order in which the X marks land.
  const marks: { r: number; c: number; at: number }[] = [];
  let t = 30;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (r === SOL.r && c === SOL.c) continue;
      if (r === SOL.r || c === SOL.c) {
        marks.push({ r, c, at: t });
        t += 7;
      }
    }
  }
  const checkAt = t + 14;

  const lines = [
    { text: "Cross-reference the records.", at: 18 },
    { text: "Rule out the impossible.", at: 70 },
    { text: "Find the correction.", at: 150 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        paddingTop: 150,
      }}
    >
      <Kicker delay={4}>Method · Pure deduction</Kicker>

      {/* The grid */}
      <div
        style={{
          marginTop: 56,
          transform: `scale(${interpolate(gridIn, [0, 1], [0.9, 1])})`,
          opacity: gridIn,
          display: "grid",
          gridTemplateColumns: `repeat(${N}, 132px)`,
          gridTemplateRows: `repeat(${N}, 132px)`,
          border: `2px solid ${COLORS.line2}`,
          background: COLORS.paper2,
        }}
      >
        {new Array(N * N).fill(0).map((_, idx) => {
          const r = Math.floor(idx / N);
          const c = idx % N;
          const isSol = r === SOL.r && c === SOL.c;
          const mark = marks.find((m) => m.r === r && m.c === c);
          const showX = mark ? frame >= mark.at : false;
          const xS = mark
            ? spring({ frame: frame - mark.at, fps, config: { damping: 14, stiffness: 200 } })
            : 0;
          const checkS = spring({
            frame: frame - checkAt,
            fps,
            config: { damping: 12, stiffness: 160 },
          });
          return (
            <div
              key={idx}
              style={{
                borderRight: `1px solid ${COLORS.line}`,
                borderBottom: `1px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  isSol && frame >= checkAt
                    ? "rgba(210,54,43,0.08)"
                    : "transparent",
                fontFamily: mono,
                position: "relative",
              }}
            >
              {showX && !isSol && (
                <span
                  style={{
                    fontSize: 64,
                    color: COLORS.dim,
                    opacity: 0.5 * xS,
                    transform: `scale(${xS})`,
                  }}
                >
                  ✕
                </span>
              )}
              {isSol && frame >= checkAt && (
                <span
                  style={{
                    fontSize: 76,
                    color: COLORS.red,
                    fontWeight: 700,
                    transform: `scale(${checkS})`,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Method lines, building under the grid */}
      <div
        style={{
          marginTop: 64,
          height: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {lines.map((l, i) => {
          const s = spring({
            frame: frame - l.at,
            fps,
            config: { damping: 200 },
          });
          const isLast = i === lines.length - 1;
          return (
            <div
              key={i}
              style={{
                fontFamily: serif,
                fontSize: isLast ? 64 : 48,
                fontWeight: isLast ? 700 : 500,
                color: isLast ? COLORS.red : COLORS.ink2,
                fontStyle: isLast ? "italic" : "normal",
                transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
                opacity: s,
              }}
            >
              {l.text}
            </div>
          );
        })}

        <div
          style={{
            ...monoCaps,
            fontFamily: mono,
            fontSize: 22,
            letterSpacing: "0.3em",
            color: COLORS.dim,
            marginTop: 18,
            opacity: interpolate(frame, [210, 230], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          No luck · No guessing
        </div>
      </div>
    </AbsoluteFill>
  );
};
