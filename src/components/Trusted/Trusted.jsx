import "./Trusted.css";
import { motion } from "framer-motion";
import {
  GraduationCap,
  School,
  Building2,
  Landmark,
  University,
} from "lucide-react";

const colleges = [
  { icon: <GraduationCap size={45} />, name: "Engineering Colleges" },
  { icon: <University size={45} />, name: "Universities" },
  { icon: <School size={45} />, name: "Autonomous Institutes" },
  { icon: <Building2 size={45} />, name: "Private Colleges" },
  { icon: <Landmark size={45} />, name: "Government Colleges" },
];

function Trusted() {
  return (
    <section className="trusted">
      <h2>Trusted by Modern Educational Institutions</h2>

      <p>
        Built for colleges looking to simplify academics, administration,
        attendance and student management.
      </p>

      <div className="trusted-grid">
        {colleges.map((college, index) => (
          <motion.div
            whileHover={{ y: -8 }}
            className="trusted-card"
            key={index}
          >
            {college.icon}
            <h3>{college.name}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Trusted;