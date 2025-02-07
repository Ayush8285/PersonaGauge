from django.urls import path
from .views import upload_cv, get_user_cv

urlpatterns = [
    path("upload-cv/", upload_cv, name="upload_cv"),  # Upload CV
    # path("get-cv-data/<str:file_id>/", get_cv_data, name="get_cv_data"),  # Fetch extracted text
     path("get-cv/<str:user_id>/", get_user_cv, name="get_user_cv"),
]
