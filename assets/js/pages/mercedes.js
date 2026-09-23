// ============ Mercedes-Benz case study ============

// ---------- North-star persona toggle ----------
const PERSONAS = {
  west: {
    tag: "$1.5–5B incremental annual opportunity",
    title: "Young High-Income Western Buyer",
    desc: "25–40, built their wealth rather than inherited it. Digital-native and unconvinced that Mercedes speaks to them the way BMW or Tesla does.",
    stats: [["28%", "Would consider Mercedes"], ["54", "Average current buyer age"]],
  },
  china: {
    tag: "$4.5–8B recoverable annual opportunity",
    title: "Chinese Digital-Native Luxury Buyer",
    desc: "28–40, entrepreneurial, deeply embedded in WeChat/Douyin/Alipay. The segment BYD and NIO are currently winning by default.",
    stats: [["-27%", "Mercedes China sales, Q1 2026"], ["#2", "NIO's rank in China executive luxury"]],
  },
};
const personaBody = document.querySelector(".mz-persona__body");
function showPersona(key) {
  const p = PERSONAS[key];
  document.querySelectorAll(".mz-persona__toggle button").forEach((b) => {
    const on = b.dataset.p === key;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-selected", on);
  });
  personaBody.style.animation = "none";
  void personaBody.offsetWidth; // restart the fade-in
  personaBody.style.animation = "";
  personaBody.innerHTML = `
    <span class="mz-persona__tag">${p.tag}</span>
    <h4>${p.title}</h4>
    <p>${p.desc}</p>
    <div class="mz-persona__stats">${p.stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("")}</div>`;
}
document.querySelector(".mz-persona__toggle").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-p]");
  if (b) showPersona(b.dataset.p);
});
showPersona("west");
