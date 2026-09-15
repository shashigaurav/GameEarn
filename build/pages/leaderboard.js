const { breadcrumbs, demoBanner, leaderboardRow, notePanel } = require("../components");

function leaderboardPage(entries) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Leaderboard" }])}
    <h1>🏆 Top Reward Earners</h1>
    <p class="page-intro">Ranked by total points across games and offers this season.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    ${demoBanner("Demo leaderboard data — shown for illustration only.")}
    <div class="leaderboard-wrap glass">
      <table class="leaderboard-table">
        <thead><tr><th>Rank</th><th>Player</th><th>Points</th><th>Level</th></tr></thead>
        <tbody>${entries.map(leaderboardRow).join("")}</tbody>
      </table>
    </div>
    ${notePanel("Leaderboard standings reflect in-platform points and activity only. GameEarn does not offer prize money, betting or wagering tied to leaderboard position.")}
  </div>
</section>
`;
}

module.exports = { leaderboardPage };
