import React from "react";
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, mono } from "./theme";
import { fontVars } from "./fonts";
import { Hook } from "./scenes/Hook";
import { TitleBook } from "./scenes/TitleBook";
import { Facts } from "./scenes/Facts";
import { Method } from "./scenes/Method";
import { CorrectionStamp } from "./scenes/CorrectionStamp";
import { EndCard } from "./scenes/EndCard";
import { DustMotes, Grain, LampVignette } from "./components/Atmosphere";

// Scene durations (at 30fps) → ~35s total.
export const SCENES = [
  { C: Hook, frames: 120 },
  { C: TitleBook, frames: 150 },
  { C: Facts, frames: 180 },
  { C: Method, frames: 270 },
  { C: CorrectionStamp, frames: 90 },
  { C: EndCard, frames: 240 },
];

export const PROMO_DURATION = SCENES.reduce((a, s) => a + s.frames, 0); // 1050

// Running timecode in the corner — the "found archive footage" tic.
const Timecode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const total = Math.floor(frame / fps);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  const ff = String(frame % fps).padStart(2, "0");
  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 46,
        right: 52,
        fontFamily: mono,
        fontSize: 22,
        letterSpacing: "0.14em",
        color: COLORS.dim,
        display: "flex",
        alignItems: "center",
        gap: 12,
        mixBlendMode: "difference",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: COLORS.red,
          opacity: blink ? 1 : 0.25,
        }}
      />
      REC {mm}:{ss}:{ff}
      <span style={{ opacity: 0.5 }}>
        /{Math.floor(durationInFrames / fps)}s
      </span>
    </div>
  );
};

// Thin progress bar along the bottom.
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 5,
        width: `${(frame / durationInFrames) * 100}%`,
        background: COLORS.red,
        opacity: 0.85,
      }}
    />
  );
};

export const TimelinePromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ ...fontVars, background: COLORS.ink }}>
      <Series>
        {SCENES.map(({ C, frames }, i) => (
          <Series.Sequence key={i} durationInFrames={frames}>
            <C />
          </Series.Sequence>
        ))}
      </Series>

      {/* Atmosphere + dossier overlays sit above every scene */}
      <DustMotes count={26} />
      <LampVignette intensity={0.8} />
      <Grain opacity={0.045} />
      <Timecode />
      <Progress />
    </AbsoluteFill>
  );
};
