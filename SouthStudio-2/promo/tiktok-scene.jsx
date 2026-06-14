/* tiktok-scene.jsx — TIMELINE · Zaak №074 "Het koerierslogboek" (1080×1920, 23 s)
   Vereist animations.jsx (useTime, clamp, Easing) + promo-shared.jsx (P, PGridMark, PBrackets) */

const TIKTEXT = {
  nl: {
    agency: 'TIJDCORRECTIE-AGENTSCHAP',
    file: 'ZAAK №074 · HET KOERIERSLOGBOEK',
    hook1: 'Eén van deze tijden',
    hook2: 'is vervalst.',
    setup: 'Koerier №7 logde vier afgiftes — in deze volgorde.',
    stops: [['NOORD', '09:10'], ['OOST', '09:40'], ['ZUID', '10:05'], ['WEST', '09:55']],
    rule: 'Tussen twee afgiftes zit minstens 20 minuten reistijd.',
    q: 'Welke tijd is vervalst?',
    forged: 'VERVALST',
    fix: '→ echte tijd: 10:25 of later',
    answer: 'WEST.',
    why: 'Was ZUID vals, dan moest er tussen 09:40 en 09:55 nog een stop passen — onmogelijk. De vervalsing is dus WEST.',
    no: 'NO. 001',
    cta1: '80 van zulke zaken. Eén boek.',
    cta2: 'RESERVEER JE EXEMPLAAR · SOUTHSTUDIO.NL',
    cta3: 'OF SPEEL GRATIS ONLINE',
  },
  en: {
    agency: 'TIME CORRECTION AGENCY',
    file: 'CASE №074 · THE COURIER LOG',
    hook1: 'One of these times',
    hook2: 'has been forged.',
    setup: 'Courier №7 logged four drop-offs — in this order.',
    stops: [['NORTH', '09:10'], ['EAST', '09:40'], ['SOUTH', '10:05'], ['WEST', '09:55']],
    rule: 'At least 20 minutes of travel between any two drop-offs.',
    q: 'Which time is forged?',
    forged: 'FORGED',
    fix: '→ real time: 10:25 or later',
    answer: 'WEST.',
    why: 'If SOUTH were forged, a stop would have to fit between 09:40 and 09:55 — impossible. So the forgery is WEST.',
    no: 'NO. 001',
    cta1: '80 cases like this. One book.',
    cta2: 'PRE-ORDER YOUR COPY · SOUTHSTUDIO.ONLINE',
    cta3: 'OR PLAY FREE ONLINE',
  },
};

function TikScene({ lang = 'nl' }) {
  const time = useTime();
  const s = TIKTEXT[lang];

  // eased segment helper: 0→1 over [start, start+dur]
  const sg = (start, dur, ease) => (ease || Easing.easeOutCubic)(clamp((time - start) / dur, 0, 1));
  const out = (start, dur) => 1 - Easing.easeInCubic(clamp((time - start) / dur, 0, 1));

  /* ── fase-vensters ── */
  const showIntro = time < 3.6;
  const introOut = out(3.05, 0.45);
  const showCard = time >= 3.3 && time < 18.3;
  const cardIn = sg(3.4, 0.8);
  const cardOut = out(17.7, 0.5);
  const showEnd = time >= 18.2;
  const endOut = out(22.4, 0.6);

  const reveal = time >= 13.4;
  const strikeP = sg(13.5, 0.45);
  const stampP = sg(13.95, 0.4);

  const mono = (fs, extra) => ({ fontFamily: P.mono, fontSize: fs, textTransform: 'uppercase', ...extra });

  return (
    <div style={{ position: 'absolute', inset: 0, color: P.paper,
      background: `radial-gradient(120% 120% at 50% 36%, ${P.ink} 0%, ${P.inkDeep} 100%)` }}>
      <PBrackets inset={70} len={58} w={4} opacity={0.8 * sg(0.2, 0.7)} />

      {/* ── 1 · intro / hook ── */}
      {showIntro && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          opacity: introOut, padding: '0 70px' }}>
          <div style={{ ...mono(24, { fontWeight: 600, letterSpacing: '.28em', color: P.line2, whiteSpace: 'nowrap' }),
            opacity: sg(0.35, 0.5) }}>{s.agency}</div>
          <div style={{ ...mono(26, { fontWeight: 700, letterSpacing: '.16em', color: P.red, whiteSpace: 'nowrap' }),
            marginTop: 26, opacity: sg(0.7, 0.5) }}>{s.file}</div>
          <div style={{ fontFamily: P.serif, fontSize: 88, fontWeight: 700, lineHeight: 1.08,
            letterSpacing: '-.02em', marginTop: 70 }}>
            <div style={{ opacity: sg(1.25, 0.6), transform: `translateY(${(1 - sg(1.25, 0.6)) * 36}px)` }}>{s.hook1}</div>
            <div style={{ fontStyle: 'italic', color: P.red, opacity: sg(1.65, 0.6),
              transform: `translateY(${(1 - sg(1.65, 0.6)) * 36}px)` }}>{s.hook2}</div>
          </div>
        </div>
      )}

      {/* ── 2 · het dossier ── */}
      {showCard && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', opacity: Math.min(cardIn, cardOut) }}>
          <div style={{ width: 880, background: P.paper, color: P.ink, position: 'relative',
            padding: '56px 64px 50px', boxShadow: '0 40px 80px rgba(0,0,0,.45)',
            transform: `translateY(${(1 - cardIn) * 90}px)` }}>
            <PFrame inset={18} tick={16} tw={2.5} />

            {/* kop */}
            <div style={{ borderBottom: `2.5px solid ${P.ink}`, paddingBottom: 20 }}>
              <div style={mono(17, { fontWeight: 600, letterSpacing: '.22em', color: P.dim })}>{s.agency}</div>
              <div style={{ ...mono(23, { fontWeight: 700, letterSpacing: '.14em', color: P.red }),
                marginTop: 8 }}>{s.file}</div>
            </div>

            {/* setup */}
            <p style={{ fontFamily: P.serif, fontSize: 30, lineHeight: 1.4, color: P.ink2,
              margin: '26px 0 0', opacity: sg(4.2, 0.55),
              transform: `translateY(${(1 - sg(4.2, 0.55)) * 20}px)` }}>{s.setup}</p>

            {/* logboek */}
            <div style={{ marginTop: 22 }}>
              {s.stops.map(([dir, tm], i) => {
                const p = sg(4.8 + i * 0.55, 0.45);
                const isWest = i === 3;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 18,
                    padding: '19px 0', borderTop: `1px solid ${P.line2}`, position: 'relative',
                    opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
                    <div style={mono(19, { fontWeight: 700, color: P.red })}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={mono(27, { fontWeight: 600, letterSpacing: '.1em', color: P.ink })}>{dir}</div>
                    <div style={{ flex: 1, borderBottom: `2.5px dotted ${P.line2}`,
                      transform: 'translateY(-8px)' }} />
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span style={mono(34, { fontWeight: 700,
                        color: isWest && reveal ? P.dim : P.ink })}>{tm}</span>
                      {isWest && (
                        <div style={{ position: 'absolute', left: 0, top: '52%', height: 4,
                          width: `${strikeP * 100}%`, background: P.red }} />
                      )}
                    </div>
                    {isWest && (
                      <div style={{ ...mono(17, { fontWeight: 700, letterSpacing: '.12em', color: P.red }),
                        position: 'absolute', right: 150, top: 6, border: `2.5px solid ${P.red}`,
                        padding: '4px 10px', borderRadius: 2, opacity: stampP,
                        transform: `rotate(-8deg) scale(${1.3 - 0.3 * stampP})` }}>{s.forged}</div>
                    )}
                  </div>
                );
              })}
              {/* correctie-regel (vaste hoogte, geen reflow) */}
              <div style={{ height: 36, borderTop: `1px solid ${P.line2}`, paddingTop: 10 }}>
                <div style={{ ...mono(20, { fontWeight: 700, letterSpacing: '.08em', color: P.red }),
                  opacity: sg(14.4, 0.5) }}>{s.fix}</div>
              </div>
            </div>

            {/* regel */}
            <div style={{ marginTop: 20, background: P.paper2, border: `1px solid ${P.line}`,
              borderLeft: `5px solid ${P.red}`, padding: '20px 26px',
              ...mono(21, { fontWeight: 600, letterSpacing: '.04em', color: P.ink }),
              opacity: sg(7.7, 0.6), transform: `translateY(${(1 - sg(7.7, 0.6)) * 18}px)` }}>{s.rule}</div>

            {/* vraag → antwoord (vaste hoogte) */}
            <div style={{ marginTop: 28, height: 188, position: 'relative' }}>
              {!reveal && (
                <div style={{ opacity: sg(8.8, 0.5) }}>
                  <div style={{ fontFamily: P.serif, fontSize: 44, fontWeight: 700,
                    letterSpacing: '-.015em' }}>{s.q}</div>
                  {/* aftel-ruiten: 3 · 2 · 1 */}
                  <div style={{ display: 'flex', gap: 22, marginTop: 30 }}>
                    {[0, 1, 2].map((i) => {
                      const fp = sg(10.2 + i * 1.05, 0.35);
                      return (
                        <div key={i} style={{ width: 20, height: 20, transform: 'rotate(45deg)',
                          border: `2.5px solid ${P.ink}`,
                          background: `rgba(210,54,43,${fp})` }} />
                      );
                    })}
                  </div>
                </div>
              )}
              {reveal && (
                <div>
                  <div style={{ fontFamily: P.serif, fontSize: 50, fontWeight: 700,
                    letterSpacing: '-.015em', color: P.red, opacity: sg(13.6, 0.4) }}>{s.answer}</div>
                  <p style={{ fontFamily: P.serif, fontSize: 25, lineHeight: 1.42, color: P.ink2,
                    margin: '14px 0 0', textWrap: 'pretty', opacity: sg(14.7, 0.6),
                    transform: `translateY(${(1 - sg(14.7, 0.6)) * 16}px)` }}>{s.why}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3 · eindkaart ── */}
      {showEnd && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          opacity: endOut, padding: '0 100px' }}>
          <div style={{ opacity: sg(18.3, 0.5),
            transform: `scale(${0.72 + 0.28 * sg(18.3, 0.6)})` }}>
            <PGridMark size={148} dark />
          </div>
          <div style={{ ...mono(22, { fontWeight: 600, letterSpacing: '.34em', color: P.dim }),
            marginTop: 52, opacity: sg(18.75, 0.5) }}>{s.no}</div>
          <div style={{ fontFamily: P.serif, fontSize: 134, fontWeight: 800, lineHeight: 1,
            letterSpacing: '-.035em', marginTop: 12, opacity: sg(18.9, 0.55),
            transform: `translateY(${(1 - sg(18.9, 0.55)) * 28}px)` }}>
            TIME<span style={{ color: P.red }}>LINE</span>
          </div>
          <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 38, color: P.line2,
            marginTop: 30, whiteSpace: 'nowrap', opacity: sg(19.35, 0.55) }}>{s.cta1}</div>
          <div style={{ width: 64, height: 3, background: P.red, marginTop: 40,
            opacity: sg(19.8, 0.4) }} />
          <div style={{ ...mono(23, { fontWeight: 700, letterSpacing: '.15em', color: P.paper, whiteSpace: 'nowrap' }),
            marginTop: 40, opacity: sg(19.95, 0.5) }}>{s.cta2}</div>
          <div style={{ ...mono(19, { fontWeight: 500, letterSpacing: '.2em', color: P.dim, whiteSpace: 'nowrap' }),
            marginTop: 18, opacity: sg(20.3, 0.5) }}>{s.cta3}</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TikScene, TIKTEXT });
