import React, { useState } from "react";
import "./Auth.css";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", loginData);
    alert("Login functionality would connect to your backend API");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle registration logic here
    console.log("Register attempt:", registerData);
    alert("Registration functionality would connect to your backend API");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="logo">
          <h1>CodVeda</h1>
          <p>Premium Fashion Store</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        <form
          className={`auth-form ${activeTab === "login" ? "active" : ""}`}
          onSubmit={handleLoginSubmit}
        >
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>

          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google">
                Google
              </button>
              <button type="button" className="social-btn facebook">
                Facebook
              </button>
            </div>
          </div>
        </form>

        {/* Register Form */}
        <form
          className={`auth-form ${activeTab === "register" ? "active" : ""}`}
          onSubmit={handleRegisterSubmit}
        >
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span className="checkmark"></span>I agree to the{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="auth-btn">
            Create Account
          </button>

          <div className="social-login">
            <p>Or sign up with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google">
                Google
              </button>
              <button type="button" className="social-btn facebook">
                Facebook
              </button>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            {activeTab === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              className="switch-btn"
              onClick={() =>
                setActiveTab(activeTab === "login" ? "register" : "login")
              }
            >
              {activeTab === "login" ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
