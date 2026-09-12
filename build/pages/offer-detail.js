const { esc, ratingStars, verifiedBadge, difficultyBadge, trustScoreBar, breadcrumbs, faqList, categoryLabel } = require("../components");
const { OFFER_CATEGORIES } = require("../../data/offers");

function offerCategoryLabel(slug) {
  const c = OFFER_CATEGORIES.find((c) => c.slug === slug);
  return c ? c.name : slug;
}

function offerDetailPage(offer, relatedOffers) {
  const faq = [
    { q: `Is "${offer.title}" free to start?`, a: offer.noCost ? "Yes, this offer has no cost to start — you only need to complete the listed requirements." : "This offer may involve a purchase or subscription as part of completing it. Check the requirements below and the provider's official terms." },
    { q: "How is the reward paid out?", a: `${offer.provider} manages and issues the reward directly according to its own program rules. GameEarn does not process or guarantee payouts.` },
    { q: "What if I don't meet eligibility?", a: "If you don't meet the eligibility requirements listed below, you may not qualify for the reward even after completing the steps. Always check eligibility first." },
  ];

  return `
<div class="container" style="padding-top:32px;">
  ${breadcrumbs([
    { label: "Home", href: "/" },
    { label: "Offers", href: "/offers/" },
    { label: offer.title },
  ])}
  <div class="detail-hero">
    <div class="detail-cover">
      <img src="${offer.image}" alt="${esc(offer.title)} cover" width="640" height="320" />
    </div>
    <div class="detail-info">
      <div class="title-row">
        <img src="${offer.icon}" alt="" />
        <div>
          <h1>${esc(offer.title)}</h1>
          <div class="meta-line">${ratingStars(offer.rating)}<span>&middot;</span><span>${esc(offer.provider)}</span><span>&middot;</span><span>${offerCategoryLabel(offer.category)}</span></div>
        </div>
      </div>
      <div class="detail-badges">
        ${offer.verified ? verifiedBadge() : ""}
        ${difficultyBadge(offer.difficulty)}
        ${offer.newOffer ? '<span class="badge badge-new">New</span>' : ""}
        ${offer.noCost ? '<span class="badge badge-free">No Cost</span>' : ""}
      </div>
      <p>${esc(offer.description)}</p>
      <div class="detail-meta-grid">
        <div class="meta-block glass"><div class="label">Reward</div><div class="value">${esc(offer.rewardRange)}</div></div>
        <div class="meta-block glass"><div class="label">Est. Time</div><div class="value">${esc(offer.estimatedTime)}</div></div>
        <div class="meta-block glass"><div class="label">Provider</div><div class="value">${esc(offer.provider)}</div></div>
        <div class="meta-block glass"><div class="label">Category</div><div class="value">${offerCategoryLabel(offer.category)}</div></div>
        <div class="meta-block glass"><div class="label">Difficulty</div><div class="value">${offer.difficulty}</div></div>
        <div class="meta-block glass"><div class="label">Last Verified</div><div class="value">${offer.lastVerified}</div></div>
      </div>
      ${trustScoreBar(offer.trustScore)}
      <div class="detail-actions">
        <a href="https://example.com/offer/${offer.slug}" class="btn btn-primary" rel="nofollow sponsored noopener" target="_blank">Start Offer</a>
        <a href="/offers/" class="btn btn-ghost">More ${offerCategoryLabel(offer.category)}</a>
      </div>
    </div>
  </div>

  <div class="detail-body">
    <div>
      <div class="content-block">
        <h2>About This Offer</h2>
        <p>${esc(offer.description)}</p>
        <p>${offer.trustNote}</p>
      </div>

      <div class="content-block">
        <h2>Eligibility</h2>
        <p>${esc(offer.eligibility)}</p>
      </div>

      <div class="content-block">
        <h2>Requirements</h2>
        <ul class="feature-list">
          ${offer.requirements.map((r) => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>${esc(r)}</li>`).join("")}
        </ul>
      </div>

      <div class="content-block">
        <h2>Important Terms</h2>
        <p>${esc(offer.terms)}</p>
      </div>

      <div class="content-block">
        <h2>Reviews</h2>
        ${offer.reviews
          .map(
            (r) => `<div class="review-item"><div class="review-head"><span class="review-name">${esc(r.name)}</span>${ratingStars(r.rating)}</div><p>${esc(r.text)}</p></div>`
          )
          .join("")}
      </div>

      <div class="content-block">
        <h2>Frequently Asked Questions</h2>
        ${faqList(faq)}
      </div>
    </div>

    <aside>
      <div class="reward-panel">
        <h3>Reward Information</h3>
        <p>Reward availability varies by app, region and eligibility. This reward is issued and controlled entirely by ${esc(offer.provider)} — GameEarn does not guarantee, process or pay it out.</p>
      </div>
      <div class="sidebar-card glass">
        <h3>Trust Snapshot</h3>
        ${trustScoreBar(offer.trustScore)}
        <p style="font-size:0.82rem;color:var(--text-muted);margin-top:10px;">${offer.trustNote}</p>
      </div>
      <div class="sidebar-card glass">
        <h3>Related Offers</h3>
        ${relatedOffers
          .map(
            (r) => `<a class="related-mini" href="/offer/${r.slug}/">
          <img src="${r.icon}" alt="" />
          <div><div class="rm-name">${esc(r.title)}</div><div class="rm-meta">${offerCategoryLabel(r.category)} &middot; ${r.rating.toFixed(1)}★</div></div>
        </a>`
          )
          .join("")}
      </div>
    </aside>
  </div>
</div>
`;
}

module.exports = { offerDetailPage, offerCategoryLabel };
