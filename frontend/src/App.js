import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/common/AuthPage";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";

function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null });
  };

  const Guard = ({ role, children }) => {
    if (!auth.token || auth.role !== role) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage setAuth={setAuth} />} />

        <Route
          path="/citizen"
          element={
            <Guard role="citizen">
              <CitizenDashboard onLogout={logout} />
            </Guard>
          }
        />
        <Route path="/admin/*" element={<AdminDashboard />} />
        


        <Route
          path="/admin"
          element={
            <Guard role="admin">
              <AdminDashboard onLogout={logout} />
            </Guard>
          }
        />

        <Route
          path="/provider"
          element={
            <Guard role="provider">
              <ProviderDashboard onLogout={logout} />
            </Guard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
