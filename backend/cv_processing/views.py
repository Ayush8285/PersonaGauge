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

# @csrf_exempt
# def upload_cv(request):
#     if request.method == "POST":
#         if "cv" not in request.FILES:
#             return JsonResponse({"error": "No file uploaded"}, status=400)

#         file = request.FILES["cv"]
#         file_id = fs.put(file.read(), filename=file.name)  # Store file in GridFS

#         # Extract text from the CV
#         extracted_text = extract_text_from_pdf(file)

#         # Store extracted text in MongoDB collection
#         cv_data = {
#             "file_id": str(file_id),  
#             "filename": file.name,
#             "extracted_text": extracted_text
#         }
#         cv_collection.insert_one(cv_data)

#         return JsonResponse({"message": "File uploaded", "file_id": str(file_id)})



def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text + "\n"
    return text.strip()


# def extract_text_from_pdf(file):
#     text = ""
#     with pdfplumber.open(file) as pdf:
#         for page in pdf.pages:
#             text += page.extract_text() + "\n"
#     return text.strip()




#not working
# @csrf_exempt
# def get_cv_data(request):
#     user_id = request.GET.get("user_id")  # Get user_id from request query
#     file_id = request.GET.get("file_id")  # Get file_id from request query

#     if file_id:
#         # Fetch CV by file_id
#         cv_data = cv_collection.find_one({"file_id": file_id})
#         if not cv_data:
#             return JsonResponse({"error": "CV not found"}, status=404)
        
#         return JsonResponse({
#             "file_id": cv_data["file_id"],
#             "filename": cv_data["filename"],
#             "extracted_text": cv_data["extracted_text"],
#             "user_id": cv_data["user_id"]
#         })
    
#     elif user_id:
#         # Fetch all CVs of a specific user
#         user_cvs = list(cv_collection.find({"user_id": user_id}, {"_id": 0}))
#         if not user_cvs:
#             return JsonResponse({"error": "No CVs found for this user"}, status=404)

#         return JsonResponse({"user_id": user_id, "cvs": user_cvs})
    
#     else:
#         return JsonResponse({"error": "User ID or File ID is required"}, status=400)



@csrf_exempt
def get_user_cv(request, user_id):
    """Retrieve CV data for a specific user."""
    cv_data = cv_collection.find_one({"user_id": user_id})
    
    if not cv_data:
        return JsonResponse({"error": "No CV found for this user"}, status=404)
    
    return JsonResponse({
        "user_id": cv_data["user_id"],
        "file_id": cv_data["file_id"],
        "filename": cv_data["filename"]
    })
