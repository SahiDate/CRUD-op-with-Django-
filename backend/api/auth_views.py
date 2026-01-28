from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer


@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created"})
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.profile.role
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def all_users(request):
    if request.user.profile.role != "admin":
        return Response({"detail": "Admin only"}, status=403)

    users = User.objects.all().values("id", "username", "email", "date_joined")
    return Response(list(users))
