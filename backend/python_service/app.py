from fastapi import FastAPI
from pydantic import BaseModel
import whisper
import os

app = FastAPI()

# Load model once at startup (important!)
model = whisper.load_model("base")

class AudioRequest(BaseModel):
    file_path: str


@app.post("/analyze")
def analyze_audio(request: AudioRequest):
    file_path = request.file_path

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    # Transcribe using Whisper
    result = model.transcribe(file_path)

    transcript = result["text"]

    # 🔥 Temporary simple scoring logic
    word_count = len(transcript.split())

    if word_count < 5:
        confidence_score = 50
    elif word_count < 15:
        confidence_score = 65
    elif word_count < 30:
        confidence_score = 75
    else:
        confidence_score = 85

    return {
        "transcript": transcript,
        "confidence_score": confidence_score
    }
