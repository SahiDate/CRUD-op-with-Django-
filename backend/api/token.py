from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Profile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        try:
            token["role"] = user.profile.role
        except:
            token["role"] = "user"

        return token
