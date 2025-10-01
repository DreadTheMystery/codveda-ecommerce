import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import OrderModal from "./OrderModal";

const ProductCard = ({ product, onOrderSuccess }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.showNotification("Please login to add items to cart", "info");
      return;
    }

    setIsAdding(true);
    try {
      addToCart(product, 1);
      window.showNotification("Added to cart successfully!", "success");
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      window.showNotification("Failed to add to cart", "error");
      setIsAdding(false);
    }
  };

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      window.showNotification("Please login to place an order", "info");
      return;
    }

    if (product.stock < 1) {
      window.showNotification("Product is out of stock", "error");
      return;
    }

    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    if (onOrderSuccess) {
      onOrderSuccess();
    }
  };

  return (
    <div className="card" data-category={product.category || "Uncategorized"}>
      <div className="card-image">
        <img
          src={
            product.image_url ||
            product.image ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        <div className="card-badge">{product.category || "New"}</div>
      </div>

      <div className="card-content">
        <h3>{product.name}</h3>
        <p>
          {product.description
            ? product.description.length > 100
              ? product.description.substring(0, 100) + "..."
              : product.description
            : "No description available"}
        </p>

        <div className="card-footer">
          <div className="price">
            ₹{parseInt(product.price).toLocaleString()}
          </div>
          <div className={`stock-info ${product.stock < 5 ? "stock-low" : ""}`}>
            {product.stock < 1
              ? "❌ Out of Stock"
              : product.stock < 5
              ? `⚠️ Only ${product.stock} left`
              : `✅ ${product.stock} in stock`}
          </div>
        </div>

        <div className="card-buttons">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAdding}
            className="add-to-cart"
            style={{ flex: 1, marginRight: "0.5rem" }}
          >
            {isAdding
              ? "⏳ Adding..."
              : product.stock <= 0
              ? "❌ Out of Stock"
              : "🛒 Cart"}
          </button>

          <button
            onClick={handleOrderNow}
            disabled={product.stock <= 0}
            className="order-now-btn"
            style={{ flex: 1 }}
          >
            {product.stock <= 0 ? "❌ Out of Stock" : "🛍️ Order"}
          </button>
        </div>
      </div>

      <OrderModal
        product={product}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default ProductCard;
