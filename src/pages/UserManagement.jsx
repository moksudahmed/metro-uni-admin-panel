import React, { useEffect, useState, useCallback } from "react";
import { Search, User, PlusCircle, X, Lock } from "lucide-react";
import Profile from "./Students/Profile";
import Account from "./Students/Account";
import "./user-management.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const TABS = ["search", "profile", "account"];

export default function UserManagement({ token }) {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedStudentID, setSelectedStudentID] = useState(null);

  const [checkingAccount, setCheckingAccount] = useState(false);
  const [accountExists, setAccountExists] = useState(false);
  const [account, setAccount] = useState({
    login_id: "",
    usr_active: true,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [accountForm, setAccountForm] = useState({
    loginID: "",
    password: "",
    confirmPassword: "",
    usr_active: true,
  });

  /* ================= SEARCH ================= */
  const searchStudents = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/students/${q}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();

      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch {
      setError("Unable to search students");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  /* ================= SELECT STUDENT ================= */
  const selectStudent = useCallback((student) => {
    setSelectedStudentID(student.student_id);
    setTab("profile");
    setShowCreateForm(false);
    setAccountExists(false);
  }, []);

  /* ================= CHECK ACCOUNT ================= */
  useEffect(() => {
    if (!selectedStudentID) return;

    const checkAccount = async () => {
      setCheckingAccount(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/admin/student-users-account/${selectedStudentID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();

        const data = await res.json();
        setAccount({
          login_id: data.login_id || "",
          usr_active: Boolean(data.is_active),
        });
        setAccountExists(true);
      } catch {
        setAccountExists(false);
      } finally {
        setCheckingAccount(false);
      }
    };

    checkAccount();
  }, [selectedStudentID, token]);

  /* ================= CREATE ACCOUNT ================= */
  const submitCreateAccount = async (e) => {
  e.preventDefault();

  if (!accountForm.loginID.trim()) {
    alert("Login ID is required");
    return;
  }

  if (!accountForm.password || accountForm.password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (accountForm.password !== accountForm.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setCreating(true);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/admin/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: selectedStudentID,
          login_id: accountForm.loginID.trim(),
          password: accountForm.password,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.detail || "Account creation failed");
    }

    alert("✅ Account created successfully");

    setAccountExists(true);
    setShowCreateForm(false);
    setTab("account");

  } catch (error) {
    alert(`❌ ${error.message}`);
  } finally {
    setCreating(false);
  }
};


  return (
    <div className="user-page">
      <header className="user-header">
        <h2>User Management</h2>
        <p>Search and manage student user accounts</p>
      </header>

      {/* ================= TABS ================= */}
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
            disabled={t !== "search" && !selectedStudentID}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= SEARCH ================= */}
      {tab === "search" && (
        <>
          <div className="search-box">
            <input
              placeholder="Enter Student ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchStudents()}
            />
            <button onClick={searchStudents}>
              <Search size={18} />
            </button>
          </div>

          {loading && <div className="state loading">Searching…</div>}
          {error && <div className="state error">{error}</div>}
          {!loading && searched && results.length === 0 && (
            <div className="state empty">No students found.</div>
          )}

          {results.map((s) => (
            <div
              key={s.student_id}
              className="search-result"
              onClick={() => selectStudent(s)}
            >
              <User size={18} />
              <div>
                <strong>{s.per_name}</strong>
                <span>{s.student_id}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ================= PROFILE ================= */}
      {tab === "profile" && selectedStudentID && (
        <>
          <Profile studentId={selectedStudentID} token={token} />

          {!checkingAccount && !accountExists && (
            <div className="card warning">
              <p>No account exists for this student.</p>
              <button onClick={() => setShowCreateForm(true)}>
                <PlusCircle size={16} /> Create Account
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="card">
              <div className="card-header">
                <h3>Create Student Account</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitCreateAccount}>
                <label>Login ID</label>
                <input
                  value={accountForm.loginID}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, loginID: e.target.value })
                  }
                  required
                />

                <label>
                  <Lock size={14} /> Password
                </label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, password: e.target.value })
                  }
                  required
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={(e) =>
                    setAccountForm({
                      ...accountForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={accountForm.usr_active}
                    onChange={(e) =>
                      setAccountForm({
                        ...accountForm,
                        usr_active: e.target.checked,
                      })
                    }
                  />
                  Active Account
                </label>

                <button disabled={creating}>
                  {creating ? "Creating…" : "Create Account"}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* ================= ACCOUNT ================= */}
      {tab === "account" && selectedStudentID && accountExists && (
        <Account
          studentId={selectedStudentID}
          account={account}
          token={token}
        />
      )}
    </div>
  );
}
