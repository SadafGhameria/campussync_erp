import { useEffect, useMemo, useState } from "react";
import "./components/Timetable.css";

import {
  Search,
  Plus,
  RefreshCcw,
} from "lucide-react";

import {
  getTimetables,
  deleteTimetable,
} from "../../services/timetableAPI";

// import {
//   getDepartments,
// } from "../../services/departmentService";
// import { getDepartments } from "../../services/departmentApi";
import { getDepartments } from "../../api/departmentApi";

import TimetableTable from "./components/TimetableTable";
import GenerateTimetableDrawer from "./components/GenerateTimetableDrawer";
import ViewTimetableDrawer from "./components/ViewTimetableDrawer";

function Timetable() {

  // ===============================
  // States
  // ===============================

  const [loading, setLoading] = useState(true);

  const [timetables, setTimetables] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("");

  const [semesterFilter, setSemesterFilter] =
    useState("");

  const [yearFilter, setYearFilter] =
    useState("");

  const [generateOpen, setGenerateOpen] =
    useState(false);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [selectedTimetable, setSelectedTimetable] =
    useState(null);

  // ===============================
  // Load Data
  // ===============================
const fetchData = async () => {
  try {
    setLoading(true);

    const [ttRes, departments] = await Promise.all([
      getTimetables(),
      getDepartments(),
    ]);

    setTimetables(ttRes.data.data || []);
    setDepartments(departments || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {

    fetchData();

  }, []);

  // ===============================
  // Search & Filters
  // ===============================

  const filteredTimetables =
    useMemo(() => {

      return timetables.filter(
        (item) => {

          const matchesSearch =
            item.department
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesDepartment =
            !departmentFilter ||
            item.department ===
              departmentFilter;

          const matchesSemester =
            !semesterFilter ||
            item.semester.toString() ===
              semesterFilter;

          const matchesYear =
            !yearFilter ||
            item.academicYear
              .toLowerCase()
              .includes(
                yearFilter.toLowerCase()
              );

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesSemester &&
            matchesYear
          );

        }
      );

    }, [
      timetables,
      search,
      departmentFilter,
      semesterFilter,
      yearFilter,
    ]);

  // ===============================
  // Actions
  // ===============================

  const handleView = (table) => {

    setSelectedTimetable(table);

    setViewOpen(true);

  };

  const handleRegenerate = (table) => {

    setSelectedTimetable(table);

    setGenerateOpen(true);

  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this timetable?"
      );

    if (!confirmDelete) return;

    try {

      await deleteTimetable(id);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to delete timetable."
      );

    }

  };

    // ===============================
  // UI
  // ===============================

  return (
    <div className="timetable-page">

      {/* ================= Header ================= */}

      <div className="page-header">

        <div>

          <h1>Timetable Management</h1>

          <p>
            Generate, view and manage class timetables.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={() => setGenerateOpen(true)}
        >
          <Plus size={18} />
          Generate Timetable
        </button>

      </div>

      {/* ================= Filters ================= */}

      <div className="filter-card">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Department */}

      <select
  value={departmentFilter}
  onChange={(e) => setDepartmentFilter(e.target.value)}
>
  <option value="">All Departments</option>

  {departments
    .filter((dept) => dept.status === "Active")
    .map((dept) => (
      <option
        key={dept._id}
        value={dept.code}
      >
        {dept.name}
      </option>
    ))}
</select>

        {/* Semester */}

        <select
          value={semesterFilter}
          onChange={(e) =>
            setSemesterFilter(e.target.value)
          }
        >

          <option value="">
            All Semesters
          </option>

          {[1,2,3,4,5,6,7,8].map((sem)=>(
            <option
              key={sem}
              value={sem}
            >
              Semester {sem}
            </option>
          ))}

        </select>

        {/* Academic Year */}

        <input
          type="text"
          placeholder="Academic Year"
          value={yearFilter}
          onChange={(e)=>
            setYearFilter(e.target.value)
          }
        />

        {/* Refresh */}

        <button
          className="refresh-btn"
          title="Refresh"
          onClick={fetchData}
        >

          <RefreshCcw size={18} />

        </button>

      </div>

      {/* ================= Table ================= */}

      <TimetableTable

        loading={loading}

        timetables={filteredTimetables}

        onView={handleView}

        onDelete={handleDelete}

        onRegenerate={handleRegenerate}

      />

      {/* ================= Generate Drawer ================= */}

      <GenerateTimetableDrawer

        open={generateOpen}

        onClose={() => {

          setGenerateOpen(false);

          setSelectedTimetable(null);

        }}

        timetable={selectedTimetable}

        onSuccess={fetchData}

      />

      {/* ================= View Drawer ================= */}

      <ViewTimetableDrawer

        open={viewOpen}

        timetable={selectedTimetable}

        onClose={() => {

          setViewOpen(false);

          setSelectedTimetable(null);

        }}

      />

    </div>
  );

}

export default Timetable;