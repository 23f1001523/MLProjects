import React, { useState, useEffect } from "react";
import axios from "axios";

function ChasingTeamPredictor() {
  const [form, setForm] = useState({
    chasing_team: "",
    runs_scored: "",
    overs_played: "",
    wickets_fallen: "",
    target: "",
    total_overs: 20,
  });

  const [teamList, setTeamList] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/options")
      .then((res) => res.json())
      .then((data) => setTeamList(data.teams || []))
      .catch((err) => console.error("Failed to fetch teams:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/predict/second_innings",
        form
      );
      setResult(res.data);
    } catch (err) {
      alert("Prediction failed. Please check your input or server.");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 bg-gradient p-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          🏏 Chasing Team Win/Lose Prediction
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">🧢 Chasing Team</label>
              <select
                name="chasing_team"
                className="form-select"
                value={form.chasing_team}
                onChange={handleChange}
                required
              >
                <option value="">Select Team</option>
                {teamList.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">🏃‍♂️ Runs Scored</label>
              <input
                type="number"
                name="runs_scored"
                className="form-control"
                placeholder="e.g. 125"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">⏱️ Overs Played</label>
              <input
                type="number"
                step="0.1"
                name="overs_played"
                className="form-control"
                placeholder="e.g. 15.2"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">💥 Wickets Fallen</label>
              <input
                type="number"
                name="wickets_fallen"
                className="form-control"
                placeholder="e.g. 6"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">🎯 Target Score</label>
              <input
                type="number"
                name="target"
                className="form-control"
                placeholder="e.g. 160"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">📏 Total Overs</label>
              <input
                type="number"
                name="total_overs"
                className="form-control"
                value={form.total_overs}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary btn-lg">
              🔍 Predict Outcome
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card shadow-lg mt-5 border-success bg-white p-4">
          <h4 className="text-success mb-3 fw-bold text-center">
            📊 Prediction Result
          </h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              🧢 <strong>Chasing Team:</strong> {form.chasing_team}
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
                <h5>Prediction Result</h5>
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
