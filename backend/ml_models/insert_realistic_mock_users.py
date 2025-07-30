import pymongo
from datetime import datetime
import random
import pickle

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["personaGauge"]  # 🔁 Replace with your DB name

# Target collections
cv_data = db["cv_data"]
quiz_data = db["quiz_answers"]
test_labels = db["test_labels"]

# Job roles and personalities
with open("svm_model.pkl", "rb") as f:
    _, personality_encoder, job_encoder, _, _ = pickle.load(f)

# Use only valid trained labels
personalities = personality_encoder.classes_.tolist()
job_roles = job_encoder.classes_.tolist()

# Sample CVs (matching job roles)
sample_cvs = {
    "Data Scientist": "Proficient in Python, pandas, machine learning, and data analysis with SQL.",
    "Web Developer": "Built multiple responsive websites using React, Node.js, and MongoDB.",
    "Product Manager": "Managed product lifecycles, wrote user stories, and worked with Agile teams.",
    "UX Designer": "Designed wireframes, ran usability tests, and created engaging UI in Figma.",
    "Marketing Specialist": "Skilled in digital marketing, SEO, Google Ads, and brand campaigns."
}

# Your real quiz template
quiz_template = [
    {
        "question": "What is your preferred work environment?",
        "options": ["Individual work", "Team collaboration", "A mix of both", "Work from home"]
    },
    {
        "question": "How do you handle stress?",
        "options": ["Stay calm and focused", "Take a break and recharge", "Delegate tasks to others", "Push through and finish the task"]
    },
    {
        "question": "Which of these best describes your ideal job role?",
        "options": ["Creative/Design", "Technical/Programming", "Management", "Sales/Marketing"]
    },
    {
        "question": "How do you prefer to make decisions?",
        "options": ["Based on logic and facts", "Based on intuition and gut feeling", "Collaborating with others", "Looking at the bigger picture"]
    },
    {
        "question": "What motivates you the most in your career?",
        "options": ["Achieving personal goals", "Working with a great team", "Learning new skills", "Making a difference"]
    }
]

# Generate and insert 50 mock users
for i in range(1, 51):
    user_id = f"test_user_{i:03d}"
    true_job = random.choice(job_roles)
    true_personality = random.choice(personalities)

    # Insert into cv_data
    cv_data.insert_one({
        "user_id": user_id,
        "extracted_text": sample_cvs.get(true_job, f"Experienced in {true_job.lower()}, skilled in communication and teamwork."),
        "timestamp": datetime.utcnow()
    })

    # Generate random quiz answers
    responses = []
    for q in quiz_template:
        answer = random.choice(q["options"])
        responses.append({
            "question": q["question"],
            "answer": answer,
            "options": q["options"]
        })

    # Insert into quiz_answers
    quiz_data.insert_one({
        "user_id": user_id,
        "responses": responses,
        "timestamp": datetime.utcnow()
    })

    # Insert true labels into test_labels
    test_labels.insert_one({
        "user_id": user_id,
        "true_personality": true_personality,
        "true_job_role": true_job
    })

    print(f"✅ Inserted {user_id} with job: {true_job}, personality: {true_personality}")

print("🎉 All 50 mock users inserted successfully!")
