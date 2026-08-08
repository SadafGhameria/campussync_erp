import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="logo">
                <GraduationCap className="logo-icon" />
                <div>
                    <h2>EduSphere</h2>
                    <span>College ERP</span>
                </div>
            </div>

            <nav className={menuOpen ? "nav-links active" : "nav-links"}>

                <a href="#home" onClick={() => setMenuOpen(false)}>
                    Home
                </a>
                <a href="#features" onClick={() => setMenuOpen(false)}>
                    Features
                </a>

                <a href="#modules" onClick={() => setMenuOpen(false)}>
                    Modules
                </a>

                <a href="#about" onClick={() => setMenuOpen(false)}>
                    About
                </a>

                <a href="#contact" onClick={() => setMenuOpen(false)}>
                    Contact
                </a>

            </nav>


           <div className="nav-right">

    <Link to="/login">
        <button className="login-btn">
            Login
        </button>
    </Link>

    <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
    >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>

</div>


        </header>
    );
}

export default Navbar;