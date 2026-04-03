from django.urls import path
from api.views import execute_query
urlpatterns = [
    path('query/', execute_query),
]