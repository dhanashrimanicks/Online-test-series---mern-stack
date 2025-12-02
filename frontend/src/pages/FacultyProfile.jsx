import React, { useState } from "react";
import FacultyHeader from "../components/FacultyHeader";
import FacultySidebar from "../components/FacultySidebar";
import FacultyFooter from "../components/FacultyFooter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { FaEdit } from "react-icons/fa";

const FacultyProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const facultyId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const { data: facultyData, isLoading } = useQuery({
    queryKey: ["facultyProfile"],
    queryFn: async () => {
      const res = await API.get(`/api/faculties/${facultyId}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      if (formData.avatar && formData.avatar[0]) {
        form.append("avatar", formData.avatar[0]); // ✅ Correctly append the File
      }

      return await API.put(`/api/faculties/${formData._id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["facultyProfile"]);
      setIsModalOpen(false);
    },
  });

  const handleEditClick = () => {
    if (facultyData) {
      reset({
        _id: facultyData._id,
        name: facultyData.name,
        email: facultyData.email,
        phone: facultyData.phone,
        specialization: facultyData.specialization,
        avatar: null,
      });
      setIsModalOpen(true);
    }
  };

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const defaultAvatar = "/default-avatar.png";

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader toggleSidebar={toggleSidebar} />
      <FacultySidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="pt-16 md:ml-64 px-4 md:px-6">
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={
                  facultyData?.avatar
                    ? `http://localhost:5000/${facultyData.avatar}`
                    : defaultAvatar
                }
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 mb-4"
              />
              <h2 className="text-xl font-bold mb-1">{facultyData?.name}</h2>
              <p className="text-gray-600">{facultyData?.email}</p>
              <p className="text-gray-600">{facultyData?.phone}</p>
              <p className="text-gray-600">
                Specialization: {facultyData?.specialization}
              </p>
              <button
                onClick={handleEditClick}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full flex items-center space-x-2 hover:bg-blue-700"
              >
                <FaEdit /> <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>
      </main>
      <FacultyFooter />

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="text-lg font-semibold">
              Edit Profile
            </Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("_id")} />
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block font-medium">Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block font-medium">Specialization</label>
                <input
                  type="text"
                  {...register("specialization", {
                    required: "Specialization is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.specialization && (
                  <p className="text-red-500 text-sm">
                    {errors.specialization.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("avatar")}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Update Profile
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default FacultyProfile;
