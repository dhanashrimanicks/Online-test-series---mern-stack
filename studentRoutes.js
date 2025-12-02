const express = require("express");
const router = express.Router();
const {
  deleteStudent,
  uploadAvatar,
  registerStudent,
  updateStudent,
  getFilteredStudents,
  getStudentById,
} = require("../controllers/studentController");

// Avatar upload (must be before student register/update routes)
router.post("/upload-avatar", uploadAvatar);

// Register, update, and delete student routes
router.post("/register", registerStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/", getFilteredStudents);
router.get("/:id", getStudentById);

module.exports = router;
