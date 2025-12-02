import React, { useState } from "react";
import FacultyHeader from "../components/FacultyHeader";
import FacultySidebar from "../components/FacultySidebar";
import FacultyFooter from "../components/FacultyFooter";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateTestSeries = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const payload = {
        ...data,
        createdBy: user?._id,
        createdByModel: user?.role || "faculty",
      };
      const res = await API.post("/api/tests/testseries", payload);
      console.log(data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Test series creation response:", data);
      queryClient.invalidateQueries(["testSeriesList"]);
      reset();
      navigate(`/faculty/add-questions/${data.test._id}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <FacultyHeader toggleSidebar={toggleSidebar} />
      <FacultySidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="pt-16 md:ml-64 px-4 md:px-6 flex-grow pb-20">
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Test Series
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">Subject</label>
              <input
                type="text"
                {...register("subject", { required: "Subject is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Duration (minutes)</label>
              <input
                type="number"
                {...register("duration", {
                  required: "Duration is required",
                  min: 1,
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium">Price (₹)</label>
              <input
                type="number"
                {...register("price", {
                  required: "Price is required",
                  min: 0,
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {mutation.isPending ? "Creating..." : "Create Test Series"}
            </button>
          </form>
        </div>
      </main>
      <FacultyFooter />
    </div>
  );
};

export default CreateTestSeries;
