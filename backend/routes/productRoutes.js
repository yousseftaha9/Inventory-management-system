const express = require("express");

const {
  getAllProducts,
  getProduct,
  addProduct,
  patchProduct,
  deleteProduct,
} = require("../controllers/productController.js");

const auth = require("../middleware/requireAuth.js");

const router = express.Router();

router.use(auth);

router.get("/", getAllProducts);

router.get("/:id", getProduct);

router.post("/", addProduct);

router.patch("/:id", patchProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
