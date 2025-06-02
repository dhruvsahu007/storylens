import os
import uuid
import base64
import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai
import pyttsx3

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# FastAPI app
app = FastAPI()

# Allow frontend (e.g., React at localhost:3000) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory setup
UPLOAD_DIR = "uploads"
AUDIO_DIR = "audios"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)

# Initialize TTS engine
tts_engine = pyttsx3.init()

# GPT-4o Vision: Generate story from image
async def generate_story_from_image_with_openai(image_bytes: bytes) -> str:
    try:
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        image_url = f"data:image/jpeg;base64,{image_base64}"

        messages = [
            {
                "role": "system",
                "content": "You are a creative storyteller. Create a short story or poem inspired by the image."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                            "detail": "low"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Please write a creative short story or poem inspired by this image."
                    }
                ]
            }
        ]

        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.8,
            max_tokens=300,
        )

        story = response.choices[0].message.content.strip()
        return story

    except Exception as e:
        print("❌ Error in generate_story_from_image_with_openai:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to generate story from image")

# pyttsx3 TTS: Generate audio file
async def generate_audio_from_text(text: str, output_path: str):
    try:
        tts_engine.save_to_file(text, output_path)
        tts_engine.runAndWait()
    except Exception as e:
        print("❌ Error in generate_audio_from_text:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to generate audio")

# Upload image and return story + audio
@app.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # Save uploaded file
        image_id = str(uuid.uuid4())
        image_path = os.path.join(UPLOAD_DIR, f"{image_id}.jpg")
        with open(image_path, "wb") as f:
            f.write(contents)

        # Generate story from image
        story = await generate_story_from_image_with_openai(contents)

        # Generate audio narration
        audio_path = os.path.join(AUDIO_DIR, f"{image_id}.mp3")
        await generate_audio_from_text(story, audio_path)

        return JSONResponse({
            "story": story,
            "audio_url": f"/audio/{image_id}"
        })

    except Exception as e:
        print("❌ Error in /upload-photo:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Serve audio file
@app.get("/audio/{audio_id}")
async def get_audio(audio_id: str):
    audio_path = os.path.join(AUDIO_DIR, f"{audio_id}.mp3")
    if os.path.exists(audio_path):
        return FileResponse(audio_path, media_type="audio/mpeg")
    return JSONResponse({"error": "Audio not found"}, status_code=404)
