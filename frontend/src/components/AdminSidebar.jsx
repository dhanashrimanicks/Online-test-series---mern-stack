import React, { useState } from "react";
import {
  BiUser,
  BiBed,
  BiBook,
  BiChat,
  BiCog,
  BiTask,
  BiGridAlt,
  BiChevronDown,
} from "react-icons/bi";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isOpen, closeSidebar }) => {
  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  const toggleFacultyDropdown = () => {
    setFacultyDropdownOpen(!facultyDropdownOpen);
  };

  const toggleStudentDropdown = () => {
    setStudentDropdownOpen(!studentDropdownOpen);
  };

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden md:block fixed top-14 left-0 h-[calc(100vh-56px)] w-64 bg-gray-900 text-white p-4 z-40 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/admindashboard"
              className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <BiGridAlt /> Dashboard
            </Link>
          </li>

          <li>
            <button
              onClick={toggleFacultyDropdown}
              className="w-full flex justify-between items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <span className="flex items-center gap-3">
                <BiTask /> Faculties
              </span>
              <BiChevronDown
                className={`transform transition-transform ${
                  facultyDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {facultyDropdownOpen && (
              <ul className="ml-6 mt-1 bg-gray-800 rounded">
                <li>
                  <Link
                    to="/admin/createfaculties"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    Add Faculty
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={toggleStudentDropdown}
              className="w-full flex justify-between items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <span className="flex items-center gap-3">
                <BiTask /> Students
              </span>
              <BiChevronDown
                className={`transform transition-transform ${
                  facultyDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {studentDropdownOpen && (
              <ul className="ml-6 mt-1 bg-gray-800 rounded">
                <li>
                  <Link
                    to="/admin/students"
                    className="block px-4 py-2 hover:bg-blue-700 rounded"
                  >
                    All Student
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        >
          <aside
            className="absolute top-14 left-0 w-full bg-gray-900 text-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/admindashboard"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <BiGridAlt /> Dashboard
                </Link>
              </li>

              <li>
                <button
                  onClick={toggleFacultyDropdown}
                  className="w-full flex justify-between items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <BiTask /> Faculties
                  </span>
                  <BiChevronDown
                    className={`transform transition-transform ${
                      facultyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {facultyDropdownOpen && (
                  <ul className="ml-6 mt-1 bg-gray-800 rounded">
                    <li>
                      <Link
                        to="/admin/createfaculties"
                        onClick={closeSidebar}
                        className="block px-4 py-2 hover:bg-blue-700 rounded"
                      >
                        Add Faculty
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <button
                  onClick={toggleStudentDropdown}
                  className="w-full flex justify-between items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <BiTask /> Students
                  </span>
                  <BiChevronDown
                    className={`transform transition-transform ${
                      studentDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {studentDropdownOpen && (
                  <ul className="ml-6 mt-1 bg-gray-800 rounded">
                    <li>
                      <Link
                        to="/admin/student"
                        onClick={closeSidebar}
                        className="block px-4 py-2 hover:bg-blue-700 rounded"
                      >
                        All Students
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
