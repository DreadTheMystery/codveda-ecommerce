import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import NotificationSystem from "./NotificationSystem";
import { useCart } from "../context/CartContext";
import { getProductImageUrl, handleImageError } from "../config/images";
import { API_URLS } from "../config/api";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const {
    addToCart: addToCartContext,
    getTotalItems,
    getItemQuantity,
  } = useCart();

  useEffect(() => {
    initAuth();
    loadProducts();
  }, []);

  // Authentication functions
  const initAuth = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setAuthToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setCurrentUser(null);
    setAuthToken(null);
    showNotification(
      "You have been logged out successfully",
      "info",
      "👋 Goodbye!"
    );
  };

  // Load products function
  const loadProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_URLS.PRODUCTS);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setAllProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setAllProducts([]);
    }
  };

  // Filter products
  const filterProducts = (category) => {
    setCurrentFilter(category);
  };

  const getFilteredProducts = () => {
    if (currentFilter === "all") {
      return allProducts;
    }
    return allProducts.filter(
      (product) =>
        product.category &&
        product.category.toLowerCase() === currentFilter.toLowerCase()
    );
  };

  // Add to cart function
  const addToCart = (productId) => {
    const product = allProducts.find((p) => p._id === productId);
    if (!product) {
      showNotification("Product not found", "error", "❌ Product Error");
      return;
    }

    if (product.stock < 1) {
      showNotification(
        "This product is currently out of stock",
        "warning",
        "📦 Out of Stock"
      );
      return;
    }

    // Check if adding one more would exceed stock
    const currentQuantity = getItemQuantity(product._id);

    if (currentQuantity >= product.stock) {
      showNotification(
        `Cannot add more items. Only ${product.stock} available in stock`,
        "warning",
        "📦 Stock Limit"
      );
      return;
    }

    addToCartContext(product);

    showNotification(
      `${product.name} added to cart!`,
      "success",
      "🛒 Added to Cart"
    );
  };

  // Show notification
  const showNotification = (message, type = "success", title = null) => {
    const notification = {
      id: Date.now() + Math.random(),
      title: title || getNotificationTitle(type),
      message,
      type,
      duration: type === "error" ? 7000 : 5000,
    };

    setNotifications((prev) => [...prev, notification]);
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "success":
        return "Success!";
      case "error":
        return "Error";
      case "warning":
        return "Warning";
      case "info":
        return "Info";
      case "order":
        return "Order Update";
      default:
        return "Notification";
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">🛍️ CodVeda</div>
            <div className="nav-links">
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#products" className="nav-link">
                Products
              </a>
              <a href="#" className="nav-link">
                About
              </a>
              <a href="#" className="nav-link">
                Contact
              </a>

              {/* Guest Links */}
              {!currentUser && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Link to="/auth" className="nav-link">
                    Login
                  </Link>
                </div>
              )}

              {/* Cart Link */}
              <Link
                to="/cart"
                className="nav-link"
                style={{ position: "relative" }}
              >
                🛒 Cart
                {getTotalItems() > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#ff4757",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      minWidth: "18px",
                      textAlign: "center",
                      lineHeight: "14px",
                    }}
                  >
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* User Links */}
              {currentUser && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span className="nav-link">Hi, {currentUser.name}!</span>
                  <a href="#" className="nav-link">
                    My Orders
                  </a>
                  <a
                    href="#"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Premium Fashion Collection</h1>
          <p>
            Discover the latest trends in clothing with our carefully curated
            collection of premium fashion items
          </p>
          <a href="#products" className="cta-button">
            Shop Now
          </a>
        </div>
      </section>

      <section id="products" className="products-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Products</h2>
            <p>Explore our amazing collection of high-quality clothing items</p>
          </div>

          <div className="filters">
            <button
              className={`filter-btn ${
                currentFilter === "all" ? "active" : ""
              }`}
              onClick={() => filterProducts("all")}
            >
              All Products
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "T-Shirts" ? "active" : ""
              }`}
              onClick={() => filterProducts("T-Shirts")}
            >
              T-Shirts
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Hoodies" ? "active" : ""
              }`}
              onClick={() => filterProducts("Hoodies")}
            >
              Hoodies
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Shoes" ? "active" : ""
              }`}
              onClick={() => filterProducts("Shoes")}
            >
              Shoes
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Pants" ? "active" : ""
              }`}
              onClick={() => filterProducts("Pants")}
            >
              Pants
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Accessories" ? "active" : ""
              }`}
              onClick={() => filterProducts("Accessories")}
            >
              Accessories
            </button>
          </div>

          {loading && (
            <div className="loading">Loading amazing products for you</div>
          )}

          <div className="grid">
            {!loading && filteredProducts.length === 0 && (
              <div className="empty-state">
                <h3>🛍️ No Products Available</h3>
                <p>
                  Our store is being stocked with amazing products. Check back
                  soon!
                </p>
              </div>
            )}

            {!loading &&
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="card"
                  data-category={product.category || "Uncategorized"}
                >
                  <div className="card-image">
                    <img
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      onError={handleImageError}
                      loading="lazy"
                    />
                    <div className="card-badge">
                      {product.category || "New"}
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{product.name}</h3>
                    <p>
                      {product.description
                        ? product.description.substring(0, 100) +
                          (product.description.length > 100 ? "..." : "")
                        : "No description available"}
                    </p>
                    <div className="card-footer">
                      <div className="price">
                        ₦{parseInt(product.price).toLocaleString()}
                      </div>
                      <div
                        className={`stock-info ${
                          product.stock < 5 ? "stock-low" : ""
                        }`}
                      >
                        {product.stock < 1
                          ? "❌ Out of Stock"
                          : product.stock < 5
                          ? `⚠️ Only ${product.stock} left`
                          : `✅ ${product.stock} in stock`}
                      </div>
                    </div>
                    <button
                      className="add-to-cart"
                      disabled={product.stock < 1}
                      onClick={() => addToCart(product._id)}
                    >
                      {product.stock < 1 ? "❌ Out of Stock" : "🛒 Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>
            &copy; 2025 CodVeda Clothing Shop. Made with ❤️ for fashion lovers.
          </p>
        </div>
      </footer>

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Home;
