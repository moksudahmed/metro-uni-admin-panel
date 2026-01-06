import { Link } from "react-router-dom";
import { Menu, User, Database, Activity, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">MetroUni Admin</div>
        <div className="sidebar-subtitle">
          Student Records • Maintenance
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item"><Menu size={18} /> Dashboard</Link>
       {/*<Link to="/students" className="nav-item"><User size={18} /> Students</Link>
        <Link to="/troubleshoot" className="nav-item"><Activity size={18} /> Troubleshoot</Link>
        <Link to="/maintenance" className="nav-item"><Database size={18} /> Maintenance</Link>*/}
         <Link to="/user-management" className="nav-item"><Database size={18} /> User Management</Link>
        <Link to="/settings" className="nav-item"><Settings size={18} /> Settings</Link>
      </nav>
    </aside>
  );
}
