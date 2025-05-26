import json
import re
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from pymongo import MongoClient
from gridfs import GridFS
import pdfplumber  # For text extraction
from bson import ObjectId
from datetime import datetime
from db_connection import db, fs  # Import MongoDB connection

cv_collection = db["cv_data"]  # Collection for extracted CV data

@csrf_exempt
def upload_cv(request):
    if request.method == "POST":
        if "cv" not in request.FILES:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        user_id = request.POST.get("user_id")
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        file = request.FILES["cv"]
        extracted_text = extract_text_from_pdf(file)

        # ✅ Validate CV content
        if not extracted_text or not is_valid_cv(extracted_text):
            return JsonResponse({
                "error": "Uploaded file does not appear to be a valid CV. Please upload a proper resume."
            }, status=400)

        # Save file to GridFS
        file.seek(0)
        file_id = fs.put(file.read(), filename=file.name)

        # Insert into MongoDB and get the inserted ID
        cv_data = {
            "user_id": user_id,
            "file_id": str(file_id),
            "filename": file.name,
            "extracted_text": extracted_text,
            "timestamp": datetime.utcnow(),
        }
        result = cv_collection.insert_one(cv_data)
        # print(f"CV uploaded successfully with ID: {inserted_id}")

        return JsonResponse({
            "message": "File uploaded successfully",
            "_id": str(result.inserted_id),  # ✅ return the CV document ID
            "file_id": str(file_id),
            "user_id": user_id
        })

    return JsonResponse({"error": "Invalid request method"}, status=405)



def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text.strip()

#for one file metadata that related to particular user
# @require_GET
# def get_cv_metadata(request, user_id):
#     """Return CV metadata directly from the collection (no GridFS access)."""
#     try:
#         cv_record = cv_collection.find_one({"user_id": user_id})
#         if not cv_record:
#             return JsonResponse({"error": "CV not found for this user"}, status=404)

#         return JsonResponse({
#             "filename": cv_record.get("filename"),
#             "user_id": cv_record.get("user_id"),
#             "file_id": cv_record.get("file_id")
#         })

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    
    
# for every file meta data that related to particular user
@require_GET
def get_all_cv_metadata(request, user_id):
    """Return all CV metadata sorted by most recent."""
    try:
        cv_records = list(cv_collection.find({"user_id": user_id}).sort("timestamp", -1))  # sort by latest
        if not cv_records:
            return JsonResponse([], safe=False)

        result = [
            {
                "_id": str(cv["_id"]),
                "filename": cv.get("filename"),
                "user_id": cv.get("user_id"),
                "file_id": str(cv.get("file_id")),
                "timestamp": cv.get("timestamp")
            }
            for cv in cv_records
        ]
        return JsonResponse(result, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# for one file that related to particular user
# @require_GET
# def serve_cv_file(request, user_id):
#     """Serve the CV file using user_id passed in URL."""
#     try:
#         # Find the CV record using user_id
#         cv_record = cv_collection.find_one({"user_id": user_id})
#         if not cv_record:
#             return JsonResponse({"error": "CV not found for this user"}, status=404)

#         file_id = cv_record.get("file_id")
#         if not file_id:
#             return JsonResponse({"error": "File ID missing in CV record"}, status=500)

#         # Fetch file from GridFS using file_id
#         file = fs.get(ObjectId(file_id))
#         return FileResponse(file, content_type="application/pdf", filename=file.filename)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

# for every file that related to particular user
@require_GET
def serve_cv_by_id(request, user_id, cv_id):
    """Serve a specific CV file based on its document ID."""
    try:
        record = cv_collection.find_one({"_id": ObjectId(cv_id), "user_id": user_id})
        if not record:
            return JsonResponse({"error": "CV not found"}, status=404)

        file = fs.get(ObjectId(record["file_id"]))
        return FileResponse(file, content_type="application/pdf", filename=file.filename)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def is_valid_cv(text):
    # Convert to lowercase for easier keyword detection
    text_lower = text.lower()

    # Define common CV/resume-related keywords
    keywords = [
        "email", "phone", "contact", "experience", "skills",
        "education", "summary", "projects", "work", "certification",
        "qualification", "objective", "linkedin", "github"
    ]

    # Count how many keywords appear in the text
    keyword_hits = sum(1 for word in keywords if word in text_lower)

    # Heuristic: if at least 3 keywords are found, consider it a valid CV
    return keyword_hits >= 3


