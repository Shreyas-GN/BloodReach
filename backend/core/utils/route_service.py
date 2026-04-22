import requests
from django.conf import settings

class RouteService:
    def __init__(self):
        self.api_key = getattr(settings, 'ORS_API_KEY', None)
        self.base_url = "https://api.openrouteservice.org/v2/directions/driving-car"

    def get_route(self, origin_lat, origin_lng, dest_lat, dest_lng):
        if not self.api_key:
            return None
        
        headers = {
            'Authorization': self.api_key,
            'Content-Type': 'application/json; charset=utf-8'
        }
        
        # Coordinates must be [longitude, latitude] for ORS
        coordinates = [[origin_lng, origin_lat], [dest_lng, dest_lat]]
        body = {"coordinates": coordinates}
        
        response = requests.post(self.base_url, json=body, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            # Duration is in seconds, convert to minutes
            duration = data['routes'][0]['summary']['duration'] / 60
            geometry = data['routes'][0]['geometry']
            return {
                "duration": round(duration, 2),
                "geometry": geometry
            }
        return None

def get_travel_time(lat1, lon1, lat2, lon2):
    service = RouteService()
    result = service.get_route(lat1, lon1, lat2, lon2)
    return result['duration'] if result else None

def get_route_geometry(lat1, lon1, lat2, lon2):
    service = RouteService()
    result = service.get_route(lat1, lon1, lat2, lon2)
    return result['geometry'] if result else None
