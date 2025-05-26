from django.urls import path
from .views import submit_quiz, get_all_quiz_submissions

urlpatterns = [
    path("submit/", submit_quiz, name="submit_quiz"),
    path("get/<str:user_id>/", get_all_quiz_submissions, name="get_all_quiz_submissions"),
]
