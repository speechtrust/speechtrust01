from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class AudioRequest(BaseModel):
    file_path: str

@app.post("/analyze")
def analyze_audio(data: AudioRequest):
    # 🔥 TEMP: Fake processing
    transcript = "This is a temporary transcript"

    score = random.randint(60, 90)

    return {
        "transcript": transcript,
        "confidence_score": score
    }
