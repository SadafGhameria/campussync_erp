import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Generate Timetable
export const generateTimetable = (data) =>
  API.post("/timetables/generate", data);

// Get All Timetables
export const getTimetables = () =>
  API.get("/timetables");

// Get Single Timetable
export const getTimetable = (id) =>
  API.get(`/timetables/${id}`);

// Delete Timetable
export const deleteTimetable = (id) =>
  API.delete(`/timetables/${id}`);