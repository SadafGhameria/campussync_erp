import { Pencil, Trash2 } from "lucide-react";
import { deleteFaculty } from "../../api/facultyApi";

function FacultyTable({
  faculty,
  loading,
  onEdit,
  onRefresh,
}) {
  const removeFaculty = async (item) => {
    if (
      !window.confirm(
        `Delete ${item.user?.name}?`
      )
    )
      return;

    try {
      await deleteFaculty(item._id);
      onRefresh();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not delete faculty."
      );
    }
  };

  return (
    <div className="table-container">
      <table>

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Branch</th>
            <th>Designation</th>
            <th>Subjects</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="9">
                Loading Faculty...
              </td>
            </tr>
          ) : faculty.length === 0 ? (
            <tr>
              <td colSpan="9">
                No Faculty Found
              </td>
            </tr>
          ) : (
            faculty.map((item) => (
              <tr key={item._id}>

                <td>{item.employeeId}</td>

                <td>{item.user?.name}</td>

                <td>{item.user?.email}</td>

                <td>{item.branch}</td>

                <td>{item.designation}</td>

                <td>
                  {item.subjects?.join(", ")}
                </td>

                <td>{item.phone}</td>

                <td>
                  <span
                    className={`status ${
                      item.status === "Active"
                        ? "active"
                        : "alert"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>

                  <div className="action-buttons">

                    <button
                      onClick={() =>
                        onEdit(item)
                      }
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        removeFaculty(item)
                      }
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  );
}

export default FacultyTable;