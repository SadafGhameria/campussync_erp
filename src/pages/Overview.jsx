import "./Overview.css";
import { useOutletContext } from "react-router-dom";

import DashboardCards from "../dashboard/DashboardCards";
import RecentActivity from "../dashboard/RecentActivity";
import QuickActions from "../dashboard/QuickActions";

function Overview() {
  const { config } = useOutletContext();

  return (
    <div className="overview">
      <div className="overview-header">
        <div>
          <p className="eyebrow">{config.roleLabel} Workspace</p>
          <h1>{config.greeting}</h1>
          <p>{config.subtitle}</p>
        </div>
      </div>

      <DashboardCards cards={config.metrics} />

      <div className="overview-grid">
        <QuickActions actions={config.quickActions} />
        <RecentActivity activities={config.activities} />
      </div>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Today's Schedule</h3>
              <p>Priority academic and operational events</p>
            </div>
          </div>

          <div className="schedule-list">
            {config.schedule.map((item) => (
              <div className="schedule-item" key={`${item.time}-${item.title}`}>
                <span>{item.time}</span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h3>Key Highlights</h3>
              <p>Fast indicators for the current cycle</p>
            </div>
          </div>

          <div className="highlight-list">
            {config.highlights.map((item) => (
              <div className="highlight-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Overview;
