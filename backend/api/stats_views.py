from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Student


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    user = request.user

    # 🔐 Only admin can access
    if user.profile.role != "admin":
        return Response({"detail": "Forbidden"}, status=403)

    # 🔽 Days filter from frontend
    days = int(request.query_params.get("days", 7))

    # 👥 Total users
    total_users = User.objects.count()

    # 🛡️ Total admins
    total_admins = User.objects.filter(profile__role="admin").count()

    # 🎓 Total students
    total_students = Student.objects.count()

    # 📅 Students in range
    cutoff = now() - timedelta(days=days)
    students_today = Student.objects.filter(created_at__gte=cutoff).count()

    # 📊 Students per user
    students_per_user = (
        Student.objects
        .values("owner__username")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    return Response({
        "total_users": total_users,
        "total_admins": total_admins,
        "total_students": total_students,
        "students_today": students_today,
        "students_per_user": list(students_per_user)
    })
