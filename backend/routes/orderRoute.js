const express = require("express");
const auth = require("../middleware/requireAuth");

const {
  addOrder,
  getOrders,
  getOrderByID,
  patchOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", addOrder);

router.use(auth);

router.get("/", getOrders);

router.get("/:id", getOrderByID);

router.patch("/:id", patchOrder);

router.delete("/:id", deleteOrder);

module.exports = router;
