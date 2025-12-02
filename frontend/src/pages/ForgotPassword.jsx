import React from "react";
import { useForm } from "react-hook-form";
import API from "../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await API.post("/api/auth/forgot-password", { email });
      toast.success("Password reset link sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            {...register("email", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
