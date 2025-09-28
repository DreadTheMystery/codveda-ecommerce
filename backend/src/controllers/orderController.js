const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Order must contain at least one item",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state
    ) {
      return res.status(400).json({
        error: "Complete shipping address is required",
      });
    }

    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate and prepare order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          error: "Each item must have a valid product ID and quantity",
        });
      }

      // Get product details
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          error: `Product with ID ${item.product} not found`,
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      // Prepare order item
      const orderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image_url: product.image_url,
      };

      orderItems.push(orderItem);
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
      notes,
    });

    // Calculate total (in case we want to add shipping, tax, etc. later)
    order.calculateTotal();

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Populate the order with product details
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name category");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: req.userId });

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name category description");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order (or is admin)
    if (order.user._id.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (
      !status ||
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({
        error: "Valid status is required",
      });
    }

    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email phone")
      .populate("items.product", "name category");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "name category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        error: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("items.product", "name category");

    res.json({
      message: "Order cancelled successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
