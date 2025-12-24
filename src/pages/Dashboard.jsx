import StatCard from "../components/layout/StatCard";
//import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="page dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of student data integrity and system status
          </p>
        </div>
      </div>

      {/* Statistics Summary */}
      <section className="dashboard-section">
        <div className="stats-grid">
          <StatCard title="Total Students" value="17,824" />
          <StatCard title="Missing Email Records" value="294" highlight />
          <StatCard title="Duplicate Student Entries" value="32" />
          <StatCard title="Unlinked User Accounts" value="478" />
        </div>
      </section>

      {/* Insights */}
      <section className="dashboard-section dashboard-grid">
        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">Recent System Activity</h3>
          <p className="dashboard-card-text">
            Displays recent account creation, data validation, and automated
            correction processes.
          </p>
        </div>

        <div className="card dashboard-card">
          <h3 className="dashboard-card-title">Data Quality Monitoring</h3>
          <ul className="status-list">
            <li>Email verification process active</li>
            <li>Duplicate record detection enabled</li>
            <li>Automated repair mechanisms running</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
