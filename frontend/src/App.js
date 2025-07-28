import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TeamWinPredictor from "./pages/TeamWinPredictor";
import Recommenders from "./pages/Recommenders";
import Documentation from "./pages/Documentation";
import ChasingTeamPredictor from "./pages/ChasingTeamPredictor";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predictors/team-win" element={<TeamWinPredictor />} />
           <Route path="/predictors/chasing-team" element={<ChasingTeamPredictor />} />
          <Route path="/recommenders" element={<Recommenders />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
