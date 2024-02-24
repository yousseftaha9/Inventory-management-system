const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: Number, required: true },
      country: { type: String, required: true },
    },
  },
  items: [
    {
      productID: { type: Number, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: String, required: true },
  status: { type: String, required: true },
});

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;
