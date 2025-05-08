import pandas as pd
import numpy as np
import pickle
import os
from scipy.sparse import hstack
from sklearn.svm import SVC
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

# Get the absolute path to the dataset
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
dataset_path = os.path.join(base_dir, "training_dataset.csv")

# Load dataset
df = pd.read_csv(dataset_path)

# Extract CV text
cv_texts = df["cv_text"].astype(str).tolist()

# Dynamically normalize quiz responses
def normalize_quiz_column(col):
    """Normalize a quiz column to range 0.0 to 1.0 based on unique sorted values"""
    unique_vals = sorted(col.dropna().unique())  # drop NaN to prevent errors
    val_to_norm = {
        val: i / (len(unique_vals) - 1) if len(unique_vals) > 1 else 1.0
        for i, val in enumerate(unique_vals)
    }
    return col.map(val_to_norm)

# Apply normalization to each quiz column (assumes columns 1 to 5 are quiz answers)
quiz_normalized = df.iloc[:, 1:6].apply(normalize_quiz_column)
quiz_responses = quiz_normalized.values.astype(np.float64)

# Encode labels
personality_labels = df["personality_label"]
job_roles = df["job_role_label"]

# Convert CV text to numerical features using TF-IDF
vectorizer = TfidfVectorizer()
X_cv = vectorizer.fit_transform(cv_texts)  # TF-IDF returns a sparse matrix

# Combine CV (TF-IDF) & quiz responses using sparse hstack
X = hstack([X_cv, quiz_responses])  # Efficiently combine sparse and dense features

# Encode target labels
personality_encoder = LabelEncoder()
y_personality = personality_encoder.fit_transform(personality_labels)

job_encoder = LabelEncoder()
y_job = job_encoder.fit_transform(job_roles)

# Train SVM models
svm_personality = SVC(kernel="linear", probability=True)
svm_personality.fit(X, y_personality)

svm_job = SVC(kernel="linear", probability=True)
svm_job.fit(X, y_job)

# Ensure the ml_models directory exists
model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models"))
os.makedirs(model_dir, exist_ok=True)  # Create directory if it doesn't exist

# Define the full path to save the model
model_path = os.path.join(model_dir, "svm_model.pkl")

# Save models & encoders
with open(model_path, "wb") as f:
    pickle.dump((vectorizer, personality_encoder, job_encoder, svm_personality, svm_job), f)

print(f"✅ SVM model trained & saved successfully at: {model_path}")
