import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    initAuth();
    loadProducts();
  }, []);

  // Authentication functions
  const initAuth = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      setAuthToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setAuthToken(null);
    showNotification('Logged out successfully');
  };

  // Load products function
  const loadProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
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
    if (currentFilter === 'all') {
      return allProducts;
    }
    return allProducts.filter(product =>
      product.category && product.category.toLowerCase() === currentFilter.toLowerCase()
    );
  };

  // Order product function
  const orderProduct = (productId) => {
    if (!authToken || !currentUser) {
      showNotification('Please login to place an order', 'info');
      setTimeout(() => {
        window.location.href = `/auth?return=${encodeURIComponent(window.location.href)}`;
      }, 1500);
      return;
    }

    const product = allProducts.find(p => p._id === productId);
    if (!product) {
      showNotification('Product not found', 'error');
      return;
    }

    if (product.stock < 1) {
      showNotification('Product is out of stock', 'error');
      return;
    }

    showOrderConfirmation(product);
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    // This would typically be handled by a notification library
    alert(message);
  };

  // Show order confirmation (simplified for React)
  const showOrderConfirmation = (product) => {
    // This would typically be a modal component
    const confirmed = window.confirm(`Order ${product.name} for ₦${parseInt(product.price).toLocaleString()}?`);
    if (confirmed) {
      submitOrder(product);
    }
  };

  const submitOrder = async (product) => {
    try {
      const orderData = {
        items: [{
          product: product._id,
          quantity: 1
        }],
        shippingAddress: {
          name: currentUser.name,
          phone: currentUser.phone || '',
          street: 'Default Street',
          city: 'Default City',
          state: 'Default State',
          zipCode: '00000'
        },
        paymentMethod: 'cash_on_delivery'
      };

      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(`Order placed successfully! Order #${result.order.orderNumber}`, 'success');
        loadProducts(); // Refresh products
      } else {
        showNotification(result.error || 'Failed to place order', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">🛍️ CodVeda</div>
            <div className="nav-links">
              <a href="#" className="nav-link">Home</a>
              <a href="#products" className="nav-link">Products</a>
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>

              {/* Guest Links */}
              {!currentUser && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to="/auth" className="nav-link">Login</Link>
                </div>
              )}

              {/* User Links */}
              {currentUser && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span className="nav-link">Hi, {currentUser.name}!</span>
                  <a href="#" className="nav-link">My Orders</a>
                  <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
                </div>
              )}

              <Link to="/admin" className="admin-link">🔧 Admin Panel</Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Premium Fashion Collection</h1>
          <p>Discover the latest trends in clothing with our carefully curated collection of premium fashion items</p>
          <a href="#products" className="cta-button">Shop Now</a>
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
              className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => filterProducts('all')}
            >
              All Products
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'T-Shirts' ? 'active' : ''}`}
              onClick={() => filterProducts('T-Shirts')}
            >
              T-Shirts
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'Hoodies' ? 'active' : ''}`}
              onClick={() => filterProducts('Hoodies')}
            >
              Hoodies
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'Shoes' ? 'active' : ''}`}
              onClick={() => filterProducts('Shoes')}
            >
              Shoes
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'Pants' ? 'active' : ''}`}
              onClick={() => filterProducts('Pants')}
            >
              Pants
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'Accessories' ? 'active' : ''}`}
              onClick={() => filterProducts('Accessories')}
            >
              Accessories
            </button>
          </div>

          {loading && (
            <div className="loading">
              Loading amazing products for you
            </div>
          )}

          <div className="grid">
            {!loading && filteredProducts.length === 0 && (
              <div className="empty-state">
                <h3>🛍️ No Products Available</h3>
                <p>Our store is being stocked with amazing products. Check back soon!</p>
                <Link to="/admin" className="cta-button" style={{ marginTop: '1rem' }}>Add Products</Link>
              </div>
            )}

            {!loading && filteredProducts.map(product => (
              <div key={product._id} className="card" data-category={product.category || 'Uncategorized'}>
                <div className="card-image">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={product.name}
                  />
                  <div className="card-badge">{product.category || 'New'}</div>
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  <p>
                    {product.description 
                      ? product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '')
                      : 'No description available'
                    }
                  </p>
                  <div className="card-footer">
                    <div className="price">₦{parseInt(product.price).toLocaleString()}</div>
                    <div className={`stock-info ${product.stock < 5 ? 'stock-low' : ''}`}>
                      {product.stock < 1 
                        ? '❌ Out of Stock' 
                        : product.stock < 5 
                          ? `⚠️ Only ${product.stock} left` 
                          : `✅ ${product.stock} in stock`
                      }
                    </div>
                  </div>
                  <button 
                    className="add-to-cart" 
                    disabled={product.stock < 1}
                    onClick={() => orderProduct(product._id)}
                  >
                    {product.stock < 1 ? '❌ Out of Stock' : '🛒 Order Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 CodVeda Clothing Shop. Made with ❤️ for fashion lovers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
