# model_accuracy/views.py
import os
import json
from django.http import JsonResponse

def get_static_model_accuracy(request):
    path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml_models", "model_accuracy.json"))
    with open(path, "r") as f:
        report = json.load(f)
    return JsonResponse(report)
