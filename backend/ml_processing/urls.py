from django.urls import path
from .views import fetch_processed_data, fetch_predictions, fetch_prediction_result

urlpatterns = [
    path("process-data/<str:user_id>/", fetch_processed_data, name="get_user_data"),
    path("predict/<str:user_id>/", fetch_predictions, name="predict_personality_and_job"),
    path("predictions/<str:user_id>/<str:cv_id>/<str:quiz_id>/", fetch_prediction_result, name="fetch_prediction_result")
]
