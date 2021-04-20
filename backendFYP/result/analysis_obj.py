from users.models import CustomUser,Student,Teacher
from subjects.models import Subject, Topic, MCQSet
from result.models import MCQResult
from django.db.models import Count
from django_random_queryset import RandomManager


from datetime import date
from datetime import timedelta

def analyse_obj(id):
    today = date.today()
    yesterday = today - timedelta(days = 1)
    days_30 = today - timedelta(days = 30)
    queryset = MCQResult.objects.filter(subject_id=id,date__range=[days_30,yesterday])
    subject=Subject.objects.get(sub_id=id)
    
    query_topics=Topic.objects.filter(subject_id=subject)
    query=MCQSet.objects.filter(subject_topic__in=query_topics)

    easy,medium,hard=0,0,0
    if len(queryset) != 0:
        percentages=get_percentages(queryset)
        easy,medium,hard=percentages[0],percentages[1],percentages[2]

    question_query=generate_query_obj(easy,medium,hard,query)

    print(question_query)
    return question_query



def get_percentages(queryset):

    correct={'Easy':0,'Medium':0,'Hard':0}
    total={'Easy':0,'Medium':0,'Hard':0}
    l=[]
    easy,medium,hard=0,0,0
    k=0
    for obj in queryset:
        qids=obj.qid
        ans_chosen=obj.ans_chosen
        for q in qids:
            question=MCQSet.objects.get(qid=q)
            level=question.level
            ans_key=question.answer_key
            if ans_chosen[k]==ans_key:
                correct[level]+=1
            total[level]+=1
            k+=1

    
    easy=mapping['Easy']/total['Easy']
    medium=mapping['Medium']/total['Medium']
    hard=mapping['Hard']/total['Hard']
    l.append(easy)
    l.append(medium)
    l.append(hard)
    print(l)
    return l



def generate_query_obj(easy,medium,hard,query):
    if easy <= 0.6:
        return query.filter(level='Medium')   #change to Easy and add random(10)
    elif easy > 0.6 and medium <=0.6:
        q1=query.filter(level='Easy').random(4)
        q2=query.filter(level='Medium').random(6)
        return q1.union(q2)
    elif medium > 0.6 and hard<=0.6:
        q1=query.filter(level='Medium').random(4)
        q2=query.filter(level='Hard').random(6)
        return q1.union(q2)
    elif hard>0.6:
        return query.filter(level='Hard').random(10) 








        
            