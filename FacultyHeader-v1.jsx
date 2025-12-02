import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiMenu } from "react-icons/bi";

const FacultyHeader = ({ toggleSidebar }) => {
  const username = localStorage.getItem("facultyName") || "Username";
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("facultyName");
    localStorage.removeItem("facultyToken");
    toast.success("Logout successful");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white fixed top-0 w-full z-50 h-14 flex items-center px-4 shadow-md">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-3">
          {/* Hamburger only on small screens */}
          <button
            className="md:hidden text-2xl"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <BiMenu />
          </button>
          <div className="text-lg font-bold">Faculty Dashboard</div>
        </div>
        <div className="relative">
          <button
            className="flex items-center gap-2 hover:text-gray-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="font-semibold">{username}</span>
            <i className="bi bi-chevron-down"></i>
          </button>
          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-lg z-50">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </li>
              <hr />
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default FacultyHeader;
