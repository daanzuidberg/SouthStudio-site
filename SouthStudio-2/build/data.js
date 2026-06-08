/* TIMELINE — puzzle library + meta narrative
 * Each puzzle is a logic-grid deduction with a single unique solution.
 * Solutions are expressed as full tuples keyed by category id; the anchor
 * category is categories[0]. Clues are written so the reliable ones pin
 * exactly one solution; clues marked `unstable` are corrupted red herrings.
 */
(function () {
  const TIER = {
    1: { label: "TIER I", name: "Minor Distortion", instability: 28 },
    2: { label: "TIER II", name: "Multi-Event Divergence", instability: 58 },
    3: { label: "TIER III", name: "Collapse Event", instability: 91 },
  };

  /* ---------------------------------------------------------------- P1 */
  const p1 = {
    id: "p1",
    code: "DST-1851-L",
    tier: 1,
    title: "The London Signal",
    place: "London, British Empire",
    eraLabel: "1851 — 1893",
    scenario: [
      "In the spring of 1890, every constable on the Strand carries a glass slab that glows, chimes, and answers when spoken to. Parliament debates the etiquette of the <em>pocket telephone</em>. Nobody finds this strange — which is precisely the problem.",
      "A device this advanced cannot simply appear. The Agency's instruments show four separate anomalies bleeding into the 19th century, each a single component of the impossible handset, each carried back by a different courier in a different year.",
      "Reconstruct the smuggling chain. Fix each component to its year and its courier, and we can identify the keystone — the one object that, removed, lets the whole anachronism collapse.",
    ],
    categories: [
      { id: "year", name: "Year", items: [
        { id: "y1851", label: "1851" }, { id: "y1867", label: "1867" },
        { id: "y1889", label: "1889" }, { id: "y1893", label: "1893" } ] },
      { id: "person", name: "Courier", items: [
        { id: "cole", label: "Cole" }, { id: "halasz", label: "Halász" },
        { id: "raman", label: "Raman" }, { id: "thorn", label: "Thorn" } ] },
      { id: "artifact", name: "Component", items: [
        { id: "touch", label: "Touchscreen" }, { id: "cell", label: "Battery cell" },
        { id: "circuit", label: "Circuit board" }, { id: "handset", label: "Handset" } ] },
    ],
    solution: [
      { year: "y1851", person: "cole",   artifact: "touch" },
      { year: "y1867", person: "halasz", artifact: "cell" },
      { year: "y1889", person: "raman",  artifact: "circuit" },
      { year: "y1893", person: "thorn",  artifact: "handset" },
    ],
    clues: [
      { type: "Contradiction", text: "The assembled <strong>handset</strong> cannot predate its own parts. It bears the <em>latest</em> arrival date of the four anomalies." },
      { type: "Manifest", text: "Courier ledger, partial: <strong>Halász's</strong> drop precedes <strong>Raman's</strong> by exactly twenty-two years." },
      { type: "Document", text: "Exhibition catalogue: the glass <strong>touchscreen</strong> was first inventoried at the Great Exhibition of <strong>1851</strong>." },
      { type: "Eyewitness", text: "\u201C<strong>Cole</strong> carried no current — her cargo was cold glass and nothing else.\u201D" },
      { type: "Contradiction", text: "The <strong>battery cell</strong> arrived before the <strong>circuit board</strong> it would later power." },
      { type: "Customs", text: "Corroborating port note: <strong>Halász</strong> cleared the docks the year of the Paris <em>Exposition électrique</em> — 1867." },
    ],
    hints: [
      "Start with the keystone. One clue fixes a single component to the latest year on the grid — anchor there and work outward.",
      "Clue 2 fits only one pair of years that are twenty-two apart. Place Halász and Raman first; the other two couriers fall out by elimination.",
      "Cole carried the touchscreen (1851). \u201CCell before circuit\u201D means 1867 then 1889. Thorn is left with 1893 and the assembled handset.",
    ],
    hiddenRule: "Causality. An assembled device cannot arrive before the components it is built from — so the handset must hold the latest date.",
    divergence: { year: "1893", text: "The completed handset is the keystone. The earlier fragments are inert curios without it. Recover the 1893 handset and the signal dies in its cradle." },
    explanation: [
      "Four couriers, four years, one impossible phone. The chain reads cleanly once the keystone is fixed: the <strong>handset cannot precede its parts</strong>, so it takes 1893 — and Thorn, the only courier left after the others are placed.",
      "Cole's \u201Ccold glass\u201D is the touchscreen at the 1851 Exhibition. Halász clears port in 1867 (the battery cell); the manifest's twenty-two-year gap drops Raman and the circuit board into 1889. The cell arriving before the circuit confirms the order.",
      "Remove the 1893 handset and the touchscreen, cell, and board are just three unconnected oddities — no signal, no anachronism. London goes quiet again.",
    ],
    walkthrough: [
      "Handset = 1893 (latest date; an assembly can't precede its parts).",
      "Touchscreen = 1851 (Exhibition catalogue).",
      "Cole = touchscreen \u2192 Cole = 1851.",
      "Halász = 1867, Raman = 1889 (the 22-year manifest gap).",
      "Thorn is the only courier left \u2192 Thorn = 1893 = handset.",
      "Cell before circuit \u2192 cell = 1867 (Halász), circuit = 1889 (Raman).",
    ],
  };

  /* ---------------------------------------------------------------- P2 */
  const p2 = {
    id: "p2",
    code: "DVG-0064-R",
    tier: 2,
    title: "The Library That Wasn't Burned",
    place: "Rome, the Eternal Empire",
    eraLabel: "64 — 410 CE",
    scenario: [
      "The Library of Alexandria never burned. Knowledge that should have been ash instead compounded for centuries, and the Roman Empire learned to industrialise a thousand years too early. Aqueducts now carry current. Legions march to telegraph drums.",
      "Four innovations broke loose across four reigns, each tied to a Roman figure and a physical artifact recovered from the wrong stratum. Reconstruct who introduced what, and when.",
      "Be warned: this timeline has been altered long enough that the records themselves have begun to lie. One eyewitness clue is <em>corrupted</em> — it remembers an event that never happened. You must solve the grid without it.",
    ],
    categories: [
      { id: "era", name: "Era", items: [
        { id: "e64", label: "64 CE" }, { id: "e122", label: "122 CE" },
        { id: "e271", label: "271 CE" }, { id: "e410", label: "410 CE" } ] },
      { id: "innovation", name: "Innovation", items: [
        { id: "steam", label: "Steam engine" }, { id: "telegraph", label: "Telegraph" },
        { id: "powder", label: "Gunpowder" }, { id: "press", label: "Printing press" } ] },
      { id: "person", name: "Figure", items: [
        { id: "heron", label: "Heron" }, { id: "hadrian", label: "Hadrian" },
        { id: "aurelian", label: "Aurelian" }, { id: "theon", label: "Theon" } ] },
      { id: "artifact", name: "Artifact", items: [
        { id: "turbine", label: "Brass turbine" }, { id: "coil", label: "Copper coil" },
        { id: "saltpeter", label: "Saltpeter cache" }, { id: "type", label: "Type tray" } ] },
    ],
    solution: [
      { era: "e64",  innovation: "steam",     person: "heron",    artifact: "turbine" },
      { era: "e122", innovation: "telegraph", person: "hadrian",  artifact: "coil" },
      { era: "e271", innovation: "powder",    person: "aurelian", artifact: "saltpeter" },
      { era: "e410", innovation: "press",     person: "theon",    artifact: "type" },
    ],
    clues: [
      { type: "Contradiction", text: "<strong>Heron's</strong> anomaly is the oldest of the four." },
      { type: "Document", text: "\u201CHeron's engine turned fire into motion.\u201D" },
      { type: "Artifact", text: "The <strong>brass turbine</strong> was the steam engine's only moving part — the two are one object." },
      { type: "Record", text: "<strong>Hadrian</strong> strung the <strong>copper coil</strong> the length of his northern wall, completed in 122 CE." },
      { type: "Contradiction", text: "The <strong>telegraph</strong> could transmit nothing without the copper coil to carry it." },
      { type: "Eyewitness", text: "\u201C<strong>Aurelian's</strong> gift could <em>detonate</em>. It moved no engines, carried no words, and pressed no pages.\u201D" },
      { type: "Artifact", text: "There is no gunpowder without the <strong>saltpeter cache</strong>." },
      { type: "Document", text: "<strong>Aurelian</strong> raised his great walls around Rome in 271 CE." },
      { type: "Eyewitness", unstable: true, text: "\u201CI saw the printing press at work in the year of the Great Fire — 64 CE.\u201D" },
    ],
    hints: [
      "Several clues describe the same object twice — once as a person's deed, once as an artifact. Chain those pairs and the rows assemble fast.",
      "One record is flagged UNSTABLE. Treat it as corrupted and never place it on the grid. Every reliable clue still yields one solution.",
      "Heron/Steam/Turbine = 64. Hadrian/Telegraph/Coil = 122. Aurelian/Gunpowder/Saltpeter = 271. Theon takes the press and type tray in 410 by elimination.",
    ],
    hiddenRule: "Corrupted memory. After a divergence, some eyewitness records 'remember' events that never occurred. One clue is poison — discard it before reasoning.",
    divergence: { year: "64 CE", text: "Heron's brass turbine is the bootstrap. It is the first machine to turn Alexandrian theory into motion. Remove the turbine in 64 CE and the entire industrial cascade unwinds." },
    explanation: [
      "The grid solves on pairs. \u201CHeron's engine turned fire into motion\u201D plus \u201Cthe turbine is the steam engine\u201D plants Heron, steam, and the turbine together — and the oldest-anomaly clue drops the trio into 64 CE.",
      "Hadrian's wall fixes the coil and telegraph to 122; Aurelian's detonating gift and saltpeter to his 271 walls. Theon, the Alexandrian archivist, is left with the printing press and type tray in 410.",
      "The unstable clue — the press \u201Cseen\u201D in 64 — is a phantom memory. It cannot be true: 64 belongs to the steam turbine. Players who place it create a false contradiction and stall. The lesson of Tier II: <strong>not every record can be trusted</strong>.",
    ],
    walkthrough: [
      "Discard the UNSTABLE clue (press in 64 CE) — it is corrupted.",
      "Heron = steam = turbine; oldest anomaly \u2192 64 CE.",
      "Hadrian = coil = telegraph \u2192 122 CE (the wall).",
      "Aurelian = gunpowder = saltpeter \u2192 271 CE (the walls of Rome).",
      "Theon = printing press = type tray \u2192 410 CE (the only slot left).",
    ],
  };

  /* ---------------------------------------------------------------- P3 */
  const p3 = {
    id: "p3",
    code: "CLP-████-∞",
    tier: 3,
    title: "The Closed Loop",
    place: "Time Correction Agency — Records Vault",
    eraLabel: "1908 — 2061",
    scenario: [
      "This is not an alternate history. This is <em>our</em> history, folding back on itself. Five records have surfaced from the Agency's own sealed vault, and they describe a chain of events that has no beginning — the last reaches back to ignite the first.",
      "Each record fixes a year to an event, an agent, and an artifact. One of those agents is <strong>Cipher</strong> — your own field designation. We need you to reconstruct the loop. We need to know where the Agency itself was founded, and by whose hand.",
      "A piece of recovered footage is <em>unstable</em>. It places you somewhere you cannot logically be. Set it aside to solve the grid — but do not forget that you saw it.",
    ],
    categories: [
      { id: "year", name: "Year", items: [
        { id: "y1908", label: "1908" }, { id: "y1947", label: "1947" },
        { id: "y1969", label: "1969" }, { id: "y2024", label: "2024" },
        { id: "y2061", label: "2061" } ] },
      { id: "event", name: "Event", items: [
        { id: "return", label: "The Return" }, { id: "wipe", label: "Memory Wipe" },
        { id: "broadcast", label: "First Broadcast" }, { id: "founding", label: "The Founding" },
        { id: "war", label: "The Quiet War" } ] },
      { id: "agent", name: "Agent", items: [
        { id: "vance", label: "Vance" }, { id: "okonkwo", label: "Okonkwo" },
        { id: "reyes", label: "Reyes" }, { id: "cipher", label: "Cipher (you)" },
        { id: "solveig", label: "Solveig" } ] },
      { id: "artifact", name: "Artifact", items: [
        { id: "watch", label: "Cracked watch" }, { id: "vial", label: "Glass vial" },
        { id: "cube", label: "Black cube" }, { id: "page", label: "Torn page" },
        { id: "key", label: "Brass key" } ] },
    ],
    solution: [
      { year: "y1908", event: "return",    agent: "vance",   artifact: "watch" },
      { year: "y1947", event: "wipe",      agent: "okonkwo", artifact: "vial" },
      { year: "y1969", event: "broadcast", agent: "reyes",   artifact: "cube" },
      { year: "y2024", event: "founding",  agent: "cipher",  artifact: "page" },
      { year: "y2061", event: "war",       agent: "solveig", artifact: "key" },
    ],
    clues: [
      { type: "Contradiction", text: "<strong>Vance's</strong> record is the oldest of the five." },
      { type: "Log", text: "<strong>The Return</strong> sits at the earliest point in the chain." },
      { type: "Artifact", text: "The <strong>cracked watch</strong> stopped at the exact instant of the Return." },
      { type: "Contradiction", text: "<strong>Solveig's</strong> file bears the latest timestamp of all five." },
      { type: "Document", text: "<strong>The Quiet War</strong> and the <strong>brass key</strong> share a year — and Solveig is the one who waged that war." },
      { type: "Log", text: "<strong>The First Broadcast</strong> aired in 1969." },
      { type: "Document", text: "<strong>Reyes</strong> sent the first broadcast." },
      { type: "Artifact", text: "The <strong>black cube</strong> was the transmitter of the first broadcast." },
      { type: "Document", text: "<strong>The Founding</strong> postdates both the First Broadcast and the Memory Wipe — yet it is <em>not</em> the latest record." },
      { type: "Document", text: "Agent <strong>Cipher</strong>'s file is sealed to the Founding itself; the <strong>torn page</strong> was recovered from inside it." },
      { type: "Artifact", text: "The <strong>glass vial</strong> induced the Memory Wipe." },
      { type: "Footage", unstable: true, text: "Recovered, degraded: a figure tagged <strong>CIPHER</strong> winding the cracked watch — in 1908." },
    ],
    hints: [
      "Place the stated anchors first: the oldest record, the latest record, and the year the broadcast aired are all given outright.",
      "The unstable footage puts Cipher in 1908 — impossible, that year is occupied by Vance. Discard it, and the Founding falls into the only year that is later than the broadcast but not the latest.",
      "1908 Return/Vance/Watch · 1947 Wipe/Okonkwo/Vial · 1969 Broadcast/Reyes/Cube · 2024 Founding/Cipher/Page · 2061 QuietWar/Solveig/Key.",
    ],
    hiddenRule: "Causality loop. The final event reaches back to trigger the first — and one record places you, the investigator, at a point you could not occupy. Both are clues, not errors.",
    divergence: { year: "2024", text: "The Founding is the keystone — and the torn page recovered from Cipher's sealed file is the Agency's founding charter, written in your own hand. There is no clean object to remove. Correcting this timeline means correcting yourself." },
    explanation: [
      "The chain closes on itself. Solveig's <strong>Quiet War</strong> of 2061 dispatches the <strong>brass key</strong> backward; the key is cut to wind Vance's <strong>cracked watch</strong>, which stops at <strong>the Return</strong> of 1908 — the event that begins everything. The end of the loop is the cause of its beginning.",
      "Reyes broadcasts in 1969 through the black cube. Okonkwo's glass vial erases the memory of it in 1947 — a wipe that, in loop-time, precedes the thing it conceals. And the Founding lands in 2024: later than the broadcast, later than the wipe, but not the latest record.",
      "The unstable footage was never a glitch. It places <strong>Cipher</strong> — you — in 1908, winding the watch. You could not be there. And yet the torn page in the founding charter is in your handwriting. The Agency that recruited you to correct the timeline was founded by you. You are not investigating the divergence. <strong>You are the divergence.</strong>",
    ],
    walkthrough: [
      "Set aside the UNSTABLE footage (Cipher in 1908).",
      "Vance = oldest = 1908; the Return is earliest \u2192 1908; cracked watch stopped at the Return \u2192 1908.",
      "Solveig = latest = 2061; Quiet War + brass key = 2061.",
      "Broadcast = 1969; Reyes sent it; black cube transmitted it \u2192 1969.",
      "Founding > broadcast & wipe, but not latest \u2192 2024; Cipher + torn page sealed to the Founding \u2192 2024.",
      "Only 1947 remains: Memory Wipe / Okonkwo / glass vial.",
    ],
  };

  /* ----------------------------------------------------------- narrative */
  const agency = {
    name: "Time Correction Agency",
    abbrev: "TCA",
    handler: "CONTROL",
    onboarding: [
      { from: "CONTROL", text: "Field Investigator — you're awake. Good. We don't have long, so I'll be direct." },
      { from: "CONTROL", text: "Reality is fraying. Somewhere upstream, history was altered, and the damage is propagating forward into the present. Your present." },
      { from: "CONTROL", text: "The Agency repairs these fractures. We don't change the past — we <em>restore</em> it. Your job is to read the evidence, reconstruct what truly happened, and identify the keystone: the one change that, undone, lets the timeline heal." },
      { from: "CONTROL", text: "Each case is a deduction grid. Mark what's impossible, confirm what's certain, eliminate down to the truth. The Paradox Meter on your console tracks how unstable the local timeline has become. Keep an eye on it." },
      { from: "CONTROL", text: "One more thing. The deeper we go, the less you should trust the records — and, eventually, your own memory. Begin when ready." },
    ],
  };

  const beats = {
    p1: [
      { from: "CONTROL", text: "Clean work, Investigator. London is quiet again — the handset never assembled, the couriers never sailed. A textbook minor distortion." },
      { from: "CONTROL", text: "But I'll be honest: this one shouldn't have happened at all. Someone routed those components with precision. This wasn't an accident of the timestream. Stand by for the next fracture." },
    ],
    p2: [
      { from: "CONTROL", text: "Rome is ash again, as it should be. You did something most investigators can't — you ignored a record that <em>lied</em> to you." },
      { from: "CONTROL", text: "That worries me. The corrupted memories are spreading, and they all carry the same fingerprint. Every fracture we close traces back to one signature in the logs — and we cannot read it. The name is redacted in our own files. By us. Before we ever filed it." },
      { from: "CONTROL", text: "The next case came from inside the Agency's sealed vault. I'd tell you to be careful, but I don't think careful is going to matter." },
    ],
    p3: [
      { from: "CONTROL", text: "...You've solved it. I can see your grid from here. I was hoping you wouldn't." },
      { from: "CONTROL", text: "The signature we couldn't read — the one under every fracture, the redaction in our own founding charter. It's yours. You founded the Agency in 2024. You wrote the orders that sent Solveig to 2061. You cut the key that wound the watch that started the Return in 1908." },
      { from: "CONTROL", text: "We didn't recruit you to fix the timeline, Investigator. The timeline broke <em>because</em> we recruited you. The loop is closed. It always was." },
      { from: "CONTROL", text: "There's one fracture left in the vault. It has your name on it — the real one, under the redaction. I think you already know what it says. <em>// TRANSMISSION ENDS //</em>" },
    ],
  };

  /* ---- scramble non-anchor display order so the solved grid is NOT a clean
     diagonal. Marks are keyed by item id, so reordering is logic-safe. ---- */
  function rngFrom(seed) {
    let a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function scramble(puzzle, seed) {
    const r = rngFrom(seed);
    puzzle.categories.forEach((cat, ci) => {
      if (ci === 0) return; // keep anchor (chronological) order intact
      for (let i = cat.items.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [cat.items[i], cat.items[j]] = [cat.items[j], cat.items[i]];
      }
    });
  }
  scramble(p1, 41); scramble(p2, 73); scramble(p3, 128);

  const LIB = window.TIMELINE_LIB || { tier1: [], tier2: [], tier3: [] };
  const tiers = {
    1: [p1, ...LIB.tier1],
    2: [p2, ...LIB.tier2],
    3: [p3, ...LIB.tier3],
  };
  const allPuzzles = [...tiers[1], ...tiers[2], ...tiers[3]];
  const byId = {};
  allPuzzles.forEach((p) => { byId[p.id] = p; });

  window.TIMELINE = { TIER, puzzles: [p1, p2, p3], tiers, allPuzzles, byId, agency, beats };
})();
