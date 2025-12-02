import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import API from "../api/axios";

import FacultyHeader from "../components/FacultyHeader";
import FacultySidebar from "../components/FacultySidebar";
import FacultyFooter from "../components/FacultyFooter";

const AddQuestions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { testId } = useParams();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questionText: "",
      options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
      correctAnswer: "",
      explanation: "",
      marks: 1,
      negativeMarks: 0,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "options",
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        testId,
        options: data.options.map((opt) => opt.value), // Convert to string array
      };
      return await API.post("/api/tests/questions", payload);
    },
    onSuccess: () => {
      alert("Question added successfully!");
      reset({
        questionText: "",
        options: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        correctAnswer: "",
        explanation: "",
        marks: 1,
        negativeMarks: 0,
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <FacultyHeader toggleSidebar={toggleSidebar} />
      <FacultySidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <main className="pt-16 md:ml-64 px-4 md:px-6 flex-grow overflow-y-auto">
        <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Question to Test
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium">Question Text</label>
              <textarea
                {...register("questionText", {
                  required: "Question is required",
                })}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.questionText && (
                <p className="text-red-500 text-sm">
                  {errors.questionText.message}
                </p>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id}>
                <label className="block font-medium">
                  Option {String.fromCharCode(65 + index)}
                </label>
                <input
                  {...register(`options.${index}.value`, {
                    required: "Option is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.options?.[index]?.value && (
                  <p className="text-red-500 text-sm">
                    {errors.options[index].value.message}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block font-medium">Correct Answer</label>
              <select
                {...register("correctAnswer", {
                  required: "Correct answer is required",
                })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
              {errors.correctAnswer && (
                <p className="text-red-500 text-sm">
                  {errors.correctAnswer.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">
                Explanation (Optional)
              </label>
              <textarea
                {...register("explanation")}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Marks</label>
                <input
                  type="number"
                  {...register("marks", { required: "Marks required" })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.marks && (
                  <p className="text-red-500 text-sm">{errors.marks.message}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Negative Marks</label>
                <input
                  type="number"
                  {...register("negativeMarks")}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add Question
            </button>
          </form>
        </div>
      </main>

      <FacultyFooter />
    </div>
  );
};

export default AddQuestions;
