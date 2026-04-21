from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import whisper
import librosa
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("All imports done")

app = FastAPI()

# Global models
model = None
embedding_model = None

# Load models on startup
@app.on_event("startup")
def load_models():
    global model, embedding_model

    print("Loading Whisper model...")
    model = whisper.load_model("base")
    print("Whisper loaded")

    print("Loading embedding model...")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    print("Embedding model loaded")



# Request Schema
class AudioRequest(BaseModel):
    file_path: str
    ideal_answer: str   
    keywords: List[str]   


# Root Route
@app.get("/")
def home():
    return {"message": "SpeechTrust Python service running"}


# Analyze Endpoint
@app.post("/analyze")
def analyze_audio(request: AudioRequest):
    file_path = request.file_path

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    #Transcription
    result = model.transcribe(file_path)
    transcript = result["text"]
    
    words = transcript.split()
    word_count = len(words)

    #Base Score
    if word_count < 5:
        base_score = 50
    elif word_count < 15:
        base_score = 65
    elif word_count < 30:
        base_score = 75
    else:
        base_score = 80

    #Filler Detection
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

    #Speech Rate
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

    #Pause Detection
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

    #Relevance
    ideal_embedding = embedding_model.encode(request.ideal_answer)
    answer_embedding = embedding_model.encode(transcript)

    similarity = float(cosine_similarity(
        [ideal_embedding],
        [answer_embedding]
    )[0][0])

    if similarity > 0.50:
        relevance_score = 20
    elif similarity > 0.35:
        relevance_score = 15
    elif similarity > 0.20:
        relevance_score = 5
    else:
        relevance_score = 0

    #Keyword Matching
    keyword_score = 0
    if request.keywords and len(request.keywords) > 0:
        matched_keywords = sum(1 for kw in request.keywords if kw.lower() in transcript_lower)
        match_ratio = matched_keywords / len(request.keywords)
        
        if match_ratio >= 0.60:
            keyword_score = 15
        elif match_ratio >= 0.30:
            keyword_score = 10
        elif match_ratio > 0:
            keyword_score = 5
        else:
            keyword_score = 0

    #Final Confidence Score
    confidence_score = min(
        max(
            base_score
            - filler_penalty
            - pause_penalty
            + rate_score
            + relevance_score
            + keyword_score,
            40
        ),
        100
    )

    #Response
    return {
        "transcript": transcript,
        "confidence_score": confidence_score,
        "score_breakdown": {
            "base_score": base_score,
            "relevance_score": relevance_score,
            "keyword_score": keyword_score,
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

#python -m uvicorn app:app --port 8000