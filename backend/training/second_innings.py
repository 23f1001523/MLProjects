import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Load data
df = pd.read_csv("./data/match_progress_data.csv", low_memory=False)

# Features & target
features = ['runs_left', 'balls_left', 'wickets_left', 'current_run_rate', 'required_run_rate']
target = 'won'

# Replace inf/-inf with NaN
df[features] = df[features].replace([np.inf, -np.inf], np.nan)

# Drop rows with any NaNs
df = df.dropna(subset=features + [target])

# Convert features to float32
X = df[features].astype(np.float32)
y = df[target].astype(int)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("📊 Classification Report:")
print(classification_report(y_test, y_pred))

# Save model
with open("./models/second_innings_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ second_innings_model.pkl saved.")
