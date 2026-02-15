from fastapi import FastAPI
from pydantic import BaseModel
import whisper
import librosa
import os

app = FastAPI()

model = whisper.load_model("base")

class AudioRequest(BaseModel):
    file_path: str


@app.post("/analyze")
def analyze_audio(request: AudioRequest):
    file_path = request.file_path

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    # Transcribe
    result = model.transcribe(file_path)
    transcript = result["text"]

    # ------------------------
    # 1️⃣ Word Count
    # ------------------------
    words = transcript.split()
    word_count = len(words)

    if word_count < 5:
        base_score = 50
    elif word_count < 15:
        base_score = 65
    elif word_count < 30:
        base_score = 75
    else:
        base_score = 85

    # ------------------------
    # 2️⃣ Filler Detection
    # ------------------------
    fillers = [
        "um", "uh", "ah", "like",
        "you know", "basically", "actually"
    ]

    transcript_lower = transcript.lower()
    filler_count = 0

    for filler in fillers:
        filler_count += transcript_lower.count(filler)

    if filler_count >= 5:
        filler_penalty = 10
    elif filler_count >= 2:
        filler_penalty = 5
    else:
        filler_penalty = 0

    # ------------------------
    # 3️⃣ Speech Rate Calculation
    # ------------------------
    y, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)

    if duration > 0:
        words_per_second = word_count / duration
    else:
        words_per_second = 0

    # Ideal range: 2.0 - 3.0 WPS
    if 2.0 <= words_per_second <= 3.0:
        rate_score = 10
    elif 1.5 <= words_per_second < 2.0 or 3.0 < words_per_second <= 3.5:
        rate_score = 5
    else:
        rate_score = 0

    # ------------------------
    # Final Confidence Score
    # ------------------------
    confidence_score = max(base_score - filler_penalty + rate_score, 40)

    return {
        "transcript": transcript,
        "confidence_score": confidence_score,
        "filler_count": filler_count,
        "words_per_second": round(words_per_second, 2),
        "duration_seconds": round(duration, 2)
    }

# python -m uvicorn app:app --reload --port 8000