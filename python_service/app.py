from fastapi import FastAPI
from pydantic import BaseModel
import whisper
import librosa
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("All imports done ✅")

app = FastAPI()

# Global models
model = None
embedding_model = None


# ------------------------
# Load models on startup
# ------------------------
@app.on_event("startup")
def load_models():
    global model, embedding_model

    print("Loading Whisper model...")
    model = whisper.load_model("base")
    print("Whisper loaded ✅")

    print("Loading embedding model...")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Embedding model loaded ✅")


# ------------------------
# Request Schema
# ------------------------
class AudioRequest(BaseModel):
    file_path: str
    question_text: str


# ------------------------
# Root Route
# ------------------------
@app.get("/")
def home():
    return {"message": "SpeechTrust Python service running 🚀"}


# ------------------------
# Analyze Endpoint
# ------------------------
@app.post("/analyze")
def analyze_audio(request: AudioRequest):
    file_path = request.file_path

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    # ------------------------
    # 1️⃣ Transcription
    # ------------------------
    result = model.transcribe(file_path)
    transcript = result["text"]
    question_text = request.question_text

    words = transcript.split()
    word_count = len(words)

    # ------------------------
    # 2️⃣ Base Score
    # ------------------------
    if word_count < 5:
        base_score = 40
    elif word_count < 15:
        base_score = 55
    elif word_count < 30:
        base_score = 65
    else:
        base_score = 70

    # ------------------------
    # 3️⃣ Filler Detection
    # ------------------------
    fillers = ["um", "uh", "ah", "like", "you know", "basically", "actually"]

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
    # 4️⃣ Speech Rate
    # ------------------------
    y, sr = librosa.load(file_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)

    if duration > 0:
        words_per_second = word_count / duration
    else:
        words_per_second = 0

    if 2.0 <= words_per_second <= 3.0:
        rate_score = 10
    elif 1.5 <= words_per_second < 2.0 or 3.0 < words_per_second <= 3.5:
        rate_score = 5
    else:
        rate_score = 0

    # ------------------------
    # 5️⃣ Pause Detection
    # ------------------------
    intervals = librosa.effects.split(y, top_db=30)

    speaking_time = 0
    for start, end in intervals:
        speaking_time += (end - start) / sr

    silence_time = duration - speaking_time

    if duration > 0:
        silence_ratio = silence_time / duration
    else:
        silence_ratio = 0

    long_pause_count = 0
    for i in range(1, len(intervals)):
        prev_end = intervals[i - 1][1] / sr
        current_start = intervals[i][0] / sr
        gap = current_start - prev_end
        if gap > 0.7:
            long_pause_count += 1

    if silence_ratio > 0.4 or long_pause_count >= 4:
        pause_penalty = 20
    elif silence_ratio > 0.25 or long_pause_count >= 2:
        pause_penalty = 10
    else:
        pause_penalty = 0

    # ------------------------
    # 6️⃣ Semantic Relevance
    # ------------------------
    question_embedding = embedding_model.encode(question_text)
    answer_embedding = embedding_model.encode(transcript)

    similarity = float(cosine_similarity(
        [question_embedding],
        [answer_embedding]
    )[0][0])

    if similarity > 0.45:
        relevance_score = 25
    elif similarity > 0.30:
        relevance_score = 15
    elif similarity > 0.22:
        relevance_score = 0
    elif similarity > 0.18:
        relevance_score = -10
    else:
        relevance_score = -25

    # ------------------------
    # 7️⃣ Final Confidence Score
    # ------------------------
    confidence_score = min(
        max(
            base_score
            - filler_penalty
            - pause_penalty
            + rate_score
            + relevance_score,
            40
        ),
        100
    )

    # ------------------------
    # 8️⃣ Response
    # ------------------------
    return {
        "transcript": transcript,
        "confidence_score": confidence_score,
        "score_breakdown": {
            "base_score": base_score,
            "relevance_score": relevance_score,
            "rate_score": rate_score,
            "filler_penalty": filler_penalty,
            "pause_penalty": pause_penalty
        },
        "metrics": {
            "filler_count": filler_count,
            "words_per_second": round(words_per_second, 2),
            "duration_seconds": round(duration, 2),
            "relevance_similarity": round(similarity, 2),
            "silence_ratio": round(silence_ratio, 2),
            "long_pause_count": long_pause_count
        }
    }

# venv\Scripts\activate
# python -m uvicorn app:app --port 8000