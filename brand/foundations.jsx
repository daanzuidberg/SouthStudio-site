/* SouthStudio — Brand Foundations (north-star one-pager) */
const F = {
  paper:  '#FAF7EF',
  paper2: '#F1EBDD',
  ink:    '#1A1612',
  ink2:   '#46413A',
  dim:    '#6B6256',
  line:   '#DDD4C2',
  line2:  '#C8BDA6',
  red:    '#D2362B',
  serif:  '"Newsreader", Georgia, serif',
  mono:   '"IBM Plex Mono", ui-monospace, monospace',
};

function FKicker({ children }) {
  return (
    <div style={{ fontFamily: F.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '.22em',
      textTransform: 'uppercase', color: F.red }}>{children}</div>
  );
}

// Section wrapper with a numbered rail on the left
function FSection({ no, title, children, last }) {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 26,
      padding: '34px 0', borderTop: `1px solid ${F.line}` }}>
      <div style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, letterSpacing: '.1em',
        color: F.dim, paddingTop: 4 }}>{no}</div>
      <div>
        <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 600, letterSpacing: '-.01em',
          color: F.ink, margin: '0 0 18px', lineHeight: 1.1 }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function FGridMark({ size = 44, cell, ...rest }) {
  const c = cell || size / 3;
  const map = [0,1,0, 0,0,2, 2,0,0]; // 0 outline · 1 red · 2 ink
  return (
    <svg width={size} height={size} viewBox="0 0 132 132" {...rest}>
      {map.map((v, i) => {
        const x = (i % 3) * 44 + 2, y = Math.floor(i / 3) * 44 + 2;
        const fill = v === 1 ? F.red : v === 2 ? F.ink : 'none';
        const stroke = v === 1 ? F.red : F.ink;
        return <rect key={i} x={x} y={y} width={40} height={40} fill={fill} stroke={stroke} strokeWidth={4} />;
      })}
    </svg>
  );
}

function Foundations() {
  const body = { fontFamily: F.serif, fontSize: 15.5, lineHeight: 1.62, color: F.ink2, margin: 0 };
  return (
    <div style={{ width: 920, background: F.paper, color: F.ink, padding: '0 0 60px',
      fontFamily: F.serif, position: 'relative' }}>

      {/* ---- masthead ---- */}
      <header style={{ padding: '48px 60px 38px', borderBottom: `2px solid ${F.ink}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <FGridMark size={46} />
            <div>
              <div style={{ fontFamily: F.serif, fontSize: 27, fontWeight: 700, letterSpacing: '-.02em' }}>
                South<span style={{ color: F.red }}>Studio</span>
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 9, fontWeight: 600, letterSpacing: '.28em',
                textTransform: 'uppercase', color: F.dim, marginTop: 3 }}>Independent Studio</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.16em',
            textTransform: 'uppercase', color: F.dim, lineHeight: 1.8 }}>
            Brand Foundations<br />v1 · 2026<br />Internal north star
          </div>
        </div>
      </header>

      <div style={{ padding: '0 60px' }}>

        {/* ---- the line ---- */}
        <div style={{ padding: '56px 0 50px', textAlign: 'center' }}>
          <FKicker>The line</FKicker>
          <h1 style={{ fontFamily: F.serif, fontSize: 62, fontWeight: 700, letterSpacing: '-.03em',
            lineHeight: 1.0, margin: '20px 0 0', color: F.ink }}>
            Things worth<br /><span style={{ fontStyle: 'italic', fontWeight: 500 }}>thinking about.</span>
          </h1>
          <p style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase',
            color: F.dim, marginTop: 26 }}>The four words everything else answers to</p>
        </div>

        {/* 01 — Positioning */}
        <FSection no="01" title="What SouthStudio is">
          <p style={{ ...body, fontSize: 19, lineHeight: 1.55, color: F.ink }}>
            SouthStudio is an independent studio making <strong style={{ fontWeight: 600 }}>things worth
            thinking about</strong> — games, books, and objects. Each one is rigorous underneath,
            beautiful in the hand, and deeper than it first appears.
          </p>
          <p style={{ ...body, marginTop: 16 }}>
            We are not a puzzle press, an app shop, or a publisher. Those are formats. SouthStudio is
            the sensibility behind them — the quiet mark that tells you a thing was made with care,
            a point of view, and respect for the person on the other end.
          </p>
        </FSection>

        {/* 02 — The name */}
        <FSection no="02" title="Where the name comes from">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 30, alignItems: 'center' }}>
            <div>
              <p style={body}>
                <em>South</em> comes from <strong style={{ fontWeight: 600 }}>Zuidberg</strong> — the family
                name behind the studio. <em>Zuid</em>, south; <em>berg</em>, mountain. A direction and a
                horizon: the place you set out toward, the long way round rather than the quick win.
              </p>
              <p style={{ ...body, marginTop: 14 }}>
                It keeps the studio personal. Everything here is made by someone, not assembled by a
                committee — and that is the whole point.
              </p>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 12, lineHeight: 1.9, color: F.ink2,
              background: F.paper2, border: `1px solid ${F.line}`, borderRadius: 4, padding: '18px 20px' }}>
              <div style={{ color: F.dim, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 8 }}>Etymology</div>
              Zuid → South<br />berg → mountain<br /><span style={{ color: F.red }}>→ a direction, a climb</span>
            </div>
          </div>
        </FSection>

        {/* 03 — What we make / don't */}
        <FSection no="03" title="What we make, what we don't">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 600, letterSpacing: '.16em',
                textTransform: 'uppercase', color: F.ink, paddingBottom: 10, borderBottom: `1.5px solid ${F.ink}`, marginBottom: 14 }}>We make</div>
              {['Logic & deduction games', 'Beautiful printed books', 'Puzzles and objects to keep', 'Digital experiences built for the screen — not ported to it'].map((t,i) => (
                <div key={i} style={{ display: 'flex', gap: 11, padding: '9px 0', borderBottom: `1px solid ${F.line}`, alignItems: 'baseline' }}>
                  <span style={{ color: F.red, fontFamily: F.mono, fontSize: 12, fontWeight: 700 }}>✓</span>
                  <span style={{ ...body, fontSize: 14.5 }}>{t}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 600, letterSpacing: '.16em',
                textTransform: 'uppercase', color: F.dim, paddingBottom: 10, borderBottom: `1.5px solid ${F.line2}`, marginBottom: 14 }}>We don't</div>
              {['Throwaway apps that mine attention', 'Trivia that rewards memory over reasoning', 'Streaks, timers, nags, dark patterns', 'Things you use once and discard'].map((t,i) => (
                <div key={i} style={{ display: 'flex', gap: 11, padding: '9px 0', borderBottom: `1px solid ${F.line}`, alignItems: 'baseline' }}>
                  <span style={{ color: F.dim, fontFamily: F.mono, fontSize: 12, fontWeight: 700 }}>✕</span>
                  <span style={{ ...body, fontSize: 14.5, color: F.dim }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </FSection>

        {/* 04 — The standard */}
        <FSection no="04" title="The standard every product must meet">
          <p style={{ ...body, marginBottom: 22 }}>
            Before anything leaves the studio, it has to pass all five. If it fails one, it isn't ready —
            whatever the format.
          </p>
          {[
            ['Honest', 'There is always a fair path through. Nothing cheap, nothing arbitrary — the answer is earned.'],
            ['Beautiful', 'Typography, materials, and detail considered to the edge. Worth keeping on a shelf.'],
            ['Deeper than it looks', 'A world underneath, not just a mechanic. It rewards a second and third visit.'],
            ['Made to last', 'Physical or digital, it is built to be returned to — not consumed and forgotten.'],
            ['Respectful', 'Of your time, your attention, and your intelligence. We talk to a peer.'],
          ].map(([h, d], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 16, padding: '14px 0',
              borderTop: i ? `1px solid ${F.line}` : 'none' }}>
              <div style={{ fontFamily: F.mono, fontSize: 12, fontWeight: 700, color: F.red }}>{String(i+1).padStart(2,'0')}</div>
              <div>
                <div style={{ fontFamily: F.serif, fontSize: 18, fontWeight: 600, color: F.ink, marginBottom: 3 }}>{h}</div>
                <p style={{ ...body, fontSize: 14.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </FSection>

        {/* 05 — Voice */}
        <FSection no="05" title="How we sound">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
            {[
              ['Confident, not loud', 'We state things plainly. We don\'t shout, hype, or pad.'],
              ['Witty, never gimmicky', 'A dry turn of phrase, yes. A pun in a headline, no.'],
              ['Precise', 'We choose words the way we design grids — every one earns its place.'],
              ['Peer to peer', 'We never talk down to a beginner or up to an expert. Just across.'],
            ].map(([h,d],i) => (
              <div key={i} style={{ background: F.paper2, border: `1px solid ${F.line}`, borderRadius: 4, padding: '16px 18px' }}>
                <div style={{ fontFamily: F.serif, fontSize: 16, fontWeight: 600, color: F.ink, marginBottom: 5 }}>{h}</div>
                <p style={{ ...body, fontSize: 13.5, lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '16px 20px', borderLeft: `2px solid ${F.red}`, background: F.paper2 }}>
            <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: F.dim, marginBottom: 6 }}>House style</div>
            <p style={{ ...body, fontSize: 14 }}>
              We write "things worth thinking about," never "premium brain-training." We say what a thing
              <em> is</em> and trust the reader to want it. The TIMELINE dispatch voice — wry, in-world, exact — is the reference.
            </p>
          </div>
        </FSection>

        {/* 06 — The mark & system */}
        <FSection no="06" title="The mark & the system">
          <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 30, alignItems: 'start' }}>
            <div style={{ textAlign: 'center', background: F.paper2, border: `1px solid ${F.line}`, borderRadius: 4, padding: '24px 0 18px' }}>
              <FGridMark size={84} />
              <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: F.dim, marginTop: 14, lineHeight: 1.6 }}>
                The grid mark<br /><span style={{ color: F.ink2 }}>the mechanic as identity</span>
              </div>
            </div>
            <div>
              <p style={{ ...body, marginBottom: 18 }}>
                The mark is a logic grid — one red cell, one black, the rest open. It is literally the thing
                we make. Use it as the studio signature on everything, small and quiet. Never redraw it.
              </p>
              {/* palette */}
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: F.dim, marginBottom: 9 }}>Palette</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                {[['Ink','#1A1612'],['Red','#D2362B'],['Paper','#FAF7EF'],['Paper 2','#F1EBDD'],['Line','#C8BDA6']].map(([n,c],i)=>(
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: 46, borderRadius: 4, background: c, border: `1px solid ${F.line2}` }} />
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: F.ink2, marginTop: 6 }}>{n}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 8, color: F.dim }}>{c}</div>
                  </div>
                ))}
              </div>
              {/* type */}
              <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: F.dim, marginBottom: 9 }}>Typeface</div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1, background: F.paper2, border: `1px solid ${F.line}`, borderRadius: 4, padding: '14px 16px' }}>
                  <div style={{ fontFamily: F.serif, fontSize: 30, fontWeight: 600, color: F.ink, lineHeight: 1 }}>Newsreader</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: F.dim, marginTop: 8 }}>Serif · headlines & body</div>
                </div>
                <div style={{ flex: 1, background: F.paper2, border: `1px solid ${F.line}`, borderRadius: 4, padding: '14px 16px' }}>
                  <div style={{ fontFamily: F.mono, fontSize: 22, fontWeight: 500, color: F.ink, lineHeight: 1.2 }}>IBM Plex Mono</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: F.dim, marginTop: 9 }}>Mono · labels & system</div>
                </div>
              </div>
              <p style={{ ...body, fontSize: 12.5, color: F.dim, marginTop: 14 }}>
                Note: the website currently mixes in Spectral. Recommend consolidating on Newsreader across
                studio + products so everything reads as one hand.
              </p>
            </div>
          </div>
        </FSection>

        {/* 07 — The catalog */}
        <FSection no="07" title="The catalog">
          <p style={{ ...body, marginBottom: 20 }}>
            Every release gets a number. Like a record label or a film collection, the catalog tells the
            story of a studio with a trajectory — not a one-off. The number is small, permanent, and proud.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            {[['No. 001','Timeline','Released','live'],['No. 002','In the works','—','soon'],['No. 003','?','—','soon']].map(([n,t,s,st],i)=>(
              <div key={i} style={{ flex: 1, background: st==='live'?F.ink:F.paper2, color: st==='live'?F.paper:F.ink,
                border: `1px solid ${st==='live'?F.ink:F.line}`, borderRadius: 4, padding: '18px 18px 16px' }}>
                <div style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: st==='live'?'#cfc6b5':F.dim }}>{n}</div>
                <div style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 600, margin: '8px 0 14px', fontStyle: t==='?'?'italic':'normal', color: st==='live'?F.paper:(t==='?'||t==='In the works'?F.dim:F.ink) }}>{t}</div>
                <div style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: st==='live'?F.red:F.dim }}>{s}</div>
              </div>
            ))}
          </div>
        </FSection>

        {/* footer */}
        <div style={{ borderTop: `2px solid ${F.ink}`, marginTop: 8, paddingTop: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: F.serif, fontStyle: 'italic', fontSize: 16, color: F.ink2 }}>
            Made by someone. For the long way round.
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: F.dim }}>
            © 2026 SouthStudio
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Foundations, FGridMark });
