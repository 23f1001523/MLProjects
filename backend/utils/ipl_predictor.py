import pickle
import numpy as np

# Load model and encoders
model, label_encoders, le_winner = pickle.load(open("models/ipl_model.pkl", "rb"))

def predict_ipl(data):
    try:
        input_data = []
        for feature in ["team1", "team2", "venue", "toss_winner", "toss_decision"]:
            value = data.get(feature)
            le = label_encoders[feature]
            encoded = le.transform([value])[0] if value in le.classes_ else 0
            input_data.append(encoded)

        input_array = np.array([input_data])

        # Predict probabilities
        probs = model.predict_proba(input_array)[0]
        winner_index = np.argmax(probs)
        predicted_winner = le_winner.inverse_transform([winner_index])[0]
        confidence = float(probs[winner_index])

        return {
            "winner": predicted_winner,
            "confidence": round(confidence, 4)
        }
    except Exception as e:
        return {"error": str(e)}
