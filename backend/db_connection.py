from dotenv import load_dotenv
import os
import pymongo
import gridfs

load_dotenv()  # loads variables from .env into environment

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URL')
client = pymongo.MongoClient(MONGO_URI)

# Database name
db = client["personaGauge"]

# Initialize GridFS (for handling large files like PDFs)
fs = gridfs.GridFS(db)

# Export database and GridFS instance for use in other files

# Collections
cv_data = db["cv_data"]  # Ensure this exists
quiz_answers = db["quiz_answers"]
users = db["users"]
