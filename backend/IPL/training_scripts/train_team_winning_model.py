import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

# Load match data
df = pd.read_csv("ipl/data/raw_data/matches.csv")

# Filter rows with no winner
df = df[df["winner"].notna()]

# Define features and target
features = ["team1", "team2", "venue", "toss_winner", "toss_decision"]
X = df[features].copy()
y = df["winner"]

# Label encode features
label_encoders = {}
for col in X.columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

# Encode target
le_winner = LabelEncoder()
y = le_winner.fit_transform(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and encoders
with open("ipl/models/team_winning_prediciton_model.pkl", "wb") as f:
    pickle.dump((model, label_encoders, le_winner), f)

print("Model trained and saved.")
