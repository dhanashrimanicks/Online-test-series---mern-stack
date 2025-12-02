import React from "react";

const FacultyFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-gray-600 text-sm p-4 text-center shadow-inner">
      &copy; {new Date().getFullYear()} Faculty Dashboard. All rights reserved.
    </footer>
  );
};

export default FacultyFooter;
