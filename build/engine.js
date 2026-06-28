/* ===================================================================
   TIMELINE — print-book puzzle ENGINE
   Generates logic-grid deduction puzzles with VERIFIED-UNIQUE solutions.
   Exposes globalThis.ENGINE = { generate(opts) }.
   Model: category[0] = anchor (Year), ordered so row r == r-th year.
          non-anchor categories are permutations (row -> item index).
   =================================================================== */
(function () {
  // ---------- rng (seedable for reproducibility) ----------
  let _seed = 1;
  function srand(s) { _seed = (s >>> 0) || 1; }
  function rnd() { _seed ^= _seed << 13; _seed ^= _seed >>> 17; _seed ^= _seed << 5; _seed >>>= 0; return _seed / 4294967296; }
  function ri(n) { return Math.floor(rnd() * n); }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = ri(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function perm(n) { return shuffle(Array.from({ length: n }, (_, i) => i)); }

  // ---------- year formatting ----------
  function yLabel(y) {
    if (y < 0) return (-y) + " BCE";
    if (y < 1000) return y + " CE";
    return "" + y;
  }
  function pickYears(lo, hi, n) {
    // n distinct ascending years, reasonably spaced
    const span = hi - lo;
    const set = new Set();
    let guard = 0;
    while (set.size < n && guard++ < 2000) {
      const y = lo + ri(span + 1);
      set.add(Math.round(y));
    }
    let ys = [...set].sort((a, b) => a - b);
    // ensure min gap so labels differ clearly
    for (let i = 1; i < ys.length; i++) if (ys[i] <= ys[i - 1]) ys[i] = ys[i - 1] + 1;
    return ys.slice(0, n);
  }

  /* ================= SOLVER: count solutions up to `cap` =================
     clues: {type, a:{c,i}, b:{c,i}}  type in SAME|DIFF|LT|ADJ
       rowOf(anchor item i)=i ; non-anchor resolved during search.
     Returns number of consistent full assignments, capped at `cap`. */
  function countSolutions(K, N, clues, cap) {
    // rowOf[c][item] = row or -1
    const rowOf = Array.from({ length: K }, () => new Int8Array(N).fill(-1));
    for (let i = 0; i < N; i++) rowOf[0][i] = i; // anchor fixed
    // index clues by endpoint (c,i)
    const byEnd = Array.from({ length: K }, () => Array.from({ length: N }, () => []));
    clues.forEach((cl) => { byEnd[cl.a.c][cl.a.i].push(cl); byEnd[cl.b.c][cl.b.i].push(cl); });

    function ok(cl) {
      const ra = rowOf[cl.a.c][cl.a.i], rb = rowOf[cl.b.c][cl.b.i];
      if (ra < 0 || rb < 0) return true; // not yet decidable
      switch (cl.type) {
        case "SAME": return ra === rb;
        case "DIFF": return ra !== rb;
        case "LT": return ra < rb;
        case "ADJ": return rb === ra + 1;
      }
      return true;
    }
    function checkEndpoint(c, i) {
      const list = byEnd[c][i];
      for (let k = 0; k < list.length; k++) if (!ok(list[k])) return false;
      return true;
    }

    let count = 0;
    const used = Array.from({ length: K }, () => new Uint8Array(N)); // used[c][item]
    const cellItem = Array.from({ length: K }, () => new Int8Array(N)); // cellItem[c][row]

    // assign categories 1..K-1 at a given row, then advance row
    function placeCat(r, c) {
      if (c === K) { // row complete
        if (r + 1 === N) { count++; return; }
        return placeRow(r + 1);
      }
      for (let it = 0; it < N; it++) {
        if (used[c][it]) continue;
        used[c][it] = 1; cellItem[c][r] = it; rowOf[c][it] = r;
        if (checkEndpoint(c, it)) placeCat(r, c + 1);
        rowOf[c][it] = -1; used[c][it] = 0;
        if (count >= cap) return;
      }
    }
    function placeRow(r) { placeCat(r, 1); }

    placeRow(0);
    return count;
  }

  /* ================= GENERATION ================= */
  // build full pool of TRUE clues for a solution sol[c][r]=item
  function truthRowOf(sol, K, N) {
    const r = Array.from({ length: K }, () => new Int8Array(N));
    for (let c = 0; c < K; c++) for (let row = 0; row < N; row++) r[c][sol[c][row]] = row;
    return r; // r[c][item]=row
  }
  function buildPool(sol, K, N, opts) {
    const R = truthRowOf(sol, K, N);
    const pins = [], crossSame = [], diffs = [], lts = [], adjs = [];
    // PINS: anchor <-> each non-anchor item
    for (let c = 1; c < K; c++) for (let row = 0; row < N; row++)
      pins.push({ type: "SAME", a: { c: 0, i: row }, b: { c, i: sol[c][row] } });
    // CROSS-SAME: non-anchor pairs in same row
    for (let c1 = 1; c1 < K; c1++) for (let c2 = c1 + 1; c2 < K; c2++)
      for (let row = 0; row < N; row++)
        crossSame.push({ type: "SAME", a: { c: c1, i: sol[c1][row] }, b: { c: c2, i: sol[c2][row] } });
    // DIFF / LT / ADJ across random item pairs (any categories incl anchor, not both anchor)
    const allItems = [];
    for (let c = 0; c < K; c++) for (let i = 0; i < N; i++) allItems.push({ c, i });
    for (let x = 0; x < allItems.length; x++) for (let y = 0; y < allItems.length; y++) {
      if (x === y) continue;
      const A = allItems[x], B = allItems[y];
      if (A.c === 0 && B.c === 0) continue;
      if (A.c === B.c) continue; // within-category handled by latin rule
      const ra = R[A.c][A.i], rb = R[B.c][B.i];
      if (ra === rb) continue; // same-row positives handled by pins / crossSame
      // different rows: a DIFF statement is TRUE here (emit once per unordered pair)
      if (A.c < B.c || (A.c === B.c && A.i < B.i)) diffs.push({ type: "DIFF", a: A, b: B });
      // ordering is TRUE only in the ra<rb direction
      if (ra < rb) {
        lts.push({ type: "LT", a: A, b: B });
        if (rb === ra + 1) adjs.push({ type: "ADJ", a: A, b: B });
      }
    }
    return { pins: shuffle(pins), crossSame: shuffle(crossSame), diffs: shuffle(diffs), lts: shuffle(lts), adjs: shuffle(adjs) };
  }

  // greedily assemble a minimal unique clue set with a tier-flavored mix
  function assembleClues(sol, K, N, opts) {
    const pool = buildPool(sol, K, N, opts);
    // order of preference for ADDING (so minimization keeps the earlier, "interesting" ones)
    let order = [];
    const relational = shuffle([...pool.lts, ...pool.adjs, ...pool.crossSame, ...pool.diffs]);
    const pins = pool.pins;
    if (opts.style === "easy") order = [...pins, ...relational];
    else if (opts.style === "mixed") order = [...relational.slice(0, Math.ceil(relational.length * 0.6)), ...pins, ...relational.slice(Math.ceil(relational.length * 0.6))];
    else order = [...relational, ...pins]; // hard: prefer relational
    // de-dup identical clues
    const seen = new Set();
    order = order.filter((cl) => {
      const k = cl.type + cl.a.c + "_" + cl.a.i + "_" + cl.b.c + "_" + cl.b.i;
      if (seen.has(k)) return false; seen.add(k); return true;
    });

    const S = [];
    for (const cl of order) {
      if (countSolutions(K, N, S, 2) === 1) break;
      S.push(cl);
    }
    if (countSolutions(K, N, S, 2) !== 1) return null; // safety (shouldn't happen)
    // MINIMIZE
    let changed = true;
    while (changed) {
      changed = false;
      for (let idx = S.length - 1; idx >= 0; idx--) {
        const without = S.slice(0, idx).concat(S.slice(idx + 1));
        if (countSolutions(K, N, without, 2) === 1) { S.splice(idx, 1); changed = true; }
      }
    }
    return S;
  }

  function generate(opts) {
    // opts: {K,N,style, targetMin,targetMax, attempts}
    const attempts = opts.attempts || 40;
    for (let a = 0; a < attempts; a++) {
      const sol = [Array.from({ length: opts.N }, (_, i) => i)];
      for (let c = 1; c < opts.K; c++) sol.push(perm(opts.N));
      const S = assembleClues(sol, opts.K, opts.N, opts);
      if (!S) continue;
      if (opts.targetMin && S.length < opts.targetMin) continue;
      if (opts.targetMax && S.length > opts.targetMax) continue;
      return { sol, clues: S, K: opts.K, N: opts.N };
    }
    // fallback: accept whatever unique set regardless of size
    const sol = [Array.from({ length: opts.N }, (_, i) => i)];
    for (let c = 1; c < opts.K; c++) sol.push(perm(opts.N));
    const S = assembleClues(sol, opts.K, opts.N, opts);
    return S ? { sol, clues: S, K: opts.K, N: opts.N } : null;
  }

  // verify a generated puzzle: every clue TRUE under gen.sol AND solution unique == gen.sol
  function verify(gen) {
    const R = truthRowOf(gen.sol, gen.K, gen.N);
    const rowOfEnd = (ep) => (ep.c === 0 ? ep.i : R[ep.c][ep.i]);
    for (const cl of gen.clues) {
      const ra = rowOfEnd(cl.a), rb = rowOfEnd(cl.b);
      if (cl.type === "SAME" && ra !== rb) return false;
      if (cl.type === "DIFF" && ra === rb) return false;
      if (cl.type === "LT" && !(ra < rb)) return false;
      if (cl.type === "ADJ" && !(rb === ra + 1)) return false;
    }
    // all clues true => gen.sol is a solution; if exactly one solution exists it must be gen.sol
    return countSolutions(gen.K, gen.N, gen.clues, 2) === 1;
  }

  globalThis.ENGINE = { generate, countSolutions, verify, srand, rnd, ri, shuffle, sample, perm, yLabel, pickYears };
})();
