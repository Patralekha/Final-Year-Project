from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model,logout
from django.core.exceptions import ImproperlyConfigured
#import models from subjects and users
from subjects.models import Subject,Topic,MCQSet
from users.models import Student,Teacher,CustomUser


class MCQResult(models.Model):
    id=models.AutoField(primary_key=True)
    student_id=models.ForeignKey(Student,on_delete=models.CASCADE)
    qid=ArrayField(models.IntegerField())
    ans_chosen=ArrayField(models.IntegerField())
    score=models.IntegerField()
    date=models.DateField()


#add model to store subjective answers