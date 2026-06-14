/* captions.jsx — bijschriften & plaatsingsnotities per taal. Vereist promo-shared.jsx */

const CAPTIONS = {
  nl: {
    header: 'CAPTIONS — NL',
    title: 'Bijschriften & plaatsing',
    blocks: [
      {
        label: 'FEED · ZAAK №041 (TEASER)',
        text: 'Dossier №041 is geopend. Iemand in het archief heeft de stempelklok één uur teruggezet — drie verklaringen, precies één is waar. Geen trivia, geen truc: logica is genoeg.\n\nZet je antwoord mét redenering in de comments. Meer zaken? Speel gratis online — link in bio.',
        tags: '#logica #deductie #puzzel #denkwerk',
      },
      {
        label: 'FEED · PRE-ORDER',
        text: 'No. 001 — TIMELINE. Tachtig deductiezaken, elk met precies één bewijsbaar antwoord. Smyth-gebonden, ligt plat open, papier waar een potlood van houdt.\n\n€24 · verschijnt Q3 2026 · je betaalt pas bij verzending. Reserveer via de link in bio.',
        tags: '#puzzelboek #logica #boekentip #cadeau',
      },
      {
        label: 'STORIES · PLAATSING',
        text: 'Frame 1 (de zaak): plaats een poll-sticker met drie opties — conciërge · klokkenmaker · archivaris. Frame 2 (het boek): linksticker naar southstudio.nl.\n\nSafe zones zijn aangehouden: ±250 px boven en ±300 px onder zijn vrij voor de Instagram-interface.',
        tags: '',
      },
      {
        label: 'TIKTOK · ZAAK №074',
        text: 'Eén van deze tijden is vervalst. Kijk tot het eind — het bewijs zit erin. Tachtig van zulke zaken in één boek: TIMELINE, link in bio.',
        tags: '#booktok #logica #puzzel #deductie',
      },
    ],
    note: 'Antwoord zaak №041: de archivaris. (Was de conciërge of de klokkenmaker de dader, dan zouden twee verklaringen waar zijn.) Pas posten in de comments nadat de post een dag heeft gelopen.',
  },
  en: {
    header: 'CAPTIONS — EN',
    title: 'Captions & placement',
    blocks: [
      {
        label: 'FEED · CASE №041 (TEASER)',
        text: 'Case file №041 is open. Someone in the archive set the time clock back an hour — three statements, exactly one true. No trivia, no trick: logic is enough.\n\nPut your answer (with reasoning) in the comments. More cases? Play free online — link in bio.',
        tags: '#logicpuzzle #deduction #puzzle #thinking',
      },
      {
        label: 'FEED · PRE-ORDER',
        text: 'No. 001 — TIMELINE. Eighty deduction cases, each with exactly one provable answer. Smyth-sewn, lies flat, paper a pencil loves.\n\n€24 · ships Q3 2026 · no charge until it ships. Pre-order via the link in bio.',
        tags: '#puzzlebook #logic #bookrecommendation #gift',
      },
      {
        label: 'STORIES · PLACEMENT',
        text: 'Frame 1 (the case): add a poll sticker with three options — caretaker · clockmaker · archivist. Frame 2 (the book): link sticker to southstudio.online.\n\nSafe zones respected: ±250 px top and ±300 px bottom kept clear for the Instagram UI.',
        tags: '',
      },
      {
        label: 'TIKTOK · CASE №074',
        text: 'One of these times has been forged. Watch to the end — the proof is in there. Eighty cases like this in one book: TIMELINE, link in bio.',
        tags: '#booktok #logic #puzzle #deduction',
      },
    ],
    note: 'Answer to case №041: the archivist. (If the caretaker or the clockmaker did it, two statements would be true.) Post it in the comments only after the post has run for a day.',
  },
};

function CaptionsCard({ lang = 'nl' }) {
  const c = CAPTIONS[lang];
  return (
    <div style={{ width: 760, height: 1330, background: P.paper, position: 'relative',
      overflow: 'hidden', fontFamily: P.serif, color: P.ink, padding: '46px 52px' }}>
      <div style={{ borderBottom: `2px solid ${P.ink}`, paddingBottom: 18 }}>
        <div style={{ fontFamily: P.mono, fontSize: 12, fontWeight: 700, letterSpacing: '.22em',
          textTransform: 'uppercase', color: P.red }}>{c.header}</div>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.01em',
          marginTop: 8 }}>{c.title}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
        {c.blocks.map((b, i) => (
          <div key={i} style={{ background: P.paper2, border: `1px solid ${P.line}`,
            padding: '18px 22px' }}>
            <div style={{ fontFamily: P.mono, fontSize: 11.5, fontWeight: 700,
              letterSpacing: '.18em', textTransform: 'uppercase', color: P.red,
              marginBottom: 10 }}>{b.label}</div>
            <div style={{ fontSize: 16.5, lineHeight: 1.55, color: P.ink2,
              whiteSpace: 'pre-line' }}>{b.text}</div>
            {b.tags ? (
              <div style={{ fontFamily: P.mono, fontSize: 12.5, color: P.dim,
                marginTop: 10 }}>{b.tags}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, borderLeft: `3px solid ${P.red}`, paddingLeft: 16,
        fontSize: 14.5, lineHeight: 1.5, fontStyle: 'italic', color: P.ink2 }}>{c.note}</div>
    </div>
  );
}

Object.assign(window, { CaptionsCard, CAPTIONS });
