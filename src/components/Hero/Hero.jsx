import "./Hero.css";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle,
  Users,
  GraduationCap,
  CalendarCheck,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section id="home" className="hero">

      <div className="hero-left">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="tag"
        >
          Smart College ERP Platform
        </motion.p>

        <motion.h1
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          transition={{ duration: .6 }}
        >
          Manage Your College
          <br />
          <span>With One Smart ERP</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .3 }}
          className="hero-text"
        >
          Digitize attendance, timetable, faculty,
          examinations, notices and student records
          using one centralized platform.
        </motion.p>

        <div className="hero-buttons">

      <Link to="/get-started">

<button className="primary">

Get Started

</button>

</Link>

          <button className="secondary">

            <PlayCircle size={18} />

            Watch Demo

          </button>

        </div>

        <div className="hero-features">

          <span><CheckCircle size={18}/> Attendance</span>

          <span><CheckCircle size={18}/> Timetable</span>

          <span><CheckCircle size={18}/> Results</span>

          <span><CheckCircle size={18}/> Faculty</span>

        </div>

      </div>

      <motion.div
        className="hero-right"
        initial={{ x: 80 }}
        animate={{ x: 0 }}
      >

        <div className="dashboard-card">

          <h3>EduSphere Dashboard</h3>

          <div className="stat">

            <Users />

            <div>

              <h4>2500+</h4>

              <p>Students</p>

            </div>

          </div>

          <div className="stat">

            <GraduationCap />

            <div>

              <h4>120</h4>

              <p>Faculty</p>

            </div>

          </div>

          <div className="stat">

            <CalendarCheck />

            <div>

              <h4>94%</h4>

              <p>Attendance</p>

            </div>

          </div>

          <div className="stat">

            <BarChart3 />

            <div>

              <h4>35</h4>

              <p>Departments</p>

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}

export default Hero;