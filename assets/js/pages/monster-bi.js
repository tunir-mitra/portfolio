// ============ Monster BI case study ============
const mbReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Hero particles (only animate while the hero is on screen) ----------
(function particles() {
  const canvas = document.querySelector(".mb-particles");
  if (!canvas || mbReduce) return;
  const ctx = canvas.getContext("2d");
  let dots = [];
  let running = false;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * devicePixelRatio;
    canvas.height = r.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  function spawn(w, h, anywhere) {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h - 1,
      size: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.6 + 0.15,
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
    };
  }
  function frame() {
    if (!running) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    dots.forEach((d, i) => {
      d.x += d.vx; d.y += d.vy; d.life -= d.decay;
      if (d.life <= 0 || d.y < -10) dots[i] = spawn(w, h, false);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(170,255,0,${d.alpha * d.life})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }

  resize();
  dots = Array.from({ length: 90 }, () => spawn(canvas.clientWidth, canvas.clientHeight, true));
  // The hero grows as web fonts load, so track its real size, not just window resizes
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) requestAnimationFrame(frame);
  }).observe(canvas);
})();

// ---------- Dashboard video ----------
const video = document.querySelector(".mb-video");
const playBtn = document.querySelector(".mb-play");
const seek = document.querySelector(".mb-seek");
const timeEl = document.querySelector(".mb-time");
let userPaused = mbReduce;

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function syncPlayButton() {
  const paused = video.paused;
  playBtn.classList.toggle("is-paused", paused);
  playBtn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
}

if (video) {
  playBtn.addEventListener("click", () => {
    if (video.paused) { userPaused = false; video.play(); }
    else { userPaused = true; video.pause(); }
  });
  video.addEventListener("play", syncPlayButton);
  video.addEventListener("pause", syncPlayButton);
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    seek.value = Math.round((video.currentTime / video.duration) * 1000);
    timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  });
  seek.addEventListener("input", () => {
    if (video.duration) video.currentTime = (seek.value / 1000) * video.duration;
  });

  // Autoplay only while the panel is visible (saves battery on phones)
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !userPaused) video.play().catch(() => {});
    else if (!e.isIntersecting) video.pause();
  }, { threshold: 0.25 }).observe(video);
  syncPlayButton();
}

// ---------- Spotlight a visual inside the video ----------
const spot = document.querySelector(".mb-spot");
const visualButtons = document.querySelectorAll(".mb-visuals__list button");

function showSpot(btn) {
  const [x1, y1, x2, y2] = btn.dataset.box.split(",").map(Number);
  Object.assign(spot.style, { left: x1 + "%", top: y1 + "%", width: x2 - x1 + "%", height: y2 - y1 + "%" });
  spot.classList.add("is-on");
  visualButtons.forEach((b) => b.classList.toggle("is-on", b === btn));
}
function hideSpot() {
  spot.classList.remove("is-on");
  visualButtons.forEach((b) => b.classList.remove("is-on"));
}
visualButtons.forEach((btn) => {
  btn.addEventListener("mouseenter", () => showSpot(btn));
  btn.addEventListener("focus", () => showSpot(btn));
  btn.addEventListener("mouseleave", hideSpot);
  btn.addEventListener("blur", hideSpot);
  // Tap on touch screens toggles the spotlight
  btn.addEventListener("click", () => (btn.classList.contains("is-on") ? hideSpot() : showSpot(btn)));
});

// ---------- Full-size view ----------
const lightbox = document.querySelector(".mb-lightbox");
const bigVideo = lightbox.querySelector("video");
document.querySelector(".mb-expand").addEventListener("click", () => {
  bigVideo.currentTime = video.currentTime || 0;
  video.pause();
  lightbox.showModal();
  bigVideo.play().catch(() => {});
});
lightbox.querySelector(".mb-lightbox__close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
lightbox.addEventListener("close", () => {
  bigVideo.pause();
  video.currentTime = bigVideo.currentTime;
  if (!userPaused) video.play().catch(() => {});
});

// ---------- "Now reading" tracker in the side panel ----------
const readNum = document.querySelector(".mb-reading__num");
const readName = document.querySelector(".mb-reading__name");
const readFill = document.querySelector(".mb-reading__fill");
const body = document.querySelector(".mb-body");
const pages = [...document.querySelectorAll(".cs-phases a")].map((a, i) => ({
  el: document.querySelector(a.getAttribute("href")),
  name: a.textContent,
  num: String(i + 1).padStart(2, "0"),
}));

const readObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const page = pages.find((p) => p.el === e.target);
    readNum.textContent = page.num;
    readName.textContent = page.name;
  });
}, { rootMargin: "-35% 0px -60% 0px" });
pages.forEach((p) => p.el && readObserver.observe(p.el));

let readTick = false;
window.addEventListener("scroll", () => {
  if (readTick) return;
  readTick = true;
  requestAnimationFrame(() => {
    const r = body.getBoundingClientRect();
    const done = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    readFill.style.transform = `scaleX(${done})`;
    readTick = false;
  });
}, { passive: true });
