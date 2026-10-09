/* =====================================================================
   main.js – שיפורים קטנים בלבד (כל התוכן כבר נמצא ב-HTML).
   תפריט נייד, אנימציית הופעה עדינה, סרטון הסדנה, לייטבוקס לעבודות.
   ===================================================================== */
(function () {
  "use strict";
  /* ---------- תפריט נייד ---------- */
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    };
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); btn.focus(); } });
  }
  /* ---------- אנימציית הופעה עדינה ---------- */
  var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }
})();

/* ===== סרטון הסדנה: ניגון שקט בלופ, כפתור סאונד, עצירה מחוץ למסך ===== */
(function () {
  var v = document.querySelector("video.ws-video");
  if (!v) return;
  var btn = document.querySelector(".video-sound");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userPaused = false;
  v.muted = true;
  if (reduce) { v.removeAttribute("autoplay"); v.pause(); }
  function sync() {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(!v.muted));
    btn.innerHTML = v.muted ? '🔈 <span>הפעלת סאונד</span>' : '🔊 <span>השתקה</span>';
  }
  if (btn) {
    btn.hidden = false;
    btn.addEventListener("click", function () {
      v.muted = !v.muted;
      if (!v.muted) { userPaused = false; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      sync();
    });
  }
  v.addEventListener("volumechange", sync);
  v.addEventListener("pause", function () { if (document.visibilityState === "visible" && v.dataset.auto !== "1") userPaused = true; v.dataset.auto = ""; });
  v.addEventListener("play", function () { userPaused = false; });
  if (!reduce && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!userPaused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
        else if (!v.paused) { v.dataset.auto = "1"; v.pause(); }
      });
    }, { threshold: 0.25 }).observe(v);
  }
  sync();
})();

/* ===== לייטבוקס לעבודות: פתיחה בגדול, חצים, מקלדת, החלקה, Esc ===== */
(function () {
  "use strict";
  var dataEl = document.getElementById("works-data"), dlg = document.getElementById("work-modal");
  if (!dataEl || !dlg || typeof dlg.showModal !== "function") return;   // בלי JS/dialog – הקישור פותח את התמונה עצמה
  var works; try { works = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var img = dlg.querySelector(".lb-img"), cur = 0, opener = null;
  function q(s) { return dlg.querySelector(s); }
  function show(i) {
    cur = (i + works.length) % works.length;
    var w = works[cur];
    img.removeAttribute("src"); img.removeAttribute("srcset");
    img.width = w.w; img.height = w.h; img.alt = w.alt;
    if (w.set) { img.sizes = "(max-width:700px) 92vw, 520px"; img.srcset = w.set; }
    img.src = w.src;
    q(".lb-title").textContent = w.t;
    q(".lb-en").textContent = w.en || "";
    q(".lb-desc").textContent = w.d || "";
    q(".lb-mat").textContent = w.m || "";
    q(".lb-count").textContent = (cur + 1) + " / " + works.length;
  }
  function open(i, el) {
    opener = el || document.activeElement; show(i);
    document.body.classList.add("lb-open");
    dlg.showModal();
    q(".modal-close").focus();
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener("close", function () { document.body.classList.remove("lb-open"); if (opener && opener.focus) opener.focus({ preventScroll: true }); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.work[data-i]");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button > 0) return;
    e.preventDefault(); open(parseInt(a.getAttribute("data-i"), 10) || 0, a);
  });
  q(".modal-close").addEventListener("click", close);
  q(".lb-prev").addEventListener("click", function () { show(cur - 1); });
  q(".lb-next").addEventListener("click", function () { show(cur + 1); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });   // לחיצה על הרקע
  q(".lb-contact").addEventListener("click", function () { opener = null; close(); });
  dlg.addEventListener("keydown", function (e) {
    // באתר מימין לשמאל: חץ שמאלה = הבא, חץ ימינה = הקודם
    if (e.key === "ArrowLeft") { e.preventDefault(); show(cur + 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(cur - 1); }
  });
  var x0 = null, y0 = null;
  dlg.addEventListener("touchstart", function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx > 0 ? 1 : -1));   // החלקה ימינה = הבא (RTL)
  }, { passive: true });
})();
