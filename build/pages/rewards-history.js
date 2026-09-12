const { breadcrumbs, demoBanner, esc } = require("../components");

function rewardsHistoryPage(transactions) {
  return `
<section class="page-head">
  <div class="container">
    ${breadcrumbs([{ label: "Home", href: "/" }, { label: "Rewards", href: "/rewards/" }, { label: "History" }])}
    <h1>Rewards History</h1>
    <p class="page-intro">A record of points earned and redeemed on your account.</p>
  </div>
</section>
<section class="section" style="padding-top:0;">
  <div class="container">
    ${demoBanner("Demo transaction history — no real transactions are recorded until a backend is connected.")}
    <div class="leaderboard-wrap glass" style="padding:0;">
      <table class="admin-table" style="min-width:100%;">
        <thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${transactions
            .map(
              (t) => `<tr>
            <td>${t.date}</td>
            <td>${esc(t.description)}</td>
            <td>${t.type}</td>
            <td style="color:${t.amount.startsWith("+") ? "var(--green)" : "var(--red)"};font-weight:600;">${t.amount}</td>
            <td><span class="badge ${t.status === "Pending" ? "badge-demo" : "badge-free"}">${t.status}</span></td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
</section>
`;
}

module.exports = { rewardsHistoryPage };
