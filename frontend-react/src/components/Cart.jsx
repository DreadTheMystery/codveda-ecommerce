import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../utils/api";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isOpen,
    setIsOpen,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please login to place an order");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getCartTotal(),
      };

      const response = await orderApi.create(orderData);

      if (response.data) {
        alert("Order placed successfully!");
        clearCart();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)} className="close-btn">
            ×
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.image || "/api/placeholder/80/80"}
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.price}</p>

                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <h3>Total: ₹{getCartTotal().toFixed(2)}</h3>
                </div>

                <div className="cart-actions">
                  <button onClick={clearCart} className="clear-cart-btn">
                    Clear Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="checkout-btn"
                  >
                    {isCheckingOut ? "Processing..." : "Checkout"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
