import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { generateTimetable } from "../../../services/timetableAPI";
import { getDepartments } from "../../../api/departmentApi";

function GenerateTimetableDrawer({
  open,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [formData, setFormData] = useState({
    institutionCode: "532",
    department: "",
    semester: "",
    division: "",
    academicYear: "2026-27",
  });

  useEffect(() => {
    if (!open) return;

    loadDepartments();
  }, [open]);

  const loadDepartments = async () => {
    try {
      const departments = await getDepartments();

      setDepartments(departments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "department") {
      const dept = departments.find(
        (d) => d.code === value
      );

      setSelectedDepartment(dept || null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await generateTimetable(formData);

      alert("Timetable generated successfully.");

      onSuccess();

      onClose();

      setFormData({
        institutionCode: "532",
        department: "",
        semester: "",
        division: "",
        academicYear: "2026-27",
      });

      setSelectedDepartment(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to generate timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="drawer-overlay">
      <div className="generate-drawer">

        <div className="drawer-header">
          <div>
            <h2>Generate Timetable</h2>
            <p>
              Automatically generate a weekly timetable.
            </p>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="drawer-form"
          onSubmit={handleGenerate}
        >

          <div className="form-group">
            <label>Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Department
              </option>

              {departments
                .filter(
                  (dept) =>
                    dept.status === "Active"
                )
                .map((dept) => (
                  <option
                    key={dept._id}
                    value={dept.code}
                  >
                    {dept.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester</label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Semester
              </option>

              {selectedDepartment
                ? Array.from({
                    length:
                      selectedDepartment.totalSemesters || 8,
                  }).map((_, index) => (
                    <option
                      key={index + 1}
                      value={index + 1}
                    >
                      Semester {index + 1}
                    </option>
                  ))
                : [1,2,3,4,5,6,7,8].map((sem) => (
                    <option
                      key={sem}
                      value={sem}
                    >
                      Semester {sem}
                    </option>
                  ))}
            </select>
          </div>

          <div className="form-group">
            <label>Division</label>

            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Division
              </option>

              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year</label>

            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
            />
          </div>

          <div className="drawer-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="generate-btn"
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "Generate Timetable"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default GenerateTimetableDrawer;