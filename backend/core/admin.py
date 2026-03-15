"""
Bravin Cars - Admin Configuration
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Brand, Branch, Vehicle, VehicleImage,
    CommissionSubmission, CommissionImage,
    Inquiry, ImportOrder, CareerApplication,
    Testimonial, Newsletter, InspectionBooking
)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'country_of_origin', 'is_popular', 'vehicle_count', 'created_at']
    list_filter = ['is_popular', 'country_of_origin']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

    def vehicle_count(self, obj):
        return obj.vehicle_count
    vehicle_count.short_description = 'Active Vehicles'


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['city', 'address', 'phone', 'email', 'is_headquarters']
    list_filter = ['city', 'is_headquarters']
    prepopulated_fields = {'slug': ('city',)}


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 3
    fields = ['image', 'caption', 'is_primary', 'order']


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'brand', 'category', 'year', 'price_ksh',
        'condition', 'status', 'is_featured', 'is_import', 'views'
    ]
    list_filter = ['status', 'category', 'brand', 'condition', 'is_featured', 'is_import', 'is_commission']
    search_fields = ['title', 'model', 'brand__name', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [VehicleImageInline]
    list_editable = ['status', 'is_featured']
    ordering = ['-created_at']
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'slug', 'brand', 'model', 'category', 'year', 'condition')
        }),
        ('Specifications', {
            'fields': ('engine_cc', 'fuel_type', 'transmission', 'drive_type', 'mileage_km', 'color', 'seats')
        }),
        ('Pricing & Status', {
            'fields': ('price_ksh', 'is_negotiable', 'status', 'branch', 'is_featured', 'is_import', 'is_commission')
        }),
        ('Content', {
            'fields': ('description', 'features', 'meta_description')
        }),
    )

    def thumbnail(self, obj):
        img = obj.primary_image
        if img:
            return format_html('<img src="{}" height="50"/>', img.image.url)
        return '-'
    thumbnail.short_description = 'Photo'


class CommissionImageInline(admin.TabularInline):
    model = CommissionImage
    extra = 0


@admin.register(CommissionSubmission)
class CommissionSubmissionAdmin(admin.ModelAdmin):
    list_display = ['seller_name', 'brand', 'model', 'year', 'asking_price_ksh', 'is_reviewed', 'submitted_at']
    list_filter = ['is_reviewed', 'condition']
    search_fields = ['seller_name', 'seller_email', 'brand', 'model']
    list_editable = ['is_reviewed']
    inlines = [CommissionImageInline]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'vehicle', 'preferred_contact', 'status', 'created_at']
    list_filter = ['status', 'preferred_contact', 'created_at']
    search_fields = ['name', 'email', 'phone']
    list_editable = ['status']


@admin.register(ImportOrder)
class ImportOrderAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'model', 'year_from', 'year_to', 'budget_ksh', 'preferred_source', 'is_processed']
    list_filter = ['preferred_source', 'is_processed']
    search_fields = ['name', 'email', 'brand', 'model']
    list_editable = ['is_processed']


@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'position_applied', 'preferred_branch', 'is_shortlisted', 'applied_at']
    list_filter = ['position_applied', 'is_shortlisted', 'preferred_branch']
    search_fields = ['full_name', 'email']
    list_editable = ['is_shortlisted']


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'rating', 'is_approved', 'created_at']
    list_filter = ['is_approved', 'rating']
    list_editable = ['is_approved']


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'is_active', 'subscribed_at']
    list_filter = ['is_active']


@admin.register(InspectionBooking)
class InspectionBookingAdmin(admin.ModelAdmin):
    list_display = ['name', 'inspection_type', 'vehicle_make', 'vehicle_model', 'preferred_date', 'is_confirmed']
    list_filter = ['inspection_type', 'is_confirmed', 'preferred_date']
    list_editable = ['is_confirmed']