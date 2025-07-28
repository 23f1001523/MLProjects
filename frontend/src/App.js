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
            {/* <Route path="match-details" element={<MatchDetails />} /> */}
            {/* <Route path="player-details" element={<PlayerDetails />} /> */}
          </Route>
          <Route path="/recommenders" element={<Recommenders />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
