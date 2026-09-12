const { breadcrumbs, demoBanner, notePanel } = require("../components");

function referralsPage(referral) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Referrals" }])}
    <h1>Invite Friends &amp; Earn Rewards</h1>
    <p class="page-intro">Share your referral link. When a friend signs up and completes their first verified offer, you can both become eligible for a bonus.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    ${demoBanner("Demo referral code and statistics — connect a backend to generate a real code for your account.")}
    <div class="referral-box glass">
      <h2 style="font-size:1.1rem;margin-bottom:6px;">Your Referral Code</h2>
      <p style="color:var(--text-muted);font-size:0.88rem;">${referral.rewardPerReferral}</p>
      <div class="referral-code-row">
        <span class="referral-code" id="referralCodeText">${referral.code}</span>
        <button class="btn btn-ghost btn-sm" id="copyReferralBtn" data-code="${referral.code}">Copy Code</button>
        <button class="btn btn-accent btn-sm" id="shareReferralBtn" data-code="${referral.code}">Share</button>
      </div>
      <div class="referral-stats">
        <div class="stat"><b>${referral.totalReferred}</b><span>Friends Referred</span></div>
        <div class="stat"><b>${referral.pendingReferred}</b><span>Pending</span></div>
        <div class="stat"><b>${referral.rewardsEarnedFromReferrals} pts</b><span>Earned From Referrals</span></div>
      </div>
    </div>
    ${notePanel("Referral rewards depend on your friend completing an eligible offer and are not guaranteed. GameEarn does not offer cash bonuses for signups alone.")}
  </div>
</section>
`;
}

module.exports = { referralsPage };
