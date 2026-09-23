// ============ Shared behaviour for every case study page ============

// ============ Phase nav: highlight the section in view ============
const phaseLinks = document.querySelectorAll(".cs-phases a");
const phaseSections = [...phaseLinks].map((a) => document.querySelector(a.getAttribute("href")));
const phaseObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = phaseSections.indexOf(entry.target);
      phaseLinks.forEach((a, j) => a.classList.toggle("is-active", i === j));
      // Keep the active pill visible when the bar scrolls sideways on phones
      const link = phaseLinks[i];
      const bar = link.parentElement;
      bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);
phaseSections.forEach((s) => s && phaseObserver.observe(s));

// ============ KPI numbers count up when they come into view ============
const kpiReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const kpiObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      kpiObserver.unobserve(entry.target);
      const el = entry.target;
      const m = el.textContent.match(/^([^\d]*)([\d.]+)(.*)$/);
      if (!m) return;
      const [, prefix, num, suffix] = m;
      const target = parseFloat(num);
      const decimals = (num.split(".")[1] || "").length;
      const start = performance.now();
      const duration = 1400;
      (function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    });
  },
  { threshold: 0.6 }
);
if (!kpiReduce) document.querySelectorAll(".cs-kpi__num, .mb-count").forEach((el) => kpiObserver.observe(el));

// ============ Drag to resize the right panel ============
(function resizablePanel() {
  const layout = document.querySelector(".cs-layout");
  const handle = document.querySelector(".cs-resizer");
  if (!layout || !handle) return;

  const key = "aside-w:" + location.pathname.split("/").pop();
  const MIN_ASIDE = 360;   // keep the panel usable
  const MIN_BODY = 420;    // keep the case study readable

  function clamp(w) {
    const max = layout.clientWidth - MIN_BODY;
    return Math.round(Math.min(Math.max(w, MIN_ASIDE), Math.max(MIN_ASIDE, max)));
  }
  function currentWidth() {
    return document.querySelector(".cs-aside").getBoundingClientRect().width;
  }
  function setWidth(w, save) {
    w = clamp(w);
    layout.style.setProperty("--aside-w", w + "px");
    handle.setAttribute("aria-valuenow", w);
    if (save) { try { localStorage.setItem(key, w); } catch (e) {} }
  }
  function reset() {
    layout.style.removeProperty("--aside-w");
    try { localStorage.removeItem(key); } catch (e) {}
  }

  // Restore the reader's last choice on this page
  try {
    const saved = Number(localStorage.getItem(key));
    if (saved) setWidth(saved, false);
  } catch (e) {}
  handle.setAttribute("aria-valuemin", MIN_ASIDE);

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    document.documentElement.classList.add("is-resizing");
    const right = layout.getBoundingClientRect().right;
    const move = (ev) => setWidth(right - ev.clientX, false);
    const up = () => {
      document.documentElement.classList.remove("is-resizing");
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      setWidth(currentWidth(), true);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  });

  handle.addEventListener("dblclick", reset);

  // Keyboard: arrows move 32px, Home/End jump to the limits
  handle.addEventListener("keydown", (e) => {
    const w = currentWidth();
    const steps = { ArrowLeft: w + 32, ArrowRight: w - 32, Home: Infinity, End: 0 };
    if (!(e.key in steps)) return;
    e.preventDefault();
    setWidth(steps[e.key], true);
  });

  // Keep a saved width valid when the window shrinks
  window.addEventListener("resize", () => {
    if (layout.style.getPropertyValue("--aside-w")) setWidth(currentWidth(), false);
  });
})();
