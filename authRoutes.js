// /routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  loginUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
} = require("../controllers/authController");

// Student/Admin/Faculty Login
router.post("/login", loginUser);

// Refresh access token using HttpOnly cookie
router.post("/refresh", refreshAccessToken);

// Logout and clear cookie
router.post("/logout", logoutUser);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
