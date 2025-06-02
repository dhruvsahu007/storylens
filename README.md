# 📸 StoryLens

**Transform your images into captivating AI-generated stories with audio narration.**

StoryLens is a full-stack application built with **React** and **FastAPI** that lets users upload an image, and then uses AI to generate a creative story based on it, complete with audio narration.

---

## 🌟 Features

- 📷 Upload an image (JPG, PNG, etc.)
- 🧠 AI-generated story based on image content
- 🔊 Audio narration of the story using Text-to-Speech
- 🎨 Beautiful, modern UI
- ⚡ Fast performance with local-only processing

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- FastAPI
- OpenAI GPT-4o (Vision + Text)
- pyttsx3 (offline text-to-speech)
- Uvicorn

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/storylens.git
cd storylens
```
### 2. Setup the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```
Make sure you have ffmpeg installed if using pyttsx3 with audio output.
Add your OpenAI API key to .env or directly in your main.py file (as an environment variable or a config).
Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The backend will run at http://localhost:8000.

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
npm start
```
Your React app will start on http://localhost:3000.

🔄 API Endpoint
Method	Endpoint	Description
POST	/upload-photo	Upload image and get story + audio

Form data should include a key file with the image file.

## Project Images

![image](https://github.com/user-attachments/assets/4a3063eb-2009-4095-a24c-75eca1e3db27)
![image](https://github.com/user-attachments/assets/32537772-e2a7-45bc-a5ea-b49089acc269)
![image](https://github.com/user-attachments/assets/c5017b74-2b70-437a-8936-b69421edf592)
