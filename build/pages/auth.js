function loginPage() {
  return `
<div class="auth-wrap">
  <div class="auth-card glass">
    <h1>Welcome Back</h1>
    <p class="auth-sub">Log in to track your rewards, streak and offers.</p>
    <form class="auth-form" onsubmit="event.preventDefault(); alert('Authentication requires a connected backend (e.g. Supabase or Firebase). This is a UI demo only.');">
      <div>
        <label for="login-email">Email</label>
        <input id="login-email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <label for="login-password">Password</label>
        <input id="login-password" type="password" required placeholder="••••••••" />
      </div>
      <button type="submit" class="btn btn-primary btn-block">Log In</button>
    </form>
    <div class="auth-divider">or</div>
    <button class="btn btn-ghost btn-block" onclick="alert('Social login requires a connected backend. This is a UI demo only.');">Continue with Google</button>
    <p class="auth-switch">Don't have an account? <a href="/signup/">Sign up</a></p>
  </div>
</div>
`;
}

function signupPage() {
  return `
<div class="auth-wrap">
  <div class="auth-card glass">
    <h1>Create Your Account</h1>
    <p class="auth-sub">Join GameEarn to track rewards, build a streak and refer friends.</p>
    <form class="auth-form" onsubmit="event.preventDefault(); alert('Account creation requires a connected backend (e.g. Supabase or Firebase). This is a UI demo only.');">
      <div>
        <label for="signup-username">Username</label>
        <input id="signup-username" type="text" required placeholder="Choose a username" />
      </div>
      <div>
        <label for="signup-email">Email</label>
        <input id="signup-email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <label for="signup-password">Password</label>
        <input id="signup-password" type="password" required placeholder="Create a password" />
      </div>
      <button type="submit" class="btn btn-primary btn-block">Create Account</button>
    </form>
    <div class="auth-divider">or</div>
    <button class="btn btn-ghost btn-block" onclick="alert('Social signup requires a connected backend. This is a UI demo only.');">Continue with Google</button>
    <p class="auth-switch">Already have an account? <a href="/login/">Log in</a></p>
  </div>
</div>
`;
}

module.exports = { loginPage, signupPage };
