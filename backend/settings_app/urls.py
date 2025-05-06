from django.urls import path
from .views import UserSettingsView

urlpatterns = [
    path('settings/<int:user_id>/', UserSettingsView.as_view(), name='user_settings'),
]
