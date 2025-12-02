import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import API from "../api/axios";
import FacultyHeader from "../components/FacultyHeader";
import FacultySidebar from "../components/FacultySidebar";
import FacultyFooter from "../components/FacultyFooter";
import { toast } from "react-toastify";

const MyTestSeries = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const { data, isLoading, error } = useQuery({
    queryKey: ["myTestSeries"],
    queryFn: async () => {
      const res = await API.get(`/api/tests/testseries/faculty/${user._id}`);
      if (res.data.success === false) {
        throw new Error(res.data.message || "Failed to fetch test series");
      }
      return res.data.testSeries || [];
    },
    onError: (err) => {
      toast.error(err.message || "Error loading test series");
    },
  });

  const deleteTestSeriesMutation = useMutation({
    mutationFn: async (testId) => {
      const res = await API.delete(`/api/tests/testseries/${testId}`);
      if (res.data.success === false) {
        throw new Error(res.data.message || "Failed to delete test series");
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Test series deleted successfully");
      queryClient.invalidateQueries(["myTestSeries"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete test series");
    },
  });

  const handleDeleteTestSeries = (testId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this test series and all its questions?"
      )
    ) {
      deleteTestSeriesMutation.mutate(testId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <FacultyHeader toggleSidebar={toggleSidebar} />
      <FacultySidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <main className="pt-16 md:ml-64 px-4 md:px-6 flex-grow pb-20">
        <div className="max-w-5xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            My Test Series
          </h2>

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">
              Error loading test series
            </p>
          ) : data?.length === 0 ? (
            <p className="text-center">No test series found.</p>
          ) : (
            <div className="space-y-6">
              {data.map((test) => (
                <div
                  key={test._id}
                  className="bg-white p-5 rounded-xl shadow-md space-y-3"
                >
                  <h3 className="text-xl font-semibold">{test.title}</h3>
                  <p>{test.description}</p>
                  <p className="text-sm text-gray-600">
                    Subject: {test.subject}
                  </p>
                  <div className="flex gap-4 mt-4 flex-wrap">
                    <Link
                      to={`/faculty/add-questions/${test._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add More Questions
                    </Link>
                    <Link
                      to={`/faculty/manage-questions/${test._id}`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Manage Questions
                    </Link>
                    <button
                      onClick={() => handleDeleteTestSeries(test._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete Test Series
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <FacultyFooter />
    </div>
  );
};

export default MyTestSeries;
