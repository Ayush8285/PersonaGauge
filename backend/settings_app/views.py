from django.http import JsonResponse
from django.views import View
from django.conf import settings
from pymongo import MongoClient

class UserSettingsView(View):
    def get(self, request, user_id):
        # Access the MongoDB collection directly
        collection = settings.db.user_settings  # Access the 'user_settings' collection
        
        # Find the document for the user
        user_settings = collection.find_one({"user_id": user_id})
        
        if user_settings:
            return JsonResponse(user_settings, status=200)
        else:
            return JsonResponse({"error": "Settings not found for this user"}, status=404)

    def put(self, request, user_id):
        # Access the MongoDB collection directly
        collection = settings.db.user_settings  # Access the 'user_settings' collection
        
        # Extract data from the request (you can use request.body for raw data)
        updated_data = {
            "username": request.POST.get("username"),
            "email": request.POST.get("email"),
            "dark_theme": request.POST.get("dark_theme") == 'true',
            "notifications_enabled": request.POST.get("notifications_enabled") == 'true',
        }

        # Update the document in MongoDB
        result = collection.update_one(
            {"user_id": user_id},  # Query to find the document
            {"$set": updated_data},  # Update data
            upsert=True  # If the document doesn't exist, create a new one
        )

        if result.matched_count > 0 or result.upserted_id:
            return JsonResponse({"message": "Settings updated successfully"}, status=200)
        else:
            return JsonResponse({"error": "Failed to update settings"}, status=400)
