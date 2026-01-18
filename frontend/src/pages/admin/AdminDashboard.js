import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaCog, 
  FaToggleOn, 
  FaToggleOff, 
  FaServer, 
  FaChartLine, 
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUserShield,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSun,
  FaMoon,
  FaArrowRight,
  FaUsers,
  FaDatabase,
  FaClock,
  FaNetworkWired,
  FaHourglassHalf,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getTabFromRoute = () => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];

    return ["services", "requests", "logs"].includes(last)
      ? last
      : "services";
  };


  const [activeTab, setActiveTab] = useState(getTabFromRoute());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromRoute());
  }, [location.pathname]);

  // Change tab and update URL
  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEnabled, setFilterEnabled] = useState("all");

  // Sample data for line charts
  const [requestsChartData, setRequestsChartData] = useState([
    { time: '00:00', requests: 120, users: 45, responseTime: 180 },
    { time: '02:00', requests: 180, users: 60, responseTime: 165 },
    { time: '04:00', requests: 90, users: 30, responseTime: 210 },
    { time: '06:00', requests: 250, users: 85, responseTime: 195 },
    { time: '08:00', requests: 450, users: 150, responseTime: 175 },
    { time: '10:00', requests: 600, users: 200, responseTime: 160 },
    { time: '12:00', requests: 750, users: 250, responseTime: 155 },
    { time: '14:00', requests: 800, users: 280, responseTime: 165 },
    { time: '16:00', requests: 650, users: 220, responseTime: 175 },
    { time: '18:00', requests: 500, users: 180, responseTime: 185 },
    { time: '20:00', requests: 350, users: 120, responseTime: 195 },
    { time: '22:00', requests: 200, users: 75, responseTime: 205 },
  ]);

  const [errorChartData, setErrorChartData] = useState([
    { time: '00:00', errors: 12, successRate: 90.0 },
    { time: '02:00', errors: 8, successRate: 95.6 },
    { time: '04:00', errors: 5, successRate: 94.4 },
    { time: '06:00', errors: 15, successRate: 94.0 },
    { time: '08:00', errors: 20, successRate: 95.6 },
    { time: '10:00', errors: 25, successRate: 95.8 },
    { time: '12:00', errors: 30, successRate: 96.0 },
    { time: '14:00', errors: 35, successRate: 95.6 },
    { time: '16:00', errors: 28, successRate: 95.7 },
    { time: '18:00', errors: 22, successRate: 95.6 },
    { time: '20:00', errors: 18, successRate: 94.9 },
    { time: '22:00', errors: 10, successRate: 95.0 },
  ]);

  // Fetch service requests
  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:9000/admin/service-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : data.requests || []);

    } catch (error) {
      console.error("Error fetching service requests:", error);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Handle decision for service requests
  const handleDecision = async (id, action) => {
  const url =
    action === "approve"
      ? `http://127.0.0.1:9000/registry/service-requests/${id}/approve`
      : `http://127.0.0.1:9000/admin/service-requests/${id}/reject`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchRequests();
    fetchServices();
  } catch (error) {
    console.error(`Error ${action}ing request:`, error);
  }
};

  // Approve request
  const approve = async (id) => {
    await fetch(
      `http://127.0.0.1:9000/registry/service-requests/${id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchRequests();
    fetchServices();
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:9000/admin/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLogs(data.logs || data);
      
      // Process logs for charts
      processLogsForCharts(data.logs || data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  const processLogsForCharts = (logsData) => {
    if (logsData && logsData.length > 0) {
      const hourlyRequests = {};
      logsData.forEach(log => {
        const hour = new Date(log.timestamp || Date.now()).getHours();
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        
        if (!hourlyRequests[timeKey]) {
          hourlyRequests[timeKey] = { 
            time: timeKey, 
            requests: 0, 
            users: Math.floor(Math.random() * 50) + 20,
            responseTime: Math.floor(Math.random() * 100) + 150
          };
        }
        
        hourlyRequests[timeKey].requests += 1;
      });
      
      const requestsData = Object.values(hourlyRequests).sort((a, b) => 
        a.time.localeCompare(b.time)
      );
      
      setRequestsChartData(requestsData);

      const hourlyErrors = {};
      logsData.forEach(log => {
        const hour = new Date(log.timestamp || Date.now()).getHours();
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        
        if (!hourlyErrors[timeKey]) {
          hourlyErrors[timeKey] = { 
            time: timeKey, 
            errors: 0, 
            successRate: 95.0
          };
        }
        
        if (log.level === 'ERROR' || log.status >= 400) {
          hourlyErrors[timeKey].errors += 1;
        }
        
        const totalRequests = hourlyRequests[timeKey]?.requests || 1;
        const errors = hourlyErrors[timeKey].errors;
        hourlyErrors[timeKey].successRate = ((totalRequests - errors) / totalRequests * 100).toFixed(1);
      });
      
      const errorsData = Object.values(hourlyErrors).sort((a, b) => 
        a.time.localeCompare(b.time)
      );
      
      setErrorChartData(errorsData);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:9000/registry/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setServices(data.services || data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (serviceId, isEnabled) => {
    const action = isEnabled ? "disable" : "enable";

    try {
      await fetch(
        `http://127.0.0.1:9000/registry/services/${serviceId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchServices(); // refresh list
    } catch (error) {
      console.error("Error toggling service:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchLogs();
    fetchRequests();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === "" || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterEnabled === "all" || 
      (filterEnabled === "enabled" && service.is_enabled) ||
      (filterEnabled === "disabled" && !service.is_enabled);
    
    return matchesSearch && matchesStatus;
  });

  const safeRequests = Array.isArray(requests) ? requests : [];

const pendingRequests = safeRequests.filter(
  r => r.status === "PENDING" || r.status === "pending"
);

const approvedRequests = safeRequests.filter(
  r => r.status === "APPROVED" || r.status === "approved"
);

const rejectedRequests = safeRequests.filter(
  r => r.status === "REJECTED" || r.status === "rejected"
);


  const stats = {
    totalServices: services.length,
    enabledServices: services.filter(s => s.is_enabled).length,
    disabledServices: services.filter(s => !s.is_enabled).length,
    totalLogs: logs.length,
    errorLogs: logs.filter(log => log.level === 'ERROR' || log.status >= 400).length,
    totalRequests: requestsChartData.reduce((sum, item) => sum + item.requests, 0),
    avgResponseTime: Math.round(requestsChartData.reduce((sum, item) => sum + item.responseTime, 0) / requestsChartData.length),
    pendingRequests: pendingRequests.length,
    approvedRequests: approvedRequests.length,
    rejectedRequests: rejectedRequests.length,
  };

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-profile">
            <FaUserShield className="admin-avatar" />
            <div className="admin-info">
              <h3>Administrator</h3>
              <span className="admin-role">System Admin</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => changeTab("services")}
          >
            <FaServer className="nav-icon" />
            <span>Services Management</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => changeTab("requests")}
          >
            <FaHourglassHalf className="nav-icon" />
            <span>Service Requests</span>
            {stats.pendingRequests > 0 && (
              <span className="notification-count">{stats.pendingRequests}</span>
            )}
          </button>
          
          <button 
            className={`nav-item ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => changeTab("logs")}
          >
            <FaHistory className="nav-icon" />
            <span>Raw Logs</span>
          </button>
          
          {/* REMOVED System Settings Button */}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <h1>
              {activeTab === "services" && "Services Management"}
              {activeTab === "requests" && "Service Requests"}
              {activeTab === "logs" && "System Logs"}
              {/* REMOVED settings header */}
            </h1>
            <p className="welcome-text">
              {activeTab === "services" && "Monitor and control all system services"}
              {activeTab === "requests" && "Review and manage service registration requests"}
              {activeTab === "logs" && "Monitor system activity and debug issues"}
              {/* REMOVED settings welcome text */}
            </p>
          </div>
          
          <div className="header-right">
            <button 
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
            </button>
            
            <div className="quick-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalServices}</span>
                <span className="stat-label">Total Services</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.enabledServices}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.pendingRequests}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="admin-content">
          {activeTab === "services" && (
            <div className="content-card services-management">
              <div className="card-header">
                <h2><FaServer /> Services Management</h2>
                <p>Monitor and control all system services</p>
              </div>

              {/* Stats Overview */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon enabled">
                    <FaToggleOn />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.enabledServices}</h3>
                    <p>Enabled Services</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon disabled">
                    <FaToggleOff />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.disabledServices}</h3>
                    <p>Disabled Services</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon total">
                    <FaServer />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalServices}</h3>
                    <p>Total Services</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="filters-bar">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="filter-options">
                  <button 
                    className={`filter-btn ${filterEnabled === "all" ? "active" : ""}`}
                    onClick={() => setFilterEnabled("all")}
                  >
                    All Services
                  </button>
                  <button 
                    className={`filter-btn ${filterEnabled === "enabled" ? "active" : ""}`}
                    onClick={() => setFilterEnabled("enabled")}
                  >
                    <FaEye /> Enabled
                  </button>
                  <button 
                    className={`filter-btn ${filterEnabled === "disabled" ? "active" : ""}`}
                    onClick={() => setFilterEnabled("disabled")}
                  >
                    <FaEyeSlash /> Disabled
                  </button>
                </div>
              </div>

              {/* Services Table */}
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading services...</p>
                </div>
              ) : (
                <div className="services-table-container">
                  <table className="services-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr key={service.id}>
                          <td className="service-id">{service.id}</td>
                          <td className="service-name">
                            <div className="service-name-content">
                              <div className="service-icon">
                                <FaServer />
                              </div>
                              <div>
                                <strong>{service.name}</strong>
                                <small>Service ID: {service.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="service-domain">
                            <a 
                              href={`http://${service.domain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="domain-link"
                            >
                              {service.domain}
                            </a>
                          </td>
                          <td>
                            <span className={`status-badge ${service.is_enabled ? "enabled" : "disabled"}`}>
                              {service.is_enabled ? (
                                <>
                                  <FaCheckCircle /> ENABLED
                                </>
                              ) : (
                                <>
                                  <FaTimesCircle /> DISABLED
                                </>
                              )}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`toggle-btn ${service.is_enabled ? "disable" : "enable"}`}
                              onClick={() => toggleService(service.id, service.is_enabled)}
                            >
                              {service.is_enabled ? (
                                <>
                                  <FaToggleOff /> Disable
                                </>
                              ) : (
                                <>
                                  <FaToggleOn /> Enable
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredServices.length === 0 && (
                    <div className="no-results">
                      <p>No services found matching your criteria</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="content-card service-requests">
              <div className="card-header">
                <h2><FaHourglassHalf /> Service Requests</h2>
                <p>Review and manage service registration requests from providers</p>
              </div>

              {/* Requests Stats */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <FaHourglassHalf />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.pendingRequests}</h3>
                    <p>Pending Requests</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon enabled">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.approvedRequests}</h3>
                    <p>Approved</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon disabled">
                    <FaTimesCircle />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.rejectedRequests}</h3>
                    <p>Rejected</p>
                  </div>
                </div>
              </div>

              {/* Pending Requests Table */}
              <div className="section-header">
                <h3><FaHourglassHalf /> Pending Requests ({pendingRequests.length})</h3>
                <button 
                  className="btn btn-outline"
                  onClick={fetchRequests}
                  disabled={requestsLoading}
                >
                  <FaDownload /> Refresh
                </button>
              </div>

              {requestsLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading requests...</p>
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="requests-table-container">
                  <table className="services-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Domain</th>
                        <th>Base URL</th>
                        <th>Endpoint</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="service-id">{request.id}</td>
                          <td className="service-name">
                            <div className="service-name-content">
                              <div className="service-icon">
                                <FaServer />
                              </div>
                              <div>
                                <strong>{request.name}</strong>
                                <small>Request ID: {request.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="domain-badge">
                              {request.domain}
                            </span>
                          </td>
                          <td>
                            <code className="url-code">{request.base_url}</code>
                          </td>
                          <td>
                            <code className="url-code">{request.endpoint_path}</code>
                          </td>
                          <td>
                            <div className="request-actions">
                              <button
                                className="btn btn-primary btn-small"
                                onClick={() => handleDecision(request.id, "approve")}
                                title="Approve Request"
                              >
                                <FaCheck /> Approve
                              </button>
                              <button
                                className="btn btn-secondary btn-small"
                                onClick={() => handleDecision(request.id, "reject")}
                                title="Reject Request"
                              >
                                <FaTimes /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-results">
                  <FaHourglassHalf className="no-results-icon" />
                  <h3>No Pending Requests</h3>
                  <p>All service requests have been processed.</p>
                </div>
              )}

              {/* Approved/Rejected Requests */}
              {(approvedRequests.length > 0 || rejectedRequests.length > 0) && (
                <div className="processed-requests">
                  <div className="section-header">
                    <h3>Processed Requests</h3>
                  </div>
                  
                  <div className="requests-tabs">
                    <button className="filter-btn active">Approved ({approvedRequests.length})</button>
                    <button className="filter-btn">Rejected ({rejectedRequests.length})</button>
                  </div>

                  <div className="requests-table-container">
                    <table className="services-table">
                      <thead>
                        <tr>
                          <th>Service Name</th>
                          <th>Domain</th>
                          <th>Status</th>
                          <th>Date Processed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedRequests.slice(0, 5).map((request) => (
                          <tr key={request.id}>
                            <td className="service-name">
                              <div className="service-name-content">
                                <div className="service-icon approved">
                                  <FaCheckCircle />
                                </div>
                                <div>
                                  <strong>{request.name}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="domain-badge">
                                {request.domain}
                              </span>
                            </td>
                            <td>
                              <span className="status-badge approved">
                                <FaCheckCircle /> APPROVED
                              </span>
                            </td>
                            <td>
                              {new Date(request.updated_at || request.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "logs" && (
            <div className="content-card raw-logs">
              <div className="card-header">
                <h2><FaHistory /> System Logs</h2>
                <p>Monitor system activity and debug issues</p>
              </div>

              <div className="logs-controls">
                <button 
                  className="btn btn-primary"
                  onClick={fetchLogs}
                  disabled={logsLoading}
                >
                  {logsLoading ? (
                    <>
                      <span className="spinner"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Refresh Logs
                    </>
                  )}
                </button>
                
                <div className="log-filters">
                  <button className="filter-btn active">All Logs</button>
                  <button className="filter-btn">Errors Only</button>
                  <button className="filter-btn">Warnings</button>
                  <button className="filter-btn">Last Hour</button>
                </div>
              </div>

              <div className="logs-container">
                {logs.length > 0 ? (
                  <div className="logs-list">
                    {logs.slice(0, 50).map((log, index) => (
                      <div key={index} className={`log-item ${log.level === 'ERROR' ? 'error' : log.level === 'WARN' ? 'warning' : ''}`}>
                        <div className="log-header">
                          <span className="log-timestamp">
                            {new Date(log.timestamp || Date.now()).toLocaleString()}
                          </span>
                          <span className={`log-level ${log.level?.toLowerCase() || 'info'}`}>
                            {log.level || 'INFO'}
                          </span>
                          <span className="log-service">
                            {log.service || 'System'}
                          </span>
                        </div>
                        <div className="log-message">
                          {log.message || JSON.stringify(log, null, 2)}
                        </div>
                        {log.details && (
                          <div className="log-details">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-logs">
                    <p>No logs available. Click "Refresh Logs" to load system logs.</p>
                  </div>
                )}
              </div>

              <div className="logs-info">
                <div className="logs-summary">
                  <span>Total: {logs.length} logs</span>
                  <span>Errors: {stats.errorLogs}</span>
                  <span>Warnings: {logs.filter(l => l.level === 'WARN').length}</span>
                </div>
                <button className="btn btn-outline">
                  <FaDownload /> Export All Logs
                </button>
              </div>
            </div>
          )}

          {/* REMOVED Settings Tab Content */}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;