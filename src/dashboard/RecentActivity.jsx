import "./RecentActivity.css";

function RecentActivity({ activities }) {
  return (
    <div className="recent-card">
      <h3>Recent Activity</h3>

      {activities.map((item) => (
        <div className="activity" key={`${item.title}-${item.subtitle}`}>
          <div className="activity-icon">
            <item.icon size={20} />
          </div>

          <div>
            <h4>{item.title}</h4>
            <p>{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentActivity;
