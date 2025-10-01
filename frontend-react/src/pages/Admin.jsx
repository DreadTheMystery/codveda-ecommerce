import React, { useState, useEffect } from "react";
import { productApi, orderApi } from "../utils/api";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productApi.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      });

      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
      });

      fetchProducts();
      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(productId);
        fetchProducts();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      fetchOrders();
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        {activeTab === "products" && (
          <div className="products-admin">
            <div className="add-product-form">
              <h3>Add New Product</h3>
              <form onSubmit={handleCreateProduct}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />
                </div>
                <textarea
                  placeholder="Product Description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit">Add Product</button>
              </form>
            </div>

            <div className="products-list">
              <h3>All Products</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="admin-products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="admin-product-card">
                      <h4>{product.name}</h4>
                      <p>Price: ₹{product.price}</p>
                      <p>Stock: {product.stock}</p>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-admin">
            <h3>All Orders</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="admin-order-card">
                    <div className="order-info">
                      <h4>Order #{order._id.slice(-8)}</h4>
                      <p>Customer: {order.user?.name || "N/A"}</p>
                      <p>Total: ₹{order.totalAmount?.toFixed(2)}</p>
                      <p>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="order-status-control">
                      <label>Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
