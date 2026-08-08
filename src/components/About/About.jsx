import "./About.css";
import { motion } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Globe,
  GraduationCap,
} from "lucide-react";

function About() {
  return (
    <section id="about" className="about">

      <div className="about-left">

        <motion.span
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          className="section-tag"
        >
          ABOUT EDUSPHERE
        </motion.span>

        <motion.h2
          initial={{y:40}}
          whileInView={{y:0}}
        >
          One ERP Platform
          <br />
          for Every Educational Institution
        </motion.h2>

        <p>
          EduSphere ERP is a modern cloud-based platform designed for
          colleges, universities and educational institutes.
          It simplifies academics, administration, communication and
          campus management through one intelligent system.
        </p>

        <div className="about-features">

          <div>
            <ShieldCheck size={22}/>
            Secure Authentication
          </div>

          <div>
            <Building2 size={22}/>
            Multi Institution Support
          </div>

          <div>
            <GraduationCap size={22}/>
            Role Based Access
          </div>

          <div>
            <Globe size={22}/>
            Cloud Ready
          </div>

        </div>

      </div>

      <div className="about-right">

        <div className="about-card">

          <h3>Why Colleges Choose EduSphere</h3>

          <div className="about-stat">
            <h2>40+</h2>
            <p>Platform Features</p>
          </div>

          <div className="about-stat">
            <h2>100%</h2>
            <p>Cloud Based</p>
          </div>

          <div className="about-stat">
            <h2>24/7</h2>
            <p>Accessibility</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;