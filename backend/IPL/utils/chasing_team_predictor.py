import pickle
import pandas as pd

# Load trained model
with open("./IPL/models/chasing_team_win_model.pkl", "rb") as f:
    model = pickle.load(f)

# Load feature columns
with open("./IPL/models/chasing_team_win_columns.pkl", "rb") as f:
    model_columns = pickle.load(f)

def run_second_innings_prediction(data):
    try:
        # Extract numerical inputs
        runs_scored = int(data["runs_scored"])
        overs_played = float(data["overs_played"])
        wickets_fallen = int(data["wickets_fallen"])
        target = int(data["target"])
        total_overs = int(data["total_overs"])

        # Extract categorical inputs
        batting_team = data["batting_team"]
        opponent_team = data["opponent_team"]
        venue = data["venue"]

        # Derived features
        runs_left = target - runs_scored
        balls_left = (total_overs * 6) - int(overs_played * 6)
        wickets_left = 10 - wickets_fallen
        current_run_rate = runs_scored / overs_played if overs_played > 0 else 0
        required_run_rate = (runs_left * 6) / balls_left if balls_left > 0 else 0

        # Prepare input DataFrame
        input_df = pd.DataFrame([{
            "runs_left": runs_left,
            "balls_left": balls_left,
            "wickets_left": wickets_left,
            "current_run_rate": current_run_rate,
            "required_run_rate": required_run_rate,
            "batting_team": batting_team,
            "opponent_team": opponent_team,
            "venue": venue
        }])

        # One-hot encode
        input_encoded = pd.get_dummies(input_df, columns=["batting_team", "opponent_team", "venue"])

        # Align with model training columns
        input_encoded = input_encoded.reindex(columns=model_columns, fill_value=0)

        # Predict
        prediction = model.predict(input_encoded)[0]
        probability = model.predict_proba(input_encoded)[0].tolist()

        return {
            "prediction": int(prediction),
            "probability": {
                "lose": round(probability[0], 3),
                "win": round(probability[1], 3)
            },
            "current_run_rate": round(current_run_rate, 2),
            "required_run_rate": round(required_run_rate, 2)
        }

    except Exception as e:
        return {"error": str(e)}
