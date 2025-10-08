const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const { sequelize } = require("../config/database");

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
    const user = await User.findByPk(req.userId);
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
      const product = await Product.findByPk(item.product);
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
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image_url: product.image_url,
      };

      orderItems.push(orderItem);
      totalAmount += parseFloat(product.price) * parseInt(item.quantity);
    }

    // Create order
    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
      notes,
    });

    // Update product stock
    for (const item of items) {
      await Product.update(
        { stock: sequelize.literal(`stock - ${item.quantity}`) },
        { where: { id: item.product } }
      );
    }

    // Get the created order with user details
    const orderWithUser = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
    });

    res.status(201).json({
      message: "Order created successfully",
      order: orderWithUser,
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
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId: req.userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order (or is admin)
    if (order.userId !== req.userId) {
      const user = await User.findByPk(req.userId);
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
    const user = await User.findByPk(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const [updatedRows] = await Order.update(
      { status },
      { where: { id: req.params.id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
    });

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
    const user = await User.findByPk(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    // Build where clause
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if user owns this order
    if (order.userId !== req.userId) {
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
      await Product.update(
        { stock: sequelize.literal(`stock + ${item.quantity}`) },
        { where: { id: item.product } }
      );
    }

    const orderWithUser = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "phone"],
        },
      ],
    });

    res.json({
      message: "Order cancelled successfully",
      order: orderWithUser,
    });
  } catch (error) {
    next(error);
  }
};
