import "./GetStarted.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, School, User, Mail, Lock } from "lucide-react";
import API from "../api/axios";

function GetStarted() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ institution: "", name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      const { data } = await API.post("/auth/register", form);
      alert(`Institution registered. Your institution code is ${data.data.institutionCode}. Save it for login.`);
      navigate("/login");
    } catch (requestError) { setError(requestError.response?.data?.message || "Registration failed."); }
    finally { setSubmitting(false); }
  };
  return <div className="register-page"><div className="register-left"><div className="brand"><GraduationCap size={45} /><h1>EduSphere ERP</h1></div><h2>Start Your Institution's Digital Journey</h2><p>Register your institution and get access to a modern ERP platform designed for colleges, universities and educational institutes.</p><div className="benefits"><div>✔ Student Management</div><div>✔ Attendance Automation</div><div>✔ Faculty Management</div><div>✔ Timetable Generator</div></div></div><div className="register-right"><div className="register-card"><h2>Register Institution</h2><p>Fill the details below</p><form onSubmit={submit}><div className="input-group"><School size={20}/><input required name="institution" value={form.institution} onChange={change} placeholder="Institution Name" /></div><div className="input-group"><User size={20}/><input required name="name" value={form.name} onChange={change} placeholder="Admin Name" /></div><div className="input-group"><Mail size={20}/><input required type="email" name="email" value={form.email} onChange={change} placeholder="Official Email" /></div><div className="input-group"><Lock size={20}/><input required minLength="8" type="password" name="password" value={form.password} onChange={change} placeholder="Password" /></div><div className="input-group"><Lock size={20}/><input required type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} placeholder="Confirm Password" /></div>{error && <p className="form-error">{error}</p>}<button className="register-btn" disabled={submitting}>{submitting ? "Registering..." : "Register Institution"}</button></form><div className="already">Already registered? <Link to="/login">Login</Link></div></div></div></div>;
}

export default GetStarted;
