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
  FaNetworkWired
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import "../../styles/admin/AdminDashboard.css";

function AdminDashboard({ onLogout }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getTabFromRoute = () => {
    const path = location.pathname.split("/").pop();
    return ["services", "analytics", "logs", "settings"].includes(path)
      ? path
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
      // Keep sample data if API fails
    } finally {
      setLogsLoading(false);
    }
  };

  const processLogsForCharts = (logsData) => {
    // This is a sample implementation - adjust based on your log structure
    if (logsData && logsData.length > 0) {
      // Process for requests chart
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

      // Process for error chart
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
        
        // Calculate success rate
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
    fetchLogs(); // Load logs on initial mount
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

  const stats = {
    totalServices: services.length,
    enabledServices: services.filter(s => s.is_enabled).length,
    disabledServices: services.filter(s => !s.is_enabled).length,
    totalLogs: logs.length,
    errorLogs: logs.filter(log => log.level === 'ERROR' || log.status >= 400).length,
    totalRequests: requestsChartData.reduce((sum, item) => sum + item.requests, 0),
    avgResponseTime: Math.round(requestsChartData.reduce((sum, item) => sum + item.responseTime, 0) / requestsChartData.length),
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
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => changeTab("analytics")}
          >
            <FaChartLine className="nav-icon" />
            <span>System Analytics</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => changeTab("logs")}
          >
            <FaHistory className="nav-icon" />
            <span>Raw Logs</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => changeTab("settings")}
          >
            <FaCog className="nav-icon" />
            <span>System Settings</span>
          </button>
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
              {activeTab === "analytics" && "System Analytics"}
              {activeTab === "logs" && "System Logs"}
              {activeTab === "settings" && "System Settings"}
            </h1>
            <p className="welcome-text">
              {activeTab === "services" && "Monitor and control all system services"}
              {activeTab === "analytics" && "View system performance and analytics"}
              {activeTab === "logs" && "Monitor system activity and debug issues"}
              {activeTab === "settings" && "Configure system parameters and preferences"}
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
                <span className="stat-number">{stats.totalLogs}</span>
                <span className="stat-label">Total Logs</span>
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

          {activeTab === "analytics" && (
            <div className="content-card system-analytics">
              <div className="card-header">
                <h2><FaChartLine /> System Analytics</h2>
                <p>Monitor system performance and request patterns</p>
              </div>

              {/* System Overview Stats */}
              <div className="analytics-overview">
                <div className="analytics-stat-card">
                  <FaNetworkWired className="stat-icon" />
                  <div>
                    <h3>Total Requests</h3>
                    <p className="stat-value">{stats.totalRequests.toLocaleString()}</p>
                  </div>
                </div>
                <div className="analytics-stat-card">
                  <FaClock className="stat-icon" />
                  <div>
                    <h3>Avg Response Time</h3>
                    <p className="stat-value">{stats.avgResponseTime}ms</p>
                  </div>
                </div>
                <div className="analytics-stat-card">
                  <FaUsers className="stat-icon" />
                  <div>
                    <h3>Peak Users</h3>
                    <p className="stat-value">{Math.max(...requestsChartData.map(d => d.users))}</p>
                  </div>
                </div>
                <div className="analytics-stat-card">
                  <FaDatabase className="stat-icon" />
                  <div>
                    <h3>System Uptime</h3>
                    <p className="stat-value">99.95%</p>
                  </div>
                </div>
              </div>

              {/* Requests and Users Chart */}
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Requests & Concurrent Users</h3>
                  <span className="chart-period">Last 24 Hours</span>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={requestsChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="var(--text-secondary)"
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="var(--text-secondary)"
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="var(--text-secondary)"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card-bg)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        yAxisId="left"
                        type="monotone"
                        dataKey="requests"
                        name="Total Requests"
                        stroke="#2563eb"
                        fill="rgba(37, 99, 235, 0.1)"
                        strokeWidth={2}
                      />
                      <Area 
                        yAxisId="right"
                        type="monotone"
                        dataKey="users"
                        name="Concurrent Users"
                        stroke="#10b981"
                        fill="rgba(16, 185, 129, 0.1)"
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone"
                        dataKey="responseTime"
                        name="Response Time (ms)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Error Rate and Success Rate Chart */}
              <div className="chart-container">
                <div className="chart-header">
                  <h3>Error Rate & Success Rate</h3>
                  <span className="chart-period">Last 24 Hours</span>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={errorChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="var(--text-secondary)"
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        label={{ value: 'Errors', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        domain={[0, 100]}
                        label={{ value: 'Success Rate %', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card-bg)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => {
                          if (name === 'successRate') return [`${value}%`, 'Success Rate'];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone"
                        dataKey="errors"
                        name="Errors"
                        stroke="#ef4444"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        dot={{ r: 3 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone"
                        dataKey="successRate"
                        name="Success Rate"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="performance-metrics">
                <h3>Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>API Latency</h4>
                    <div className="metric-value">145ms</div>
                    <div className="metric-trend positive">
                      <span>↓ 8% from yesterday</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <h4>CPU Usage</h4>
                    <div className="metric-value">42%</div>
                    <div className="metric-trend neutral">
                      <span>↔ Stable</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <h4>Memory Usage</h4>
                    <div className="metric-value">68%</div>
                    <div className="metric-trend warning">
                      <span>↑ 12% from yesterday</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <h4>Database Queries</h4>
                    <div className="metric-value">1.2k/sec</div>
                    <div className="metric-trend positive">
                      <span>↓ 5% from peak</span>
                    </div>
                  </div>
                </div>
              </div>
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

          {activeTab === "settings" && (
            <div className="content-card system-settings">
              <div className="card-header">
                <h2><FaCog /> System Settings</h2>
                <p>Configure system parameters and preferences</p>
              </div>

              <div className="settings-grid">
                <div className="setting-card">
                  <h4>System Maintenance</h4>
                  <p>Enable maintenance mode for system updates</p>
                  <div className="setting-control">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                    <span className="setting-status">Maintenance Mode: OFF</span>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Auto Backup</h4>
                  <p>Schedule automatic database backups</p>
                  <div className="setting-control">
                    <select className="form-select">
                      <option value="daily">Daily at 2:00 AM</option>
                      <option value="weekly">Weekly on Sunday</option>
                      <option value="monthly">Monthly on 1st</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Log Retention</h4>
                  <p>How long to keep system logs</p>
                  <div className="setting-control">
                    <select className="form-select">
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>API Rate Limiting</h4>
                  <p>Requests per minute per user</p>
                  <div className="setting-control">
                    <input 
                      type="number" 
                      className="form-input" 
                      defaultValue="100" 
                      min="10" 
                      max="1000" 
                    />
                    <span className="setting-unit">requests/min</span>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Alert Notifications</h4>
                  <p>Receive alerts for system issues</p>
                  <div className="setting-control">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                    <span className="setting-status">Alerts: ON</span>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Data Analytics</h4>
                  <p>Collect usage analytics for improvements</p>
                  <div className="setting-control">
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                    <span className="setting-status">Analytics: ON</span>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary">
                  <FaCog /> Save Settings
                </button>
                <button className="btn btn-secondary">
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;