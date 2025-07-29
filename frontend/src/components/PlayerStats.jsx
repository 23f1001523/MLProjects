import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/player-options`);
        setPlayers(res.data);
      } catch (err) {
        console.error('Failed to load players', err);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  const fetchStats = async () => {
    if (!selectedPlayer) return;
    setLoading(true);
    setStats(null);
    setError('');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/ipl/playerstats/${encodeURIComponent(selectedPlayer)}`);
      setStats(res.data);
    } catch (err) {
      setError('Player not found or error fetching stats');
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats?.runs_per_season
    ? {
        labels: Object.keys(stats.runs_per_season),
        datasets: [
          {
            label: `Runs by Season`,
            backgroundColor: '#28a745',
            data: Object.values(stats.runs_per_season),
          }
        ]
      }
    : null;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">👤 Player Performance Summary</h2>

      {loadingPlayers ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading players...</p>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-md-6 offset-md-3">
              <select
                className="form-select"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
              >
                <option value="">Select Player</option>
                {players.map((player, idx) => (
                  <option key={idx} value={player}>{player}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center mb-4">
            <button
              className="btn btn-success"
              onClick={fetchStats}
              disabled={!selectedPlayer || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Fetching Stats...
                </>
              ) : (
                'Get Player Stats'
              )}
            </button>
          </div>
        </>
      )}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {stats && (
        <div className="card shadow p-4">
          <h4 className="mb-3">📊 Stats for <strong>{stats.player}</strong></h4>
          <div className="row mb-2">
            <div className="col-md-3"><strong>Matches:</strong> {stats.total_matches}</div>
            <div className="col-md-3"><strong>Runs:</strong> {stats.total_runs}</div>
            <div className="col-md-3"><strong>Strike Rate:</strong> {stats.strike_rate}</div>
            <div className="col-md-3"><strong>Balls Faced:</strong> {stats.balls_faced}</div>
          </div>
          <div className="row mb-2">
            <div className="col-md-3"><strong>4s:</strong> {stats.fours}</div>
            <div className="col-md-3"><strong>6s:</strong> {stats.sixes}</div>
            <div className="col-md-3"><strong>Wickets:</strong> {stats.wickets}</div>
            <div className="col-md-3"><strong>Overs Bowled:</strong> {stats.overs_bowled}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3"><strong>Economy:</strong> {stats.economy}</div>
            <div className="col-md-9"><strong>Teams:</strong> {stats.teams_played.join(', ')}</div>
          </div>

          {chartData && (
            <div>
              <h5 className="mt-4">🏏 Runs Per Season</h5>
              <Bar data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
