from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from IPL.utils.options import get_dropdown_options
# from utils.churn_predictor import predict_churn
from IPL.utils.team_winning_predictor import predict_ipl
from IPL.utils.chasing_team_predictor import run_second_innings_prediction
from IPL.utils.match_details import getMatchSummary
from IPL.utils.teams_stats import getTeamSummary
from IPL.utils.players_stats import get_player_summary
# from utils.recommender import recommend_movies

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello World"



@app.route("/api/options", methods=["GET"])
def get_options():
    return jsonify(get_dropdown_options())

@app.route("/api/predict/ipl", methods=["POST"])
def predict_match_winner():
    data = request.json
    result = predict_ipl(data)
    return jsonify(result)

@app.route("/api/predict/chasingteam", methods=["POST"])
def second_innings_route():
    try:
        data = request.get_json()
        print("Received data:", data)

        result = run_second_innings_prediction(data)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
    
@app.route('/ipl/matchsummary/<int:match_id>')
def match_summary(match_id):
    try:
        result = getMatchSummary(match_id)
        print("Received data:", result)

        if result is None:
            return jsonify({"error": "Match not found"}), 404

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/ipl/teamstats/<team_name>')
def team_summary(team_name):
    try:
        summary = getTeamSummary(team_name)
        if not summary:
            return jsonify({"error": "Team not found"}), 404
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/ipl/playerstats/<string:player_name>")
def player_summary(player_name):
    summary = get_player_summary(player_name)
    if "error" in summary:
        return jsonify(summary), 404
    return jsonify(summary)

@app.route("/api/player-options")
def player_options():
    deliveries = pd.read_csv('./ipl/data/raw_data/deliveries.csv')
    players = sorted(pd.unique(deliveries[['batter', 'bowler']].values.ravel()))
    return jsonify(players)

@app.route("/api/matches", methods=["GET"])
def match_options():
    matches = pd.read_csv('./ipl/data/processed_data/ipl_merged_data.csv')
    
    match_list = sorted(int(x) for x in matches["match_number"].unique())
    
    return jsonify(match_list)


if __name__ == "__main__":
    app.run(debug=True)