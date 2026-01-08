import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/login.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState(""); // API expects `username`
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter login ID and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin-user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store auth data
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("loginID", data.loginID);
      localStorage.setItem("role", data.role);

      onLogin?.(data.access_token);
      navigate("/"); // Dashboard
    } catch (error) {
      alert(`❌ Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Admin Sign In</h2>

        <form onSubmit={handleLogin}>
          <label>Login ID</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
