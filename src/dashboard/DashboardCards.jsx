import "./DashboardCards.css";

function DashboardCards({ cards }) {
  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div className="card" key={card.title}>
          <div className="card-icon" style={{ background: card.color }}>
            <card.icon size={28} />
          </div>

          <div className="card-content">
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
            <p>{card.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
