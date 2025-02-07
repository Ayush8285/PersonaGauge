import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
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

            # Store in MongoDB
            quiz_collection.insert_one({
                "user_id": user_id,
                "responses": responses
            })

            return JsonResponse({"message": "Quiz answers saved successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_quiz_answers(request, user_id):
    """Fetches a user's quiz answers including questions and their responses."""
    try:
        # Find the quiz answers for the given user_id
        quiz_data = quiz_collection.find_one({"user_id": user_id})

        if not quiz_data:
            return JsonResponse({"error": "No quiz data found"}, status=404)

        return JsonResponse({
            "user_id": quiz_data["user_id"],
            "responses": quiz_data.get("responses", [])  # List of questions & answers
        }, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
