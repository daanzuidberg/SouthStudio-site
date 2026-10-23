/* SouthStudio — exclusive layer behaviour (pages with <body class="x">) */
(function () {
 "use strict";

 /* header turns light on dark chapters, dark on paper */
 var head = document.querySelector(".site-head");
 var darks = [].slice.call(document.querySelectorAll(".chapter--dark, .site-foot"));
 if (head && darks.length && "IntersectionObserver" in window) {
 var active = new Set(), io = null, timer = null;
 var setup = function () {
 if (io) io.disconnect();
 active.clear();
 var h = head.offsetHeight || 76;
 io = new IntersectionObserver(function (entries) {
 entries.forEach(function (e) { if (e.isIntersecting) active.add(e.target); else active.delete(e.target); });
 head.classList.toggle("on-dark", active.size > 0);
 }, { rootMargin: (-Math.floor(h / 2)) + "px 0px " + (-(window.innerHeight - Math.floor(h / 2) - 1)) + "px 0px", threshold: 0 });
 darks.forEach(function (d) { io.observe(d); });
 };
 setup();
 window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(setup, 200); });
 }

 /* the 9 cells of the big mark form the first letter of the shelf you point at */
 var mark = document.querySelector("[data-hero-mark]");
 if (mark) {
 // 3x3 pixel letters, cells numbered 1-9 row by row; "dim" cells soften the corners
 var GLYPHS = {
 B: { on: [1, 2, 4, 5, 7, 8], dim: [3, 9] },
 G: { on: [1, 2, 3, 4, 7, 8, 9], dim: [6] },
 F: { on: [1, 2, 3, 4, 5, 7] },
 O: { on: [1, 2, 3, 4, 6, 7, 8, 9] },
 E: { on: [1, 2, 3, 4, 5, 7, 8, 9] },
 I: { on: [1, 2, 3, 5, 7, 8, 9] }
 };
 var cells = [].slice.call(mark.querySelectorAll("i"));
 var base = cells.map(function (c) { return c.className; });
 var show = function (ch) {
 var g = GLYPHS[ch]; if (!g) return;
 cells.forEach(function (c, i) {
 var n = i + 1;
 c.style.transitionDelay = (i * 22) + "ms";
 c.className = g.on.indexOf(n) > -1 ? "on" : (g.dim && g.dim.indexOf(n) > -1 ? "dim" : "off");
 });
 };
 var hide = function () { cells.forEach(function (c, i) { c.style.transitionDelay = "0ms"; c.className = base[i]; }); };
 document.querySelectorAll("[data-cell]").forEach(function (el) {
 var t = el.querySelector(".sl-t");
 var ch = t ? t.textContent.trim().charAt(0).toUpperCase() : "";
 if (!GLYPHS[ch]) return;
 ["mouseenter", "focus"].forEach(function (ev) { el.addEventListener(ev, function () { show(ch); }); });
 ["mouseleave", "blur"].forEach(function (ev) { el.addEventListener(ev, hide); });
 });
 }
})();
