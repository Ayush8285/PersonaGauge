import os
import re
import nltk
import pickle
import pymongo
import numpy as np
from bson import ObjectId
from scipy.sparse import hstack
from nltk.corpus import stopwords
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from db_connection import db  # MongoDB connection

# Download stopwords if not already
nltk.download("stopwords")

# Load collections
cv_data = db["cv_data"]
quiz_data = db["quiz_answers"]

# Load the trained model and encoders
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "svm_model.pkl"))
with open(model_path, "rb") as f:
    vectorizer, personality_encoder, job_encoder, svm_personality, svm_job = pickle.load(f)

# ----------- Utility Functions -----------

def clean_text(text):
    """Remove special characters, stopwords, and extra spaces"""
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    stop_words = set(stopwords.words("english"))
    words = text.split()
    filtered = [word for word in words if word not in stop_words]
    return " ".join(filtered)

def get_quiz_answer_numeric(answer):
    """Map quiz answer to numeric scale"""
    mapping = {
        "Strongly agree": 3,
        "Agree": 2,
        "Neutral": 1,
        "Disagree": 0,
        "Strongly disagree": -1
    }
    return mapping.get(answer, 0)

def softmax_scaled(probs, temperature=0.6):
    """Temperature-scaled softmax to boost the top class but preserve others"""
    logits = np.log(np.array(probs) + 1e-9) / temperature
    exp_probs = np.exp(logits - np.max(logits))  # for stability
    softmax = exp_probs / np.sum(exp_probs)
    return [round(p * 100, 2) for p in softmax]

def normalize_and_smooth_probs(raw_probs, top_boost=70.0, min_base=10.0):
    """
    Smooth probabilities:
    - Top predicted class is boosted to `top_boost`
    - Other classes are scaled proportionally with a base value (`min_base`)
    """
    raw_probs = np.array(raw_probs)
    top_idx = np.argmax(raw_probs)
    top_value = raw_probs[top_idx]

    # Calculate the remaining probabilities
    remaining = np.delete(raw_probs, top_idx)

    # Normalize remaining to sum to 1
    if remaining.sum() == 0:
        remaining_scaled = np.full_like(remaining, 1 / len(remaining))
    else:
        remaining_scaled = remaining / remaining.sum()

    # Apply the remaining weight after boosting the top class
    remaining_weight = 100 - top_boost
    remaining_probs = [r * remaining_weight for r in remaining_scaled]

    # Ensure a minimum threshold for each category
    adjusted_probs = [max(r, min_base) for r in remaining_probs]

    # Construct the final distribution with adjusted values
    final_probs = []
    counter = 0
    for i in range(len(raw_probs)):
        if i == top_idx:
            final_probs.append(round(top_boost, 2))
        else:
            final_probs.append(round(adjusted_probs[counter], 2))
            counter += 1

    # Fix any rounding issues to ensure the total is 100
    diff = 100 - sum(final_probs)
    final_probs[top_idx] += round(diff, 2)

    return final_probs

# ----------- Main Prediction Logic -----------

def get_user_data(user_id):
    """Fetch and preprocess user data from DB"""
    user_cv = cv_data.find_one({"user_id": user_id})
    user_quiz = quiz_data.find_one({"user_id": user_id})

    if not user_cv or not user_quiz:
        return None

    cleaned_cv_text = clean_text(user_cv.get("extracted_text", ""))
    quiz_answers = [response["answer"] for response in user_quiz.get("responses", [])]
    quiz_answers_numeric = np.array(
        [get_quiz_answer_numeric(ans) for ans in quiz_answers], dtype=np.float64
    ).reshape(1, -1)

    return {
        "cv_text": cleaned_cv_text,
        "quiz_answers": quiz_answers_numeric
    }

def predict_personality_and_job(user_id):
    """Predict personality and job role based on user inputs"""
    user_data = get_user_data(user_id)
    if not user_data:
        return {"error": "User data not found"}

    # Vectorize and combine features
    X_cv = vectorizer.transform([user_data["cv_text"]])
    X_combined = hstack([X_cv, user_data["quiz_answers"]])

    # Predict personality
    raw_personality_probs = svm_personality.predict_proba(X_combined)[0]
    personality_probs = normalize_and_smooth_probs(raw_personality_probs, top_boost=70.0)
    personality_labels = personality_encoder.classes_
    best_personality_idx = int(np.argmax(personality_probs))

    # Predict job role
    raw_job_probs = svm_job.predict_proba(X_combined)[0]
    job_probs = normalize_and_smooth_probs(raw_job_probs, top_boost=70.0)
    job_labels = job_encoder.classes_
    best_job_idx = int(np.argmax(job_probs))

    return {
        "personality": {
            "label": personality_labels[best_personality_idx],
            "confidence": personality_probs[best_personality_idx],
            "distribution": {
                label: prob for label, prob in zip(personality_labels, personality_probs)
            }
        },
        "job_role": {
            "label": job_labels[best_job_idx],
            "confidence": job_probs[best_job_idx],
            "distribution": {
                label: prob for label, prob in zip(job_labels, job_probs)
            }
        }
    }
