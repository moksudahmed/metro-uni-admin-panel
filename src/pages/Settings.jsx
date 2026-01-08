import { useState } from "react";
import {
  ShieldCheck,
  UserPlus,
  AlertTriangle,
  Save,
} from "lucide-react";
import "./settings.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Settings() {
  const [form, setForm] = useState({
    personID: "",
    loginID: "",
    password: "",
    usr_role: "basic-user",
  });

  const [loading, setLoading] = useState(false);

  /* ================= CREATE USER ================= */
  const createUser = async (e) => {
    e.preventDefault();

    if (!form.personID || !form.loginID || !form.password) {
      return alert("All fields are required");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (
      !window.confirm(
        "Are you sure you want to create this user?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin-user/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personID: Number(form.personID),
            loginID: form.loginID,
            password: form.password,
            usr_role: form.usr_role,
          }),
        }
      );
      console.log(res);
      if (!res.ok) throw new Error();

      await res.json();
      alert("✅ User created successfully");

      setForm({
        personID: "",
        loginID: "",
        password: "",
        usr_role: "basic-user",
      });
    } catch {
      alert("❌ Failed to create user");
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
        <p>Administrative user management</p>
      </div>

      {/* ================= CREATE USER CARD ================= */}
      <form className="card" onSubmit={createUser}>
        <div className="card-header">
          <h3 className="card-title">
            <UserPlus size={18} /> Create New User
          </h3>
          <p className="card-subtitle">
            Create an administrative user account
          </p>
        </div>

        <div className="card-body">
          <div className="form-group">
            <label>Person ID</label>
            <input
              type="number"
              placeholder="Enter person ID"
              value={form.personID}
              onChange={(e) =>
                setForm({ ...form, personID: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Login ID (Email / Username)</label>
            <input
              type="text"
              placeholder="Enter login ID"
              value={form.loginID}
              onChange={(e) =>
                setForm({ ...form, loginID: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>User Role</label>
            <select
              value={form.usr_role}
              onChange={(e) =>
                setForm({ ...form, usr_role: e.target.value })
              }
            >
              <option value="basic-user">Basic User</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
              <option value="faculty">Faculty</option>
              <option value="exam">Exam</option>
              <option value="registry">Registry</option>
            </select>
          </div>

          <div className="alert alert-warning">
            <AlertTriangle size={18} />
            <div>
              <strong>Security Notice</strong>
              <p>
                The user should change the password after first
                login.
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
