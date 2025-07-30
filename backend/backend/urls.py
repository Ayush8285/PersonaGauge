"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from feedback.views import home  # import your view

urlpatterns = [
    path("admin/", admin.site.urls),
     path('', home),  # this handles the root URL "/"
     path("cv/", include("cv_processing.urls")),  # Including CV-related URLs
    path("quiz/", include("quiz.urls")), # Including quiz-related URLs
    path("auth/", include("authentication.urls")), #for user login and logout
    path("ml/", include("ml_processing.urls")), # Including ML-related URLs
    path("feedback/", include("feedback.urls")),  # Include feedback API
    path("accuracy/", include("model_accuracy.urls")),
]
