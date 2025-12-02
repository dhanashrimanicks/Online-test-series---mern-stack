const asyncHandler = require("express-async-handler");
const TestSeries = require("../models/TestSeries");
const Question = require("../models/Question");

// @desc    Create a new test series
// @route   POST /api/testseries
// @access  Faculty/Admin
const createTestSeries = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      price,
      createdBy,
      createdByModel,
    } = req.body;

    if (!title || !subject || !duration || !createdBy || !createdByModel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const test = await TestSeries.create({
      title,
      description,
      subject,
      duration,
      price,
      createdBy,
      createdByModel,
      questions: [],
    });

    res.status(201).json({
      success: true,
      message: "Test series created successfully.",
      test,
    });
  } catch (error) {
    console.error("Create Test Series Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not create test series.",
    });
  }
};

// @desc    Add a question to a test series
// @route   POST /api/questions
// @access  Faculty/Admin
const addQuestion = async (req, res) => {
  try {
    const {
      testId,
      questionText,
      options,
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
    } = req.body;

    if (!testId || !questionText || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const newQuestion = await Question.create({
      testId,
      questionText,
      options,
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
    });

    await TestSeries.findByIdAndUpdate(testId, {
      $push: { questions: newQuestion._id },
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Add Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not add question.",
    });
  }
};

// @desc    Get test series created by a faculty
// @route   GET /api/tests/testseries/faculty/:facultyId
// @access  Private (Faculty only)
const getTestSeriesByFaculty = asyncHandler(async (req, res) => {
  const facultyId = req.params.facultyId;

  const tests = await TestSeries.find({ createdBy: facultyId }).sort({
    createdAt: -1,
  });

  if (!tests || tests.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No test series found for this faculty",
    });
  }

  res.status(200).json({
    success: true,
    testSeries: tests,
  });
});

// @desc    Get all questions for a test series
// @route   GET /api/tests/questions/:testId
// @access  Private
const getQuestionsByTestSeriesId = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const testSeries = await TestSeries.findById(testId).populate("questions");

  if (!testSeries) {
    return res.status(404).json({
      success: false,
      message: "Test Series not found",
    });
  }

  res.status(200).json({
    success: true,
    questions: testSeries.questions,
  });
});

// @desc    Delete a single question
// @route   DELETE /api/tests/questions/:id
// @access  Private
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  await question.deleteOne();

  res.status(200).json({
    success: true,
    message: "Question deleted successfully",
  });
});

// @desc    Update a single question
// @route   PUT /api/tests/questions/:id
// @access  Private
const updateQuestion = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswer, marks, negativeMarks } =
    req.body;

  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found",
    });
  }

  question.questionText = questionText;
  question.options = options;
  question.correctAnswer = correctAnswer;
  question.marks = marks;
  question.negativeMarks = negativeMarks;

  const updated = await question.save();

  res.status(200).json({
    success: true,
    message: "Question updated successfully",
    question: updated,
  });
});

// @desc    Delete a test series and all its questions
// @route   DELETE /api/tests/testseries/:id
// @access  Private
const deleteTestSeriesAndQuestions = asyncHandler(async (req, res) => {
  const testId = req.params.id;

  const testSeries = await TestSeries.findById(testId);
  if (!testSeries) {
    return res.status(404).json({
      success: false,
      message: "Test series not found",
    });
  }

  await testSeries.deleteOne();
  await Question.deleteMany({ testId });

  res.status(200).json({
    success: true,
    message: "Test series and all associated questions deleted successfully",
  });
});

module.exports = {
  createTestSeries,
  addQuestion,
  getTestSeriesByFaculty,
  getQuestionsByTestSeriesId,
  updateQuestion,
  deleteQuestion,
  deleteTestSeriesAndQuestions,
};
