from django.urls import path,include
from . import views
from rest_framework import routers
from rest_framework import renderers
from .views import ResultViewSet

router = routers.DefaultRouter()
router.register('', ResultViewSet, basename='result')

urlpatterns = router.urls