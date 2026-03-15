"""
Bravin Cars - Core Models
Full e-commerce platform for car sales, imports, and commission listings
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


# ─── Choices ────────────────────────────────────────────────────────────────

class CarCategory(models.TextChoices):
    SEDAN = 'sedan', 'Sedan'
    SUV = 'suv', 'SUV'
    PICKUP = 'pickup', 'Pickup / Truck'
    HATCHBACK = 'hatchback', 'Hatchback'
    COUPE = 'coupe', 'Coupe'
    CONVERTIBLE = 'convertible', 'Convertible'
    MINIVAN = 'minivan', 'Minivan / MPV'
    WAGON = 'wagon', 'Station Wagon'
    SPORTS = 'sports', 'Sports Car'
    ELECTRIC = 'electric', 'Electric Vehicle'
    HYBRID = 'hybrid', 'Hybrid'
    VAN = 'van', 'Van / Bus'
    LORRY = 'lorry', 'Lorry / Heavy Truck'


class FuelType(models.TextChoices):
    PETROL = 'petrol', 'Petrol'
    DIESEL = 'diesel', 'Diesel'
    ELECTRIC = 'electric', 'Electric'
    HYBRID = 'hybrid', 'Hybrid'
    LPG = 'lpg', 'LPG'


class TransmissionType(models.TextChoices):
    AUTOMATIC = 'automatic', 'Automatic'
    MANUAL = 'manual', 'Manual'
    CVT = 'cvt', 'CVT'
    SEMI_AUTO = 'semi_auto', 'Semi-Automatic'


class DriveType(models.TextChoices):
    FWD = 'fwd', 'Front Wheel Drive'
    RWD = 'rwd', 'Rear Wheel Drive'
    AWD = 'awd', 'All Wheel Drive'
    FOUR_WD = '4wd', '4WD'


class CarCondition(models.TextChoices):
    NEW = 'new', 'Brand New'
    FOREIGN_USED = 'foreign_used', 'Foreign Used'
    LOCAL_USED = 'local_used', 'Locally Used'


class ListingStatus(models.TextChoices):
    ACTIVE = 'active', 'Active'
    SOLD = 'sold', 'Sold'
    RESERVED = 'reserved', 'Reserved'
    PENDING = 'pending', 'Pending Review'
    INACTIVE = 'inactive', 'Inactive'


class InquiryStatus(models.TextChoices):
    NEW = 'new', 'New'
    IN_PROGRESS = 'in_progress', 'In Progress'
    RESOLVED = 'resolved', 'Resolved'
    CLOSED = 'closed', 'Closed'


class BranchCity(models.TextChoices):
    NAIROBI = 'nairobi', 'Nairobi'
    MOMBASA = 'mombasa', 'Mombasa'
    KISUMU = 'kisumu', 'Kisumu'
    NAKURU = 'nakuru', 'Nakuru'
    ELDORET = 'eldoret', 'Eldoret'
    THIKA = 'thika', 'Thika'
    NYERI = 'nyeri', 'Nyeri'
    MERU = 'meru', 'Meru'


# ─── Brand / Make ───────────────────────────────────────────────────────────

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/logos/', null=True, blank=True)
    country_of_origin = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def vehicle_count(self):
        return self.vehicles.filter(status=ListingStatus.ACTIVE).count()


# ─── Branch ─────────────────────────────────────────────────────────────────

class Branch(models.Model):
    city = models.CharField(max_length=100, choices=BranchCity.choices)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=20, default='254112284093')
    working_hours = models.CharField(max_length=200, default='Mon-Sat: 8AM - 6PM, Sun: 10AM - 4PM')
    google_maps_link = models.URLField(blank=True)
    is_headquarters = models.BooleanField(default=False)
    manager_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_headquarters', 'city']
        verbose_name = 'Branch'
        verbose_name_plural = 'Branches'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.city)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Bravin Cars - {self.city}'


# ─── Vehicle ─────────────────────────────────────────────────────────────────

class Vehicle(models.Model):
    # Identity
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=280, unique=True, blank=True)

    # Classification
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='vehicles')
    model = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CarCategory.choices)
    year = models.PositiveIntegerField(
        validators=[MinValueValidator(1990), MaxValueValidator(2026)]
    )
    condition = models.CharField(max_length=20, choices=CarCondition.choices, default=CarCondition.FOREIGN_USED)

    # Specs
    engine_cc = models.PositiveIntegerField(help_text='Engine displacement in CC', null=True, blank=True)
    fuel_type = models.CharField(max_length=20, choices=FuelType.choices, default=FuelType.PETROL)
    transmission = models.CharField(max_length=20, choices=TransmissionType.choices, default=TransmissionType.AUTOMATIC)
    drive_type = models.CharField(max_length=10, choices=DriveType.choices, default=DriveType.FWD)
    mileage_km = models.PositiveIntegerField(null=True, blank=True, help_text='Mileage in KM')
    color = models.CharField(max_length=80, blank=True)
    seats = models.PositiveIntegerField(null=True, blank=True)

    # Pricing
    price_ksh = models.DecimalField(max_digits=12, decimal_places=2, help_text='Price in KES')
    is_negotiable = models.BooleanField(default=True)
    is_import = models.BooleanField(default=False, help_text='Import listing from Japan/UAE etc.')

    # Content
    description = models.TextField()
    features = models.TextField(blank=True, help_text='Comma separated or JSON list of features')

    # Availability
    status = models.CharField(max_length=20, choices=ListingStatus.choices, default=ListingStatus.ACTIVE)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    is_featured = models.BooleanField(default=False)
    is_commission = models.BooleanField(default=False, help_text='Car submitted by public for commission sale')

    # SEO
    meta_description = models.CharField(max_length=160, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['brand', 'model']),
            models.Index(fields=['category']),
            models.Index(fields=['year']),
            models.Index(fields=['price_ksh']),
            models.Index(fields=['status']),
        ]

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = f'{self.year} {self.brand} {self.model}'
        if not self.slug:
            base_slug = slugify(f'{self.year}-{self.brand}-{self.model}-{self.condition}')
            slug = base_slug
            counter = 1
            while Vehicle.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        if not self.meta_description:
            self.meta_description = f'Buy {self.title} in Kenya at KES {self.price_ksh:,}. {self.condition} {self.category} available at Bravin Cars.'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def primary_image(self):
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        return img

    @property
    def whatsapp_link(self):
        message = f'Hi Bravin Cars, I am interested in: {self.title} (KES {self.price_ksh:,}). Please share more details.'
        import urllib.parse
        return f'https://wa.me/254112284093?text={urllib.parse.quote(message)}'


# ─── Vehicle Images ──────────────────────────────────────────────────────────

class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='vehicles/images/%Y/%m/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'order']

    def save(self, *args, **kwargs):
        # Ensure only one primary image per vehicle
        if self.is_primary:
            VehicleImage.objects.filter(vehicle=self.vehicle, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Image for {self.vehicle.title}'


# ─── Commission Submission (Sell Your Car) ───────────────────────────────────

class CommissionSubmission(models.Model):
    # Seller info
    seller_name = models.CharField(max_length=150)
    seller_phone = models.CharField(max_length=20)
    seller_email = models.EmailField()
    seller_location = models.CharField(max_length=150)

    # Car details
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    asking_price_ksh = models.DecimalField(max_digits=12, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CarCondition.choices)
    mileage_km = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField()

    # Status
    is_reviewed = models.BooleanField(default=False)
    notes = models.TextField(blank=True, help_text='Internal notes by staff')
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='assigned_commissions'
    )

    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        verbose_name = 'Commission Submission'
        verbose_name_plural = 'Commission Submissions'

    def __str__(self):
        return f'{self.seller_name} - {self.year} {self.brand} {self.model}'


class CommissionImage(models.Model):
    submission = models.ForeignKey(CommissionSubmission, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='commissions/images/%Y/%m/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Image for submission {self.submission.id}'


# ─── Vehicle Inquiry ─────────────────────────────────────────────────────────

class Inquiry(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='inquiries', null=True, blank=True)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField()
    preferred_contact = models.CharField(
        max_length=20,
        choices=[('whatsapp', 'WhatsApp'), ('email', 'Email'), ('call', 'Phone Call')],
        default='whatsapp'
    )
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=InquiryStatus.choices, default=InquiryStatus.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'

    def __str__(self):
        return f'Inquiry from {self.name} - {self.created_at.strftime("%d/%m/%Y")}'


# ─── Import Order ────────────────────────────────────────────────────────────

class ImportOrder(models.Model):
    IMPORT_SOURCE = [
        ('japan', 'Japan'),
        ('uae', 'UAE / Dubai'),
        ('uk', 'United Kingdom'),
        ('usa', 'USA'),
        ('germany', 'Germany'),
        ('south_africa', 'South Africa'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year_from = models.PositiveIntegerField()
    year_to = models.PositiveIntegerField()
    budget_ksh = models.DecimalField(max_digits=12, decimal_places=2)
    preferred_source = models.CharField(max_length=20, choices=IMPORT_SOURCE, default='japan')
    specifications = models.TextField(blank=True, help_text='Specific requirements, color, features, etc.')
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Import Order'
        verbose_name_plural = 'Import Orders'

    def __str__(self):
        return f'{self.name} - {self.brand} {self.model} Import Request'


# ─── Career Application ──────────────────────────────────────────────────────

class CareerApplication(models.Model):
    POSITION_CHOICES = [
        ('sales_executive', 'Sales Executive'),
        ('mechanic', 'Mechanic / Technician'),
        ('driver', 'Driver'),
        ('admin', 'Administrative Staff'),
        ('marketing', 'Marketing'),
        ('finance', 'Finance & Accounts'),
        ('it', 'IT Support'),
        ('customer_service', 'Customer Service'),
        ('other', 'Other'),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    position_applied = models.CharField(max_length=50, choices=POSITION_CHOICES)
    preferred_branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    cover_letter = models.TextField()
    cv = models.FileField(upload_to='careers/cvs/%Y/%m/')
    is_shortlisted = models.BooleanField(default=False)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        return f'{self.full_name} - {self.get_position_applied_display()}'


# ─── Testimonial ─────────────────────────────────────────────────────────────

class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=100)
    message = models.TextField()
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    vehicle_purchased = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.rating}★'


# ─── Newsletter ──────────────────────────────────────────────────────────────

class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


# ─── Inspection Service ──────────────────────────────────────────────────────

class InspectionBooking(models.Model):
    INSPECTION_TYPE = [
        ('pre_purchase', 'Pre-Purchase Inspection'),
        ('roadworthy', 'Roadworthy Certificate'),
        ('valuation', 'Vehicle Valuation'),
        ('full_service', 'Full Service Inspection'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    inspection_type = models.CharField(max_length=30, choices=INSPECTION_TYPE)
    vehicle_make = models.CharField(max_length=100)
    vehicle_model = models.CharField(max_length=100)
    vehicle_year = models.PositiveIntegerField()
    preferred_date = models.DateField()
    preferred_branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    additional_notes = models.TextField(blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Inspection Booking'
        verbose_name_plural = 'Inspection Bookings'

    def __str__(self):
        return f'{self.name} - {self.get_inspection_type_display()} on {self.preferred_date}'