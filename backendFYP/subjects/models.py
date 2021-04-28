from django.db import models
from django_random_queryset import RandomManager
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class Subject(models.Model):
    sub_id=models.AutoField(primary_key=True) 
    subject=models.CharField(max_length=255)

    def __str__(self):
        return "{}-{}".format(self.sub_id,self.subject)


class Topic(models.Model):
    id=models.AutoField(primary_key=True)
    topic_id=models.IntegerField()
    subject_id=models.ForeignKey(Subject,on_delete=models.CASCADE)
    topic=models.CharField(max_length=400)
    def __str__(self):
        return "{}-{}-{}".format(self.subject_id,self.topic_id,self.topic)

class MCQSet(models.Model):
    qid=models.AutoField(primary_key=True)
    subject_topic=models.ForeignKey(Topic,on_delete=models.CASCADE)
    question=models.TextField()
    option_1=models.TextField()
    option_2=models.TextField()
    option_3=models.TextField()
    option_4=models.TextField()
    answer_key=models.IntegerField()
    level=models.CharField(max_length=10,default='Easy')

    objects = RandomManager()

    def __str__(self):
        return "{}-{}".format(self.qid,self.question)


# ADD ONE SubjectiveSet TABLE WITH ONE SUBJECTIVE QUESTION PAPER FOR EACH SUBJECT(FINAL TEST SET)
class SubjectiveSet(models.Model):
    qid=models.AutoField(primary_key=True)
    subject_topic=models.ForeignKey(Topic,on_delete=models.CASCADE)
    question=models.TextField()
    level=models.CharField(max_length=10,default='Easy')
    answer_keys=ArrayField(models.CharField(max_length=20))

    objects = RandomManager()

    def __str__(self):
        return "{}-{}-{}".format(self.qid,self.question,self.answer_keys)
