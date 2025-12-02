import React, { useState } from "react";
import StudentHeader from "../components/StudentHeader";
import StudentSidebar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import { FaEdit } from "react-icons/fa";

const StudentProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const studentId = JSON.parse(localStorage.getItem("userInfo"))?._id;

  const { data: studentData, isLoading } = useQuery({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      const res = await API.get(`/api/students/${studentId}`);
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
      const res = await API.put(`/api/students/${studentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["studentProfile"]);
      setIsModalOpen(false);
    },
  });

  const handleEditClick = () => {
    if (studentData) {
      reset({
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
      });
      setIsModalOpen(true);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    if (data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }
    mutation.mutate(formData);
  };

  const defaultAvatar = "/default-avatar.png"; // Put default image in public folder

  return (
    <div className="min-h-screen bg-gray-100">
      <StudentHeader toggleSidebar={toggleSidebar} />
      <StudentSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="pt-16 md:ml-64 px-4 md:px-6">
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={
                  studentData?.avatar
                    ? `http://localhost:5000/${studentData.avatar}`
                    : defaultAvatar
                }
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-300 mb-4"
              />
              <h2 className="text-xl font-bold mb-1">{studentData?.name}</h2>
              <p className="text-gray-600">{studentData?.email}</p>
              <p className="text-gray-600">{studentData?.phone}</p>
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
      <StudentFooter />

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

export default StudentProfile;
