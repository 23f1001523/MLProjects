import pandas as pd
import numpy as np

def mergeData():
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
        'Gujarat Lions': 'Gujarat Titans',
        'Gujarat Titans': 'Gujarat Titans',
        'Chennai Super Kings': 'Chennai Super Kings',
        'Mumbai Indians': 'Mumbai Indians',
        'Kolkata Knight Riders': 'Kolkata Knight Riders',
        'Sunrisers Hyderabad': 'Sunrisers Hyderabad',
        'Rajasthan Royals': 'Rajasthan Royals'
    }

    # Load data
    matches = pd.read_csv("./ipl/data/raw_data/matches.csv")
    deliveries = pd.read_csv("./ipl/data/raw_data/deliveries.csv")

    # Normalize match_id
    matches['id'] = matches['id'] - matches['id'].min() + 1
    deliveries['match_id'] = deliveries['match_id'] - deliveries['match_id'].min() + 1

    # Rename column
    if "id" in matches.columns:
        matches.rename(columns={"id": "match_id"}, inplace=True)

    matches["match_id"] = matches["match_id"].astype(int)
    deliveries["match_id"] = deliveries["match_id"].astype(int)

    # Standardize team names
    for col in ['team1', 'team2', 'toss_winner', 'winner']:
        if col in matches.columns:
            matches[col] = matches[col].replace(TEAM_NAME_MAP)

    for col in ['batting_team', 'bowling_team']:
        if col in deliveries.columns:
            deliveries[col] = deliveries[col].replace(TEAM_NAME_MAP)

    # Add match_number column (1 to N)
    match_ids_sorted = sorted(matches['match_id'].unique())
    match_number_map = {match_id: i+1 for i, match_id in enumerate(match_ids_sorted)}
    matches['match_number'] = matches['match_id'].map(match_number_map)

    # Merge and add match_number to merged dataframe
    merged_df = pd.merge(deliveries, matches, on='match_id')
    merged_df['match_number'] = merged_df['match_id'].map(match_number_map)

    # Save output
    merged_df.to_csv('./IPL/data/processed_data/ipl_merged_data.csv', index=False)

mergeData()
