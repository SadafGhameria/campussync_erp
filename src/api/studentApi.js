import API from "./axios";

// Get all students
export const getStudents = () => API.get("/students").then((response) => response.data.data);

// Create student
export const createStudent = (studentData) =>
  API.post("/students", studentData);

// Update student
export const updateStudent = (id, studentData) =>
  API.put(`/students/${id}`, studentData);

// Delete student
export const deleteStudent = (id) =>
  API.delete(`/students/${id}`);
