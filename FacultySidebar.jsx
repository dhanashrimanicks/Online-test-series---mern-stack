import React from "react";
import {
  BiUser,
  BiBed,
  BiBook,
  BiChat,
  BiCog,
  BiTask,
  BiGridAlt,
} from "react-icons/bi";
import { Link } from "react-router-dom";

const FacultySidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="hidden md:block fixed top-14 left-0 h-[calc(100vh-56px)] w-64 bg-gray-900 text-white p-4 z-40 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              to="/faculty/facultydashboard"
              className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <BiGridAlt /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/faculty/create-testseries"
              className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <BiTask /> Test Series
            </Link>
          </li>
          <li>
            <Link
              to="/faculty/my-test-series"
              className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
            >
              <BiTask /> View Test Series
            </Link>
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
                  to="/faculty/facultydashboard"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <BiGridAlt /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/faculty/create-testseries"
                  onClick={closeSidebar}
                  className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <BiTask /> Test Series
                </Link>
              </li>
              <li>
                <Link
                  to="/faculty/my-test-series"
                  className="flex items-center gap-3 p-2 rounded hover:bg-blue-600"
                >
                  <BiTask /> View Test Series
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      )}
    </>
  );
};

export default FacultySidebar;
