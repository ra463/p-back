const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/myprofile", auth, getProfile);

module.exports = router;
