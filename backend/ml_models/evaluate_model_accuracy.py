import os
import pickle
import json
import re
import nltk
import pymongo
import numpy as np
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from scipy.sparse import hstack, vstack
from nltk.corpus import stopwords

# Setup
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))

# MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["personaGauge"]  # 🔁 Replace with your DB name
cv_data = db["cv_data"]
quiz_data = db["quiz_answers"]
test_labels = db["test_labels"]

# Load trained models and encoders
model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "svm_model.pkl"))
with open(model_path, "rb") as f:
    vectorizer, personality_encoder, job_encoder, svm_personality, svm_job = pickle.load(f)

# Helper: Clean CV text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"\W+", " ", text)
    return " ".join([word for word in text.split() if word not in stop_words])

# Helper: Convert quiz answers to numeric
def get_quiz_numeric(responses):
    values = []
    for r in responses:
        answer = r.get("answer")
        options = r.get("options", [])
        if answer in options and len(options) > 1:
            values.append(options.index(answer) / (len(options) - 1))
        else:
            values.append(0.0)
    return np.array(values).reshape(1, -1)

# Prepare data
X_list = []
y_personality = []
y_job = []

for label_doc in test_labels.find():
    user_id = label_doc["user_id"]

    cv_doc = cv_data.find_one({"user_id": user_id})
    quiz_doc = quiz_data.find_one({"user_id": user_id})

    if not cv_doc or not quiz_doc:
        continue

    # Process CV
    cleaned_cv = clean_text(cv_doc.get("extracted_text", ""))
    X_cv = vectorizer.transform([cleaned_cv])

    # Process quiz
    quiz_numeric = get_quiz_numeric(quiz_doc.get("responses", []))

    # Combine features
    X_combined = hstack([X_cv, quiz_numeric])
    X_list.append(X_combined)

    # Labels
    y_personality.append(label_doc["true_personality"])
    y_job.append(label_doc["true_job_role"])

# Final combined X
X = vstack(X_list)
y_personality = personality_encoder.transform(y_personality)
y_job = job_encoder.transform(y_job)

# Split into train/test (optional, but realistic)
X_train, X_test, y_personality_train, y_personality_test, y_job_train, y_job_test = train_test_split(
    X, y_personality, y_job, test_size=0.2, random_state=42
)

# Predict
y_pred_personality = svm_personality.predict(X_test)
y_pred_job = svm_job.predict(X_test)

# Accuracy
personality_acc = accuracy_score(y_personality_test, y_pred_personality)
job_acc = accuracy_score(y_job_test, y_pred_job)

# Report
report = {
    "personality_accuracy_percent": round(personality_acc * 100, 2),
    "job_role_accuracy_percent": round(job_acc * 100, 2),
    "total_samples": X_test.shape[0]
}


# Save report
output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "model_accuracy.json"))
with open(output_path, "w") as f:
    json.dump(report, f)

print("✅ Model evaluation complete.")
print("📊 Accuracy Report:")
print(json.dumps(report, indent=2))
