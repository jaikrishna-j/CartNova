from django.urls import path
from .views import register_user, google_login

urlpatterns = [
    path('register/', register_user, name='register'),
    path('google-login/', google_login, name='google_login'),
]