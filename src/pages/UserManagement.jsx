import React, { useEffect, useState, useCallback } from "react";
import { Search, User, PlusCircle, X } from "lucide-react";
import Profile from "./Students/Profile";
import Account from "./Students/Account";
import "./user-management.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const TABS = ["search", "profile", "account", "password"];

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

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const [accountForm, setAccountForm] = useState({
    loginID: "",
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
          `${API_BASE_URL}/api/v1/admin/student-users/${selectedStudentID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAccountExists(res.ok);
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
    if (!accountForm.loginID.trim()) return;

    setCreating(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/student-users/${selectedStudentID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountForm),
        }
      );

      if (!res.ok) throw new Error();

      setAccountExists(true);
      setShowCreateForm(false);
      setTab("account");
      alert("Account created successfully");
    } catch {
      alert("Failed to create account");
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
            disabled={
              t !== "search" &&
              (!selectedStudentID ||
                (t === "password" && !accountExists))
            }
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
        <Account studentId={selectedStudentID} token={token} />
      )}

      {tab === "password" && selectedStudentID && accountExists && (
        <Account.Password studentId={selectedStudentID} token={token} />
      )}
    </div>
  );
}
