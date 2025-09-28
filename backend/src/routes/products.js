const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Public routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Admin-only routes
router.post("/", adminMiddleware, controller.create);
router.put("/:id", adminMiddleware, controller.update);
router.delete("/:id", adminMiddleware, controller.remove);

module.exports = router;
