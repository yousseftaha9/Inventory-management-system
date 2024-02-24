const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel.js");

function createToken(_id) {
  const token = jwt.sign(
    {
      _id,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  return token;
}

const login = async function (req, res) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw Error("missing fields");
    }
    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
      throw Error("username not found");
    }
    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw Error("wrong password");
    }
    const token = createToken(user._id);

    if (req.cookies[`${user._id}`]) {
      req.cookies[`${user._id}`] = "";
    }

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 300),
      httpOnly: true,
      sameSite: "lax",
    });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const register = async function (req, res) {
  const { username, password, role } = req.body;

  try {
    if (!username || !password || !role) {
      throw Error("Missing fields");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error("Weak Password! Please enter another one");
    }
    const match = await User.find({ username: username });
    if (match.length > 0) {
      throw Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ username, password: hash, role });
    const token = createToken(user._id);
    if (req.cookies[`${user._id}`]) {
      req.cookies[`${user._id}`] = "";
    }

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 300),
      httpOnly: true,
      sameSite: "lax",
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const remove = async function (req, res) {
  const username = req.params.username;
  console.log(username);

  if (!username) {
    return res.status(400).json({ message: "Username is required!" });
  }
  try {
    const user = await User.findOneAndDelete({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "Deleted Successfully!", user });
  } catch (error) {
    console.log("Error In deleting a user from database : ", error);
  }
};

const updateUser = async function (req, res) {
  const username = req.params.username;
  const password = req.params.password;
  const newUserObject = req.body;
  console.log(newUserObject);
  try {
    if (
      !newUserObject.username ||
      !newUserObject.password ||
      !newUserObject.role
    ) {
      return res.status(400).json({ message: "Missing fields!" });
    }
    const match = await User.findOne({ username });
    if (!match) {
      return res.status(404).json({ message: "user not found" });
    }
    const newUsername = newUserObject.username;
    const isUsernameExisting = await User.findOne({ username: newUsername });
    if (isUsernameExisting) {
      return res.status(409).json({ message: "username already used" });
    }
    const passwordCheck = await bcrypt.compare(password, match.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "Wrong Password!" });
    }

    const isStrong = validator.isStrongPassword(newUserObject.password);
    if (!isStrong) {
      return res.status(422).json({
        message: "Weak password provided. Please enter a stronger one",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUserObject.password, salt);

    const newUser = await User.findOneAndUpdate(
      { username },
      {
        username: newUserObject.username,
        password: hash,
        role: newUserObject.role,
      }
    );
    res.status(200).json(newUser);
  } catch (error) {
    console.log("Error in updating the user details", error);
  }
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  console.log(token);
  // const { authorization } = req.headers;
  // const token = authorization.split(" ")[1];
  if (!token) {
    res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    console.log(user._id);
    req.id = user._id;
  });
  next();
};

const getUser = async (req, res, next) => {
  const userID = req.id;
  let user;
  try {
    user = await User.findById(userID, "-password");
  } catch (error) {
    return new Error(err);
  }
  if (!user) return res.status(404).json({ message: "User Not found" });
  return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  console.log(cookies);
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    console.log("Regenerated Token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 300), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }
  jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

module.exports = {
  register,
  remove,
  updateUser,
  login,
  verifyToken,
  getUser,
  refreshToken,
  logout,
};
