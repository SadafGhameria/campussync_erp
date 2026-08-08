import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import { dashboardData } from "../data/dashboardData";

function DashboardLayout({ role = "admin" }) {
  const [collapsed, setCollapsed] = useState(false);
  const config = dashboardData[role] || dashboardData.admin;

  return (
    <div className="dashboard-layout">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        config={config}
      />

      <div
        className={
          collapsed
            ? "dashboard-content expanded"
            : "dashboard-content"
        }
      >
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          config={config}
        />

        <main className="dashboard-main">
          <Outlet context={{ config, role }} />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
