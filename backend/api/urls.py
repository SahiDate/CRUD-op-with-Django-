from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .jwt_views import CustomTokenView
from .auth_views import register_user, me, all_users
from .views import StudentViewSet
from .stats_views import admin_stats

router = DefaultRouter()
router.register("students", StudentViewSet, basename="students")

urlpatterns = [
    path("login/", CustomTokenView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("register/", register_user),
    path("me/", me),
    path("users/", all_users),
    path("stats/", admin_stats),

]

urlpatterns += router.urls
