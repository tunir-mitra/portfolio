// Mobile menu toggle
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");
const dropdown = document.querySelector(".dropdown");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

// Projects: the word is a link to the projects section; the ▾ toggles the list
// (hover/focus opens it on desktop; the ▾ is how touch users open it)
const chev = dropdown.querySelector(".dropdown__chev");
chev.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = dropdown.classList.toggle("open");
  chev.setAttribute("aria-expanded", open);
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) { dropdown.classList.remove("open"); chev.setAttribute("aria-expanded", "false"); }
});

// Close menus after choosing a link
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    dropdown.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ============ Scroll animations ============
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// [selector, animation variant, stagger step in seconds]
// Stagger counts position among siblings, so each list/grid/row starts fresh.
const revealGroups = [
  // Home
  [".about .heading-sans", "up", 0],
  [".about__body p", "up", 0.15],
  [".journey__item", "left", 0.1],
  [".journey__media", "right", 0],
  [".clients__title", "zoom", 0],
  [".clients__viewport", "up", 0],
  [".projects__title", "up", 0],
  [".projects__row--two .project", "up", 0.15],
  [".projects__row--three .project", "zoom", 0.15],
  // About
  [".ab-hero__title", "words", 0],
  [".ab-hero__sub", "up", 0],
  [".ab-intro__photo", "wipe", 0],
  [".ab-intro__title", "words", 0],
  [".ab-intro__body p", "up", 0.12],
  [".ab-list-title", "left", 0],
  [".ab-list li", "left", 0.06],
  [".how__title", "words", 0],
  [".how-card", "flip", 0.12],
  [".ab-focus__title", "left", 0],
  [".ab-focus__body p", "right", 0.18],
  [".bento__tile--text", "zoom", 0.1],
  [".bento__tile--img", "wipe", 0.12],
  // Case study
  [".cs-hero__content > *", "up", 0.12],
  [".cs-meta__item", "up", 0.08],
  [".cs-phase-label", "up", 0],
  [".cs-phase-title", "words", 0],
  [".cs-lead", "up", 0],
  [".cs-goals__col", "up", 0.12],
  [".cs-demo", "zoom", 0],
  [".cs-two > *", "up", 0.15],
  [".cs-comp", "flip", 0.1],
  [".cs-seg", "up", 0.08],
  [".cs-feature", "up", 0.08],
  [".cs-kano__card", "zoom", 0.1],
  [".cs-pipe", "left", 0.15],
  [".cs-wf", "flip", 0.12],
  [".cs-kpi", "up", 0.15],
  [".cs-tools__col", "up", 0.1],
  // Monster BI
  [".mb-label", "left", 0],
  [".mb-title", "up", 0],
  [".mb-intro", "up", 0],
  [".mb-mission", "left", 0],
  [".mb-figure", "wipe", 0],
  [".mb-pillar, .mb-op, .mb-opp, .mb-rec, .mb-mine, .mb-trend, .mb-app", "up", 0.1],
  [".mb-band__stat", "up", 0.1],
  [".mb-band__quote", "up", 0],
  [".mb-challenge", "left", 0.08],
  [".mb-quote", "zoom", 0],
  [".mb-ticks li", "left", 0.05],
  [".mb-realtime", "up", 0],
  [".mb-block", "up", 0.15],
  [".mb-sentiment", "zoom", 0],
  [".mb-final", "right", 0.12],
  [".mb-credits > *", "up", 0.12],
  [".cs-next", "up", 0],
  // HuskyMarket
  [".hk-stat", "up", 0.08],
  [".hk-problem", "up", 0.12],
  [".hk-cal", "up", 0.12],
  [".hk-persona", "flip", 0.12],
  [".hk-hmw", "zoom", 0],
  [".hk-layer", "left", 0.1],
  [".hk-moscow__col", "up", 0.08],
  [".hk-bench__card", "up", 0.12],
  [".hk-metric", "up", 0.08],
  [".hk-risk", "up", 0.08],
  // Mercedes
  [".mz-versus", "up", 0],
  [".mz-heritage__img", "wipe", 0],
  [".mz-firsts li", "up", 0.1],
  [".mz-pull", "left", 0],
  [".mz-cause", "left", 0.1],
  [".mz-swot__card", "up", 0.08],
  [".mz-rival", "flip", 0.1],
  [".mz-persona", "zoom", 0],
  [".mz-vision", "up", 0],
  [".mz-who__col", "up", 0.1],
  [".mz-feature", "up", 0.12],
  [".mz-budget", "up", 0],
  [".mz-roi__card", "up", 0.1],
  [".mz-okr", "left", 0.1],
  [".mz-kpi", "up", 0.1],
  [".mz-roadmap li", "left", 0.12],
  [".mz-risk", "up", 0.06],
  [".mz-note", "zoom", 0.08],
  // Uncut Diamonds
  [".ud-prose", "up", 0],
  [".ud-journey li", "up", 0.1],
  [".ud-member", "up", 0.12],
  [".ud-pillar", "up", 0.15],
  [".ud-metric", "up", 0.12],
  [".ud-channel", "up", 0.1],
  [".ud-quote", "zoom", 0],
  [".ud-whole-game", "left", 0],
  [".ud-people li", "zoom", 0.08],
  [".ud-award", "up", 0],
  [".ud-closing", "up", 0],
  // Shared
  [".footer__col", "up", 0.12],
];

// Wrap each word so it can rise out of its own mask
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.innerHTML = words
    .map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`)
    .join(" ");
}

revealGroups.forEach(([selector, variant, step]) => {
  document.querySelectorAll(selector).forEach((el) => {
    const i = Array.from(el.parentElement.children).indexOf(el);
    if (variant === "words") splitWords(el);
    el.classList.add("reveal", `reveal--${variant}`);
    el.style.setProperty("--delay", `${i * step}s`);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        observer.unobserve(el);
        // Hold anything already on screen until the page curtain has mostly lifted
        const wait = reduceMotion ? 0 : Math.max(0, 450 - performance.now());
        setTimeout(() => el.classList.add("in"), wait);
        // Drop the stagger delay once revealed so hover effects respond instantly
        const delay = parseFloat(el.style.getPropertyValue("--delay")) || 0;
        setTimeout(() => el.style.setProperty("--delay", "0s"), wait + (delay + 1.4) * 1000);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px -24px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ============ Page transitions ============
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const url = new URL(a.href, location.href);
  if (!/^(https?|file):$/.test(url.protocol)) return;          // mailto:, tel:
  if (url.protocol !== "file:" && url.origin !== location.origin) return;
  if (url.pathname === location.pathname) return;               // same-page anchor
  e.preventDefault();
  if (reduceMotion) { location.href = url.href; return; }
  document.body.classList.add("leaving");
  setTimeout(() => (location.href = url.href), 420);
});
// Coming back via the browser's back button restores the old page from cache
window.addEventListener("pageshow", (e) => {
  if (e.persisted) document.body.classList.remove("leaving");
});

// Progress bar, shrinking nav, and parallax — batched into one frame per scroll
const progress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".nav");
const parallaxEls = [
  [document.querySelector(".hero__text"), 0.08],
];
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  nav.classList.toggle("scrolled", y > 40);

  if (!reduceMotion && y < window.innerHeight) {
    parallaxEls.forEach(([el, speed]) => {
      if (el) el.style.translate = `0 ${y * speed}px`;
    });
  }
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });
onScroll();

// ============ Clients carousel: slow, endless, pauses when touched ============
(function clientsCarousel() {
  const viewport = document.querySelector(".clients__viewport");
  if (!viewport) return;
  const track = viewport.querySelector(".clients__track");
  const toggle = document.querySelector(".clients__toggle");
  if (reduceMotion) return; // CSS turns it into a swipeable row

  // Clone the cards once so the loop has no visible seam
  [...track.children].forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    clone.classList.remove("reveal", "in");
    track.appendChild(clone);
  });

  const SPEED = 28;          // pixels per second: slow and steady
  const RESUME_AFTER = 2500; // ms to wait after a drag before moving again
  let offset = 0, loopWidth = 0, last = 0;
  let hovering = false, focused = false, dragging = false, userPaused = false, visible = true;
  let resumeAt = 0;

  const measure = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    loopWidth = track.scrollWidth / 2 + gap / 2;
  };
  const wrap = () => {
    if (!loopWidth) return;
    offset = ((offset % loopWidth) + loopWidth) % loopWidth;
  };
  const paint = () => { track.style.transform = `translate3d(${-offset}px,0,0)`; };
  const moving = () => visible && !userPaused && !hovering && !focused && !dragging && performance.now() > resumeAt;

  function frame(now) {
    const dt = Math.min(now - last, 50) / 1000; // clamp so a background tab doesn't jump
    last = now;
    if (moving()) { offset += SPEED * dt; wrap(); paint(); }
    requestAnimationFrame(frame);
  }

  // Pause on hover (mouse) and keyboard focus
  viewport.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
  viewport.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hovering = false; });
  viewport.addEventListener("focusin", () => (focused = true));
  viewport.addEventListener("focusout", () => (focused = false));

  // Drag / swipe to scrub through the clients
  let startX = 0, startOffset = 0, moved = false;
  viewport.addEventListener("pointerdown", (e) => {
    dragging = true; moved = false;
    startX = e.clientX; startOffset = offset;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4 && !moved) { moved = true; viewport.classList.add("is-dragging"); }
    if (moved) { offset = startOffset - dx; wrap(); paint(); }
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    resumeAt = performance.now() + RESUME_AFTER;
  };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  // Explicit pause/play control
  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    toggle.classList.toggle("is-paused", userPaused);
    toggle.setAttribute("aria-label", userPaused ? "Play carousel" : "Pause carousel");
  });

  // Only animate while on screen
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(viewport);
  new ResizeObserver(() => { measure(); wrap(); paint(); }).observe(track);
  measure();
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(frame); });
})();

// ============ Behind the Resume: auto-advancing cards, photo + tone follow ============
(function journey() {
  const root = document.querySelector(".journey");
  if (!root) return;
  const items = [...root.querySelectorAll(".journey__item")];
  const imgs = [...root.querySelectorAll(".journey__img")];
  let current = items.findIndex((it) => it.classList.contains("is-open"));
  let timer = null, hovering = false, focused = false, visible = false;

  function open(i) {
    current = i;
    items.forEach((it, k) => {
      it.classList.toggle("is-open", k === i);
      it.querySelector(".journey__head").setAttribute("aria-expanded", k === i);
    });
    imgs.forEach((im, k) => im.classList.toggle("is-on", k === i));
    const tone = items[i].dataset.tone;
    if (tone) document.documentElement.style.setProperty("--about-bg", tone);
    schedule();
  }

  // Each card stays open for its own duration (Adobe a little longer)
  function schedule() {
    clearTimeout(timer);
    const it = items[current];
    const paused = reduceMotion || hovering || focused || !visible;
    root.classList.toggle("is-paused", paused);
    // restart the progress bar on the open card
    it.style.setProperty("--dur", (it.dataset.duration || 6000) + "ms");
    it.classList.remove("is-timing"); void it.offsetWidth; it.classList.add("is-timing");
    if (paused) return;
    timer = setTimeout(() => open((current + 1) % items.length), Number(it.dataset.duration) || 6000);
  }

  root.addEventListener("click", (e) => {
    const head = e.target.closest(".journey__head");
    if (head) open(Number(head.dataset.i));
  });
  // Pause while the reader is looking at or using it
  root.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; schedule(); } });
  root.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovering = false; schedule(); } });
  root.addEventListener("focusin", () => { focused = true; schedule(); });
  root.addEventListener("focusout", () => { focused = false; schedule(); });
  // Only run while the section is on screen
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); }, { threshold: 0.3 }).observe(root);

  open(current < 0 ? 0 : current);
})();

// ============ Hero video: always playing, never interactive ============
(function heroVideo() {
  const v = document.querySelector(".hero__video");
  if (!v) return;
  v.muted = true; // required for autoplay in every browser
  const play = () => v.play().catch(() => {});
  // Resume if the browser pauses it (tab switch, power saving, stall)
  v.addEventListener("pause", () => { if (!document.hidden) play(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) play(); });
  v.addEventListener("contextmenu", (e) => e.preventDefault());
  play();
})();

// Keep the copyright year current
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
