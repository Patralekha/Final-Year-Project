from django.shortcuts import render


# Create your views here.
from django.contrib.auth import get_user_model,logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from .models import Subject,Topic,MCQSet

from . import serializers



class SubjectViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'allSubjects':serializers.EmptySerializer,
    }
    
    queryset=''

    @action(methods=['GET'], detail=False, permission_classes=[AllowAny, ])
    def allSubjects(self, request):
        queryset = Subject.objects.values('subject')
        return Response(queryset)

    

    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def addSubject(self, request):
        obj=Subject(subject=request.data['subject'])
        obj.save()
        return Response(status=status.HTTP_201_CREATED)



    @action(methods=['POST'], detail=False, permission_classes=[AllowAny, ])
    def addTopic(self, request):
        print(request.data)
        obj=Subject.objects.filter(subject=request.data['subject'])[0]
        topic_inds=Topic.objects.filter(subject_id=obj).order_by('-topic_id')
        last_topic_id=0
        if len(topic_inds) != 0:
            last_topic_id=topic_inds[0]+1

        print(last_topic_id)
        curr_topic_id=last_topic_id+1
        obj1=Topic(topic_id=curr_topic_id,subject_id=obj,topic=request.data['topic'])
        obj1.save()      
        return Response(status=status.HTTP_201_CREATED)


    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()