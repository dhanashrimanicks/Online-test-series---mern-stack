const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSeries",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    subjectWiseAnalysis: [
      {
        subject: String,
        correct: Number,
        incorrect: Number,
        skipped: Number,
      },
    ],
    recommendedTopics: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
