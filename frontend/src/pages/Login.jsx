import { useState } from "react";
import MLSCLogo from "../assets/MLSC-logo.png";
import "../App.css";

export default function Login({ onSwitchView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login email:", email);
    console.log("Login password:", password);
  };

  return (
    <main className="auth-page auth-page--compact">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="panel-header">
          <img className="panel-logo" src={MLSCLogo} alt="MLSC logo" />
          <h2 id="login-title">Log in</h2>
          <p className="panel-copy">
            Welcome back. Use your registered credentials to continue.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-button">
            Log in
          </button>
        </form>

        <div className="panel-footer">
          <span>Need an account?</span>
          <button
            type="button"
            className="link-button"
            onClick={() => onSwitchView?.("signup")}
          >
            Sign up
          </button>
        </div>
      </section>
    </main>
  );
}
