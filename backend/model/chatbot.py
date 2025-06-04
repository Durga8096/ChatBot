import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load some example FAQ data
with open("model/data.json", "r") as f:
    data = json.load(f)

questions = [item["question"] for item in data]
answers = [item["answer"] for item in data]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(questions)

def get_answer(user_input):
    user_vec = vectorizer.transform([user_input])
    similarity = cosine_similarity(user_vec, X)
    idx = similarity.argmax()
    return answers[idx]
