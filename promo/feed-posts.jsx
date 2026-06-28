/* feed-posts.jsx — Instagram feed-posts (teaser-zaak 4:5 + pre-order 1:1), NL + EN
   Vereist promo-shared.jsx (P, PGridMark, PWordmark, PFrame, PGridBg, PBrackets, PMiniBook) */

const TEASER_STRINGS = {
  nl: {
    agency: 'TIJDCORRECTIE-AGENTSCHAP',
    dossier: 'DOSSIER №041',
    kicker: 'EEN ZAAK UIT HET ARCHIEF',
    title: 'De teruggedraaide klok',
    setup: 'Iemand in het archief heeft de stempelklok één uur teruggezet. Drie verklaringen liggen op tafel.',
    statements: [
      ['DE CONCIËRGE', '“Ik was het niet.”'],
      ['DE KLOKKENMAKER', '“Het was de conciërge.”'],
      ['DE ARCHIVARIS', '“Ik was het niet.”'],
    ],
    constraint: 'Precies één verklaring is waar.',
    q: 'Wie zette de klok terug?',
    studioKicker: 'Independent Studio',
    cta: 'SPEEL GRATIS ONLINE · SOUTHSTUDIO.NL',
    storyCta: 'SPEEL GRATIS ONLINE',
    storyCta2: 'LINK IN BIO · SOUTHSTUDIO.NL',
  },
  en: {
    agency: 'TIME CORRECTION AGENCY',
    dossier: 'CASE FILE №041',
    kicker: 'A CASE FROM THE ARCHIVE',
    title: 'The Clock Set Back',
    setup: 'Someone in the archive set the time clock back an hour. Three statements are on the table.',
    statements: [
      ['THE CARETAKER', '“It wasn’t me.”'],
      ['THE CLOCKMAKER', '“It was the caretaker.”'],
      ['THE ARCHIVIST', '“It wasn’t me.”'],
    ],
    constraint: 'Exactly one statement is true.',
    q: 'Who set the clock back?',
    studioKicker: 'Independent Studio',
    cta: 'PLAY FREE ONLINE · SOUTHSTUDIO.ONLINE',
    storyCta: 'PLAY FREE ONLINE',
    storyCta2: 'LINK IN BIO · SOUTHSTUDIO.ONLINE',
  },
};

const PREORDER_STRINGS = {
  nl: {
    kicker: 'NO. 001 · NU TE RESERVEREN',
    headline: '80 deductiezaken. Eén bewijsbaar antwoord per zaak.',
    meta: '€24 · VERSCHIJNT Q3 2026 · BETAAL PAS BIJ VERZENDING',
    cta: 'RESERVEER JE EXEMPLAAR — SOUTHSTUDIO.NL',
    storyCta: 'RESERVEER JE EXEMPLAAR',
    storyCta2: 'LINK IN BIO · SOUTHSTUDIO.NL',
  },
  en: {
    kicker: 'NO. 001 · PRE-ORDER OPEN',
    headline: '80 deduction cases. One provable answer each.',
    meta: '€24 · SHIPS Q3 2026 · NO CHARGE UNTIL IT SHIPS',
    cta: 'PRE-ORDER YOUR COPY — SOUTHSTUDIO.ONLINE',
    storyCta: 'PRE-ORDER YOUR COPY',
    storyCta2: 'LINK IN BIO · SOUTHSTUDIO.ONLINE',
  },
};

/* ── Teaser-zaak · feed 4:5 (1080×1350) ── */
function TeaserPost({ lang = 'nl' }) {
  const s = TEASER_STRINGS[lang];
  return (
    <div style={{ width: 1080, height: 1350, background: P.paper, position: 'relative',
      overflow: 'hidden', fontFamily: P.serif, color: P.ink }}>
      <PGridBg size={36} opacity={0.4} />
      <PFrame inset={48} tick={22} tw={3.5} />

      <div style={{ position: 'absolute', inset: 48, display: 'flex', flexDirection: 'column',
        padding: '62px 76px 56px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          borderBottom: `2.5px solid ${P.ink}`, paddingBottom: 24 }}>
          <div style={{ fontFamily: P.mono, fontSize: 21, fontWeight: 600, letterSpacing: '.2em',
            textTransform: 'uppercase', color: P.ink2 }}>{s.agency}</div>
          <div style={{ fontFamily: P.mono, fontSize: 21, fontWeight: 700, letterSpacing: '.16em',
            textTransform: 'uppercase', color: P.red }}>{s.dossier}</div>
        </div>

        <div style={{ marginTop: 50 }}>
          <div style={{ fontFamily: P.mono, fontSize: 19, fontWeight: 600, letterSpacing: '.24em',
            textTransform: 'uppercase', color: P.red, marginBottom: 18 }}>{s.kicker}</div>
          <h1 style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.02,
            margin: 0 }}>{s.title}</h1>
          <p style={{ fontSize: 31, lineHeight: 1.45, color: P.ink2, margin: '24px 0 0',
            textWrap: 'pretty' }}>{s.setup}</p>
        </div>

        <div style={{ marginTop: 40 }}>
          {s.statements.map(([who, quote], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 340px 1fr', gap: 18,
              alignItems: 'baseline', padding: '22px 0', borderTop: `1px solid ${P.line2}` }}>
              <div style={{ fontFamily: P.mono, fontSize: 24, fontWeight: 700, color: P.red }}>
                {String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily: P.mono, fontSize: 20, fontWeight: 600, letterSpacing: '.12em',
                color: P.ink2 }}>{who}</div>
              <div style={{ fontSize: 33, fontStyle: 'italic', color: P.ink }}>{quote}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, background: P.paper2, border: `1px solid ${P.line}`,
          borderLeft: `5px solid ${P.red}`, padding: '24px 30px', fontFamily: P.mono,
          fontSize: 24, fontWeight: 600, letterSpacing: '.05em', color: P.ink }}>{s.constraint}</div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-.015em' }}>{s.q}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 34, paddingTop: 26, borderTop: `2.5px solid ${P.ink}` }}>
            <PWordmark size={28} kicker={s.studioKicker} />
            <div style={{ fontFamily: P.mono, fontSize: 19, fontWeight: 600, letterSpacing: '.14em',
              textTransform: 'uppercase', color: P.ink2 }}>{s.cta}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pre-order · feed 1:1 (1080×1080) ── */
function PreorderPost({ lang = 'nl' }) {
  const s = PREORDER_STRINGS[lang];
  return (
    <div style={{ width: 1080, height: 1080, position: 'relative', overflow: 'hidden',
      background: `radial-gradient(120% 120% at 50% 36%, ${P.ink} 0%, ${P.inkDeep} 100%)`,
      color: P.paper, fontFamily: P.serif }}>
      <PBrackets inset={52} len={48} w={3} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '78px 90px 72px', textAlign: 'center' }}>
        <div style={{ fontFamily: P.mono, fontSize: 22, fontWeight: 600, letterSpacing: '.3em',
          textTransform: 'uppercase', color: P.red }}>{s.kicker}</div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <PMiniBook lang={lang} scale={1} />
        </div>

        <div style={{ fontSize: 41, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.22,
          maxWidth: '24ch', textWrap: 'balance' }}>{s.headline}</div>
        <div style={{ fontFamily: P.mono, fontSize: 20, letterSpacing: '.13em',
          textTransform: 'uppercase', color: P.line2, marginTop: 24 }}>{s.meta}</div>
        <div style={{ width: 64, height: 3, background: P.red, margin: '28px 0' }} />
        <div style={{ fontFamily: P.mono, fontSize: 23, fontWeight: 700, letterSpacing: '.16em',
          textTransform: 'uppercase', color: P.paper }}>{s.cta}</div>
      </div>
    </div>
  );
}

Object.assign(window, { TeaserPost, PreorderPost, TEASER_STRINGS, PREORDER_STRINGS });
