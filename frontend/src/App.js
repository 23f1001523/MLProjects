import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TeamWinPredictor from "./components/TeamWinPredictor";
import ChasingTeamPredictor from "./components/ChasingTeamPredictor";
// import MatchDetails from "./pages/MatchDetails";
// import PlayerDetails from "./pages/PlayerDetails";
import Recommenders from "./pages/Recommenders";
import Documentation from "./pages/Documentation";
import IPLPage from "./pages/IPLPage"; // <-- Make sure this is imported
import MatchSummary from "./components/MatchSummary";
import TeamStats from "./components/TeamStats";
import PlayerStats from "./components/PlayerStats";
import ChurnCusotmers from "./components/ChurnCustromers";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iplpredictors" element={<IPLPage />}>
            <Route path="team-win" element={<TeamWinPredictor />} />
            <Route path="chasing-team" element={<ChasingTeamPredictor />} />
            <Route path="matchsummary" element={<MatchSummary />} />
            <Route path="teamstats" element={<TeamStats />} />
            <Route path="playerstats" element={<PlayerStats />} />
          </Route>
          <Route path="/recommenders" element={<Recommenders />} />
          <Route path="/churnpredictor" element={<ChurnCusotmers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
