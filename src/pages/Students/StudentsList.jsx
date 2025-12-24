import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudents } from "../../api/students.api";
import { createUserForStudent } from "../../api/admin.api";

const PAGE_SIZE = 10;

export default function StudentsList({ globalSearch = "", token }) {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  /* ---------------- Fetch Students ---------------- */
  useEffect(() => {
    let cancelled = false;

    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetchStudents(token);
        console.log(res);
        // ✅ Support both array and { data: [] }
        const list = Array.isArray(res) ? res : res?.data || [];

        if (!cancelled) {
          setStudents(list);
        }
      } catch (err) {
        console.error("Fetch students failed:", err);
        if (!cancelled) setError("Failed to load students");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // ✅ Always try fetching (token handled in API)
    loadStudents();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ---------------- Search ---------------- */
  const filteredStudents = useMemo(() => {
    const q = globalSearch.toLowerCase().trim();
    if (!q) return students;

    return students.filter((s) =>
      `${s.student_id} ${s.per_name || s.name || ""} ${s.email || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [students, globalSearch]);

  useEffect(() => {
    setPage(1);
  }, [globalSearch]);

  /* ---------------- Pagination ---------------- */
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, page]);

  /* ---------------- Actions ---------------- */
  const handleCreateUser = async (student_id) => {
    try {
      await createUserForStudent({ student_id }, token);
      alert("User created successfully");
    } catch {
      alert("Failed to create user");
    }
  };

  /* ---------------- Render ---------------- */
  if (loading) {
    return <div className="page">Loading students…</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <h2>Students</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedStudents.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          )}

          {paginatedStudents.map((s) => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.per_name || s.name || "—"}</td>
              <td>{s.email || "Missing"}</td>
              <td>
                <button onClick={() => navigate(`/students/${s.student_id}`)}>
                  View
                </button>
                <button onClick={() => handleCreateUser(s.student_id)}>
                  Create User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ◀ Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}
