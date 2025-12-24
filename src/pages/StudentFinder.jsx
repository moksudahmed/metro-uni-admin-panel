import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {searchStudents} from "../api/student"

//import "./student-finder.css";

export default function StudentFinder({ token }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🔹 Debounced Search */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await searchStudents(query, token);
        setResults(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Search failed");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, token]);

  return (
    <div className="student-finder">
      {/* Search Box */}
      <div className="finder-input">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search student by ID, name, email or mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Results */}
      {loading && <div className="finder-state">Searching…</div>}
      {error && <div className="finder-error">{error}</div>}

      {results.length > 0 && (
        <div className="finder-results">
          {results.map((s) => (
            <div
              key={s.student_id}
              className="finder-item"
              onClick={() => navigate(`/students/${s.student_id}`)}
            >
              <User size={18} />
              <div>
                <strong>{s.per_name || s.name}</strong>
                <div className="muted">
                  ID: {s.student_id} • {s.email || "No email"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="finder-state">No student found</div>
      )}
    </div>
  );
}
