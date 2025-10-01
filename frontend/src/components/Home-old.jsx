import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">CodVeda</div>
            <div className="nav-links">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/auth" className="nav-link">
                Login
              </a>
              <a href="/admin" className="admin-link">
                Admin Panel
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to CodVeda</h1>
          <p>Discover Premium Fashion & Style</p>
          <p>
            Explore our curated collection of premium clothing and accessories
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary">Shop Now</button>
            <button className="cta-btn secondary">View Collection</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Browse Categories</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>Men's Fashion</h3>
              <p>Discover the latest trends</p>
            </div>
            <div className="category-card">
              <h3>Women's Fashion</h3>
              <p>Elegant and stylish pieces</p>
            </div>
            <div className="category-card">
              <h3>Accessories</h3>
              <p>Complete your look</p>
            </div>
            <div className="category-card">
              <h3>Premium Collection</h3>
              <p>Luxury fashion items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid" id="products-container">
            {/* Products will be loaded here */}
            <div className="product-card">
              <div className="product-image">
                <div className="placeholder-image">Image</div>
              </div>
              <div className="product-info">
                <h3>Sample Product</h3>
                <p className="price">$99.99</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CodVeda</h3>
              <p>Premium fashion for the modern lifestyle</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/auth">Login</a>
                </li>
                <li>
                  <a href="/admin">Admin</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@codveda.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 CodVeda Clothing Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
