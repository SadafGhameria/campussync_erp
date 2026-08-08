import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAllocations = () =>
  API.get("/subject-allocation");

export const createAllocation = (data) =>
  API.post("/subject-allocation", data);

export const updateAllocation = (id, data) =>
  API.put(`/subject-allocation/${id}`, data);

export const deleteAllocation = (id) =>
  API.delete(`/subject-allocation/${id}`);

export const getFaculty = () =>
  API.get("/faculty");