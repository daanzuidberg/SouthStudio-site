import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../theme";

// The studio mark: a 3×3 logic grid — one red cell, one black, the rest open.
// Reading order: outline · RED · outline / outline · outline · INK / INK · outline · outline
// `progress` (0→1) reveals the cells in sequence; `solid` cells animate last.
const LAYOUT: ("open" | "red" | "ink")[] = [
  "open", "red", "open",
  "open", "open", "ink",
  "ink", "open", "open",
];

export const LogicGridMark: React.FC<{
  size: number;
  progress?: number; // 0..1 reveal
  stroke?: number;
}> = ({ size, progress = 1, stroke = 2 }) => {
  const gap = size * 0.08;
  const cell = (size - gap * 2) / 3;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: `repeat(3, ${cell}px)`,
        gridTemplateRows: `repeat(3, ${cell}px)`,
        gap,
      }}
    >
      {LAYOUT.map((kind, i) => {
        // Stagger each cell's appearance across the reveal window.
        const start = i / LAYOUT.length;
        const local = interpolate(progress, [start, start + 0.25], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fill =
          kind === "red" ? COLORS.red : kind === "ink" ? COLORS.ink : "transparent";
        return (
          <div
            key={i}
            style={{
              border: `${stroke}px solid ${COLORS.ink}`,
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
