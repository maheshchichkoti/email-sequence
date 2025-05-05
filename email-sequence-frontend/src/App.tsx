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
      <div className="App">
        <div
          style={{
            maxWidth: 400,
            margin: "100px auto",
            padding: 20,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: 8,
            background: "white",
          }}
        >
          <h1>Email Sequence Designer</h1>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          {error && (
            <div
              style={{
                padding: 10,
                background: "#ffebee",
                color: "#c62828",
                borderRadius: 4,
                marginBottom: 15,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: "block", marginBottom: 5 }}>
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 5 }}>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 4,
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <p style={{ marginTop: 15, textAlign: "center" }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: "none",
                border: "none",
                color: "#2196f3",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h1>Email Sequence Designer</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>
      <div style={{ padding: 20 }}>
        <FlowEditor />
      </div>
    </div>
  );
}

export default App;
