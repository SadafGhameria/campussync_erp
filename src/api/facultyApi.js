import API from "./axios";

// Get All Faculty
export const getFaculty = async (params = {}) => {
  const response = await API.get("/faculty", { params });
  return response.data.data;
};

// Get Faculty By ID
export const getFacultyById = async (id) => {
  const response = await API.get(`/faculty/${id}`);
  return response.data.data;
};

// Create Faculty
export const createFaculty = async (facultyData) => {
  const response = await API.post("/faculty", facultyData);
  return response.data.data;
};

// Update Faculty
export const updateFaculty = async (id, facultyData) => {
  const response = await API.put(`/faculty/${id}`, facultyData);
  return response.data.data;
};

// Delete Faculty
export const deleteFaculty = async (id) => {
  const response = await API.delete(`/faculty/${id}`);
  return response.data;
};