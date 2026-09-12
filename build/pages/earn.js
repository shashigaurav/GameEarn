const { earnCard, breadcrumbs, notePanel } = require("../components");
const { WAYS_TO_EARN } = require("../../data/demo");

const ICONS = {
  games: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="10" rx="4"/><circle cx="8.5" cy="13" r="1.2"/><circle cx="16" cy="12.5" r="1"/><circle cx="18" cy="14.5" r="1"/></svg>',
  tasks: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 11l2 2 4-4"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
  surveys: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  "app-offers": '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  cashback: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.2 1.3-2 3-2s3 .9 3 2.1c0 2.7-6 1.3-6 4 0 1.2 1.3 2.1 3 2.1s3-.9 3-2.1"/></svg>',
  referral: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M2.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6M14.5 14.5c2.6.2 4.5 2.5 4.5 5.5"/></svg>',
  daily: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg>',
  quizzes: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.7-2.5 1.8-2.5 3.5M12 17h.01"/></svg>',
};

function earnPage() {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Earn" }])}
    <h1>Ways To Earn</h1>
    <p class="page-intro">Every path to a reward on GameEarn, in one place. Pick a method below to see verified games and offers that match it.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div class="grid grid-8">
      ${WAYS_TO_EARN.map((w) => earnCard(ICONS[w.key], w.title, w.desc, w.href, w.cta)).join("\n")}
    </div>
    ${notePanel("Reward availability varies by app, region and eligibility. GameEarn is a discovery platform and does not guarantee earnings from any method listed above.")}
  </div>
</section>
`;
}

module.exports = { earnPage };
