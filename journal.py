import json
from datetime import datetime

JOURNAL_FILE = "journal.json"

def log_mood(mood, note=""):
    today = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = {"timestamp": today, "mood": mood, "note": note}
    
    if not os.path.exists(JOURNAL_FILE):
        data = []
    else:
        with open(JOURNAL_FILE) as f:
            data = json.load(f)
    
    data.append(entry)
    
    with open(JOURNAL_FILE, "w") as f:
        json.dump(data, f, indent=2)

def show_mood_history():
    if not os.path.exists(JOURNAL_FILE):
        print("No entries yet.")
        return
    with open(JOURNAL_FILE) as f:
        data = json.load(f)
    for entry in data[-5:]:
        print(f"{entry['timestamp']} — {entry['mood']} — {entry['note']}")
