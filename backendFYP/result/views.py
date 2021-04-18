from django.shortcuts import render


# Create your views here.
from django.contrib.auth import get_user_model, logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Subject, Topic, MCQSet
from django.db.models import Count
from . import serializers

from .analysis import extract


class ResultViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'mcq': serializers.EmptySerializer,
    }

    queryset = ''

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def mcq(self, request):
        queryset = Subject.objects.values('sub_id', 'subject')
        #do analysis calculate score,store it in database and return it
        return Response(queryset)


    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def subjective(self, request):
        candidate_answers=request.data['answers']
        keywords_per_answer=extract(candidate_answers)
        #do analysis calculate score,store it in database and return it
        return Response(status=status.HTTP_200_OK)


    