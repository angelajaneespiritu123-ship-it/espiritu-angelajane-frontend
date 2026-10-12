export default function AuthPage({
  authMode,
  username,
  password,
  registerUsername,
  registerEmail,
  registerPassword,
  message,
  isRegistrationSuccess,
  setUsername,
  setPassword,
  setRegisterUsername,
  setRegisterEmail,
  setRegisterPassword,
  login,
  register,
  setAuthMode,
  setMessage,
}) {
  return (
    <div className="auth-page">
      <section className="auth-showcase" aria-label="Kanto Sari-Sari Store">
        <a className="auth-brand" href="#auth" aria-label="Kanto Sari-Sari Store home">
          <span className="auth-brand-mark">K</span>
          <span><strong>KANTO</strong><small>SARI-SARI STORE</small></span>
        </a>
        <div className="auth-showcase-copy">
          <span className="auth-overline">MUNTING TINDAHAN, ARAW-ARAW NA KASAMA</span>
          <h1>Malapit.<br />Maaasahan.<br /><em>Laging bukas.</em></h1>
          <p>Ayos na talaan ng paninda para sa takbo ng iyong tindahan.</p>
        </div>
        <span className="auth-showcase-foot">KANTO STORE <i>·</i> DAILY STOCK</span>
      </section>

      <section className="auth-panel" id="auth">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark">K</span>
            <span><strong>KANTO</strong><small>SARI-SARI STORE</small></span>
          </div>
          <span className="auth-overline auth-form-overline">{authMode === "login" ? "STORE MANAGEMENT" : "JOIN THE STORE"}</span>
          <h2 className="auth-title">{authMode === "login" ? "Welcome back" : "Create account"}<span>.</span></h2>
          <p className="auth-subtitle">{authMode === "login" ? "Mag-sign in para ma-check ang iyong paninda." : "Gumawa ng account para mapamahalaan ang tindahan."}</p>

          {message && (
            <div className={`auth-message ${isRegistrationSuccess ? "auth-message-success" : "auth-message-error"}`}>
              <span className="auth-message-icon">
                {isRegistrationSuccess ? "✓" : "×"}
              </span>
              {message}
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={login} className="auth-form">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="auth-input"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="auth-input"
                required
              />

              <button type="submit" className="auth-submit">Sign In</button>

              <div className="auth-switch">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setMessage("");
                  }}
                  className="auth-link"
                >
                  Register
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={register} className="auth-form">
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Username"
                className="auth-input"
                required
              />

              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Email"
                className="auth-input"
                required
              />

              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Password"
                className="auth-input"
                required
              />

              <button type="submit" className="auth-submit">Register</button>

              <div className="auth-switch">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setMessage("");
                  }}
                  className="auth-link"
                >
                  Login
                </button>
              </div>
            </form>
          )}

          <div className="auth-card-foot"><span className="auth-foot-dot" /> STOCKS IN ORDER, SUKI IN MIND</div>
        </div>
      </section>
    </div>
  );
}
