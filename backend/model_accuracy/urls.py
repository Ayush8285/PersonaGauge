from django.urls import path
from .views import get_static_model_accuracy

urlpatterns = [
     path("static-accuracy/", get_static_model_accuracy),
]
