import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaPlusCircle, 
  FaServer, 
  FaGlobe, 
  FaLink, 
  FaRoute,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaUserTie,
  FaSun,
  FaMoon,
  FaArrowRight,
  FaEye,
  FaCloudUploadAlt,
  FaList,
  FaCog,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import "../../styles/provider/ProviderDashboard.css";

function ProviderDashboard({ onLogout }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from URL
  const getTabFromRoute = () => {
    const path = location.pathname.split("/").pop();
    return ["register", "services", "analytics", "settings"].includes(path)
      ? path
      : "register";
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
    navigate(`/provider/${tab}`);
  };

  // Service Registration State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("city");
  const [baseUrl, setBaseUrl] = useState("");
  const [endpointPath, setEndpointPath] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredServices, setRegisteredServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Sample data for services
  const [services, setServices] = useState([
    { id: 1, name: "City Complaint Service", domain: "city", status: "approved", date: "2024-01-15" },
    { id: 2, name: "Health Appointment System", domain: "health", status: "pending", date: "2024-01-10" },
    { id: 3, name: "Agriculture Advisory", domain: "agriculture", status: "rejected", date: "2024-01-05" },
  ]);

  // Domain options
  const domainOptions = [
    { value: "city", label: "City Services", icon: <FaGlobe />, description: "Municipal services and utilities" },
    { value: "health", label: "Healthcare", icon: <FaPlusCircle />, description: "Medical and health services" },
    { value: "agriculture", label: "Agriculture", icon: <FaRoute />, description: "Farming and agricultural services" },
    { value: "education", label: "Education", icon: <FaServer />, description: "Educational institutions" },
    { value: "transport", label: "Transport", icon: <FaLink />, description: "Transportation services" },
    { value: "finance", label: "Finance", icon: <FaCog />, description: "Financial services" },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    fetchRegisteredServices();
  }, [isDarkMode]);

  const fetchRegisteredServices = async () => {
    setLoadingServices(true);
    try {
      // This would be your actual API call
      // const res = await fetch("http://127.0.0.1:9000/registry/provider/services", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // const data = await res.json();
      // setRegisteredServices(data);
      
      // For now, use sample data
      setTimeout(() => {
        setRegisteredServices(services);
        setLoadingServices(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoadingServices(false);
    }
  };

  const registerService = async () => {
    if (!name.trim() || !baseUrl.trim() || !endpointPath.trim()) {
      setMessage("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:9000/registry/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          domain: domain,
          base_url: baseUrl,
          endpoint_path: endpointPath,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setMessage("✅ Service request submitted successfully! Pending admin approval.");
      
      // Add to local list
      const newService = {
        id: services.length + 1,
        name: name,
        domain: domain,
        status: "pending",
        date: new Date().toISOString().split('T')[0],
        base_url: baseUrl,
        endpoint_path: endpointPath
      };
      
      setServices([newService, ...services]);
      setRegisteredServices([newService, ...registeredServices]);
      
      // Reset form
      setName("");
      setBaseUrl("");
      setEndpointPath("");
      setDomain("city");
      
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
      case 'pending': return <span className="status-badge pending"><FaClock /> Pending</span>;
      case 'rejected': return <span className="status-badge rejected"><FaExclamationTriangle /> Rejected</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const getDomainIcon = (domainValue) => {
    const domainOption = domainOptions.find(d => d.value === domainValue);
    return domainOption ? domainOption.icon : <FaServer />;
  };

  const stats = {
    totalServices: services.length,
    approvedServices: services.filter(s => s.status === 'approved').length,
    pendingServices: services.filter(s => s.status === 'pending').length,
    rejectedServices: services.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className={`provider-dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <aside className="provider-sidebar">
        <div className="sidebar-header">
          <div className="provider-profile">
            <FaUserTie className="provider-avatar" />
            <div className="provider-info">
              <h3>Service Provider</h3>
              <span className="provider-role">Registered Provider</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "register" ? "active" : ""}`}
            onClick={() => changeTab("register")}
          >
            <FaPlusCircle className="nav-icon" />
            <span>Register Service</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "services" ? "active" : ""}`}
            onClick={() => changeTab("services")}
          >
            <FaList className="nav-icon" />
            <span>My Services</span>
            <span className="notification-count">{services.length}</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => changeTab("analytics")}
          >
            <FaCloudUploadAlt className="nav-icon" />
            <span>Service Analytics</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => changeTab("settings")}
          >
            <FaCog className="nav-icon" />
            <span>Provider Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="provider-main">
        {/* Header */}
        <header className="provider-header">
          <div className="header-left">
            <h1>
              {activeTab === "register" && "Register New Service"}
              {activeTab === "services" && "My Services"}
              {activeTab === "analytics" && "Service Analytics"}
              {activeTab === "settings" && "Provider Settings"}
            </h1>
            <p className="welcome-text">
              {activeTab === "register" && "Add your service to the digital platform for citizen access"}
              {activeTab === "services" && "Track the status of all your service registrations"}
              {activeTab === "analytics" && "Monitor your service performance and usage metrics"}
              {activeTab === "settings" && "Configure your provider account and preferences"}
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
                <span className="stat-number">{stats.approvedServices}</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.pendingServices}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="provider-content">
          {activeTab === "register" && (
            <div className="content-card register-service">
              <div className="card-header">
                <h2><FaPlusCircle /> Register New Service</h2>
                <p>Add your service to the digital platform for citizen access</p>
              </div>

              {/* Stats Overview */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-icon total">
                    <FaServer />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalServices}</h3>
                    <p>Total Registered</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon approved">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.approvedServices}</h3>
                    <p>Approved Services</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon pending">
                    <FaClock />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.pendingServices}</h3>
                    <p>Pending Approval</p>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="registration-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="service-name">
                      <FaServer className="input-icon" />
                      Service Name *
                    </label>
                    <input
                      id="service-name"
                      type="text"
                      placeholder="Enter your service name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                    />
                    <div className="input-hint">A descriptive name for your service</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="service-domain">
                      <FaGlobe className="input-icon" />
                      Service Domain *
                    </label>
                    <div className="domain-options">
                      {domainOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`domain-option ${domain === option.value ? "selected" : ""}`}
                          onClick={() => setDomain(option.value)}
                        >
                          <div className="domain-icon">{option.icon}</div>
                          <div className="domain-info">
                            <strong>{option.label}</strong>
                            <small>{option.description}</small>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="base-url">
                      <FaLink className="input-icon" />
                      Base URL *
                    </label>
                    <input
                      id="base-url"
                      type="text"
                      placeholder="http://127.0.0.1:9004 or https://api.example.com"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      className="form-input"
                    />
                    <div className="input-hint">The base URL where your service is hosted</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="endpoint-path">
                      <FaRoute className="input-icon" />
                      Endpoint Path *
                    </label>
                    <input
                      id="endpoint-path"
                      type="text"
                      placeholder="/city/request or /api/v1/service"
                      value={endpointPath}
                      onChange={(e) => setEndpointPath(e.target.value)}
                      className="form-input"
                    />
                    <div className="input-hint">The API endpoint path for service requests</div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={registerService}
                    disabled={loading || !name.trim() || !baseUrl.trim() || !endpointPath.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Service <FaArrowRight className="btn-icon" />
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setName("");
                      setBaseUrl("");
                      setEndpointPath("");
                      setDomain("city");
                      setMessage("");
                    }}
                    disabled={!name.trim() && !baseUrl.trim() && !endpointPath.trim()}
                  >
                    Clear Form
                  </button>
                </div>

                {message && (
                  <div className={`message-alert ${message.includes("✅") ? "success" : "error"}`}>
                    <div className="alert-content">
                      {message.includes("✅") ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      <span>{message}</span>
                    </div>
                  </div>
                )}

                <div className="form-info">
                  <FaInfoCircle className="info-icon" />
                  <p>
                    After submission, your service will be reviewed by the admin team. 
                    You'll be notified once it's approved or if any changes are required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="content-card my-services">
              <div className="card-header">
                <h2><FaList /> My Registered Services</h2>
                <p>Track the status of all your service registrations</p>
              </div>

              {/* Filters */}
              <div className="filters-bar">
                <div className="filter-options">
                  <button className="filter-btn active">All Services</button>
                  <button className="filter-btn"><FaCheckCircle /> Approved</button>
                  <button className="filter-btn"><FaClock /> Pending</button>
                  <button className="filter-btn"><FaExclamationTriangle /> Rejected</button>
                </div>
                
                <button 
                  className="btn btn-outline"
                  onClick={fetchRegisteredServices}
                  disabled={loadingServices}
                >
                  <FaHistory /> Refresh
                </button>
              </div>

              {/* Services List */}
              {loadingServices ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading services...</p>
                </div>
              ) : (
                <div className="services-list">
                  {registeredServices.length > 0 ? (
                    registeredServices.map((service) => (
                      <div key={service.id} className="service-item">
                        <div className="service-header">
                          <div className="service-icon">
                            {getDomainIcon(service.domain)}
                          </div>
                          <div className="service-info">
                            <h4>{service.name}</h4>
                            <div className="service-meta">
                              <span className="service-domain">{service.domain.toUpperCase()}</span>
                              <span className="service-date"><FaClock /> {service.date}</span>
                            </div>
                          </div>
                          <div className="service-status">
                            {getStatusBadge(service.status)}
                          </div>
                        </div>
                        
                        <div className="service-details">
                          <div className="detail-item">
                            <span className="detail-label">Base URL:</span>
                            <code className="detail-value">{service.base_url || "Not specified"}</code>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Endpoint Path:</span>
                            <code className="detail-value">{service.endpoint_path || "Not specified"}</code>
                          </div>
                        </div>
                        
                        <div className="service-actions">
                          <button className="action-btn view-btn">
                            <FaEye /> View Details
                          </button>
                          {service.status === "rejected" && (
                            <button className="action-btn edit-btn">
                              Edit & Resubmit
                            </button>
                          )}
                          {service.status === "pending" && (
                            <button className="action-btn cancel-btn">
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-services">
                      <FaServer className="no-services-icon" />
                      <h3>No Services Registered</h3>
                      <p>You haven't registered any services yet. Start by registering your first service.</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => changeTab("register")}
                      >
                        <FaPlusCircle /> Register First Service
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Services Stats */}
              <div className="services-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.approvedServices}</span>
                  <span className="stat-label">Live Services</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.pendingServices}</span>
                  <span className="stat-label">In Review</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.totalServices}</span>
                  <span className="stat-label">Total Submitted</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="content-card service-analytics">
              <div className="card-header">
                <h2><FaCloudUploadAlt /> Service Analytics</h2>
                <p>Monitor your service performance and usage metrics</p>
              </div>

              {/* Analytics Overview */}
              <div className="analytics-overview">
                <div className="analytics-stat-card">
                  <div className="stat-icon">
                    <FaServer />
                  </div>
                  <div className="stat-content">
                    <h3>Total Requests</h3>
                    <p className="stat-value">12,847</p>
                    <div className="stat-trend positive">↑ 24% this month</div>
                  </div>
                </div>
                
                <div className="analytics-stat-card">
                  <div className="stat-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="stat-content">
                    <h3>Success Rate</h3>
                    <p className="stat-value">98.7%</p>
                    <div className="stat-trend positive">↑ 1.2% from last month</div>
                  </div>
                </div>
                
                <div className="analytics-stat-card">
                  <div className="stat-icon">
                    <FaClock />
                  </div>
                  <div className="stat-content">
                    <h3>Avg Response Time</h3>
                    <p className="stat-value">245ms</p>
                    <div className="stat-trend negative">↓ 15% faster</div>
                  </div>
                </div>
                
                <div className="analytics-stat-card">
                  <div className="stat-icon">
                    <FaUserTie />
                  </div>
                  <div className="stat-content">
                    <h3>Active Users</h3>
                    <p className="stat-value">2,418</p>
                    <div className="stat-trend positive">↑ 12% growth</div>
                  </div>
                </div>
              </div>

              {/* Analytics Content */}
              <div className="analytics-content">
                <div className="analytics-placeholder">
                  <FaCloudUploadAlt className="placeholder-icon" />
                  <h3>Service Analytics Dashboard</h3>
                  <p>
                    Monitor real-time metrics, request patterns, and performance analytics 
                    for your registered services.
                  </p>
                  <div className="placeholder-stats">
                    <div className="placeholder-stat">
                      <strong>Feature Includes:</strong>
                      <ul>
                        <li>Real-time request monitoring</li>
                        <li>Performance analytics</li>
                        <li>User engagement metrics</li>
                        <li>Error rate tracking</li>
                        <li>Usage patterns over time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="content-card provider-settings">
              <div className="card-header">
                <h2><FaCog /> Provider Settings</h2>
                <p>Configure your provider account and preferences</p>
              </div>

              <div className="settings-grid">
                <div className="setting-card">
                  <h4>Notification Preferences</h4>
                  <p>Choose how you want to receive updates</p>
                  <div className="setting-control">
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Email notifications
                    </label>
                    <label className="checkbox">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Service approval alerts
                    </label>
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Performance reports
                    </label>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>API Access</h4>
                  <p>Manage your API credentials and access</p>
                  <div className="setting-control">
                    <div className="api-key">
                      <code className="key-value">••••••••••••••••••••••••</code>
                      <button className="btn btn-outline btn-small">Regenerate</button>
                    </div>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Service Limits</h4>
                  <p>Current usage and limits</p>
                  <div className="setting-control">
                    <div className="usage-meter">
                      <div className="meter-label">
                        <span>Services Registered</span>
                        <span>{stats.totalServices}/50</span>
                      </div>
                      <div className="meter-bar">
                        <div 
                          className="meter-fill" 
                          style={{ width: `${(stats.totalServices / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-card">
                  <h4>Account Information</h4>
                  <p>Update your provider details</p>
                  <div className="setting-control">
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Organization Name" 
                      defaultValue="Digital Service Provider"
                    />
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

export default ProviderDashboard;