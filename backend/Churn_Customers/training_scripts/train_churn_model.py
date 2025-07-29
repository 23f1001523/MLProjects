import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report
import pickle

# Load dataset
df = pd.read_csv("Churn_Customers/data/telecom_churn.csv")

# Step 1: Select essential columns + state
selected_columns = ["age", "gender", "estimated_salary", "calls_made", "sms_sent", "data_used", "state", "churn"]
df_minimal = df[selected_columns].copy()

# Step 2: Encode gender
df_minimal["gender"] = df_minimal["gender"].map({"F": 0, "M": 1})

# Step 3: Group infrequent states
state_counts = df_minimal["state"].value_counts()
rare_states = state_counts[state_counts < 500].index
df_minimal["state"] = df_minimal["state"].replace(rare_states, "Other")

# Step 4: One-hot encode state
df_minimal = pd.get_dummies(df_minimal, columns=["state"], drop_first=True)

# Step 5: Define features and target
X = df_minimal.drop("churn", axis=1)
y = df_minimal["churn"]

# Step 6: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 7: Scale numeric features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 8: Train logistic regression model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# Step 9: Evaluate
y_pred = model.predict(X_test_scaled)
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save model, scaler, and columns
with open("churn_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

with open("columns.pkl", "wb") as f:
    pickle.dump(X.columns.tolist(), f)
