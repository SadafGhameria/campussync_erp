import { useEffect, useState } from "react";
import { getFaculty } from "../../services/subjectAllocationAPI";

function SubjectAllocationForm({ onSave, editingAllocation }) {
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    faculty: "",
    department: "",
    subject: "",
    semester: "",
    division: "",
    lecturesPerWeek: "",
    lectureType: "Theory",
  });

  // ----------------------------
  // Fetch Faculty
  // ----------------------------

const fetchFaculty = async () => {
  try {
    const res = await getFaculty();

    console.log("Full Response:", res);
    console.log("Response Data:", res.data);

    setFaculty(Array.isArray(res.data.data) ? res.data.data : []);
  } catch (error) {
    console.error("Faculty API Error:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    }

    setFaculty([]);
  }
};

useEffect(() => {
  fetchFaculty();
}, []);
  // ----------------------------
  // Fill form while editing
  // ----------------------------

  useEffect(() => {
    if (editingAllocation) {
      setFormData({
        faculty: editingAllocation.faculty?._id || "",
        department: editingAllocation.department,
        subject: editingAllocation.subject,
        semester: editingAllocation.semester,
        division: editingAllocation.division,
        lecturesPerWeek: editingAllocation.lecturesPerWeek,
        lectureType: editingAllocation.lectureType,
      });
    }
  }, [editingAllocation]);

  // ----------------------------
  // Handle Change
  // ----------------------------

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "faculty") {
    const selectedFaculty = faculty.find((f) => f._id === value);

    setFormData((prev) => ({
      ...prev,
      faculty: value,
      department: selectedFaculty?.branch || "",
      subject: "",
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  // ----------------------------
  // Submit
  // ----------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.faculty ||
      !formData.department ||
      !formData.subject ||
      !formData.semester ||
      !formData.division ||
      !formData.lecturesPerWeek
    ) {
      return alert("Please fill all fields.");
    }

    onSave(formData);

    setFormData({
      faculty: "",
      department: "",
      subject: "",
      semester: "",
      division: "",
      lecturesPerWeek: "",
      lectureType: "Theory",
    });
  };

  return (
    <form
      className="allocation-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {editingAllocation
          ? "Update Subject Allocation"
          : "New Subject Allocation"}
      </h2>

      {/* Faculty */}

<select
  name="faculty"
  value={formData.faculty}
  onChange={handleChange}
>
  <option value="">Select Faculty</option>

  {faculty.map((item) => (
    <option key={item._id} value={item._id}>
      {item.user?.name}
    </option>
  ))}
</select>

      {/* Department */}

<select
  name="department"
  value={formData.department}
  onChange={handleChange}
>
  <option value="">Select Department</option>
  <option value="IT">IT</option>
  <option value="Computer">Computer Engineering</option>
  <option value="AIDS">AI & DS</option>
  <option value="AIML">AI & ML</option>
  <option value="EXTC">EXTC</option>
  <option value="Mechanical">Mechanical</option>
  <option value="Civil">Civil</option>
</select>

      {/* Subject */}

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
      />

      {/* Semester */}

      <select
        name="semester"
        value={formData.semester}
        onChange={handleChange}
      >
        <option value="">Semester</option>

      {[
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
].map((sem, index) => (
  <option key={index + 1} value={index + 1}>
    Semester {sem}
  </option>
))}
      </select>

      {/* Division */}

      <select
        name="division"
        value={formData.division}
        onChange={handleChange}
      >
        <option value="">Division</option>

        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>

      {/* Lectures */}

      <input
        type="number"
        name="lecturesPerWeek"
        placeholder="Lectures Per Week"
        value={formData.lecturesPerWeek}
        onChange={handleChange}
      />

      {/* Lecture Type */}

      <select
        name="lectureType"
        value={formData.lectureType}
        onChange={handleChange}
      >
        <option>Theory</option>
        <option>Lab</option>
      </select>

      <button type="submit">
        {editingAllocation
          ? "Update Allocation"
          : "Save Allocation"}
      </button>
    </form>
  );
}

export default SubjectAllocationForm;