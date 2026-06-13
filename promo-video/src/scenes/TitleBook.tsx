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
import { COLORS, mono, serif } from "../theme";
import { Kicker } from "../components/ui";

// Scene 2 · 0:04–0:09 — first reveal: the real Timeline book cover slides in.
export const TitleBook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = spring({ frame, fps, config: { damping: 200 } });
  const bookX = interpolate(slide, [0, 1], [-700, 0]);
  const bookRot = interpolate(slide, [0, 1], [-5, 0]);
  const bookS = interpolate(slide, [0, 1], [0.95, 1]);

  const titleS = spring({ frame: frame - 70, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${COLORS.paper2} 0%, ${COLORS.paper} 60%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* The real cover */}
      <div
        style={{
          transform: `translateX(${bookX}px) rotate(${bookRot}deg) scale(${bookS})`,
          width: 420,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow:
            "0 40px 90px rgba(20,16,12,0.38), 0 8px 20px rgba(20,16,12,0.22), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <Img
          src={staticFile("cover-front.png")}
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* Supporting line below */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          textAlign: "center",
          maxWidth: 840,
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
          . Someone's been editing the past.
        </div>
      </div>
    </AbsoluteFill>
  );
};
