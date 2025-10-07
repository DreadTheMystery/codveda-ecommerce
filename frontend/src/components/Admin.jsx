import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [contacts, setContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.user.role === "admin") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        setIsLoggedIn(true);
      } else if (data.user && data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleViewContacts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const contactsData = await response.json();
        setContacts(contactsData);
        setShowContacts(true);
      } else {
        setError("Failed to load contact messages");
      }
    } catch (error) {
      console.error("Contact fetch error:", error);
      setError("Network error. Please try again.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="login-container">
          <div className="login-form">
            <h2>🔐 Admin Login</h2>
            {error && (
              <div
                className="error-message"
                style={{
                  backgroundColor: "#fee",
                  color: "#c33",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  border: "1px solid #fcc",
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login to Admin Panel"}
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
              <h2>Contact Messages</h2>
              <div className="section-actions">
                <button
                  className="action-btn primary"
                  onClick={handleViewContacts}
                >
                  View All Messages
                </button>
                <button className="action-btn">Recent Messages</button>
                <button className="action-btn">Reply to Messages</button>
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

          {/* Contact Messages Display */}
          {showContacts && (
            <div className="contacts-section">
              <div className="section-header">
                <h2>Contact Messages</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowContacts(false)}
                >
                  ✕
                </button>
              </div>
              <div className="contacts-list">
                {contacts.length === 0 ? (
                  <p>No contact messages yet.</p>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact._id} className="contact-item">
                      <div className="contact-header">
                        <strong>{contact.name}</strong>
                        <span className="contact-email">{contact.email}</span>
                        <span className="contact-date">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {contact.subject && (
                        <div className="contact-subject">
                          <strong>Subject:</strong> {contact.subject}
                        </div>
                      )}
                      <div className="contact-message">{contact.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
