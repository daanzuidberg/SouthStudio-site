import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

// Warm desk-lamp pool + subtle grain. Gives the "found footage from a
// government archive" feel the brief asks for, without any real footage.
export const LampVignette: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 28%, rgba(255,226,170,${
        0.16 * intensity
      }) 0%, rgba(255,226,170,0) 45%), radial-gradient(140% 120% at 50% 60%, rgba(0,0,0,0) 40%, rgba(20,16,12,${
        0.20 * intensity
      }) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Drifting dust motes that catch the light.
export const DustMotes: React.FC<{ count?: number; color?: string }> = ({
  count = 28,
  color = "#FFE9C2",
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const seedX = random(`x${i}`);
        const seedY = random(`y${i}`);
        const speed = 0.15 + random(`s${i}`) * 0.5;
        const size = 1.5 + random(`sz${i}`) * 4;
        const drift = Math.sin((frame + i * 30) / (40 + random(`d${i}`) * 60)) * 30;
        const y = (seedY * 1920 - frame * speed * 4) % 1920;
        const op = 0.10 + random(`o${i}`) * 0.35;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: seedX * 1080 + drift,
              top: y < 0 ? y + 1920 : y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: op,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Faint paper grain overlay.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  const shift = (frame % 6) * 13;
  return (
    <AbsoluteFill
      style={{
        opacity,
        pointerEvents: "none",
        mixBlendMode: "multiply",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundPosition: `${shift}px ${shift}px`,
        color: COLORS.ink,
      }}
    />
  );
};
