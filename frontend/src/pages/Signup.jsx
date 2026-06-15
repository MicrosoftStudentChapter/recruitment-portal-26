import { useState } from "react";
import MLSCLogo from "../assets/MLSC-logo.png";
import "../App.css";

export default function Signup({ onSwitchView, onRegistered }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onRegistered?.({ email: trimmedEmail, password: trimmedPassword });
  };

  return (
    <main className="auth-page auth-page--compact">
      <section className="auth-panel" aria-labelledby="signup-title">
        <div className="panel-header">
          <img className="panel-logo" src={MLSCLogo} alt="MLSC logo" />
          <h2 id="signup-title">Sign up</h2>
          <p className="panel-copy">
            Create your recruitment portal account to begin the application
            flow.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              type="password"
              placeholder="Set your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button">
            Register
          </button>
        </form>

        <div className="panel-footer">
          <span>Already registered?</span>
          <button
            type="button"
            className="link-button"
            onClick={() => onSwitchView?.("login")}
          >
            Log in
          </button>
        </div>
      </section>
    </main>
  );
}
