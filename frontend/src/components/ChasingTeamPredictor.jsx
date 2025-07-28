import React, { useState, useEffect } from "react";
import axios from "axios";

function ChasingTeamPredictor() {
  const [formData, setFormData] = useState({
    batting_team: "",
    opponent_team: "",
    venue: "",
    runs_scored: "",
    overs_played: "",
    wickets_fallen: "",
    target: "",
    total_overs: 20,
  });

  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/options")
      .then((res) => {
        setTeams(res.data.teams || []);
        setVenues(res.data.venues || []);
      })
      .catch((err) => {
        console.error("Error fetching options:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/predict/chasingteam",
        formData
      );
      setResult(res.data);
    } catch (error) {
      alert("Prediction failed. Check console for details.");
      console.error(error);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <img src="/winlose.jpg" alt="Win/Loss" style={{ height: "80px" }} />
        <h2 className="text-primary fw-bold">🔮 Chasing Team Win Prediction</h2>
      </div>

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Batting Team */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">🧢 Chasing Team</label>
              <select
                name="batting_team"
                className="form-select"
                value={formData.batting_team}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Team --</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Opponent Team */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">🛡️ Opponent Team</label>
              <select
                name="opponent_team"
                className="form-select"
                value={formData.opponent_team}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Team --</option>
                {teams
                  .filter((team) => team !== formData.batting_team)
                  .map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
              </select>
            </div>

            {/* Venue */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">📍 Match Venue</label>
              <select
                name="venue"
                className="form-select"
                value={formData.venue}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Venue --</option>
                {venues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Runs Scored */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">🏃‍♂️ Runs Scored</label>
              <input
                type="number"
                className="form-control"
                name="runs_scored"
                value={formData.runs_scored}
                onChange={handleChange}
                required
              />
            </div>

            {/* Overs Played */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">⏱️ Overs Played</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                name="overs_played"
                value={formData.overs_played}
                onChange={handleChange}
                required
              />
            </div>

            {/* Wickets Fallen */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">💥 Wickets Fallen</label>
              <input
                type="number"
                className="form-control"
                name="wickets_fallen"
                value={formData.wickets_fallen}
                onChange={handleChange}
                required
              />
            </div>

            {/* Target */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">🎯 Target Score</label>
              <input
                type="number"
                className="form-control"
                name="target"
                value={formData.target}
                onChange={handleChange}
                required
              />
            </div>

            {/* Total Overs */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">📏 Total Overs</label>
              <input
                type="number"
                className="form-control"
                name="total_overs"
                value={formData.total_overs}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button type="submit" className="btn btn-primary px-4">
              ⚡ Predict Outcome
            </button>
          </div>
        </form>
      </div>

      {/* Prediction Result */}
      {result && (
        <div className="card shadow-lg mt-5 border-success bg-white p-4">
          <h4 className="text-success mb-3 fw-bold text-center">
            📊 Prediction Result
          </h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              🧢 <strong>Chasing Team:</strong> {formData.batting_team}
            </li>
            <li className="list-group-item">
              📉 <strong>Current Run Rate:</strong>{" "}
              {result.current_run_rate !== undefined
                ? result.current_run_rate.toFixed(2)
                : "N/A"}
            </li>
            <li className="list-group-item">
              📈 <strong>Required Run Rate:</strong>{" "}
              {result.required_run_rate !== undefined
                ? result.required_run_rate.toFixed(2)
                : "N/A"}
            </li>
            <li className="list-group-item">
              🎯 <strong>Prediction:</strong>{" "}
              {result.prediction === 1 ? (
                <span className="text-success">✅ Chasing team will win</span>
              ) : (
                <span className="text-danger">❌ Chasing team will lose</span>
              )}
            </li>
          </ul>

          {result.probability && (
            <div className="mt-4">
              <div className="alert alert-info">
                <h5>📋 Prediction Summary</h5>
                <p>
                  <strong>Result:</strong>{" "}
                  {result.prediction === 1 ? "Win" : "Lose"}
                </p>
                <p>
                  <strong>Winning Probability:</strong>{" "}
                  {Math.round(result.probability.win * 100)}%
                </p>
                <p>
                  <strong>Losing Probability:</strong>{" "}
                  {Math.round(result.probability.lose * 100)}%
                </p>
              </div>

              <h6 className="mb-2 fw-semibold">📊 Win Probability</h6>
              <div className="progress" style={{ height: "30px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${Math.round(result.probability.win * 100)}%`,
                  }}
                >
                  🟢 Win {Math.round(result.probability.win * 100)}%
                </div>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{
                    width: `${Math.round(result.probability.lose * 100)}%`,
                  }}
                >
                  🔴 Lose {Math.round(result.probability.lose * 100)}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChasingTeamPredictor;
