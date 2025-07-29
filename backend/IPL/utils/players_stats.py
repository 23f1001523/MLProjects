import pandas as pd

def get_player_summary(player_name):
    deliveries = pd.read_csv('./ipl/data/raw_data/deliveries.csv')
    matches = pd.read_csv('./ipl/data/raw_data/matches.csv')

    # Normalize match_id for consistency
    matches['id'] = matches['id'] - matches['id'].min() + 1
    deliveries['match_id'] = deliveries['match_id'] - deliveries['match_id'].min() + 1
    matches.rename(columns={"id": "match_id"}, inplace=True)

    deliveries["match_id"] = deliveries["match_id"].astype(int)

    # Merge season info
    merged = pd.merge(deliveries, matches[['match_id', 'season']], on='match_id')

    player_deliveries = merged[merged['batter'] == player_name]
    bowler_deliveries = merged[merged['bowler'] == player_name]

    if player_deliveries.empty and bowler_deliveries.empty:
        return {"error": "Player not found"}

    total_runs = player_deliveries['batsman_runs'].sum()
    balls_faced = player_deliveries.shape[0]
    fours = (player_deliveries['batsman_runs'] == 4).sum()
    sixes = (player_deliveries['batsman_runs'] == 6).sum()

    strike_rate = round((total_runs / balls_faced) * 100, 2) if balls_faced else 0

    # Bowling stats
    wickets = bowler_deliveries[
        bowler_deliveries['dismissal_kind'].isin([
            'bowled', 'caught', 'lbw', 'stumped', 'caught and bowled', 'hit wicket'
        ])
    ].shape[0]

    total_balls_bowled = bowler_deliveries.shape[0]
    overs = total_balls_bowled // 6 + (total_balls_bowled % 6) / 6
    runs_conceded = bowler_deliveries['total_runs'].sum()
    economy = round(runs_conceded / overs, 2) if overs else 0

    teams_played = pd.unique(
        merged[(merged['batter'] == player_name) | (merged['bowler'] == player_name)][
            ['batting_team', 'bowling_team']
        ].values.ravel()
    ).tolist()

    runs_per_season = player_deliveries.groupby('season')['batsman_runs'].sum().to_dict()

    return {
        "player": player_name,
        "total_matches": merged[merged['batter'] == player_name]['match_id'].nunique(),
        "total_runs": int(total_runs),
        "balls_faced": int(balls_faced),
        "strike_rate": strike_rate,
        "fours": int(fours),
        "sixes": int(sixes),
        "wickets": int(wickets),
        "overs_bowled": round(overs, 2),
        "economy": economy,
        "teams_played": teams_played,
        "runs_per_season": runs_per_season
    }
