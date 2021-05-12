from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model,logout
from django.core.exceptions import ImproperlyConfigured
#import models from subjects and users
from subjects.models import Subject,Topic,MCQSet
from users.models import Student,Teacher,CustomUser


class MCQResult(models.Model):
    id=models.AutoField(primary_key=True)
    student_id=models.ForeignKey(Student,on_delete=models.CASCADE,default=None)
    subject_id=models.IntegerField(default=0)
    qid=ArrayField(models.IntegerField())
    ans_chosen=ArrayField(models.IntegerField())
    score=models.IntegerField()
    date=models.DateField()


#add model to store subjective answers
class SubjectiveResult(models.Model):
    id=models.AutoField(primary_key=True)
    student_id=models.ForeignKey(Student,on_delete=models.CASCADE,default=None)
    subject_id=models.IntegerField(default=0)
    qid=ArrayField(models.IntegerField())
    ans_chosen=ArrayField(models.CharField(max_length=250))
    score=ArrayField(models.DecimalField(max_digits=10,decimal_places=2))
    date=models.DateField()
