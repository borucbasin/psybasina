/* ============================================================
   Ирина Басина — интерактив: меню, скролл, reveal, lightbox
   ============================================================ */
(function () {
  "use strict";

  /* --- Текущий год в футере --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Тень у шапки при скролле --- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Мобильное меню --- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  var overlay = document.getElementById("menu-overlay");

  function openMenu() {
    menu.classList.add("open");
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add("show"); });
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("show");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(function () { overlay.hidden = true; }, 350);
  }
  function toggleMenu() {
    if (menu.classList.contains("open")) closeMenu();
    else openMenu();
  }
  if (burger) burger.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* --- Reveal-анимации при скролле --- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* --- Lightbox для документов --- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var lbClose = document.getElementById("lightbox-close");
  var lastFocused = null;

  function openLightbox(src, caption, alt) {
    lastFocused = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || caption || "Документ";
    lbCaption.textContent = caption || "";
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add("show"); });
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(function () {
      lightbox.hidden = true;
      lbImg.src = "";
    }, 250);
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("button.edu-card[data-full]").forEach(function (card) {
    card.addEventListener("click", function () {
      var img = card.querySelector("img");
      openLightbox(
        card.getAttribute("data-full"),
        card.getAttribute("data-caption"),
        img ? img.alt : ""
      );
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLightbox();
      if (menu.classList.contains("open")) closeMenu();
    }
  });
})();
