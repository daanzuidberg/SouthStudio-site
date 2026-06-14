/* promo-shared.jsx — gedeelde visuele bouwstenen voor TIMELINE promo-content
   Volgt SouthStudio Brand Identity v2. Mark nooit hertekenen. */

const P = {
  paper:  '#FAF7EF',
  paper2: '#F1EBDD',
  ink:    '#1A1612',
  inkDeep:'#120F0C',
  ink2:   '#46413A',
  dim:    '#6B6256',
  line:   '#DDD4C2',
  line2:  '#C8BDA6',
  red:    '#D2362B',
  serif:  '"Newsreader", Georgia, serif',
  mono:   '"IBM Plex Mono", ui-monospace, monospace',
};

/* Het logic-grid merk — canonieke volgorde: open · ROOD · open / open · open · INKT / INKT · open · open */
function PGridMark({ size = 44, dark = false }) {
  const cells = ['o','r','o','o','o','k','k','o','o'];
  const gap = Math.max(2, size * 0.066);
  const bw = Math.max(1.6, size * 0.04);
  const base = dark ? P.paper : P.ink;
  return (
    <div style={{ width: size, height: size, display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)', gap }}>
      {cells.map((k, i) => (
        <div key={i} style={{ boxSizing: 'border-box',
          border: `${bw}px solid ${k === 'r' ? P.red : base}`,
          background: k === 'r' ? P.red : k === 'k' ? base : 'transparent' }} />
      ))}
    </div>
  );
}

function PWordmark({ size = 30, dark = false, kicker = null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.55 }}>
      <PGridMark size={size * 1.5} dark={dark} />
      <div>
        <div style={{ fontFamily: P.serif, fontSize: size, fontWeight: 700, letterSpacing: '-.02em',
          color: dark ? P.paper : P.ink, lineHeight: 1 }}>
          South<span style={{ color: P.red }}>Studio</span>
        </div>
        {kicker ? (
          <div style={{ fontFamily: P.mono, fontSize: Math.max(9, size * 0.34), fontWeight: 600,
            letterSpacing: '.26em', textTransform: 'uppercase', color: P.dim, marginTop: size * 0.2 }}>{kicker}</div>
        ) : null}
      </div>
    </div>
  );
}

/* Dun kader met rode hoek-ticks (linksboven + rechtsonder) */
function PFrame({ inset = 56, dark = false, tick = 18, tw = 3 }) {
  const lineColor = dark ? 'rgba(250,247,239,.2)' : P.line2;
  return (
    <div style={{ position: 'absolute', inset, border: `1px solid ${lineColor}`, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: -1, top: -1, width: tick, height: tick,
        borderLeft: `${tw}px solid ${P.red}`, borderTop: `${tw}px solid ${P.red}` }} />
      <div style={{ position: 'absolute', right: -1, bottom: -1, width: tick, height: tick,
        borderRight: `${tw}px solid ${P.red}`, borderBottom: `${tw}px solid ${P.red}` }} />
    </div>
  );
}

/* Subtiel rasterpatroon (zoals de boekomslag) */
function PGridBg({ size = 34, opacity = 0.5 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `linear-gradient(${P.line} 1px, transparent 1px), linear-gradient(90deg, ${P.line} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px` }} />
  );
}

/* Rode hoekbrackets voor donkere frames */
function PBrackets({ inset = 60, len = 54, w = 3, color = P.red, opacity = 0.85 }) {
  const m = inset;
  const arms = [
    { left: m, top: m, width: len, height: w }, { left: m, top: m, width: w, height: len },
    { right: m, top: m, width: len, height: w }, { right: m, top: m, width: w, height: len },
    { left: m, bottom: m, width: len, height: w }, { left: m, bottom: m, width: w, height: len },
    { right: m, bottom: m, width: len, height: w }, { right: m, bottom: m, width: w, height: len },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      {arms.map((st, i) => <div key={i} style={{ position: 'absolute', background: color, ...st }} />)}
    </div>
  );
}

/* ── Het boek als object: 2.5D axonometrische mockup (naar Timeline - Book Mockup 3D) ── */
const PBOOK_STRINGS = {
  nl: {
    kicker: 'TIJDCORRECTIE-AGENTSCHAP',
    stamp: 'VERTROUWELIJK',
    tagline: 'De geschiedenis is herschreven. Jij bent de correctie.',
    cases: '80 DEDUCTIEZAKEN · VIJF NIVEAUS',
    byline: 'SOUTHSTUDIO',
  },
  en: {
    kicker: 'TIME CORRECTION AGENCY',
    stamp: 'CLASSIFIED',
    tagline: 'History has been edited. You are the correction.',
    cases: '80 DEDUCTION CASES · FIVE CLEARANCES',
    byline: 'SOUTHSTUDIO',
  },
};

function PMiniBook({ lang = 'nl', scale = 1 }) {
  const s = PBOOK_STRINGS[lang];
  const dx = 34, dy = 20, W = 340, H = 480;
  return (
    <div style={{ width: (W + dx) * scale, height: (H + dy) * scale }}>
      <div style={{ width: W + dx, height: H + dy, position: 'relative',
        transform: `scale(${scale})`, transformOrigin: 'top left',
        filter: 'drop-shadow(0 34px 44px rgba(0,0,0,.40)) drop-shadow(0 8px 14px rgba(0,0,0,.22))' }}>

        {/* bovenste bladblok */}
        <div style={{ position: 'absolute', inset: 0, background: '#F2EBDC',
          clipPath: `polygon(0 ${dy}px, ${dx}px 0, 100% 0, calc(100% - ${dx}px) ${dy}px)`,
          backgroundImage: 'repeating-linear-gradient(116deg, transparent 0 2px, rgba(0,0,0,.05) 2px 3px)' }} />

        {/* snede rechts */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#E6DCC4,#F0E8D6)',
          clipPath: `polygon(calc(100% - ${dx}px) ${dy}px, 100% 0, 100% calc(100% - ${dy}px), calc(100% - ${dx}px) 100%)` }}>
          <div style={{ position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0,0,0,.055) 2px 3px)' }} />
        </div>

        {/* voorplat */}
        <div style={{ position: 'absolute', left: 0, top: dy, width: W, height: H,
          background: P.paper, overflow: 'hidden' }}>
          <PGridBg size={28} opacity={0.55} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(120deg, rgba(255,255,255,.4) 0%, transparent 32%, rgba(0,0,0,.05) 100%)' }} />
          <PFrame inset={20} tick={14} tw={2} />

          <div style={{ position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', zIndex: 2,
            fontFamily: P.mono, fontSize: 8, fontWeight: 600, letterSpacing: '.22em',
            textTransform: 'uppercase', color: P.dim }}>{s.kicker}</div>

          <div style={{ position: 'absolute', top: 48, right: 32, zIndex: 2,
            fontFamily: P.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: P.red, border: `2px solid ${P.red}`,
            padding: '3px 7px', transform: 'rotate(-7deg)', borderRadius: 2, opacity: 0.92 }}>{s.stamp}</div>

          <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center' }}>
            <PGridMark size={46} />
            <div style={{ fontFamily: P.serif, fontWeight: 800, fontSize: 54, letterSpacing: '-.04em',
              lineHeight: 0.84, color: P.ink, marginTop: 8 }}>
              <div>TIME</div>
              <div style={{ color: P.red }}>LINE</div>
            </div>
            <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 13.5, color: P.ink2,
              lineHeight: 1.45, maxWidth: '24ch' }}>{s.tagline}</div>
            <div style={{ width: 80, borderTop: `1.5px solid ${P.ink}`, position: 'relative', marginTop: 4 }}>
              <div style={{ position: 'absolute', left: '50%', top: -5, width: 8, height: 8,
                background: P.red, transform: 'translateX(-50%) rotate(45deg)' }} />
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 26, left: 0, right: 0, zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ fontFamily: P.mono, fontSize: 7.5, letterSpacing: '.2em',
              textTransform: 'uppercase', color: P.ink2 }}>{s.cases}</div>
            <div style={{ fontFamily: P.mono, fontSize: 9, fontWeight: 600, letterSpacing: '.34em',
              color: P.ink }}>{s.byline}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { P, PGridMark, PWordmark, PFrame, PGridBg, PBrackets, PMiniBook });
