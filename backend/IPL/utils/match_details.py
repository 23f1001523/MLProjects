import pandas as pd
import numpy as np


def getMatchSummary(match_id):
    
    merged_df=pd.read_csv('IPL/data/processed_data/ipl_merged_data.csv')
  
    match_df = merged_df[merged_df['match_number'] == match_id]

    if match_df.empty:
        return None

    match_info = match_df[match_df['match_number'] == match_id].iloc[0]
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