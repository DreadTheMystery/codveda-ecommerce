import React, { useState, useEffect } from "react";
import { orderApi } from "../utils/api";

const MyOrdersModal = ({ isOpen, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await orderApi.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders");
      window.showNotification("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      processing: "#17a2b8",
      shipped: "#007bff",
      delivered: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="orders-modal-overlay" onClick={onClose}>
      <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
        <button className="orders-modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>My Orders</h2>

        {loading && (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {error && (
          <div className="orders-error">
            <p>{error}</p>
            <button onClick={fetchOrders} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="orders-content">
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders yet. Start shopping!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-header">
                      <strong>
                        Order #{order.orderNumber || order._id.slice(-8)}
                      </strong>
                      <span
                        className="order-status"
                        style={{
                          backgroundColor: getStatusColor(order.status),
                        }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>

                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <span>
                            {item.product?.name || "Product"} x{item.quantity}
                          </span>
                          <span>
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="order-total">
                      Total: ₹{order.totalAmount?.toLocaleString() || "0"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-modal-overlay {
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

        .orders-modal {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .orders-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .orders-modal h2 {
          margin-bottom: 1.5rem;
          color: #2c3e50;
        }

        .orders-loading {
          text-align: center;
          padding: 2rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .orders-error {
          text-align: center;
          padding: 2rem;
          color: #dc3545;
        }

        .retry-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .no-orders {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 1rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          color: white;
          font-weight: 600;
        }

        .order-date {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .order-items {
          margin-bottom: 0.5rem;
        }

        .order-item-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .order-total {
          text-align: right;
          font-weight: bold;
          margin-top: 0.5rem;
          border-top: 1px solid #eee;
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default MyOrdersModal;
