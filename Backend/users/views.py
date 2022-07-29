from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .serializers import (UserSerializer, IsUserActiveSerializer)
from django.contrib.auth import get_user_model

User = get_user_model()


@csrf_exempt
@api_view(['GET'])
def is_user_active(request, email):
    user = get_object_or_404(User, email=email)
    serializer = IsUserActiveSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = UserSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        user.first_name = serializer.validated_data['first_name']
        user.last_name = serializer.validated_data['last_name']
        user.phone_no = serializer.validated_data['phone_no']
        user.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
