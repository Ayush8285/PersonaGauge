import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from gridfs import GridFS
import pdfplumber  # For text extraction
from bson import ObjectId
from db_connection import db, fs  # Import MongoDB connection

cv_collection = db["cv_data"]  # Collection for extracted CV data

@csrf_exempt
def upload_cv(request):
    if request.method == "POST":
        if "cv" not in request.FILES:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        file = request.FILES["cv"]
        file_id = fs.put(file.read(), filename=file.name)  # Store file in GridFS

        # Extract text from the CV
        extracted_text = extract_text_from_pdf(file)

        # Store extracted text in MongoDB collection
        cv_data = {
            "file_id": str(file_id),  
            "filename": file.name,
            "extracted_text": extracted_text
        }
        cv_collection.insert_one(cv_data)

        return JsonResponse({"message": "File uploaded", "file_id": str(file_id)})

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

@csrf_exempt
def get_cv_data(request, file_id):
    cv_data = cv_collection.find_one({"file_id": file_id})
    if not cv_data:
        return JsonResponse({"error": "CV not found"}, status=404)
    
    return JsonResponse({
        "file_id": cv_data["file_id"],
        "filename": cv_data["filename"],
        "extracted_text": cv_data["extracted_text"]
    })


# @csrf_exempt
# def get_user_cv(request, user_id):
#     """Retrieve CV data for a specific user."""
#     cv_data = cv_collection.find_one({"user_id": user_id})
    
#     if not cv_data:
#         return JsonResponse({"error": "No CV found for this user"}, status=404)
    
#     return JsonResponse({
#         "user_id": cv_data["user_id"],
#         "file_id": cv_data["file_id"],
#         "filename": cv_data["filename"]
#     })
