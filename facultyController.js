const Faculty = require("../models/Faculty");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
// Multer upload middleware
const upload = require("../middlewares/uploadMiddleware");
const { sendRegistrationEmail } = require("../services/emailService");

// @desc Register a new faculty
// @route POST /api/faculty/register
const registerFaculty = [
  upload.single("avatar"), // First: handles form + file
  async (req, res) => {
    try {
      const { name, email, password, phone, specialization } = req.body;
      const avatar = req.file ? req.file.path : null;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const demail = "umidphp.akshay@gmail.com";

      const newFaculty = new Faculty({
        name,
        email,
        password: hashedPassword, // (Tip: hash this later)
        phone,
        specialization,
        avatar,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await newFaculty.save();
      // Email logic now abstracted away
      await sendRegistrationEmail(demail, name, password);
      res.status(201).json({
        success: true,
        message: "Faculty registered successfully!",
        faculty: {
          _id: newFaculty._id,
          name: newFaculty.name,
          email: newFaculty.email,
          phone: newFaculty.phone,
          specialization: newFaculty.specialization,
          avatar: newFaculty.avatar,
          token: generateToken(newFaculty._id),
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];
// @desc Update faculty profile (including avatar)
// @route PUT /api/faculty/:id
const updateFaculty = [
  upload.single("avatar"), //this is giving error
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, specialization } = req.body;
      const avatar = req.file ? req.file.path : null;

      let updatedFacultyData = {
        name,
        email,
        phone,
        specialization,
        updatedAt: Date.now(),
      };

      // Handle avatar update
      if (req.file) {
        const faculty = await Faculty.findById(id);
        if (faculty.avatar) {
          // Delete the old avatar if a new one is uploaded
          fs.unlinkSync(path.join(__dirname, "../", faculty.avatar));
        }

        updatedFacultyData.avatar = req.file.path;
      }

      const updatedFaculty = await Faculty.findByIdAndUpdate(
        id,
        updatedFacultyData,
        { new: true }
      );
      res.status(200).json({
        // success:true,
        message: "Faculty updated successfully!",
        faculty: updatedFaculty,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// @desc Delete faculty profile (including avatar)
// @route DELETE /api/faculty/:id
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id);

    if (faculty.avatar) {
      // Delete the avatar file from local filesystem
      fs.unlinkSync(path.join(__dirname, "../", faculty.avatar));
    }

    await Faculty.findByIdAndDelete(id);
    res.status(200).json({
      // success:true,
      message: "Faculty deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllfaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      faculties,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch faculty details!" });
  }
};

// controllers/facultyController.js
const getFilteredFaculties = async (req, res) => {
  try {
    const { name, specialization } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (specialization)
      query.specialization = { $regex: specialization, $options: "i" };

    const faculties = await Faculty.find(query);
    res.status(200).json({ success: true, faculties });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to filter faculties" });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found!" });
    }
    res.status(200).json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Avatar upload endpoint
uploadAvatar = upload.single("avatar");

module.exports = {
  registerFaculty,
  deleteFaculty,
  updateFaculty,
  uploadAvatar,
  getAllfaculties,
  getFilteredFaculties,
  getFacultyById,
};
