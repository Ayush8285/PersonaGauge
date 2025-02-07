from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from db_connection import db  # Import MongoDB connection

# Reference to the feedback collection
feedback_collection = db["feedback"]

@csrf_exempt
def submit_feedback(request):
    """Handles feedback submission from users."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # Parse request body
            name = data.get("name")
            email = data.get("email")
            message = data.get("message")

            if not name or not email or not message:
                return JsonResponse({"error": "All fields are required!"}, status=400)

            # Insert into MongoDB
            feedback_collection.insert_one({
                "name": name,
                "email": email,
                "message": message
            })

            return JsonResponse({"message": "Feedback submitted successfully!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def get_feedbacks(request):
    """Fetches all feedback from MongoDB for the admin panel."""
    if request.method == "GET":
        feedbacks = list(feedback_collection.find({}, {"_id": 0}))  # Exclude MongoDB ObjectId
        return JsonResponse({"feedbacks": feedbacks}, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=405)
