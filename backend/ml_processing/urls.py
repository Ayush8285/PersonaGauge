from django.urls import path
from .views import fetch_processed_data, fetch_predictions

urlpatterns = [
    path("process-data/<str:user_id>/", fetch_processed_data, name="get_user_data"),
    path("predict/<str:user_id>/", fetch_predictions, name="predict_personality_and_job"),
]
