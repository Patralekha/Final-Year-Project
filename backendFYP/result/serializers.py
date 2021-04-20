#from .models import Subject,Topic,MCQSet

from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import BaseUserManager

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework import serializers

from users.models import CustomUser,Student,Teacher
from subjects.models import Subject, Topic, MCQSet
from result.models import MCQResult

class EmptySerializer(serializers.Serializer):
    pass

class MCQQuestionSeriaLizer(serializers.Serializer):
    class Meta:
        model=MCQSet
        fields=('qid','question','option_1','option_2','option_3','option_4','ans_key')