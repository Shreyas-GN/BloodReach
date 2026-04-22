from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HospitalViewSet, EmergencyRequestViewSet

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'emergencies', EmergencyRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
