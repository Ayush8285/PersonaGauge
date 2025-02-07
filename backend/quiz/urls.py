from django.urls import path
from .views import submit_quiz, get_quiz_answers

urlpatterns = [
    path("submit/", submit_quiz, name="submit_quiz"),
    path("get/<str:user_id>/", get_quiz_answers, name="get_quiz_answers"),
]
