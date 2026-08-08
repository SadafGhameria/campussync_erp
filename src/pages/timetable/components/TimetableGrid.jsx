const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const DEFAULT_PERIODS = [
  {
    period: 1,
    time: "09:00 - 10:00",
  },
  {
    period: 2,
    time: "10:00 - 11:00",
  },
  {
    period: 3,
    time: "11:00 - 12:00",
  },
  {
    period: 4,
    time: "12:00 - 01:00",
  },
  {
    period: 5,
    time: "01:00 - 02:00",
  },
  {
    period: 6,
    time: "02:00 - 03:00",
  },
];

function TimetableGrid({ timetable }) {
  // ==========================================
  // Period configuration
  // ==========================================

  const periods =
    timetable?.periodConfig?.length > 0
      ? timetable.periodConfig
          .filter((item) => !item.isBreak)
          .map((item) => ({
            period: item.period,
            time: `${item.startTime} - ${item.endTime}`,
            label: item.label,
          }))
      : DEFAULT_PERIODS;

  // ==========================================
  // Get slot
  // ==========================================

  const getSlot = (day, period) => {
    return timetable?.slots?.find(
      (slot) =>
        slot.day === day &&
        Number(slot.period) === Number(period)
    );
  };

  // ==========================================
  // Get faculty name
  // ==========================================

  const getFacultyName = (faculty) => {
    if (!faculty) {
      return "Faculty";
    }

    // If Faculty is populated and User is populated
    if (faculty.user?.name) {
      return faculty.user.name;
    }

    // If Faculty itself has a name
    if (faculty.name) {
      return faculty.name;
    }

    // Fallback to employee ID
    if (faculty.employeeId) {
      return faculty.employeeId;
    }

    return "Faculty";
  };

  return (
    <div className="timetable-grid">

      <table className="weekly-timetable">

        <thead>
          <tr>

            <th className="time-header">
              Time
            </th>

            {DAYS.map((day) => (
              <th key={day}>
                {day}
              </th>
            ))}

          </tr>
        </thead>

        <tbody>

          {periods.map((item) => (
            <tr key={item.period}>

              {/* Time */}

              <td className="time-column">

                <strong>
                  {item.time}
                </strong>

                {item.label && (
                  <span className="period-label">
                    {item.label}
                  </span>
                )}

              </td>

              {/* Days */}

              {DAYS.map((day) => {

                const slot = getSlot(
                  day,
                  item.period
                );

                // Empty slot
                if (!slot) {
                  return (
                    <td
                      key={`${day}-${item.period}`}
                      className="empty-cell"
                    >
                      <div className="empty-slot">
                        —
                      </div>
                    </td>
                  );
                }

                const isLab =
                  slot.lectureType === "Lab";

                const facultyName =
                  getFacultyName(slot.faculty);

                return (
                  <td
                    key={`${day}-${item.period}`}
                    className="occupied-cell"
                  >

                    <div
                      className={`slot-card ${
                        isLab
                          ? "lab-slot"
                          : "theory-slot"
                      }`}
                    >

                      {/* Subject */}

                      <h4>
                        {slot.subject}
                      </h4>

                      {/* Faculty */}

                      <span className="slot-faculty">
                        👨‍🏫 {facultyName}
                      </span>

                      {/* Room */}

                      <span className="slot-room">
                        🏫 {slot.room || "TBA"}
                      </span>

                      {/* Type */}

                      <span className="slot-type">
                        📘 {slot.lectureType}
                      </span>

                    </div>

                  </td>
                );
              })}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TimetableGrid;