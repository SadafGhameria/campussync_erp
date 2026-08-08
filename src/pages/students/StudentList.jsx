import "./StudentList.css";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import StudentDrawer from "./StudentDrawer";
import { deleteStudent, getStudents } from "../../api/studentApi";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents({
        department,
        division,
        semester,
      });

      setStudents(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load students. Please log in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [department, division, semester]);

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const text = `
      ${student.firstName}
      ${student.lastName}
      ${student.studentId}
      ${student.department}
      ${student.division}
      ${student.semester}
      `
        .toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [students, search]);

  const remove = async (student) => {
    if (!window.confirm(`Delete ${student.firstName} ${student.lastName}?`))
      return;

    try {
      await deleteStudent(student._id);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete student.");
    }
  };

  return (
    <div className="student-page">
      <div className="student-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage all students from one place.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditingStudent(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <StudentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        student={editingStudent}
        onSaved={loadStudents}
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="Computer">Computer</option>
          <option value="EXTC">EXTC</option>
          <option value="Mechanical">Mechanical</option>
        </select>

        <select value={division} onChange={(e) => setDivision(e.target.value)}>
          <option value="">All Divisions</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">All Semesters</option>

          {[1,2,3,4,5,6,7,8].map((sem)=>(
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        <button className="export-btn" onClick={loadStudents}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Division</th>
              <th>Semester</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading students...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9">No students found.</td>
              </tr>
            ) : (
              filtered.map((student) => {
                const name = `${student.firstName} ${student.lastName}`;

                return (
                  <tr key={student._id}>
                    <td>
                      <img
                        className="student-avatar"
                        src={
                          student.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            name
                          )}&background=2563eb&color=fff`
                        }
                        alt={name}
                      />
                    </td>

                    <td>{student.studentId}</td>

                    <td>{name}</td>

                    <td>{student.department}</td>

                    <td>{student.division}</td>

                    <td>{student.semester}</td>

                    <td>
                      <span
                        className={`attendance ${
                          student.attendance >= 75 ? "good" : "low"
                        }`}
                      >
                        {student.attendance}%
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          student.status === "Active"
                            ? "active"
                            : "alert"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setDrawerOpen(true);
                          }}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => remove(student)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;