from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
import json


# ================= EXECUTE QUERY =================
@csrf_exempt
def execute_query(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query")

            # 🔐 Allow only SELECT queries
            if not query.lower().strip().startswith("select"):
                return JsonResponse({"error": "Only SELECT queries allowed"}, status=400)

            with connection.cursor() as cursor:
                cursor.execute(query)
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()

            result = [dict(zip(columns, row)) for row in rows]

            return JsonResponse(result, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Send POST request"})


# ================= FREE AI (TEXT → SQL) =================
@csrf_exempt
def generate_sql(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            prompt = data.get("prompt", "").lower()

            # 🔥 RULE-BASED NLP ENGINE

            # marks > value
            if "above" in prompt or "greater than" in prompt:
                number = ''.join(filter(str.isdigit, prompt))
                return JsonResponse({
                    "sql": f"SELECT * FROM student WHERE marks > {number};"
                })

            # marks < value
            elif "below" in prompt or "less than" in prompt:
                number = ''.join(filter(str.isdigit, prompt))
                return JsonResponse({
                    "sql": f"SELECT * FROM student WHERE marks < {number};"
                })

            # between range
            elif "between" in prompt:
                nums = [int(s) for s in prompt.split() if s.isdigit()]
                if len(nums) >= 2:
                    return JsonResponse({
                        "sql": f"SELECT * FROM student WHERE marks BETWEEN {nums[0]} AND {nums[1]};"
                    })

            # only names
            elif "name" in prompt and "marks" in prompt:
                return JsonResponse({
                    "sql": "SELECT name, marks FROM student;"
                })

            elif "name" in prompt:
                return JsonResponse({
                    "sql": "SELECT name FROM student;"
                })

            elif "marks" in prompt:
                return JsonResponse({
                    "sql": "SELECT marks FROM student;"
                })

            # sorting
            elif "highest" in prompt or "top" in prompt:
                return JsonResponse({
                    "sql": "SELECT * FROM student ORDER BY marks DESC;"
                })

            elif "lowest" in prompt:
                return JsonResponse({
                    "sql": "SELECT * FROM student ORDER BY marks ASC;"
                })

            # count
            elif "count" in prompt:
                return JsonResponse({
                    "sql": "SELECT COUNT(*) FROM student;"
                })

            # average
            elif "average" in prompt or "avg" in prompt:
                return JsonResponse({
                    "sql": "SELECT AVG(marks) FROM student;"
                })

            # default
            elif "all" in prompt or "show" in prompt:
                return JsonResponse({
                    "sql": "SELECT * FROM student;"
                })

            # fallback
            return JsonResponse({
                "sql": "SELECT * FROM student;"
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Send POST request"})