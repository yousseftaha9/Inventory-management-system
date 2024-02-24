const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: false },
    images: [{ type: String, required: false }],
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productsSchema);
module.exports = Products;
