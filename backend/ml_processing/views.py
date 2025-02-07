from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services import get_user_data, predict_personality_and_job

@csrf_exempt
def fetch_processed_data(request, user_id):
    """ API Endpoint to get processed CV & Quiz data for a user """
    user_data = get_user_data(user_id)
    
    if not user_data:
        return JsonResponse({"error": "Data not found for user"}, status=404)

    return JsonResponse(user_data, safe=False)



@csrf_exempt
def fetch_predictions(request, user_id):
    """API to get personality and job role prediction"""
    result = predict_personality_and_job(user_id)
    if "error" in result:
        return JsonResponse(result, status=404)
    
    return JsonResponse(result, safe=False)
