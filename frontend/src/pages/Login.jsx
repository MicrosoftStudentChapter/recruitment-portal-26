import { useState } from "react";
import MLSCLogo from "../assets/MLSC-logo.png";
import "../App.css";

export default function Login({ onSwitchView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Admin Login
      if (data.isAdmin) {
        localStorage.setItem("isAdmin", "true");

        onSwitchView("admin-dashboard");
        return;
      }

      // Candidate Login
      localStorage.setItem(
        "accessToken",
        data.session.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.session.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onSwitchView("dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-page--compact">
      <section
        className="auth-panel"
        aria-labelledby="login-title"
      >
        <div className="panel-header">
          <img
            className="panel-logo"
            src={MLSCLogo}
            alt="MLSC logo"
          />

          <h2 id="login-title">
            Log in
          </h2>

          <p className="panel-copy">
            Welcome back. Use your registered
            credentials to continue.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log in"}
          </button>
        </form>

        <div className="panel-footer">
          <span>Need an account?</span>

          <button
            type="button"
            className="link-button"
            onClick={() =>
              onSwitchView?.("signup")
            }
          >
            Sign up
          </button>
        </div>
      </section>
    </main>
  );
}