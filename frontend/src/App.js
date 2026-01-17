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

        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/provider"
          element={
            user?.role === "provider" ? (
              <ProviderDashboard onLogout={logout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
