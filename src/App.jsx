import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import Overview from "./pages/Overview";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardModule from "./pages/DashboardModule";
import StudentList from "./pages/students/StudentList";
import FacultyList from "./pages/faculty/FacultyList";
import AttendancePage from "./pages/attendance/AttendancePage";


import ProtectedRoute from "./components/ProtectedRoute";
import SubjectAllocation from "./pages/subjectAllocation/SubjectAllocation";
import Timetable from "./pages/timetable/Timetable";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/get-started" element={<GetStarted />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout role="admin" />
          </ProtectedRoute>

        }

      >
        <Route index element={<Overview />} />
        <Route path="students" element={<StudentList />} />
        <Route path=":module" element={<DashboardModule />} />
        <Route path="faculty" element={<FacultyList />} />
        <Route path="attendance" element={<AttendancePage />} />
       <Route
  path="subject-allocation"
  element={<SubjectAllocation />}
/>

<Route
  path="timetable"
  element={<Timetable />}
/>

      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout role="student" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path=":module" element={<DashboardModule />} />
      </Route>

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute role="faculty">
            <DashboardLayout role="faculty" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path=":module" element={<DashboardModule />} />
      </Route>
      <Route
        path="/timetable"
        element={<Timetable />} />
    </Routes>

  );
}

export default App;