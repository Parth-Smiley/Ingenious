import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaShieldAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaMobileAlt,
} from "react-icons/fa";

/* DEMO USERS – SAME AS AUTH JS 1 */
const DEMO_USERS = {
  citizen: { username: "citizen", password: "123" },
  admin: { username: "admin", password: "123" },
  provider: { username: "provider", password: "123" },
};

function AuthPage({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode"); // signin | login

  /* 🔑 CORE STATE — SAME BEHAVIOR AS AUTH JS 1 */
  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("citizen");
  const [verify, setVerify] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  /* 🔑 URL → PANEL SYNC (AUTH JS 1 LOGIC) */
  useEffect(() => {
    setIsSignup(mode === "login");
  }, [mode]);

  /* 🔑 LOGIN — EXACTLY AS AUTH JS 1 */
  const handleLogin = () => {
    let matchedRole = null;

    for (const roleKey in DEMO_USERS) {
      const demo = DEMO_USERS[roleKey];
      if (username === demo.username && password === demo.password) {
        matchedRole = roleKey;
        break;
      }
    }

    if (!matchedRole) {
      alert("Invalid demo credentials");
      return;
    }

    onLogin({ username, role: matchedRole });
    navigate(`/${matchedRole}`, { replace: true });
  };

  /* 🔑 SIGNUP — UI ONLY */
  const handleSignup = (e) => {
    e.preventDefault();

    if (verify) {
      if (!verifyMethod) return alert("Select verification method");
      if (verifyMethod === "otp" && !otp) return alert("Enter OTP");
      if (verifyMethod === "mail" && !email) return alert("Enter Email");
    }

    alert("Account created successfully (demo)");
    setIsSignup(true); // slide to login
  };

  return (
    <div className={`auth-wrapper ${isSignup ? "toggled" : ""}`}>
      {/* BACK BUTTON */}
      <button className="auth-back-btn" onClick={() => navigate("/")}>
        <FaArrowLeft /> Back to Home
      </button>

      <div className="auth-container">
        {/* INFO / IMAGE PANEL — FROM AUTH JS 2 */}
        <div className="auth-image-panel">
          <div className="image-overlay">
            <h1 className="welcome-text">
              {isSignup ? "Welcome Back!" : "Digital Services"}
            </h1>
            <p className="welcome-subtitle">
              Unified platform for citizens, admins & providers
            </p>

            <div className="demo-credentials">
              <h3>Demo Credentials</h3>
              {Object.entries(DEMO_USERS).map(([r, u]) => (
                <div key={r} className="credential-item">
                  <FaUser className="credential-icon" />
                  <div>
                    <strong>{r.toUpperCase()}</strong>
                    <span>Username: {u.username}</span>
                    <span>Password: {u.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIGN UP PANEL */}
        <div className="auth-panel sign-in-panel">
          <div className="auth-header">
            <FaShieldAlt className="auth-icon" />
            <h2>Create Account</h2>
            <p className="auth-subtitle">Sign up to access all services</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="input-group">
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="citizen">Citizen</option>
                <option value="admin">Admin</option>
                <option value="provider">Provider</option>
              </select>
            </div>

            {/* VERIFY */}
            <div className="verify-section">
              <label className="verify-toggle">
                <input
                  type="checkbox"
                  checked={verify}
                  onChange={(e) => {
                    setVerify(e.target.checked);
                    setVerifyMethod(null);
                    setOtp("");
                    setEmail("");
                  }}
                />
                <span className="checkmark"></span>
                <span className="verify-label">
                  Enable Two-Factor Verification
                </span>
              </label>

              {verify && (
                <div className="verify-options">
                  <div className="verify-buttons">
                    <button
                      type="button"
                      className={`verify-btn ${
                        verifyMethod === "otp" ? "active" : ""
                      }`}
                      onClick={() => setVerifyMethod("otp")}
                    >
                      <FaMobileAlt /> OTP
                    </button>
                    <button
                      type="button"
                      className={`verify-btn ${
                        verifyMethod === "mail" ? "active" : ""
                      }`}
                      onClick={() => setVerifyMethod("mail")}
                    >
                      <FaEnvelope /> Email
                    </button>
                  </div>

                  {verifyMethod === "otp" && (
                    <div className="input-group">
                      <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {verifyMethod === "mail" && (
                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="auth-btn primary-btn">
              Create Account
            </button>

            <p className="switch-text">
              Already have an account?
              <span onClick={() => setIsSignup(true)}> Login</span>
            </p>
          </form>
        </div>

        {/* LOGIN PANEL */}
        <div className="auth-panel sign-up-panel">
          <div className="auth-header">
            <FaShieldAlt className="auth-icon" />
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Login to your account</p>
          </div>

          <form className="auth-form">
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
            </div>

            <button
              type="button"
              className="auth-btn primary-btn"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="switch-text">
              Don’t have an account?
              <span onClick={() => setIsSignup(false)}> Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
