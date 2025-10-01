import React, { useState, useEffect } from "react";
import "./OrderModal.css";

const OrderModal = ({ isOpen, onClose, product, onConfirm, currentUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm({
      product,
      quantity,
      shippingAddress,
      totalAmount: product.price * quantity,
    });
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !product) return null;

  const totalAmount = product.price * quantity;

  return (
    <div
      className={`order-modal-backdrop ${isVisible ? "modal-visible" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={`order-modal ${isVisible ? "modal-visible" : ""}`}>
        <div className="modal-header">
          <h2>🛒 Confirm Your Order</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* Product Preview */}
          <div className="product-preview">
            <div className="product-image">
              <img
                src={
                  product.image_url ||
                  "https://via.placeholder.com/100x100?text=No+Image"
                }
                alt={product.name}
              />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">
                ₦{parseInt(product.price).toLocaleString()}
              </p>
              <p className="stock-info">
                {product.stock < 5
                  ? `⚠️ Only ${product.stock} left in stock`
                  : `✅ ${product.stock} available`}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="shipping-section">
            <h4>📦 Shipping Address</h4>
            <div className="address-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
              />
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      zipCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h4>💰 Order Summary</h4>
            <div className="summary-row">
              <span>
                Subtotal ({quantity} item{quantity > 1 ? "s" : ""}):
              </span>
              <span>₦{parseInt(totalAmount).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-shipping">FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₦{parseInt(totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={
              !shippingAddress.name ||
              !shippingAddress.phone ||
              !shippingAddress.street
            }
          >
            🚀 Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
