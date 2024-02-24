const Products = require("../models/productsModel");

const getAllProducts = async function (req, res) {
  try {
    const products = await Products.find();
    if (products.length === 0) {
      res.status(404).json({ mssg: "no products found" });
    }
    return res.status(200).json({ products });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const addProduct = async function (req, res) {
  const newProduct = req.body;
  const name = newProduct.name;
  try {
    const match = await Products.findOne({ name });
    if (match) {
      return res.status(409).json({
        message:
          "This product already exists, if it is not, then change the name",
      });
    }
    const product = await Products.create(newProduct);
    return res.status(201).json(product);
  } catch (error) {
    console.log("Error in adding a new product", error.message);
  }
};

const getProduct = async function (req, res) {
  const _id = req.params.id;
  console.log(_id);
  try {
    const product = await Products.findById({ _id });
    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.log("Error getting product", error.message);
    return res.status(500).json(error);
  }
};

const patchProduct = async function (req, res) {
  const _id = req.params.id;
  const newProduct = req.body;
  try {
    const product = await Products.findByIdAndUpdate(_id, newProduct);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "The product was not found." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteProduct = async function (req, res) {
  const _id = req.params.id;
  try {
    const product = await Products.findOneAndDelete({ _id });
    if (!product) {
      return res.status(400).send("Invalid ID");
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  getProduct,
  patchProduct,
  deleteProduct,
};
