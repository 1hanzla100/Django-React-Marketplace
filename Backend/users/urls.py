from django.urls import path
from .views import (update_profile, is_user_active)

urlpatterns = [
    path('is-user-active/<str:email>/', is_user_active, name="is_user_active"),
    path('update-profile/', update_profile, name="update_profile"),
]
