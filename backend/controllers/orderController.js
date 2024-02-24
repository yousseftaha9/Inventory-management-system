const Orders = require("../models/ordersModel");

const addOrder = async function (req, res) {
  const orderDetails = req.body;
  try {
    const order = await Orders.create(orderDetails);
    if (!order._id) throw new Error("Failed to create Order");
    return res.status(201).json({ order });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

const getOrders = async function (req, res) {
  try {
    let orders = await Orders.find();
    if (orders.length == 0) {
      throw Error("No orders found");
    }
    res.status(201).json(orders);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const getOrderByID = async function (req, res) {
  const id = req.params.id;
  try {
    const order = await Orders.findById(id);
    if (!order) throw new Error(`Order with the id ${id} not found`);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const patchOrder = async function (req, res) {
  const id = req.params.id;
  const { newStatus, newTotalAmount } = req.body;
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(id, {
      status: newStatus,
      totalAmount: newTotalAmount,
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(401).json({ message: "error in updating an order" });
  }
};

const deleteOrder = async function (req, res) {
  const id = req.params.id;
  try {
    const deletedOrder = await Orders.findByIdAndDelete(id);
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(401).json({ message: "error in deleting an order" });
  }
};

module.exports = { addOrder, getOrders, getOrderByID, patchOrder, deleteOrder };
