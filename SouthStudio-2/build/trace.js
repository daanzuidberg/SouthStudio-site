/* ===================================================================
   TIMELINE, deduction TRACER v2.
   Constraint-propagation solver with hypothesis/contradiction fallback.
   Logs human-readable deduction steps attributed to the driving clue,
   then selects the key turning points for the book walkthrough.

   globalThis.TRACER = { traceSteps(cats, constraints, opts) }
     cats        : puzzle.categories (cats[0] = Year anchor)
     constraints : [{type,a:{c,i},b:{c,i},n}]  (liar EXCLUDED; n=clue no.)
     opts.L      : i18n label pack (defaults to English)
     opts.maxSteps : cap on shown steps (default 6)
   Returns { steps:[html], full:bool }
   =================================================================== */
(function () {
  function clonePoss(poss) { return poss.map(cat => cat.map(s => new Set(s))); }

  function traceSteps(cats, constraints, opts) {
    opts = opts || {};
    const L = opts.L || defaultLabels();
    const maxSteps = opts.maxSteps || 6;
    const K = cats.length, N = cats[0].items.length;
    const yearLabel = (r) => cats[0].items[r].label;
    const itemLabel = (c, i) => cats[c].items[i].label;

    let poss = [];
    for (let c = 0; c < K; c++) { poss.push([]); for (let i = 0; i < N; i++) poss[c].push(c === 0 ? new Set([i]) : new Set(range(N))); }

    const known = (P, c, i) => P[c][i].size === 1;
    const rowOf = (P, c, i) => known(P, c, i) ? [...P[c][i]][0] : -1;

    // apply one constraint to P; record narrowings into reason map; return {changed, dead}
    function applyOne(P, cl, reason) {
      let changed = false;
      const pa = P[cl.a.c][cl.a.i], pb = P[cl.b.c][cl.b.i];
      const del = (set, r, ep) => { if (set.has(r)) { set.delete(r); reason && (reason[ep] = cl); changed = true; } };
      const ea = cl.a.c + ":" + cl.a.i, eb = cl.b.c + ":" + cl.b.i;
      if (cl.type === "SAME") {
        const inter = [...pa].filter(r => pb.has(r));
        if (inter.length < pa.size) { P[cl.a.c][cl.a.i] = new Set(inter); reason && (reason[ea] = cl); changed = true; }
        if (inter.length < pb.size) { P[cl.b.c][cl.b.i] = new Set(inter); reason && (reason[eb] = cl); changed = true; }
      } else if (cl.type === "DIFF") {
        if (pa.size === 1) del(pb, [...pa][0], eb);
        if (pb.size === 1) del(pa, [...pb][0], ea);
      } else if (cl.type === "LT") {
        const maxB = Math.max(...pb), minA = Math.min(...pa);
        [...pa].forEach(r => { if (r >= maxB) del(pa, r, ea); });
        [...pb].forEach(r => { if (r <= minA) del(pb, r, eb); });
      } else if (cl.type === "ADJ") {
        [...pa].forEach(r => { if (!pb.has(r + 1)) del(pa, r, ea); });
        [...pb].forEach(r => { if (!pa.has(r - 1)) del(pb, r, eb); });
      }
      return changed;
    }

    function latin(P, reason) {
      let changed = false;
      for (let c = 1; c < K; c++) {
        for (let i = 0; i < N; i++) if (known(P, c, i)) {
          const r = rowOf(P, c, i);
          for (let j = 0; j < N; j++) if (j !== i && P[c][j].has(r)) { P[c][j].delete(r); changed = true; }
        }
        for (let r = 0; r < N; r++) {
          const cand = []; for (let i = 0; i < N; i++) if (P[c][i].has(r)) cand.push(i);
          if (cand.length === 1 && P[c][cand[0]].size > 1) { P[c][cand[0]] = new Set([r]); reason && (reason[c + ":" + cand[0]] = reason[c + ":" + cand[0]] || { type: "GRID" }); changed = true; }
        }
      }
      return changed;
    }

    function dead(P) {            // any empty domain?
      for (let c = 0; c < K; c++) for (let i = 0; i < N; i++) if (P[c][i].size === 0) return true;
      return false;
    }
    function solved(P) {
      for (let c = 1; c < K; c++) for (let i = 0; i < N; i++) if (P[c][i].size !== 1) return false;
      return true;
    }

    function propagate(P, reason) {
      let g = 0;
      while (g++ < 300) {
        let changed = false;
        for (const cl of constraints) if (applyOne(P, cl, reason)) changed = true;
        if (latin(P, reason)) changed = true;
        if (dead(P)) return "dead";
        if (!changed) break;
      }
      return solved(P) ? "solved" : "stall";
    }

    // does assigning (c,i)=r lead to a contradiction within `depth` levels?
    function leadsToDead(P, c, i, r, depth) {
      const trial = clonePoss(P);
      trial[c][i] = new Set([r]);
      const res = propagate(trial, null);
      if (res === "dead") return true;
      if (res === "solved") return false;
      if (depth <= 0) return false;
      // pick most-constrained unknown and recurse: r is dead only if EVERY branch dies
      let t = null;
      for (let cc = 1; cc < K && !t; cc++) for (let ii = 0; ii < N; ii++)
        if (trial[cc][ii].size > 1) { if (!t || trial[cc][ii].size < trial[t.c][t.i].size) t = { c: cc, i: ii }; }
      if (!t) return false;
      for (const rr of trial[t.c][t.i]) if (!leadsToDead(trial, t.c, t.i, rr, depth - 1)) return false;
      return true;
    }

    // ---- main solve with logging ----
    const steps = [];
    const done = new Set();
    const reason = {};

    function announceAll() {
      for (let r = 0; r < N; r++) for (let c = 1; c < K; c++) for (let i = 0; i < N; i++) {
        const key = c + ":" + i;
        if (known(poss, c, i) && rowOf(poss, c, i) === r && !done.has(key)) {
          done.add(key);
          steps.push({ kind: "place", item: itemLabel(c, i), year: yearLabel(r), reason: reason[key] });
        }
      }
    }

    let guard = 0;
    while (guard++ < 100) {
      const st = propagate(poss, reason);
      announceAll();
      if (st === "solved" || st === "dead") break;
      // STALL -> hypothesis test on most-constrained unknown
      let target = null;
      for (let c = 1; c < K && !target; c++) for (let i = 0; i < N; i++) {
        if (poss[c][i].size > 1) { if (!target || poss[c][i].size < poss[target.c][target.i].size) target = { c, i }; }
      }
      if (!target) break;
      // find a candidate that DOES die (depth-2 lookahead), to phrase the turning point
      let killed = null;
      for (const r of [...poss[target.c][target.i]]) {
        if (leadsToDead(poss, target.c, target.i, r, 2)) { killed = r; break; }
      }
      // commit: eliminate the killed candidate (forces progress)
      if (killed !== null && poss[target.c][target.i].size > 1) {
        poss[target.c][target.i].delete(killed);
        steps.push({ kind: "test", item: itemLabel(target.c, target.i), year: yearLabel(killed) });
      } else { break; } // can't make progress (shouldn't happen for unique puzzles)
    }

    // ---- select key turning points + render ----
    const rendered = selectAndRender(steps, L, N, K, maxSteps);
    return { steps: rendered, full: done.size === (K - 1) * N };
  }

  // Choose the most informative steps: keep all 'test' (turning points) + the
  // clue-driven placements; collapse trailing pure-grid placements into one.
  function selectAndRender(steps, L, N, K, maxSteps) {
    const out = [];
    const driven = steps.filter(s => s.kind === "test" || (s.reason && s.reason.type && s.reason.type !== "GRID"));
    const total = (K - 1) * N;

    // Always include the first 1-2 openers and every 'test'
    const chosen = [];
    let count = 0;
    for (const s of steps) {
      const isKey = s.kind === "test" || (s.reason && s.reason.type && s.reason.type !== "GRID");
      if (isKey && count < maxSteps) { chosen.push(s); count++; }
    }
    // render
    chosen.forEach((s) => {
      if (s.kind === "test") { out.push(L.test(s.item, s.year)); return; }
      out.push(L.place(s.item, s.year, reasonText(s.reason, L)));
    });
    if (out.length < total) out.push(L.tail);
    return out;
  }

  function reasonText(cl, L) {
    if (!cl || cl.type === "GRID") return L.grid;
    const an = cl.n ? L.clue(cl.n) : "";
    return an ? L.relWord(cl.type, an) : L.grid;
  }

  function range(n) { return Array.from({ length: n }, (_, i) => i); }

  function defaultLabels() {
    return {
      clue: (n) => "clue " + String(n).padStart(2, "0"),
      place: (item, year, reason) => `<b>${item}</b> &rarr; <b>${year}</b> (${reason})`,
      test: (item, year) => `Testing <b>${item}</b> at <b>${year}</b> forces a contradiction, so rule it out.`,
      relWord: (type, cn) => ({ SAME: cn + " (shared entry)", DIFF: cn + " (rules it out)", LT: cn + " (ordering)", ADJ: cn + " (adjacency)" }[type] || cn),
      grid: "forced by elimination",
      tail: "The remaining entries follow by elimination.",
    };
  }

  globalThis.TRACER = { traceSteps, defaultLabels };
})();
