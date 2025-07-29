import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TeamStats = () => {
  const [teamName, setTeamName] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/options`);
        setTeamOptions(res.data);
      } catch (err) {
        console.error("Error fetching team options", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const fetchStats = async () => {
    if (!teamName) return;
    setLoadingStats(true);
    setStats(null);
    setError('');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/ipl/teamstats/${encodeURIComponent(teamName)}`);
      setStats(res.data);
    } catch (err) {
      setError('Team not found or error fetching data.');
    } finally {
      setLoadingStats(false);
    }
  };

  const barChartData = stats?.yearly_wins
    ? {
        labels: Object.keys(stats.yearly_wins),
        datasets: [
          {
            label: `${stats.team} Wins per Season`,
            backgroundColor: '#007bff',
            data: Object.values(stats.yearly_wins),
          },
        ],
      }
    : null;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">🏏 Team Performance Summary</h2>

      {loadingOptions ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading teams...</p>
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-6 offset-md-3">
              <select
                className="form-select"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              >
                <option value="">Select a Team</option>
                {teamOptions.teams.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mb-4">
            <button
              className="btn btn-primary"
              onClick={fetchStats}
              disabled={!teamName || loadingStats}
            >
              {loadingStats ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Loading...
                </>
              ) : (
                'Get Stats'
              )}
            </button>
          </div>
        </>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="card shadow p-4">
          <h4 className="mb-3">📋 Summary for <strong>{stats.team}</strong></h4>
          <div className="row mb-3">
            <div className="col-md-3"><strong>Total Matches:</strong> {stats.total_matches}</div>
            <div className="col-md-3"><strong>Wins:</strong> {stats.wins}</div>
            <div className="col-md-3"><strong>Losses:</strong> {stats.losses}</div>
            <div className="col-md-3"><strong>Win %:</strong> {stats.win_percentage}%</div>
          </div>

          {barChartData && (
            <div>
              <h5 className="mt-4">📊 Wins by Season</h5>
              <Bar data={barChartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamStats;
