import pickle
import pandas as pd
from flask import jsonify

# Load saved objects
with open("churn_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("columns.pkl", "rb") as f:
    trained_columns = pickle.load(f)  # This contains all columns used during training

def predict_churn(data):  
    # Encode gender
    gender = 1 if data["gender"] == "M" else 0
    state = data["state"]

    # Prepare base input row
    input_row = {
        "age": data["age"],
        "gender": gender,
        "estimated_salary": data["estimated_salary"],
        "calls_made": data["calls_made"],
        "sms_sent": data["sms_sent"],
        "data_used": data["data_used"],
    }

    # One-hot encode state
    for col in trained_columns:
        if col.startswith("state_"):
            input_row[col] = 1 if col == f"state_{state}" else 0

    # Fill missing columns (if any)
    for col in trained_columns:
        if col not in input_row:
            input_row[col] = 0

    # Convert to DataFrame with correct column order
    input_df = pd.DataFrame([input_row])[trained_columns]

    # Scale
    input_scaled = scaler.transform(input_df)

    # Predict
    prediction = model.predict(input_scaled)[0]
    prob = model.predict_proba(input_scaled)[0][1]

    return {"churn": int(prediction), "probability": round(prob, 4)}
