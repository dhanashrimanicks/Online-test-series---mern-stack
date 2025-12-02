import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import toast
import API from "../api/axios";
import FacultyHeader from "../components/FacultyHeader";
import FacultySidebar from "../components/FacultySidebar";
import FacultyFooter from "../components/FacultyFooter";

const ManageQuestions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const { testId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["questions", testId],
    queryFn: async () => {
      const res = await API.get(`/api/tests/questions/${testId}`);
      return res.data.questions;
    },
    onError: () => {
      toast.error("Failed to load questions");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (questionId) => {
      await API.delete(`/api/tests/questions/${questionId}`);
    },
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries(["questions", testId]);
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...formData }) => {
      await API.put(`/api/tests/questions/${id}`, formData);
    },
    onSuccess: () => {
      toast.success("Question updated successfully");
      setEditingQuestion(null);
      queryClient.invalidateQueries(["questions", testId]);
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });

  const handleDelete = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    reset({
      questionText: q.questionText,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
    });
  };

  const onSubmit = (formData) => {
    const updatedData = {
      id: editingQuestion._id,
      questionText: formData.questionText,
      options: [
        formData.optionA,
        formData.optionB,
        formData.optionC,
        formData.optionD,
      ],
      correctAnswer: formData.correctAnswer,
      marks: Number(formData.marks),
      negativeMarks: Number(formData.negativeMarks),
    };
    updateMutation.mutate(updatedData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <FacultyHeader toggleSidebar={toggleSidebar} />
      <FacultySidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <main className="pt-16 md:ml-64 px-4 md:px-6 flex-grow pb-20">
        <div className="max-w-5xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Manage Questions
          </h2>

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error loading questions</p>
          ) : !Array.isArray(data) || data.length === 0 ? (
            <p className="text-center">No questions found.</p>
          ) : (
            <div className="space-y-6">
              {data.map((q) => (
                <div
                  key={q._id}
                  className="bg-white p-5 rounded-xl shadow-md space-y-3"
                >
                  <p className="font-semibold">{q.questionText}</p>
                  <ul className="list-disc list-inside">
                    {q.options.map((opt, idx) => (
                      <li key={idx}>
                        <strong>{String.fromCharCode(65 + idx)}:</strong> {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm">Correct Answer: {q.correctAnswer}</p>
                  <p className="text-sm text-gray-600">
                    Marks: {q.marks}, Negative: {q.negativeMarks}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEditModal(q)}
                      className="bg-yellow-600 text-black px-4 py-1 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h3 className="text-lg font-semibold">Edit Question</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                type="text"
                placeholder="Question Text"
                {...register("questionText")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option A"
                {...register("optionA")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option B"
                {...register("optionB")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option C"
                {...register("optionC")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Option D"
                {...register("optionD")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Correct Answer (A/B/C/D)"
                {...register("correctAnswer")}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Marks"
                {...register("marks")}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Negative Marks"
                {...register("negativeMarks")}
                className="w-full p-2 border rounded"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FacultyFooter />
    </div>
  );
};

export default ManageQuestions;
