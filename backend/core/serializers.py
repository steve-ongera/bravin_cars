"""
Bravin Cars - Core Serializers
"""
from rest_framework import serializers
from django.conf import settings
from .models import (
    Brand, Branch, Vehicle, VehicleImage,
    CommissionSubmission, CommissionImage,
    Inquiry, ImportOrder, CareerApplication,
    Testimonial, Newsletter, InspectionBooking
)


class BrandSerializer(serializers.ModelSerializer):
    vehicle_count = serializers.ReadOnlyField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'country_of_origin',
                  'description', 'is_popular', 'vehicle_count']


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'city', 'slug', 'address', 'phone', 'email',
                  'whatsapp', 'working_hours', 'google_maps_link',
                  'is_headquarters', 'manager_name']


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'caption', 'is_primary', 'order']


class VehicleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    brand_slug = serializers.CharField(source='brand.slug', read_only=True)
    primary_image = VehicleImageSerializer(read_only=True)
    whatsapp_link = serializers.ReadOnlyField()
    branch_city = serializers.CharField(source='branch.city', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'title', 'slug', 'brand_name', 'brand_slug',
            'model', 'category', 'year', 'condition',
            'fuel_type', 'transmission', 'mileage_km',
            'price_ksh', 'is_negotiable', 'is_import',
            'is_featured', 'is_commission', 'status',
            'branch_city', 'primary_image', 'whatsapp_link',
            'views', 'created_at'
        ]


class VehicleDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail views"""
    brand = BrandSerializer(read_only=True)
    branch = BranchSerializer(read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    whatsapp_link = serializers.ReadOnlyField()
    primary_image = VehicleImageSerializer(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    transmission_display = serializers.CharField(source='get_transmission_display', read_only=True)
    drive_type_display = serializers.CharField(source='get_drive_type_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'title', 'slug',
            'brand', 'model', 'category', 'category_display',
            'year', 'condition', 'condition_display',
            'engine_cc', 'fuel_type', 'fuel_type_display',
            'transmission', 'transmission_display',
            'drive_type', 'drive_type_display',
            'mileage_km', 'color', 'seats',
            'price_ksh', 'is_negotiable', 'is_import',
            'description', 'features',
            'status', 'branch', 'is_featured', 'is_commission',
            'meta_description', 'images', 'primary_image',
            'whatsapp_link', 'views', 'created_at', 'updated_at'
        ]


class CommissionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionImage
        fields = ['id', 'image']


class CommissionSubmissionSerializer(serializers.ModelSerializer):
    images = CommissionImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = CommissionSubmission
        fields = [
            'id', 'seller_name', 'seller_phone', 'seller_email',
            'seller_location', 'brand', 'model', 'year',
            'asking_price_ksh', 'condition', 'mileage_km',
            'description', 'images', 'uploaded_images', 'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        submission = CommissionSubmission.objects.create(**validated_data)
        for img in uploaded_images:
            CommissionImage.objects.create(submission=submission, image=img)
        return submission


class InquirySerializer(serializers.ModelSerializer):
    vehicle_title = serializers.CharField(source='vehicle.title', read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            'id', 'vehicle', 'vehicle_title', 'name', 'email',
            'phone', 'message', 'preferred_contact', 'branch',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']


class ImportOrderSerializer(serializers.ModelSerializer):
    preferred_source_display = serializers.CharField(
        source='get_preferred_source_display', read_only=True
    )

    class Meta:
        model = ImportOrder
        fields = [
            'id', 'name', 'email', 'phone',
            'brand', 'model', 'year_from', 'year_to',
            'budget_ksh', 'preferred_source', 'preferred_source_display',
            'specifications', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CareerApplicationSerializer(serializers.ModelSerializer):
    position_display = serializers.CharField(
        source='get_position_applied_display', read_only=True
    )

    class Meta:
        model = CareerApplication
        fields = [
            'id', 'full_name', 'email', 'phone',
            'position_applied', 'position_display',
            'preferred_branch', 'cover_letter', 'cv', 'applied_at'
        ]
        read_only_fields = ['id', 'applied_at']


class TestimonialSerializer(serializers.ModelSerializer):
    vehicle_title = serializers.CharField(source='vehicle_purchased.title', read_only=True)

    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'location', 'message', 'rating',
            'vehicle_title', 'photo', 'created_at'
        ]


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'subscribed_at']
        read_only_fields = ['id', 'subscribed_at']

    def validate_email(self, value):
        if Newsletter.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value


class InspectionBookingSerializer(serializers.ModelSerializer):
    inspection_type_display = serializers.CharField(
        source='get_inspection_type_display', read_only=True
    )
    branch_name = serializers.CharField(source='branch.city', read_only=True)

    class Meta:
        model = InspectionBooking
        fields = [
            'id', 'name', 'email', 'phone',
            'inspection_type', 'inspection_type_display',
            'vehicle_make', 'vehicle_model', 'vehicle_year',
            'preferred_date', 'preferred_branch', 'branch_name',
            'additional_notes', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ─── Stats / Summary ─────────────────────────────────────────────────────────

class SiteStatsSerializer(serializers.Serializer):
    total_vehicles = serializers.IntegerField()
    total_brands = serializers.IntegerField()
    total_branches = serializers.IntegerField()
    featured_count = serializers.IntegerField()
    import_count = serializers.IntegerField()
    categories = serializers.ListField()