/* =====================================================================
   main.js – בונה את האתר מתוך content.js. אין צורך לערוך כאן.
   ===================================================================== */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) { console.warn("content.js לא נטען"); return; }
  var C = S.contact;

  /* ---------- עזרים ---------- */
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // טקסט רגיל. ליתר ביטחון: כל [להשלים...] שנשכח בטעות לא מוצג באתר
  function fmt(t) { return esc(t).replace(/\s*\[[^\]]*להשלים[^\]]*\]/g, ""); }
  function wa(text) { return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text || "היי נוית 😊"); }
  var P = S.prints || { options: [] };
  // "A5 ב-79 ₪ · A4 ב-119 ₪" – ה-"ב-" שומר על סדר נכון של אנגלית ומספרים בעברית
  function printPrices(sep) { return P.options.map(function (o) { return '<span class="pp">' + esc(o.label.replace("הדפס ", "")) + " ב-" + esc(o.price) + "</span>"; }).join(sep); }
  var IG_URL = "https://www.instagram.com/" + C.instagram + "/";
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function put(name, html) { $all('[data-render="' + name + '"]').forEach(function (el) { el.innerHTML = html; }); }
  var ICON_WA = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.7 14.7 0 0 0 5.6 5c2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.6s.3-1.4.2-1.6-.3-.2-.6-.4z"/></svg>';
  var ICON_IG = '<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 2c-2.7 0-3 0-4.1.1C3.3 2.3 2.3 4.6 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.3 1.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.3-.2 5.6-1.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1C21.7 3.3 19.4 2.3 16.1 2.1 15 2 14.7 2 12 2zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4C3.8 15 3.8 14.7 3.8 12s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4.1-.1z"/></svg>';
  var LOGO = '<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="9" width="28" height="30" fill="#F4A98A" transform="rotate(-8 19 24)"/><circle cx="32" cy="17" r="11" fill="#EDBE3A"/><path d="M14 44V31a9 9 0 0 1 18 0v13z" fill="#9DB8A6"/><rect x="20" y="3" width="16" height="6" fill="rgba(244,231,198,.9)" transform="rotate(12 28 6)"/></svg>';
  var page = document.body.getAttribute("data-page");

  /* ---------- כותרת, פוטר, וואטסאפ צף ---------- */
  var navItems = [["index.html", "בית", "home"], ["shop.html", "חנות", "shop"], ["workshops.html", "סדנאות", "workshops"], ["about.html", "אודות", "about"], ["contact.html", "צור קשר", "contact"]];
  put("header",
    '<a class="skip" href="#main">דילוג לתוכן</a>' +
    '<header class="site-header"><div class="wrap">' +
      '<a class="logo" href="index.html" aria-label="' + esc(C.name) + ' – לעמוד הבית">' + LOGO +
        '<span class="logo-text">' + esc(C.name) + '<small>' + esc(C.brand) + '</small></span></a>' +
      '<button class="menu-btn" aria-label="תפריט" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>' +
      '<nav class="nav" id="nav" aria-label="ניווט ראשי">' +
        navItems.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("") +
        '<a class="btn btn-wa btn-sm" href="' + wa("היי נוית 😊") + '" target="_blank" rel="noopener">' + ICON_WA + " וואטסאפ</a>" +
      "</nav></div></header>");

  put("footer",
    '<footer class="site-footer"><div class="wrap"><div class="foot-grid">' +
      '<div><a class="logo" href="index.html">' + LOGO + '<span class="logo-text">' + esc(C.name) + "<small style=\"color:var(--kraft)\">" + esc(C.brand) + "</small></span></a>" +
        '<p style="margin-top:1rem;opacity:.85;max-width:34ch">עבודות קולאז׳ בעבודת יד וסדנאות יצירה. ' + esc(C.area) + "." + (C.studioNote ? " " + esc(C.studioNote) : "") + "</p></div>" +
      "<div><h4>ניווט</h4><ul>" + navItems.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>יצירת קשר</h4><ul>" +
        '<li><a href="' + wa() + '" target="_blank" rel="noopener">וואטסאפ: ' + fmt(C.phoneDisplay) + "</a></li>" +
        '<li><a href="' + esc(IG_URL) + '" target="_blank" rel="noopener" dir="ltr">@' + esc(C.instagram) + "</a></li>" +
        '<li><a href="mailto:' + esc(C.email) + '" dir="ltr">' + esc(C.email) + "</a></li>" +
        (C.etsy ? '<li><a href="' + esc(C.etsy) + '" target="_blank" rel="noopener">הדפסים ב-Etsy</a></li>' : "") +
        "<li>" + fmt(C.address) + "</li></ul></div>" +
    '</div><div class="fineprint"><span>© ' + new Date().getFullYear() + " " + esc(C.name) + " · כל הזכויות שמורות</span><span>עוסק פטור · המחירים סופיים, ללא מע״מ</span></div></div></footer>" +
    '<a class="wa-float" href="' + wa("היי נוית, אשמח לפרטים 😊") + '" target="_blank" rel="noopener" aria-label="שליחת הודעה בוואטסאפ">' + ICON_WA + "</a>");

  var menuBtn = $(".menu-btn"), nav = $("#nav");
  if (menuBtn) menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", open);
  });

  /* ---------- טקסטים פשוטים: data-text="texts.heroSubtitle" ---------- */
  $all("[data-text]").forEach(function (el) {
    var v = el.getAttribute("data-text").split(".").reduce(function (o, k) { return o && o[k]; }, S);
    if (v != null) el.innerHTML = fmt(v);
  });
  $all("[data-wa]").forEach(function (el) { el.href = wa(el.getAttribute("data-wa")); el.target = "_blank"; el.rel = "noopener"; });
  $all("[data-ig]").forEach(function (el) { el.href = IG_URL; el.target = "_blank"; el.rel = "noopener"; });

  put("hero-title", S.texts.heroTitle.map(function (w) { return '<span class="cutout">' + esc(w) + "</span>"; }).join("<br>"));
  put("about-long", S.texts.aboutLong.map(function (p) { return "<p>" + fmt(p) + "</p>"; }).join(""));

  /* ---------- עבודות ---------- */
  function workCard(w) {
    return '<button class="work reveal" data-id="' + esc(w.id) + '" aria-label="' + esc(w.title) + ' – פרטים והזמנה">' +
      '<div class="work-img"><img src="' + esc(w.thumb || w.image) + '"' + (w.thumb ? ' srcset="' + esc(w.thumb) + ' 600w, ' + esc(w.image) + ' 1400w" sizes="(max-width:700px) 50vw, 380px"' : "") +
        ' alt="' + esc(w.alt || w.title) + '" loading="lazy" width="800" height="1000"></div>' +
      '<div class="work-meta"><h3 class="work-title">' + esc(w.title) + '</h3>' + (w.titleEn ? '<span class="work-en" dir="ltr" lang="en">' + esc(w.titleEn) + "</span>" : "") +
        '<span class="work-price">הדפס ' + printPrices(" · ") + "</span></div></button>";
  }
  put("works-featured", S.works.filter(function (w) { return w.featured; }).slice(0, 3).map(workCard).join(""));
  put("works-all", S.works.map(workCard).join(""));

  // מודאל עבודה
  var dlg = $("#work-modal");
  document.addEventListener("click", function (e) {
    var card = e.target.closest && e.target.closest(".work");
    if (!card || !dlg) return;
    var w = S.works.filter(function (x) { return x.id === card.getAttribute("data-id"); })[0];
    if (!w) return;
    $(".modal-content", dlg).innerHTML =
      '<div class="modal-grid"><img src="' + esc(w.image) + '" alt="' + esc(w.alt || w.title) + '"><div class="modal-body">' +
        '<h3 id="modal-title">' + esc(w.title) + "</h3>" + (w.titleEn ? '<p class="work-en" dir="ltr" lang="en">' + esc(w.titleEn) + "</p>" : "") +
        "<p>" + fmt(w.description) + "</p>" +
        '<dl><dt>הדפסים</dt><dd>' + P.options.map(function (o) { return '<span class="pp">' + esc(o.label) + " ב-" + esc(o.price) + "</span>"; }).join(" · ") + "</dd>" +
          (P.postcards ? "<dt>גלויות</dt><dd>" + esc(P.postcards) + "</dd>" : "") +
          "<dt>העבודה</dt><dd>" + fmt(w.materials) + "</dd>" +
          "<dt>משלוח</dt><dd>" + esc(P.shipping) + "</dd></dl>" +
        '<div class="ws-actions" style="margin-top:.6rem">' +
          (C.etsy ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(C.etsy) + '">' + esc(P.etsyCta) + "</a>" : "") +
          '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa("היי נוית, אשמח להזמין הדפס של \"" + w.title + "\" (" + (w.titleEn || "") + ") – גודל: A5 / A4 / גלויה 😊") + '">' + ICON_WA + " " + esc(P.waCta) + "</a>" +
        "</div>" +
      "</div></div>";
    dlg.showModal();
  });
  if (dlg) {
    $(".modal-close", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- סדנאות ---------- */
  put("workshops", S.workshops.map(function (w) {
    return '<article class="ws-card reveal c-' + esc(w.color) + '" id="ws-' + esc(w.id) + '">' +
      '<span class="icon" aria-hidden="true">' + w.icon + "</span>" +
      '<div class="ws-img"><img src="' + esc(w.image) + '" alt="' + esc(w.imageAlt) + '" loading="lazy"></div>' +
      '<div class="ws-body"><h3>' + esc(w.title) + '</h3><div class="aud">' + esc(w.audience) + "</div>" +
      "<p>" + fmt(w.description) + "</p>" +
      '<div class="meta">משך: ' + fmt(w.duration) + " · מגיל 9 · עד 10 משתתפים</div>" +
      '<div class="price">' + (w.package ?
        '<span class="pkg">חבילה ל-' + esc(w.package.kids) + ' ילדים</span><b>' + fmt(w.package.packagePrice) + '</b><small>+ ' + fmt(w.package.extraChildPrice) + ' ₪ לכל ילד נוסף (עד ' + esc(w.package.maxKids) + ')</small>' :
        "<b>" + esc(w.price) + "</b><small>" + esc(w.priceUnit) + "</small>") +
        (w.priceNote ? '<span class="early">' + esc(w.priceNote) + "</span>" : "") + '<span class="final">מחיר סופי · כל החומרים כלולים</span></div>' +
      '<div class="ws-actions"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="' + wa(w.whatsappText) + '">' + ICON_WA + " " + esc(w.cta) + "</a>" +
        (w.link && page !== "workshops" ? '<a class="btn btn-light btn-sm" href="' + esc(w.link) + '">תאריכים</a>' : "") + "</div>" +
      "</div></article>";
  }).join(""));

  function extra(x) {
    return '<div class="extra reveal"><h3>' + esc(x.title) + "</h3><p>" + fmt(x.text) + '</p><div class="row"><b>' + esc(x.price) + '</b>' +
      '<a class="btn btn-sm" target="_blank" rel="noopener" href="' + wa(x.whatsappText) + '">' + ICON_WA + " לפרטים</a></div></div>";
  }
  put("events", extra(S.events));
  put("orgs", "<p>" + fmt(S.organizations.text) + '</p><div class="row"><b>' + esc(S.organizations.price) + '</b><a class="btn btn-sm" target="_blank" rel="noopener" href="' + wa(S.organizations.whatsappText) + '">' + ICON_WA + " לבקשת הצעת מחיר</a></div>");

  put("dates", S.openDates.length ? S.openDates.map(function (d) {
    var full = d.status === "full";
    return '<article class="date-card reveal"><div class="date-badge"><span>' + esc(d.label || "סדנה") + '</span><b>' + esc(d.badge) + "</b>" + (d.badgeNote ? "<span>" + esc(d.badgeNote) + "</span>" : "") + "</div>" +
      "<div><h3>" + esc(d.title || "") + "</h3><p class=\"date-line\">" + esc(d.date) + (d.note ? ' <span class="note-tag">' + fmt(d.note) + "</span>" : "") + "</p><p style=\"margin:.2rem 0 .5rem\">" + fmt(d.theme) + "</p><ul>" +
        "<li>🕖 " + fmt(d.time) + "</li><li>📍 " + fmt(d.place) + "</li><li>💛 " + fmt(d.price) + "</li>" + (d.earlyPrice ? "<li>🐦 הרשמה מוקדמת: " + esc(d.earlyPrice) + "</li>" : "") + "<li>👭 " + esc(d.spots) + "</li></ul></div>" +
      (full ? '<span class="full">מלא – אפשר להצטרף לרשימת המתנה</span>' : "") +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa("היי נוית, אשמח להירשם ל" + (d.title || "סדנה") + " (" + d.date + ")" + (full ? " – לרשימת המתנה" : "") + " 🌿") + '">' + ICON_WA + (full ? " לרשימת המתנה" : " לשריון מקום") + "</a></article>";
  }).join("") : '<div class="no-dates reveal"><p class="lead">' + esc(S.noDatesText || "מועדים קרובים יפורסמו בקרוב – השאירו פרטים בוואטסאפ") + '</p>' +
    '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa(S.noDatesWhatsappText || "היי נוית, אשמח לשמוע על הסדנה הקרובה 🌿") + '">' + ICON_WA + " להשארת פרטים בוואטסאפ</a></div>");

  /* ---------- שובר מתנה ---------- */
  var V = S.voucher, today = new Date().toISOString().slice(0, 10);
  var showV = V && (V.show === "on" || (V.show === "auto" && today >= V.showFrom && (!V.showUntil || today <= V.showUntil)));
  $all('[data-render="voucher"]').forEach(function (el) {
    if (!showV) { el.remove(); return; }
    el.innerHTML = '<div class="wrap"><div class="voucher reveal">' +
      '<div class="v-ticket" aria-hidden="true"><span>שובר מתנה</span><b>סדנת קולאז׳</b><i>לחנוכה ✂</i></div>' +
      '<div class="v-body"><span class="kicker">' + esc(V.kicker) + "</span><h2>" + esc(V.title) + "</h2><p>" + fmt(V.text) + "</p>" + (V.details ? '<p class="v-details">' + fmt(V.details) + "</p>" : "") +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + wa(V.whatsappText) + '">' + ICON_WA + " " + esc(V.cta) + "</a></div></div></div>";
  });

  put("included", S.included.map(function (i) { return "<li>" + fmt(i) + "</li>"; }).join(""));
  put("steps", S.steps.map(function (s) { return "<li><div><b>" + esc(s.title) + "</b>" + fmt(s.text) + "</div></li>"; }).join(""));
  put("faq", S.faq.map(function (f) { return "<details><summary>" + esc(f.q) + "</summary><p>" + fmt(f.a) + "</p></details>"; }).join(""));
  // המלצות: כל עוד אין המלצות אמיתיות – האזור מוסתר
  var realQuotes = S.testimonials.filter(function (t) { return !t.placeholder; });
  if (!realQuotes.length) $all("[data-testimonials-block]").forEach(function (el) {
    var parent = el.parentNode; el.remove();
    if (parent && parent.classList.contains("two-col") && parent.children.length === 1) { parent.style.gridTemplateColumns = "1fr"; parent.style.maxWidth = "820px"; }
  });
  put("testimonials", realQuotes.map(function (t) {
    return '<figure class="quote reveal" style="margin:0"><p>' + fmt(t.text) + "</p><cite>– " + fmt(t.name) + "</cite></figure>";
  }).join(""));
  put("gallery", S.gallery.map(function (g) {
    return '<figure class="reveal"><img src="' + esc(g.image) + '" alt="' + esc(g.alt) + '" loading="lazy"><figcaption>' + esc(g.alt) + "</figcaption></figure>";
  }).join(""));
  put("ig-strip", S.gallery.concat(S.works.slice(0, 2).map(function (w) { return { image: w.thumb || w.image, alt: w.title }; })).slice(0, 5).map(function (g) {
    return '<div><img src="' + esc(g.image) + '" alt="" loading="lazy"></div>';
  }).join(""));
  put("ig-handle", "@" + esc(C.instagram));
  put("contact-list",
    '<li><span class="ic">💬</span><a class="link" target="_blank" rel="noopener" href="' + wa() + '">וואטסאפ</a>&nbsp;' + fmt(C.phoneDisplay) + "</li>" +
    '<li><span class="ic" style="background:var(--pink)">' + ICON_IG + '</span><a class="link" dir="ltr" target="_blank" rel="noopener" href="' + esc(IG_URL) + '">@' + esc(C.instagram) + "</a></li>" +
    '<li><span class="ic" style="background:var(--sage)">✉️</span><a class="link" dir="ltr" href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></li>" +
    (C.etsy ? '<li><span class="ic" style="background:var(--peach)">🛍️</span><a class="link" target="_blank" rel="noopener" href="' + esc(C.etsy) + '">החנות שלי ב-Etsy (הדפסים)</a></li>' : "") +
    '<li><span class="ic" style="background:var(--mustard)">📍</span>' + fmt(C.address) + " · " + esc(C.area) + "</li>");

  /* ---------- טופס: Formspree אם הוגדר, אחרת וואטסאפ ---------- */
  var form = $("#contact-form");
  if (form) {
    var params = new URLSearchParams(location.search);
    if (params.get("type")) { var sel = $("#f-type"); if (sel) sel.value = params.get("type"); }
    if (C.formAction) { form.action = C.formAction; form.method = "POST"; }
    form.addEventListener("submit", function (e) {
      if (C.formAction) return; // שליחה רגילה ל-Formspree / Netlify
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form), lines = ["היי נוית, פנייה מהאתר:"];
      [["name", "שם"], ["phone", "טלפון"], ["type", "נושא"], ["date", "תאריך משוער"], ["people", "מספר משתתפים"], ["message", "הודעה"]].forEach(function (f) {
        var v = (d.get(f[0]) || "").toString().trim(); if (v) lines.push(f[1] + ": " + v);
      });
      window.open(wa(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- אנימציית הופעה עדינה ---------- */
  var els = $all(".reveal");
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
