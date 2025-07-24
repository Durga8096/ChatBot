from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import os

# -----------------------------
# ENV SETUP
# -----------------------------
load_dotenv()


# -----------------------------
# APP CONFIG
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# DATA MODELS
# -----------------------------
class Topic(BaseModel):
    id: int
    title: str
    description: str
    status: str  # "Not started", "In Progress", "Completed"

class QuestionRequest(BaseModel):
    question: str
    topics: Optional[List[Topic]] = None

# -----------------------------
# IN-MEMORY STORAGE
# -----------------------------
topics: List[Topic] = []

# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
def read_root():
    return {"message": "Hello, this is the root endpoint!"}
    
import google.generativeai as genai

from fastapi import HTTPException

@app.post("/ask")
async def ask_question(payload: QuestionRequest):
    question = payload.question
    selected_topics = payload.topics or []

    context = "\n".join(
        [f"- {t.title} ({t.status}): {t.description}" for t in selected_topics]
    )

    prompt = (
        f"You are an AI-powered personal learning assistant.\n"
        f"Here are the user's current learning topics:\n{context}\n\n"
        f"Now, answer this user question with helpful, easy-to-understand information.\n"
        f"User question: {question}"
        if context else question
    )

    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, detail="GOOGLE_API_KEY environment variable is not set"
            )

        genai.configure(api_key=api_key)

        # Create the model
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")

        # Generate content
        response = model.generate_content(prompt) 
        return response.text

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/topics", response_model=List[Topic])
def get_topics():
    return topics


@app.post("/topics", response_model=Topic)
async def add_topic(topic: Topic):
    topics.append(topic)
    return topic
