// SouthStudio — Video No. 001 timeline composition
// Measured kinetic-typography cut of "Why has silence become uncomfortable?"
// Total duration: 200s. Each Beat is absolutely timed against the Stage playhead.

function SilenceVideo() {
  return (
    <React.Fragment>
      {/* Always-on faint grid texture */}
      <GridField opacity={0.4} />

      {/* ════════ STUDIO INTRO STING · 0–8 ════════ */}
      <Sprite start={0} end={8.4}>
        {({ localTime }) => {
          const reveal = clamp((localTime - 0.4) / 1.8, 0, 1);
          const wmO = Easing.easeOutCubic(clamp((localTime - 2.4) / 1.0, 0, 1));
          const exit = localTime > 7.4 ? Easing.easeInCubic(clamp((localTime - 7.4) / 1.0, 0, 1)) : 0;
          const tagO = Math.min(Easing.easeOutCubic(clamp((localTime - 4.2) / 1.0, 0, 1)), 1);
          return (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 38, opacity: 1 - exit, zIndex: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <GridMark size={132} reveal={reveal} />
                <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 86, letterSpacing: '-0.02em', color: VINK, opacity: wmO, transform: `translateX(${(1 - wmO) * -18}px)` }}>
                  South<Red>Studio</Red>
                </span>
              </div>
              <div style={{ opacity: tagO, transform: `translateY(${(1 - tagO) * 10}px)` }}>
                <Kick color={VSOFT} size={24} ls="0.34em">Things worth thinking about</Kick>
              </div>
            </div>
          );
        }}
      </Sprite>

      {/* ════════ EPISODE TITLE CARD · 8.4–14 ════════ */}
      <Beat start={8.6} end={11.0} top={372} fin={0.7} fout={0.4}>
        <Kick color={VRED} size={28} dot ls="0.32em">No. 001 · A SouthStudio Film</Kick>
      </Beat>
      <Beat start={9.2} end={14.0} top={436} fin={0.8} fout={0.5} pad={300}>
        <Quote size={84} weight={700} lh={1.08}>Why has silence become <Red>uncomfortable?</Red></Quote>
      </Beat>
      <Beat start={11.0} end={14.0} top={690} fin={0.8} fout={0.5}>
        <Kick color={VSOFT} size={19} ls="0.22em">Voice-over + AI visuals · Est. runtime ~6–8 min</Kick>
      </Beat>

      {/* Persistent broadcast frame across all sections */}
      <Frame start={18} end={192} />

      {/* ════════ CHAPTER WIPES ════════ */}
      <ChapterWipe at={49.7} />
      <ChapterWipe at={81.7} />
      <ChapterWipe at={127.7} />
      <ChapterWipe at={164.7} />

      {/* ════════ IMAGES ════════ */}
      {/* Ch I — empty chair near window (Vruyr Martirosyan / Unsplash) */}
      <Sprite start={35.0} end={40.2}><ImageSprite x={1680} y={270} width={200} height={440} radius={4} zIndex={3} src="https://images.unsplash.com/photo-AxZNLcEHNIs?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.25) sepia(0.1)" entryDur={0.8} exitDur={0.5} /></Sprite>
      {/* Ch II — smartphone / scroll (Unsplash) */}
      <Sprite start={62.0} end={67.0}><ImageSprite x={40} y={290} width={200} height={400} radius={4} zIndex={3} src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.2) sepia(0.08)" entryDur={0.7} exitDur={0.5} /></Sprite>
      {/* Ch II — old library / archive (Unsplash) */}
      <Sprite start={69.0} end={74.0}><ImageSprite x={1680} y={310} width={200} height={360} radius={4} zIndex={3} src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.3) sepia(0.15)" entryDur={0.8} exitDur={0.5} /></Sprite>
      {/* Ch III — brain / neuroscience (Unsplash) */}
      <Sprite start={88.0} end={93.0}><ImageSprite x={40} y={260} width={200} height={430} radius={4} zIndex={3} src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.35) sepia(0.1)" entryDur={0.8} exitDur={0.5} /></Sprite>
      {/* Ch III — laboratory (Unsplash) */}
      <Sprite start={115.0} end={123.0}><ImageSprite x={1650} y={220} width={230} height={500} radius={4} zIndex={3} src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.3) sepia(0.1)" entryDur={1.0} exitDur={0.6} kenBurns={true} kenBurnsScale={1.04} /></Sprite>
      {/* Ch IV — sheet music (Valentino Funghi / Unsplash) */}
      <Sprite start={141.0} end={146.0}><ImageSprite x={1680} y={290} width={200} height={400} radius={4} zIndex={3} src="https://images.unsplash.com/photo-VRr9a2rOoBI?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.2) sepia(0.12)" entryDur={0.7} exitDur={0.5} /></Sprite>
      {/* Ch IV — crowd / noise (Unsplash) */}
      <Sprite start={155.0} end={161.0}><ImageSprite x={40} y={270} width={200} height={440} radius={4} zIndex={3} src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.25) sepia(0.1)" entryDur={0.7} exitDur={0.5} /></Sprite>
      {/* Ch V — person at window (Noah Silliman / Unsplash) */}
      <Sprite start={178.0} end={185.0}><ImageSprite x={40} y={240} width={200} height={480} radius={4} zIndex={3} src="https://images.unsplash.com/photo-gzhyKEo_cbU?auto=format&fit=crop&w=400&h=700&q=85" filter="grayscale(0.2) sepia(0.1)" entryDur={0.9} exitDur={0.6} kenBurns={true} kenBurnsScale={1.03} /></Sprite>

      {/* ════════ I · THE QUESTION · 14–50 ════════ */}
      <SilenceOpening start={14} end={18.2} />

      <SectionHeader start={18.2} end={23.0} roman="I" title="The Question" />

      <Beat start={23.2} end={28.4} top={470}>
        <Quote size={60}>There is a small experiment you can try <Em>right now.</Em></Quote>
      </Beat>
      <Beat start={28.6} end={34.4} top={446} pad={320}>
        <Quote size={54} color={VINK2}>Put down your phone. Close the tabs you don't need.<br/>Don't play anything.</Quote>
      </Beat>
      <WordReveal
        start={34.6} end={40.4}
        words={[{ text: 'Just' }, { text: 'sit.' }]}
        size={100} weight={700}
        top={392} stagger={0.5} pad={280}
      />
      <Beat start={35.5} end={40.4} top={526} fin={0.6} fout={0.5}>
        <Kick color={VSOFT} size={18} ls="0.3em">— three seconds of silence —</Kick>
      </Beat>
      <Beat start={40.6} end={46.4} top={440} pad={320}>
        <Quote size={58}>How long before something in you wanted to <Red>reach for something?</Red></Quote>
      </Beat>
      <Beat start={46.6} end={50.0} top={452} pad={320}>
        <Quote size={52} color={VINK2}>That low, almost imperceptible discomfort —<br/>is what this film is about.</Quote>
      </Beat>

      {/* ════════ II · THE ASSUMPTION · 50–82 ════════ */}
      <SectionHeader start={50.2} end={55.0} roman="II" title="The Assumption" />

      <Beat start={55.2} end={61.0} top={470}>
        <Quote size={60}>The obvious answer is that we've been <Em>trained</Em> out of it.</Quote>
      </Beat>
      <Beat start={61.2} end={68.0} top={448} pad={300}>
        <Quote size={50} color={VINK2}>Smartphones. Social media. Infinite scroll.<br/><span style={{ color: VSOFT, fontSize: 38 }}>The standard list. It isn't wrong.</span></Quote>
      </Beat>
      <Beat start={68.2} end={75.0} top={448} pad={300}>
        <Quote size={56}>But look back far enough, and silence was <Red>never entirely comfortable.</Red></Quote>
      </Beat>
      <Beat start={75.2} end={82.0} top={430} pad={300}>
        <Quote size={50} color={VINK2}>Maybe the question isn't why technology broke something whole —</Quote>
        <Quote size={56} mt={22}>but why we were always looking for <Em>sound</Em> to begin with.</Quote>
      </Beat>

      {/* ════════ III · THE UNFOLDING · 82–128 ════════ */}
      <SectionHeader start={82.2} end={87.0} roman="III" title="The Unfolding" />

      <Beat start={87.2} end={93.4} top={460} pad={320}>
        <Quote size={56}>Here is what happens in your brain when you are <Em>genuinely silent.</Em></Quote>
      </Beat>
      <Beat start={93.6} end={100.4} top={446} pad={320}>
        <Quote size={50} color={VINK2}>Not asleep. Not meditating with a voice in your ear.<br/>Just — nothing happening, for a few minutes.</Quote>
      </Beat>
      <Beat start={100.6} end={107.4} top={452}>
        <Kick color={VRED} size={22} dot>The default mode network</Kick>
        <Quote size={60} mt={26}>It is the part of you that <Red>reflects.</Red></Quote>
      </Beat>
      <Beat start={107.6} end={114.4} top={444} pad={320}>
        <Quote size={52}>And reflection is not always pleasant.</Quote>
        <Quote size={44} color={VINK2} mt={20}>The mind wanders to where things are unresolved.</Quote>
      </Beat>
      {/* The stat — give it weight */}
      <Beat start={114.6} end={123.4} top={372} pad={300} drift={10} fin={0.3}>
        <RevealAt t={114.6}><Quote size={50} color={VINK2}>A significant number of people preferred a</Quote></RevealAt>
        <RevealAt t={116.0}><Quote size={78} weight={700} mt={18} lh={1.1}><Red>mild electric shock</Red></Quote></RevealAt>
        <RevealAt t={117.6}><Quote size={46} color={VINK2} mt={18}>to sitting alone with their thoughts for fifteen minutes.</Quote></RevealAt>
        <RevealAt t={119.0}><div style={{ marginTop: 30 }}><Kick color={VSOFT} size={17} ls="0.24em">Study · University of Virginia</Kick></div></RevealAt>
      </Beat>
      <Beat start={123.6} end={128.0} top={476} drift={6}>
        <Quote size={64} weight={700}>A shock. Rather than <Em>silence.</Em></Quote>
      </Beat>

      {/* ════════ IV · THE TURN · 128–165 ════════ */}
      <SectionHeader start={128.2} end={133.0} roman="IV" title="The Turn" />

      <Beat start={133.2} end={140.0} top={452} pad={320}>
        <Quote size={56}>Silence isn't only an absence of noise.</Quote>
        <Quote size={60} mt={22}>It is a particular kind of <Red>presence.</Red></Quote>
      </Beat>
      <Beat start={140.2} end={147.0} top={452} pad={320}>
        <Quote size={52} color={VINK2}>In music, the space between the notes<br/>is where the meaning settles.</Quote>
      </Beat>
      <Beat start={147.2} end={154.0} top={452} pad={320}>
        <Quote size={52} color={VINK2}>A pause in conversation is not a failure of language —<br/>it is often the most <Em>honest</Em> moment in it.</Quote>
      </Beat>
      <Beat start={154.2} end={161.4} top={438} pad={300} fin={0.5}>
        <RevealAt t={154.2}><Quote size={54}>When we eliminate every gap, we don't fill our lives with <Em>more</Em> thought.</Quote></RevealAt>
        <RevealAt t={156.8}><Quote size={66} weight={700} mt={24}>We fill them with <Red>less.</Red></Quote></RevealAt>
      </Beat>
      <Beat start={161.6} end={165.0} top={460} pad={320}>
        <Quote size={50} color={VINK2}>There is a kind of boredom that used to be essential.</Quote>
      </Beat>

      {/* ════════ V · THE OPEN ENDING · 165–192 ════════ */}
      <SectionHeader start={165.2} end={170.0} roman="V" title="The Open Ending" />

      <Beat start={170.2} end={176.4} top={460} pad={320}>
        <Quote size={54} color={VINK2}>I'm not going to tell you to put your phone away.<br/><span style={{ color: VSOFT }}>You've heard that.</span></Quote>
      </Beat>
      <WordReveal
        start={176.6} end={185.4}
        words={[
          { text: 'What' }, { text: 'is' }, { text: 'it' }, { text: "you're" }, { text: 'avoiding,' }, { text: 'exactly,' }, { br: true },
          { text: 'when' }, { text: 'you' }, { text: 'reach' }, { text: 'for' }, { text: 'something' }, { text: 'the' },
          { text: 'moment', red: true }, { text: 'silence', red: true }, { text: 'begins?', red: true }
        ]}
        size={58} top={418} pad={300} stagger={0.12}
      />
      <Beat start={185.6} end={192.0} top={444} pad={320}>
        <Quote size={50} color={VINK2}>I don't have a clean answer. I'm not sure there is one.</Quote>
        <Quote size={58} mt={24}>But I think it's worth <Em>thinking about.</Em></Quote>
      </Beat>

      {/* ════════ END CARD · 192–200 ════════ */}
      <Sprite start={192} end={200}>
        {({ localTime }) => {
          const o = Easing.easeOutCubic(clamp(localTime / 1.2, 0, 1));
          const markO = Easing.easeOutCubic(clamp((localTime - 0.3) / 1.0, 0, 1));
          const tagO = Easing.easeOutCubic(clamp((localTime - 1.6) / 1.0, 0, 1));
          return (
            <div style={{ position: 'absolute', inset: 0, background: VINK, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, zIndex: 10 }}>
              <div style={{ opacity: markO, transform: `scale(${0.94 + 0.06 * markO})` }}>
                <GridMark size={120} dark />
              </div>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, letterSpacing: '-0.02em', color: VPAPER, opacity: markO }}>
                South<Red>Studio</Red>
              </span>
              <div style={{ opacity: tagO }}>
                <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'rgba(250,247,239,0.65)' }}>Things worth thinking about</span>
              </div>
              <div style={{ opacity: tagO, marginTop: 14 }}>
                <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(250,247,239,0.35)' }}>No. 001 · Shelf III · Video</span>
              </div>
            </div>
          );
        }}
      </Sprite>
    </React.Fragment>
  );
}

Object.assign(window, { SilenceVideo });
