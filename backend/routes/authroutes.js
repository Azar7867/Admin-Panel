const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  register,
  login,
  getUsers,
  getCurrentUser,
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.get("/users", auth, getUsers);

router.get("/me", auth, getCurrentUser);

module.exports = router;
