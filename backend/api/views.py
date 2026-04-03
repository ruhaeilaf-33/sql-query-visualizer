from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json

@csrf_exempt
def execute_query(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query")

            if not query.lower().strip().startswith("select"):
                return JsonResponse({"error": "Only SELECT queries allowed"}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(query)
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()

            result = []
            for row in rows:
                result.append(dict(zip(columns, row)))

            return JsonResponse(result, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Send POST request"})