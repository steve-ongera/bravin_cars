"""
Bravin Cars - Core ViewSets
Email notifications integrated for inquiries, commissions, imports etc.
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

from .models import (
    Brand, Branch, Vehicle, VehicleImage,
    CommissionSubmission, CommissionImage,
    Inquiry, ImportOrder, CareerApplication,
    Testimonial, Newsletter, InspectionBooking,
    ListingStatus, CarCategory
)
from .serializers import (
    BrandSerializer, BranchSerializer,
    VehicleListSerializer, VehicleDetailSerializer,
    CommissionSubmissionSerializer, InquirySerializer,
    ImportOrderSerializer, CareerApplicationSerializer,
    TestimonialSerializer, NewsletterSerializer,
    InspectionBookingSerializer, SiteStatsSerializer
)
from .filters import VehicleFilter


# ─── Helpers ─────────────────────────────────────────────────────────────────

def send_notification_email(subject, message_plain, recipient_list, html_message=None):
    """Send email notification helper"""
    try:
        if html_message:
            msg = EmailMultiAlternatives(
                subject=subject,
                body=message_plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=recipient_list
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()
        else:
            send_mail(
                subject=subject,
                message=message_plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=recipient_list,
                fail_silently=True
            )
    except Exception as e:
        print(f"Email error: {e}")


# ─── Brand ViewSet ────────────────────────────────────────────────────────────

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country_of_origin']
    ordering_fields = ['name', 'vehicle_count']

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Return popular brands with vehicle counts"""
        brands = Brand.objects.filter(is_popular=True).annotate(
            count=Count('vehicles', filter=Q(vehicles__status=ListingStatus.ACTIVE))
        ).order_by('-count')
        serializer = self.get_serializer(brands, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def vehicles(self, request, slug=None):
        """Get all vehicles for a specific brand"""
        brand = self.get_object()
        vehicles = Vehicle.objects.filter(
            brand=brand, status=ListingStatus.ACTIVE
        )
        page = self.paginate_queryset(vehicles)
        serializer = VehicleListSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)


# ─── Branch ViewSet ───────────────────────────────────────────────────────────

class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]


# ─── Vehicle ViewSet ──────────────────────────────────────────────────────────

class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.filter(status=ListingStatus.ACTIVE).select_related(
        'brand', 'branch'
    ).prefetch_related('images')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VehicleFilter
    search_fields = ['title', 'model', 'brand__name', 'description', 'color']
    ordering_fields = ['price_ksh', 'year', 'created_at', 'views', 'mileage_km']
    ordering = ['-is_featured', '-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VehicleDetailSerializer
        return VehicleListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Vehicle.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Featured vehicles for homepage"""
        vehicles = self.get_queryset().filter(is_featured=True)[:8]
        serializer = VehicleListSerializer(vehicles, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def imports(self, request):
        """Import vehicles only"""
        vehicles = self.get_queryset().filter(is_import=True)
        page = self.paginate_queryset(vehicles)
        serializer = VehicleListSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Group vehicles by category with counts"""
        categories = []
        for key, label in CarCategory.choices:
            count = Vehicle.objects.filter(
                status=ListingStatus.ACTIVE, category=key
            ).count()
            if count > 0:
                categories.append({'key': key, 'label': label, 'count': count})
        return Response(categories)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Site statistics for homepage"""
        data = {
            'total_vehicles': Vehicle.objects.filter(status=ListingStatus.ACTIVE).count(),
            'total_brands': Brand.objects.count(),
            'total_branches': Branch.objects.count(),
            'featured_count': Vehicle.objects.filter(status=ListingStatus.ACTIVE, is_featured=True).count(),
            'import_count': Vehicle.objects.filter(status=ListingStatus.ACTIVE, is_import=True).count(),
            'categories': [
                {'key': k, 'label': l,
                 'count': Vehicle.objects.filter(status=ListingStatus.ACTIVE, category=k).count()}
                for k, l in CarCategory.choices
            ]
        }
        return Response(data)

    @action(detail=True, methods=['get'])
    def similar(self, request, slug=None):
        """Similar vehicles (same brand or category)"""
        vehicle = self.get_object()
        similar = Vehicle.objects.filter(
            status=ListingStatus.ACTIVE
        ).filter(
            Q(brand=vehicle.brand) | Q(category=vehicle.category)
        ).exclude(pk=vehicle.pk)[:6]
        serializer = VehicleListSerializer(similar, many=True, context={'request': request})
        return Response(serializer.data)


# ─── Inquiry ViewSet ──────────────────────────────────────────────────────────

class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get', 'head', 'options']

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()

        # Send confirmation email to customer
        customer_subject = f"Your Inquiry Received - Bravin Cars"
        customer_message = f"""
Dear {inquiry.name},

Thank you for contacting Bravin Cars! We have received your inquiry and will get back to you shortly.

Your Details:
- Name: {inquiry.name}
- Phone: {inquiry.phone}
- Preferred Contact: {inquiry.preferred_contact.title()}
{f'- Vehicle: {inquiry.vehicle.title}' if inquiry.vehicle else ''}

Our team will contact you within 24 hours.

For immediate assistance, WhatsApp us: +254 112 284 093
Website: www.bravincars.co.ke

Best regards,
Bravin Cars Team
        """
        send_notification_email(customer_subject, customer_message, [inquiry.email])

        # Notify admin
        admin_subject = f"New Inquiry from {inquiry.name}"
        admin_message = f"""
New Inquiry Received on Bravin Cars!

From: {inquiry.name}
Email: {inquiry.email}
Phone: {inquiry.phone}
Preferred Contact: {inquiry.preferred_contact}
{f'Vehicle: {inquiry.vehicle.title}' if inquiry.vehicle else 'General Inquiry'}
Message: {inquiry.message}

Login to admin to respond: http://localhost:8000/admin/
        """
        send_notification_email(admin_subject, admin_message, [settings.ADMIN_EMAIL])

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─── Commission Submission ViewSet ───────────────────────────────────────────

class CommissionSubmissionViewSet(viewsets.ModelViewSet):
    queryset = CommissionSubmission.objects.all()
    serializer_class = CommissionSubmissionSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get', 'head', 'options']

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        # Customer confirmation
        send_notification_email(
            subject="Your Car Listing Submission - Bravin Cars",
            message_plain=f"""
Dear {submission.seller_name},

We have received your car for commission listing!

Car Details:
- {submission.year} {submission.brand} {submission.model}
- Asking Price: KES {submission.asking_price_ksh:,}

Our team will review your submission and contact you within 48 hours. 
We handle everything — marketing, inquiries, and negotiations — so you can sit back!

Commission: Our standard rate applies. We'll discuss details when we call.

Bravin Cars Team | +254 112 284 093
            """,
            recipient_list=[submission.seller_email]
        )

        # Admin notification
        send_notification_email(
            subject=f"New Commission Car: {submission.year} {submission.brand} {submission.model}",
            message_plain=f"""
New Commission Submission!

Seller: {submission.seller_name}
Phone: {submission.seller_phone}
Email: {submission.seller_email}
Location: {submission.seller_location}

Car: {submission.year} {submission.brand} {submission.model}
Asking: KES {submission.asking_price_ksh:,}
Condition: {submission.condition}
Mileage: {submission.mileage_km or 'Not specified'} KM

Description: {submission.description}

Review at: http://localhost:8000/admin/
            """,
            recipient_list=[settings.ADMIN_EMAIL]
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─── Import Order ViewSet ─────────────────────────────────────────────────────

class ImportOrderViewSet(viewsets.ModelViewSet):
    queryset = ImportOrder.objects.all()
    serializer_class = ImportOrderSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get', 'head', 'options']

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Customer email
        send_notification_email(
            subject="Import Order Received - Bravin Cars",
            message_plain=f"""
Dear {order.name},

Your import order request has been received!

Car: {order.brand} {order.model} ({order.year_from}-{order.year_to})
Budget: KES {order.budget_ksh:,}
Source: {order.get_preferred_source_display()}

Our import specialists will contact you within 24-48 hours with available options.

Bravin Cars | +254 112 284 093
            """,
            recipient_list=[order.email]
        )

        # Admin
        send_notification_email(
            subject=f"New Import Order: {order.brand} {order.model}",
            message_plain=f"""
New Import Request!

Customer: {order.name} | {order.phone}
Car: {order.brand} {order.model} ({order.year_from}-{order.year_to})
Budget: KES {order.budget_ksh:,}
Source: {order.get_preferred_source_display()}
Specs: {order.specifications or 'None'}
            """,
            recipient_list=[settings.ADMIN_EMAIL]
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─── Career ViewSet ───────────────────────────────────────────────────────────

class CareerApplicationViewSet(viewsets.ModelViewSet):
    queryset = CareerApplication.objects.all()
    serializer_class = CareerApplicationSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get', 'head', 'options']

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        send_notification_email(
            subject="Application Received - Bravin Cars",
            message_plain=f"""
Dear {application.full_name},

Thank you for applying to Bravin Cars for the {application.get_position_applied_display()} position.

We have received your application and our HR team will review it. Shortlisted candidates will be contacted for an interview.

Bravin Cars HR Team
            """,
            recipient_list=[application.email]
        )

        send_notification_email(
            subject=f"New Job Application: {application.get_position_applied_display()}",
            message_plain=f"""
New Application!
Name: {application.full_name}
Position: {application.get_position_applied_display()}
Phone: {application.phone}
Branch: {application.preferred_branch}
            """,
            recipient_list=[settings.ADMIN_EMAIL]
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─── Testimonial ViewSet ──────────────────────────────────────────────────────

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.filter(is_approved=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]


# ─── Newsletter ViewSet ───────────────────────────────────────────────────────

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'head', 'options']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        newsletter = serializer.save()

        send_notification_email(
            subject="Welcome to Bravin Cars Newsletter!",
            message_plain=f"""
Thank you for subscribing to Bravin Cars newsletter!

You'll receive:
- New arrivals & import listings
- Special deals and promotions
- Car market insights

Bravin Cars | +254 112 284 093 | www.bravincars.co.ke
            """,
            recipient_list=[newsletter.email]
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─── Inspection Booking ViewSet ───────────────────────────────────────────────

class InspectionBookingViewSet(viewsets.ModelViewSet):
    queryset = InspectionBooking.objects.all()
    serializer_class = InspectionBookingSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get', 'head', 'options']

    def get_permissions(self):
        if self.action == 'list':
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()

        send_notification_email(
            subject="Inspection Booking Confirmed - Bravin Cars",
            message_plain=f"""
Dear {booking.name},

Your inspection booking has been received!

Service: {booking.get_inspection_type_display()}
Vehicle: {booking.vehicle_year} {booking.vehicle_make} {booking.vehicle_model}
Date: {booking.preferred_date.strftime('%A, %d %B %Y')}
Branch: {booking.preferred_branch or 'Main Branch'}

We will confirm your appointment within 24 hours.

Bravin Cars Inspection Team | +254 112 284 093
            """,
            recipient_list=[booking.email]
        )

        send_notification_email(
            subject=f"New Inspection Booking: {booking.get_inspection_type_display()}",
            message_plain=f"""
New Inspection Booking!
Customer: {booking.name} | {booking.phone}
Service: {booking.get_inspection_type_display()}
Vehicle: {booking.vehicle_year} {booking.vehicle_make} {booking.vehicle_model}
Date: {booking.preferred_date}
Branch: {booking.preferred_branch}
            """,
            recipient_list=[settings.ADMIN_EMAIL]
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)