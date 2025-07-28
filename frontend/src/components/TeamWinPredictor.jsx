import React, { useState, useEffect } from "react";

function Predictors() {
  const [formData, setFormData] = useState({
    team1: "",
    team2: "",
    venue: "",
    toss_winner: "",
    toss_decision: ""
  });

  const [options, setOptions] = useState({
    teams: [],
    venues: [],
    toss_decisions: []
  });

  const [tossOptions, setTossOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/options")
      .then(res => res.json())
      .then(data => setOptions(data));
  }, []);

  useEffect(() => {
    if (formData.team1 && formData.team2 && formData.team1 !== formData.team2) {
      setTossOptions([formData.team1, formData.team2]);
    } else {
      setTossOptions([]);
      setFormData(prev => ({ ...prev, toss_winner: "" }));
    }
  }, [formData.team1, formData.team2]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...formData, [name]: value };

    // Reset toss winner if team1/team2 changed
    if (name === "team1" || name === "team2") {
      newForm.toss_winner = "";
    }

    setFormData(newForm);
    setError("");
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { team1, team2, venue, toss_winner, toss_decision } = formData;

    if (!team1 || !team2 || !venue || !toss_winner || !toss_decision) {
      setError("⚠️ Please fill out all fields.");
      return;
    }

    if (team1 === team2) {
      setError("🚫 Team 1 and Team 2 cannot be the same.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/predict/ipl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("❌ Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <img src="/ipl-logo.jpg" alt="IPL Logo" style={{ height: "100px" }} />
        <h2 className="mt-3 text-primary">🔮 Team Winning Prediction</h2>
      </div>

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label>🏏 Team 1</label>
              <select name="team1" className="form-control" onChange={handleChange} value={formData.team1}>
                <option value="">Select Team 1</option>
                {options.teams
                  .filter(team => team !== formData.team2)
                  .map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>🏏 Team 2</label>
              <select name="team2" className="form-control" onChange={handleChange} value={formData.team2}>
                <option value="">Select Team 2</option>
                {options.teams
                  .filter(team => team !== formData.team1)
                  .map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label>📍 Venue</label>
              <select name="venue" className="form-control" onChange={handleChange} value={formData.venue}>
                <option value="">Select Venue</option>
                {options.venues.map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>🪙 Toss Winner</label>
              <select
                name="toss_winner"
                className="form-control"
                onChange={handleChange}
                value={formData.toss_winner}
                disabled={tossOptions.length < 2}
              >
                <option value="">Select Toss Winner</option>
                {tossOptions.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>📤 Toss Decision</label>
            <select name="toss_decision" className="form-control" onChange={handleChange} value={formData.toss_decision}>
              <option value="">Select Toss Decision</option>
              {options.toss_decisions.map(dec => (
                <option key={dec} value={dec}>{dec}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "⏳ Predicting..." : "🎯 Predict Winner"}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {result?.winner && (
          <div className="alert alert-success mt-4">
            <h5>🏆 Predicted Winner: {result.winner}</h5>
            {result.confidence && (
              <p>📊 Confidence: {(result.confidence * 100).toFixed(2)}%</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Predictors;
