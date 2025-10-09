import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import NotificationSystem from "./NotificationSystem";
import { formatOrderMessage, createWhatsAppUrl } from "../config/whatsapp";
import { API_URLS } from "../config/api";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();
  const [notifications, setNotifications] = useState([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Notification functions
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

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      showNotification("Item removed from cart", "info", "🗑️ Item Removed");
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Handle remove item
  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    showNotification(
      `${productName} removed from cart`,
      "info",
      "🗑️ Item Removed"
    );
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      showNotification("Cart cleared successfully", "info", "🧹 Cart Cleared");
    }
  };

  // Handle address input changes
  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // WhatsApp redirect function
  const redirectToWhatsApp = (order, shippingAddress) => {
    // Create order summary message
    const orderItems = cart.items
      .map(
        (item) =>
          `• ${item.product.name} (₦${parseInt(
            item.product.price
          ).toLocaleString()}) x ${item.quantity} = ₦${(
            item.product.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    const totalAmount = getTotalPrice();

    // Use the configuration to format message and create URL
    const message = formatOrderMessage(
      order,
      shippingAddress,
      orderItems,
      totalAmount
    );
    const whatsappUrl = createWhatsAppUrl(message);

    // Show notification about redirect
    showNotification(
      "Redirecting to WhatsApp for payment confirmation...",
      "info",
      "📱 WhatsApp Payment"
    );

    // Redirect after a short delay to allow notification to show
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 2000);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Validate shipping address
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state
    ) {
      showNotification(
        "Please fill in all required shipping details (including state)",
        "warning",
        "📋 Missing Information"
      );
      return;
    }

    // Check authentication
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      showNotification(
        "Please login to place your order",
        "info",
        "🔐 Login Required"
      );
      setTimeout(() => {
        window.location.href = `/auth?return=${encodeURIComponent(
          window.location.href
        )}`;
      }, 1500);
      return;
    }

    setIsProcessingOrder(true);
    showNotification("Processing your order...", "info", "🚀 Order Processing");

    try {
      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "cash_on_delivery",
      };

      const response = await fetch(API_URLS.ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(
          `Order placed successfully! Order #${result.order.id.slice(-8)}`,
          "order",
          "🎉 Order Confirmed!"
        );

        // Redirect to WhatsApp for payment
        redirectToWhatsApp(result.order, shippingAddress);

        clearCart();
        // Reset shipping address
        setShippingAddress({
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
        });
      } else {
        showNotification(result.error || "Failed to place order", "error");
      }
    } catch (error) {
      showNotification("Network error. Please try again.", "error");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>🛒 Your Shopping Cart</h1>
            <Link to="/" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        </div>

        <NotificationSystem
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>🛒 Your Shopping Cart ({getTotalItems()} items)</h1>
          <Link to="/" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <h2>Items in your cart</h2>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                🗑️ Clear Cart
              </button>
            </div>

            {cart.items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={
                      item.product.image_url ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.product.name}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <p className="item-price">
                    ₦{parseInt(item.product.price).toLocaleString()}
                  </p>
                  <p className="item-stock">
                    {item.product.stock < 5
                      ? `⚠️ Only ${item.product.stock} left`
                      : `✅ ${item.product.stock} in stock`}
                  </p>
                </div>

                <div className="item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p className="item-subtotal">
                    ₦
                    {parseInt(
                      item.product.price * item.quantity
                    ).toLocaleString()}
                  </p>
                  <button
                    className="remove-item-btn"
                    onClick={() =>
                      handleRemoveItem(item.product.id, item.product.name)
                    }
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-sidebar">
            <div className="order-summary">
              <h3>📋 Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({getTotalItems()} items):</span>
                <span>₦{parseInt(getTotalPrice()).toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₦{parseInt(getTotalPrice()).toLocaleString()}</span>
              </div>
            </div>

            <div className="shipping-form">
              <h3>📦 Shipping Address</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={shippingAddress.name}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number *"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessingOrder || cart.items.length === 0}
            >
              {isProcessingOrder
                ? "🔄 Processing..."
                : "🚀 Place Order & Pay via WhatsApp"}
            </button>

            <div
              className="payment-info"
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f0f8ff",
                borderRadius: "5px",
                fontSize: "14px",
                border: "1px solid #e0e0e0",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>📱</span>
                <strong>Payment Process:</strong>
              </div>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                After placing your order, you'll be redirected to WhatsApp to
                complete payment with our team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Cart;
