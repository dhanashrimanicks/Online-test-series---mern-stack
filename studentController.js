const Student = require("../models/Student");
const fs = require("fs");
const path = require("path");
const generateToken = require("../utils/generateToken.js");
const bcrypt = require("bcryptjs");

// Multer upload middleware
const upload = require("../middlewares/uploadMiddleware");

// @desc Register a new student
// @route POST /api/students/register
const registerStudent = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const avatar = req.file ? req.file.path : null;

      // ✅ Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newStudent = new Student({
        name,
        email,
        password: hashedPassword, // Hash the password before saving
        phone,
        avatar,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await newStudent.save();
      res.status(201).json({
        success: true,
        message: "Student registered successfully!",
        student: {
          _id: newStudent._id,
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          avatar: newStudent.avatar,
          token: generateToken(newStudent._id),
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// @desc Update student profile (including avatar)
// @route PUT /api/students/:id
const updateStudent = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;

      let updatedStudentData = { name, email, phone, updatedAt: Date.now() };

      // Handle avatar update
      if (req.file) {
        const student = await Student.findById(id);
        if (student.avatar) {
          // Delete the old avatar if a new one is uploaded
          fs.unlinkSync(path.join(__dirname, "../", student.avatar));
        }

        updatedStudentData.avatar = req.file.path;
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        updatedStudentData,
        { new: true }
      );
      res.status(200).json({
        // success:true,
        message: "Student updated successfully!",
        student: updatedStudent,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// @desc Delete student profile (including avatar)
// @route DELETE /api/students/:id
deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (student.avatar) {
      // Delete the avatar file from local filesystem
      fs.unlinkSync(path.join(__dirname, "../", student.avatar));
    }

    await Student.findByIdAndDelete(id);
    res.status(200).json({
      // success: true,
      message: "Student deleted successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFilteredStudents = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };

    const students = await Student.find(query);
    res.status(200).json({ success: true, students });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to filter students" });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ success: true, message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Avatar upload endpoint
uploadAvatar = upload.single("avatar");

module.exports = {
  registerStudent,
  deleteStudent,
  updateStudent,
  uploadAvatar,
  getFilteredStudents,
  getStudentById,
};
