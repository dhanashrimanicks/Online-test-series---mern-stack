import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";
import { toast } from "react-toastify";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelopeOpenText,
  FaTrashAlt,
  FaSpinner,
  FaEdit,
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import FacultyFilter from "../components/FacultyFilter";

const fetchFaculties = async () => {
  const res = await API.get("/api/faculties/");
  return res.data.faculties;
};

const CreateFaculties = () => {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ name: "", specialization: "" });
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    avatar: null,
  });

  const fetchFilteredFaculties = async () => {
    const { name, specialization } = filters;
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (specialization) queryParams.append("specialization", specialization);
    const res = await API.get(`/api/faculties?${queryParams.toString()}`);
    return res.data.faculties;
  };

  // const { data: faculties = [], isLoading } = useQuery({
  //   queryKey: ["faculties"],
  //   queryFn: fetchFaculties,
  // });

  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ["faculties", filters],
    queryFn: fetchFilteredFaculties,
  });

  const { mutate: addFacultyMutation, isPending: isAdding } = useMutation({
    mutationFn: async (data) => {
      const form = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          form.append(key, value);
        }
      });
      return await API.post("/api/faculties/register", form);
    },
    onSuccess: () => {
      toast.success("Faculty added successfully!");
      queryClient.invalidateQueries(["faculties"]);
    },
    onError: () => toast.error("Failed to add faculty."),
  });

  const { mutate: updateFacultyMutation, isPending: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });
      return await API.put(`/api/faculties/${formData._id}`, form);
    },
    onSuccess: () => {
      toast.success("Faculty updated successfully!");
      queryClient.invalidateQueries(["faculties"]);
    },
    onError: () => toast.error("Failed to update faculty."),
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/api/faculties/${id}`),
    onSuccess: () => {
      toast.success("Faculty deleted successfully!");
      queryClient.invalidateQueries(["faculties"]);
    },
    onError: () => toast.error("Failed to delete faculty."),
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      _id: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      avatar: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setEditMode(true);
    setFormData({
      ...faculty,
      password: "",
      avatar: null,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);
    const action = editMode ? updateFacultyMutation : addFacultyMutation;
    action(formData, {
      onSettled: () => {
        setIsModalOpen(false);
        // setLoading(false);
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      deleteFacultyMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <AdminSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="pt-16 md:ml-64 px-4 md:px-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            Add Faculty
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editMode ? "Edit Faculty" : "Add Faculty"}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-3 py-2 border rounded"
                  required={!editMode}
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="Specialization"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    disabled={isAdding || isUpdating}
                  >
                    {(isAdding || isUpdating) && (
                      <FaSpinner className="animate-spin mr-2" />
                    )}
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Faculty Filter */}
        <div className="mb-4">
          <FacultyFilter onFilterChange={setFilters} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Avatar</th>
                <th className="px-4 py-2 text-left text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-gray-600">Phone</th>
                <th className="px-4 py-2 text-left text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-gray-600">
                  Specialization
                </th>
                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    <FaSpinner className="animate-spin inline mr-2" />
                    Loading faculties...
                  </td>
                </tr>
              ) : (
                faculties.map((faculty) => (
                  <tr key={faculty._id} className="border-t">
                    <td className="px-4 py-2">
                      <img
                        src={
                          faculty.avatar
                            ? `http://localhost:5000/${faculty.avatar}`
                            : "/default-avatar.png"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-800">{faculty.name}</td>
                    <td className="px-4 py-2 text-gray-600">{faculty.phone}</td>
                    <td className="px-4 py-2 text-gray-600">{faculty.email}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {faculty.specialization}
                    </td>
                    <td className="px-4 py-2 text-gray-600 space-x-2">
                      <button
                        onClick={() => openEditModal(faculty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {faculties.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 px-4 py-6"
                  >
                    No faculty records found.
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

export default CreateFaculties;
