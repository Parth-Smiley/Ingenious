import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LandingPage.css";
import {
  FaSun,
  FaMoon,
  FaHeartbeat,
  FaLeaf,
  FaCity,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

function LandingPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <FaHeartbeat />,
      title: "Healthcare Services",
      description:
        "Access medical records, book appointments, and connect with healthcare providers seamlessly.",
    },
    {
      icon: <FaLeaf />,
      title: "Agricultural Support",
      description:
        "Get weather alerts, crop advice, and market prices for better farming decisions.",
    },
    {
      icon: <FaCity />,
      title: "City Services",
      description:
        "Pay bills, register properties, and access municipal services from anywhere.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy controls.",
    },
  ];

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // 🔑 SAME NAVIGATION AS LANDING PAGE #1
  const handleNavigate = (mode) => {
    navigate(`/auth?mode=${mode}`);
  };

  return (
    <div className={`landing-container ${isDarkMode ? "dark" : "light"}`}>
      {/* HEADER */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">DigitalIndia</h1>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="landing-main">
        <div className="hero-section">
          {/* LEFT */}
          <div className="hero-content">
            <h2 className="hero-title">
              Unified Digital Public Services Platform
            </h2>

            <p className="hero-subtitle">
              Access{" "}
              <span className="highlight">
                healthcare, agriculture, and city services
              </span>{" "}
              through a single national digital infrastructure.
            </p>

            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleNavigate("login")}
              >
                Login to Account
                <FaArrowRight className="btn-icon" />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => handleNavigate("signin")}
              >
                Create New Account
              </button>
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">10M+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Services</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="features-section">
            <div className="features-header">
              <h3>Our Key Services</h3>
              <div className="feature-indicators">
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`feature-indicator ${
                      index === currentFeature ? "active" : ""
                    }`}
                    onClick={() => setCurrentFeature(index)}
                  />
                ))}
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                {features[currentFeature].icon}
              </div>
              <h4>{features[currentFeature].title}</h4>
              <p>{features[currentFeature].description}</p>
            </div>

            <div className="all-features-grid">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`mini-feature ${
                    index === currentFeature ? "active" : ""
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="mini-feature-icon">
                    {feature.icon}
                  </div>
                  <span className="mini-feature-title">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER CTA */}
        <footer className="landing-footer">
          <div className="footer-content">
            <h3>Ready to experience seamless digital services?</h3>
            <p>
              Join millions of citizens who trust our platform for their daily
              needs
            </p>

            <div className="footer-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={() => handleNavigate("signin")}
              >
                Get Started Free
              </button>

              <button
                className="btn btn-outline"
                onClick={() => handleNavigate("login")}
              >
                Existing User? Login
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default LandingPage;
