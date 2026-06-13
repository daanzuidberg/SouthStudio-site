import React from "react";
import { Composition } from "remotion";
import { TimelinePromo, PROMO_DURATION } from "./TimelinePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* TikTok / Reels / Shorts — 9:16 vertical, per the production brief */}
      <Composition
        id="TimelinePromo"
        component={TimelinePromo}
        durationInFrames={PROMO_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Square cut for feed posts */}
      <Composition
        id="TimelineSquare"
        component={TimelinePromo}
        durationInFrames={PROMO_DURATION}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
