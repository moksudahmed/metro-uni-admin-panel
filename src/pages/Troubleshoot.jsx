import { useEffect, useState } from "react";
import { fetchIssues, runAutoFix } from "../api/admin.api";

export default function Troubleshoot() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchIssues().then(res => setIssues(res.data));
  }, []);

  return (
    <div className="page">
      <h2>Troubleshoot</h2>
      <button onClick={runAutoFix}>Auto Fix</button>

      {issues.map(i => (
        <div key={i.student_id}>
          {i.student_id} - {i.type}
        </div>
      ))}
    </div>
  );
}
