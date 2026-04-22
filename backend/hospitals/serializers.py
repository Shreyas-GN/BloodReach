from rest_framework import serializers
from .models import Hospital, EmergencyRequest

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class EmergencyRequestSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    
    class Meta:
        model = EmergencyRequest
        fields = '__all__'
