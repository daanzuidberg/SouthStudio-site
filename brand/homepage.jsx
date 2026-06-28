/* SouthStudio — evolved homepage concept (studio-first) */
const H = {
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

function HMark({ size = 30 }) {
  const map = [0,1,0, 0,0,2, 2,0,0];
  return (
    <svg width={size} height={size} viewBox="0 0 132 132">
      {map.map((v, i) => {
        const x = (i % 3) * 44 + 2, y = Math.floor(i / 3) * 44 + 2;
        const fill = v === 1 ? H.red : v === 2 ? H.ink : 'none';
        const stroke = v === 1 ? H.red : H.ink;
        return <rect key={i} x={x} y={y} width={40} height={40} fill={fill} stroke={stroke} strokeWidth={4} />;
      })}
    </svg>
  );
}

function HStripe({ h = 320, label }) {
  // placeholder image slot — diagonal hatch + mono caption
  return (
    <div style={{ height: h, borderRadius: 4, border: `1px solid ${H.line2}`,
      background: `repeating-linear-gradient(45deg, ${H.paper2} 0 9px, #E8DFCB 9px 11px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <span style={{ fontFamily: H.mono, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase',
        color: H.dim, background: H.paper, padding: '5px 11px', border: `1px solid ${H.line2}`, borderRadius: 3 }}>{label}</span>
    </div>
  );
}

function HomePage() {
  const W = 1380;
  return (
    <div style={{ width: W, background: H.paper, color: H.ink, fontFamily: H.serif }}>

      {/* ---- header ---- */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 56px', borderBottom: `1px solid ${H.line}` }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
          <HMark size={30} />
          <div style={{ fontFamily: H.serif, fontSize: 21, fontWeight: 700, letterSpacing: '-.02em' }}>
            South<span style={{ color: H.red }}>Studio</span>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 34, fontFamily: H.mono, fontSize: 12, letterSpacing: '.08em',
          textTransform: 'uppercase', color: H.ink2, alignItems: 'center' }}>
          <span>Catalog</span><span>The Studio</span><span>Play</span><span>Dispatch</span>
          <span style={{ border: `1px solid ${H.ink}`, padding: '8px 16px', borderRadius: 3, color: H.ink }}>Pre-order Timeline →</span>
          <span style={{ color: H.dim }}>NL</span>
        </nav>
      </header>

      {/* ---- hero ---- */}
      <section style={{ padding: '76px 56px 64px', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: H.mono, fontSize: 11.5, fontWeight: 600, letterSpacing: '.2em',
            textTransform: 'uppercase', color: H.dim, marginBottom: 22 }}>
            Independent studio · Est. 2026
          </div>
          <h1 style={{ fontFamily: H.serif, fontSize: 78, fontWeight: 700, letterSpacing: '-.035em',
            lineHeight: 0.98, margin: 0, color: H.ink }}>
            Things worth<br /><span style={{ fontStyle: 'italic', fontWeight: 500 }}>thinking about.</span>
          </h1>
          <p style={{ fontFamily: H.serif, fontSize: 19, lineHeight: 1.6, color: H.ink2, margin: '28px 0 0', maxWidth: 480 }}>
            SouthStudio makes games, books, and objects for people who like to use their minds.
            Rigorous underneath, beautiful in the hand, made to keep.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 34 }}>
            <span style={{ fontFamily: H.mono, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase',
              background: H.ink, color: H.paper, padding: '14px 26px', borderRadius: 3 }}>See the catalog</span>
            <span style={{ fontFamily: H.mono, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase',
              border: `1px solid ${H.line2}`, color: H.ink, padding: '14px 26px', borderRadius: 3 }}>Play Timeline →</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: -14, left: -14, fontFamily: H.mono, fontSize: 10.5,
            letterSpacing: '.16em', textTransform: 'uppercase', color: H.dim, zIndex: 2,
            background: H.paper, padding: '2px 8px' }}>No. 001 · Timeline</div>
          <HStripe h={430} label="Studio hero — Timeline, in the hand" />
        </div>
      </section>

      {/* ---- the catalog ---- */}
      <section style={{ padding: '20px 56px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          borderTop: `2px solid ${H.ink}`, paddingTop: 18, marginBottom: 30 }}>
          <h2 style={{ fontFamily: H.serif, fontSize: 34, fontWeight: 600, letterSpacing: '-.015em', margin: 0 }}>The Catalog</h2>
          <span style={{ fontFamily: H.mono, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: H.dim }}>A studio with a trajectory</span>
        </div>

        {/* No.001 — featured */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center',
          background: H.paper2, border: `1px solid ${H.line}`, borderRadius: 6, padding: 32, marginBottom: 22 }}>
          <HStripe h={300} label="Timeline — book + screen" />
          <div>
            <div style={{ fontFamily: H.mono, fontSize: 12, fontWeight: 600, letterSpacing: '.14em', color: H.red }}>NO. 001 · THE DEBUT</div>
            <h3 style={{ fontFamily: H.serif, fontSize: 46, fontWeight: 700, letterSpacing: '-.02em', margin: '12px 0 0', lineHeight: 1 }}>Timeline</h3>
            <p style={{ fontFamily: H.serif, fontSize: 17, lineHeight: 1.58, color: H.ink2, margin: '16px 0 0' }}>
              80 logic cases set inside the Time Correction Agency. History has been edited — you are
              the correction. A proper puzzle book, plus a free set to play online.
            </p>
            <div style={{ display: 'flex', gap: 26, margin: '22px 0 26px' }}>
              {[['80','Cases'],['5','Tiers'],['2','Ways to play']].map(([n,l],i)=>(
                <div key={i}>
                  <div style={{ fontFamily: H.serif, fontSize: 30, fontWeight: 700, color: H.ink }}>{n}</div>
                  <div style={{ fontFamily: H.mono, fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: H.dim, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontFamily: H.mono, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', background: H.ink, color: H.paper, padding: '12px 22px', borderRadius: 3 }}>Open the case file</span>
              <span style={{ fontFamily: H.mono, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', border: `1px solid ${H.line2}`, color: H.ink, padding: '12px 22px', borderRadius: 3 }}>Play online →</span>
            </div>
          </div>
        </div>

        {/* upcoming row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
          {[['No. 002','In the works','A new way to put your mind to work. Same studio, same standard — a different kind of thinking.'],
            ['No. 003','On the bench','Something physical. Beautiful to own, rigorous to solve. More when it\'s ready.']].map(([n,t,d],i)=>(
            <div key={i} style={{ border: `1px dashed ${H.line2}`, borderRadius: 6, padding: 26, background: H.paper }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: H.mono, fontSize: 12, fontWeight: 600, letterSpacing: '.12em', color: H.dim }}>{n}</span>
                <span style={{ fontFamily: H.mono, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: H.red, border: `1px solid ${H.red}`, padding: '3px 9px', borderRadius: 20 }}>Coming</span>
              </div>
              <h3 style={{ fontFamily: H.serif, fontSize: 26, fontWeight: 600, fontStyle: 'italic', color: H.ink2, margin: '0 0 10px' }}>{t}</h3>
              <p style={{ fontFamily: H.serif, fontSize: 15, lineHeight: 1.55, color: H.dim, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- the standard ---- */}
      <section style={{ padding: '8px 56px 72px' }}>
        <div style={{ background: H.ink, color: H.paper, borderRadius: 6, padding: '48px 50px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 50, alignItems: 'start' }}>
            <div>
              <div style={{ fontFamily: H.mono, fontSize: 11.5, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: H.red }}>The Studio</div>
              <h2 style={{ fontFamily: H.serif, fontSize: 40, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05, margin: '16px 0 18px' }}>
                We only make things<br />we'd want to keep.
              </h2>
              <p style={{ fontFamily: H.serif, fontSize: 16, lineHeight: 1.6, color: '#cfc6b5', margin: 0 }}>
                No throwaway apps, no attention-mining, no dark patterns. Every SouthStudio release has to
                earn its place on a shelf — and a second visit.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px 36px' }}>
              {[['Honest','Always a fair path through. Nothing cheap, nothing arbitrary.'],
                ['Beautiful','Typography, materials, and detail considered to the edge.'],
                ['Deeper than it looks','A world underneath, not just a mechanic.'],
                ['Made to last','Built to be returned to, not consumed and forgotten.']].map(([h,d],i)=>(
                <div key={i}>
                  <div style={{ fontFamily: H.mono, fontSize: 11, fontWeight: 700, color: H.red, marginBottom: 8 }}>{String(i+1).padStart(2,'0')}</div>
                  <div style={{ fontFamily: H.serif, fontSize: 19, fontWeight: 600, marginBottom: 5 }}>{h}</div>
                  <p style={{ fontFamily: H.serif, fontSize: 14.5, lineHeight: 1.5, color: '#b9af9d', margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- dispatch ---- */}
      <section style={{ padding: '8px 56px 76px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center',
          borderTop: `2px solid ${H.ink}`, paddingTop: 40 }}>
          <div>
            <div style={{ fontFamily: H.mono, fontSize: 11.5, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: H.dim }}>The Dispatch</div>
            <h2 style={{ fontFamily: H.serif, fontSize: 38, fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.05, margin: '14px 0 14px' }}>
              The next thing,<br />before anyone else.
            </h2>
            <p style={{ fontFamily: H.serif, fontSize: 16, lineHeight: 1.6, color: H.ink2, margin: 0, maxWidth: 420 }}>
              One short email when a new release drops or a fresh online case goes live. Nothing else.
            </p>
          </div>
          <div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, border: `1px solid ${H.line2}`, borderRadius: 3, padding: '15px 16px',
                fontFamily: H.mono, fontSize: 13, color: H.dim, background: H.paper }}>investigator@email.com</div>
              <span style={{ fontFamily: H.mono, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase',
                background: H.red, color: '#fff', padding: '15px 26px', borderRadius: 3 }}>Subscribe →</span>
            </div>
            <p style={{ fontFamily: H.mono, fontSize: 11, color: H.dim, margin: '12px 0 0' }}>// We send rarely. Unsubscribe in one click.</p>
          </div>
        </div>
      </section>

      {/* ---- footer ---- */}
      <footer style={{ background: H.paper2, borderTop: `1px solid ${H.line}`, padding: '40px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
          <HMark size={26} />
          <span style={{ fontFamily: H.serif, fontStyle: 'italic', fontSize: 16, color: H.ink2 }}>Things worth thinking about.</span>
        </div>
        <div style={{ fontFamily: H.mono, fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: H.dim }}>
          © 2026 SouthStudio · Independent studio
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { HomePage });
