import pickle
import pandas as pd

with open("./models/second_innings_model.pkl", "rb") as f:
    model = pickle.load(f)

def run_second_innings_prediction(data):
    try:
        runs_scored = int(data["runs_scored"])
        overs_played = float(data["overs_played"])
        wickets_fallen = int(data["wickets_fallen"])
        target = int(data["target"])
        total_overs = int(data["total_overs"])

        runs_left = target - runs_scored
        balls_left = (total_overs * 6) - int(overs_played * 6)
        wickets_left = 10 - wickets_fallen
        current_run_rate = runs_scored / overs_played
        required_run_rate = (runs_left * 6) / balls_left

        features = [runs_left, balls_left, wickets_left, current_run_rate, required_run_rate]
        columns = ["runs_left", "balls_left", "wickets_left", "current_run_rate", "required_run_rate"]
        X = pd.DataFrame([features], columns=columns)

        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0].tolist()

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
