const { breadcrumbs, demoBanner } = require("../components");

function achievementBadge(a) {
  return `<div class="achievement-badge glass ${a.unlocked ? "" : "locked"}">
    <span class="a-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.9 7.1 18.2l.9-5.5-4-3.9L9.5 8z"/></svg></span>
    <span>${a.name}</span>
  </div>`;
}

function profilePage(profile, achievements) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Profile" }])}
    <h1>Profile</h1>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    <div id="profileDemoBanner">${demoBanner("Demo stats below — sign in to see your real account details.")}</div>
    <div id="profileAuthNotice" style="display:none;margin-bottom:20px;"></div>
    <div class="profile-header glass">
      <svg class="profile-avatar" viewBox="0 0 84 84"><rect width="84" height="84" rx="42" fill="#171922"/><circle cx="42" cy="34" r="14" fill="#35F2A6"/><path d="M14 74c4-16 16-24 28-24s24 8 28 24" fill="#3DBBFF"/></svg>
      <div>
        <h1 id="profileUsername">${profile.username}</h1>
        <div class="profile-level">Level ${profile.level}</div>
        <div class="profile-stats-row">
          <div class="stat"><b>${profile.totalRewards}</b><span>Total Rewards</span></div>
          <div class="stat"><b>${profile.completedOffers}</b><span>Completed Offers</span></div>
          <div class="stat"><b>${profile.referralCount}</b><span>Referrals</span></div>
          <div class="stat"><b>${profile.streak}</b><span>Day Streak</span></div>
        </div>
      </div>
    </div>

    <div class="section-head"><div><h2>Achievements</h2></div></div>
    <div class="grid grid-6" style="margin-bottom:36px;">
      ${achievements.map(achievementBadge).join("\n")}
    </div>

    <div class="section-head"><div><h2>Account</h2></div></div>
    <div class="profile-menu" id="profileMenu">
      <a class="glass" href="#" onclick="event.preventDefault(); alert('Editing requires a connected backend.');">Edit Profile <span>&rarr;</span></a>
      <a class="glass" href="#" onclick="event.preventDefault(); alert('Security settings require a connected backend.');">Security <span>&rarr;</span></a>
      <a class="glass" href="#" onclick="event.preventDefault(); alert('Notification settings require a connected backend.');">Notifications <span>&rarr;</span></a>
      <a class="glass" href="/terms-and-conditions/">Terms <span>&rarr;</span></a>
      <a class="glass" href="/privacy-policy/">Privacy <span>&rarr;</span></a>
      <a class="glass" href="/login/" id="profileLoginLink">Log In <span>&rarr;</span></a>
      <button class="glass" id="profileLogoutBtn" style="display:none;">Logout <span>&rarr;</span></button>
    </div>
  </div>
</section>
<script type="module" src="/js/profile-auth.js"></script>
`;
}

module.exports = { profilePage };
