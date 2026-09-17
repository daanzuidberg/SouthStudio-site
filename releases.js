/* ============================================================
 SouthStudio — catalogue (single source of truth)

 Everything the studio makes lives here, in five collections:
   projects     ideas that can run across formats (a "thread")
   releases     numbered products (SouthStudio / 001, 002 …)
   films        SouthStudio Films
   journal      the journal: ideas, experiments, notes, behind the scenes
   experiences  interactive experiences

 Any item may point at a project with `project: "<id>"`; the thread
 renderer then connects the formats without duplicating content.
 Fields may be a string or {en, nl}. Nothing here is presented as
 finished unless status is "released" / "published".
 ============================================================ */
(function (global) {
 "use strict";

 var SHELVES = {
 books: { en: "Books", nl: "Boeken" },
 games: { en: "Games", nl: "Games" },
 films: { en: "Films", nl: "Films" },
 experiences: { en: "Experiences", nl: "Ervaringen" },
 objects: { en: "Objects", nl: "Objecten" }
 };

 /* ---- projects: one idea, many formats ---- */
 var PROJECTS = [
 {
 id: "silence",
 title: { en: "The Silence Project", nl: "Het Stilte-project" },
 question: { en: "Why has silence become uncomfortable?", nl: "Waarom is stilte ongemakkelijk geworden?" },
 note: {
 en: "One question, followed through several formats: a short film, writing, a small experiment you can take part in, and maybe an object. Nothing in this thread is finished yet.",
 nl: "Eén vraag, gevolgd door meerdere vormen: een korte film, geschreven stukken, een klein experiment waaraan je kunt meedoen, en misschien een object. Niets in deze draad is al af."
 },
 status: "concept"
 }
 ];

 /* ---- releases: numbered products ---- */
 var RELEASES = [
 {
 number: "001",
 slug: "timeline",
 title: "Timeline",
 category: { en: "History / Deduction", nl: "Geschiedenis / Deductie" },
 shelves: ["books", "games"],
 type: { en: "Book · Online", nl: "Boek · Online" },
 description: {
 en: "A deduction puzzle book set inside the Time Correction Agency. Eighty self-contained cases, each with exactly one answer, reachable by reasoning alone.",
 nl: "Een deductie-puzzelboek binnen de Time Correction Agency. Tachtig op zichzelf staande zaken, elk met precies één antwoord, alleen bereikbaar door te redeneren."
 },
 status: "released",
 statusLabel: { en: "Out now", nl: "Nu verkrijgbaar" },
 release: "2026",
 hero: "icons/og-timeline.png",
 gallery: [],
 url: "timeline.html",
 project: null
 },
 {
 number: "002",
 slug: null,
 title: null,
 category: { en: "Unannounced", nl: "Nog niet aangekondigd" },
 shelves: [],
 type: null,
 description: {
 en: "A different kind of thinking. Same studio, same standard.",
 nl: "Een andere manier van denken. Dezelfde studio, dezelfde standaard."
 },
 status: "coming",
 statusLabel: { en: "Coming soon", nl: "Binnenkort" },
 release: null,
 hero: null,
 gallery: [],
 url: null,
 project: null
 }
 ];

 /* ---- films: status "concept" until a real video exists (video: YouTube id) ---- */
 var FILMS = [
 { id: "f01", title: { en: "Why Has Silence Become Uncomfortable?", nl: "Waarom is stilte ongemakkelijk geworden?" }, theme: { en: "Attention", nl: "Aandacht" }, status: "concept", video: null, project: "silence", url: null },
 { id: "f02", title: { en: "Why Your Brain Lies to You", nl: "Waarom je brein tegen je liegt" }, theme: { en: "Perception", nl: "Waarneming" }, status: "concept", video: null, project: null, url: null },
 { id: "f03", title: { en: "Can You Trust Your Own Memories?", nl: "Kun je je eigen herinneringen vertrouwen?" }, theme: { en: "Memory", nl: "Geheugen" }, status: "concept", video: null, project: null, url: null },
 { id: "f04", title: { en: "Why Time Feels Faster As You Get Older", nl: "Waarom de tijd sneller lijkt te gaan als je ouder wordt" }, theme: { en: "Time", nl: "Tijd" }, status: "concept", video: null, project: null, url: null },
 { id: "f05", title: { en: "Why We Can't Stop Scrolling", nl: "Waarom we niet kunnen stoppen met scrollen" }, theme: { en: "Attention", nl: "Aandacht" }, status: "concept", video: null, project: null, url: null }
 ];
 var FILMS_CHANNEL = "https://www.youtube.com/@SouthStudio-Official";

 /* ---- journal: status "draft" until a real article page exists (url: "journal/<slug>.html") ---- */
 var JOURNAL_CATEGORIES = {
 ideas: { en: "Ideas", nl: "Ideeën" },
 experiments: { en: "Experiments", nl: "Experimenten" },
 notes: { en: "Notes", nl: "Notities" },
 behind: { en: "Behind the scenes", nl: "Achter de schermen" }
 };
 var JOURNAL = [
 { id: "j01", title: { en: "The Value of Being Bored", nl: "De waarde van verveling" }, category: "ideas", status: "draft", date: null, url: null, project: "silence" },
 { id: "j02", title: { en: "Why We Remember Things That Never Happened", nl: "Waarom we ons dingen herinneren die nooit gebeurd zijn" }, category: "ideas", status: "draft", date: null, url: null, project: null },
 { id: "j03", title: { en: "What Makes a Good Puzzle?", nl: "Wat maakt een goede puzzel?" }, category: "behind", status: "draft", date: null, url: null, project: null },
 { id: "j04", title: { en: "Why Some Objects Feel More Valuable Than Others", nl: "Waarom sommige objecten waardevoller aanvoelen dan andere" }, category: "notes", status: "draft", date: null, url: null, project: null }
 ];

 /* ---- experiences: interactive things (url relative to the language root) ---- */
 var EXPERIENCE_KINDS = [
 { id: "puzzle", en: "Browser puzzles", nl: "Browserpuzzels" },
 { id: "mystery", en: "Mystery experiences", nl: "Mysterie-ervaringen" },
 { id: "perception", en: "Perception experiments", nl: "Waarnemingsexperimenten" },
 { id: "story", en: "Interactive stories", nl: "Interactieve verhalen" },
 { id: "logic", en: "Logic experiences", nl: "Logica-ervaringen" }
 ];
 var EXPERIENCES = [
 {
 id: "timeline-online",
 title: { en: "Timeline, online", nl: "Timeline, online" },
 kind: "puzzle",
 description: { en: "A free set of deduction cases from the Time Correction Agency, playable in the browser. Checking, hints, autosave.", nl: "Een gratis set deductiezaken van de Time Correction Agency, speelbaar in de browser. Controle, hints, automatisch opslaan." },
 status: "released",
 statusLabel: { en: "Play now", nl: "Speel nu" },
 url: "play.html",
 release: "2026",
 project: null,
 releaseNumber: "001"
 },
 {
 id: "silence-minute",
 title: { en: "One minute of silence", nl: "Eén minuut stilte" },
 kind: "perception",
 description: { en: "A small perception experiment about how long a quiet minute actually feels. Part of the Silence Project.", nl: "Een klein waarnemingsexperiment over hoe lang een stille minuut eigenlijk aanvoelt. Onderdeel van het Stilte-project." },
 status: "concept",
 statusLabel: { en: "Concept", nl: "Concept" },
 url: null,
 release: null,
 project: "silence",
 releaseNumber: null
 }
 ];

 /* ============================================================ helpers */
 function t(v, lang) {
 if (v == null) return "";
 if (typeof v === "string") return v;
 return v[lang] || v.en || "";
 }
 function esc(s) {
 return String(s).replace(/[&<>"']/g, function (c) {
 return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
 });
 }
 var UI = {
 untitled: { en: "Untitled", nl: "Naamloos" },
 concept: { en: "Concept", nl: "Concept" },
 notFilmed: { en: "Not yet filmed", nl: "Nog niet gefilmd" },
 draft: { en: "Being written", nl: "Wordt geschreven" },
 published: { en: "Published", nl: "Gepubliceerd" },
 watch: { en: "Watch", nl: "Bekijk" },
 read: { en: "Read", nl: "Lees" },
 partOf: { en: "Part of", nl: "Onderdeel van" },
 film: { en: "Film", nl: "Film" },
 journal: { en: "Journal", nl: "Journal" },
 experience: { en: "Experience", nl: "Ervaring" },
 object: { en: "Object", nl: "Object" },
 notYet: { en: "Not yet", nl: "Nog niet" },
 studioPrefix: "SS"
 };
 function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
 function project(id) { return id ? byId(PROJECTS, id) : null; }
 function partOf(item, lang) {
 var p = project(item.project);
 return p ? '<span class="thread-tag">' + esc(t(UI.partOf, lang)) + ' ' + esc(t(p.title, lang)) + '</span>' : "";
 }
 function shelfNames(r, lang) {
 return (r.shelves || []).map(function (k) { return t(SHELVES[k], lang); }).join(" · ");
 }
 function pad(n) { return String(n).padStart(2, "0"); }
 function emptyMark() { return '<span class="cell cell--lg cell--dim" aria-hidden="true">' + new Array(10).join("<i></i>") + "</span>"; }

 /* ============================================================ releases */
 function rowHTML(r, lang, root) {
 var released = r.status === "released" && r.url;
 var title = r.title ? esc(t(r.title, lang)) : "<em>" + esc(t(UI.untitled, lang)) + "</em>";
 var tag = released ? "tag tag--solid-red" : "tag tag--dashed";
 var inner =
 '<span class="ar-n">' + UI.studioPrefix + ' / <b>' + esc(r.number) + '</b></span>' +
 '<span class="ar-t">' + title + '</span>' +
 '<span class="ar-c">' + esc(t(r.category, lang)) + '</span>' +
 '<span class="ar-f">' + esc(released ? t(r.type, lang) : (r.release ? r.release : "—")) + '</span>' +
 '<span class="ar-s ' + tag + '">' + esc(t(r.statusLabel, lang)) + '</span>';
 if (released) return '<a class="archive-row" href="' + esc(root + r.url) + '">' + inner + '</a>';
 return '<div class="archive-row archive-row--concept">' + inner + '</div>';
 }
 function cardHTML(r, lang, base, root) {
 var released = r.status === "released" && r.url;
 var title = r.title ? esc(t(r.title, lang)) : esc(t(r.statusLabel, lang));
 var media = r.hero
 ? '<img src="' + esc(base + r.hero) + '" alt="' + esc(t(r.title, lang)) + '" loading="lazy" />'
 : '<span class="rc-placeholder">' + emptyMark() + '<span class="num">' + UI.studioPrefix + ' / ' + esc(r.number) + '</span></span>';
 var inner =
 '<div class="rc-media">' + media + '</div>' +
 '<div class="rc-body">' +
 '<span class="num">' + UI.studioPrefix + ' / <b>' + esc(r.number) + '</b></span>' +
 '<h2 class="rc-title">' + title + '</h2>' +
 '<p class="rc-cat">' + esc(t(r.category, lang)) + '</p>' +
 '<p class="small muted rc-desc">' + esc(t(r.description, lang)) + '</p>' +
 '<div class="rc-foot">' +
 '<span class="meta">' + esc(released ? [t(r.type, lang), shelfNames(r, lang), r.release].filter(Boolean).join(" · ") : "") + '</span>' +
 '<span class="' + (released ? "tag tag--solid-red" : "tag tag--dashed") + '">' + esc(t(r.statusLabel, lang)) + '</span>' +
 '</div>' +
 '</div>';
 if (released) return '<a class="rc" href="' + esc(root + r.url) + '">' + inner + '</a>';
 return '<div class="rc rc--coming">' + inner + '</div>';
 }
 function shelfCounts() {
 var c = {};
 Object.keys(SHELVES).forEach(function (k) { c[k] = 0; });
 RELEASES.forEach(function (r) { if (r.status === "released") (r.shelves || []).forEach(function (k) { if (k in c) c[k]++; }); });
 FILMS.forEach(function (f) { if (f.status === "released") c.films++; });
 EXPERIENCES.forEach(function (x) { if (x.status === "released" && !x.releaseNumber) c.experiences++; });
 return c;
 }

 /* ============================================================ films */
 function filmHTML(f, i, lang, root) {
 var released = f.status === "released" && (f.video || f.url);
 var href = f.url ? root + f.url : (f.video ? "https://www.youtube.com/watch?v=" + f.video : null);
 var frame = released && f.video
 ? '<img src="https://i.ytimg.com/vi/' + esc(f.video) + '/hqdefault.jpg" alt="" loading="lazy" />'
 : '<span class="film-slate">' + emptyMark() + '<span class="num">F / ' + pad(i + 1) + '</span><span class="meta">' + esc(t(UI.notFilmed, lang)) + '</span></span>';
 var inner =
 '<div class="film-frame' + (released ? "" : " film-frame--concept") + '">' + frame + '</div>' +
 '<div class="film-body">' +
 '<span class="num">F / <b>' + pad(i + 1) + '</b> · ' + esc(t(f.theme, lang)) + '</span>' +
 '<h3 class="film-title">' + esc(t(f.title, lang)) + '</h3>' +
 '<div class="film-foot">' +
 (released ? '<span class="link">' + esc(t(UI.watch, lang)) + ' <span aria-hidden="true">→</span></span>' : '<span class="tag tag--dashed">' + esc(t(UI.concept, lang)) + '</span>') +
 partOf(f, lang) +
 '</div>' +
 '</div>';
 if (released && href) return '<a class="film" href="' + esc(href) + '"' + (f.url ? "" : ' target="_blank" rel="noopener"') + '>' + inner + '</a>';
 return '<div class="film film--concept">' + inner + '</div>';
 }

 /* ============================================================ journal */
 function journalHTML(j, i, lang, root) {
 var published = j.status === "published" && j.url;
 var inner =
 '<span class="jr-n">' + pad(i + 1) + '</span>' +
 '<span class="jr-t">' + esc(t(j.title, lang)) + '</span>' +
 '<span class="jr-c">' + esc(t(JOURNAL_CATEGORIES[j.category], lang)) + '</span>' +
 '<span class="jr-s">' + (published ? esc(j.date || "") : '<span class="tag tag--dashed">' + esc(t(UI.draft, lang)) + '</span>') + partOf(j, lang) + '</span>';
 if (published) return '<a class="jr" href="' + esc(root + j.url) + '">' + inner + '</a>';
 return '<div class="jr jr--draft">' + inner + '</div>';
 }
 function journalCounts() {
 var c = {}; Object.keys(JOURNAL_CATEGORIES).forEach(function (k) { c[k] = 0; });
 JOURNAL.forEach(function (j) { if (j.status === "published") c[j.category]++; });
 return c;
 }

 /* ============================================================ experiences */
 function kindName(id, lang) { var k = byId(EXPERIENCE_KINDS, id); return k ? t(k, lang) : ""; }
 function experienceHTML(x, i, lang, root) {
 var released = x.status === "released" && x.url;
 var inner =
 '<span class="xp-n">' + (x.releaseNumber ? UI.studioPrefix + ' / <b>' + esc(x.releaseNumber) + '</b>' : 'X / ' + pad(i + 1)) + '</span>' +
 '<span class="xp-t">' + esc(t(x.title, lang)) + '</span>' +
 '<span class="xp-k">' + esc(kindName(x.kind, lang)) + '</span>' +
 '<span class="xp-d small muted">' + esc(t(x.description, lang)) + '</span>' +
 '<span class="xp-s">' + (released ? '<span class="tag tag--solid-ink">' + esc(t(x.statusLabel, lang)) + '</span>' : '<span class="tag tag--dashed">' + esc(t(x.statusLabel, lang)) + '</span>') + partOf(x, lang) + '</span>';
 if (released) return '<a class="xp" href="' + esc(root + x.url) + '">' + inner + '</a>';
 return '<div class="xp xp--concept">' + inner + '</div>';
 }
 function kindsHTML(lang) {
 return EXPERIENCE_KINDS.map(function (k, i) {
 var n = EXPERIENCES.filter(function (x) { return x.kind === k.id && x.status === "released"; }).length;
 return '<div class="kind"><span class="num">' + pad(i + 1) + '</span><span class="kind-t">' + esc(t(k, lang)) + '</span><span class="meta">' + (n ? pad(n) : "—") + '</span></div>';
 }).join("");
 }

 /* ============================================================ threads */
 function threadHTML(p, lang, root) {
 var film = FILMS.filter(function (f) { return f.project === p.id; })[0];
 var art = JOURNAL.filter(function (j) { return j.project === p.id; })[0];
 var xp = EXPERIENCES.filter(function (x) { return x.project === p.id; })[0];
 var rel = RELEASES.filter(function (r) { return r.project === p.id; })[0];
 return '<div class="thread">' +
 '<div class="thread-head"><span class="kicker kicker--red"><span class="dot"></span>' + esc(t(p.title, lang)) + '</span><span class="tag tag--dashed">' + esc(t(UI.concept, lang)) + '</span></div>' +
 '<p class="thread-q">' + esc(t(p.question, lang)) + '</p>' +
 '<p class="small muted thread-note">' + esc(t(p.note, lang)) + '</p>' +
 '<div class="thread-rows">' +
 slotRow(t(UI.film, lang), film, film && film.status === "released" && film.url ? root + film.url : null, film ? (film.status === "released" ? UI.published : UI.notFilmed) : null, lang) +
 slotRow(t(UI.journal, lang), art, art && art.status === "published" && art.url ? root + art.url : null, art ? (art.status === "published" ? UI.published : UI.draft) : null, lang) +
 slotRow(t(UI.experience, lang), xp, xp && xp.status === "released" && xp.url ? root + xp.url : null, xp ? (xp.status === "released" ? xp.statusLabel : UI.concept) : null, lang) +
 slotRow(t(UI.object, lang), rel, rel && rel.status === "released" && rel.url ? root + rel.url : null, rel ? rel.statusLabel : null, lang) +
 '</div></div>';
 function slotRow(label, item, href, statusObj, lang) {
 var status = item ? t(statusObj, lang) : t(UI.notYet, lang);
 var title = item ? esc(t(item.title, lang)) : "—";
 var inner = '<span class="th-f">' + esc(label) + '</span><span class="th-t' + (item ? "" : " th-t--empty") + '">' + title + '</span><span class="th-s">' + esc(status) + '</span>';
 return href ? '<a class="th-row" href="' + esc(href) + '">' + inner + '</a>' : '<div class="th-row">' + inner + '</div>';
 }
 }

 /* ============================================================ mount */
 function mount(rootEl) {
 var doc = rootEl || document;
 doc.querySelectorAll("[data-archive]").forEach(function (el) {
 var lang = el.getAttribute("data-lang") || document.documentElement.lang || "en";
 var base = el.getAttribute("data-base") || "";
 var root = el.getAttribute("data-root") || "";
 var view = el.getAttribute("data-view") || "list";
 var limit = parseInt(el.getAttribute("data-limit") || "0", 10);
 var exclude = el.getAttribute("data-exclude") || "";
 var list = RELEASES.filter(function (r) { return !exclude || r.slug !== exclude; });
 if (limit > 0) list = list.slice(0, limit);
 el.innerHTML = list.map(function (r) { return view === "cards" ? cardHTML(r, lang, base, root) : rowHTML(r, lang, root); }).join("");
 });
 doc.querySelectorAll("[data-collection]").forEach(function (el) {
 var lang = el.getAttribute("data-lang") || document.documentElement.lang || "en";
 var root = el.getAttribute("data-root") || "";
 var which = el.getAttribute("data-collection");
 var limit = parseInt(el.getAttribute("data-limit") || "0", 10);
 var list, fn;
 if (which === "films") { list = FILMS; fn = filmHTML; }
 else if (which === "journal") { list = JOURNAL; fn = journalHTML; }
 else if (which === "experiences") { list = EXPERIENCES; fn = experienceHTML; }
 else if (which === "experience-kinds") { el.innerHTML = kindsHTML(lang); return; }
 else return;
 if (limit > 0) list = list.slice(0, limit);
 el.innerHTML = list.map(function (x, i) { return fn(x, i, lang, root); }).join("");
 });
 doc.querySelectorAll("[data-thread]").forEach(function (el) {
 var lang = el.getAttribute("data-lang") || document.documentElement.lang || "en";
 var root = el.getAttribute("data-root") || "";
 var p = project(el.getAttribute("data-thread"));
 el.innerHTML = p ? threadHTML(p, lang, root) : "";
 });
 doc.querySelectorAll("[data-shelf-count]").forEach(function (el) {
 var n = shelfCounts()[el.getAttribute("data-shelf-count")] || 0;
 el.textContent = n > 0 ? pad(n) : "—";
 });
 doc.querySelectorAll("[data-journal-count]").forEach(function (el) {
 var n = journalCounts()[el.getAttribute("data-journal-count")] || 0;
 el.textContent = n > 0 ? pad(n) : "—";
 });
 doc.querySelectorAll("[data-films-channel]").forEach(function (el) { el.setAttribute("href", FILMS_CHANNEL); });
 }

 global.SouthStudio = {
 projects: PROJECTS, releases: RELEASES, films: FILMS, journal: JOURNAL, experiences: EXPERIENCES,
 shelves: SHELVES, journalCategories: JOURNAL_CATEGORIES, experienceKinds: EXPERIENCE_KINDS,
 filmsChannel: FILMS_CHANNEL, t: t, mount: mount, shelfCounts: shelfCounts, journalCounts: journalCounts
 };
 if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { mount(); });
 else mount();
})(window);
