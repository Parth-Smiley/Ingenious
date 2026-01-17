import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaPaperPlane,
  FaHistory,
  FaBell,
  FaUserCircle,
  FaTools,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSun,
  FaMoon,
  FaCity,
  FaLeaf,
  FaHospital,
} from "react-icons/fa";

import "../../styles/citizen/CitizenDashboard.css";

function CitizenDashboard({ user }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("submit");
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [requests] = useState([
    { id: 1, title: "Healthcare Appointment", status: "completed" },
    { id: 2, title: "Municipal Complaint", status: "in-progress" },
    { id: 3, title: "Agriculture Subsidy", status: "pending" },
  ]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => navigate("/");

  const handleSubmit = () => {
    if (!message.trim()) return alert("Enter a request");
    alert("Request submitted (demo)");
    setMessage("");
  };

  const statusIcon = (status) => {
    if (status === "completed") return <FaCheckCircle />;
    if (status === "in-progress") return <FaClock />;
    return <FaExclamationTriangle />;
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <FaUserCircle className="user-avatar" />
            <div className="user-info">
              <h3>{user?.username || "Citizen"}</h3>
              <span className="user-role">Citizen Account</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === "submit" ? "active" : ""}`} onClick={() => setActiveTab("submit")}>
            <FaPaperPlane /> Submit Request
          </button>

          <button className={`nav-item ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
            <FaHistory /> Request History
          </button>

          <button className={`nav-item ${activeTab === "services" ? "active" : ""}`} onClick={() => setActiveTab("services")}>
            <FaTools /> Services
          </button>

          <button className={`nav-item ${activeTab === "alerts" ? "active" : ""}`} onClick={() => setActiveTab("alerts")}>
            <FaBell /> Alerts
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Citizen Dashboard</h1>
            <p className="welcome-text">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          <div className="header-right">
            <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* SUBMIT TAB */}
          {activeTab === "submit" && (
            <div className="content-card">
              <div className="card-header">
                <h2><FaPaperPlane /> Submit New Request</h2>
                <p>Describe your issue or request for government services</p>
              </div>

              <textarea
                className="form-textarea"
                placeholder="✏️ Type your request here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Request
                </button>
                <button className="btn btn-secondary" onClick={() => setMessage("")}>
                  Clear Form
                </button>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="content-card">
              <div className="card-header">
                <h2><FaHistory /> Request History</h2>
              </div>

              <div className="requests-list">
                {requests.map((r) => (
                  <div key={r.id} className="request-item">
                    <div className="request-header">
                      <h4>{r.title}</h4>
                      {statusIcon(r.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === "services" && (
            <div className="content-card">
              <div className="card-header">
                <h2><FaTools /> Available Services</h2>
              </div>

              <div className="services-grid">
                <div className="service-card">
                  <div className="service-icon"><FaCity /></div>
                  <h4>City Service</h4>
                  <p>Municipal complaints, utilities, licenses</p>
                  <button className="service-btn">Access</button>
                </div>

                <div className="service-card">
                  <div className="service-icon"><FaLeaf /></div>
                  <h4>Agri Service</h4>
                  <p>Subsidies, crop info, farmer schemes</p>
                  <button className="service-btn">Access</button>
                </div>

                <div className="service-card">
                  <div className="service-icon"><FaHospital /></div>
                  <h4>Health Service</h4>
                  <p>Appointments, health records</p>
                  <button className="service-btn">Access</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CitizenDashboard;
