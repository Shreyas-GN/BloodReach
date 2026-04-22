from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.utils.route_service import RouteService

class RouteView(APIView):
    permission_classes = [] # Allow public access for now as per requirement or specific context

    def get(self, request):
        try:
            origin_lat = float(request.query_params.get('origin_lat'))
            origin_lng = float(request.query_params.get('origin_lng'))
            dest_lat = float(request.query_params.get('dest_lat'))
            dest_lng = float(request.query_params.get('dest_lng'))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid coordinates provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        service = RouteService()
        result = service.get_route(origin_lat, origin_lng, dest_lat, dest_lng)
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Could not calculate route."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
