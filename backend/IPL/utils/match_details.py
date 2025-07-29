import pandas as pd
import numpy as np


# def mergeData():
#     TEAM_NAME_MAP = {
#         'Delhi Daredevils': 'Delhi Capitals',
#         'Kings XI Punjab': 'Punjab Kings',
#         'Rising Pune Supergiants': 'Rising Pune Supergiant',
#         'Rising Pune Supergiant': 'Rising Pune Supergiant',
#         'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
#         'Royal Challengers': 'Royal Challengers Bengaluru',
#         'RCB': 'Royal Challengers Bengaluru',
#         'Punjab Kings': 'Punjab Kings',
#         'Lucknow Super Giants': 'Lucknow Super Giants',
#         'Gujarat Titans': 'Gujarat Titans',
#         'Chennai Super Kings': 'Chennai Super Kings',
#         'Mumbai Indians': 'Mumbai Indians',
#         'Kolkata Knight Riders': 'Kolkata Knight Riders',
#         'Sunrisers Hyderabad': 'Sunrisers Hyderabad',
#         'Rajasthan Royals': 'Rajasthan Royals'
#     }

#     # Load data
#     matches = pd.read_csv("./data/matches.csv")
#     deliveries = pd.read_csv("./data/deliveries.csv")

#     matches['id'] = matches['id'] - matches['id'].min() + 1
#     deliveries['match_id'] = deliveries['match_id'] - deliveries['match_id'].min() + 1

#     if "id" in matches.columns:
#         matches.rename(columns={"id": "match_id"}, inplace=True)

#     matches["match_id"] = matches["match_id"].astype(int)
#     deliveries["match_id"] = deliveries["match_id"].astype(int)

#     for col in ['team1', 'team2', 'toss_winner', 'winner']:
#         if col in matches.columns:
#             matches[col] = matches[col].replace(TEAM_NAME_MAP)

#     for col in ['batting_team', 'bowling_team']:
#         if col in deliveries.columns:
#             deliveries[col] = deliveries[col].replace(TEAM_NAME_MAP)

#     merged_df = pd.merge(deliveries, matches, on='match_id')
    
#     merged_df.to_csv('/data/merged_df')

def getMatchSummary(match_id):
    
    merged_df=pd.read_csv('IPL/data/processed_data/ipl_merged_data.csv')
  
    match_df = merged_df[merged_df['match_id'] == match_id]

    if match_df.empty:
        return None

    match_info = match_df[match_df['match_id'] == match_id].iloc[0]
    team1 = match_info['team1']
    team2 = match_info['team2']

    innings1 = match_df[match_df['inning'] == 1]
    innings2 = match_df[match_df['inning'] == 2]

    score1 = int(innings1['total_runs'].sum())
    score2 = int(innings2['total_runs'].sum())

    wickets1 = int(innings1['player_dismissed'].notna().sum())
    wickets2 = int(innings2['player_dismissed'].notna().sum())

    total_overs = int(match_df['over'].max())

    umpire1 = match_info['umpire1'] if 'umpire1' in match_info else ''
    umpire2 = match_info['umpire2'] if 'umpire2' in match_info else ''

    summary = {
        "match_id": int(match_id),
        "date": str(match_info['date']),
        "venue": str(match_info['venue']),
        "team1": str(team1),
        "team2": str(team2),
        "toss_winner": str(match_info['toss_winner']),
        "toss_decision": str(match_info['toss_decision']),
        "winner": str(match_info['winner']),
        "team1_score": score1,
        "team1_wickets": wickets1,
        "team2_score": score2,
        "team2_wickets": wickets2,
        "total_overs": total_overs,
        "umpire1": umpire1,
        "umpire2": umpire2
    }

    return summary