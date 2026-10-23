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

 /* the red cell of the big mark follows the shelf you point at */
 var mark = document.querySelector("[data-hero-mark]");
 if (mark) {
 var cells = [].slice.call(mark.children), home = 1;
 var light = function (n) { cells.forEach(function (c, i) { c.classList.toggle("on", i === n); }); };
 document.querySelectorAll("[data-cell]").forEach(function (el) {
 var n = parseInt(el.getAttribute("data-cell"), 10) - 1;
 ["mouseenter", "focus"].forEach(function (ev) { el.addEventListener(ev, function () { light(n); }); });
 ["mouseleave", "blur"].forEach(function (ev) { el.addEventListener(ev, function () { light(home); }); });
 });
 }
})();
