// ============ Confidence Layer demo (home office) ============
const DEMO_REPLIES = {
  "Macbook Focus": {
    label: "MacBook Setup",
    intro: "Perfect. MacBook setups benefit from Type-C hubs and compatible keyboards. Here is your custom $580 configuration:",
    items: ['💻 LG 27UL500-W 27" UHD Monitor ($299)', "⌨️ Keychron K2 MacOS Wireless ($79)", "🔌 Anker 7-in-1 USB-C Hub ($34)"],
    why: "Recommended because Keychron supports native Mac layouts out-of-the-box, and LG delivers 4K Resolution on M-Series MacBooks without scaling artifacts.",
  },
  "Windows Focus": {
    label: "Windows Setup",
    intro: "Got it. Optimizing for multi-tasking and high compatibility. Here is your Windows custom configuration:",
    items: ['🖥️ Dell S2721HN 27" IPS Monitor ($149)', "⌨️ Logitech MX Keys + Master Mouse ($199)", "🎧 Jabra Evolve2 40 Headset ($99)"],
    why: "Recommended because Logitech MX Flow lets you control multiple Windows devices seamlessly, and the IPS display panel prevents neck strain.",
  },
  "Ergonomic Priority": {
    label: "Ergonomics & Comfort",
    intro: "Wise choice. Preventing back and neck pain is the best home-office investment. Here is your health-focused layout:",
    items: ["🪑 SIHOO M18 Ergonomic Mesh Chair ($159)", "🦶 Mind Reader Ergonomic Footrest ($19)", "⌨️ Microsoft Ergonomic Keyboard Split ($59)"],
    why: "Surfaced because split keyboard layouts reduce carpal tunnel risk by 40%, and the SIHOO chair has verified lumbar support for 8+ hour work sessions.",
  },
};

const demoChat = document.getElementById("interactiveMainChat");
if (demoChat) {
  demoChat.addEventListener("click", (e) => {
    const chip = e.target.closest(".cs-chip[data-focus]");
    if (!chip) return;
    const r = DEMO_REPLIES[chip.dataset.focus];

    demoChat.querySelectorAll(".cs-chip[data-focus]").forEach((c) => c.classList.toggle("is-picked", c === chip));
    const old = document.getElementById("bannerSimulatedResponse");
    if (old) old.remove();

    const reply = document.createElement("div");
    reply.id = "bannerSimulatedResponse";
    reply.className = "cs-demo__reply";
    reply.innerHTML = `
      <div class="cs-msg cs-msg--user"><div class="cs-bubble cs-bubble--user">${r.label}</div></div>
      <div class="cs-msg">
        <div class="cs-bubble cs-bubble--ai">${r.intro}</div>
        <div class="cs-chips">${r.items.map((i) => `<span class="cs-chip cs-chip--item">${i}</span>`).join("")}</div>
        <div class="cs-reasoning"><strong>Transparent Reasoning:</strong> ${r.why}</div>
      </div>`;
    demoChat.appendChild(reply);
  });
}
