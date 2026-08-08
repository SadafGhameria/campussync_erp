import API from "./axios";

// Load students
export const getAttendanceStudents = async (filters) => {
  const response = await API.get("/students", {
    params: {
      department: filters.department,
      semester: filters.semester,
      section: filters.section,
    },
  });

  return response.data.data;
};

// Save attendance
export const saveAttendance = async (attendanceData) => {
  const response = await API.post("/attendance", attendanceData);
  return response.data;
};