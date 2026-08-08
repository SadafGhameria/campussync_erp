import API from "./api";

// Get all students
export const getStudents = async (filters = {}) => {
  const response = await API.get("/students", {
    params: filters,
  });
  return response.data;
};

// Get single student
export const getStudentById = async (id) => {
  const response = await API.get(`/students/${id}`);
  return response.data;
};

// Add student
export const addStudent = async (studentData) => {
  const response = await API.post("/students", studentData);
  return response.data;
};

// Update student
export const updateStudent = async (id, studentData) => {
  const response = await API.put(`/students/${id}`, studentData);
  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await API.delete(`/students/${id}`);
  return response.data;
};