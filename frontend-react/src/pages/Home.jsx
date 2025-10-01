import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import { productApi } from "../utils/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const observerRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    initScrollAnimations();
  }, []);

  const initScrollAnimations = () => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all product cards and sections
    const elementsToAnimate = document.querySelectorAll(
      ".product-card, .section-title, .hero h1, .hero p"
    );
    elementsToAnimate.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  };

  useEffect(() => {
    // Filter products based on current filter
    let filtered;
    if (currentFilter === "all") {
      filtered = products;
    } else {
      filtered = products.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === currentFilter.toLowerCase()
      );
    }
    setFilteredProducts(filtered);
  }, [products, currentFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (category) => {
    setCurrentFilter(category);
  };

  const handleOrderSuccess = () => {
    // Refresh products to update stock counts
    fetchProducts();
  };

  return (
    <>
      {/* Hero Section */}
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

      {/* Products Section */}
      <section id="products" className="products-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Products</h2>
            <p>Explore our amazing collection of high-quality clothing items</p>
          </div>

          {/* Filter Buttons */}
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

          {/* Loading State */}
          {loading && (
            <div className="loading">Loading amazing products for you</div>
          )}

          {/* Error State */}
          {error && (
            <div className="empty-state">
              <h3>⚠️ Connection Error</h3>
              <p>
                Unable to load products. Please make sure the server is running.
              </p>
              <button
                onClick={fetchProducts}
                className="cta-button"
                style={{ marginTop: "1rem" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <h3>🛍️ No Products Available</h3>
                  <p>
                    Our store is being stocked with amazing products. Check back
                    soon!
                  </p>
                </div>
              ) : (
                <div className="grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onOrderSuccess={handleOrderSuccess}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
