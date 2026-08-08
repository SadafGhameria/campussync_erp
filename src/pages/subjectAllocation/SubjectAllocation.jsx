import { useEffect, useState } from "react";
import "./SubjectAllocation.css";

import SubjectAllocationForm from "./SubjectAllocationForm";
import SubjectAllocationTable from "./SubjectAllocationTable";

import {
  getAllocations,
  createAllocation,
  updateAllocation,
  deleteAllocation,
} from "../../services/subjectAllocationAPI";

function SubjectAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [search, setSearch] = useState("");

  // -------------------------
  // Fetch All Allocations
  // -------------------------

  const fetchAllocations = async () => {
    try {
      const res = await getAllocations();

      // Works whether backend returns:
      // [ ... ]
      // OR
      // { success:true, data:[ ... ] }

      if (Array.isArray(res.data)) {
        setAllocations(res.data);
      } else if (Array.isArray(res.data.data)) {
        setAllocations(res.data.data);
      } else {
        setAllocations([]);
      }
    } catch (error) {
      console.error("Error fetching allocations:", error);
      setAllocations([]);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // -------------------------
  // Save
  // -------------------------

  const handleSave = async (formData) => {
    try {
      if (editingAllocation) {
        await updateAllocation(editingAllocation._id, formData);
      } else {
        await createAllocation(formData);
      }

      setEditingAllocation(null);
      fetchAllocations();
    } catch (error) {
      console.error(error);
      alert("Unable to save allocation.");
    }
  };

  // -------------------------
  // Delete
  // -------------------------

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this allocation?"
    );

    if (!confirmDelete) return;

    try {
      await deleteAllocation(id);
      fetchAllocations();
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // Edit
  // -------------------------

  const handleEdit = (allocation) => {
    setEditingAllocation(allocation);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -------------------------
  // Search
  // -------------------------

  const filteredAllocations = Array.isArray(allocations)
    ? allocations.filter((item) => {
        const faculty =
          item.faculty?.user?.name?.toLowerCase() ||
          item.faculty?.name?.toLowerCase() ||
          "";

        const subject =
          item.subject?.toLowerCase() || "";

        return (
          faculty.includes(search.toLowerCase()) ||
          subject.includes(search.toLowerCase())
        );
      })
    : [];

  return (
    <div className="subject-allocation-page">

      {/* Page Header */}

      <div className="page-header">
        <h1>Subject Allocation</h1>

        <p>
          Allocate subjects to faculty members for timetable generation.
        </p>
      </div>

      {/* Form */}

      <SubjectAllocationForm
        onSave={handleSave}
        editingAllocation={editingAllocation}
      />

      {/* Allocation List */}

      <div className="allocation-list-section">

        <div className="allocation-list-header">

          <h2>Subject Allocations</h2>

          <input
            type="text"
            placeholder="Search faculty or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="allocation-search"
          />

        </div>

        <SubjectAllocationTable
          allocations={filteredAllocations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

    </div>
  );
}

export default SubjectAllocation;