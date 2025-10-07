const express = require("express");
const router = express.Router();
const contactCtrl = require("../controllers/contactController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Public route to create a contact message
router.post("/", contactCtrl.create);

// Admin-only route to get all contacts
router.get("/", authMiddleware, adminMiddleware, contactCtrl.getAll);

module.exports = router;
