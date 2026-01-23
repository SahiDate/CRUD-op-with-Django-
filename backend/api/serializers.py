from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Student


# 📝 REGISTER SERIALIZER
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[("admin", "admin"), ("user", "user")])

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": False}
        }

    def create(self, validated_data):
        role = validated_data.pop("role")

        # ✅ Create user safely (password hashing handled by Django)
        user = User.objects.create_user(**validated_data)

        # ✅ Ensure profile exists (no duplicates, no crash)
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()

        return user


# 🎓 STUDENT SERIALIZER
class StudentSerializer(serializers.ModelSerializer):
    # Show owner's username in response
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Student
        # ✅ Explicit fields = clean API (no accidental exposure)
        fields = ["id", "name", "email", "course", "owner", "created_at"]
        read_only_fields = ["id", "owner", "created_at"]

    # ✅ Extra validation (optional but pro-level)
    def validate_email(self, value):
        if not value or "@" not in value:
            raise serializers.ValidationError("Enter a valid email address")
        return value
