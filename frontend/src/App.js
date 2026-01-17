import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LandingPage from "./pages/common/LandingPage";
import AuthPage from "./pages/common/AuthPage";

import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";

function App() {
  const [user, setUser] = useState(null);

  const logout = () => setUser(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage onLogin={setUser} />} />
        
        {/* PROTECTED DASHBOARDS */}
        {/* Citizen Dashboard */}
        <Route
          path="/citizen"
          element={
            user?.role === "citizen" ? (
              <CitizenDashboard onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Admin Dashboard with nested routing support */}
        <Route
          path="/admin/*"
          element={
            user?.role === "admin" ? (
              <AdminDashboard onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Provider Dashboard with nested routing support */}
        <Route
          path="/provider/*"
          element={
            user?.role === "provider" ? (
              <ProviderDashboard onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Redirect old direct routes to default tabs */}
        <Route path="/admin" element={<Navigate to="/admin/services" replace />} />
        <Route path="/provider" element={<Navigate to="/provider/register" replace />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;