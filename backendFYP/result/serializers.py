#from .models import Subject,Topic,MCQSet

from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import BaseUserManager

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework import serializers


class EmptySerializer(serializers.Serializer):
    pass