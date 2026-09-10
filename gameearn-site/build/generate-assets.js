// build/generate-assets.js
// Produces SVG cover, icon and screenshot files for every game. Kept as real files (not inline
// data URIs) so alt text / lazy-loading behave the way they would with photographic assets later.
const fs = require("fs");
const path = require("path");
const { games } = require("../data/games");

const OUT_DIR = path.join(__dirname, "..", "public", "assets", "games");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PALETTE = {
  "earning-games": ["#F0B429", "#FFD873"],
  "reward-apps": ["#F2994A", "#F7B267"],
  action: ["#FF4D6D", "#FF8FA3"],
  racing: ["#22D3EE", "#67E8F9"],
  sports: ["#34D399", "#6EE7B7"],
  strategy: ["#6366F1", "#A5B4FC"],
  puzzle: ["#A855F7", "#D8B4FE"],
  multiplayer: ["#3B82F6", "#93C5FD"],
  casual: ["#F472B6", "#FBCFE8"],
  adventure: ["#14B8A6", "#5EEAD4"],
};

function motif(category, seed) {
  // simple geometric motif per category, deterministic per game via seed
  const s = seed % 5;
  switch (category) {
    case "racing":
      return `<g opacity="0.35" stroke="#0A0B10" stroke-width="10">
        <line x1="-20" y1="${60 + s * 20}" x2="640" y2="${10 + s * 20}" />
        <line x1="-20" y1="${110 + s * 20}" x2="640" y2="${60 + s * 20}" />
      </g>`;
    case "puzzle":
      return `<g opacity="0.3">${Array.from({ length: 6 })
        .map((_, i) => `<rect x="${40 + i * 60}" y="${40 + (i % 2) * 60}" width="40" height="40" rx="8" fill="#0A0B10"/>`)
        .join("")}</g>`;
    case "strategy":
      return `<polygon points="320,30 420,90 420,190 320,250 220,190 220,90" fill="none" stroke="#0A0B10" stroke-width="8" opacity="0.35"/>`;
    case "action":
      return `<path d="M0,220 L160,60 L220,120 L60,280 Z" fill="#0A0B10" opacity="0.3"/>`;
    case "adventure":
      return `<circle cx="500" cy="70" r="90" fill="none" stroke="#0A0B10" stroke-width="8" opacity="0.3"/>`;
    case "sports":
      return `<circle cx="480" cy="200" r="60" fill="none" stroke="#0A0B10" stroke-width="8" opacity="0.35"/>`;
    case "multiplayer":
      return `<g opacity="0.3">
        <circle cx="230" cy="90" r="34" fill="#0A0B10"/>
        <circle cx="300" cy="130" r="34" fill="#0A0B10"/>
        <circle cx="370" cy="90" r="34" fill="#0A0B10"/>
      </g>`;
    case "casual":
      return `<g opacity="0.3">${Array.from({ length: 4 })
        .map((_, i) => `<circle cx="${100 + i * 130}" cy="${80 + (i % 2) * 90}" r="26" fill="#0A0B10"/>`)
        .join("")}</g>`;
    case "reward-apps":
      return `<g opacity="0.35"><circle cx="500" cy="90" r="46" fill="none" stroke="#0A0B10" stroke-width="8"/><circle cx="440" cy="180" r="26" fill="none" stroke="#0A0B10" stroke-width="6"/></g>`;
    default: // earning-games
      return `<g opacity="0.35"><circle cx="500" cy="200" r="50" fill="none" stroke="#0A0B10" stroke-width="8"/><circle cx="440" cy="90" r="30" fill="none" stroke="#0A0B10" stroke-width="6"/></g>`;
  }
}

function cover(game) {
  const [c1, c2] = PALETTE[game.category] || ["#7C5CFC", "#B98CFF"];
  const initial = game.name.trim()[0].toUpperCase();
  return `<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${game.name} cover art">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="url(#g)"/>
  ${motif(game.category, game.id)}
  <text x="32" y="270" font-family="Space Grotesk, Arial, sans-serif" font-size="40" font-weight="700" fill="#0A0B10" opacity="0.85">${initial}</text>
</svg>`;
}

function icon(game) {
  const [c1, c2] = PALETTE[game.category] || ["#7C5CFC", "#B98CFF"];
  const initial = game.name.trim()[0].toUpperCase();
  return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${game.name} icon">
  <defs>
    <linearGradient id="gi" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#gi)"/>
  <text x="64" y="80" font-family="Space Grotesk, Arial, sans-serif" font-size="56" font-weight="700" fill="#0A0B10" opacity="0.85" text-anchor="middle">${initial}</text>
</svg>`;
}

function screenshot(game, n) {
  const [c1, c2] = PALETTE[game.category] || ["#7C5CFC", "#B98CFF"];
  return `<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${game.name} gameplay screenshot ${n}">
  <defs>
    <linearGradient id="gs${n}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#12141C"/>
      <stop offset="1" stop-color="${c1}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="300" fill="url(#gs${n})"/>
  ${motif(game.category, game.id + n)}
  <rect x="24" y="24" width="140" height="18" rx="9" fill="#ffffff" opacity="0.18"/>
  <rect x="24" y="252" width="220" height="24" rx="12" fill="#0A0B10" opacity="0.35"/>
</svg>`;
}

games.forEach((g) => {
  fs.writeFileSync(path.join(OUT_DIR, `${g.slug}-cover.svg`), cover(g));
  fs.writeFileSync(path.join(OUT_DIR, `${g.slug}-icon.svg`), icon(g));
  [1, 2, 3].forEach((n) => fs.writeFileSync(path.join(OUT_DIR, `${g.slug}-shot-${n}.svg`), screenshot(g, n)));
});

console.log(`Generated art for ${games.length} games in ${OUT_DIR}`);
