import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../utils/api";

const OrderModal = ({ product, isOpen, onClose, onOrderSuccess }) => {
  const { user } = useAuth();
  const [orderData, setOrderData] = useState({
    quantity: 1,
    shippingName: user?.name || "",
    shippingPhone: user?.phone || "",
    shippingStreet: user?.address?.street || "",
    shippingCity: user?.address?.city || "",
    shippingState: user?.address?.state || "",
    shippingZip: user?.address?.zipCode || "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !orderData.shippingName ||
      !orderData.shippingPhone ||
      !orderData.shippingStreet ||
      !orderData.shippingCity ||
      !orderData.shippingState
    ) {
      window.showNotification(
        "Please fill in all required shipping information",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: [
          {
            product: product._id,
            quantity: orderData.quantity,
          },
        ],
        shippingAddress: {
          name: orderData.shippingName,
          phone: orderData.shippingPhone,
          street: orderData.shippingStreet,
          city: orderData.shippingCity,
          state: orderData.shippingState,
          zipCode: orderData.shippingZip,
        },
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
      };

      const response = await orderApi.create(orderPayload);

      if (response.data) {
        window.showNotification(
          `Order placed successfully! Order #${
            response.data.orderNumber || "N/A"
          }`,
          "success"
        );
        onOrderSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Order submission error:", error);
      window.showNotification(
        error.response?.data?.message || "Failed to place order",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>Confirm Your Order</h2>

        <div className="order-product-info">
          <img
            src={
              product.image_url ||
              product.image ||
              "https://via.placeholder.com/100x100"
            }
            alt={product.name}
            className="order-product-image"
          />
          <div>
            <h3>{product.name}</h3>
            <p>{product.description || "No description"}</p>
            <div className="order-product-price">
              ₹{parseInt(product.price).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="order-form">
          <div className="form-group">
            <label>Quantity:</label>
            <select
              value={orderData.quantity}
              onChange={(e) =>
                handleInputChange("quantity", parseInt(e.target.value))
              }
            >
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="stock-available">{product.stock} available</span>
          </div>

          <div className="shipping-section">
            <h4>Shipping Address:</h4>
            <div className="shipping-form">
              <input
                type="text"
                placeholder="Full Name"
                value={orderData.shippingName}
                onChange={(e) =>
                  handleInputChange("shippingName", e.target.value)
                }
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={orderData.shippingPhone}
                onChange={(e) =>
                  handleInputChange("shippingPhone", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                value={orderData.shippingStreet}
                onChange={(e) =>
                  handleInputChange("shippingStreet", e.target.value)
                }
                required
              />
              <div className="address-row">
                <input
                  type="text"
                  placeholder="City"
                  value={orderData.shippingCity}
                  onChange={(e) =>
                    handleInputChange("shippingCity", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={orderData.shippingState}
                  onChange={(e) =>
                    handleInputChange("shippingState", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={orderData.shippingZip}
                  onChange={(e) =>
                    handleInputChange("shippingZip", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method:</label>
            <select
              value={orderData.paymentMethod}
              onChange={(e) =>
                handleInputChange("paymentMethod", e.target.value)
              }
            >
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card Payment</option>
            </select>
          </div>

          <textarea
            placeholder="Special instructions (optional)"
            value={orderData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="order-notes"
          />

          <div className="order-actions">
            <button onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }

        .order-modal {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .order-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .order-modal h2 {
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        .order-product-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .order-product-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 10px;
        }

        .order-product-price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #667eea;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .form-group select {
          padding: 0.5rem;
          border: 2px solid #e9ecef;
          border-radius: 5px;
        }

        .stock-available {
          margin-left: 1rem;
          color: #666;
        }

        .shipping-section h4 {
          margin-bottom: 1rem;
        }

        .shipping-form {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
        }

        .shipping-form input {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .address-row {
          display: flex;
          gap: 0.5rem;
        }

        .address-row input:last-child {
          width: 100px;
          flex-shrink: 0;
        }

        .order-notes {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          min-height: 80px;
          resize: vertical;
        }

        .order-actions {
          display: flex;
          gap: 1rem;
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
        }

        .submit-btn {
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
        }

        .submit-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default OrderModal;
