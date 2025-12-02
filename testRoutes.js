const express = require("express");
const router = express.Router();
const {
  createTestSeries,
  addQuestion,
  getTestSeriesByFaculty,
  getQuestionsByTestSeriesId,
  deleteQuestion,
  updateQuestion,
  deleteTestSeriesAndQuestions,
} = require("../controllers/testController");

// Route to create a new test series
router.post("/testseries", createTestSeries);

// Route to add a new question to a test
router.post("/questions", addQuestion);

// GET test series by faculty
router.get("/testseries/faculty/:facultyId", getTestSeriesByFaculty);

router.get("/questions/:testId", getQuestionsByTestSeriesId);

router.route("/questions/:id").delete(deleteQuestion).put(updateQuestion);

// DELETE a test series and its questions
router.delete("/testseries/:id", deleteTestSeriesAndQuestions);

module.exports = router;
