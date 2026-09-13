function loginPage() {
  return `
<div class="auth-wrap">
  <div class="auth-card glass">
    <h1>Welcome Back</h1>
    <p class="auth-sub">Log in to track your rewards, streak and offers.</p>
    <div id="loginMessage" style="display:none;margin-bottom:14px;font-size:0.85rem;"></div>
    <form class="auth-form" id="loginForm">
      <div>
        <label for="login-email">Email</label>
        <input id="login-email" type="email" required placeholder="you@example.com" autocomplete="username" />
      </div>
      <div>
        <label for="login-password">Password</label>
        <input id="login-password" type="password" required placeholder="••••••••" autocomplete="current-password" />
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="loginSubmitBtn">Log In</button>
    </form>
    <div class="auth-divider">or</div>
    <button class="btn btn-ghost btn-block" id="googleLoginBtn">Continue with Google</button>
    <p class="auth-switch">Don't have an account? <a href="/signup/">Sign up</a></p>
  </div>
</div>
<script type="module" src="/js/login.js"></script>
`;
}

function signupPage() {
  return `
<div class="auth-wrap">
  <div class="auth-card glass">
    <h1>Create Your Account</h1>
    <p class="auth-sub">Join GameEarn to track rewards, build a streak and refer friends.</p>
    <div id="signupMessage" style="display:none;margin-bottom:14px;font-size:0.85rem;"></div>
    <form class="auth-form" id="signupForm">
      <div>
        <label for="signup-username">Username</label>
        <input id="signup-username" type="text" required placeholder="Choose a username" autocomplete="nickname" />
      </div>
      <div>
        <label for="signup-email">Email</label>
        <input id="signup-email" type="email" required placeholder="you@example.com" autocomplete="username" />
      </div>
      <div>
        <label for="signup-password">Password</label>
        <input id="signup-password" type="password" required placeholder="Create a password" autocomplete="new-password" minlength="6" />
      </div>
      <button type="submit" class="btn btn-primary btn-block" id="signupSubmitBtn">Create Account</button>
    </form>
    <div class="auth-divider">or</div>
    <button class="btn btn-ghost btn-block" id="googleSignupBtn">Continue with Google</button>
    <p class="auth-switch">Already have an account? <a href="/login/">Log in</a></p>
  </div>
</div>
<script type="module" src="/js/signup.js"></script>
`;
}

module.exports = { loginPage, signupPage };
