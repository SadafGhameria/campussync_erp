// const AttendanceSession = require("../models/AttendanceSession");
// const AttendanceRecord = require("../models/AttendanceRecord");
// const Course = require("../models/Course");
// const Enrollment = require("../models/Enrollment");

// const errorResponse = (res, error) => {
//   const status = error.name === "CastError" || error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500;
//   return res.status(status).json({ success: false, message: status === 409 ? "An attendance record already exists for this session." : status === 500 ? "Unable to process the attendance request." : error.message });
// };

// const canManageCourse = (user, course) => user.role === "admin" || String(course.faculty) === String(user._id);

// const startAttendanceSession = async (req, res) => {
//   try {
//     const { course: courseId, date, startTime, endTime = "" } = req.body;
//     if (!courseId || !date || !startTime) return res.status(400).json({ success: false, message: "Course, date and start time are required." });
//     const course = await Course.findOne({ _id: courseId, institutionCode: req.user.institutionCode, isActive: true });
//     if (!course) return res.status(404).json({ success: false, message: "Active course not found." });
//     if (!canManageCourse(req.user, course)) return res.status(403).json({ success: false, message: "Only the assigned faculty member can manage this course." });
//     const session = await AttendanceSession.create({ course: course._id, faculty: req.user._id, date, startTime, endTime, institutionCode: req.user.institutionCode });
//     return res.status(201).json({ success: true, message: "Attendance session started successfully.", data: session });
//   } catch (error) { return errorResponse(res, error); }
// };

// const markAttendance = async (req, res) => {
//   try {
//     const { sessionId, attendance } = req.body;
//     if (!sessionId || !Array.isArray(attendance) || attendance.length === 0) return res.status(400).json({ success: false, message: "Session ID and attendance data are required." });
//     const session = await AttendanceSession.findOne({ _id: sessionId, institutionCode: req.user.institutionCode, status: "In Progress" }).populate("course");
//     if (!session) return res.status(404).json({ success: false, message: "Open attendance session not found." });
//     if (!canManageCourse(req.user, session.course)) return res.status(403).json({ success: false, message: "You cannot mark attendance for this course." });
//     const studentIds = attendance.map((item) => item.studentId);
//     const validStatuses = new Set(["Present", "Absent", "Late"]);
//     if (studentIds.some((id) => !id) || attendance.some((item) => !validStatuses.has(item.status))) return res.status(400).json({ success: false, message: "Each record needs a student ID and a valid attendance status." });
//     const enrollments = await Enrollment.find({ institutionCode: req.user.institutionCode, course: session.course._id, student: { $in: studentIds }, status: "Active" }).select("student");
//     if (enrollments.length !== new Set(studentIds.map(String)).size) return res.status(400).json({ success: false, message: "Every marked student must be actively enrolled in this course." });
//     await AttendanceRecord.insertMany(attendance.map((item) => ({ session: session._id, student: item.studentId, status: item.status, institutionCode: req.user.institutionCode })));
//     session.status = "Completed";
//     await session.save();
//     return res.status(201).json({ success: true, message: "Attendance marked successfully.", totalRecords: attendance.length });
//   } catch (error) { return errorResponse(res, error); }
// };

// const getAttendanceSessions = async (req, res) => {
//   try {
//     const filter = { institutionCode: req.user.institutionCode };
//     if (req.query.course) filter.course = req.query.course;
//     const sessions = await AttendanceSession.find(filter).populate("course", "courseCode courseName").populate("faculty", "name email").sort({ date: -1, startTime: -1 });
//     return res.json({ success: true, count: sessions.length, data: sessions });
//   } catch (error) { return errorResponse(res, error); }
// };

// const getStudentAttendance = async (req, res) => {
//   try {
//     const records = await AttendanceRecord.find({ institutionCode: req.user.institutionCode, student: req.params.studentId }).populate({ path: "session", populate: { path: "course", select: "courseName courseCode" } }).populate("student", "firstName lastName studentId").sort({ createdAt: -1 });
//     const present = records.filter((record) => record.status === "Present" || record.status === "Late").length;
//     return res.json({ success: true, student: records[0]?.student || null, totalClasses: records.length, present, absent: records.length - present, percentage: records.length ? Number(((present / records.length) * 100).toFixed(2)) : 0, records });
//   } catch (error) { return errorResponse(res, error); }
// };

// const buildCourseAttendanceReport = async (institutionCode, courseId) => {
//   const course = await Course.findOne({ _id: courseId, institutionCode });
//   if (!course) return null;
//   const sessions = await AttendanceSession.find({ institutionCode, course: course._id, status: "Completed" }).select("_id");
//   const enrollments = await Enrollment.find({ institutionCode, course: course._id, status: "Active" }).populate("student", "studentId firstName lastName");
//   const sessionIds = sessions.map((session) => session._id);
//   const records = await AttendanceRecord.find({ institutionCode, session: { $in: sessionIds } }).select("student status");
//   const data = enrollments.map(({ student }) => {
//     const studentRecords = records.filter((record) => String(record.student) === String(student._id));
//     const present = studentRecords.filter((record) => record.status === "Present" || record.status === "Late").length;
//     return { student, totalClasses: sessions.length, present, absent: sessions.length - present, percentage: sessions.length ? Number(((present / sessions.length) * 100).toFixed(2)) : 0 };
//   });
//   return { course: { id: course._id, courseCode: course.courseCode, courseName: course.courseName }, data };
// };

// const getCourseAttendance = async (req, res) => {
//   try {
//     const report = await buildCourseAttendanceReport(req.user.institutionCode, req.params.courseId);
//     if (!report) return res.status(404).json({ success: false, message: "Course not found." });
//     return res.json({ success: true, course: report.course, totalStudents: report.data.length, data: report.data });
//   } catch (error) { return errorResponse(res, error); }
// };

// const getDefaulters = async (req, res) => {
//   try {
//     const report = await buildCourseAttendanceReport(req.user.institutionCode, req.params.courseId);
//     if (!report) return res.status(404).json({ success: false, message: "Course not found." });
//     const limit = Number(req.query.limit) || 75;
//     const data = report.data.filter((item) => item.percentage < limit);
//     return res.json({ success: true, threshold: limit, count: data.length, data });
//   } catch (error) { return errorResponse(res, error); }
// };

// module.exports = { startAttendanceSession, markAttendance, getAttendanceSessions, getStudentAttendance, getCourseAttendance, getDefaulters };


const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const errorResponse = (res, error) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Attendance already marked for this student.",
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

// =========================
// Save Attendance
// =========================
const markAttendance = async (req, res) => {
  try {
    const {
      department,
      semester,
      section,
      subject,
      date,
      students,
    } = req.body;

    if (
      !department ||
      !semester ||
      !section ||
      !subject ||
      !date ||
      !students?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const attendanceRecords = [];

    for (const item of students) {
      const record = await Attendance.create({
        institutionCode: req.user.institutionCode,
        student: item.studentId,
        department,
        semester,
        section,
        subject,
        faculty: req.user._id,
        date,
        status: item.status,
      });

      attendanceRecords.push(record);

      // Update attendance percentage
      const totalClasses = await Attendance.countDocuments({
        student: item.studentId,
      });

      const presentClasses = await Attendance.countDocuments({
        student: item.studentId,
        status: "Present",
      });

      const percentage =
        totalClasses === 0
          ? 0
          : Number(((presentClasses / totalClasses) * 100).toFixed(2));

      await Student.findByIdAndUpdate(item.studentId, {
        attendance: percentage,
      });
    }

    res.status(201).json({
      success: true,
      message: "Attendance saved successfully.",
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// =========================
// Attendance History
// =========================
const getAttendanceHistory = async (req, res) => {
  try {
    const filter = {
      institutionCode: req.user.institutionCode,
    };

    if (req.query.department)
      filter.department = req.query.department;

    if (req.query.semester)
      filter.semester = req.query.semester;

    if (req.query.section)
      filter.section = req.query.section;

    if (req.query.subject)
      filter.subject = req.query.subject;

    const records = await Attendance.find(filter)
      .populate("student", "studentId firstName lastName")
      .populate("faculty", "firstName lastName")
      .sort({ date: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// =========================
// Student Attendance
// =========================
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const records = await Attendance.find({
      institutionCode: req.user.institutionCode,
      student: studentId,
    }).sort({ date: -1 });

    const present = records.filter(
      (r) => r.status === "Present"
    ).length;

    const absent = records.filter(
      (r) => r.status === "Absent"
    ).length;

    const percentage =
      records.length === 0
        ? 0
        : Number(((present / records.length) * 100).toFixed(2));

    res.json({
      success: true,
      totalClasses: records.length,
      present,
      absent,
      percentage,
      data: records,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

// =========================
// Defaulter List
// =========================
const getDefaulters = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 75;

    const students = await Student.find({
      institutionCode: req.user.institutionCode,
      attendance: { $lt: limit },
    })
      .select(
        "studentId firstName lastName department semester section attendance"
      )
      .sort({ attendance: 1 });

    res.json({
      success: true,
      threshold: limit,
      count: students.length,
      data: students,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
  getStudentAttendance,
  getDefaulters,
};