const { adminLayout } = require("./layout");

function adminLoginPage() {
  const content = `
<div class="auth-wrap">
  <div class="auth-card glass">
    <h1>Admin Login</h1>
    <p class="auth-sub">Sign in with your authorized admin account.</p>
    <div id="configWarning"></div>
    <form class="auth-form" id="adminLoginForm">
      <div>
        <label for="admin-email">Email</label>
        <input id="admin-email" type="email" required autocomplete="username" />
      </div>
      <div>
        <label for="admin-password">Password</label>
        <input id="admin-password" type="password" required autocomplete="current-password" />
      </div>
      <div id="loginError" class="field-error" style="display:none;color:var(--red);font-size:0.85rem;"></div>
      <button type="submit" class="btn btn-primary btn-block" id="adminLoginBtn">Log In</button>
    </form>
    <p class="auth-switch" style="margin-top:22px;">Not an admin? There's nothing else to see here — head back to <a href="/">GameEarn</a>.</p>
  </div>
</div>`;

  return adminLayout({ title: "Admin Login", active: "", content, guarded: false, pageScript: "/js/admin/login.js" });
}

module.exports = { adminLoginPage };
