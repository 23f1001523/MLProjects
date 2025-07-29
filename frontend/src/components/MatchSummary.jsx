import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const MatchSummary = () => {
  const [matchId, setMatchId] = useState("");
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchOptions, setMatchOptions] = useState([]);

  // Load match IDs from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/matches`)
      .then((res) => setMatchOptions(res.data))
      .catch(() => setError("Failed to load match options."));
  }, []);

  const fetchMatch = () => {
    if (!matchId) {
      setError("Please select a match.");
      return;
    }
    setLoading(true);
    setError(null);
    setMatch(null);

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/ipl/matchsummary/${matchId}`)
      .then((response) => {
        setMatch(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Match not found or server error.");
        setLoading(false);
      });
  };

  const renderMatchSelect = () => (
    <div className="input-group w-50 mx-auto mt-3">
      <select
        className="form-select"
        value={matchId}
        onChange={(e) => setMatchId(e.target.value)}
      >
        <option value="">Select Match ID</option>
        {matchOptions.map((id) => (
          <option key={id} value={id}>
            Match #{id}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={fetchMatch}>
        <i className="bi bi-search"></i> Get Summary
      </button>
    </div>
  );

  // Toss and result logic
  const totalOvers = match?.total_overs || "20";
  const tossTeam1 = match?.toss_winner === match?.team1 ? "Won" : "Lost";
  const tossTeam2 = match?.toss_winner === match?.team2 ? "Won" : "Lost";
  const tossDecisionTeam1 =
    match?.toss_winner === match?.team1 ? match?.toss_decision : "-";
  const tossDecisionTeam2 =
    match?.toss_winner === match?.team2 ? match?.toss_decision : "-";
  const resultTeam1 = match?.winner === match?.team1 ? "Won" : "Lost";
  const resultTeam2 = match?.winner === match?.team2 ? "Won" : "Lost";

  return (
    <div className="container mt-5">
      {/* Match ID dropdown */}
      <div className="mb-4 text-center text-primary">
        <h4>🔍 Search IPL Match Summary</h4>
        {renderMatchSelect()}
        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading match summary...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center mt-3">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}
      </div>

      {match && (
        <>
          {/* Match basic info */}
          <div className="mb-3 p-3 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-center">
              🏏 Match <span className="badge bg-primary">#{match.match_id}</span>
            </h5>
            <div
              className="d-flex flex-wrap justify-content-between text-muted"
              style={{ fontSize: "0.9rem" }}
            >
              <div>
                <i className="bi bi-calendar-event"></i> <strong>Date:</strong>{" "}
                {match.date}
              </div>
              <div>
                <i className="bi bi-geo-alt-fill"></i> <strong>Venue:</strong>{" "}
                {match.venue}
              </div>
              <div>
                <i className="bi bi-stopwatch"></i> <strong>Total Overs:</strong>{" "}
                {totalOvers}
              </div>
              <div>
                <i className="bi bi-people-fill"></i> <strong>Umpires:</strong>{" "}
                {match.umpire1} &amp; {match.umpire2}
              </div>
            </div>
          </div>

          {/* Three-column team comparison */}
          <div className="bg-white border rounded shadow-sm p-4">
            <table className="table table-borderless text-center align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-primary fw-bold">{match.team1}</th>
                  <th className="text-primary fw-bold">{match.team2}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-start fw-semibold">🪙 Toss</td>
                  <td>{tossTeam1}</td>
                  <td>{tossTeam2}</td>
                </tr>
                <tr>
                  <td className="text-start fw-semibold">🎯 Decision</td>
                  <td>{tossDecisionTeam1}</td>
                  <td>{tossDecisionTeam2}</td>
                </tr>
                <tr>
                  <td className="text-start fw-semibold">🏏 Scores</td>
                  <td className="text-success fw-bold fs-4">
                    {match.team1_score} runs
                  </td>
                  <td className="text-success fw-bold fs-4">
                    {match.team2_score} runs
                  </td>
                </tr>
                <tr>
                  <td className="text-start fw-semibold">⚰️ Wickets</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td className="text-start fw-semibold">🏆 Result</td>
                  <td
                    className={
                      resultTeam1 === "Won"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {resultTeam1}
                  </td>
                  <td
                    className={
                      resultTeam2 === "Won"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {resultTeam2}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchSummary;
