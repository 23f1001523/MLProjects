import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">ML App</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/* Predictors Dropdown */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="predictorsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Predictors
            </a>
            <ul className="dropdown-menu" aria-labelledby="predictorsDropdown">
              <li><Link className="dropdown-item" to="/predictors/team-win">Team Winning Prediction</Link></li>
              <li><Link className="dropdown-item" to="/predictors/chasing-team">Chasing Team Prediction</Link></li>
            </ul>
          </li>

          {/* Other links */}
          <li className="nav-item">
            <Link className="nav-link" to="/recommenders">Recommenders</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/documentation">Documentation</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
