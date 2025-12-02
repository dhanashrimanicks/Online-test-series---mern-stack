const Admin = require("../models/Admin");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Multer upload middleware
const upload = require("../middlewares/uploadMiddleware");

// @desc Register a new admin
// @route POST /api/admin/register
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const avatar = req.file ? req.file.path : null;

    // Check for existing email
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword, // ✅ use hashed password
      phone,
      avatar,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      admin: newAdmin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update admin profile (including avatar)
// @route PUT /api/admin/:id
const updateAdmin = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      let updatedAdminData = { name, email, phone, updatedAt: Date.now() };

      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      // Handle avatar update
      if (req.file) {
        const admin = await Admin.findById(id);
        if (admin.avatar) {
          // Delete the old avatar if a new one is uploaded
          fs.unlinkSync(path.join(__dirname, "../", admin.avatar));
        }

        updatedAdminData.avatar = req.file.path;
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedAdminData, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Admin updated successfully!",
        admin: updatedAdmin,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// @desc Delete admin profile (including avatar)
// @route DELETE /api/admin/:id
deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (admin.avatar) {
      // Delete the avatar file from local filesystem
      fs.unlinkSync(path.join(__dirname, "../", admin.avatar));
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found!" });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Avatar upload endpoint
uploadAvatar = upload.single("avatar");

module.exports = {
  registerAdmin,
  deleteAdmin,
  updateAdmin,
  uploadAvatar,
  getAdminById,
};
