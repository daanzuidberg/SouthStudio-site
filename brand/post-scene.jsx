// post-scene.jsx — SouthStudio "Coming Soon" animated post scene
// Depends on globals from animations.jsx (useTime, useTimeline, clamp, Easing, interpolate)

const C = {
  ink: '#1A1612',
  inkDeep: '#120F0C',
  paper: '#FAF7EF',
  red: '#D2362B',
  dim: '#6B6256',
  line2: '#C8BDA6',
};

// ── The logic-grid mark, rotated as ONE unit (never redrawn) ────────────────
// Canonical reading order: open · RED · open / open · open · INK / INK · open · open
function GridMark({ size, rotation, scale, opacity }) {
  const gap = size * 0.066;
  const border = Math.max(2, size * 0.018);
  const cellBase = {
    border: `${border}px solid ${C.paper}`,
    boxSizing: 'border-box',
  };
  const cells = [
    'open', 'red', 'open',
    'open', 'open', 'ink',
    'ink', 'open', 'open',
  ];
  return (
    <div style={{
      width: size, height: size,
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gridTemplateRows: 'repeat(3,1fr)',
      gap,
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center center',
      opacity,
      willChange: 'transform, opacity',
    }}>
      {cells.map((kind, i) => (
        <div key={i} style={{
          ...cellBase,
          background: kind === 'red' ? C.red : kind === 'ink' ? C.paper : 'transparent',
          borderColor: kind === 'red' ? C.red : C.paper,
        }} />
      ))}
    </div>
  );
}

// ── Animated ellipsis: three dots pulsing in sequence ───────────────────────
function ComingSoon({ baseOpacity }) {
  const time = useTime();
  const cycle = 1.6;
  const tp = (time % cycle) / cycle; // 0..1
  const dotOpacity = (i) => {
    // each dot lights in turn, staggered
    const phase = clamp((tp - i * 0.18) / 0.32, 0, 1);
    const fade = clamp((tp - 0.78) / 0.22, 0, 1); // all fade together near end
    return (0.25 + 0.75 * phase) * (1 - 0.85 * fade) + 0.15;
  };
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 600,
      fontSize: 34,
      letterSpacing: '0.42em',
      textTransform: 'uppercase',
      color: C.line2,
      opacity: baseOpacity,
      display: 'flex',
      alignItems: 'baseline',
      whiteSpace: 'pre',
    }}>
      <span>Coming Soon</span>
      <span style={{ display: 'inline-flex' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ opacity: dotOpacity(i), color: C.red }}>.</span>
        ))}
      </span>
    </div>
  );
}

function Scene() {
  const time = useTime();
  const { duration } = useTimeline();

  // ── Global exit fade for a seamless loop ──
  const exitStart = duration - 0.55;
  const groupOpacity = time > exitStart
    ? 1 - clamp((time - exitStart) / 0.55, 0, 1)
    : 1;

  // ── Grid spin-in: two full turns, settle upright ──
  const spinEnd = 1.55;
  const sp = clamp(time / spinEnd, 0, 1);
  const spe = Easing.easeOutCubic(sp);
  const rotation = -720 + 720 * spe;           // -720° → 0°
  const gridScale = 0.22 + 0.78 * spe;          // 0.22 → 1
  const gridOpacity = clamp(time / 0.4, 0, 1);

  // tiny idle breathing after settle (very subtle)
  const idle = time > spinEnd
    ? Math.sin((time - spinEnd) * 0.9) * 0.6
    : 0;

  // ── Wordmark fade-up ──
  const wmStart = 1.35;
  const wm = clamp((time - wmStart) / 0.55, 0, 1);
  const wmE = Easing.easeOutCubic(wm);
  const wmOpacity = wmE;
  const wmY = (1 - wmE) * 22;

  // ── Coming Soon fade-up ──
  const csStart = 1.95;
  const cs = clamp((time - csStart) / 0.55, 0, 1);
  const csE = Easing.easeOutCubic(cs);
  const csOpacity = csE;
  const csY = (1 - csE) * 18;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(120% 120% at 50% 38%, ${C.ink} 0%, ${C.inkDeep} 100%)`,
      opacity: groupOpacity,
    }}>
      {/* on-brand red corner brackets */}
      <Brackets />

      {/* center stack */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 300, marginBottom: 78,
        }}>
          <GridMark size={250} rotation={rotation + idle} scale={gridScale} opacity={gridOpacity} />
        </div>

        {/* Wordmark */}
        <div style={{
          transform: `translateY(${wmY}px)`,
          opacity: wmOpacity,
          fontFamily: "'Newsreader', Georgia, serif",
          fontWeight: 700,
          fontSize: 128,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: 40,
        }}>
          <span style={{ color: C.paper }}>South</span><span style={{ color: C.red }}>Studio</span>
        </div>

        {/* hairline */}
        <div style={{
          width: 64, height: 2, background: C.red,
          opacity: csOpacity * 0.9, marginBottom: 34,
          transform: `translateY(${csY}px)`,
        }} />

        {/* Coming Soon */}
        <div style={{ transform: `translateY(${csY}px)` }}>
          <ComingSoon baseOpacity={csOpacity} />
        </div>
      </div>

      {/* small catalog tic, bottom */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 64,
        textAlign: 'center',
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 500,
        fontSize: 19,
        letterSpacing: '0.34em',
        textTransform: 'uppercase',
        color: C.dim,
        opacity: csOpacity * 0.8,
      }}>
        Independent Studio · Est. 2026
      </div>
    </div>
  );
}

function Brackets() {
  const time = useTime();
  const o = clamp((time - 0.3) / 0.8, 0, 1) * 0.85;
  const m = 60;       // margin from edge
  const len = 54;     // bracket arm length
  const w = 3;
  const arm = (style) => (
    <div style={{ position: 'absolute', background: C.red, ...style }} />
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none' }}>
      {/* TL */}
      {arm({ left: m, top: m, width: len, height: w })}
      {arm({ left: m, top: m, width: w, height: len })}
      {/* TR */}
      {arm({ right: m, top: m, width: len, height: w })}
      {arm({ right: m, top: m, width: w, height: len })}
      {/* BL */}
      {arm({ left: m, bottom: m, width: len, height: w })}
      {arm({ left: m, bottom: m, width: w, height: len })}
      {/* BR */}
      {arm({ right: m, bottom: m, width: len, height: w })}
      {arm({ right: m, bottom: m, width: w, height: len })}
    </div>
  );
}

window.Scene = Scene;
