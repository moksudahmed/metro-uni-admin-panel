import { useState } from "react";
import {
  Lock,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Power,
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Account({
  studentId,
  account,
  token,
  onAccountDeleted,
  onStatusChanged,
}) {
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async () => {
    const newStatus = !account?.usr_active;

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this account?`
      )
    )
      return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/student-users/${studentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ usr_active: newStatus }),
        }
      );

      if (!res.ok) throw new Error();

      alert(`✅ Account ${newStatus ? "activated" : "deactivated"} successfully`);
      onStatusChanged?.(newStatus);
    } catch {
      alert("❌ Failed to update account status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    if (!window.confirm("This will permanently delete the account. Continue?"))
      return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/student-users/${studentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();
      alert("✅ Account deleted successfully");
      onAccountDeleted?.();
    } catch {
      alert("❌ Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="stack gap-lg">
      {/* ================= ACCOUNT INFO ================= */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ShieldCheck size={18} /> Account Information
          </h3>
          <p className="card-subtitle">Login credentials and account status</p>
        </div>

        <div className="card-body">
          <div className="grid grid-2">
            <div>
              <label>Login ID</label>
              <p className="value">{account?.login_id}</p>
            </div>

            <div>
              <label>Status</label>
              <span
                className={`badge ${account?.usr_active ? "badge-success" : "badge-danger"}`}
              >
                {account?.usr_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button
            className={`btn ${account?.usr_active ? "btn-warning" : "btn-success"}`}
            onClick={toggleStatus}
            disabled={updatingStatus}
          >
            <Power size={16} />
            {updatingStatus
              ? "Updating…"
              : account?.usr_active
              ? "Deactivate Account"
              : "Activate Account"}
          </button>
        </div>
      </div>

      {/* ================= PASSWORD RESET ================= */}
      {account?.usr_active ? (
        <PasswordReset studentId={studentId} token={token} />
      ) : (
        <div className="card muted">
          <div className="card-header">
            <h3 className="card-title">
              <Lock size={18} /> Password Reset Disabled
            </h3>
          </div>
          <div className="card-body">
            <p className="text-muted">
              This account is inactive. Activate the account to reset the password.
            </p>
          </div>
        </div>
      )}

      {/* ================= DANGER ZONE ================= */}
      <div className="card danger">
        <div className="card-header">
          <h3 className="card-title text-danger">
            <AlertTriangle size={18} /> Danger Zone
          </h3>
          <p className="card-subtitle">Irreversible account actions</p>
        </div>

        <div className="card-footer">
          <button className="btn btn-danger" onClick={deleteAccount} disabled={deleting}>
            <Trash2 size={16} />
            {deleting ? "Deleting…" : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PASSWORD RESET COMPONENT ================= */
function PasswordReset({ studentId, token }) {
  const [password, setPassword] = useState({ new: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const resetPassword = async () => {
    if (password.new.length < 6) return alert("Password must be at least 6 characters");
    if (password.new !== password.confirm) return alert("Passwords do not match");

    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/student-users/${studentId}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: password.new }),
        }
      );

      if (!res.ok) throw new Error();
      alert("✅ Password reset successfully");
      setPassword({ new: "", confirm: "" });
    } catch {
      alert("❌ Failed to reset password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Lock size={18} /> Reset Password
        </h3>
        <p className="card-subtitle">Set a new password for this account</p>
      </div>

      <div className="card-body">
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password.new}
            onChange={(e) => setPassword({ ...password, new: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={password.confirm}
            onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
          />
        </div>

        <div className="alert alert-warning">
          <AlertTriangle size={18} />
          <div>
            <strong>Security Notice</strong>
            <p>The old password will stop working immediately.</p>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="btn btn-primary" onClick={resetPassword} disabled={saving}>
          <Lock size={16} />
          {saving ? "Resetting…" : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
