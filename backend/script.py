import subprocess

def main():
    print("Running data preprocessing scripts...")
    subprocess.run(["python", "ipl/eda/merge_ipl_data.py"], check=True)
    subprocess.run(["python", "ipl/eda/chasing_team_eda.py"], check=True)

    print("Running model training scripts...")
    subprocess.run(["python", "ipl/training_scripts/train_team_winning_model.py"], check=True)
    subprocess.run(["python", "ipl/training_scripts/train_chasing_team_model.py"], check=True)

if __name__ == "__main__":
    main()