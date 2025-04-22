import sounddevice as sd
from scipy.io.wavfile import write
import whisper
import openai
from elevenlabs import generate, play, set_api_key

# === CONFIG ===
DURATION = 5  # seconds
SAMPLE_RATE = 44100
INPUT_FILENAME = "input.wav"

openai.api_key = "AIzaSyAvrxOyAVzPVcnzxuD0mjKVDyS2bNWfC10"
set_api_key("YOUR_ELEVENLABS_API_KEY")  # Replace with your ElevenLabs API key

# === Step 1: Record your voice ===
def record_audio():
    print("Recording... Speak now.")
    audio = sd.rec(int(DURATION * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1)
    sd.wait()
    write(INPUT_FILENAME, SAMPLE_RATE, audio)
    print("Recording complete.")

# === Step 2: Transcribe voice to text ===
def transcribe_audio():
    model = whisper.load_model("base")
    result = model.transcribe(INPUT_FILENAME)
    print("You said:", result["text"])
    return result["text"]

# === Step 3: Get Lola’s response ===
def get_lola_reply(prompt):
    full_prompt = f"""
You are Lola: warm, witty, calm, supportive, emotionally intelligent. A multifaceted assistant, friend, and muse.

User: {prompt}
Lola:"""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": full_prompt}]
    )
    reply = response["choices"][0]["message"]["content"].strip()
    print("Lola:", reply)
    return reply

# === Step 4: Speak Lola’s response ===
def speak_text(text):
    try:
        audio = generate(text=text, voice="Lola")
        play(audio)
    except Exception as e:
        print("Could not play audio:", e)

# === Main Voice Interaction ===
if __name__ == "__main__":
    while True:
        record_audio()
        user_input = transcribe_audio()
        if user_input.lower() in ["quit", "exit"]:
            print("Goodbye!")
            break
        reply = get_lola_reply(user_input)
        speak_text(reply)
