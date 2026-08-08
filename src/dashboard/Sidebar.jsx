import "./Sidebar.css";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { NavLink ,useNavigate} from "react-router-dom";

function Sidebar({ collapsed, setCollapsed, config }) {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <GraduationCap size={34} />

          {!collapsed && (
            <div>
              <h2>EduSphere</h2>
              <span>{config.roleLabel} Portal</span>
            </div>
          )}
        </div>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className="sidebar-menu">
        {config.nav.map((item, index) => {
          if (item.heading) {
            return !collapsed ? (
              <p key={item.heading} className="menu-heading">
                {item.heading.toUpperCase()}
              </p>
            ) : null;
          }

          return (
            <NavLink
              key={`${item.path}-${index}`}
              to={item.path}
              end={item.path === config.basePath}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
