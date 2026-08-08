import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

import FacultyDrawer from "./FacultyDrawer";
import FacultyTable from "./FacultyTable";

import { getFaculty } from "../../api/facultyApi";

import "../students/StudentList.css";

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");

  const [branch, setBranch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFaculty = async () => {
    try {
      setLoading(true);

      const data = await getFaculty({
        branch,
      });

      setFaculty(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load faculty."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, [branch]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const text = `
        ${f.user?.name}
        ${f.user?.email}
        ${f.employeeId}
        ${f.branch}
        ${f.designation}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [faculty, search]);

  return (
    <div className="student-page">

      <div className="student-header">

        <div>
          <h1>Faculty Management</h1>
          <p>Manage all faculty members.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditingFaculty(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={18} />
          Add Faculty
        </button>

      </div>

      <FacultyDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        faculty={editingFaculty}
        onSaved={loadFaculty}
      />

      <div className="toolbar">

        <div className="search-box">
          <Search size={18} />

          <input
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="">All Branches</option>
          <option value="IT">IT</option>
          <option value="Computer">Computer</option>
          <option value="AI&DS">AI&DS</option>
          <option value="EXTC">EXTC</option>
        </select>

        <button
          className="export-btn"
          onClick={loadFaculty}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <FacultyTable
        faculty={filteredFaculty}
        loading={loading}
        onEdit={(faculty) => {
          setEditingFaculty(faculty);
          setDrawerOpen(true);
        }}
        onRefresh={loadFaculty}
      />

    </div>
  );
}

export default FacultyList;