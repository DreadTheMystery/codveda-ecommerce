import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stock
        );
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [
            ...state.items,
            { product, quantity: Math.min(quantity, product.stock) },
          ],
        };
      }
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product._id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: Math.min(quantity, item.product.stock) }
            : item
        ),
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.product._id !== productId),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { items: [] };

    case CART_ACTIONS.LOAD_CART:
      return { items: action.payload || [] };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("codveda-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("codveda-cart", JSON.stringify(cart.items));
  }, [cart.items]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity },
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Cart calculations
  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getItemQuantity = (productId) => {
    const item = cart.items.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.items.some((item) => item.product._id === productId);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
