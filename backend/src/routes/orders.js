const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// All order routes require authentication
router.use(authMiddleware);

// Customer routes
router.post("/", orderController.createOrder);
router.get("/my-orders", orderController.getUserOrders);
router.get("/:id", orderController.getOrder);
router.put("/:id/cancel", orderController.cancelOrder);

// Admin routes
router.get("/", orderController.getAllOrders); // Admin only - get all orders
router.put("/:id/status", orderController.updateOrderStatus); // Admin only - update status

module.exports = router;
