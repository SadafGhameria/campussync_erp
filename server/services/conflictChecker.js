const Timetable = require("../models/Timetable");

// ===============================================
// Check Faculty Conflict in Current Generated Slots
// ===============================================

const isFacultyBusy = (slots, facultyId, day, period) => {
  return slots.some(
    (slot) =>
      String(slot.faculty) === String(facultyId) &&
      slot.day === day &&
      slot.period === period
  );
};

// ===============================================
// Check Room Conflict
// ===============================================

const isRoomBusy = (slots, room, day, period) => {
  return slots.some(
    (slot) =>
      slot.room === room &&
      slot.day === day &&
      slot.period === period
  );
};

// ===============================================
// Check Class Conflict
// ===============================================

const isClassBusy = (slots, day, period) => {
  return slots.some(
    (slot) =>
      slot.day === day &&
      slot.period === period
  );
};

// ===============================================
// Check Existing Published Timetables
// ===============================================

const isFacultyBusyInExistingTimetables = async (
  institutionCode,
  facultyId,
  day,
  period,
  academicYear
) => {

  const timetable = await Timetable.findOne({
    institutionCode,
    academicYear,
    status: "Generated",
    slots: {
      $elemMatch: {
        faculty: facultyId,
        day,
        period,
      },
    },
  });

  return !!timetable;
};

// ===============================================
// Faculty Daily Load
// ===============================================

const getFacultyDailyLoad = (
  slots,
  facultyId,
  day
) => {

  return slots.filter(
    (slot) =>
      String(slot.faculty) === String(facultyId) &&
      slot.day === day
  ).length;

};

// ===============================================
// Faculty Weekly Load
// ===============================================

const getFacultyWeeklyLoad = (
  slots,
  facultyId
) => {

  return slots.filter(
    (slot) =>
      String(slot.faculty) === String(facultyId)
  ).length;

};

// ===============================================
// Subject Already Scheduled Today
// ===============================================

const subjectScheduledToday = (
  slots,
  subject,
  day
) => {

  return slots.some(
    (slot) =>
      slot.subject === subject &&
      slot.day === day
  );

};

// ===============================================
// Find Free Classroom
// ===============================================

const findAvailableRoom = (
  slots,
  rooms,
  day,
  period
) => {

  for (const room of rooms) {

    if (
      !isRoomBusy(
        slots,
        room,
        day,
        period
      )
    ) {
      return room;
    }

  }

  return null;

};

// ===============================================
// Validate Consecutive Lab Period
// ===============================================

const canPlaceLab = (
  slots,
  day,
  firstPeriod,
  secondPeriod
) => {

  const firstBusy =
    isClassBusy(
      slots,
      day,
      firstPeriod
    );

  const secondBusy =
    isClassBusy(
      slots,
      day,
      secondPeriod
    );

  return !firstBusy && !secondBusy;

};

// ===============================================
// Timetable Statistics
// ===============================================

const calculateStatistics = (
  slots
) => {

  const theory = slots.filter(
    (slot) =>
      slot.lectureType === "Theory"
  ).length;

  const lab = slots.filter(
    (slot) =>
      slot.lectureType === "Lab"
  ).length;

  return {

    totalLectures: slots.length,

    theoryLectures: theory,

    labLectures: lab,

  };

};

// ===============================================
// Health Report
// ===============================================

const healthReport = (
  slots
) => {

  const duplicateFaculty = [];
  const duplicateRooms = [];

  slots.forEach((slot, index) => {

    slots.forEach((next, i) => {

      if (i <= index) return;

      if (
        slot.day === next.day &&
        slot.period === next.period
      ) {

        if (
          String(slot.faculty) ===
          String(next.faculty)
        ) {

          duplicateFaculty.push({
            day: slot.day,
            period: slot.period,
            faculty: slot.faculty,
          });

        }

        if (
          slot.room === next.room
        ) {

          duplicateRooms.push({
            day: slot.day,
            period: slot.period,
            room: slot.room,
          });

        }

      }

    });

  });

  return {

    facultyConflicts:
      duplicateFaculty.length,

    roomConflicts:
      duplicateRooms.length,

    healthy:
      duplicateFaculty.length === 0 &&
      duplicateRooms.length === 0,

  };

};

module.exports = {

  isFacultyBusy,

  isRoomBusy,

  isClassBusy,

  isFacultyBusyInExistingTimetables,

  getFacultyDailyLoad,

  getFacultyWeeklyLoad,

  subjectScheduledToday,

  findAvailableRoom,

  canPlaceLab,

  calculateStatistics,

  healthReport,

};