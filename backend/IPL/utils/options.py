import pandas as pd

matches = pd.read_csv("./ipl/data/raw_data/matches.csv")

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

for col in ['team1', 'team2', 'toss_winner', 'winner']:
    if col in matches.columns:
        matches[col] = matches[col].replace(TEAM_NAME_MAP)


def get_dropdown_options():
    teams = sorted(set(matches["team1"].dropna().unique()) | set(matches["team2"].dropna().unique()))
    venues = sorted(matches["venue"].dropna().unique())
    toss_decisions = ["bat", "field"]
    return {
        "teams": teams,
        "venues": venues,
        "toss_decisions": toss_decisions
    }