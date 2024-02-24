import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  sales: { type: Number, required: true },
  return: { type: Number, required: true },
  netTurnOver: { type: Number, required: true },
});

const Stocks = mongoose.model("Stocks", stockSchema);
module.exports = Stocks;
