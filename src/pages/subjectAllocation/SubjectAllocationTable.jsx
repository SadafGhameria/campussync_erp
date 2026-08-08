import { Pencil, Trash2 } from "lucide-react";

function SubjectAllocationTable({
  allocations,
  onEdit,
  onDelete,
}) {
  if (!allocations.length) {
    return (
      <div className="empty-state">
        <h3>No Subject Allocations Yet</h3>
        <p>Create your first subject allocation using the form above.</p>
      </div>
    );
  }

  return (
    <div className="allocation-table-wrapper">
      <table className="allocation-table">
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Semester</th>
            <th>Division</th>
            <th>Type</th>
            <th>Lectures</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {allocations.map((item) => (
            <tr key={item._id}>
              <td>{item.faculty?.user?.name || item.faculty?.name}</td>

              <td>{item.department}</td>

              <td>{item.subject}</td>

              <td>
                <span className="semester-badge">
                  Sem {item.semester}
                </span>
              </td>

              <td>{item.division}</td>

              <td>
                <span
                  className={`type-badge ${
                    item.lectureType === "Theory"
                      ? "theory"
                      : "practical"
                  }`}
                >
                  {item.lectureType}
                </span>
              </td>

              <td>{item.lecturesPerWeek}</td>

              <td>
                <div className="action-buttons">

                  <button
                    className="edit-btn"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(item._id)}
                  >
                    <Trash2 size={16} />
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

export default SubjectAllocationTable;