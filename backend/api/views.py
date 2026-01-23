from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import get_user_model

from .models import Student
from .serializers import StudentSerializer, RegisterSerializer

User = get_user_model()


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        selected_user = self.request.query_params.get("user")

        # ADMIN → See all OR selected user's students
        if hasattr(user, "profile") and user.profile.role == "admin":
            if selected_user:
                return Student.objects.select_related("owner").filter(
                    owner_id=selected_user
                )
            return Student.objects.select_related("owner").all()

        # NORMAL USER → Only own students
        return Student.objects.filter(owner=user)

    # USER CAN CREATE
    def create(self, request, *args, **kwargs):
        user = request.user

        if hasattr(user, "profile") and user.profile.role == "admin":
            return Response(
                {"detail": "Admins cannot create records"},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # ADMIN CAN UPDATE
    def update(self, request, *args, **kwargs):
        user = request.user

        if not hasattr(user, "profile") or user.profile.role != "admin":
            return Response(
                {"detail": "Only admins can edit"},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().update(request, *args, **kwargs)

    # ADMIN CAN DELETE
    def destroy(self, request, *args, **kwargs):
        user = request.user

        if not hasattr(user, "profile") or user.profile.role != "admin":
            return Response(
                {"detail": "Only admins can delete"},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().destroy(request, *args, **kwargs)


# 🔐 LOGGED-IN USER API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logged_in_user(request):
    user = request.user

    role = "user"
    if hasattr(user, "profile") and user.profile.role == "admin":
        role = "admin"

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email or "",
        "role": role
    })



# 📝 USER REGISTRATION API
@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    print("REGISTER ERRORS:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 👑 ADMIN → GET ALL USERS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    user = request.user

    # Only admin can see users
    if not hasattr(user, "profile") or user.profile.role != "admin":
        return Response({"detail": "Only admin can view users"}, status=403)

    users = User.objects.all().values(
        "id",
        "username",
        "email",
        "date_joined"
    )

    return Response(list(users))
