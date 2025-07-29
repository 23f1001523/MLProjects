import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# Load the processed match progress data
df = pd.read_csv("./ipl/data/processed_data/processed_match_data.csv", low_memory=False)

# Preview columns to ensure correctness (optional)
print("🧾 Columns in DataFrame:", df.columns.tolist())

# Features and target
X = df.drop(columns=['won'])  # All columns except 'won' are features
y = df['won']                 # Target column

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Accuracy: {accuracy:.4f}")

# Save model using pickle
with open("./IPL/models/chasing_team_win_model.pkl", "wb") as f:
    pickle.dump(model, f)

# Save expected feature columns
with open("./IPL/models/chasing_team_win_columns.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)

print("💾 Model and columns saved as chasing_team_win_predictor.pkl and chasing_team_win_columns.pkl")
