import "./Topbar.css";
import {
  Bell,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";

function Topbar({ collapsed, setCollapsed, config }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2>{config.title}</h2>
          <p>Welcome back, {config.profileName}</p>
        </div>
      </div>

      <div className="topbar-search">
        <Search size={18} />
        <input type="text" placeholder={config.searchPlaceholder} />
      </div>

      <div className="topbar-right">
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">
          <UserCircle size={42} />
          <div>
            <h4>{config.profileName}</h4>
            <span>{config.profileMeta}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
