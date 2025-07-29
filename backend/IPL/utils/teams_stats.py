import pandas as pd

def getTeamSummary(team_name):
    matches = pd.read_csv('./ipl/data/raw_data/matches.csv')

    # Normalize match IDs
    matches['match_id'] = matches['id'] - matches['id'].min() + 1

    # Filter matches where the team played
    team_matches = matches[(matches['team1'] == team_name) | (matches['team2'] == team_name)]

    if team_matches.empty:
        return None

    total_matches = len(team_matches)
    wins = team_matches[team_matches['winner'] == team_name].shape[0]
    losses = total_matches - wins
    win_percentage = round((wins / total_matches) * 100, 2) if total_matches else 0

    # Wins per season (for plotting)
    yearly_wins = (
        team_matches[team_matches['winner'] == team_name]
        .groupby('season').size()
        .to_dict()
    )

    return {
        "team": team_name,
        "total_matches": total_matches,
        "wins": wins,
        "losses": losses,
        "win_percentage": win_percentage,
        "yearly_wins": yearly_wins
    }
