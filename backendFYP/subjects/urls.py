from django.urls import path,include
from . import views
from rest_framework import routers
from rest_framework import renderers
from .views import SubjectViewSet

router = routers.DefaultRouter()
router.register('', SubjectViewSet, basename='subjects')
#router.register('', TestViewSet, basename='tests')

urlpatterns = router.urls