import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from datetime import datetime
from db_connection import db  # Import MongoDB connection

quiz_collection = db["quiz_answers"]  # MongoDB collection for quiz answers

@csrf_exempt
def submit_quiz(request):
    """Store quiz answers along with questions"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            responses = data.get("responses")  # List of { "question": "?", "answer": "?" }

            if not user_id or not responses:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            # Store in MongoDB and capture the result
            result = quiz_collection.insert_one({
                "user_id": user_id,
                "responses": responses,
                "timestamp": datetime.utcnow(),
            })

            # ✅ Return the inserted quiz _id
            return JsonResponse({
                "message": "Quiz answers saved successfully!",
                "_id": str(result.inserted_id),  # convert ObjectId to string
                "user_id": user_id
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


#for one quiz response related to the cureent user
# @csrf_exempt
# def get_quiz_answers(request, user_id):
#     """Fetches a user's quiz answers including questions and their responses."""
#     try:
#         # Find the quiz answers for the given user_id
#         quiz_data = quiz_collection.find_one({"user_id": user_id})

#         if not quiz_data:
#             return JsonResponse({"error": "No quiz data found"}, status=404)

#         return JsonResponse({
#             "user_id": quiz_data["user_id"],
#             "responses": quiz_data.get("responses", [])  # List of questions & answers
#         }, safe=False, status=200)

#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)
    

    
#for all quiz response related to the cureent user
@csrf_exempt
def get_all_quiz_submissions(request, user_id):
    """Return all quiz attempts (latest first) for the user."""
    try:
        submissions = list(quiz_collection.find({"user_id": user_id}).sort("timestamp", -1))
        
        if not submissions:
            return JsonResponse({"error": "No quiz data found"}, status=404)

        formatted_submissions = [
            {
                "_id": str(s["_id"]),
                "user_id": s["user_id"],
                "responses": s.get("responses", [])
            }
            for s in submissions
        ]

        return JsonResponse({"submissions": formatted_submissions}, status=200, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)