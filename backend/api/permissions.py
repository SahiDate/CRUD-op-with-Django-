from rest_framework.permissions import BasePermission

class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        try:
            user = request.user

            # 🔒 Block anonymous safely
            if not user or not user.is_authenticated:
                return False

            return user.profile.role == "admin"
        except:
            return False
