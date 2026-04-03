from django.urls import path
from api.views import execute_query, generate_sql

urlpatterns = [
    path('query/', execute_query),
    path('generate-sql/', generate_sql),
]