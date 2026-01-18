import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import authImage from "../../assets/uniserve.png";

import {
  FaUser,
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaSun,
  FaMoon,
} from "react-icons/fa";

function AuthPage({ setAuth }) {
  const navigate = useNavigate();

  /* UI STATE */
  
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  /* 🌙 Dark Mode */
  
  /* ✅ LOGIN */
  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:9000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.clear();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      setAuth({
        token: data.access_token,
        role: data.role,
      });

      navigate(`/${data.role}`, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* BACK */}
      

      {/* THEME */}
      

      <div className="auth-container">
        {/* IMAGE PANEL */}
        <div
          className="auth-image-panel"
          style={{
            backgroundImage: `url(${authImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* LOGIN PANEL */}
        <div className="auth-panel sign-in-panel">
          <div className="auth-header">
            <FaShieldAlt className="auth-icon" />
            <h3>Uni-Serve India</h3>
            <p className="welcome-subtitle">
              Unified Digital Public Services Platform
            </p>
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Login to your account</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button className="auth-btn primary-btn" onClick={handleLogin}>
              Login
            </button>

            {error && <p className="auth-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
