// import API from "./axios";

// //Get All Departments
// export const getDepartments = async (params = {}) => {
//   const response = await API.get("/departments", { params });
//   return response.data.data;
// };

// //Get Department By ID
// export const getDepartmentById = async (id) => {
//   const response = await API.get(`/departments/${id}`);
//   return response.data.data;
// };

// //Create Department
// export const createDepartment = async (departmentData) => {
//   const response = await API.post("/departments", departmentData);
//   return response.data.data;
// };

// //Update Department
// export const updateDepartment = async (id, departmentData) => {
//   const response = await API.put(`/departments/${id}`, departmentData);
//   return response.data.data;
// };

// //Delete Department
// export const deleteDepartment = async (id) => {
//   const response = await API.delete(`/departments/${id}`);
//   return response.data;
// };    

import API from "./axios";

// Get All Departments
export const getDepartments = async (params = {}) => {
  const response = await API.get("/departments", {
    params,
  });

  return response.data.data;
};

// Get Department By ID
export const getDepartmentById = async (id) => {
  const response = await API.get(`/departments/${id}`);
  return response.data.data;
};

// Create Department
export const createDepartment = async (departmentData) => {
  const response = await API.post(
    "/departments",
    departmentData
  );

  return response.data.data;
};

// Update Department
export const updateDepartment = async (
  id,
  departmentData
) => {
  const response = await API.put(
    `/departments/${id}`,
    departmentData
  );

  return response.data.data;
};

// Delete Department
export const deleteDepartment = async (id) => {
  const response = await API.delete(
    `/departments/${id}`
  );

  return response.data;
};