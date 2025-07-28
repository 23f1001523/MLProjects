import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to the ML Web App</h1>
        <p className="lead">Explore our machine learning predictors and recommenders</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 rounded-5">
            <div className="card-body text-center">
              <h5 className="card-title">Winning Team Predictor</h5>
              <p className="card-text">Predict match winners using pre-match stats.</p>
              <Link to="/iplpredictors/team-win" className="btn btn-primary">Try Now</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 rounded-5">
            <div className="card-body text-center">
              <h5 className="card-title">Chasing Team Prediction</h5>
              <p className="card-text">Predict match outcome while chasing.</p>
              <Link to="/iplpredictors/chasing-team" className="btn btn-success">Try Now</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg border-0 mb-4 rounded-5">
            <div className="card-body text-center">
              <h5 className="card-title">Recommenders</h5>
              <p className="card-text">Discover our AI-powered recommenders.</p>
              <Link to="/recommenders" className="btn btn-info">Explore</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
