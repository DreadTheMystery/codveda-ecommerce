const Contact = require("../models/contact");

exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email and message are required" });
    }

    const contact = await Contact.create({ name, email, subject, message });

    // TODO: optionally send email to owner via nodemailer here
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (err) {
    console.error("Contact creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contacts (for admin use later)
exports.getAll = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
      limit: 200,
    });
    res.json(contacts);
  } catch (err) {
    console.error("Contact fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
