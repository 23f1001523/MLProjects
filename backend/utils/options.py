import pandas as pd

df = pd.read_csv("data/matches.csv")

def get_dropdown_options():
    teams = sorted(set(df["team1"].dropna().unique()) | set(df["team2"].dropna().unique()))
    venues = sorted(df["venue"].dropna().unique())
    toss_decisions = ["bat", "field"]
    return {
        "teams": teams,
        "venues": venues,
        "toss_decisions": toss_decisions
    }