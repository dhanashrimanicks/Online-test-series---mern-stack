const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  updateAdmin,
  deleteAdmin,
  uploadAvatar,
  getAdminById,
} = require("../controllers/adminController");

// Avatar upload (must be before admin register/update routes)
router.post("/upload-avatar", uploadAvatar);

// Register, update, and delete admin routes
router.post("/register", registerAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.get("/:id", getAdminById);

module.exports = router;
