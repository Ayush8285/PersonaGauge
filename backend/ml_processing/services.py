import os
import re
# import nltk
import pickle
# import logging
import pymongo
import numpy as np
from bson import ObjectId
from scipy.sparse import hstack
from nltk.corpus import stopwords
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from db_connection import db  # MongoDB connection
import random

# Download stopwords if not already
# nltk.download("stopwords")

# Load collections
cv_data = db["cv_data"]
quiz_data = db["quiz_answers"]
prediction_data = db["prediction"]


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

def get_quiz_answer_numeric(answer, options):
    """
    Map quiz answer to a normalized numeric scale based on its index in options.
    The first option gets the lowest value (0), the last gets the highest (1).
    """
    if not options or answer not in options:
        return 0.0  # Default if answer is not valid

    idx = options.index(answer)
    normalized_value = idx / (len(options) - 1) if len(options) > 1 else 1.0
    return normalized_value

def get_user_data(user_id):
    """Fetch and process the latest submitted CV and quiz data for a user"""
    print(f"Fetching data for user_id: {user_id} (type: {type(user_id)})")
    
    # Fetch latest CV
    user_cv = cv_data.find_one(
        {"user_id": user_id},
        sort=[("timestamp", pymongo.DESCENDING)]
    )
    
    # Fetch latest quiz answers
    user_quiz = quiz_data.find_one(
        {"user_id": user_id},
        sort=[("timestamp", pymongo.DESCENDING)]
    )

    if not user_cv or not user_quiz:
        return None

    # Clean CV text
    cleaned_cv_text = clean_text(user_cv.get("extracted_text", ""))

    # Convert quiz answers dynamically to numeric using answer & options
    responses = user_quiz.get("responses", [])
    quiz_numeric = []
    for response in responses:
        answer = response.get("answer")
        options = response.get("options", [])
        numeric_value = get_quiz_answer_numeric(answer, options)
        quiz_numeric.append(numeric_value)

    quiz_answers_numeric = np.array(quiz_numeric, dtype=np.float64).reshape(1, -1)

    return {
        "cv_text": cleaned_cv_text,
        "quiz_answers": quiz_answers_numeric,
        "cv_id": str(user_cv.get("_id")),
        "quiz_id": str(user_quiz.get("_id")),
        "user_id": user_id
    }


def scale_confidences(probs):
    """Scale raw probabilities independently to 0-100 for each class"""
    return [round(p * 100, 2) for p in probs]

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
    personality_confidences = scale_confidences(raw_personality_probs)
    personality_labels = personality_encoder.classes_
    best_personality_idx = int(np.argmax(personality_confidences))

    # Predict job role
    raw_job_probs = svm_job.predict_proba(X_combined)[0]
    job_confidences = scale_confidences(raw_job_probs)
    job_labels = job_encoder.classes_
    best_job_idx = int(np.argmax(job_confidences))

    # Build personality and job distributions (randomized order)
    personality_distribution = dict(random.sample(
        dict(zip(personality_labels, personality_confidences)).items(),
        len(personality_labels)
    ))

    job_distribution = dict(random.sample(
        dict(zip(job_labels, job_confidences)).items(),
        len(job_labels)
    ))

    # Save to database
    prediction_record = {
        "user_id": user_data["user_id"],
        "cv_id": user_data["cv_id"],
        "quiz_id": user_data["quiz_id"],
        "personality_prediction": {
            "label": personality_labels[best_personality_idx],
            "confidence": personality_confidences[best_personality_idx],
            "distribution": personality_distribution
        },
        "job_role_prediction": {
            "label": job_labels[best_job_idx],
            "confidence": job_confidences[best_job_idx],
            "distribution": job_distribution
        },
        "timestamp": datetime.utcnow()
    }

    prediction_data.insert_one(prediction_record)

    return {
        "personality": prediction_record["personality_prediction"],
        "job_role": prediction_record["job_role_prediction"]
    }





#result of prediction
def get_prediction_result(user_id, cv_id, quiz_id):
    # logging.info(f"Searching prediction with user_id={user_id}, cv_id={cv_id}, quiz_id={quiz_id}")
    try:
        prediction = db["prediction"].find_one({
            "user_id": user_id,
            "cv_id": cv_id,
            "quiz_id": quiz_id,
        })
        # print(f"Found prediction: {prediction}")
    except Exception as e:
        # logging.error(f"Error during DB query: {e}")
        return {"error": "Internal server error"}

    if not prediction:
        return {"error": "Prediction not found"}

    prediction["_id"] = str(prediction["_id"])
    return prediction


