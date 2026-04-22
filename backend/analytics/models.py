from django.db import models
from hospitals.models import EmergencyRequest

class RequestLog(models.Model):
    emergency_request = models.OneToOneField(EmergencyRequest, on_delete=models.CASCADE, related_name='log')
    
    # Precise timestamps for speed calculation
    created_at = models.DateTimeField(auto_now_add=True)
    fulfilled_at = models.DateTimeField(null=True, blank=True)
    
    # Distance data (calculated from OpenRouteService)
    distance_to_donors_avg = models.FloatField(null=True, blank=True)
    shortest_distance = models.FloatField(null=True, blank=True)
    
    # Outcome
    is_fulfilled = models.BooleanField(default=False)
    total_donors_notified = models.PositiveIntegerField(default=0)
    
    # Geolocation context
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return f"Log for {self.emergency_request}"

class DonorResponseLog(models.Model):
    request_log = models.ForeignKey(RequestLog, on_delete=models.CASCADE, related_name='responses')
    donor_id = models.UUIDField() # ID from profiles/users
    response_time_seconds = models.FloatField()
    distance_meters = models.FloatField()
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
