from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import torch
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# Load the BERT Model (pre-trained)
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load FAQ Data
with open("faq.json", "r") as file:
    faq_data = json.load(file)

# Extract Questions and Answers
questions = [faq["question"] for faq in faq_data]
answers = [faq["answer"] for faq in faq_data]

# Convert all FAQ Questions into BERT Embeddings
question_embeddings = model.encode(questions, convert_to_tensor=True)

def get_best_answer(user_question):
    user_embedding = model.encode(user_question, convert_to_tensor=True)
    similarity_scores = util.pytorch_cos_sim(user_embedding, question_embeddings)[0]
    
    best_match_index = torch.argmax(similarity_scores).item()
    best_score = similarity_scores[best_match_index].item()

    if best_score < 0.5:
        return "Sorry, I don't know the answer."
    
    return answers[best_match_index]

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_question = data.get("question", "")
    response = get_best_answer(user_question)
    return jsonify({"answer": response})

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the chatbot API! Use /chat with POST method."})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
