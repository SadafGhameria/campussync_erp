import "./WhyChoose.css";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock3,
  BarChart3,
  Cloud,
  Smartphone,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={45} />,
    title: "Secure Platform",
    description:
      "JWT authentication, encrypted passwords and role-based access for Admin, Faculty and Students.",
  },
  {
    icon: <Clock3 size={45} />,
    title: "Save Time",
    description:
      "Automate attendance, timetable creation, notices and result publishing.",
  },
  {
    icon: <BarChart3 size={45} />,
    title: "Analytics",
    description:
      "Visual dashboards with attendance, academic performance and department statistics.",
  },
  {
    icon: <Cloud size={45} />,
    title: "Cloud Ready",
    description:
      "Access the ERP securely from anywhere on any device.",
  },
  {
    icon: <Smartphone size={45} />,
    title: "Responsive",
    description:
      "Optimized for desktop, tablet and mobile devices.",
  },
  {
    icon: <Users size={45} />,
    title: "Multi User",
    description:
      "Dedicated portals for Admin, Faculty, Students and Parents.",
  },
];

function WhyChoose() {
  return (
    <section id="features" className="why">
      <p className="section-tag">WHY EDUSPHERE?</p>

      <h2>Everything Your College Needs in One Platform</h2>

      <p className="subtitle">
        Replace spreadsheets and multiple disconnected systems with one
        modern ERP platform.
      </p>

      <div className="why-grid">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="why-card"
          >
            <div className="icon">{item.icon}</div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default WhyChoose;