# main.py
from fastapi import FastAPI
from journal import get_journal_entries
from lola_voice import transcribe_audio

app = FastAPI()

@app.get("/journal")
def read_journal():
    return get_journal_entries()

@app.post("/voice")
def voice_to_text(audio: bytes):
    return transcribe_audio(audio)
