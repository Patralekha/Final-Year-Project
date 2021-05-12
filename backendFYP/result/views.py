from django.shortcuts import render

# Create your views here.
from django.contrib.auth import get_user_model, logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from users.models import CustomUser, Student, Teacher
from subjects.models import Subject, Topic, MCQSet,SubjectiveSet
from result.models import MCQResult
from django.db.models import Count
from .serializers import MCQQuestionSeriaLizer, EmptySerializer

from .analysis_obj import analyse_obj, get_percentages, generate_query_obj
from .analysis_subjective import extract, generate_score_from_ans
from datetime import date


class ResultViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = EmptySerializer
    serializer_classes = {
        'mcq': EmptySerializer,
    }

    queryset = ''

    @action(methods=['GET'], detail=True, permission_classes=[AllowAny, ])
    def mcq(self, request, pk=None):
        queryset = analyse_obj(int(pk))
        l = []
        for o in queryset:
            d = {}
            d['qid'] = o.qid
            d['question']=o.question
            d['option_1']=o.option_1
            d['option_2']=o.option_2
            d['option_3']=o.option_3
            d['option_4']=o.option_4
            d['ans_key']=o.answer_key
            l.append(d)
        return Response(data=l, status=status.HTTP_200_OK)


    @action(methods=['GET'], detail=True, permission_classes=[AllowAny, ])
    def subjective(self, request, pk=None):
        # pick questions based on previous result
        id1=pk
        subject=Subject.objects.get(sub_id=id1)
        query_topics=Topic.objects.filter(subject_id=subject)
        query=SubjectiveSet.objects.filter(subject_topic__in=query_topics)
        q1=query.filter(level__in=['Easy','Medium','Hard']).order_by('?')[:4] #add random() to pick 6 
        print(q1)
        l = []
        for o in q1:
            d = {}
            d['qid'] = o.qid
            d['question']=o.question
            d['level']=o.level
            d['answer_keys']=o.answer_keys
            l.append(d)
        return Response(data=l,status=status.HTTP_200_OK)

    @action(methods=['POST',], detail=False, permission_classes=[AllowAny, ])
    def mcq_score(self, request):
        score=request.data['score']
        answers=(request.POST.getlist('anschosen[]'))
        qids=(request.POST.getlist('q[]'))
        subid=request.data['subjectId']
        today=date.today()
        q=[]
        a=[]
        for i in qids:
            q.append(i)
        for i in answers:
            a.append(i)
        obj=MCQResult(student_id=Student.objects.get(id=1),subject_id=subid,qid=q,ans_chosen=a,score=score,date=today)
        obj.save()
        return Response(status=status.HTTP_200_OK)


    @action(methods=['POST'],detail=False,permission_classes=[AllowAny,])
    def subjective_score(self,request):
        answers=(request.POST.getlist('answers[]'))
        qids=(request.POST.getlist('q[]'))
        subid=request.data['subjectId']
        print(qids,'\n')
        print(answers)
        scores=generate_score_from_ans(answers,qids,subid)
        print(scores)
        return Response(data=scores,status=status.HTTP_200_OK)

