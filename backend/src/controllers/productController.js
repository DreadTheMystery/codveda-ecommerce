const Product = require("../models/product");

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, image_url, category, stock } = req.body;
    if (!name || typeof price === "undefined") {
      return res.status(400).json({ error: "name and price required" });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image_url,
      category,
      stock,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    const [updatedRows] = await Product.update(updates, {
      where: { id: req.params.id },
      returning: true,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const product = await Product.findByPk(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    await product.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
