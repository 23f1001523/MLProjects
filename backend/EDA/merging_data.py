import pandas as pd
import numpy as np

# Load CSVs
matches = pd.read_csv("./data/matches.csv") #has id
deliveries = pd.read_csv("./data/deliveries.csv") #has match_id

# Ensure match_id is consistent
if "id" in matches.columns:
    matches.rename(columns={"id": "match_id"}, inplace=True)
    
# Converted to int
matches["match_id"] = matches["match_id"].astype(int)
deliveries["match_id"] = deliveries["match_id"].astype(int)

# Merge
merged_df = pd.merge(deliveries, matches, left_on='match_id', right_on='match_id')

# Second innings only
second_innings = merged_df[merged_df["inning"] == 2].copy()


legal_df = second_innings[second_innings['extras_type'].isna()].copy()
legal_df['legal_ball_number'] = legal_df.groupby('match_id').cumcount() + 1

second_innings = second_innings.merge(
    legal_df[['match_id', 'over', 'ball', 'legal_ball_number']],
    on=['match_id', 'over', 'ball'],
    how='left'
)


# Basic metrics
second_innings['runs_left'] = second_innings['target_runs'] - second_innings['total_runs']
second_innings['balls_left'] = (second_innings['target_overs'] * 6) - second_innings['legal_ball_number']
second_innings['wickets_left'] = 10 - second_innings.groupby('match_id')['is_wicket'].cumsum()

# Avoid divide-by-zero errors
second_innings['legal_ball_number'] = second_innings['legal_ball_number'].replace(0, 1)

# Run rates
second_innings['current_run_rate'] = second_innings['total_runs'] / (second_innings['legal_ball_number'] / 6)
second_innings['required_run_rate'] = second_innings['runs_left'] / (second_innings['balls_left'] / 6)


second_innings['won'] = (second_innings['batting_team'] == second_innings['winner']).astype(int)


features = ['runs_left', 'balls_left', 'wickets_left', 'current_run_rate', 'required_run_rate']
df_model = second_innings.dropna(subset=features + ['won'])

# Replace inf/-inf with NaN
df_model[features] = df_model[features].replace([np.inf, -np.inf], np.nan)

# Drop rows with any NaNs
df_model = df_model.dropna(subset=features + ['won'])

# Save
second_innings.to_csv("./data/match_progress_data.csv", index=False)
print("✅ match_progress_data.csv saved.")
