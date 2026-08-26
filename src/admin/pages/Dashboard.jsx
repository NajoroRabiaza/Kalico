import "./dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-card__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="dashboard-card__title">Arrive bientôt...</h1>
        <p className="dashboard-card__subtitle">
          Veuillez patienter, cette fonctionnalité sera introduite prochainement.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;