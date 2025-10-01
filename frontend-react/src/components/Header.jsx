import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MyOrdersModal from "./MyOrdersModal";

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    window.showNotification("Logged out successfully", "success");
  };

  const handleMyOrdersClick = (e) => {
    e.preventDefault();
    setShowOrdersModal(true);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            CodVeda
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/" className="nav-link">
              Product
            </Link>
            <Link to="/" className="nav-link">
              About
            </Link>
            <Link to="/" className="nav-link">
              Contact
            </Link>

            {!isAuthenticated ? (
              <div id="guestLinks" style={{ display: "flex", gap: "1rem" }}>
                <Link to="/auth" className="nav-link">
                  Login
                </Link>
              </div>
            ) : (
              <div id="userLinks" style={{ display: "flex", gap: "1rem" }}>
                <span id="userGreeting" className="nav-link">
                  Hello, {user?.name}
                </span>
                <button
                  onClick={handleMyOrdersClick}
                  id="ordersLink"
                  className="nav-link"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  My Orders
                </button>
                <button
                  id="logoutLink"
                  onClick={handleLogout}
                  className="nav-link logout-btn"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
                {isAdmin && (
                  <Link to="/admin" className="admin-link">
                    🔧 Admin Panel
                  </Link>
                )}
              </div>
            )}

            <button onClick={toggleCart} className="cart-btn">
              🛒 Cart ({getCartItemsCount()})
            </button>
          </div>
        </nav>
      </div>

      <MyOrdersModal
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
      />
    </header>
  );
};

export default Header;
