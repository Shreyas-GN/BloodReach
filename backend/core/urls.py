from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hospitals/', include('hospitals.urls')),
    path('api/', include('maps.urls')),
    # path('api/users/', include('users.urls')),
]
