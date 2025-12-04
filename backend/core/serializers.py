from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import re # Import regex for password strength

CustomerUser = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomerUser
        fields = ('username', 'email', 'password', 'confirm_password',
                  'first_name', 'last_name', 'city', 'state', 'phone')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'city': {'required': False},
            'state': {'required': False},
            'phone': {'required': False},
        }

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")
        if CustomerUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email address already registered.")
        return value

    def validate_username(self, value):
        if CustomerUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        if not re.match("^[a-zA-Z0-9_]+$", value):
             raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})

        password = attrs['password']
        errors = []
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long.")
        if not re.search("[a-z]", password):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search("[A-Z]", password):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search("[0-9]", password):
            errors.append("Password must contain at least one digit.")

        if errors:
            raise serializers.ValidationError({"password": " ".join(errors)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        # --- CHANGE: Create the user as active immediately ---
        user = CustomerUser.objects.create_user(
            **validated_data,
            is_active=True # User is active right away, no email verification needed for this method
        )

        # No email verification logic needed here for standard signup

        # Optional SMS verification logic could still go here if phone is provided
        # if user.phone:
        #     print(f"DEBUG: Would send SMS code to {user.phone} for optional verification.")

        return user