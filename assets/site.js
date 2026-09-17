/* ============================================================
 SouthStudio — shared interactions
 header state · mobile menu · scroll reveals · forms · pre-order modal
 ============================================================ */
(function () {
 "use strict";

 var LANG = (document.documentElement.lang || "en").slice(0, 2);
 var I18N = {
 en: {
 newsBad: "// Enter a valid email to receive the Dispatch.",
 sending: "Sending…",
 newsOk: "// Confirmed. You're on the SouthStudio dispatch list.",
 newsErr: "// Something went wrong, please try again or email info@southstudio.online.",
 subscribed: "you@subscribed.now",
 required: "Required.",
 badEmail: "Enter a valid email.",
 investigator: "Investigator",
 tryAgain: "Try again",
 preorderType: "Pre-order",
 logged: "Reservation logged",
 reserved: "Copy reserved, ",
 reservedNote: "We've added you to the first print run of <em>Timeline</em>. You'll get a dispatch the moment pre-orders ship, no charge until then.",
 tag1: "First edition", tag2: "Signed by the studio", tag3: "Free cases online",
 close: "Close"
 },
 nl: {
 newsBad: "// Vul een geldig e-mailadres in om de Dispatch te ontvangen.",
 sending: "Versturen…",
 newsOk: "// Bevestigd. Je staat op de SouthStudio-lijst.",
 newsErr: "// Er ging iets mis, probeer het opnieuw of mail info@southstudio.online.",
 subscribed: "jij@ingeschreven.nu",
 required: "Verplicht.",
 badEmail: "Vul een geldig e-mailadres in.",
 investigator: "Onderzoeker",
 tryAgain: "Opnieuw",
 preorderType: "Reservering",
 logged: "Reservering genoteerd",
 reserved: "Exemplaar gereserveerd, ",
 reservedNote: "We hebben je toegevoegd aan de eerste druk van <em>Timeline</em>. Je krijgt bericht zodra de reserveringen verzonden worden, tot die tijd betaal je niets.",
 tag1: "Eerste druk", tag2: "Gesigneerd door de studio", tag3: "Gratis zaken online",
 close: "Sluiten"
 }
 };
 var T = I18N[LANG] || I18N.en;
 var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 /* ---- header scroll state ---- */
 var head = document.querySelector(".site-head");
 function onScroll() { if (head) head.classList.toggle("scrolled", window.scrollY > 8); }
 window.addEventListener("scroll", onScroll, { passive: true });
 onScroll();

 /* ---- mobile menu ---- */
 var burger = document.querySelector(".burger");
 var menu = document.querySelector(".mobile-menu");
 if (burger && menu) {
 if (!menu.id) menu.id = "mobile-menu";
 burger.setAttribute("aria-controls", menu.id);
 burger.setAttribute("aria-expanded", "false");
 var setMenu = function (open) {
 menu.classList.toggle("open", open);
 burger.classList.toggle("open", open);
 burger.setAttribute("aria-expanded", open ? "true" : "false");
 document.body.style.overflow = open ? "hidden" : "";
 };
 burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
 menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
 document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });
 }

 /* ---- scroll reveal (fade, line masks, image clip) ---- */
 if ("IntersectionObserver" in window) {
 var io = new IntersectionObserver(function (entries) {
 entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
 }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
 document.querySelectorAll(".reveal, [data-reveal-host], [data-lines]").forEach(function (el) { io.observe(el); });
 } else {
 document.querySelectorAll(".reveal, [data-reveal-host], [data-lines]").forEach(function (el) { el.classList.add("in"); });
 }

 /* ---- form submission helper (real POST + mailto fallback) ---- */
 function endpoint() {
 var m = document.querySelector('meta[name="form-endpoint"]');
 return m ? (m.getAttribute("content") || "").trim() : "";
 }
 function send(type, data, onOk, onErr) {
 var ep = endpoint();
 if (!ep) {
 var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
 window.location.href = "mailto:info@southstudio.online?subject=" + encodeURIComponent("SouthStudio, " + type) + "&body=" + encodeURIComponent(body);
 setTimeout(onOk, 300);
 return;
 }
 var fd = new FormData();
 Object.keys(data).forEach(function (k) { fd.append(k, data[k]); });
 fetch(ep, { method: "POST", body: fd, headers: { "Accept": "application/json" } })
 .then(function (r) { if (r.ok) onOk(); else onErr(); })
 .catch(onErr);
 }

 /* ---- newsletter ---- */
 document.querySelectorAll("[data-news]").forEach(function (form) {
 var input = form.querySelector("input");
 var note = form.parentElement.querySelector(".form-note");
 if (note) { note.setAttribute("role", "status"); note.setAttribute("aria-live", "polite"); }
 form.addEventListener("submit", function (ev) {
 ev.preventDefault();
 var v = (input.value || "").trim();
 if (!note) return;
 if (!EMAIL.test(v)) { note.textContent = T.newsBad; note.className = "form-note err"; input.focus(); return; }
 var btn = form.querySelector("button");
 if (btn) btn.disabled = true;
 note.textContent = T.sending; note.className = "form-note";
 send("Newsletter", { email: v }, function () {
 note.textContent = T.newsOk; note.className = "form-note ok";
 input.value = ""; input.setAttribute("placeholder", T.subscribed);
 if (btn) btn.disabled = false;
 }, function () {
 note.textContent = T.newsErr; note.className = "form-note err";
 if (btn) btn.disabled = false;
 });
 });
 });

 /* ---- pre-order modal ---- */
 var overlay = document.querySelector("[data-modal]");
 if (overlay) {
 var modalBody = overlay.querySelector(".modal-body");
 var origBody = modalBody ? modalBody.innerHTML : "";
 var opener = null;

 var openModal = function (ev) {
 if (ev) ev.preventDefault();
 opener = ev && ev.currentTarget ? ev.currentTarget : document.activeElement;
 if (modalBody) modalBody.innerHTML = origBody;
 wireForm();
 overlay.classList.add("open");
 document.body.style.overflow = "hidden";
 var first = overlay.querySelector("input") || overlay.querySelector("button");
 if (first) setTimeout(function () { first.focus(); }, 120);
 };
 var closeModal = function () {
 if (!overlay.classList.contains("open")) return;
 overlay.classList.remove("open");
 document.body.style.overflow = "";
 if (opener && opener.focus) opener.focus();
 };
 document.querySelectorAll("[data-open-preorder]").forEach(function (b) { b.addEventListener("click", openModal); });
 overlay.addEventListener("click", function (e) { if (e.target === overlay || e.target.closest("[data-close]")) closeModal(); });
 document.addEventListener("keydown", function (e) {
 if (e.key === "Escape") closeModal();
 if (e.key === "Tab" && overlay.classList.contains("open")) {
 var f = overlay.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
 if (!f.length) return;
 var first = f[0], last = f[f.length - 1];
 if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
 else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
 }
 });

 var wireForm = function () {
 var form = overlay.querySelector("form");
 if (!form) return;
 form.addEventListener("submit", function (ev) {
 ev.preventDefault();
 var valid = true;
 form.querySelectorAll("[data-required]").forEach(function (row) {
 var input = row.querySelector("input");
 var err = row.querySelector(".input-err");
 var v = (input.value || "").trim();
 var bad = false;
 if (!v) { bad = true; err.textContent = T.required; }
 else if (input.type === "email" && !EMAIL.test(v)) { bad = true; err.textContent = T.badEmail; }
 if (bad) valid = false; else err.textContent = "";
 row.classList.toggle("bad", bad);
 input.setAttribute("aria-invalid", bad ? "true" : "false");
 });
 if (!valid) { var firstBad = form.querySelector(".bad input"); if (firstBad) firstBad.focus(); return; }
 var consent = form.querySelector('[name="consent"]');
 if (consent && !consent.checked) { var cr = consent.closest(".consent-row"); if (cr) cr.classList.add("bad"); consent.focus(); return; }
 var name = (form.querySelector('[name="name"]') || {}).value || T.investigator;
 var sbtn = form.querySelector('button[type="submit"]');
 if (sbtn) { sbtn.disabled = true; sbtn.textContent = T.sending; }
 var lead = { name: name, email: (form.querySelector('[name="email"]') || {}).value || "", edition: (form.querySelector('[name="edition"]') || {}).value || "" };
 send(T.preorderType, lead, function () {
 modalBody.innerHTML =
 '<span class="tag tag--red" style="align-self:flex-start">' + T.logged + '</span>' +
 '<h3 class="h3" style="margin-top:6px">' + T.reserved + escapeHtml(name.split(" ")[0]) + '.</h3>' +
 '<p class="muted small">' + T.reservedNote + '</p>' +
 '<div class="row gap-12 wrap-gap mt-12"><span class="tag tag--red">' + T.tag1 + '</span><span class="tag">' + T.tag2 + '</span><span class="tag tag--blue">' + T.tag3 + '</span></div>' +
 '<button class="btn btn--ink mt-20" data-close style="align-self:flex-start">' + T.close + ' <span class="arr">→</span></button>';
 var c = modalBody.querySelector("[data-close]"); if (c) c.focus();
 }, function () { if (sbtn) { sbtn.disabled = false; sbtn.textContent = T.tryAgain; } });
 });
 };
 }

 function escapeHtml(s) {
 return String(s).replace(/[&<>"']/g, function (c) {
 return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
 });
 }
})();
