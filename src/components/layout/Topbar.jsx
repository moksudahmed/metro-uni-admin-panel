import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function Topbar({ onSearch }) {
  const [query, setQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      } else {
        onSearch(""); // reset search
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
    <div className="topbar">
      {/* Left */}
      <div>
        <div className="topbar-title">Admin Panel</div>
        <div className="topbar-subtitle">campus.metrouni.edu.bd</div>
      </div>

      {/* Search */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search student by ID, name, email, or mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
