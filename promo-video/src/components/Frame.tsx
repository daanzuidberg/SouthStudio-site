import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";

// Thin dossier frame with small red corner brackets — a core brand visual tic.
export const CornerBrackets: React.FC<{
  inset?: number;
  len?: number;
  color?: string;
  thickness?: number;
  opacity?: number;
}> = ({ inset = 48, len = 56, color = COLORS.red, thickness = 3, opacity = 1 }) => {
  const corner = (style: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: len,
    height: len,
    ...style,
  });
  const h = { position: "absolute" as const, height: thickness, width: len, background: color };
  const v = { position: "absolute" as const, width: thickness, height: len, background: color };
  return (
    <AbsoluteFill style={{ opacity }}>
      {/* top-left */}
      <div style={corner({ top: inset, left: inset })}>
        <div style={{ ...h, top: 0, left: 0 }} />
        <div style={{ ...v, top: 0, left: 0 }} />
      </div>
      {/* top-right */}
      <div style={corner({ top: inset, right: inset })}>
        <div style={{ ...h, top: 0, right: 0 }} />
        <div style={{ ...v, top: 0, right: 0 }} />
      </div>
      {/* bottom-left */}
      <div style={corner({ bottom: inset, left: inset })}>
        <div style={{ ...h, bottom: 0, left: 0 }} />
        <div style={{ ...v, bottom: 0, left: 0 }} />
      </div>
      {/* bottom-right */}
      <div style={corner({ bottom: inset, right: inset })}>
        <div style={{ ...h, bottom: 0, right: 0 }} />
        <div style={{ ...v, bottom: 0, right: 0 }} />
      </div>
    </AbsoluteFill>
  );
};
