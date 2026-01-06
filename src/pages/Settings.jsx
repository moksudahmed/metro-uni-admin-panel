import { useState } from "react";
import { Lock, AlertTriangle, ShieldCheck, RefreshCcw } from "lucide-react";
import "./settings.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Settings() {
  const [loginID, setLoginID] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= RESET / GENERATE PASSWORD ================= */
  const generatePassword = async () => {
    if (!loginID) {
      return alert("Please enter Login ID");
    }

    if (
      !window.confirm(
        "This will reset the password to default (12345678). Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin-user/generate-password/${encodeURIComponent(loginID)}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Request failed");

      await res.json();
      alert("✅ Password reset successfully.\nNew Password: 12345678");
      setLoginID("");
    } catch (err) {
      alert("❌ Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page settings-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <h2>
          <ShieldCheck size={22} /> Settings
        </h2>
        <p>Administrative account actions</p>
      </div>

      {/* ================= PASSWORD RESET CARD ================= */}
      <div className="card danger">
        <div className="card-header">
          <h3 className="card-title text-danger">
            <AlertTriangle size={18} /> Reset User Password
          </h3>
          <p className="card-subtitle">
            Generates a default password for the selected user
          </p>
        </div>

        <div className="card-body">
          <div className="form-group">
            <label>User Login ID</label>
            <input
              type="text"
              placeholder="Enter login ID (email / username)"
              value={loginID}
              onChange={(e) => setLoginID(e.target.value)}
            />
          </div>

          <div className="alert alert-warning">
            <AlertTriangle size={18} />
            <div>
              <strong>Security Notice</strong>
              <p>
                Password will be reset to <b>12345678</b>. The user should change
                it immediately after login.
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button
            className="btn btn-danger"
            onClick={generatePassword}
            disabled={loading}
          >
            <RefreshCcw size={16} />
            {loading ? "Processing…" : "Generate Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
