import { useEffect, useState } from "react";
import { Lock, PlusCircle, AlertCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Account({
  studentId,
  token,
  accountExists,
  onAccountCreated,
}) {
  const [account, setAccount] = useState({
    loginID: "",
    usr_active: true,
  });

  /* =========================
     LOAD ACCOUNT
  ========================= */
  useEffect(() => {
    if (!accountExists) return;

    const loadAccount = async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/student-users/${studentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setAccount({
        loginID: data.loginID || "",
        usr_active: Boolean(data.usr_active),
      });
    };

    loadAccount();
  }, [studentId, token, accountExists]);

  /* =========================
     CREATE ACCOUNT
  ========================= */
  const createAccount = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/admin/student-users/${studentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usr_active: true }),
      }
    );

    if (res.ok) {
      alert("✅ Account created successfully");
      onAccountCreated();
    } else {
      alert("❌ Failed to create account");
    }
  };

  /* =========================
     UI
  ========================= */
  if (!accountExists) {
    return (
      <div className="profile-card warning">
        <p>⚠️ No user account exists for this student.</p>
        <button className="btn-primary" onClick={createAccount}>
          <PlusCircle size={16} /> Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h3>Account Information</h3>
      <p>
        <strong>Login ID:</strong> {account.loginID}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {account.usr_active ? "Active" : "Inactive"}
      </p>
    </div>
  );
}

/* =========================
   PASSWORD SUB-COMPONENT
========================= */
Account.Password = function PasswordTab({ studentId, token }) {
  const [password, setPassword] = useState({ new: "", confirm: "" });

  const resetPassword = async () => {
    if (password.new !== password.confirm) {
      alert("Passwords do not match");
      return;
    }

    await fetch(
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

    alert("Password reset successful");
    setPassword({ new: "", confirm: "" });
  };

  return (
    <div className="profile-card">
      <h3>
        <Lock size={16} /> Reset Password
      </h3>

      <input
        type="password"
        placeholder="New password"
        value={password.new}
        onChange={(e) =>
          setPassword({ ...password, new: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={password.confirm}
        onChange={(e) =>
          setPassword({ ...password, confirm: e.target.value })
        }
      />
      <button onClick={resetPassword}>
        <AlertCircle size={16} /> Reset Password
      </button>
    </div>
  );
};
