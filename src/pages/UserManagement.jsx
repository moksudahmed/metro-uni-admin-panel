import React, { useEffect, useState, useCallback } from "react";
import { Search, User, Lock, AlertCircle } from "lucide-react";
import Profile from "./Students/Profile";
import "./user-management.css";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UserManagement = ({ token }) => {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStudentID, setSelectedStudentID] = useState(null);

  const [account, setAccount] = useState({
    loginID: "",
    usr_active: true,
  });

  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  /* =========================
     SEARCH STUDENTS
  ========================= */
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      // ✅ Normalize response
      const students = Array.isArray(data) ? data : [data];

      setResults(students);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to search students");
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SELECT STUDENT (FIXED)
  ========================= */
  const loadAccount = useCallback((student) => {
    if (!student || !student.student_id) {
      console.error("Invalid student object:", student);
      return;
    }

    const id = student.student_id;

    console.log("✅ Selected student ID:", id);

    setSelectedStudentID(id);
    setTab("profile");
    console.log(id);
  }, []);

  /* =========================
     LOAD USER ACCOUNT
  ========================= */
  useEffect(() => {
    if (!selectedStudentID) return;

    console.log("📌 Loading account for:", selectedStudentID);

    const fetchAccount = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/admin/student-users/${selectedStudentID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setAccount({ loginID: "", usr_active: true });
          return;
        }

        const data = await res.json();

        setAccount({
          loginID: data.loginID || "",
          usr_active: Boolean(data.usr_active),
        });
      } catch (err) {
        console.error("Account load failed:", err);
        setAccount({ loginID: "", usr_active: true });
      }
    };

    fetchAccount();
  }, [selectedStudentID, token]);

  /* =========================
     RESET PASSWORD
  ========================= */
  const resetPassword = async () => {
    if (!password.new || password.new !== password.confirm) {
      alert("Passwords do not match");
      return;
    }

    if (!selectedStudentID) return;

    await fetch(
      `${API_BASE_URL}/api/v1/admin/student-users/${selectedStudentID}/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: password.new }),
      }
    );

    setPassword({ new: "", confirm: "" });
    alert("Password reset successful");
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>User Management</h2>
        <p>Search and manage student user accounts</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["search", "profile", "password"].map((t) => (
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

      {/* SEARCH TAB */}
      {tab === "search" && (
        <>
          <div className="search-box">
            <input
              placeholder="Student ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchStudents()}
            />
            <button onClick={searchStudents}>
              <Search size={18} />
            </button>
          </div>

          {loading && <div className="profile-state loading">Searching…</div>}
          {error && <div className="profile-state error">{error}</div>}
          {!loading && searched && results.length === 0 && (
            <div className="profile-state empty">No students found.</div>
          )}

          {results.map((s) => (
            <div
              key={s.student_id}
              className="search-result"
              onClick={() => loadAccount(s)}
            >
              <User size={18} />
              <div>
                <strong>{s.per_name}</strong>
                <div className="muted">{s.student_id}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* PROFILE TAB */}
      {tab === "profile" && selectedStudentID && (
        <Profile student_id={selectedStudentID} token={token} />
      )}

      {/* PASSWORD TAB */}
      {tab === "password" && selectedStudentID && (
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
      )}
    </div>
  );
};

export default UserManagement;
