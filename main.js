/* =====================================================================
   main.js – שיפורים קטנים בלבד (כל התוכן כבר נמצא ב-HTML).
   תפריט נייד, אנימציית הופעה עדינה, סרטון הסדנה.
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
