import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import NotificationSystem from "./NotificationSystem";
import OrderModal from "./OrderModal";
import { useCart } from "../context/CartContext";
import { getProductImageUrl, handleImageError } from "../config/images";
import { API_URLS } from "../config/api";
import { formatOrderMessage, createWhatsAppUrl } from "../config/whatsapp";

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [orderModal, setOrderModal] = useState({
    isOpen: false,
    product: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const {
    addToCart: addToCartContext,
    getTotalItems,
    getItemQuantity,
  } = useCart();

  useEffect(() => {
    initAuth();
    loadProducts();
  }, []);

  // Scroll listener for active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "products", "about", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Hero slideshow functionality
  useEffect(() => {
    let slideInterval;
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll(".hero-slide");
    const indicators = document.querySelectorAll(".indicator");
    const totalSlides = slides.length;

    const changeSlide = (index) => {
      // Remove active class from all slides and indicators
      slides.forEach((slide) => slide.classList.remove("active"));
      indicators.forEach((indicator) => indicator.classList.remove("active"));

      // Add active class to current slide and indicator
      if (slides[index]) {
        slides[index].classList.add("active");
        const bgUrl = slides[index].getAttribute("data-bg");
        slides[index].style.backgroundImage = bgUrl;
      }
      if (indicators[index]) {
        indicators[index].classList.add("active");
      }
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      changeSlide(currentSlideIndex);
    };

    // Initialize first slide
    if (slides.length > 0) {
      changeSlide(0);

      // Auto-advance slides every 4 seconds
      slideInterval = setInterval(nextSlide, 4000);
    }

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentSlideIndex = index;
        changeSlide(index);
        // Reset interval when manually changing slides
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
      });
    });

    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      // Remove event listeners
      indicators.forEach((indicator, index) => {
        indicator.removeEventListener("click", () => {});
      });
    };
  }, []);

  // Authentication functions
  const initAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setAuthToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
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

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  // Order Modal Functions
  const showOrderConfirmation = (product) => {
    if (!currentUser) {
      showNotification(
        "Please login to place an order",
        "warning",
        "🔐 Login Required"
      );
      return;
    }
    setOrderModal({ isOpen: true, product });
  };

  const handleOrderConfirm = (orderData) => {
    submitOrder(orderData);
  };

  const closeOrderModal = () => {
    setOrderModal({ isOpen: false, product: null });
  };

  // Navigation functions
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Contact form functions
  const handleContactChange = (e) => {
    setContactForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactStatus(null);

    // Basic client validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({
        type: "error",
        message: "Please fill name, email and message.",
      });
      setContactSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URLS.BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setContactStatus({
          type: "success",
          message: "Message sent — thank you!",
        });
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        showNotification("Message sent successfully!", "success");
      } else {
        const data = await response.json();
        setContactStatus({
          type: "error",
          message: data?.error || "Failed to send message.",
        });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setContactStatus({
        type: "error",
        message: "Network error. Try again later.",
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  // WhatsApp redirect function
  const redirectToWhatsApp = (order, orderData) => {
    try {
      const orderItems = `${orderData.product.name} x ${orderData.quantity}`;
      const message = formatOrderMessage(
        order,
        orderData.shippingAddress,
        orderItems,
        orderData.totalAmount
      );

      const whatsappUrl = createWhatsAppUrl(message);

      showNotification(
        "Redirecting to WhatsApp for payment confirmation...",
        "info",
        "📱 WhatsApp Payment"
      );

      // Open WhatsApp in a new tab
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);
    } catch (error) {
      console.error("WhatsApp redirect error:", error);
      showNotification(
        "Error redirecting to WhatsApp. Please contact support.",
        "error"
      );
    }
  };

  const submitOrder = async (orderData) => {
    try {
      // Show loading notification
      showNotification(
        "Processing your order...",
        "info",
        "🚀 Order Processing"
      );

      const requestData = {
        items: [
          {
            product: orderData.product._id,
            quantity: orderData.quantity,
          },
        ],
        shippingAddress: orderData.shippingAddress,
        paymentMethod: "cash_on_delivery",
      };

      const response = await fetch(API_URLS.ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(
          `Order placed successfully! Order #${result.order.orderNumber}`,
          "order",
          "🎉 Order Confirmed!"
        );

        // Redirect to WhatsApp for payment
        redirectToWhatsApp(result.order, orderData);

        loadProducts(); // Refresh products
      } else {
        showNotification(result.error || "Failed to place order", "error");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      showNotification("Network error. Please try again.", "error");
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <header>
        <div className="container">
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/">
                <img
                  src="/frontend/src/Gemini_Generated_Image_pj5gw7pj5gw7pj5g.png"
                  alt=""
                />
                NAFSYKAY COLLECTION
              </Link>
            </div>

            {/* Mobile cart icon - always visible */}
            <div className="mobile-nav-right">
              <Link
                to="/cart"
                className="mobile-cart-icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🛒
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <div
                  className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>

            <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
              <a
                href="#products"
                className={`nav-link ${
                  activeSection === "products" ? "active-section" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("products");
                }}
              >
                Products
              </a>
              <a
                href="#about"
                className={`nav-link ${
                  activeSection === "about" ? "active-section" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                }}
              >
                About
              </a>
              <a
                href="#contact"
                className={`nav-link ${
                  activeSection === "contact" ? "active-section" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Contact
              </a>

              {/* Guest Links */}
              {!currentUser && (
                <div className="auth-links">
                  <Link
                    to="/auth"
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Desktop Cart Link - hidden on mobile */}
              <Link
                to="/cart"
                className="nav-link cart-link desktop-cart"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🛒 Cart
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>

              {/* User Links */}
              {currentUser && (
                <div className="user-links">
                  <span className="nav-link user-greeting">
                    Hi, {currentUser.name}!
                  </span>
                  <a
                    href="#"
                    className="nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </a>
                  <a
                    href="#"
                    className="nav-link logout-link"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>{" "}
      <section id="hero" className="hero hero-slideshow">
        <div className="hero-slides">
          <div
            className="hero-slide active"
            data-bg="/frontend/src//1.png"
          ></div>
          <div
            className="hero-slide"
            data-bg="url('https://images.unsplash.com/photo-1583391733956-6c78276477e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          ></div>
          <div
            className="hero-slide"
            data-bg="url('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          ></div>
          <div
            className="hero-slide"
            data-bg="url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          ></div>
        </div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <h1>NAFSYKAY COLLECTION</h1>
            <h2>Premium Islamic & African Fashion</h2>
            <p>
              Discover authentic traditional and modern Islamic clothing with
              our carefully curated collection of Abayas, Jallabiya, Ankara, and
              beautiful African fashion
            </p>
            <a href="#products" className="cta-button">
              Shop Now
            </a>
          </div>
        </div>
        <div className="slideshow-indicators">
          <span className="indicator active" data-slide="0"></span>
          <span className="indicator" data-slide="1"></span>
          <span className="indicator" data-slide="2"></span>
          <span className="indicator" data-slide="3"></span>
        </div>
      </section>
      <section id="products" className="products-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Collection</h2>
            <p>
              Explore our authentic Islamic and African fashion pieces crafted
              with tradition and elegance
            </p>
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
                currentFilter === "Abaya" ? "active" : ""
              }`}
              onClick={() => filterProducts("Abaya")}
            >
              Abaya Egypt & Dubai
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Jallabiya" ? "active" : ""
              }`}
              onClick={() => filterProducts("Jallabiya")}
            >
              Jallabiya
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Ankara" ? "active" : ""
              }`}
              onClick={() => filterProducts("Ankara")}
            >
              Ankara
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Laces" ? "active" : ""
              }`}
              onClick={() => filterProducts("Laces")}
            >
              Laces
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Kampala" ? "active" : ""
              }`}
              onClick={() => filterProducts("Kampala")}
            >
              Kampala
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Shedda" ? "active" : ""
              }`}
              onClick={() => filterProducts("Shedda")}
            >
              Shedda
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Veils" ? "active" : ""
              }`}
              onClick={() => filterProducts("Veils")}
            >
              Veils
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Hijab" ? "active" : ""
              }`}
              onClick={() => filterProducts("Hijab")}
            >
              Hijab
            </button>
            <button
              className={`filter-btn ${
                currentFilter === "Caps" ? "active" : ""
              }`}
              onClick={() => filterProducts("Caps")}
            >
              Caps
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
                    <div className="card-actions">
                      <button
                        className="add-to-cart"
                        disabled={product.stock < 1}
                        onClick={() => addToCart(product._id)}
                      >
                        {product.stock < 1
                          ? "❌ Out of Stock"
                          : "🛒 Add to Cart"}
                      </button>
                      <button
                        className="buy-now"
                        disabled={product.stock < 1}
                        onClick={() => showOrderConfirmation(product)}
                      >
                        {product.stock < 1 ? "❌ Out of Stock" : "🚀 Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-title">
            <h2>About CodVeda</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                <strong>CodVeda</strong> is your premier destination for
                authentic Islamic and African fashion. We specialize in
                traditional and contemporary modest clothing, bringing you the
                finest Abayas from Egypt and Dubai, beautiful Ankara prints,
                elegant Jallabiya, and quality Islamic wear.
              </p>

              <p>What makes CodVeda special:</p>
              <ul>
                <li>Authentic Islamic and African fashion pieces</li>
                <li>High-quality materials and traditional craftsmanship</li>
                <li>
                  Wide range from everyday wear to special occasion outfits
                </li>
                <li>Modest fashion that celebrates culture and faith</li>
              </ul>
              <p className="muted">
                Built by <em>DreadTheMystery</em>. Check source code or
                contribute on GitHub.
              </p>
            </div>

            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">9+</div>
                <div className="stat-label">Fashion Categories</div>
              </div>
              <div className="stat">
                <div className="stat-number">100+</div>
                <div className="stat-label">Islamic & African Styles</div>
              </div>
              <div className="stat">
                <div className="stat-number">Premium</div>
                <div className="stat-label">Quality Materials</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-title">
            <h2>Contact Us</h2>
            <p>
              If you have questions or want to collaborate — drop a message
              below.
            </p>
          </div>

          <form
            id="contactForm"
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <div className="form-row">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={contactForm.name}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={handleContactChange}
              />
            </div>
            <div className="form-row">
              <textarea
                id="message"
                name="message"
                placeholder="Your message"
                rows="6"
                value={contactForm.message}
                onChange={handleContactChange}
                required
              ></textarea>
            </div>

            <div className="form-row">
              <button
                type="submit"
                id="contactSubmit"
                disabled={contactSubmitting}
              >
                {contactSubmitting ? "Sending..." : "Send Message"}
              </button>
              {contactStatus && (
                <span
                  id="contactStatus"
                  className={`contact-status ${contactStatus.type}`}
                >
                  {contactStatus.message}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <p>
            &copy; 2025 CodVeda Islamic & African Fashion. Made with ❤️ for
            authentic style.
          </p>
        </div>
      </footer>
      {/* Order Modal */}
      <OrderModal
        isOpen={orderModal.isOpen}
        product={orderModal.product}
        currentUser={currentUser}
        onClose={closeOrderModal}
        onConfirm={handleOrderConfirm}
      />
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Home;
