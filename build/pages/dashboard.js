const { breadcrumbs, demoBanner, statCard, streakDay, notePanel } = require("../components");

function dashboardPage(dashboard, dailyRewards) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Dashboard" }])}
    <h1>Your Reward Dashboard</h1>
    <p class="page-intro">A live look at your rewards, streak and completed offers.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    ${demoBanner("Demo data — sign in and connect a backend to see your real numbers.")}
    <div class="dashboard-grid" id="dashboardStats">
      ${statCard("Total Rewards", dashboard.totalRewards, "green", dashboard.unit)}
      ${statCard("Available", dashboard.availableRewards, "blue", dashboard.unit)}
      ${statCard("Pending", dashboard.pendingRewards, "gold", dashboard.unit)}
      ${statCard("Completed Tasks", dashboard.completedTasks, "violet", "tasks")}
    </div>

    <div class="withdraw-bar glass">
      <div>
        <div class="label">Available to withdraw / redeem</div>
        <div class="stat-value accent-green" style="font-family:var(--font-display);font-size:1.6rem;color:var(--green);">${dashboard.availableRewards} ${dashboard.unit}</div>
      </div>
      <button class="btn btn-primary" id="withdrawBtn">Withdraw / Redeem</button>
    </div>

    <div class="section-head"><div><h2>Daily Rewards</h2><p>Check in each day to build your streak. Missing a day resets progress.</p></div></div>
    <div class="streak-row" id="streakRow">
      ${dailyRewards.map(streakDay).join("\n")}
    </div>
    <div class="streak-claim-wrap">
      <button class="btn btn-primary" id="claimRewardBtn">Claim Reward</button>
    </div>
    ${notePanel("Daily reward labels shown here (e.g. \"10 pts\") are illustrative point values in this demo, not monetary guarantees. Real reward values depend on the connected program once a backend is live.")}
  </div>
</section>
`;
}

module.exports = { dashboardPage };
