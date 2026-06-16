// SouthStudio — Video No. 001 scene components
// "Why has silence become uncomfortable?" — kinetic typography essay
// Brand-native: warm paper, ink, one red accent, Newsreader serif + IBM Plex Mono.
// Loaded as text/babel; depends on animations.jsx (Stage, Sprite, useTime, Easing, clamp, interpolate).

const VPAPER = 'var(--paper)';
const VINK   = 'var(--ink)';
const VINK2  = 'var(--ink-2)';
const VSOFT  = 'var(--ink-soft)';
const VRED   = 'var(--red)';
const VLINE  = 'var(--line-2)';
const SERIF  = 'var(--font-serif)';
const MONO   = 'var(--font-mono)';

const STAGE_W = 1920;
const STAGE_H = 1080;

// ── Faint grid texture, always present on paper ──
function GridField({ opacity = 0.45 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      backgroundPosition: 'center',
      opacity,
      pointerEvents: 'none',
    }} />
  );
}

// ── The grid mark (3×3 logic grid). reveal 0..1 staggers cell entry. ──
function GridMark({ size = 120, reveal = 1, dark = false }) {
  const cells = [0, 1, 0, 0, 0, 2, 2, 0, 0]; // 0 outline, 1 red, 2 ink
  const inkC = dark ? VPAPER : VINK;
  const cell = (size - 2 * 4) / 3;
  // reveal order: spiral-ish but simple row order is fine
  const order = [4, 1, 5, 7, 3, 0, 2, 6, 8];
  const revealedCount = Math.round(clamp(reveal, 0, 1) * 9);
  const rank = (i) => order.indexOf(i);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(3, ${cell}px)`,
      gridTemplateRows: `repeat(3, ${cell}px)`,
      gap: 4,
    }}>
      {cells.map((v, i) => {
        const on = rank(i) < revealedCount;
        const isRed = v === 1, isInk = v === 2;
        return (
          <span key={i} style={{
            background: isRed ? VRED : isInk ? inkC : 'transparent',
            border: isRed ? `2px solid ${VRED}` : `2px solid ${inkC}`,
            transform: on ? 'scale(1)' : 'scale(0.2)',
            opacity: on ? 1 : 0,
            transition: 'transform .35s cubic-bezier(.2,.7,.2,1), opacity .3s ease',
            display: 'block',
          }} />
        );
      })}
    </div>
  );
}

// ── Beat: timed, full-width centered text block with fade+rise enter/exit + slow drift ──
function Beat({
  start, end,
  fin = 0.7, fout = 0.55,
  top = 0,
  align = 'center',
  pad = 280,
  rise = 22,
  drift = 8,            // slow continuous upward drift during hold
  children,
  z = 5,
}) {
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;
  const exitStart = dur - fout;

  let opacity = 1, ty = 0;
  if (lt < fin) {
    const e = Easing.easeOutCubic(clamp(lt / fin, 0, 1));
    opacity = e; ty = (1 - e) * rise;
  } else if (lt > exitStart) {
    const e = Easing.easeInCubic(clamp((lt - exitStart) / fout, 0, 1));
    opacity = 1 - e; ty = -e * 10;
  } else {
    const hold = (lt - fin) / Math.max(0.001, exitStart - fin);
    ty = -drift * hold;
  }

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top,
      padding: `0 ${pad}px`,
      textAlign: align,
      opacity, transform: `translateY(${ty}px)`,
      willChange: 'transform, opacity',
      zIndex: z,
      boxSizing: 'border-box',
    }}>
      {children}
    </div>
  );
}

// ── Mono kicker line ──
function Kick({ children, color = VSOFT, size = 22, gap = '0.7em', dot = false, ls = '0.24em' }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: size, fontWeight: 600,
      letterSpacing: ls, textTransform: 'uppercase', color,
      display: 'inline-flex', alignItems: 'center', gap, justifyContent: 'center',
    }}>
      {dot && <span style={{ width: 9, height: 9, background: 'currentColor', display: 'inline-block' }} />}
      {children}
    </div>
  );
}

// ── Big serif quote line ──
function Quote({ children, size = 62, weight = 600, color = VINK, lh = 1.18, mt = 0, italic = false }) {
  return (
    <div style={{
      fontFamily: SERIF, fontSize: size, fontWeight: weight, lineHeight: lh,
      letterSpacing: '-0.02em', color, marginTop: mt,
      fontStyle: italic ? 'italic' : 'normal',
      textWrap: 'balance',
    }}>
      {children}
    </div>
  );
}

const Red = ({ children }) => <span style={{ color: VRED }}>{children}</span>;
const Em  = ({ children }) => <em style={{ fontStyle: 'italic', color: VINK }}>{children}</em>;

// ── Section header: huge faint roman numeral + mono title, with a growing rule ──
function SectionHeader({ start, end, roman, title }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;
  const introE = Easing.easeOutCubic(clamp(lt / 0.9, 0, 1));
  const exitE  = lt > dur - 0.5 ? Easing.easeInCubic(clamp((lt - (dur - 0.5)) / 0.5, 0, 1)) : 0;
  const opacity = introE * (1 - exitE);
  const ruleW = interpolate([0, 0.9], [0, 320])(clamp(lt / 1.0, 0, 1));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity, zIndex: 6,
    }}>
      <div style={{
        fontFamily: SERIF, fontWeight: 800, fontSize: 280, lineHeight: 0.8,
        color: VINK, opacity: 0.10, letterSpacing: '-0.04em',
        transform: `translateY(${(1 - introE) * 18}px)`,
        position: 'absolute',
      }}>{roman}</div>
      <div style={{ position: 'relative', textAlign: 'center', transform: `translateY(${(1 - introE) * 14}px)` }}>
        <Kick color={VRED} size={26} dot ls="0.28em">{title}</Kick>
        <div style={{ height: 3, background: VINK, width: ruleW, margin: '28px auto 0' }} />
      </div>
    </div>
  );
}

// ── Persistent broadcast frame: wordmark, section label, bottom timeline rail ──
function Frame({ start, end }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const fade = Math.min(
    Easing.easeOutCubic(clamp((t - start) / 1.2, 0, 1)),
    1 - Easing.easeInCubic(clamp((t - (end - 1.0)) / 1.0, 0, 1))
  );

  const sections = [
    [14, 50,  'I',   'The Question'],
    [50, 82,  'II',  'The Assumption'],
    [82, 128, 'III', 'The Unfolding'],
    [128, 165,'IV',  'The Turn'],
    [165, 192,'V',   'The Open Ending'],
  ];
  const cur = sections.find(s => t >= s[0] && t < s[1]) || sections[sections.length - 1];
  const railStart = 14, railEnd = 192;
  const railPct = clamp((t - railStart) / (railEnd - railStart), 0, 1) * 100;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade, zIndex: 8, pointerEvents: 'none' }}>
      {/* wordmark bottom-left */}
      <div style={{ position: 'absolute', left: 64, bottom: 58, display: 'flex', alignItems: 'center', gap: 13 }}>
        <GridMark size={30} />
        <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em', color: VINK }}>
          South<Red>Studio</Red>
        </span>
      </div>
      {/* section label bottom-right */}
      <div style={{ position: 'absolute', right: 64, bottom: 60, textAlign: 'right' }}>
        <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: VSOFT }}>
          <span style={{ color: VRED }}>{cur[2]}</span>&nbsp;·&nbsp;{cur[3]}
        </span>
      </div>
      {/* bottom timeline rail with diamond node */}
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 40, height: 2, background: VLINE }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${railPct}%`, background: VINK }} />
        <div style={{ position: 'absolute', left: `${railPct}%`, top: '50%', width: 11, height: 11, background: VRED, border: `2px solid ${VRED}`, transform: 'translate(-50%,-50%) rotate(45deg)' }} />
      </div>
    </div>
  );
}

// ── A held "[ pause ]" / silence marker that breathes ──
function PauseMark({ start, end, label = '[ silence ]', color = VSOFT }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;
  const o = Math.min(Easing.easeOutCubic(clamp(lt / 0.6, 0, 1)), 1 - Easing.easeInCubic(clamp((lt - (dur - 0.6)) / 0.6, 0, 1)));
  const breathe = 0.55 + 0.25 * (0.5 + 0.5 * Math.sin(lt * 1.6));
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 7 }}>
      <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: '0.3em', textTransform: 'uppercase', color, opacity: o * breathe }}>{label}</span>
    </div>
  );
}

// ── WordReveal — word-by-word staggered entrance, whole-block exit ──
function WordReveal({ start, end, words, size = 62, weight = 600, lh = 1.18, color = VINK, stagger = 0.13, fout = 0.5, top = 0, pad = 280, z = 5 }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;
  const exitE = lt > dur - fout ? Easing.easeInCubic(clamp((lt - (dur - fout)) / fout, 0, 1)) : 0;
  const items = typeof words === 'string'
    ? words.split(' ').map(w => ({ text: w }))
    : words;
  let idx = 0;
  const elements = items.map((item, i) => {
    if (item.br) return React.createElement('br', { key: i });
    const wi = idx++;
    const e = Easing.easeOutCubic(clamp((lt - wi * stagger) / 0.45, 0, 1));
    return (
      <span key={i} style={{
        display: 'inline-block',
        opacity: e,
        transform: `translateY(${(1 - e) * 16}px)`,
        marginRight: '0.25em',
        color: item.red ? VRED : item.soft ? VSOFT : item.italic ? VINK : (item.color || color),
        fontStyle: item.italic ? 'italic' : 'normal',
      }}>
        {item.text}
      </span>
    );
  });
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top,
      padding: `0 ${pad}px`,
      textAlign: 'center',
      opacity: 1 - exitE,
      transform: `translateY(${-exitE * 10}px)`,
      willChange: 'transform, opacity',
      zIndex: z,
      boxSizing: 'border-box',
      fontFamily: SERIF, fontSize: size, fontWeight: weight, lineHeight: lh,
      letterSpacing: '-0.02em', color,
    }}>
      {elements}
    </div>
  );
}

// ── RevealAt — reveals children at a specific absolute time ──
function RevealAt({ t: revealAt, children, dur = 0.65 }) {
  const t = useTime();
  const e = Easing.easeOutCubic(clamp((t - revealAt) / dur, 0, 1));
  return (
    <div style={{ opacity: e, transform: `translateY(${(1 - e) * 14}px)` }}>
      {children}
    </div>
  );
}

// ── SilenceOpening — atmospheric dark screen for the opening silence ──
function SilenceOpening({ start, end }) {
  const t = useTime();
  if (t < start || t > end) return null;
  const lt = t - start;
  const dur = end - start;
  const fadeIn  = Easing.easeOutCubic(clamp(lt / 0.5, 0, 1));
  const fadeOut = lt > dur - 0.8 ? Easing.easeInCubic(clamp((lt - (dur - 0.8)) / 0.8, 0, 1)) : 0;
  const masterO = fadeIn * (1 - fadeOut);
  const ringDefs = [0, 1.6, 3.2];
  const rings = ringDefs.map((offset, i) => {
    const rlt = lt - offset;
    if (rlt < 0) return null;
    const rp = clamp(rlt / 2.8, 0, 1);
    return { key: i, r: rp * 420, o: (1 - rp) * 0.28 * fadeIn };
  });
  const breathe = 0.48 + 0.32 * Math.sin(lt * 1.1 + Math.PI * 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0B09', opacity: masterO, zIndex: 9, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }} />
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1920} height={1080}>
        {rings.map(ring => ring && (
          <circle key={ring.key} cx={960} cy={540} r={ring.r} fill="none" stroke="rgba(250,247,239,0.9)" strokeWidth="0.8" opacity={ring.o} />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 18, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(250,247,239,0.55)', opacity: breathe }}>
          [ no sound ]
        </span>
      </div>
    </div>
  );
}

// ── ChapterWipe — quick black flash between chapters ──
function ChapterWipe({ at }) {
  const t = useTime();
  const lt = t - at;
  if (lt < -0.05 || lt > 1.3) return null;
  const fadeIn  = Easing.easeInCubic(clamp(lt / 0.28, 0, 1));
  const fadeOut = lt > 0.5 ? Easing.easeOutCubic(clamp((lt - 0.5) / 0.7, 0, 1)) : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0D0B09', opacity: fadeIn * (1 - fadeOut), zIndex: 10, pointerEvents: 'none' }} />
  );
}

Object.assign(window, { GridField, GridMark, Beat, Kick, Quote, Red, Em, SectionHeader, Frame, PauseMark, WordReveal, RevealAt, SilenceOpening, ChapterWipe, STAGE_W, STAGE_H, VPAPER, VINK, VINK2, VSOFT, VRED, VLINE, SERIF, MONO });
