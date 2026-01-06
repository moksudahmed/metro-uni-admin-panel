import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/login.css";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Login({ onLogin }) {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginID || !password) return alert("Please enter login ID and password");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin-user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: loginID, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      // Save token in localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("loginID", data.loginID);
      onLogin?.(data.access_token);
      navigate("/"); // redirect to dashboard
    } catch (err) {
      alert("❌ Login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <label>Login ID</label>
          <input
            type="text"
            value={loginID}
            onChange={(e) => setLoginID(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
