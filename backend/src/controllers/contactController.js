const Contact = require("../models/contact");

exports.create = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email and message are required" });
    }

    const contact = new Contact({ name, email, subject, message });
    await contact.save();

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
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(200);
    res.json(contacts);
  } catch (err) {
    console.error("Contact fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
