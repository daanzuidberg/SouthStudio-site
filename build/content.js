/* ===================================================================
   TIMELINE — content bank + prose builder (v2 — long stories + detailed evidence)
   globalThis.CONTENT = { skins, buildPuzzle(gen, skin, meta) }
   =================================================================== */
(function () {
  const E = globalThis.ENGINE;

  // ---- article rule: which roles read with a leading "the" ----
  const THE = { artifact: 1, document: 1, vessel: 1, org: 1, signal: 1 };
  function det(role, cap) { return THE[role] ? (cap ? "The " : "the ") : ""; }
  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  const THING = { artifact: 1, vessel: 1, document: 1, signal: 1, org: 1 };

  // ---------------- SKINS ----------------
  // scen() returns a 2-paragraph story (array of strings).
  const skins = [
    {
      era: "Old Kingdom Egypt", place: "Giza, Lower Egypt", range: [-2600, -2470],
      title: ["Gears in the Pyramid", "The Sealed Mechanism", "Clockwork Beneath Giza", "The Mastaba Anomaly"],
      scen: () => [
        "The survey team broke through a false wall expecting grave goods. Instead they found a brass mechanism — still ticking, sealed in bone-dry air for forty-five centuries. By every law of history it should not be invented for another four thousand years.",
        "Four anachronistic parts were carried into the dynasty across four reigns, each logged to a different official and a different quarry. The papyrus that lets you place them has survived, barely; the rest is yours to deduce.",
      ],
      cats: [
        { name: "Figure", role: "person", items: ["Hemiunu", "Merit", "Khafre", "Djedi", "Nefermaat", "Rahotep", "Iunu"] },
        { name: "Artifact", role: "artifact", items: ["bronze gear", "water escapement", "star dial", "copper coil", "lodestone", "glass lens", "reed battery"] },
        { name: "Quarry", role: "place", items: ["Tura", "Aswan", "Hatnub", "Gebel el-Silsila", "Wadi Hammamat", "Faiyum", "Maidum"] },
      ],
    },
    {
      era: "Imperial Rome", place: "Rome, the Eternal Empire", range: [60, 410],
      title: ["The Library That Wasn't Burned", "Steam Over the Forum", "The Aqueduct Current", "Engines of the Caesars"],
      scen: () => [
        "In this thread of history the Library of Alexandria never burned, and Rome industrialised a thousand years ahead of schedule. Steam hangs over the Forum at dawn; the aqueducts carry current as readily as water.",
        "Four innovations broke loose across four reigns, each tied to a scholar and a recovered component. Control wants them dated and pinned before the anachronism propagates downstream into the centuries that follow.",
      ],
      cats: [
        { name: "Figure", role: "person", items: ["Heron", "Hadrian", "Aurelian", "Theon", "Frontinus", "Hypatia", "Vitruvius"] },
        { name: "Innovation", role: "event", items: ["the steam engine", "the telegraph", "gunpowder", "the printing press", "the dynamo", "the pendulum clock", "the camera"] },
        { name: "Artifact", role: "artifact", items: ["brass turbine", "copper coil", "saltpeter cache", "type tray", "glass plate", "iron flywheel", "silver wire"] },
      ],
    },
    {
      era: "Tang Dynasty China", place: "Chang'an, Tang China", range: [620, 900],
      title: ["The Porcelain Circuit", "Silk Road Static", "The Astronomer's Engine", "Lanterns of Chang'an"],
      scen: () => [
        "In the night markets of Chang'an, lacquered boxes hum with a current they have no right to hold, and the great lanterns burn without flame. The vendors have stopped finding it strange — which is precisely how the Agency knows the damage is taking root.",
        "Four devices crossed the Silk Road centuries too early, each passing through a different scholar and a different workshop before reaching the capital. Reconstruct their passage before the new history sets like lacquer.",
      ],
      cats: [
        { name: "Figure", role: "person", items: ["Yi Xing", "Li Chun", "Du Fu", "Shen Kuo", "Wang Wei", "Sun Simiao", "Gao Pian"] },
        { name: "Device", role: "artifact", items: ["porcelain capacitor", "compass rotor", "silk diaphragm", "jade resonator", "bronze relay", "paper circuit", "lacquer cell"] },
        { name: "Workshop", role: "place", items: ["West Market", "Daming Palace", "Jingzhou", "Yangzhou", "Dunhuang", "Luoyang", "Chengdu"] },
      ],
    },
    {
      era: "Abbasid Baghdad", place: "Baghdad, House of Wisdom", range: [780, 1000],
      title: ["The House of Wisdom Reactor", "Brass Birds of Baghdad", "The Calculating Engine", "Currents in the Caliphate"],
      scen: () => [
        "Deep in the House of Wisdom sits a machine that reckons faster than a hall full of accountants. Its keepers describe it without wonder, as though calculation at this speed were the most ordinary thing in the world — and that calm is the symptom.",
        "Four components arrived across two centuries, each through a different scholar and a different city of origin. The provenance is hopelessly tangled in the ledgers; your grid must do what the librarians could not.",
      ],
      cats: [
        { name: "Scholar", role: "person", items: ["al-Khwarizmi", "al-Kindi", "Banu Musa", "Hunayn", "al-Jazari", "Thabit", "al-Razi"] },
        { name: "Mechanism", role: "artifact", items: ["geared abacus", "water clock", "brass automaton", "lens array", "vacuum flask", "wind rotor", "ink press"] },
        { name: "Origin", role: "place", items: ["Basra", "Kufa", "Merv", "Samarkand", "Cordoba", "Cairo", "Nishapur"] },
      ],
    },
    {
      era: "Renaissance Florence", place: "Florence, the Signoria", range: [1440, 1540],
      title: ["The Florence Reactor", "Da Vinci's Spare Parts", "The Medici Capacitor", "Engines of the Duomo"],
      scen: () => [
        "A workshop a stone's throw from the Duomo holds apparatus its makers could not possibly have built. Glass jars store captured lightning; coiled springs drive engines that belong to a century not yet born.",
        "Four pieces surfaced under four patrons, each handled by a different master of the craft. Reconstruct who held what, and in which year, before the anomaly is quietly written into the histories as genius.",
      ],
      cats: [
        { name: "Master", role: "person", items: ["Leonardo", "Brunelleschi", "Toscanelli", "Alberti", "Verrocchio", "Botticelli", "della Francesca"] },
        { name: "Apparatus", role: "artifact", items: ["leyden jar", "spring motor", "optical bench", "ball bearing", "carbon filament", "pressure gauge", "gear train"] },
        { name: "Patron", role: "person", items: ["Cosimo", "Lorenzo", "Sforza", "Este", "Gonzaga", "Borgia", "Pazzi"] },
      ],
    },
    {
      era: "Age of Sail", place: "Lisbon & the Atlantic", range: [1480, 1620],
      title: ["The Longitude Stone", "Charts of the Wrong Sea", "The Navigator's Anomaly", "Tidewater Transmission"],
      scen: () => [
        "A caravel returns from the Atlantic carrying charts of coastlines no European eye has seen — drawn to a precision no sextant of the age could possibly produce. The pilot cannot say where the charts came from, only that they were always aboard.",
        "Four instruments came aboard across four voyages, each tied to a navigator and a named vessel. The logbooks contradict one another at every turn; only careful deduction settles which is true.",
      ],
      cats: [
        { name: "Navigator", role: "person", items: ["da Gama", "Magellan", "Cabral", "Dias", "Cão", "Coelho", "Nunes"] },
        { name: "Instrument", role: "artifact", items: ["marine chronometer", "radio sextant", "gyrocompass", "depth sounder", "signal lamp", "tide computer", "wind vane"] },
        { name: "Vessel", role: "vessel", items: ["São Gabriel", "Victoria", "Berrio", "São Rafael", "Trinidad", "Concepción", "Santiago"] },
      ],
    },
    {
      era: "Industrial London", place: "London, British Empire", range: [1840, 1905],
      title: ["The London Signal", "Pocket Telephones on the Strand", "Gaslight Frequencies", "The Crystal Palace Current"],
      scen: () => [
        "Every constable on the Strand carries a glass slab that glows and answers aloud when spoken to. Gaslight London thinks nothing of it. That collective indifference — a whole city failing to notice the impossible — is the damage the Agency was sent to treat.",
        "Four components entered the city across four years, each through a different courier and a different district. Trace their arrival before the anachronism hardens into accepted history.",
      ],
      cats: [
        { name: "Courier", role: "person", items: ["Cole", "Halász", "Raman", "Thorn", "Wren", "Pike", "Quill"] },
        { name: "Component", role: "artifact", items: ["touchscreen", "battery cell", "circuit board", "antenna coil", "glass diode", "ribbon cable", "speaker membrane"] },
        { name: "District", role: "place", items: ["Whitechapel", "Mayfair", "Southwark", "Holborn", "Greenwich", "Camden", "the Strand"] },
      ],
    },
    {
      era: "Belle Époque Paris", place: "Paris, Third Republic", range: [1875, 1914],
      title: ["The Velvet Frequency", "Static at the Exposition", "The Moulin Transmission", "Wires Beneath Montmartre"],
      scen: () => [
        "At the Exposition Universelle, a darkened pavilion projects moving pictures with sound — an art that should be decades away. The crowds queue patiently, marvel politely, and ask no questions at all.",
        "Four parts were smuggled into the fair under four exhibitors, each housed in a different pavilion. Reconstruct the chain of delivery before the broadcast loops and the future leaks further into the past.",
      ],
      cats: [
        { name: "Exhibitor", role: "person", items: ["Curie", "Lumière", "Eiffel", "Bartholdi", "Nadar", "Daguerre", "Carnot"] },
        { name: "Part", role: "artifact", items: ["cathode tube", "film reel", "amplifier", "phosphor screen", "selenium cell", "tuning coil", "carbon mic"] },
        { name: "Pavilion", role: "place", items: ["Palais", "Trocadéro", "Champ de Mars", "Les Invalides", "Grand Palais", "Quai d'Orsay", "Galerie"] },
      ],
    },
    {
      era: "American Frontier", place: "the Western Territories", range: [1850, 1890],
      title: ["Frostfall Engines", "Telegraph Without Wires", "The Silver Lode Anomaly", "Steam on the High Plains"],
      scen: () => [
        "A mining camp on the high plains runs on machines no foundry of the era has ever cast. Arc light burns clean through the blizzard; engines turn through the night that not a soul in the territory can account for.",
        "Four crates came west across four seasons, each unloaded by a different prospector at a different camp. The freight ledgers are the only thread leading back to the truth — follow them.",
      ],
      cats: [
        { name: "Prospector", role: "person", items: ["Calloway", "Bishop", "Reed", "Santos", "Doyle", "Hart", "Okafor"] },
        { name: "Machine", role: "artifact", items: ["arc welder", "ore separator", "wireless key", "diesel pump", "ball mill", "dynamo", "rock drill"] },
        { name: "Camp", role: "place", items: ["Dry Gulch", "Silverton", "Bode", "Calico", "Virginia City", "Leadville", "Tombstone"] },
      ],
    },
    {
      era: "The Cartographers' Guild", place: "Antwerp, the Low Countries", range: [1560, 1660],
      title: ["The Cartographer's Error", "Maps of a Round Tomorrow", "The Projection Engine", "Ink From the Future"],
      scen: () => [
        "An atlas surfaces in the Low Countries with coastlines accurate to the satellite age — engraved two full centuries before any such view of the Earth was possible. The guild swears the plates are their own work.",
        "Four plates were cut under four masters, each at a different press. Establish the order in which they were made before the maps are bound, sold, and folded into the record as fact.",
      ],
      cats: [
        { name: "Cartographer", role: "person", items: ["Mercator", "Ortelius", "Blaeu", "Hondius", "Plancius", "Waghenaer", "Visscher"] },
        { name: "Plate", role: "artifact", items: ["polar projection", "photo plate", "contour engraving", "grid overlay", "relief block", "tide chart", "star map"] },
        { name: "Press", role: "place", items: ["Antwerp", "Amsterdam", "Leuven", "Duisburg", "Haarlem", "Ghent", "Bruges"] },
      ],
    },
    {
      era: "WWI Signals", place: "the Western Front", range: [1914, 1919],
      title: ["The Byzantine Network", "Trench Frequencies", "The Cipher That Wasn't", "Static in No Man's Land"],
      scen: () => [
        "Along the Western Front, field radios decode messages that have not yet been sent. Operators read tomorrow's orders today, and the battalions march to them as if it were the most natural thing in the world.",
        "Four sets were issued across four offensives, each to a different operator in a different sector. Reconstruct the issue record before the loop closes and cause forgets which way it is meant to run.",
      ],
      cats: [
        { name: "Operator", role: "person", items: ["Sable", "Mercer", "Ito", "Novak", "Faye", "Brandt", "Osei"] },
        { name: "Set", role: "artifact", items: ["valve receiver", "encryption drum", "signal booster", "wave detector", "field battery", "headset array", "tuning fork"] },
        { name: "Sector", role: "place", items: ["the Somme", "Verdun", "Ypres", "Arras", "the Marne", "Cambrai", "Vimy"] },
      ],
    },
    {
      era: "The Antarctic Survey", place: "Ross Ice Shelf, Antarctica", range: [1908, 1958],
      title: ["The Antarctic Beacon", "Signal Under the Ice", "The Frozen Transmitter", "Aurora Static"],
      scen: () => [
        "A survey team cutting an ice core strikes metal where there should be only ancient ice: a transmitter buried far deeper — and far older — than any human expedition could have reached. It is still faintly, impossibly warm.",
        "Four caches were logged across four seasons, each buried by a different surveyor at a different depot. The field journals disagree with one another; the grid will not.",
      ],
      cats: [
        { name: "Surveyor", role: "person", items: ["Shackleton", "Mawson", "Byrd", "Amundsen", "Scott", "Fuchs", "Hillary"] },
        { name: "Cache", role: "artifact", items: ["ice-core beacon", "solar panel", "radio mast", "battery sled", "weather drone", "seismic node", "fuel cell"] },
        { name: "Depot", role: "place", items: ["Cape Evans", "Framheim", "Little America", "McMurdo", "Hut Point", "Vahsel Bay", "Cape Royds"] },
      ],
    },
    {
      era: "The Space Race", place: "low Earth orbit & Baikonur", range: [1957, 1979],
      title: ["Null Meridian", "The Extra Satellite", "Telemetry From Nowhere", "The Orbit That Shouldn't Be"],
      scen: () => [
        "Ground control is tracking a satellite that no nation on Earth will admit to launching. Its telemetry is clean, deliberate, and patient — and it is addressed, as far as anyone can tell, to no one at all.",
        "Four payloads went up across four launch windows, each cleared by a different controller from a different pad. Reconstruct the true manifest before the orbit decays and takes the evidence down with it.",
      ],
      cats: [
        { name: "Controller", role: "person", items: ["Korolev", "Glennan", "Kovács", "Mbeki", "Renard", "Sato", "Lindqvist"] },
        { name: "Payload", role: "artifact", items: ["guidance computer", "solar array", "ion thruster", "telemetry pod", "camera module", "fuel cell", "antenna dish"] },
        { name: "Pad", role: "place", items: ["Baikonur", "Cape Canaveral", "Kourou", "Plesetsk", "Vandenberg", "Tanegashima", "Woomera"] },
      ],
    },
    {
      era: "The Records Vault", place: "Time Correction Agency — Vault", range: [1908, 2061],
      title: ["The Closed Loop", "Five Keys to Nowhere", "The Recursive Census", "Files Without an Author"],
      scen: () => [
        "The files surfaced from the Agency's own sealed vault, describing a chain of events with no beginning — each entry citing the one before it, on and on, back past the founding and into a year that has not happened yet.",
        "Four agents logged four objects across four years, each object bound to an event in the Agency's own history. Reconstruct the loop — if a loop with no first link can be reconstructed at all.",
      ],
      cats: [
        { name: "Agent", role: "person", items: ["Vance", "Okonkwo", "Reyes", "Cipher", "Solveig", "Mara", "Idris"] },
        { name: "Object", role: "artifact", items: ["cracked watch", "glass vial", "black cube", "torn page", "brass key", "lead seal", "wax cylinder"] },
        { name: "Event", role: "event", items: ["the Return", "the Memory Wipe", "the First Broadcast", "the Founding", "the Quiet War", "the Severance", "the Eclipse"] },
      ],
    },
  ];

  // ---------------- evidence: source voices ----------------
  const SOURCE = {
    Ledger: "Quartermaster's ledger", Dispatch: "Intercepted dispatch", Record: "Agency record",
    Manifest: "Cargo manifest", Document: "Recovered document", Eyewitness: "Eyewitness deposition",
    Customs: "Customs seal", Archive: "Archive cross-reference", Transcript: "Interrogation transcript",
    "Field note": "Field investigator's note",
  };
  const VOICE = Object.keys(SOURCE);
  const TAILS = [
    "", "", "", // ~ half get no tail
    " The dating held up under review.",
    " The provenance is not in dispute.",
    " No other reading survives scrutiny.",
    " This much, at least, is certain.",
    " Control has countersigned the entry.",
    " The seal was found intact.",
    " Cross-checks confirm it.",
  ];

  function endLabel(cats, ep) {
    if (ep.c === 0) return { txt: cats[0].items[ep.i].label, role: "year", year: true };
    const cat = cats[ep.c];
    return { txt: cat.items[ep.i].label, role: cat.role, year: false };
  }
  function pick(arr, v) { return arr[v % arr.length]; }

  // year + item  (SAME)
  function yearItemFact(year, item, v) {
    if (THING[item.role]) {
      return pick([
        `The ${item.txt} surfaces in the ${year} stratum, and in no other.`,
        `Whatever else is in doubt, the ${item.txt} is dated firmly to ${year}.`,
        `The ${year} file is built around the ${item.txt}.`,
      ], v);
    }
    const t = cap(item.txt);
    return pick([
      `${t} stands at the centre of the ${year} file.`,
      `${t} belongs to ${year}, and to no other year.`,
      `Everything dated ${year} points back to ${item.txt}.`,
    ], v);
  }
  // two non-year items (SAME)
  function pairFact(A, B, v) {
    const byRole = {};
    [A, B].forEach((e) => { (byRole[e.role] = byRole[e.role] || []).push(e); });
    const P = byRole.person, R = byRole.artifact, L = byRole.place, Ev = byRole.event, Ve = byRole.vessel;
    const theOf = (e) => det(e.role) + e.txt;
    if (P && R) return pick([
      `${P[0].txt} was the one issued the ${R[0].txt}, and kept it.`,
      `Trace the ${R[0].txt} and you find ${P[0].txt} holding it.`,
    ], v);
    if (P && L) return pick([
      `${P[0].txt} worked out of ${L[0].txt}, never elsewhere.`,
      `${L[0].txt} was ${P[0].txt}'s posting.`,
    ], v);
    if (P && Ev) return pick([
      `${P[0].txt} is bound, name and record, to ${Ev[0].txt}.`,
      `Where ${Ev[0].txt} appears, ${P[0].txt} is behind it.`,
    ], v);
    if (P && Ve) return `${P[0].txt} sailed aboard ${theOf(Ve[0])}.`;
    if (R && L) return pick([
      `${cap(det(R[0].role)+R[0].txt)} was recovered at ${L[0].txt}.`,
      `${L[0].txt} is where the ${R[0].txt} turned up.`,
    ], v);
    if (R && Ev) return pick([
      `${cap(det(R[0].role)+R[0].txt)} first surfaced during ${Ev[0].txt}.`,
      `The ${R[0].txt} is tied to ${Ev[0].txt}.`,
    ], v);
    if (R && Ve) return `${cap(det(R[0].role)+R[0].txt)} was stowed aboard ${theOf(Ve[0])}.`;
    if (P && P) return `${A.txt} answered directly to ${B.txt}.`;
    if (L && Ev) return `${cap(Ev[0].txt)} unfolded at ${L[0].txt}.`;
    return `${cap(theOf(A))} is linked to ${theOf(B)}.`;
  }
  // DIFF
  function diffFact(A, B, v) {
    if (A.year || B.year) {
      const yr = A.year ? A.txt : B.txt, it = A.year ? B : A;
      return pick([
        `Rule out ${yr} for ${det(it.role)}${it.txt} — the dating excludes it.`,
        `${cap(det(it.role)+it.txt)} does not belong to ${yr}.`,
      ], v);
    }
    return pick([
      `Whatever ties to ${det(B.role)}${B.txt}, it is not ${det(A.role)}${A.txt}.`,
      `${cap(det(A.role)+A.txt)} and ${det(B.role)}${B.txt} share no entry.`,
    ], v);
  }
  // LT (A strictly before B)
  function beforeFact(A, B, v) {
    if (A.year) return pick([
      `${cap(det(B.role)+B.txt)} is dated later than ${A.txt}.`,
      `Nothing places ${det(B.role)}${B.txt} as early as ${A.txt}; it comes after.`,
    ], v);
    if (B.year) return pick([
      `${cap(det(A.role)+A.txt)} predates ${B.txt}.`,
      `${cap(det(A.role)+A.txt)} was already on record before ${B.txt}.`,
    ], v);
    return pick([
      `${cap(det(A.role)+A.txt)} comes earlier in the sequence than ${det(B.role)}${B.txt}.`,
      `Whatever their exact dates, ${det(A.role)}${A.txt} precedes ${det(B.role)}${B.txt}.`,
    ], v);
  }
  // ADJ (A immediately before B)
  function adjFact(A, B, v) {
    if (A.year) return `${cap(det(B.role)+B.txt)} is the very next entry after ${A.txt}, with nothing between.`;
    if (B.year) return `${cap(det(A.role)+A.txt)} is the entry immediately before ${B.txt}.`;
    return `${cap(det(A.role)+A.txt)} sits one step earlier than ${det(B.role)}${B.txt} — directly adjacent on the timeline.`;
  }

  function clueFact(type, A, B, v) {
    if (type === "SAME") {
      if (A.year) return yearItemFact(A.txt, B, v);
      if (B.year) return yearItemFact(B.txt, A, v);
      return pairFact(A, B, v);
    }
    if (type === "DIFF") return diffFact(A, B, v);
    if (type === "LT") return beforeFact(A, B, v);
    if (type === "ADJ") return adjFact(A, B, v);
    return "";
  }
  function voiceWrap(voice, fact, idx) {
    const label = SOURCE[voice] || "Agency record";
    const tail = pick(TAILS, idx * 3 + 1);
    return `<span class="cl-src">${label}</span>${fact}${tail}`;
  }

  // ---------------- build ----------------
  let codeCount = 0;
  const CODE_PREFIX = { 1: "DST", 2: "DST", 3: "DVG", 4: "DVG", 5: "CLP" };

  function directive(cats, K, N, v) {
    const list = cats.slice(1).map((c) => c.name).join(", ");
    return pick([
      `Reconstruct the full chain. There are ${N} years, and to each belongs a single ${cats.slice(1).map(c=>c.name.toLowerCase()).join(", a ")}. Every entry appears exactly once — cross the evidence until only one arrangement survives.`,
      `File the complete record: ${N} years set against ${list}. No entry repeats. Mark the grid from the evidence below until a single timeline holds together.`,
      `Establish the order. ${N} years and ${K - 1} categories — ${list} — each appearing exactly once. Work the evidence down to the only configuration it permits.`,
    ], v);
  }

  function buildPuzzle(gen, skin, meta) {
    const { K, N } = gen;
    const years = E.pickYears(skin.range[0], skin.range[1], N);
    const cats = [{ id: "anchor", name: "Year", role: "year", items: years.map((y, r) => ({ id: "y" + r, label: E.yLabel(y) })) }];
    const chosenCats = skin.cats.slice(0, K - 1);
    chosenCats.forEach((cdef, ci) => {
      const picked = E.sample(cdef.items, N);
      cats.push({ id: "c" + ci, name: cdef.name, role: cdef.role, items: picked.map((lab, idx) => ({ id: "c" + ci + "_" + idx, label: lab })) });
    });
    const solution = [];
    for (let r = 0; r < N; r++) {
      const row = { anchor: "y" + r };
      for (let c = 1; c < K; c++) row["c" + (c - 1)] = "c" + (c - 1) + "_" + gen.sol[c][r];
      solution.push(row);
    }
    // clues — sourced, detailed evidence
    const voices = E.shuffle(VOICE);
    const clues = gen.clues.map((cl, i) => {
      const A = endLabel(cats, cl.a), B = endLabel(cats, cl.b);
      const fact = clueFact(cl.type, A, B, i);
      return { type: voices[i % voices.length], text: voiceWrap(voices[i % voices.length], fact, i) };
    });
    if (meta.unstable) {
      let made = null, guard = 0;
      while (!made && guard++ < 80) {
        const c1 = 1 + E.ri(K - 1); const c2 = 1 + E.ri(K - 1);
        if (c1 === c2 || c1 >= K || c2 >= K) continue;
        const r1 = E.ri(N), r2 = E.ri(N);
        if (r1 === r2) continue;
        const A = endLabel(cats, { c: c1, i: gen.sol[c1][r1] });
        const B = endLabel(cats, { c: c2, i: gen.sol[c2][r2] });
        made = { type: "Corrupted", text: `<span class="cl-src cl-src-bad">Corrupted record</span>${pairFact(A, B, 0)}`, unstable: true };
      }
      if (made) clues.push(made);
    }
    clues.forEach((c, i) => c.n = i + 1);

    const keyCatIdx = Math.max(1, cats.findIndex((c) => c.role === "artifact"));
    const keyCat = cats[keyCatIdx] || cats[1];
    const keyItem = keyCat.items[gen.sol[keyCatIdx][0]];
    const divergence = {
      year: cats[0].items[0].label,
      text: `The keystone is ${det(keyCat.role)}${keyItem.label}, fixed to ${cats[0].items[0].label} — the earliest anomaly in the chain. Remove it and the whole cascade unwinds.`,
    };
    const walkthrough = solution.map((row) => {
      const parts = cats.slice(1).map((c) => {
        const it = c.items.find((x) => x.id === row[c.id]);
        return `${c.name.toLowerCase()} ${it.label}`;
      });
      const yr = cats[0].items.find((x) => x.id === row.anchor).label;
      return `${yr}: ${parts.join(", ")}.`;
    });
    const explanation = [
      `Cross the reliable evidence and each year resolves to exactly one full row${meta.unstable ? " — once the corrupted record is discarded" : ""}. The grid below is the only configuration consistent with every clue.`,
    ];

    codeCount++;
    const code = `${CODE_PREFIX[meta.tier]}-${String(Math.abs(years[0])).padStart(4, "0")}-${String.fromCharCode(65 + (codeCount % 26))}`;
    const title = skin.title[meta.titleIdx % skin.title.length];
    const story = skin.scen();
    return {
      id: meta.id, code, tier: meta.tier, tierName: meta.tierName,
      title, place: skin.place, era: skin.era,
      eraLabel: `${E.yLabel(years[0])} — ${E.yLabel(years[N - 1])}`,
      scenario: [...story, directive(cats, K, N, meta.dirIdx || 0)],
      categories: cats, solution, clues, divergence, walkthrough, explanation,
      unstable: !!meta.unstable, K, N,
    };
  }

  globalThis.CONTENT = { skins, buildPuzzle };
})();
