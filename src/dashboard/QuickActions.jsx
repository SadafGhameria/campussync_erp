import "./QuickActions.css";

function QuickActions({ actions }) {
  return (
    <div className="quick-card">
      <h3>Quick Actions</h3>

      {actions.map((action) => (
        <button key={action.label}>
          <action.icon size={18} />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
