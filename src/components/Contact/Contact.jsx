import "./Contact.css";
import { Mail, Phone, MapPin } from "lucide-react";

function Contact() {
  return (
    <section id="contact" className="contact">

      <div className="contact-left">

        <span className="section-tag">
          CONTACT US
        </span>

        <h2>
          Let's Build Smarter Campuses Together
        </h2>

        <p>
          Have questions about EduSphere ERP?
          We'd love to hear from your institution.
        </p>

        <div className="contact-info">

          <div>
            <Mail/>
            support@edusphere.com
          </div>

          <div>
            <Phone/>
            +91 98765 43210
          </div>

          <div>
            <MapPin/>
            Mumbai, Maharashtra
          </div>

        </div>

      </div>

      <div className="contact-right">

        <form>

          <input
            type="text"
            placeholder="Institution Name"
          />

          <input
            type="text"
            placeholder="Your Name"
          />

          <input
            type="email"
            placeholder="Email Address"
          />

          <textarea
            rows="5"
            placeholder="Message"
          ></textarea>

          <button>
            Send Message
          </button>

        </form>

      </div>

    </section>
  );
}

export default Contact;