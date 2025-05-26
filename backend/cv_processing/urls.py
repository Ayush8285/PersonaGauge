from django.urls import path
from .views import upload_cv, get_all_cv_metadata, serve_cv_by_id

urlpatterns = [
    path("upload-cv/", upload_cv, name="upload_cv"),  # Upload CV
    # path("get-cv-data/<str:file_id>/", get_cv_data, name="get_cv_data"),  # Fetch extracted text
    path("get-cv/<str:user_id>/<str:cv_id>/", serve_cv_by_id),
    path('view-file-details/<str:user_id>/', get_all_cv_metadata),
]
