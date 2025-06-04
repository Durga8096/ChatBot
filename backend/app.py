from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai

load_dotenv()  # loads .env variables


openai.api_key = os.environ["OPENAI_API_KEY"]

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all origins
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "Hello, this is the root endpoint!"}

@app.post("/ask")
async def ask_question(request: Request, body: QuestionRequest):
    user_question = body.question
    if not user_question:
        raise HTTPException(status_code=422, detail="Missing 'question'")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_question}],
            max_tokens=500,
            temperature=0.7,
        )
        answer = response.choices[0].message.content.strip()
        return {"answer": answer}
    except openai.error.OpenAIError as e:
        raise HTTPException(status_code=500, detail={"detail": f"OpenAI API error: {e}"})

