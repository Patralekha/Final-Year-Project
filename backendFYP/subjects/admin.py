from django.contrib import admin
from . models import Subject,Topic,MCQSet,SubjectiveSet

admin.site.register(Subject)
admin.site.register(Topic)
admin.site.register(MCQSet)
admin.site.register(SubjectiveSet)