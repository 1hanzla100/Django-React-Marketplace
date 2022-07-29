from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
# from .models import UserProfile
from phonenumber_field.serializerfields import PhoneNumberField
from djoser.conf import settings
from djoser.serializers import TokenCreateSerializer

User = get_user_model()


class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        password = attrs.get("password")
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
            request=self.context.get("request"), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail("invalid_credentials")
        if self.user:
            return attrs
        self.fail("invalid_credentials")


class UserSerializer(serializers.ModelSerializer):
    phone_no = PhoneNumberField(
        required=True,
        error_messages={
            'invalid': 'Enter a valid phone number (e.g. +12125552368)'
        }
    )

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_no', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'email']


class IsUserActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'is_active']
