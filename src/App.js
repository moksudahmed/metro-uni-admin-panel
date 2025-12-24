import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./pages/Dashboard";
import StudentsList from "./pages/Students/StudentsList";
import StudentDetail from "./pages/Students/StudentDetail";
import Troubleshoot from "./pages/Troubleshoot";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import StudentFinder from "./pages/StudentFinder";
import UserManagement from "./pages/UserManagement";

import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handler for search functionality
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Add your search logic here
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onSearch={handleSearch}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentsList />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/student-finder" element={<StudentFinder />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/troubleshoot" element={<Troubleshoot />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}