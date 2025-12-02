import React, { useState } from "react";
import API from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import { toast } from "react-toastify";
import {
  FaSpinner,
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelopeOpenText,
  FaTrashAlt,
} from "react-icons/fa";
import StudentFilter from "../components/StudentFilter";

const AllStudents = () => {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const [filters, setFilters] = useState({ name: "" });

  // const fetchStudents = async () => {
  //   const res = await API.get("/api/students/");
  //   return res.data.students;
  // };

  const fetchFilteredStudents = async () => {
    const { name } = filters;
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);

    const res = await API.get(`/api/students?${queryParams.toString()}`);
    return res.data.students;
  };

  // const { data: students = [], isLoading } = useQuery({
  //   queryKey: ["students"],
  //   queryFn: fetchStudents,
  // });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", filters],
    queryFn: fetchFilteredStudents,
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/api/students/${id}`),
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries(["students"]);
    },
    onError: () => {
      toast.error("Failed to delete student");
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      deleteStudentMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <AdminSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="pt-16 md:ml-64 px-4 md:px-6">
        <div className="mb-4">
          <StudentFilter onFilterChange={setFilters} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Avatar</th>
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Phone</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>

                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    <FaSpinner className="animate-spin inline mr-2" />
                    Loading students...
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-t">
                    <td className="px-4 py-2">
                      <img
                        src={
                          student.avatar
                            ? `http://localhost:5000/${student.avatar}`
                            : "/default-avatar.png"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-800">{student.name}</td>
                    <td className="px-4 py-2 text-gray-600">{student.phone}</td>
                    <td className="px-4 py-2 text-gray-600">{student.email}</td>

                    <td className="px-4 py-2 text-gray-600 space-x-2">
                      {/* <button
                        onClick={() => openEditModal(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button> */}
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 px-4 py-6"
                  >
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <AdminFooter />
    </div>
  );
};

export default AllStudents;
