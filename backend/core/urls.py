"""
Bravin Cars - Core App URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'brands', views.BrandViewSet, basename='brand')
router.register(r'branches', views.BranchViewSet, basename='branch')
router.register(r'vehicles', views.VehicleViewSet, basename='vehicle')
router.register(r'inquiries', views.InquiryViewSet, basename='inquiry')
router.register(r'commissions', views.CommissionSubmissionViewSet, basename='commission')
router.register(r'imports', views.ImportOrderViewSet, basename='import')
router.register(r'careers', views.CareerApplicationViewSet, basename='career')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonial')
router.register(r'newsletter', views.NewsletterViewSet, basename='newsletter')
router.register(r'inspections', views.InspectionBookingViewSet, basename='inspection')

urlpatterns = [
    path('', include(router.urls)),
    # Auth
    path('auth/', include('rest_framework.urls')),
]