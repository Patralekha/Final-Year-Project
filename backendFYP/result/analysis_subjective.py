from users.models import CustomUser,Student,Teacher
from subjects.models import Subject, Topic, MCQSet,SubjectiveSet
from result.models import MCQResult
from django.db.models import Count
from django_random_queryset import RandomManager


from rake_nltk import Rake
import nltk.data

r=Rake()

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')


def extract(answer):
    text=tokenizer.tokenize(answer)
    r.extract_keywords_from_sentences(text)

    r.get_ranked_phrases()

    r.get_word_frequency_distribution()
    keywords=r.get_ranked_phrases()[0:20]
    print("Keywords for this ans:\n",keywords)
    return keywords


def generate_score_from_ans(answerlist,qids,subid):
    n=len(qids)
    scores={}
    for i in range(0,n):
        keywords=extract(answerlist[i])
        score=calculate_score(qids[i],subid,keywords)
        scores[qids[i]]=score
    return scores


def calculate_score(qid,subid,candidate_ans):
    ans_keys=SubjectiveSet.objects.filter(qid=qid).values('answer_keys')
    actual_ans_length=1
    candidate_ans_length=len(candidate_ans)

    lst1=[]
    lst2=[]

    if actual_ans_length >= candidate_ans_length:
        for o in ans_keys:
            lst1=o['answer_keys']
        actual_ans_length=len(lst1)
        lst2=candidate_ans
    else:
        for o in ans_keys:
            lst2=o['answer_keys']
        actual_ans_length=len(lst2)
        lst1=candidate_ans

    lst3=[]
    print(lst1,"\n",lst2)
    for v in lst2:
        if v.lower() in lst1:
            lst3.append(v)
            lst1.remove(v)
    print(lst3)

    score=score_evaluation(lst3,actual_ans_length)
    return score



def score_evaluation(lst3,ans_length):
    n=len(lst3)
    match_percentage=n/ans_length
    print("MATCH PERCENTAGE: ",match_percentage)
    score=0
    if match_percentage < 0.4:
        score=match_percentage*5
    elif match_percentage >= 0.4 and match_percentage <0.6:
        score=0.62*5
    elif match_percentage >= 0.6 and match_percentage < 0.8:
        score=0.75*5
    else:
        score=1.0*5

    return score