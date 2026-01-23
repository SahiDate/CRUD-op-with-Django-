from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        data["username"] = user.username
        data["role"] = user.profile.role

        return data


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
