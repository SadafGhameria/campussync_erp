const Timetable = require("../models/Timetable");
const Subject = require("../models/Subject");

const {
  isFacultyBusy,
  isFacultyBusyInExistingTimetables,
  getFacultyDailyLoad,
  getFacultyWeeklyLoad,
  subjectScheduledToday,
  findAvailableRoom,
  canPlaceLab,
  calculateStatistics,
  healthReport,
} = require("./conflictChecker");

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const SATURDAY = "Saturday";

const DEFAULT_PERIODS = [
  {
    period: 1,
    startTime: "09:00",
    endTime: "10:00",
    label: "P1",
    isBreak: false,
  },
  {
    period: 2,
    startTime: "10:00",
    endTime: "11:00",
    label: "P2",
    isBreak: false,
  },
  {
    period: 3,
    startTime: "11:15",
    endTime: "12:15",
    label: "P3",
    isBreak: false,
  },
  {
    period: 4,
    startTime: "12:15",
    endTime: "01:15",
    label: "P4",
    isBreak: false,
  },
  {
    period: 5,
    startTime: "02:00",
    endTime: "03:00",
    label: "P5",
    isBreak: false,
  },
  {
    period: 6,
    startTime: "03:00",
    endTime: "04:00",
    label: "P6",
    isBreak: false,
  },
];

const CLASSROOMS = [
  "Room-301",
  "Room-302",
  "Room-303",
  "Room-304",
  "Room-305",
];

const LABS = [
  "Lab-1",
  "Lab-2",
  "Lab-3",
];

// =====================================================
// HELPERS
// =====================================================

const shuffle = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];

  }

  return arr;
};

const sortSubjects = (subjects) => {

  return subjects.sort((a, b) => {

    const totalA =
      a.lectureHoursPerWeek +
      a.labHoursPerWeek;

    const totalB =
      b.lectureHoursPerWeek +
      b.labHoursPerWeek;

    return totalB - totalA;

  });

};

// =====================================================
// THEORY SLOT
// =====================================================

const allocateTheory = async ({
  subject,
  slots,
  workingDays,
  periodConfig,
  institutionCode,
  academicYear,
}) => {

  let remaining =
    subject.lectureHoursPerWeek;

  while (remaining > 0) {

    let placed = false;

    const days =
      shuffle(workingDays);

    for (const day of days) {

      if (
        subjectScheduledToday(
          slots,
          subject.subjectName,
          day
        )
      ) {
        continue;
      }

      const periods =
        shuffle(periodConfig);

      for (const period of periods) {

        if (period.isBreak)
          continue;

        const facultyList =
          shuffle(subject.faculty);

        for (const faculty of facultyList) {

          const busyCurrent =
            isFacultyBusy(
              slots,
              faculty._id,
              day,
              period.period
            );

          const busyExisting =
            await isFacultyBusyInExistingTimetables(
              institutionCode,
              faculty._id,
              day,
              period.period,
              academicYear
            );

          if (
            busyCurrent ||
            busyExisting
          ) {
            continue;
          }

          const daily =
            getFacultyDailyLoad(
              slots,
              faculty._id,
              day
            );

          const weekly =
            getFacultyWeeklyLoad(
              slots,
              faculty._id
            );

          if (
            daily >=
            faculty.maxLecturesPerDay
          )
            continue;

          if (
            weekly >=
            faculty.maxLecturesPerWeek
          )
            continue;

          const room =
            findAvailableRoom(
              slots,
              CLASSROOMS,
              day,
              period.period
            );

          if (!room)
            continue;

          slots.push({

            day,

            period:
              period.period,

            startTime:
              period.startTime,

            endTime:
              period.endTime,

            subject:
              subject.subjectName,

            faculty:
              faculty._id,

            lectureType:
              "Theory",

            room,

          });

          remaining--;

          placed = true;

          break;

        }

        if (placed)
          break;

      }

      if (placed)
        break;

    }

    if (!placed) {

      throw new Error(
        `Unable to allocate theory for ${subject.subjectName}`
      );

    }

  }

};

// =====================================================
// LAB SLOT
// =====================================================

const allocateLab = async ({
  subject,
  slots,
  workingDays,
  periodConfig,
  institutionCode,
  academicYear,
}) => {

  let remaining =
    subject.labHoursPerWeek;

  while (remaining > 0) {

    let placed = false;

    const days =
      shuffle(workingDays);

    for (const day of days) {

      const facultyList =
        shuffle(subject.faculty);

      for (let i = 0;
        i < periodConfig.length - 1;
        i++) {

        const first =
          periodConfig[i];

        const second =
          periodConfig[i + 1];

        if (
          first.isBreak ||
          second.isBreak
        ) {
          continue;
        }

        if (
          !canPlaceLab(
            slots,
            day,
            first.period,
            second.period
          )
        ) {
          continue;
        }

              for (const faculty of facultyList) {

          const busy1 =
            isFacultyBusy(
              slots,
              faculty._id,
              day,
              first.period
            );

          const busy2 =
            isFacultyBusy(
              slots,
              faculty._id,
              day,
              second.period
            );

          const existing1 =
            await isFacultyBusyInExistingTimetables(
              institutionCode,
              faculty._id,
              day,
              first.period,
              academicYear
            );

          const existing2 =
            await isFacultyBusyInExistingTimetables(
              institutionCode,
              faculty._id,
              day,
              second.period,
              academicYear
            );

          if (
            busy1 ||
            busy2 ||
            existing1 ||
            existing2
          ) {
            continue;
          }

          const daily =
            getFacultyDailyLoad(
              slots,
              faculty._id,
              day
            );

          const weekly =
            getFacultyWeeklyLoad(
              slots,
              faculty._id
            );

          if (
            daily + 2 >
            faculty.maxLecturesPerDay
          ) {
            continue;
          }

          if (
            weekly + 2 >
            faculty.maxLecturesPerWeek
          ) {
            continue;
          }

          const room =
            findAvailableRoom(
              slots,
              LABS,
              day,
              first.period
            );

          if (!room)
            continue;

          slots.push({
            day,
            period: first.period,
            startTime: first.startTime,
            endTime: first.endTime,
            subject: subject.subjectName,
            faculty: faculty._id,
            lectureType: "Lab",
            room,
          });

          slots.push({
            day,
            period: second.period,
            startTime: second.startTime,
            endTime: second.endTime,
            subject: subject.subjectName,
            faculty: faculty._id,
            lectureType: "Lab",
            room,
          });

          remaining -= 2;

          placed = true;

          break;
        }

        if (placed)
          break;

      }

      if (placed)
        break;

    }

    if (!placed) {

      throw new Error(
        `Unable to allocate lab for ${subject.subjectName}`
      );

    }

  }

};

// =====================================================
// MAIN GENERATOR
// =====================================================

module.exports = async ({
  institutionCode,
  department,
  semester,
  division,
  academicYear,
  version,
  saturdayWorking = false,
}) => {

  const workingDays = saturdayWorking
    ? [...DEFAULT_DAYS, SATURDAY]
    : DEFAULT_DAYS;

  //--------------------------------------------------
  // Load Subjects
  //--------------------------------------------------

  const subjects =
    await Subject.find({

      institutionCode,

      department,

      semester,

      status: "Active",

    }).populate("faculty");

  if (!subjects.length) {

    throw new Error(
      "No active subjects found."
    );

  }

  //--------------------------------------------------
  // Sort Subjects
  //--------------------------------------------------

  sortSubjects(subjects);

  //--------------------------------------------------
  // Empty Timetable
  //--------------------------------------------------

  const slots = [];

  //--------------------------------------------------
  // Allocate Subjects
  //--------------------------------------------------

  for (const subject of subjects) {

    if (
      subject.lectureHoursPerWeek > 0
    ) {

      await allocateTheory({

        subject,

        slots,

        workingDays,

        periodConfig:
          DEFAULT_PERIODS,

        institutionCode,

        academicYear,

      });

    }

    if (
      subject.labHoursPerWeek > 0
    ) {

      await allocateLab({

        subject,

        slots,

        workingDays,

        periodConfig:
          DEFAULT_PERIODS,

        institutionCode,

        academicYear,

      });

    }

  }

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const statistics =
    calculateStatistics(slots);

  const report =
    healthReport(slots);

  //--------------------------------------------------
  // Save Timetable
  //--------------------------------------------------

  const timetable =
    await Timetable.create({

      institutionCode,

      timetableName:
        `${department} Semester ${semester} Division ${division}`,

      department,

      semester,

      division,

      academicYear,

      version,

      status: "Draft",

      generatedBy: "System",

      remarks:
        "Automatically generated timetable",

      workingDays,

      periodConfig:
        DEFAULT_PERIODS,

      slots,

    });

  //--------------------------------------------------
  // Return
  //--------------------------------------------------

  return {

    ...timetable.toObject(),

    statistics,

    healthReport: report,

  };

};