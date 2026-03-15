"""
Bravin Cars - Main URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

admin.site.site_header = "Bravin Cars Admin"
admin.site.site_title = "Bravin Cars"
admin.site.index_title = "Welcome to Bravin Cars Management"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    # Serve React SPA for all other routes (when deployed together)
    # path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)