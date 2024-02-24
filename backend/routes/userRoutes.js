const express = require("express");
const {
  register,
  remove,
  updateUser,
  login,
  verifyToken,
  getUser,
  refreshToken,
} = require("../controllers/userController.js");

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.delete("/remove/:username", remove);

router.patch("/update/:username/:password", updateUser);

router.get("/", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);

module.exports = router;
