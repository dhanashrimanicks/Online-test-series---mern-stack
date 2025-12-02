import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
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
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: {
          type: String,
        },
      },
    ],
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);
