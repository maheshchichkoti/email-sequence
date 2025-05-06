import React, { useState, useEffect } from "react";
import FlowEditor from "./components/FlowEditor/FlowEditor";
import { login, signup } from "./api/auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const response = await signup(email, password);
        localStorage.setItem("token", response.token);
      } else {
        const response = await login(email, password);
        localStorage.setItem("token", response.token);
      }
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img
              src="/logo.svg"
              alt="Email Sequence Designer"
              className="auth-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <h1>Email Sequence Designer</h1>
            <p className="auth-subtitle">
              {isSignup
                ? "Create an account to start designing email sequences"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {error && (
            <div className="error-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={
                  isSignup ? "Create a secure password" : "Enter your password"
                }
                className="form-input"
                minLength={6}
              />
              {isSignup && (
                <small className="password-hint">
                  Password must be at least 6 characters
                </small>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`auth-button ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Processing...</span>
                </>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-button"
              >
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {showWelcome && (
        <div className="welcome-toast">
          <div className="toast-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Welcome to Email Sequence Designer!</span>
          </div>
        </div>
      )}

      <header className="app-header">
        <div className="header-left">
          <img
            src="/logo.svg"
            alt=""
            className="header-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <h1>Email Sequence Designer</h1>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="logout-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">
        <FlowEditor />
      </main>

      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Email Sequence Designer. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
