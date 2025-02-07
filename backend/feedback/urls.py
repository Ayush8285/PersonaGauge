from django.urls import path
from .views import submit_feedback, get_feedbacks

urlpatterns = [
    path("submit-feedback/", submit_feedback, name="submit_feedback"),
    path("get-feedbacks/", get_feedbacks, name="get_feedbacks"),
]
