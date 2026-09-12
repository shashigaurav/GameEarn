// build/generate-offer-assets.js
const fs = require("fs");
const path = require("path");
const { offers } = require("../data/offers");

const OUT_DIR = path.join(__dirname, "..", "public", "assets", "offers");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PALETTE = {
  tasks: ["#35F2A6", "#3DBBFF"],
  surveys: ["#3DBBFF", "#9B6BFF"],
  "app-offers": ["#9B6BFF", "#35F2A6"],
  cashback: ["#F0B429", "#35F2A6"],
};

function cover(o) {
  const [c1, c2] = PALETTE[o.category] || ["#35F2A6", "#3DBBFF"];
  const initial = o.provider.trim()[0].toUpperCase();
  return `<svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.title} cover art">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="320" fill="#0B0D13"/>
  <rect width="640" height="320" fill="url(#g)" opacity="0.85"/>
  <circle cx="540" cy="60" r="90" fill="#050609" opacity="0.18"/>
  <circle cx="70" cy="270" r="70" fill="#050609" opacity="0.15"/>
  <text x="32" y="270" font-family="Space Grotesk, Arial, sans-serif" font-size="40" font-weight="700" fill="#050609" opacity="0.85">${initial}</text>
</svg>`;
}

function icon(o) {
  const [c1, c2] = PALETTE[o.category] || ["#35F2A6", "#3DBBFF"];
  const initial = o.provider.trim()[0].toUpperCase();
  return `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.provider} icon">
  <defs>
    <linearGradient id="gi" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="30" fill="url(#gi)"/>
  <text x="64" y="80" font-family="Space Grotesk, Arial, sans-serif" font-size="56" font-weight="700" fill="#050609" opacity="0.85" text-anchor="middle">${initial}</text>
</svg>`;
}

offers.forEach((o) => {
  fs.writeFileSync(path.join(OUT_DIR, `${o.slug}-cover.svg`), cover(o));
  fs.writeFileSync(path.join(OUT_DIR, `${o.slug}-icon.svg`), icon(o));
});

console.log(`Generated art for ${offers.length} offers in ${OUT_DIR}`);
