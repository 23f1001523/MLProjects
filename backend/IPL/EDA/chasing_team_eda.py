import pandas as pd
import numpy as np

# Standardize team names to 2025 teams
TEAM_NAME_MAP = {
    'Delhi Daredevils': 'Delhi Capitals',
    'Kings XI Punjab': 'Punjab Kings',
    'Rising Pune Supergiants': 'Rising Pune Supergiant',
    'Rising Pune Supergiant': 'Rising Pune Supergiant',
    'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
    'Royal Challengers': 'Royal Challengers Bengaluru',
    'RCB': 'Royal Challengers Bengaluru',
    'Punjab Kings': 'Punjab Kings',
    'Lucknow Super Giants': 'Lucknow Super Giants',
    'Gujarat Titans': 'Gujarat Titans',
    'Chennai Super Kings': 'Chennai Super Kings',
    'Mumbai Indians': 'Mumbai Indians',
    'Kolkata Knight Riders': 'Kolkata Knight Riders',
    'Sunrisers Hyderabad': 'Sunrisers Hyderabad',
    'Rajasthan Royals': 'Rajasthan Royals'
}

# Load data
matches = pd.read_csv("./data/matches.csv")
deliveries = pd.read_csv("./data/deliveries.csv")

# Rename id to match_id
if "id" in matches.columns:
    matches.rename(columns={"id": "match_id"}, inplace=True)

# Ensure consistent types
matches["match_id"] = matches["match_id"].astype(int)
deliveries["match_id"] = deliveries["match_id"].astype(int)

# Standardize team names in matches
for col in ['team1', 'team2', 'toss_winner', 'winner']:
    if col in matches.columns:
        matches[col] = matches[col].replace(TEAM_NAME_MAP)

# Standardize team names in deliveries
for col in ['batting_team', 'bowling_team']:
    if col in deliveries.columns:
        deliveries[col] = deliveries[col].replace(TEAM_NAME_MAP)

# Merge data
merged_df = pd.merge(deliveries, matches, on='match_id')

# Filter only second innings
second_innings = merged_df[merged_df["inning"] == 2].copy()

# Legal balls only
legal_df = second_innings[second_innings['extras_type'].isna()].copy()
legal_df['legal_ball_number'] = legal_df.groupby('match_id').cumcount() + 1

# Merge legal ball number back
second_innings = second_innings.merge(
    legal_df[['match_id', 'over', 'ball', 'legal_ball_number']],
    on=['match_id', 'over', 'ball'],
    how='left'
)

# Basic match state
second_innings['runs_left'] = second_innings['target_runs'] - second_innings['total_runs']
second_innings['balls_left'] = (second_innings['target_overs'] * 6) - second_innings['legal_ball_number']
second_innings['wickets_left'] = 10 - second_innings.groupby('match_id')['is_wicket'].cumsum()
second_innings['legal_ball_number'] = second_innings['legal_ball_number'].replace(0, 1)

# Run rates
second_innings['current_run_rate'] = second_innings['total_runs'] / (second_innings['legal_ball_number'] / 6)
second_innings['required_run_rate'] = second_innings['runs_left'] / (second_innings['balls_left'] / 6)

# Target variable
second_innings['won'] = (second_innings['batting_team'] == second_innings['winner']).astype(int)

# Add opponent team
second_innings['opponent_team'] = np.where(
    second_innings['batting_team'] == second_innings['team1'],
    second_innings['team2'],
    second_innings['team1']
)

# Choose base features
base_features = ['runs_left', 'balls_left', 'wickets_left', 'current_run_rate', 'required_run_rate']

# Drop rows with NaNs
df_model = second_innings.dropna(subset=base_features + ['won'])

# Remove inf values
df_model[base_features] = df_model[base_features].replace([np.inf, -np.inf], np.nan)
df_model = df_model.dropna(subset=base_features + ['won'])

# One-hot encode categorical features
df_model = pd.get_dummies(df_model, columns=['batting_team', 'opponent_team', 'venue'], prefix=['bat', 'opp', 'venue'])

# Final feature list
feature_columns = [col for col in df_model.columns if col in base_features or col.startswith(('bat_', 'opp_', 'venue_'))]

# Save processed dataset
df_model[feature_columns + ['won']].to_csv("./data/processed_match_data.csv", index=False)

print("✅ processed_match_data.csv saved with chasing team, opponent team, and venue as features.")
