from django.shortcuts import render


# Create your views here.
from django.contrib.auth import get_user_model, logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import Subject, Topic, MCQSet,SubjectiveSet
from django.db.models import Count
from . import serializers
from .utils import generate_keywords

class SubjectViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'allSubjects': serializers.EmptySerializer,
    }

    queryset = ''

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated, ])
    def allSubjects(self, request):
        queryset = Subject.objects.values('sub_id', 'subject')
        return Response(queryset)


    @action(methods=['GET'], detail=True, permission_classes=[IsAuthenticated, ])
    def getSubject(self, request,pk=None):
        print(pk)
        obj = Subject.objects.get(sub_id=pk)
        return Response(data={"subject":obj.subject})

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated])
    def allTopics(self, request):
        queryset = (Topic.objects.values('id', 'subject_id',
                    'topic_id', 'topic').order_by('subject_id'))
        return Response(queryset)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated, ])
    def addSubject(self, request):
        obj = Subject(subject=request.data['subject'])
        obj.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated, ])
    def addTopic(self, request):
        print(request.data)
        obj = Subject.objects.filter(subject=request.data['subject'])[0]
        topic_inds = Topic.objects.filter(subject_id=obj).order_by('-topic_id')
        last_topic_id = 0
        if len(topic_inds) != 0:
            last_topic_id = topic_inds[0].topic_id+1

        print(last_topic_id)
        curr_topic_id = last_topic_id+1
        obj1 = Topic(topic_id=curr_topic_id, subject_id=obj,
                     topic=request.data['topic'])
        obj1.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated, ])
    def addQuestion(self, request):
        print(request.data)
        subject = Subject.objects.filter(sub_id=request.data["subjectid"])[0]
        subject_topic = Topic.objects.filter(
            topic_id=request.data['topicid'], subject_id=subject)[0]

        q = request.data['question']
        op1 = request.data['o1']
        op2 = request.data['o2']
        op3 = request.data['o3']
        op4 = request.data['o4']
        ans = request.data['ans']
        l = request.data['level']
        obj = MCQSet(subject_topic=subject_topic, question=q, option_1=op1, option_2=op2, option_3=op3, option_4=op4,
                     answer_key=ans, level=l)
        obj.save()
        return Response(status=status.HTTP_201_CREATED)



    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated, ])
    def addQuestionSubjective(self, request):
        print(request.data)
        subject = Subject.objects.filter(sub_id=request.data["subjectid"])[0]
        subject_topic = Topic.objects.filter(
            topic_id=request.data['topicid'], subject_id=subject)[0]

        q = request.data['question']
        ans=request.data['answer']
        keys=generate_keywords(ans)
        #keys=request.POST.getlist('keys[]')
        l = request.data['level']
        obj = SubjectiveSet(subject_topic=subject_topic, question=q, answer_keys=keys, level=l)
        obj.save()
        return Response(status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured(
                "serializer_classes should be a dict mapping.")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()



"""
class TestViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'mcq': serializers.EmptySerializer,
    }

    queryset = ''

    @action(methods=['GET'], detail=True, permission_classes=[AllowAny, ])
    def mcq(self, request, pk=None):
        queryset = Subject.objects.values('sub_id', 'subject')
        return Response(queryset)


    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured(
                "serializer_classes should be a dict mapping.")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()
"""