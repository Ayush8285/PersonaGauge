from django.urls import path
from . import views


urlpatterns = [
        path('', views.index, name='index'),
        path('add/', views.add_user, name='user_data'),

]