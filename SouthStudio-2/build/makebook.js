/* ===================================================================
 TIMELINE, book compositor. Reads build/puzzles.json, emits the
 print-ready book HTML. globalThis.MAKEBOOK(puzzles) -> htmlString
 7 x 10 in · facing spreads (scenario verso / grid recto) · B&W + red
 =================================================================== */
(function () {
 const RED = "#d2392a";

 function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
 const ROMAN = ["","I","II","III","IV","V"];
 const SOL_WALK_LABEL = "HOW TO GET THERE";

 /* ---------- staircase logic grid ---------- */
 function renderGrid(cats){
 const K = cats.length, N = cats[0].items.length;
 const rowCats = cats.slice(0, K-1); // top bands as rows
 const colCats = cats.slice(1); // right bands as columns
 const sizeClass = (N>=5?'g5':'g4') + ' k'+K;
 let h = `<table class="grid ${sizeClass}"><thead>`;
 // header row 1: corner + col category names
 h += `<tr><th class="g-corner" colspan="2" rowspan="2"></th>`;
 colCats.forEach(c=>{ h += `<th class="g-catcol" colspan="${N}">${esc(c.name)}</th>`; });
 h += `</tr><tr>`;
 colCats.forEach(c=> c.items.forEach(it=>{ h += `<th class="g-colh"><span>${esc(it.label)}</span></th>`; }));
 h += `</tr></thead><tbody>`;
 rowCats.forEach((rc, ri)=>{
 const rcGlobal = ri; // rowCats index == global cat index
 rc.items.forEach((rit, ii)=>{
 h += `<tr>`;
 if (ii===0) h += `<th class="g-catrow" rowspan="${N}"><span>${esc(rc.name)}</span></th>`;
 h += `<th class="g-rowh">${esc(rit.label)}</th>`;
 colCats.forEach((cc, cj)=>{
 const ccGlobal = cj+1;
 cc.items.forEach(()=>{
 if (ccGlobal > rcGlobal) h += `<td class="g-cell"></td>`;
 else h += `<td class="g-blank"></td>`;
 });
 });
 h += `</tr>`;
 });
 });
 h += `</tbody></table>`;
 return h;
 }

 /* ---------- write-in answer table ---------- */
 function renderAnswerTable(cats){
 const N = cats[0].items.length;
 let h = `<table class="ans"><thead><tr>`;
 cats.forEach((c,i)=> h += `<th class="${i===0?'ans-yr':''}">${esc(c.name)}</th>`);
 h += `</tr></thead><tbody>`;
 cats[0].items.forEach((yr,r)=>{
 h += `<tr><th class="ans-yr">${esc(yr.label)}</th>`;
 for(let c=1;c<cats.length;c++) h += `<td class="ans-cell"></td>`;
 h += `</tr>`;
 });
 h += `</tbody></table>`;
 return h;
 }

 /* ---------- filled solution table ---------- */
 function renderSolvedTable(p){
 const cats = p.categories;
 let h = `<table class="sol-tab"><thead><tr>`;
 cats.forEach((c,i)=> h += `<th class="${i===0?'ans-yr':''}">${esc(c.name)}</th>`);
 h += `</tr></thead><tbody>`;
 p.solution.forEach((row,r)=>{
 h += `<tr><th class="ans-yr">${esc(cats[0].items[r].label)}</th>`;
 for(let c=1;c<cats.length;c++){
 const it = cats[c].items.find(x=>x.id===row[cats[c].id]);
 h += `<td>${esc(it.label)}</td>`;
 }
 h += `</tr>`;
 });
 h += `</tbody></table>`;
 return h;
 }

 /* ---------- pages ---------- */
 function build(puzzles){
 const pages = [];
 const num = ()=> pages.length+1;
 const nextRecto = ()=> num()%2===1;
 function push(kind, inner){
 const n = num();
 const side = n%2===1 ? 'recto':'verso';
 pages.push(`<section class="page ${side} ${kind}" data-pageno="${n}">${inner}</section>`);
 }
 function fieldNotes(){
 push('p-notes',
 `<div class="run-head"><span>TIME CORRECTION AGENCY</span><span>FIELD NOTES</span></div>
 <div class="notes-body"><div class="dotgrid"></div></div>
 <div class="run-foot"><span class="folio"></span><span></span></div>`);
 }
 function ensureVerso(){ if(nextRecto()) fieldNotes(); } // want next = verso(even)
 function ensureRecto(){ if(!nextRecto()) fieldNotes(); } // want next = recto(odd)

 const mark = `<span class="mk"><i></i><i class="r"></i><i></i><i></i><i></i><i class="k"></i><i class="k"></i><i></i><i></i></span>`;

 /* ---- FRONT MATTER ---- */
 // 1 recto: half-title
 push('p-half', `<div class="half"><div class="kick">TIME CORRECTION AGENCY</div><h1 class="bigtitle">TIME<span>LINE</span></h1></div>`);
 // 2 verso: colophon
 push('p-colophon',
 `<div class="run-head"><span></span><span></span></div>
 <div class="colo">
 <p>TIMELINE, The Field Manual</p>
 <p class="dim">A casebook of the Time Correction Agency.<br>Eighty deduction cases across five clearances.</p>
 <hr>
 <p class="dim">Published by SouthStudio · First edition, 2026<br>An independent studio.</p>
 <p class="dim">Every case in this book has a single, logically provable solution. No trivia, no guessing.</p>
 <p class="dim small">Set in Newsreader &amp; IBM Plex Mono. Printed on uncoated stock.<br>southstudio · play the interactive edition online.</p>
 </div>
 <div class="run-foot"><span class="folio"></span><span></span></div>`);
 // 3 recto: title page
 push('p-title',
 `<div class="titlepage">
 ${mark}
 <div class="kick">TIME CORRECTION AGENCY · FIELD INVESTIGATOR EDITION</div>
 <h1 class="bigtitle">TIME<span>LINE</span></h1>
 <p class="tagline">History has been edited. You are the correction.</p>
 <div class="rule-tick"></div>
 <p class="byline">SOUTHSTUDIO</p>
 </div>`);
 // 4 verso: briefing
 push('p-briefing',
 `<div class="run-head"><span>CLASSIFIED, EYES ONLY</span><span>ONBOARDING</span></div>
 <div class="briefing">
 <div class="kick red">// INCOMING TRANSMISSION, CONTROL</div>
 <h2 class="sec-h">Your first day, Investigator.</h2>
 <p>Reality is fraying. Somewhere upstream, history was altered, and the damage propagates forward into your present. The Agency does not change the past, we <em>restore</em> it.</p>
 <p>Each case is a deduction grid. Read the evidence, reconstruct what truly happened, and identify the keystone: the one anomaly that, removed, lets the timeline heal.</p>
 <p>Mark what is impossible. Confirm what is certain. Eliminate down to the only configuration the evidence allows. Every case here resolves to exactly one answer.</p>
 <p class="dim">The deeper your clearance, the less you should trust the records. At Specialist level and beyond, exactly one record in each file is <strong class="red">false</strong>, a memory of something that never happened. It is <em>not</em> flagged. The remaining evidence still pins a single timeline, so the false record betrays itself by the contradiction it creates: find it, discard it, and the case resolves.</p>
 <p class="signoff">, CONTROL</p>
 </div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);
 // 5 recto: how to play
 push('p-howto',
 `<div class="run-head"><span>FIELD MANUAL</span><span>PROCEDURE</span></div>
 <div class="howto">
 <div class="kick red">// HOW TO WORK A CASE</div>
 <h2 class="sec-h">Reading the grid</h2>
 <div class="how-grid">
 <div class="how-step"><span class="hn">01</span><p>Each case spans a <strong>spread</strong>: the briefing and evidence on the left, your working grid and record on the right.</p></div>
 <div class="how-step"><span class="hn">02</span><p>The grid crosses every category against every other. Put a <strong>✓</strong> where two facts must be true together; an <strong>✕</strong> where they cannot be.</p></div>
 <div class="how-step"><span class="hn">03</span><p>A ✓ in any box rules out the rest of that row and column, one mark cascades into many.</p></div>
 <div class="how-step"><span class="hn">04</span><p>When the grid is resolved, copy the chain into the <strong>RECORD</strong> table, one full row per year.</p></div>
 <div class="how-step"><span class="hn">05</span><p>From Tier IV on, one record in the file is <strong class="red">false</strong> and unmarked. If the evidence can't all be true at once, the contradiction points to the liar, strike it and solve the rest.</p></div>
 </div>
 <div class="legendrow">
 <span><i class="lgc"><b>✓</b></i> confirmed true</span>
 <span><i class="lgc"><b class="x">✕</b></i> ruled out</span>
 <span><i class="lgc"></i> still unknown</span>
 </div>
 <p class="dim small">Stuck? Every solution, with a full walkthrough, is filed at the back of the book under CASE RESOLUTIONS.</p>
 </div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);
 // 6 verso: clearance ladder
 const tierMeta = [
 ['I','Recruit','Minor distortion','3 categories · 4 entries'],
 ['II','Field Agent','Multi-event drift','3 categories · 5 entries'],
 ['III','Investigator','Cross-divergence','4 categories · 4 entries'],
 ['IV','Specialist','Collapse risk · 1 false record','4 categories · 5 entries'],
 ['V','Chronovist','Total recursion · 1 false record','4 categories · 5 entries'],
 ];
 push('p-contents',
 `<div class="run-head"><span>CONTENTS</span><span>CLEARANCE LADDER</span></div>
 <div class="contents">
 <div class="kick red">// YOUR CLEARANCE RECORD</div>
 <h2 class="sec-h">Five clearances. Eighty cases.</h2>
 <div class="ladder">
 ${tierMeta.map((t,i)=>`<div class="lad-row"><span class="lad-tier">TIER ${t[0]}</span><span class="lad-name">${t[1]}</span><span class="lad-note">${t[2]}</span><span class="lad-grid">${t[3]}</span><span class="lad-box"></span></div>`).join('')}
 </div>
 <p class="dim small">Tick a clearance when you complete its sixteen cases. Chronovist is the highest rank the Agency recognises.</p>
 </div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);

 /* ---- TIERS + PUZZLES ---- */
 const byTier = {};
 puzzles.forEach(p=>{ (byTier[p.tier]=byTier[p.tier]||[]).push(p); });

 let caseNo = 0;
 Object.keys(byTier).map(Number).sort((a,b)=>a-b).forEach(tier=>{
 const list = byTier[tier];
 const tm = tierMeta[tier-1];
 ensureRecto();
 push('p-divider',
 `<div class="divider">
 <div class="div-top"><span class="kick">TIME CORRECTION AGENCY</span><span class="kick">CASES ${String(caseNo+1).padStart(2,'0')}–${String(caseNo+list.length).padStart(2,'0')}</span></div>
 <div class="div-mid">
 <div class="div-tier">TIER ${tm[0]}</div>
 <h2 class="div-name">${esc(tm[1])}</h2>
 <p class="div-note">${esc(tm[2])}</p>
 </div>
 <div class="div-foot"><span class="div-grid">${esc(tm[3])}</span><span class="div-count">16 CASES</span></div>
 </div>`);

 list.forEach(p=>{
 caseNo++;
 const cno = String(caseNo).padStart(2,'0');
 ensureVerso();
 // LEFT (verso): scenario + evidence
 const hasLiar = p.clues.some(c=>c.liar||c.unstable);
 const clues = p.clues.map(c=>
 `<li><span class="cl-n">${String(c.n).padStart(2,'0')}</span><span class="cl-t">${c.text}</span></li>`).join('');
 push('p-case-l',
 `<div class="run-head"><span>TIER ${tm[0]} · ${esc(tm[1].toUpperCase())}</span><span>${esc(p.code)}</span></div>
 <div class="case-l${p.clues.length>8?' dense':''}">
 <div class="case-no">CASE ${cno}</div>
 <h2 class="case-title">${esc(p.title)}</h2>
 <div class="case-meta"><span>${esc(p.place)}</span><span class="dot">·</span><span>${esc(p.eraLabel)}</span></div>
 <div class="scenario">${p.scenario.slice(0,-1).map(para=>`<p>${para}</p>`).join('')}</div>
 <div class="evidence">
 <div class="ev-head"><span>EVIDENCE</span><span>${p.clues.length} RECORDS</span></div>
 ${hasLiar?'<p class="ev-warn">⚠ One record in this file is false, unmarked. Find the contradiction and discard it.</p>':''}
 <ul class="cluelist">${clues}</ul>
 </div>
 </div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);
 // RIGHT (recto): grid + record
 push('p-case-r',
 `<div class="run-head"><span>WORK FILE</span><span>${esc(p.code)}</span></div>
 <div class="case-r">
 <div class="wf-head"><span class="kick red">// MARK THE GRID</span><span class="wf-leg"><i class="lgc"><b>✓</b></i><i class="lgc"><b class="x">✕</b></i></span></div>
 <div class="gridwrap">${renderGrid(p.categories)}</div>
 <div class="record">
 <div class="rec-head"><span>RECORD, FILE YOUR FINDINGS</span></div>
 ${renderAnswerTable(p.categories)}
 </div>
 </div>
 <div class="run-foot"><span class="folio"></span><span>CASE ${cno}</span></div>`);
 });
 });

 /* ---- SOLUTIONS ---- */
 ensureRecto();
 push('p-divider p-soldiv',
 `<div class="divider">
 <div class="div-top"><span class="kick">TIME CORRECTION AGENCY</span><span class="kick">RESTRICTED</span></div>
 <div class="div-mid"><div class="div-tier">APPENDIX</div><h2 class="div-name">Case Resolutions</h2><p class="div-note">Full solutions &amp; reasoning for all eighty cases.</p></div>
 <div class="div-foot"><span class="div-grid">DO NOT READ BEFORE SOLVING</span><span class="div-count">80 FILES</span></div>
 </div>`);

 // solutions: fixed count per page, uniform card height, page filled
 // solutions: 2 per page (now with a step-by-step walkthrough)
 // Available height = 10in - top pad (.62in) - bottom pad (.55in) - solpage margin-top (.42in) = 8.41in = ~807px
 const SOLPAGE_H = 800, SOL_GAP = 18, PER_PAGE = 2;
 const cardH = Math.floor((SOLPAGE_H - (PER_PAGE - 1) * SOL_GAP) / PER_PAGE);
 let sols = [];
 let sc = 0;
 puzzles.forEach(p=>{
 sc++;
 const cno = String(sc).padStart(2,'0');
 const stepsHtml = (p.solutionSteps||[]).map(s=>`<li>${s}</li>`).join('');
 sols.push(
 `<div class="solcard" style="height:${cardH}px">
 <div class="sc-head"><span class="sc-code">CASE ${cno} · ${esc(p.code)}</span><span class="sc-title">${esc(p.title)}</span></div>
 <div class="sc-body">
 <div class="sc-left">
 <div class="sc-tab">${renderSolvedTable(p)}</div>
 <p class="sc-key"><span class="sc-key-l">KEYSTONE</span> ${p.divergence.text}</p>
 </div>
 <div class="sc-right">
 <div class="sc-wt-h">${SOL_WALK_LABEL}</div>
 <ol class="sc-wt">${stepsHtml}</ol>
 </div>
 </div>
 </div>`);
 });
 for(let i=0;i<sols.length;i+=PER_PAGE){
 const chunk = sols.slice(i,i+PER_PAGE).join('');
 push('p-solutions',
 `<div class="run-head"><span>CASE RESOLUTIONS</span><span>RESTRICTED</span></div>
 <div class="solpage" style="height:${SOLPAGE_H}px;gap:${SOL_GAP}px">${chunk}</div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);
 }

 /* ---- BACK MATTER ---- */
 ensureVerso();
 push('p-back',
 `<div class="run-head"><span></span><span></span></div>
 <div class="backmatter">
 ${mark}
 <h2 class="sec-h">Keep going.</h2>
 <p>You've worked eighty corrections. The Agency's archive runs deeper, and the interactive edition adds auto-checking, hints, and a new case every week.</p>
 <p class="dim">Play TIMELINE online, and find more from the studio, at <strong>southstudio</strong>.</p>
 <hr>
 <p class="dim small">TIMELINE, The Field Manual · © 2026 SouthStudio · An independent studio.<br>All cases generated and verified for unique solvability. Set in Newsreader &amp; IBM Plex Mono.</p>
 </div>
 <div class="run-foot"><span class="folio"></span><span>TIMELINE</span></div>`);

 return assemble(pages);
 }

 /* ---------- CSS + shell ---------- */
 function assemble(pages){
 const css = STYLE();
 return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TIMELINE, The Field Manual · SouthStudio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500;1,6..72,600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${css}</style></head>
<body>
<div class="toolbar" data-toolbar>
 <span class="tb-title">TIMELINE, Field Manual · ${pages.length} pp</span>
 <span class="tb-actions"><button onclick="window.print()">Print / Save PDF</button></span>
</div>
<div class="book">${pages.join('\n')}</div>
</body></html>`;
 }

 function STYLE(){ return `
:root{--paper:#faf8f2;--paper2:#f1ebdd;--ink:#1c1a16;--ink2:#46413a;--dim:#736b5f;--line:#ddd4c2;--line2:#c8bda6;--red:${RED};--serif:"Newsreader",Georgia,serif;--mono:"IBM Plex Mono",ui-monospace,monospace;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#54514b;}
body{font-family:var(--serif);color:var(--ink);-webkit-font-smoothing:antialiased;}
.toolbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 18px;background:#26241f;color:#e8e0d0;font-family:var(--mono);font-size:12px;letter-spacing:.1em;}
.toolbar button{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:8px 14px;border:1px solid #6f6757;background:transparent;color:#e8e0d0;cursor:pointer;border-radius:3px;}
.toolbar button:hover{background:var(--red);border-color:var(--red);color:#fff;}
.book{display:flex;flex-direction:column;align-items:center;gap:22px;padding:28px 14px 80px;}
.page{width:7in;height:10in;background:var(--paper);position:relative;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.32);}
.page.verso{padding:.62in .85in .55in .55in;}
.page.recto{padding:.62in .55in .55in .85in;}
em{font-style:italic;} strong{font-weight:600;}
.red{color:var(--red);}.dim{color:var(--dim);}.small{font-size:11px;}
.kick{font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--dim);}
.kick.red{color:var(--red);}
/* logo mark */
.mk{display:inline-grid;grid-template-columns:repeat(3,9px);grid-template-rows:repeat(3,9px);gap:2px;}
.mk i{border:1.3px solid var(--ink);display:block;}
.mk i.r{background:var(--red);border-color:var(--red);} .mk i.k{background:var(--ink);}
/* running head/foot */
.run-head{position:absolute;top:.34in;left:0;right:0;padding:0 .55in;display:flex;justify-content:space-between;font-family:var(--mono);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);}
.page.verso .run-head{padding:0 .55in 0 .85in;} .page.recto .run-head{padding:0 .55in 0 .85in;}
.run-foot{position:absolute;bottom:.32in;left:0;right:0;padding:0 .55in;display:flex;justify-content:space-between;font-family:var(--mono);font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);}
.page.verso .run-foot{padding:0 .85in 0 .55in;} .page.recto .run-foot{padding:0 .55in 0 .85in;}
.folio::before{counter-increment:folio;content:counter(folio);}
.book{counter-reset:folio 0;}
.sec-h{font-size:30px;font-weight:600;letter-spacing:-.01em;line-height:1.05;margin:6px 0 16px;}
/* half title */
.p-half .half,.p-title .titlepage,.p-back .backmatter,.p-colophon .colo{height:100%;display:flex;flex-direction:column;}
.half{justify-content:center;align-items:center;text-align:center;gap:18px;}
.bigtitle{font-weight:700;letter-spacing:-.03em;line-height:.88;font-size:64px;}
.bigtitle span{color:var(--red);}
.half .bigtitle{font-size:58px;}
/* title page */
.titlepage{justify-content:center;align-items:center;text-align:center;gap:20px;}
.titlepage .bigtitle{font-size:92px;}
.tagline{font-style:italic;font-size:19px;color:var(--ink2);}
.rule-tick{width:120px;height:0;border-top:2px solid var(--ink);position:relative;margin-top:6px;}
.rule-tick::after{content:"";position:absolute;left:50%;top:-4px;width:8px;height:8px;background:var(--red);transform:translateX(-50%) rotate(45deg);}
.byline{font-family:var(--mono);font-size:12px;letter-spacing:.34em;color:var(--dim);margin-top:4px;}
.titlepage .kick{margin-bottom:-6px;}
/* colophon */
.colo{justify-content:center;gap:14px;}
.colo p{font-size:15px;line-height:1.6;} .colo .dim{font-size:13px;}
.colo hr{border:0;height:1px;background:var(--line2);margin:6px 0;width:60px;}
/* briefing / howto / contents shared body */
.briefing,.howto,.contents{margin-top:.45in;}
.briefing p,.contents p{font-size:14.5px;line-height:1.62;margin-bottom:12px;text-wrap:pretty;}
.briefing p:first-of-type::first-letter{font-size:3.1em;float:left;line-height:.74;padding:6px 10px 0 0;color:var(--red);font-weight:600;}
.signoff{font-family:var(--mono);font-size:12px;letter-spacing:.1em;color:var(--dim);margin-top:8px;}
/* how to */
.how-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 22px;margin:18px 0 22px;}
.how-step{display:flex;gap:12px;} .how-step p{font-size:13.5px;line-height:1.5;}
.hn{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--red);}
.legendrow{display:flex;gap:22px;flex-wrap:wrap;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-family:var(--mono);font-size:11px;color:var(--ink2);letter-spacing:.04em;margin-bottom:14px;}
.legendrow span{display:inline-flex;align-items:center;gap:8px;}
.lgc{width:18px;height:18px;border:1px solid var(--line2);display:inline-flex;align-items:center;justify-content:center;}
.lgc b{font-size:11px;} .lgc b.x{color:var(--red);}
/* contents ladder */
.ladder{margin:18px 0;border-top:2px solid var(--ink);}
.lad-row{display:grid;grid-template-columns:64px 1.4fr 2fr auto 22px;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid var(--line);}
.lad-tier{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--red);}
.lad-name{font-size:17px;font-weight:600;}
.lad-note{font-size:12.5px;color:var(--dim);font-style:italic;}
.lad-grid{font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2);}
.lad-box{width:18px;height:18px;border:1.4px solid var(--ink);}
/* tier divider */
.p-divider{background:var(--ink);color:var(--paper);}
.p-divider .divider{height:100%;display:flex;flex-direction:column;justify-content:space-between;}
.p-divider .kick{color:#a99e8a;}
.div-mid{flex:1;display:flex;flex-direction:column;justify-content:center;}
.div-tier{font-family:var(--mono);font-size:14px;font-weight:600;letter-spacing:.3em;color:var(--red);margin-bottom:14px;}
.div-name{font-size:60px;font-weight:700;letter-spacing:-.02em;line-height:.95;}
.div-note{font-style:italic;font-size:18px;color:#cfc6b5;margin-top:16px;}
.div-top,.div-foot{display:flex;justify-content:space-between;}
.div-grid,.div-count{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#a99e8a;}
.p-soldiv .div-tier{color:var(--red);}
/* CASE LEFT */
.case-l{margin-top:.42in;height:calc(100% - .9in);display:flex;flex-direction:column;}
.case-no{font-family:var(--mono);font-size:12px;font-weight:600;letter-spacing:.2em;color:var(--red);}
.case-title{font-size:34px;font-weight:600;letter-spacing:-.015em;line-height:1.02;margin:8px 0 10px;}
.case-meta{display:flex;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-bottom:16px;}
.scenario p{font-size:13px;line-height:1.55;text-wrap:pretty;margin-bottom:9px;}
.scenario p:first-child::first-letter{font-size:3em;float:left;line-height:.76;padding:5px 9px 0 0;color:var(--red);font-weight:600;}
.scenario .directive{font-family:var(--mono);font-size:11px;line-height:1.5;color:var(--ink2);border-left:2px solid var(--red);padding-left:11px;margin-top:13px;letter-spacing:.01em;background:var(--paper2);padding-top:9px;padding-bottom:9px;padding-right:9px;}
.scenario .directive::first-letter{font-size:inherit;float:none;padding:0;color:inherit;font-weight:inherit;}
.evidence{margin-top:auto;padding-top:18px;}
.case-l.dense .evidence{margin-top:13px;padding-top:13px;}
.case-l.dense .case-title{font-size:26px;margin:6px 0 8px;}
.case-l.dense .scenario p{font-size:11.5px;line-height:1.42;margin-bottom:6px;}
.case-l.dense .scenario .directive{font-size:10px;line-height:1.45;margin-top:9px;padding:7px 8px;}
.case-l.dense .ev-head{padding-bottom:7px;}
.case-l.dense .cluelist{column-count:2;column-gap:18px;}
.case-l.dense .cluelist li{break-inside:avoid;-webkit-column-break-inside:avoid;padding:5px 0;}
.case-l.dense .cl-t{font-size:11px;line-height:1.34;}
.case-l.dense .cl-src{display:block;margin-bottom:2px;}
.ev-head{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);padding-bottom:9px;border-bottom:1.5px solid var(--ink);}
.ev-head span:last-child{color:var(--dim);font-weight:400;}
.cluelist{list-style:none;margin-top:4px;}
.cluelist li{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--line);align-items:baseline;}
.cl-n{font-family:var(--mono);font-size:10.5px;color:var(--dim);font-weight:600;min-width:16px;}
.cl-t{font-size:12.5px;line-height:1.45;}
.cl-src{font-family:var(--mono);font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin-right:7px;white-space:nowrap;border-bottom:1px solid var(--line2);padding-bottom:1px;}
.cl-src-bad{color:var(--red);border-color:var(--red);}
.ev-warn{font-family:var(--mono);font-size:9.5px;font-weight:600;letter-spacing:.04em;line-height:1.4;color:var(--red);border:1px solid var(--red);background:var(--paper);padding:6px 9px;margin:0 0 10px;text-wrap:pretty;}
.case-l.dense .ev-warn{font-size:8.5px;padding:5px 8px;margin-bottom:8px;}
.cl-bad .cl-t{color:var(--red);} .cl-bad .cl-n{color:var(--red);}
.cl-tag{font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:.12em;border:1px solid var(--red);color:var(--red);padding:1px 5px;border-radius:2px;margin-left:4px;white-space:nowrap;}
/* CASE RIGHT */
.case-r{margin-top:.42in;}
.wf-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.wf-leg{display:flex;gap:6px;}
.gridwrap{display:flex;justify-content:center;margin-bottom:22px;}
/* grid */
.grid{border-collapse:collapse;font-family:var(--mono);table-layout:fixed;}
.grid th,.grid td{border:1px solid var(--line2);}
.grid .g-corner{background:var(--paper2);border-color:var(--line2);}
.grid .g-catcol{background:var(--ink);color:var(--paper);font-size:8.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:4px 2px;text-align:center;}
.grid .g-colh{height:74px;vertical-align:bottom;padding:5px 0;background:var(--paper2);}
.grid .g-colh span{writing-mode:vertical-rl;transform:rotate(180deg);display:inline-block;white-space:nowrap;font-size:9px;color:var(--ink);letter-spacing:.01em;}
.grid .g-catrow{background:var(--ink);color:var(--paper);width:18px;}
.grid .g-catrow span{writing-mode:vertical-rl;transform:rotate(180deg);font-size:8.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;}
.grid .g-rowh{background:var(--paper2);text-align:right;padding:0 7px;font-size:9px;color:var(--ink);white-space:nowrap;letter-spacing:.01em;}
.grid .g-cell{background:var(--paper);}
.grid .g-blank{background:repeating-linear-gradient(45deg,var(--paper2) 0 3px,#e6ddc9 3px 4px);}
.grid.g4 .g-cell,.grid.g4 .g-colh,.grid.g4 .g-blank{width:27px;height:27px;}
.grid.g5 .g-cell,.grid.g5 .g-colh,.grid.g5 .g-blank{width:25px;height:25px;}
.grid.g4 .g-cell,.grid.g5 .g-cell{min-width:25px;}
/* record / answer table */
.record{margin-top:6px;}
.rec-head{font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding-bottom:8px;border-bottom:1.5px solid var(--ink);margin-bottom:10px;}
.ans{width:100%;border-collapse:collapse;}
.ans th,.ans td{border:1px solid var(--line2);}
.ans thead th{font-family:var(--mono);font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);background:var(--paper2);padding:7px 8px;text-align:left;}
.ans .ans-yr{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--red);background:var(--paper2);padding:0 9px;white-space:nowrap;width:1%;}
.ans tbody th.ans-yr{text-align:left;}
.ans-cell{height:.34in;background:var(--paper);}
/* solutions */
.solpage{margin-top:.42in;display:flex;flex-direction:column;}
.solcard{border:1px solid var(--line);background:var(--paper2);display:flex;flex-direction:column;justify-content:flex-start;padding:14px 17px;overflow:hidden;}
.sc-head{display:flex;align-items:baseline;gap:11px;margin-bottom:11px;padding-bottom:8px;border-bottom:1px solid var(--line2);}
.sc-code{font-family:var(--mono);font-size:10px;font-weight:600;letter-spacing:.13em;color:var(--red);white-space:nowrap;}
.sc-title{font-size:17px;font-weight:600;letter-spacing:-.01em;line-height:1.08;}
.sc-body{display:grid;grid-template-columns:0.92fr 1.08fr;gap:22px;align-items:start;flex:1;min-height:0;}
.sc-left{display:flex;flex-direction:column;gap:11px;min-width:0;}
.sol-tab{width:100%;border-collapse:collapse;font-size:10.5px;table-layout:fixed;}
.sol-tab th,.sol-tab td{border:1px solid var(--line2);padding:2.5px 7px;text-align:left;line-height:1.18;}
.sol-tab thead th{font-family:var(--mono);font-size:8px;letter-spacing:.06em;text-transform:uppercase;background:var(--paper);}
.sol-tab .ans-yr{font-family:var(--mono);font-weight:600;color:var(--red);background:var(--paper);font-size:10px;width:64px;}
.sc-key{font-size:11px;line-height:1.42;color:var(--ink2);}
.sc-key-l{font-family:var(--mono);font-size:7.5px;font-weight:700;letter-spacing:.1em;color:var(--ink);background:var(--paper);border:1px solid var(--line2);padding:1px 5px;border-radius:2px;margin-right:6px;}
.sc-right{min-width:0;border-left:1px solid var(--line2);padding-left:22px;align-self:stretch;}
.sc-wt-h{font-family:var(--mono);font-size:8px;font-weight:700;letter-spacing:.16em;color:var(--red);margin-bottom:9px;}
.sc-wt{margin:0;padding:0;list-style:none;counter-reset:wt;display:flex;flex-direction:column;gap:6px;}
.sc-wt li{position:relative;padding-left:24px;font-size:11px;line-height:1.34;color:var(--ink);text-wrap:pretty;}
.sc-wt li::before{counter-increment:wt;content:counter(wt,decimal-leading-zero);position:absolute;left:0;top:0;font-family:var(--mono);font-size:8.5px;font-weight:600;color:var(--ink-soft,#9a8f7e);}
.sc-wt li b{font-weight:700;}
.sc-wt .wt-why{color:var(--ink-soft,#8a8172);font-family:var(--mono);font-size:9px;letter-spacing:.01em;}
.sc-wt .wt-liar{color:var(--red);font-style:italic;}
.sc-wt li:has(.wt-liar)::before{content:"!";color:var(--red);}
/* field notes */
.notes-body{height:100%;display:flex;align-items:center;justify-content:center;}
.dotgrid{width:100%;height:78%;background:radial-gradient(circle at 1px 1px,var(--line2) 1.3px,transparent 0) 0 0/22px 22px;opacity:.7;}
/* back matter */
.backmatter{justify-content:center;gap:14px;}
.backmatter p{font-size:15px;line-height:1.6;} .backmatter .dim{font-size:13px;}
.backmatter hr{border:0;height:1px;background:var(--line2);width:60px;margin:8px 0;}
.backmatter .mk{margin-bottom:10px;}
@media print{
 html,body{background:#fff;}
 .toolbar{display:none;}
 .book{display:block!important;padding:0!important;counter-reset:folio 0;}
 .page{box-shadow:none!important;margin:0!important;height:9.9in!important;max-height:9.9in!important;overflow:hidden!important;page-break-after:always;break-after:page;page-break-inside:avoid;break-inside:avoid;}
 @page{size:7in 10in;margin:0;}
}
`;}

 globalThis.MAKEBOOK = build;
})();
