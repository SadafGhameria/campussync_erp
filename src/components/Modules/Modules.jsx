import "./Modules.css";
import { motion } from "framer-motion";
import {
  UserRound,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
  Bell,
  CreditCard,
  BarChart3,
} from "lucide-react";

const modules = [
  {
    icon: <UserRound size={38} />,
    title: "Student Management",
    desc: "Manage student profiles, enrollment, academic records and personal information.",
  },
  {
    icon: <GraduationCap size={38} />,
    title: "Faculty Management",
    desc: "Maintain faculty details, departments, workload and teaching schedules.",
  },
  {
    icon: <ClipboardCheck size={38} />,
    title: "Attendance",
    desc: "Mark attendance, generate reports and identify defaulters instantly.",
  },
  {
    icon: <CalendarDays size={38} />,
    title: "Timetable",
    desc: "Create conflict-free timetables for departments, classes and faculty.",
  },
  {
    icon: <BookOpen size={38} />,
    title: "Examinations",
    desc: "Manage exams, marks, grades and result publishing from one place.",
  },
  {
    icon: <CreditCard size={38} />,
    title: "Fee Management",
    desc: "Track fee payments, receipts, due dates and financial reports.",
  },
  {
    icon: <Bell size={38} />,
    title: "Notice Board",
    desc: "Share announcements, circulars and important updates with everyone.",
  },
  {
    icon: <BarChart3 size={38} />,
    title: "Analytics",
    desc: "Powerful dashboards with attendance, performance and institutional insights.",
  },
];

function Modules() {
  return (
    <section id="modules" className="modules-section">

      <div className="section-heading">

        <span>ERP MODULES</span>

        <h2>Everything You Need To Run A Modern College</h2>

        <p>
          EduSphere combines administration, academics and communication
          into one powerful cloud-based platform.
        </p>

      </div>

      <div className="modules-grid">

        {modules.map((module, index) => (

          <motion.div
            className="module-card"
            key={index}
            whileHover={{
              y: -10,
              scale: 1.02,
            }}
            transition={{ duration: 0.3 }}
          >

            <div className="module-icon">
              {module.icon}
            </div>

            <h3>{module.title}</h3>

            <p>{module.desc}</p>

            <button>
              Learn More →
            </button>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Modules;