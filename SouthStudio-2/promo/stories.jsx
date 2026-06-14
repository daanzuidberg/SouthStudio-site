/* stories.jsx — Instagram Stories / Reels-frames (1080×1920) + Open Graph (1200×630), NL + EN
   Vereist promo-shared.jsx + feed-posts.jsx (strings via window) */

const OG_STRINGS = {
  nl: {
    kicker: 'SOUTHSTUDIO — NO. 001 · BOEK + GRATIS ONLINE',
    tagline: 'De geschiedenis is herschreven. Jij bent de correctie.',
    url: 'SOUTHSTUDIO.NL · VERSCHIJNT Q3 2026',
  },
  en: {
    kicker: 'SOUTHSTUDIO — NO. 001 · BOOK + FREE ONLINE',
    tagline: 'History has been edited. You are the correction.',
    url: 'SOUTHSTUDIO.ONLINE · SHIPS Q3 2026',
  },
};

/* ── Story 1 · de zaak (1080×1920) — safe zones: ±250px boven, ±300px onder vrijgehouden ── */
function TeaserStory({ lang = 'nl' }) {
  const s = TEASER_STRINGS[lang];
  return (
    <div style={{ width: 1080, height: 1920, background: P.paper, position: 'relative',
      overflow: 'hidden', fontFamily: P.serif, color: P.ink }}>
      <PGridBg size={36} opacity={0.4} />
      <PFrame inset={44} tick={22} tw={3.5} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        padding: '252px 104px 300px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          borderBottom: `2.5px solid ${P.ink}`, paddingBottom: 22 }}>
          <div style={{ fontFamily: P.mono, fontSize: 20, fontWeight: 600, letterSpacing: '.18em',
            textTransform: 'uppercase', color: P.ink2 }}>{s.agency}</div>
          <div style={{ fontFamily: P.mono, fontSize: 20, fontWeight: 700, letterSpacing: '.14em',
            textTransform: 'uppercase', color: P.red }}>{s.dossier}</div>
        </div>

        <h1 style={{ fontSize: 84, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.0,
          margin: '52px 0 0' }}>{s.title}</h1>
        <p style={{ fontSize: 35, lineHeight: 1.45, color: P.ink2, margin: '28px 0 0',
          textWrap: 'pretty' }}>{s.setup}</p>

        <div style={{ marginTop: 46 }}>
          {s.statements.map(([who, quote], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 22,
              padding: '26px 0', borderTop: `1px solid ${P.line2}` }}>
              <div style={{ fontFamily: P.mono, fontSize: 26, fontWeight: 700, color: P.red,
                paddingTop: 4 }}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div style={{ fontFamily: P.mono, fontSize: 21, fontWeight: 600,
                  letterSpacing: '.14em', color: P.dim, marginBottom: 8 }}>{who}</div>
                <div style={{ fontSize: 40, fontStyle: 'italic', color: P.ink }}>{quote}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, background: P.paper2, border: `1px solid ${P.line}`,
          borderLeft: `5px solid ${P.red}`, padding: '26px 32px', fontFamily: P.mono,
          fontSize: 26, fontWeight: 600, letterSpacing: '.05em', color: P.ink }}>{s.constraint}</div>

        <div style={{ fontSize: 62, fontWeight: 700, letterSpacing: '-.015em',
          marginTop: 44 }}>{s.q}</div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 22 }}>
          <PWordmark size={28} kicker={s.studioKicker} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: P.mono, fontSize: 24, fontWeight: 700, letterSpacing: '.2em',
              textTransform: 'uppercase', color: P.red }}>{s.storyCta}</div>
            <div style={{ fontFamily: P.mono, fontSize: 18, letterSpacing: '.16em',
              textTransform: 'uppercase', color: P.dim }}>{s.storyCta2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Story 2 · pre-order (1080×1920) ── */
function PreorderStory({ lang = 'nl' }) {
  const s = PREORDER_STRINGS[lang];
  return (
    <div style={{ width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: `radial-gradient(120% 120% at 50% 36%, ${P.ink} 0%, ${P.inkDeep} 100%)`,
      color: P.paper, fontFamily: P.serif }}>
      <PBrackets inset={56} len={52} w={3} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '268px 100px 312px', textAlign: 'center' }}>
        <div style={{ fontFamily: P.mono, fontSize: 23, fontWeight: 600, letterSpacing: '.3em',
          textTransform: 'uppercase', color: P.red }}>{s.kicker}</div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <PMiniBook lang={lang} scale={1.42} />
        </div>

        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.22,
          maxWidth: '22ch', textWrap: 'balance' }}>{s.headline}</div>
        <div style={{ fontFamily: P.mono, fontSize: 21, letterSpacing: '.12em',
          textTransform: 'uppercase', color: P.line2, marginTop: 26 }}>{s.meta}</div>

        <div style={{ marginTop: 44, border: `2px solid ${P.paper}`, padding: '26px 52px',
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ fontFamily: P.mono, fontSize: 25, fontWeight: 700, letterSpacing: '.18em',
            textTransform: 'uppercase', color: P.paper }}>{s.storyCta}</div>
          <div style={{ fontFamily: P.mono, fontSize: 17, letterSpacing: '.16em',
            textTransform: 'uppercase', color: P.line2 }}>{s.storyCta2}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Open Graph / share-afbeelding (1200×630) ── */
function OGImage({ lang = 'nl' }) {
  const s = OG_STRINGS[lang];
  return (
    <div style={{ width: 1200, height: 630, background: P.paper, position: 'relative',
      overflow: 'hidden', fontFamily: P.serif, color: P.ink, display: 'flex' }}>
      <PGridBg size={32} opacity={0.4} />
      <PFrame inset={28} tick={16} tw={3} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 30px 0 96px', position: 'relative' }}>
        <div style={{ fontFamily: P.mono, fontSize: 17, fontWeight: 600, letterSpacing: '.2em',
          textTransform: 'uppercase', color: P.red }}>{s.kicker}</div>
        <div style={{ fontSize: 116, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 0.95,
          margin: '20px 0 24px' }}>TIME<span style={{ color: P.red }}>LINE</span></div>
        <div style={{ fontStyle: 'italic', fontSize: 30, lineHeight: 1.4, color: P.ink2,
          maxWidth: '26ch' }}>{s.tagline}</div>
        <div style={{ fontFamily: P.mono, fontSize: 18, letterSpacing: '.14em',
          textTransform: 'uppercase', color: P.dim, marginTop: 34 }}>{s.url}</div>
      </div>

      <div style={{ width: 420, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', paddingRight: 36 }}>
        <PMiniBook lang={lang} scale={0.92} />
      </div>
    </div>
  );
}

Object.assign(window, { TeaserStory, PreorderStory, OGImage, OG_STRINGS });
