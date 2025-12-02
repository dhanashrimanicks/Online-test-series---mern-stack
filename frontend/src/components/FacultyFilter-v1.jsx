// src/components/FacultyFilter.jsx
import { useState } from "react";

export default function FacultyFilter({ onFilterChange }) {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ name, specialization });
  };

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Filter by Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleFilterChange();
        }}
      />
      <input
        type="text"
        placeholder="Filter by Specialization"
        value={specialization}
        onChange={(e) => {
          setSpecialization(e.target.value);
          handleFilterChange();
        }}
      />
    </div>
  );
}
