import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, mono, monoCaps, serif } from "../theme";

// Mono kicker label, e.g. "NO. 001 · TIME CORRECTION AGENCY".
export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ children, color = COLORS.red, size = 22, delay = 0 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        ...monoCaps,
        fontFamily: mono,
        color,
        fontSize: size,
        letterSpacing: "0.28em",
        opacity: o,
      }}
    >
      {children}
    </div>
  );
};

// A line of serif text that rises + fades in on a spring.
export const RiseLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  weight?: number;
  color?: string;
  lineHeight?: number;
  italic?: boolean;
}> = ({
  children,
  delay = 0,
  size = 64,
  weight = 600,
  color = COLORS.ink,
  lineHeight = 1.1,
  italic = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontFamily: serif,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing: "-0.015em",
        fontStyle: italic ? "italic" : "normal",
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        opacity: s,
      }}
    >
      {children}
    </div>
  );
};

// Thin hairline that draws itself horizontally.
export const DrawRule: React.FC<{
  delay?: number;
  width?: number;
  color?: string;
}> = ({ delay = 0, width = 480, color = COLORS.line2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        height: 1,
        width: width * s,
        background: color,
      }}
    />
  );
};
