/* ============================================================
 SouthStudio — release catalogue (single source of truth)
 Every SouthStudio release gets a number in the order it is
 finished. Add new entries here; the archive on the homepage,
 archive.html and project pages render from this list.
 Fields may be a string or {en, nl}.
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
 url: "timeline.html"
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
 url: null
 }
 ];

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
 open: { en: "Open", nl: "Open" },
 studioPrefix: "SS"
 };

 function shelfNames(r, lang) {
 return (r.shelves || []).map(function (k) { return t(SHELVES[k], lang); }).join(" · ");
 }

 function rowHTML(r, lang) {
 var released = r.status === "released" && r.url;
 var title = r.title ? esc(t(r.title, lang)) : "<em>" + esc(t(UI.untitled, lang)) + "</em>";
 var tag = released ? "tag tag--solid-red" : "tag tag--dashed";
 var inner =
 '<span class="ar-n">' + UI.studioPrefix + ' / <b>' + esc(r.number) + '</b></span>' +
 '<span class="ar-t">' + title + '</span>' +
 '<span class="ar-c">' + esc(t(r.category, lang)) + '</span>' +
 '<span class="ar-f">' + esc(released ? t(r.type, lang) : (r.release ? r.release : "—")) + '</span>' +
 '<span class="ar-s ' + tag + '">' + esc(t(r.statusLabel, lang)) + '</span>';
 if (released) return '<a class="archive-row" href="' + esc(r.url) + '">' + inner + '</a>';
 return '<div class="archive-row archive-row--concept">' + inner + '</div>';
 }

 function cardHTML(r, lang, base) {
 var released = r.status === "released" && r.url;
 var title = r.title ? esc(t(r.title, lang)) : esc(t(r.statusLabel, lang));
 var media = r.hero
 ? '<img src="' + esc(base + r.hero) + '" alt="' + esc(t(r.title, lang)) + '" loading="lazy" />'
 : '<span class="rc-placeholder"><span class="num">' + UI.studioPrefix + ' / ' + esc(r.number) + '</span></span>';
 var inner =
 '<div class="rc-media">' + media + '</div>' +
 '<div class="rc-body">' +
 '<span class="num">' + UI.studioPrefix + ' / <b>' + esc(r.number) + '</b></span>' +
 '<h3 class="rc-title">' + title + '</h3>' +
 '<p class="rc-cat">' + esc(t(r.category, lang)) + '</p>' +
 '<p class="small muted rc-desc">' + esc(t(r.description, lang)) + '</p>' +
 '<div class="rc-foot">' +
 '<span class="meta">' + esc(released ? [t(r.type, lang), shelfNames(r, lang), r.release].filter(Boolean).join(" · ") : "") + '</span>' +
 '<span class="' + (released ? "tag tag--solid-red" : "tag tag--dashed") + '">' + esc(t(r.statusLabel, lang)) + '</span>' +
 '</div>' +
 '</div>';
 if (released) return '<a class="rc" href="' + esc(r.url) + '">' + inner + '</a>';
 return '<div class="rc rc--coming">' + inner + '</div>';
 }

 function shelfCounts() {
 var c = {};
 Object.keys(SHELVES).forEach(function (k) { c[k] = 0; });
 RELEASES.forEach(function (r) {
 if (r.status !== "released") return;
 (r.shelves || []).forEach(function (k) { if (k in c) c[k]++; });
 });
 return c;
 }

 function mount(root) {
 (root || document).querySelectorAll("[data-archive]").forEach(function (el) {
 var lang = el.getAttribute("data-lang") || document.documentElement.lang || "en";
 var base = el.getAttribute("data-base") || "";
 var view = el.getAttribute("data-view") || "list";
 var limit = parseInt(el.getAttribute("data-limit") || "0", 10);
 var exclude = el.getAttribute("data-exclude") || "";
 var list = RELEASES.filter(function (r) { return !exclude || r.slug !== exclude; });
 if (limit > 0) list = list.slice(0, limit);
 el.innerHTML = list.map(function (r) { return view === "cards" ? cardHTML(r, lang, base) : rowHTML(r, lang); }).join("");
 });
 (root || document).querySelectorAll("[data-shelf-count]").forEach(function (el) {
 var n = shelfCounts()[el.getAttribute("data-shelf-count")] || 0;
 el.textContent = n > 0 ? String(n).padStart(2, "0") : "—";
 });
 }

 global.SouthStudio = { releases: RELEASES, shelves: SHELVES, t: t, mount: mount, shelfCounts: shelfCounts };
 if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { mount(); });
 else mount();
})(window);
