// /controllers/authController.js
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Faculty = require("../models/Faculty.js");
const Admin = require("../models/Admin.js");
const Student = require("../models/Student.js");
// const generateToken = require("../utils/generateToken.js");
const { sendResetPasswordEmail } = require("../services/emailService.js");

dotenv.config({ path: "./config.env" });

// ==========================
// Generate Access Token
// ==========================
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// ==========================
// Generate Refresh Token
// ==========================
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ==========================
// Login for Student / Admin / Faculty
// ==========================
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  let user =
    (await Student.findOne({ email })) ||
    (await Admin.findOne({ email })) ||
    (await Faculty.findOne({ email }));

  if (user && (await bcrypt.compare(password, user.password))) {
    const role =
      user.role ||
      (user instanceof Faculty
        ? "faculty"
        : user instanceof Admin
        ? "admin"
        : "student");

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refreshToken as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role,
      accessToken,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// ==========================
// Refresh Access Token
// ==========================
const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user =
      (await Student.findById(decoded.id)) ||
      (await Admin.findById(decoded.id)) ||
      (await Faculty.findById(decoded.id));

    if (!user) return res.sendStatus(403);

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};

// ==========================
// Logout
// ==========================
const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use secure in production
    sameSite: "Strict",
  });
  res.sendStatus(200);
};

// ==========================
// Forgot Password
// ==========================
const generateResetToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user =
    (await Student.findOne({ email })) ||
    (await Admin.findOne({ email })) ||
    (await Faculty.findOne({ email }));

  if (!user) return res.status(404).json({ message: "User not found" });

  const role =
    user instanceof Faculty
      ? "faculty"
      : user instanceof Admin
      ? "admin"
      : "student";

  const token = generateResetToken(user._id, role);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await sendResetPasswordEmail(email, user.name, resetLink);

  res.json({ success: true, message: "Password reset link sent to email." });
};

// ==========================
// Reset Password
// ==========================
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    const model =
      role === "admin" ? Admin : role === "faculty" ? Faculty : Student;
    const user = await model.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
};
