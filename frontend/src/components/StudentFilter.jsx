// src/components/FacultyFilter.jsx
import { useState, useEffect } from "react";

export default function StudentFilter({ onFilterChange }) {
  const [name, setName] = useState("");
  // const [specialization, setSpecialization] = useState("");

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onFilterChange({ name });
    }, 300); // wait 300ms after user stops typing

    // Cleanup function to cancel the timeout if user types again
    return () => clearTimeout(debounceTimeout);
  }, [name, onFilterChange]);

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Filter by Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
