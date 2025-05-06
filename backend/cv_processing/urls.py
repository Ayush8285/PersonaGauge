from django.urls import path
from .views import upload_cv,serve_cv_file, get_cv_metadata

urlpatterns = [
    path("upload-cv/", upload_cv, name="upload_cv"),  # Upload CV
    # path("get-cv-data/<str:file_id>/", get_cv_data, name="get_cv_data"),  # Fetch extracted text
    path("get-cv/<str:user_id>/", serve_cv_file),
    path('view-file-details/<str:user_id>/', get_cv_metadata),
]
