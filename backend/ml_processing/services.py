import os
import pymongo
import joblib # Import joblib to load the model
import re
import pickle
import nltk
import numpy as np
from scipy.sparse import hstack
from nltk.corpus import stopwords
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from db_connection import db  # Import MongoDB connection
# Ensure stopwords are downloaded
nltk.download("stopwords")

cv_data = db["cv_data"]

# Load the trained model
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "svm_model.pkl"))

with open(model_path, "rb") as f:
    vectorizer, personality_encoder, job_encoder, svm_personality, svm_job = pickle.load(f)




# # Load trained SVM model and TF-IDF Vectorizer
# svm_model = joblib.load("ml_processing/svm_model.pkl")  # Load your trained model
# vectorizer = joblib.load("ml_processing/tfidf_vectorizer.pkl")  # Load your vectorizer

# # Personality labels (Adjust based on your dataset)
# PERSONALITY_LABELS = ["Agreeable","Neurotic","Analytical","Creative","Extraverted","Openness","Conscientious","Introverted"]

# # Job Roles (Example mappings)
# JOB_ROLES = ["Finance Analyst","HR Manager","Project Manager","Software Engineer","AI Researcher","Marketing Manager","Cybersecurity Analyst","Sales Executive","Graphic Designer","Data Analyst","Graphic Designer"]






def clean_text(text):
    """ Remove special characters, stopwords, and extra spaces """
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)  # Remove special characters
    stop_words = set(stopwords.words("english"))
    words = text.split()
    filtered_words = [word for word in words if word not in stop_words]
    return " ".join(filtered_words)


def get_user_data(user_id):
    """ Fetch CV text and quiz answers for a user from MongoDB """
    cv_data = db.cv_data.find_one({"user_id": user_id})  # ✅ Ensure correct format
    quiz_data = db.quiz_answers.find_one({"user_id": user_id})

    if not cv_data:
        return JsonResponse({"error": "CV data not found"}, status=404)
    if not quiz_data:
        return JsonResponse({"error": "Quiz data not found"}, status=404)

    # Preprocess CV text
    cleaned_text = clean_text(cv_data.get("extracted_text", ""))

    # Define a fixed mapping for categorical answers
    quiz_mapping = {
        "Individual work": 0,
        "Teamwork": 1,
        "Delegate tasks to others": 2,
        "Handle it myself": 3,
        "Creative/Design": 4,
        "Management/Leadership": 5,
        "Collaborating with others": 6,
        "Making independent decisions": 7,
        "Achieving personal goals": 8,
        "Helping others succeed": 9
    }

    
    # ✅ Extract answers first
    quiz_answers = [response["answer"] for response in quiz_data.get("responses", [])]

    # ✅ Convert quiz answers to numerical values
    quiz_answers_numeric = [quiz_mapping.get(answer, -1) for answer in quiz_answers]

    # ✅ Convert to numpy array with proper shape
    quiz_answers_numeric = np.array(quiz_answers_numeric, dtype=np.float64).reshape(1, -1)

    return {"cv_text": cleaned_text, "quiz_answers": quiz_answers_numeric}



def predict_personality_and_job(user_id):
    """Predict personality and job role based on user CV and quiz responses."""
    user_data = get_user_data(user_id)
    if not user_data:
        return {"error": "User data not found"}

    # Vectorize the cleaned CV text
    X_cv = vectorizer.transform([user_data["cv_text"]])  # Ensure it's a list

    # Combine CV features with quiz responses
    X_combined = hstack([X_cv, user_data["quiz_answers"]])  # Stack TF-IDF and quiz answers

    # Predict Personality
    personality_pred = svm_personality.predict(X_combined)[0]
    personality_label = personality_encoder.inverse_transform([personality_pred])[0]
    personality_probs = svm_personality.predict_proba(X_combined)[0]  # Get confidence scores

    # Predict Job Role
    job_pred = svm_job.predict(X_combined)[0]
    job_label = job_encoder.inverse_transform([job_pred])[0]
    job_probs = svm_job.predict_proba(X_combined)[0]  # Get confidence scores

    # Format results for charts (frontend visualization)
    response_data = {
        "personality": {
            "label": personality_label,
            "confidence": round(personality_probs.max() * 100, 2),  # Highest confidence score
            "distribution": {label: round(prob * 100, 2) for label, prob in zip(personality_encoder.classes_, personality_probs)}
        },
        "job_role": {
            "label": job_label,
            "confidence": round(job_probs.max() * 100, 2),  # Highest confidence score
            "distribution": {label: round(prob * 100, 2) for label, prob in zip(job_encoder.classes_, job_probs)}
        }
    }

    return response_data
