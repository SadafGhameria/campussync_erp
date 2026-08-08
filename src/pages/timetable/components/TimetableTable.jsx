import {
  Eye,
  RefreshCcw,
  Trash2,
} from "lucide-react";

function TimetableTable({
  loading,
  timetables,
  onView,
  onDelete,
  onRegenerate,
}) {
  if (loading) {
    return (
      <div className="table-card">
        <div className="loading-text">
          Loading timetables...
        </div>
      </div>
    );
  }

  if (!timetables || timetables.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <h3>No Timetables Found</h3>
          <p>
            Click <b>Generate Timetable</b> to
            create your first timetable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <table className="custom-table">

        <thead>
          <tr>
            <th>Department</th>
            <th>Semester</th>
            <th>Division</th>
            <th>Academic Year</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {timetables.map((table) => (

            <tr key={table._id}>

              <td>{table.department}</td>

              <td>
                Semester {table.semester}
              </td>

              <td>{table.division}</td>

              <td>{table.academicYear}</td>

              <td>

                <span
                  className={
                    table.status === "Generated"
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {table.status}
                </span>

              </td>

              <td>

                <div className="table-actions">

                  <button
                    className="icon-button view"
                    title="View Timetable"
                    onClick={() =>
                      onView(table)
                    }
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    className="icon-button regenerate"
                    title="Regenerate"
                    onClick={() =>
                      onRegenerate &&
                      onRegenerate(table)
                    }
                  >
                    <RefreshCcw size={18} />
                  </button>

                  <button
                    className="icon-button delete"
                    title="Delete"
                    onClick={() =>
                      onDelete(table._id)
                    }
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}

export default TimetableTable;