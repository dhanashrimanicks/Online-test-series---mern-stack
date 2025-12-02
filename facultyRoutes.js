const express = require("express");
const router = express.Router();
const {
  uploadAvatar,
  registerFaculty,
  updateFaculty,
  deleteFaculty,
  getAllfaculties,
  getFilteredFaculties,
  getFacultyById,
} = require("../controllers/facultyController");

// Avatar upload (must be before faculty register/update routes)
router.post("/upload-avatar", uploadAvatar);

// Register, update, and delete faculty routes
// router.get("/", getAllfaculties);
router.post("/register", registerFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);
router.get("/", getFilteredFaculties); // GET /api/faculties?name=...&specialization=...
router.get("/:id", getFacultyById);

module.exports = router;
