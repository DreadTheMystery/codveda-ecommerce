import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple demo login - in real app, this would connect to your backend
    if (credentials.username === "admin" && credentials.password === "admin") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Try username: admin, password: admin");
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="login-container">
          <div className="login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="login-btn">
                Login to Admin Panel
              </button>
            </form>
            <p className="demo-info">Demo: username: admin, password: admin</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="admin-content">
          {/* Dashboard Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">24</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">156</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">89</p>
            </div>
            <div className="stat-card">
              <h3>Revenue</h3>
              <p className="stat-number">$12,450</p>
            </div>
          </div>

          {/* Admin Sections */}
          <div className="admin-sections">
            <div className="admin-section">
              <h2>Product Management</h2>
              <div className="section-actions">
                <button className="action-btn primary">Add New Product</button>
                <button className="action-btn">View All Products</button>
                <button className="action-btn">Manage Categories</button>
              </div>
            </div>

            <div className="admin-section">
              <h2>Order Management</h2>
              <div className="section-actions">
                <button className="action-btn primary">View All Orders</button>
                <button className="action-btn">Pending Orders</button>
                <button className="action-btn">Completed Orders</button>
              </div>
            </div>

            <div className="admin-section">
              <h2>User Management</h2>
              <div className="section-actions">
                <button className="action-btn primary">View All Users</button>
                <button className="action-btn">User Analytics</button>
                <button className="action-btn">Manage Permissions</button>
              </div>
            </div>

            <div className="admin-section">
              <h2>Reports & Analytics</h2>
              <div className="section-actions">
                <button className="action-btn primary">Sales Report</button>
                <button className="action-btn">User Analytics</button>
                <button className="action-btn">Product Performance</button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-type">Order</span>
                <span className="activity-desc">New order #1234 received</span>
                <span className="activity-time">5 min ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-type">Product</span>
                <span className="activity-desc">
                  Product "Summer T-Shirt" updated
                </span>
                <span className="activity-time">15 min ago</span>
              </div>
              <div className="activity-item">
                <span className="activity-type">User</span>
                <span className="activity-desc">New user registration</span>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
