FROM python:3.9

WORKDIR /code

# Install system dependencies for Librosa and Whisper
RUN apt-get update && apt-get install -y ffmpeg libsndfile1

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

# Hugging Face uses port 7860 by default
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]