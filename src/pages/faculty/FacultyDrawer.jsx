import "../students/StudentDrawer.css";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
    createFaculty,
    updateFaculty,
} from "../../api/facultyApi";

const emptyFaculty = {
    employeeId: "",
    name: "",
    email: "",
    password: "",
    branch: "",
    designation: "",
    subjects: "",
    phone: "",
    status: "Active",
};

function FacultyDrawer({
    open,
    onClose,
    faculty,
    onSaved,
}) {
    const [form, setForm] = useState(emptyFaculty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setForm(
                faculty
                    ? {
                        employeeId: faculty.employeeId || "",
                        name: faculty.user?.name || "",
                        email: faculty.user?.email || "",
                        password: "",
                        branch: faculty.branch || "",
                        designation: faculty.designation || "",
                        subjects: faculty.subjects?.join(", ") || "",
                        phone: faculty.phone || "",
                        status: faculty.status || "Active",
                    }
                    : emptyFaculty
            );

            setError("");
        }
    }, [open, faculty]);

    if (!open) return null;

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const payload = {
                ...form,
                subjects: form.subjects
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };

            if (faculty) {
                await updateFaculty(faculty._id, payload);
            } else {
                await createFaculty(payload);
            }

            await onSaved();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save faculty."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="drawer-overlay">
            <div className="student-drawer">

                <div className="drawer-header">
                    <h2>
                        {faculty ? "Edit Faculty" : "Add Faculty"}
                    </h2>

                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <form className="student-form" onSubmit={submit}>

                    <h3>Faculty Information</h3>

                    <div className="form-grid">

                        <input
                            required
                            name="employeeId"
                            placeholder="Employee ID"
                            value={form.employeeId}
                            onChange={change}
                        />

                        <input
                            required
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={change}
                        />

                        <input
                            required
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={change}
                        />

                        {!faculty && (
                            <input
                                required
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={change}
                            />
                        )}

                        <select
                            required
                            name="branch"
                            value={form.branch}
                            onChange={change}
                        >
                            <option value="">Select Branch</option>
                            <option value="Computer">Computer</option>
                            <option value="IT">IT</option>
                            <option value="AI&DS">AI&DS</option>
                            <option value="EXTC">EXTC</option>
                            <option value="Mechanical">Mechanical</option>
                        </select>

                        <select
                            required
                            name="designation"
                            value={form.designation}
                            onChange={change}
                        >
                            <option value="">Select Designation</option>
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Lecturer">Lecturer</option>
                        </select>

                        <input
                            name="subjects"
                            placeholder="Subjects (comma separated)"
                            value={form.subjects}
                            onChange={change}
                        />

                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={change}
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={change}
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                    </div>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    <div className="drawer-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : faculty
                                    ? "Update Faculty"
                                    : "Save Faculty"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default FacultyDrawer;