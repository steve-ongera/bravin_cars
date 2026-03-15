"""
Bravin Cars - Core App URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token   # ← token login view
from . import views

router = DefaultRouter()
router.register(r'brands',       views.BrandViewSet,               basename='brand')
router.register(r'branches',     views.BranchViewSet,              basename='branch')
router.register(r'vehicles',     views.VehicleViewSet,             basename='vehicle')
router.register(r'inquiries',    views.InquiryViewSet,             basename='inquiry')
router.register(r'commissions',  views.CommissionSubmissionViewSet, basename='commission')
router.register(r'imports',      views.ImportOrderViewSet,         basename='import')
router.register(r'careers',      views.CareerApplicationViewSet,   basename='career')
router.register(r'testimonials', views.TestimonialViewSet,         basename='testimonial')
router.register(r'newsletter',   views.NewsletterViewSet,          basename='newsletter')
router.register(r'inspections',  views.InspectionBookingViewSet,   basename='inspection')

urlpatterns = [
    path('', include(router.urls)),

    # Token auth — POST {username, password} → returns {token}
    # This registers the URL at /api/auth/token/
    path('auth/token/', obtain_auth_token, name='auth-token'),

    # DRF browsable API session login (optional, for browser testing)
    path('auth/', include('rest_framework.urls')),
]