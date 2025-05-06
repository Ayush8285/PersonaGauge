import json
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
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
        
        # Extract `user_id` from request
        user_id = request.POST.get("user_id")
        if not user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        file = request.FILES["cv"]
        file_id = fs.put(file.read(), filename=file.name)  # Store file in GridFS

        # Extract text from the CV
        extracted_text = extract_text_from_pdf(file)

        # Store extracted text along with `user_id`
        cv_data = {
            "user_id": user_id,  # Store user_id
            "file_id": str(file_id),
            "filename": file.name,
            "extracted_text": extracted_text
        }
        cv_collection.insert_one(cv_data)

        return JsonResponse({
            "message": "File uploaded successfully",
            "file_id": str(file_id),
            "user_id": user_id
        })



def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text.strip()


@require_GET
def get_cv_metadata(request, user_id):
    """Return CV metadata directly from the collection (no GridFS access)."""
    try:
        cv_record = cv_collection.find_one({"user_id": user_id})
        if not cv_record:
            return JsonResponse({"error": "CV not found for this user"}, status=404)

        return JsonResponse({
            "filename": cv_record.get("filename"),
            "user_id": cv_record.get("user_id"),
            "file_id": cv_record.get("file_id")
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@require_GET
def serve_cv_file(request, user_id):
    """Serve the CV file using user_id passed in URL."""
    try:
        # Find the CV record using user_id
        cv_record = cv_collection.find_one({"user_id": user_id})
        if not cv_record:
            return JsonResponse({"error": "CV not found for this user"}, status=404)

        file_id = cv_record.get("file_id")
        if not file_id:
            return JsonResponse({"error": "File ID missing in CV record"}, status=500)

        # Fetch file from GridFS using file_id
        file = fs.get(ObjectId(file_id))
        return FileResponse(file, content_type="application/pdf", filename=file.filename)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



