import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Mail, Lock, Building2 } from "lucide-react";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ institutionCode: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const { data } = await API.post("/auth/login", formData);

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role.toLowerCase()) {
        case "admin":
          navigate("/admin");
          break;

        case "faculty":
          navigate("/faculty");
          break;

        case "student":
          navigate("/student");
          break;

        default:
          navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="login-page">
    <div className="login-left"><div className="brand"><GraduationCap size={45} /><h1>EduSphere ERP</h1></div><h2>Welcome Back 👋</h2><p>Manage your institution from one secure platform. Login to continue your journey.</p><div className="login-features"><div>✔ Attendance Management</div><div>✔ Timetable Automation</div><div>✔ Student & Faculty Management</div><div>✔ Analytics Dashboard</div></div></div>
    <div className="login-right"><div className="login-card"><h2>Login</h2><p>Enter your credentials below</p>
      <form onSubmit={handleLogin}>
        <div className="input-group"><Building2 size={20} /><input required name="institutionCode" value={formData.institutionCode} onChange={handleChange} placeholder="Institution Code" /></div>
        <div className="input-group"><Mail size={20} /><input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" /></div>
        <div className="input-group"><Lock size={20} /><input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" /></div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="login-btn2" disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
      </form>
      <div className="register-link">New Institution? <Link to="/get-started">Get Started</Link></div>
    </div></div>
  </div>;
}

export default Login;
