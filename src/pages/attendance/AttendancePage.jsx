import { useState } from "react";
import { Search } from "lucide-react";
import "./AttendancePage.css";
import {
  getAttendanceStudents,
  saveAttendance,
} from "../../api/attendanceApi";

function AttendancePage() {
 const [filters, setFilters] = useState({
  department: "",
  semester: "",
  section: "",
  subject: "",
  date: new Date().toISOString().split("T")[0],
});
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loadStudents = async () => {
    if (!filters.department || !filters.semester || !filters.section) {
      alert("Please select Department, Semester and Section.");
      return;
    }

    try {
      const data = await getAttendanceStudents(filters);

      const attendanceList = data.map((student) => ({
        ...student,
        present: true,
      }));

      setStudents(attendanceList);
    } catch (err) {
      console.error(err);
      alert("Unable to load students.");
    }
  };

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === id
          ? { ...student, present: !student.present }
          : student
      )
    );
  };
const handleSaveAttendance = async () => {
  if (!filters.subject.trim()) {
    alert("Please enter the subject.");
    return;
  }

  if (students.length === 0) {
    alert("Load students first.");
    return;
  }

  try {
    const payload = {
      department: filters.department,
      semester: Number(filters.semester),
      section: filters.section,
      subject: filters.subject,
      date: filters.date,
      students: students.map((student) => ({
        studentId: student._id,
        status: student.present ? "Present" : "Absent",
      })),
    };

    const response = await saveAttendance(payload);

    alert(response.message);

    setStudents([]);
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to save attendance."
    );
  }
};

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Mark and manage student attendance.</p>
        </div>
      </div>

      <div className="attendance-card">
        <div className="attendance-grid">
          {/* Branch */}
          <div className="form-group">
            <label>Department</label>
            <select
              name="Department"
              value={filters.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Computer">Computer</option>
              <option value="IT">IT</option>
              <option value="AI&DS">AI & DS</option>
              <option value="EXTC">EXTC</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>

          {/* Semester */}
          <div className="form-group">
            <label>Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Section/Division */}
          <div className="form-group">
            <label>Section</label>
            <select
              name="section"
              value={filters.section}
              onChange={handleChange}
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Subject */}
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter Subject"
              value={filters.subject}
              onChange={handleChange}
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
            />
          </div>
        </div>

 <button
  className="load-btn"
  onClick={handleSaveAttendance}
  disabled={students.length === 0}
>
  Save Attendance
</button>

        {students.length > 0 && (
          <div className="student-table">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Present</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>

                    <td>
                      {student.firstName} {student.lastName}
                    </td>

                    <td>
                     <label className="switch">
  <input
    type="checkbox"
    checked={student.present}
    onChange={() => toggleAttendance(student._id)}
  />
  <span>
    {student.present ? "Present" : "Absent"}
  </span>
</label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button className="load-btn">
                Save Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;