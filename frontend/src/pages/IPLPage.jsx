import { Link, Outlet } from "react-router-dom";
import "../IPLPage.css"; // optional, for custom height styles

function IPLPage() {
  return (
    <div className="row vh-100">
      {/* Sidebar */}

      <div className="col-md-2 bg-light p-4 border-end">
        <div className="bg-primary text-white text-center py-2 rounded mb-3">
          <i className="bi bi-graph-up-arrow me-2"></i>
          <strong>IPL Predictions</strong>
        </div>

        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="team-win">
              <i className="bi bi-trophy-fill me-2"></i> Team Winning Prediction
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="chasing-team">
              <i className="bi bi-flag-fill me-2"></i> Chasing Team Prediction
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="match-details">
              <i className="bi bi-calendar-event-fill me-2"></i> Match Details
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="player-details">
              <i className="bi bi-person-lines-fill me-2"></i> Player Details
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="col-md-10 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default IPLPage;
