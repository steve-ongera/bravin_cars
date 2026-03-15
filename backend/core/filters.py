"""
Bravin Cars - Django Filters for Vehicle search & filtering
"""
import django_filters
from django.db import models as db_models
from .models import Vehicle, CarCategory, FuelType, TransmissionType, CarCondition, ListingStatus


class VehicleFilter(django_filters.FilterSet):
    # Brand filtering
    brand = django_filters.CharFilter(field_name='brand__slug', lookup_expr='exact')
    brand_name = django_filters.CharFilter(field_name='brand__name', lookup_expr='icontains')

    # Category
    category = django_filters.MultipleChoiceFilter(choices=CarCategory.choices)

    # Year range
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    year = django_filters.NumberFilter(field_name='year', lookup_expr='exact')

    # Price range (KSH)
    price_min = django_filters.NumberFilter(field_name='price_ksh', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price_ksh', lookup_expr='lte')

    # Specs
    fuel_type = django_filters.MultipleChoiceFilter(choices=FuelType.choices)
    transmission = django_filters.MultipleChoiceFilter(choices=TransmissionType.choices)
    condition = django_filters.MultipleChoiceFilter(choices=CarCondition.choices)

    # Booleans
    is_import = django_filters.BooleanFilter()
    is_featured = django_filters.BooleanFilter()
    is_negotiable = django_filters.BooleanFilter()
    is_commission = django_filters.BooleanFilter()

    # Branch / Location
    branch_city = django_filters.CharFilter(field_name='branch__city', lookup_expr='iexact')

    # Status (default active)
    status = django_filters.ChoiceFilter(choices=ListingStatus.choices)

    # Model search
    model = django_filters.CharFilter(field_name='model', lookup_expr='icontains')

    class Meta:
        model = Vehicle
        fields = [
            'brand', 'brand_name', 'category', 'year', 'year_min', 'year_max',
            'price_min', 'price_max', 'fuel_type', 'transmission', 'condition',
            'is_import', 'is_featured', 'is_commission', 'branch_city',
            'status', 'model'
        ]