from rest_framework import viewsets, permissions
from .models import Hospital, EmergencyRequest
from .serializers import HospitalSerializer, EmergencyRequestSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EmergencyRequestViewSet(viewsets.ModelViewSet):
    queryset = EmergencyRequest.objects.all().order_by('-created_at')
    serializer_class = EmergencyRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # Trigger WebSocket Broadcast
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "emergency_broadcasts",
            {
                "type": "send_notification",
                "message": {
                    "event": "NEW_EMERGENCY",
                    "blood_group": instance.blood_group,
                    "hospital": instance.hospital.name,
                    "priority": instance.priority,
                    "units": instance.units_required
                }
            }
        )
