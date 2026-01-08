import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";

import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginID");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {token && <Sidebar isOpen={sidebarOpen} onLogout={handleLogout} />}
        <div className="main-content">
          {token && (
            <Topbar
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onSearch={handleSearch}
              onLogout={handleLogout}
            />
          )}

          <main className="content-wrapper">
            <Routes>
              {!token && (
                <Route path="/login" element={<Login onLogin={setToken} />} />
              )}

              {token && (
                <>
                  <Route path="/" element={<Dashboard token={token} />} />
                  <Route
                    path="/user-management"
                    element={<UserManagement token={token} />}
                  />
                  <Route path="/settings" element={<Settings token={token} />} />
                </>
              )}

              {/* Redirects */}
              <Route
                path="*"
                element={
                  token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
