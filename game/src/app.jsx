/* TIMELINE — shared UI atoms */

const { useState, useEffect, useRef } = React;

/* Paradox / instability meter (lives in the topbar) */
function ParadoxMeter({ value }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="meter" title="Local timeline instability">
      <span className="lbl">Paradox</span>
      <div className="track"><div className="fill" style={{ width: v + "%" }} /></div>
      <span className="val">{v}%</span>
    </div>
  );
}

/* A single transmission line from CONTROL, typed in. */
function Transmission({ from, text, delay = 0, onDone, instant = false }) {
  const [shown, setShown] = useState(instant ? text : "");
  const [done, setDone] = useState(instant);
  const [started, setStarted] = useState(instant);

  useEffect(() => {
    if (instant) { onDone && onDone(); return; }
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || instant) return;
    let i = 0;
    const plain = text;
    const id = setInterval(() => {
      i += 2;
      setShown(plain.slice(0, i));
      if (i >= plain.length) {
        clearInterval(id);
        setShown(plain);
        setDone(true);
        onDone && onDone();
      }
    }, 12);
    return () => clearInterval(id);
  }, [started]);

  if (!started) return null;

  return (
    <div className="tx rise">
      <div className="tx-from mono">{from}</div>
      <div className="tx-body" dangerouslySetInnerHTML={{ __html: shown + (done ? "" : "<span class='caret'></span>") }} />
    </div>
  );
}

/* A sequence of transmissions that reveal one after another. */
function TransmissionLog({ lines, onComplete }) {
  const [revealed, setRevealed] = useState(1);
  const endRef = useRef(null);

  useEffect(() => {
    if (revealed >= lines.length) { onComplete && onComplete(); }
  }, [revealed]);

  return (
    <div className="tx-log">
      {lines.slice(0, revealed).map((l, i) => (
        <Transmission
          key={i}
          from={l.from}
          text={l.text}
          onDone={() => { if (i === revealed - 1 && revealed < lines.length) {
            setTimeout(() => setRevealed((r) => r + 1), 360);
          } }}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}

Object.assign(window, { ParadoxMeter, Transmission, TransmissionLog });


/* === */

/* TIMELINE — LogicGrid: generic pairwise deduction grid.
 * marks[pairKey][aId][bId] = 0 (blank) | 1 (true / ✓) | 2 (ruled out / ✗)
 * pairKey = `${catA.id}__${catB.id}` (catA precedes catB in puzzle order)
 */

function pairKey(aId, bId) { return aId + "__" + bId; }

function buildPairs(categories) {
  const pairs = [];
  for (let i = 0; i < categories.length; i++)
    for (let j = i + 1; j < categories.length; j++)
      pairs.push([categories[i], categories[j]]);
  return pairs;
}

function LogicGrid({ puzzle, marks, setMarks }) {
  const pairs = buildPairs(puzzle.categories);

  function cycle(pk, aId, bId) {
    setMarks((prev) => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      next[pk] = next[pk] || {};
      next[pk][aId] = next[pk][aId] || {};
      const cur = next[pk][aId][bId] || 0;
      const val = (cur + 1) % 3;
      next[pk][aId][bId] = val;

      // auto-eliminate the row & column within this sub-grid on a ✓
      if (val === 1) {
        const [catA, catB] = pairs.find(([a, b]) => pairKey(a.id, b.id) === pk);
        catB.items.forEach((b) => {
          if (b.id !== bId) {
            next[pk][aId][b.id] = next[pk][aId][b.id] === 1 ? 1 : 2;
          }
        });
        catA.items.forEach((a) => {
          if (a.id !== aId) {
            next[pk][a.id] = next[pk][a.id] || {};
            next[pk][a.id][bId] = next[pk][a.id][bId] === 1 ? 1 : 2;
          }
        });
      }
      return next;
    });
  }

  return (
    <div className="grid-wrap">
      <div className="grid-blocks">
        {pairs.map(([catA, catB]) => {
          const pk = pairKey(catA.id, catB.id);
          return (
            <div className="gblock" key={pk}>
              <table className="gtable">
                <thead>
                  <tr>
                    <th className="gcorner">
                      <span className="ga">{catA.name}</span>
                      <span className="gx">×</span>
                      <span className="gb">{catB.name}</span>
                    </th>
                    {catB.items.map((b) => (
                      <th className="gcolh" key={b.id}>
                        <span>{b.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catA.items.map((a) => (
                    <tr key={a.id}>
                      <th className="growh">{a.label}</th>
                      {catB.items.map((b) => {
                        const v = (marks[pk] && marks[pk][a.id] && marks[pk][a.id][b.id]) || 0;
                        return (
                          <td
                            key={b.id}
                            className={"gcell" + (v === 1 ? " is-yes" : v === 2 ? " is-no" : "")}
                            onClick={() => cycle(pk, a.id, b.id)}
                          >
                            {v === 1 ? <span className="mk-yes">✓</span>
                              : v === 2 ? <span className="mk-no">✕</span> : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <div className="grid-legend mono">
        <span><i className="lg-cell" /> unknown</span>
        <span><i className="lg-cell"><b className="mk-yes">✓</b></i> confirmed true</span>
        <span><i className="lg-cell"><b className="mk-no">✕</b></i> ruled out</span>
        <span className="lg-hint">click a cell to cycle · a ✓ auto-rules-out its row &amp; column</span>
      </div>
    </div>
  );
}

Object.assign(window, { LogicGrid, pairKey, buildPairs });


/* === */

/* TIMELINE — TimelineViz: live chronological visualization of confirmed marks.
 * Anchor category = categories[0]; its items are listed in chronological order.
 * For each anchor item we surface whatever the player has confirmed (✓).
 */

function TimelineViz({ puzzle, marks, solved }) {
  const cats = puzzle.categories;
  const anchor = cats[0];
  const others = cats.slice(1);

  function confirmedFor(anchorItemId, otherCat) {
    const pk = pairKey(anchor.id, otherCat.id);
    const row = marks[pk] && marks[pk][anchorItemId];
    if (!row) return null;
    const hit = otherCat.items.find((it) => row[it.id] === 1);
    return hit || null;
  }

  const divLabel = puzzle.divergence.year;

  return (
    <div className={"tlviz" + (solved ? " solved" : "")}>
      <div className="tlviz-head mono">
        <span className="kicker">Timeline Visualization</span>
        <span className="tlviz-state">
          {solved ? "● restored — chain stable" : "● reconstructing — confirmed links only"}
        </span>
      </div>

      <div className="tlviz-track" style={{ "--cols": anchor.items.length }}>
        <div className="tlviz-axis" />
        {anchor.items.map((yr, i) => {
          const above = i % 2 === 0;
          const isDiv = solved && yr.label === divLabel;
          const card = (
            <div className={"tlviz-card" + (isDiv ? " is-div" : "")}>
              {others.map((c) => {
                const hit = confirmedFor(yr.id, c);
                return (
                  <div className="tlviz-attr" key={c.id}>
                    <span className="tlviz-cat mono">{c.name}</span>
                    <span className={"tlviz-val" + (hit ? "" : " unknown")}>
                      {hit ? hit.label : "—"}
                    </span>
                  </div>
                );
              })}
              {isDiv && <div className="tlviz-divtag mono">⚠ Divergence point</div>}
            </div>
          );
          return (
            <div className={"tlviz-node" + (above ? " above" : " below")} key={yr.id}>
              <div className="tlviz-slot top">{above ? card : null}</div>
              <div className={"tlviz-dot" + (isDiv ? " is-div" : "")} />
              <div className="tlviz-year mono">{yr.label}</div>
              <div className="tlviz-slot bot">{!above ? card : null}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TimelineViz });


/* === */

/* TIMELINE — PuzzleView: one full case (scenario, clues, grid, hints, answer, solution) */

function PuzzleView(props) {
  const { puzzle, marks, setMarks, hintsUsed, onUseHint,
          solved, onSolve, finalSel, setFinalSel, onAdvance, onWrong, isLast, isStory } = props;

  const [view, setView] = useState("grid");           // grid | timeline
  const [submitted, setSubmitted] = useState(solved);
  const [rowResults, setRowResults] = useState(null);
  const [revealed, setRevealed] = useState(solved);
  const [shake, setShake] = useState(false);

  const cats = puzzle.categories;
  const anchor = cats[0];
  const others = cats.slice(1);

  // solution lookup: byAnchor[anchorItemId][catId] = itemId
  const byAnchor = {};
  puzzle.solution.forEach((row) => {
    byAnchor[row[anchor.id]] = row;
  });

  function setSel(anchorId, catId, val) {
    const next = JSON.parse(JSON.stringify(finalSel || {}));
    next[anchorId] = next[anchorId] || {};
    next[anchorId][catId] = val;
    setFinalSel(next);
  }

  function pullFromGrid() {
    const next = JSON.parse(JSON.stringify(finalSel || {}));
    anchor.items.forEach((a) => {
      next[a.id] = next[a.id] || {};
      others.forEach((c) => {
        const pk = pairKey(anchor.id, c.id);
        const row = marks[pk] && marks[pk][a.id];
        if (row) {
          const hit = c.items.filter((it) => row[it.id] === 1);
          if (hit.length === 1) next[a.id][c.id] = hit[0].id;
        }
      });
    });
    setFinalSel(next);
  }

  function allFilled() {
    return anchor.items.every((a) =>
      others.every((c) => finalSel[a.id] && finalSel[a.id][c.id]));
  }

  function submit() {
    const results = anchor.items.map((a) => {
      const correct = others.every((c) => finalSel[a.id] && finalSel[a.id][c.id] === byAnchor[a.id][c.id]);
      return { id: a.id, correct };
    });
    setRowResults(results);
    setSubmitted(true);
    const allCorrect = results.every((r) => r.correct);
    if (allCorrect) {
      setRevealed(true);
      onSolve();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onWrong();
    }
  }

  function giveUp() {
    // fill selects with the solution, reveal
    const next = {};
    anchor.items.forEach((a) => {
      next[a.id] = {};
      others.forEach((c) => { next[a.id][c.id] = byAnchor[a.id][c.id]; });
    });
    setFinalSel(next);
    setRevealed(true);
    setSubmitted(true);
    setRowResults(anchor.items.map((a) => ({ id: a.id, correct: true })));
    onSolve(true);
  }

  const tier = window.TIMELINE.TIER[puzzle.tier];
  const labelFor = (catId, itemId) => {
    const c = cats.find((x) => x.id === catId);
    const it = c.items.find((x) => x.id === itemId);
    return it ? it.label : "";
  };

  return (
    <div className="pv fade-in">
      {/* ---- scenario header ---- */}
      <header className="pv-head">
        <div className="pv-meta mono">
          <span className="pv-code">{puzzle.code}</span>
          <span className="pv-tier">{tier.label} · {tier.name}</span>
          <span className="pv-era">{puzzle.eraLabel}</span>
        </div>
        <h1 className="pv-title">{puzzle.title}</h1>
        <div className="pv-place mono">{puzzle.place}</div>
        <div className="pv-scenario">
          {puzzle.scenario.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </header>

      <div className="pv-body">
        {/* ---- left: clues + hints ---- */}
        <aside className="pv-clues">
          <div className="pv-section-h mono">
            <span>Evidence</span><span className="pv-count">{puzzle.clues.length} records</span>
          </div>
          <ol className="cluelist">
            {puzzle.clues.map((c, i) => (
              <li key={i} className={"clue" + (c.unstable ? " unstable" : "")}>
                <div className="clue-top">
                  <span className="clue-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className={"tag" + (c.unstable ? " unstable" : "")}>
                    {c.unstable ? "⚠ Unstable" : c.type}
                  </span>
                </div>
                <p className="clue-text" dangerouslySetInnerHTML={{ __html: c.text }} />
              </li>
            ))}
          </ol>

          <div className="hintbox">
            <div className="pv-section-h mono"><span>Agency Hints</span></div>
            {[0, 1, 2].map((i) => {
              const titles = ["Gentle nudge", "Structural hint", "Near-solution"];
              if (i < hintsUsed) {
                return (
                  <div className="hint revealed rise" key={i}>
                    <span className="hint-lbl mono">{titles[i]}</span>
                    <p>{puzzle.hints[i]}</p>
                  </div>
                );
              }
              if (i === hintsUsed) {
                return (
                  <button className="btn btn-ghost btn-sm hint-btn" key={i} onClick={onUseHint}>
                    Request {titles[i].toLowerCase()} →
                  </button>
                );
              }
              return null;
            })}
            {hintsUsed >= 3 && <p className="hint-exhausted mono">All hints disclosed. Instability rising.</p>}
          </div>
        </aside>

        {/* ---- right: workspace ---- */}
        <section className="pv-work">
          <div className="pv-toolbar">
            <div className="seg mono">
              <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>Deduction Grid</button>
              <button className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}>Timeline View</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              if (confirm("Clear all grid marks for this case?")) setMarks(() => ({}));
            }}>Clear grid</button>
          </div>

          {view === "grid"
            ? <LogicGrid puzzle={puzzle} marks={marks} setMarks={setMarks} />
            : <TimelineViz puzzle={puzzle} marks={marks} solved={revealed} />}

          {/* ---- final answer ---- */}
          <div className={"answer" + (shake ? " shake" : "")}>
            <div className="pv-section-h mono">
              <span>Restore the Timeline</span>
              {!revealed && <button className="btn btn-ghost btn-sm" onClick={pullFromGrid}>Fill from grid ↥</button>}
            </div>
            <div className="ans-table-wrap">
              <table className="ans-table">
                <thead>
                  <tr>
                    <th className="mono">{anchor.name}</th>
                    {others.map((c) => <th key={c.id} className="mono">{c.name}</th>)}
                    {submitted && <th className="mono ans-st">✓</th>}
                  </tr>
                </thead>
                <tbody>
                  {anchor.items.map((a) => {
                    const res = rowResults && rowResults.find((r) => r.id === a.id);
                    return (
                      <tr key={a.id} className={res ? (res.correct ? "ok" : "bad") : ""}>
                        <th className="mono ans-anchor">{a.label}</th>
                        {others.map((c) => (
                          <td key={c.id}>
                            {revealed ? (
                              <span className="ans-locked">{labelFor(c.id, byAnchor[a.id][c.id])}</span>
                            ) : (
                              <select
                                value={(finalSel[a.id] && finalSel[a.id][c.id]) || ""}
                                onChange={(e) => setSel(a.id, c.id, e.target.value)}
                              >
                                <option value="">— select —</option>
                                {c.items.map((it) => (
                                  <option key={it.id} value={it.id}>{it.label}</option>
                                ))}
                              </select>
                            )}
                          </td>
                        ))}
                        {submitted && (
                          <td className="ans-st">{res && res.correct ? "✓" : <span className="accent">✕</span>}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!revealed && (
              <div className="ans-actions">
                <button className="btn btn-accent" disabled={!allFilled()} onClick={submit}>
                  Submit reconstruction
                </button>
                <button className="btn-link mono" onClick={giveUp}>Reveal solution</button>
                {submitted && rowResults && !rowResults.every((r) => r.correct) && (
                  <span className="ans-feedback mono">
                    {rowResults.filter((r) => r.correct).length}/{anchor.items.length} rows correct — paradox deepening
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ---- solution ---- */}
          {revealed && (
            <div className="solution rise">
              <div className="sol-tag mono">▣ Timeline restored</div>
              <div className="divergence">
                <div className="div-yr mono">{puzzle.divergence.year}</div>
                <div className="div-body">
                  <div className="div-lbl mono">Divergence point · keystone</div>
                  <p>{puzzle.divergence.text}</p>
                </div>
              </div>

              <div className="sol-rule">
                <span className="kicker">Hidden rule</span>
                <p className="sol-hidden">{puzzle.hiddenRule}</p>
              </div>

              <div className="sol-explain">
                <span className="kicker">Reconstruction</span>
                {puzzle.explanation.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>

              <div className="sol-walk">
                <span className="kicker">Reasoning walkthrough</span>
                <ol>{puzzle.walkthrough.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>

              <button className="btn btn-accent sol-next" onClick={onAdvance}>
                {isStory ? (isLast ? "Transmit findings to Control →" : "File report · receive directive →") : "Return to Case Index →"}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { PuzzleView });


/* === */

/* TIMELINE — App orchestrator: intro → Case Index → puzzles → beats → epilogue */

const TL = window.TIMELINE;
const SAVE_KEY = "timeline.save.v3";
const TIER_META = {
  1: { label: "Tier I", name: "Minor Distortions", note: "Single-change fractures. Direct records, clean elimination." },
  2: { label: "Tier II", name: "Multi-Event Divergence", note: "Conflicting anomalies share an era. Cross-reference to resolve." },
  3: { label: "Tier III", name: "Collapse Events", note: "Relational logic only — and one record in each case is a lie." },
};

function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.save) return s;
  } catch (e) {}
  return { phase: "intro", currentId: null,
    save: { marks: {}, hints: {}, wrong: {}, solved: {}, final: {} } };
}

const isStory = (p) => !p.generated;

/* ---------- Intro onboarding ---------- */
function IntroScreen({ onBegin }) {
  return (
    <div className="intro fade-in">
      <div className="intro-hero">
        <div className="intro-kicker mono">Time Correction Agency · Field Investigator Onboarding</div>
        <h1 className="intro-title">TIME<span className="accent">LINE</span></h1>
        <p className="intro-tagline">History has been edited. You are the correction.</p>
      </div>
      <div className="intro-transmission panel">
        <div className="tx-channel mono">▸ SECURE CHANNEL · ORIGIN: CONTROL</div>
        <TransmissionLog lines={TL.agency.onboarding} />
        <div className="intro-cta ready">
          <button className="btn btn-accent" onClick={onBegin}>Enter the Case Index →</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Story beat between cases ---------- */
function BeatScreen({ lines, onContinue, isFinal }) {
  return (
    <div className="beat fade-in">
      <div className="intro-transmission panel beat-panel">
        <div className="tx-channel mono">▸ INCOMING · ORIGIN: CONTROL {isFinal ? "· PRIORITY ████" : ""}</div>
        <TransmissionLog lines={lines} />
        <div className="intro-cta ready">
          <button className="btn btn-accent" onClick={onContinue}>{onContinue.label || "Continue →"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Case Index (library hub) ---------- */
function CaseRow({ p, idx, solved, locked, onOpen }) {
  const story = isStory(p);
  return (
    <button
      className={"case-row" + (solved ? " solved" : "") + (locked ? " locked" : "") + (story ? " priority" : "")}
      disabled={locked}
      onClick={() => !locked && onOpen(p.id)}
    >
      <span className="cr-code mono">{p.code}</span>
      <span className="cr-main">
        <span className="cr-title">{p.title}{story && <span className="cr-prio mono">▣ Priority Directive</span>}</span>
        <span className="cr-place mono">{p.place} · {p.eraLabel}</span>
      </span>
      <span className="cr-meta mono">
        <span className="cr-chip">{p.categories[0].items.length}×{p.categories.length}</span>
        <span className="cr-chip">{(p.clues ? p.clues.length : p.clueCount)} clues</span>
      </span>
      <span className="cr-status mono">
        {locked ? "Sealed" : solved ? "✓ Restored" : story ? "Open ▸" : "Open ▸"}
      </span>
    </button>
  );
}

function CaseIndex({ save, onOpen, unlocked }) {
  const tiers = TL.tiers;
  const total = TL.allPuzzles.length;
  const solvedCount = TL.allPuzzles.filter((p) => save.solved[p.id]).length;
  const epilogueReady = !!save.solved.p3;

  return (
    <div className="caseindex fade-in">
      <header className="ci-head">
        <div>
          <div className="ci-kicker mono">Time Correction Agency · Field Dossier</div>
          <h1 className="ci-title">Case Index</h1>
        </div>
        <div className="ci-progress">
          <div className="ci-prog-num mono"><b>{solvedCount}</b> / {total}</div>
          <div className="ci-prog-lbl mono">timelines restored</div>
        </div>
      </header>

      {epilogueReady && (
        <button className="ci-epilogue" onClick={() => onOpen("__epilogue")}>
          <span className="mono">CASE FILE ∞ · UNRESOLVABLE</span>
          <span className="ci-epi-title">The loop is closed. Re-open the final transmission →</span>
        </button>
      )}

      {[1, 2, 3].map((t) => {
        const open = unlocked(t);
        const list = tiers[t];
        const meta = TIER_META[t];
        const solvedInTier = list.filter((p) => save.solved[p.id]).length;
        return (
          <section className={"ci-tier" + (open ? "" : " sealed")} key={t}>
            <div className="ci-tier-head">
              <div className="ci-tier-label">
                <span className="ci-tier-name mono">{meta.label} · {meta.name}</span>
                <span className="ci-tier-note">{meta.note}</span>
              </div>
              <div className="ci-tier-count mono">
                {open ? `${solvedInTier}/${list.length} restored` : `Sealed — clear the Tier ${t - 1} priority directive`}
              </div>
            </div>
            <div className="ci-rows">
              {list.map((p, i) => (
                <CaseRow key={p.id} p={p} idx={i}
                  solved={!!save.solved[p.id]} locked={!open}
                  onOpen={onOpen} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="ci-foot mono">TIMELINE · {total} cases across three tiers · deduction experience · TCA-ARCHIVE</div>
    </div>
  );
}

/* ---------- Epilogue ---------- */
function Epilogue({ onReview, onRestart }) {
  return (
    <div className="epilogue fade-in">
      <div className="epi-card">
        <div className="epi-kicker mono">Case file ∞ · status: UNRESOLVABLE</div>
        <h1 className="epi-title">The loop is closed.<br/>It always was.</h1>
        <p className="epi-body">
          You restored timeline after timeline and uncovered the one fracture that cannot be
          restored — because the hand that broke it is your own. The Agency was founded by the
          investigator it recruited to repair the damage that founding caused.
        </p>
        <p className="epi-body epi-dim">
          There is one fracture left in the vault. It has your name on it, under the redaction.
          You already know what it says.
        </p>
        <div className="epi-actions">
          <button className="btn btn-ghost" onClick={onReview}>Return to Case Index</button>
          <button className="btn btn-accent" onClick={onRestart}>Reopen the loop ↻</button>
        </div>
        <div className="epi-foot mono">TIMELINE · a deduction experience · TCA-ARCHIVE</div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [st, setSt] = useState(loadSave);
  const { phase, currentId, save } = st;
  const puzzle = currentId && TL.byId[currentId] ? TL.byId[currentId] : null;

  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(st)); } catch (e) {}
  }, [st]);

  function setPhase(phase, extra = {}) { setSt((s) => ({ ...s, phase, ...extra })); }

  function setMarksFor(pid, fnOrVal) {
    setSt((s) => {
      const prev = s.save.marks[pid] || {};
      const nextMarks = typeof fnOrVal === "function" ? fnOrVal(prev) : fnOrVal;
      return { ...s, save: { ...s.save, marks: { ...s.save.marks, [pid]: nextMarks } } };
    });
  }
  function setFinalFor(pid, obj) {
    setSt((s) => ({ ...s, save: { ...s.save, final: { ...s.save.final, [pid]: obj } } }));
  }
  function useHint(pid) {
    setSt((s) => ({ ...s, save: { ...s.save, hints: { ...s.save.hints, [pid]: Math.min(3, (s.save.hints[pid] || 0) + 1) } } }));
  }
  function addWrong(pid) {
    setSt((s) => ({ ...s, save: { ...s.save, wrong: { ...s.save.wrong, [pid]: (s.save.wrong[pid] || 0) + 1 } } }));
  }
  function markSolved(pid) {
    setSt((s) => ({ ...s, save: { ...s.save, solved: { ...s.save.solved, [pid]: true } } }));
  }

  function unlocked(t) {
    if (t === 1) return true;
    if (t === 2) return !!save.solved.p1;
    if (t === 3) return !!save.solved.p2;
    return false;
  }

  function openCase(id) {
    window.scrollTo(0, 0);
    if (id === "__epilogue") { setPhase("epilogue"); return; }
    setSt((s) => ({ ...s, phase: "puzzle", currentId: id }));
  }
  function toIndex() { window.scrollTo(0, 0); setPhase("library"); }

  function advance() {
    // story puzzles trigger a beat; field cases return to index
    if (puzzle && isStory(puzzle)) { window.scrollTo(0, 0); setPhase("beat"); }
    else toIndex();
  }
  function afterBeat() {
    if (currentId === "p3") { setPhase("epilogue"); }
    else toIndex();
  }
  function restart() {
    if (!confirm("Reopen the loop? This wipes all progress and returns to onboarding.")) return;
    setSt({ phase: "intro", currentId: null, save: { marks: {}, hints: {}, wrong: {}, solved: {}, final: {} } });
    window.scrollTo(0, 0);
  }

  function paradox() {
    if (phase === "intro") return 14;
    if (phase === "epilogue") return 100;
    const total = TL.allPuzzles.length;
    const solvedCount = TL.allPuzzles.filter((p) => save.solved[p.id]).length;
    const global = Math.round(12 + 70 * (1 - solvedCount / total));
    if (phase === "library") return global;
    if (phase === "beat") return currentId === "p3" ? 100 : global;
    // in a puzzle
    if (!puzzle) return global;
    if (save.solved[puzzle.id]) return Math.max(8, Math.round(global * 0.5));
    const base = TL.TIER[puzzle.tier].instability;
    const pen = (save.hints[puzzle.id] || 0) * 3 + (save.wrong[puzzle.id] || 0) * 4;
    return Math.min(99, base + pen);
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-in">
          <button className="brand brand-btn" onClick={() => (phase === "intro" ? null : toIndex())} title="Case Index">
            <span className="logo">TIME<b>LINE</b></span>
            <span className="sub">Time Correction Agency</span>
          </button>
          <div className="spacer" />
          {(phase === "puzzle" || phase === "beat") && (
            <button className="btn btn-ghost btn-sm idx-btn" onClick={toIndex}>◀ Case Index</button>
          )}
          {puzzle && (phase === "puzzle") && (
            <span className="cur-case mono">{puzzle.code}</span>
          )}
          <ParadoxMeter value={paradox()} />
          {phase !== "intro" && <button className="reset-btn mono" onClick={restart} title="Restart">↻</button>}
        </div>
      </div>

      <div className="shell stage">
        {phase === "intro" && <IntroScreen onBegin={() => setPhase("library")} />}

        {phase === "library" && (
          <CaseIndex save={save} onOpen={openCase} unlocked={unlocked} />
        )}

        {phase === "puzzle" && puzzle && (
          <PuzzleView
            key={puzzle.id}
            puzzle={puzzle}
            marks={save.marks[puzzle.id] || {}}
            setMarks={(fn) => setMarksFor(puzzle.id, fn)}
            hintsUsed={save.hints[puzzle.id] || 0}
            onUseHint={() => useHint(puzzle.id)}
            solved={!!save.solved[puzzle.id]}
            onSolve={() => markSolved(puzzle.id)}
            finalSel={save.final[puzzle.id] || {}}
            setFinalSel={(obj) => setFinalFor(puzzle.id, obj)}
            onWrong={() => addWrong(puzzle.id)}
            onAdvance={advance}
            isStory={isStory(puzzle)}
            isLast={puzzle.id === "p3"}
          />
        )}

        {phase === "beat" && puzzle && (() => {
          const lines = TL.beats[puzzle.id];
          if (!lines) { afterBeat(); return null; }
          const isFinal = puzzle.id === "p3";
          const cont = () => afterBeat();
          cont.label = isFinal ? "▣ End transmission" : "Return to Case Index →";
          return <BeatScreen lines={lines} onContinue={cont} isFinal={isFinal} />;
        })()}

        {phase === "epilogue" && (
          <Epilogue onReview={toIndex} onRestart={restart} />
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

