"""
Bravin Cars — Seed Data Management Command
==========================================
Usage:
    python manage.py seed_data
    python manage.py seed_data --images-dir "D:/gadaf/Documents/images/vehicle"
    python manage.py seed_data --images-dir "/path/to/images" --clear
    python manage.py seed_data --clear           # wipe existing data first
    python manage.py seed_data --no-images       # skip image assignment

What it seeds:
    - 10 Brands  (Toyota, Nissan, Subaru, BMW, Mercedes, Honda, Isuzu, Mitsubishi, Land Rover, Mazda)
    - 8  Branches (Nairobi HQ + 7 cities)
    - 60 Vehicles across all categories, brands, years, conditions
    - Vehicle images  — pulled from your local folder or downloaded from Unsplash
    - 6  Testimonials
    - 3  Newsletter subscribers (sample)
    - 1  Sample import order
    - 1  Sample commission submission
    - 1  Sample inquiry
    - 1  Sample inspection booking
    - 1  Sample career application (no CV file)

Images Strategy:
    1. If --images-dir is given, the script scans that folder for .jpg/.jpeg/.png/.webp files
       and assigns them round-robin to vehicles (3 images per vehicle).
    2. If no local images are found, it downloads 30 free car photos from Unsplash
       (requires internet connection).
    3. If --no-images flag is set, vehicles are created without images.
"""

import os
import sys
import random
import urllib.request
import urllib.error
from pathlib import Path
from io import BytesIO
from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.core.files.base import ContentFile
from django.core.files import File
from django.utils.text import slugify
from django.contrib.auth.models import User

from core.models import (
    Brand, Branch, Vehicle, VehicleImage,
    CommissionSubmission, CommissionImage,
    Inquiry, ImportOrder, CareerApplication,
    Testimonial, Newsletter, InspectionBooking,
    CarCategory, FuelType, TransmissionType,
    DriveType, CarCondition, ListingStatus, BranchCity
)


# ─── Colour palette for terminal output ──────────────────────────────────────
GREEN  = '\033[92m'
YELLOW = '\033[93m'
RED    = '\033[91m'
CYAN   = '\033[96m'
BOLD   = '\033[1m'
RESET  = '\033[0m'


def ok(msg):   print(f"  {GREEN}✔{RESET}  {msg}")
def warn(msg): print(f"  {YELLOW}⚠{RESET}  {msg}")
def err(msg):  print(f"  {RED}✘{RESET}  {msg}")
def info(msg): print(f"  {CYAN}→{RESET}  {msg}")
def head(msg): print(f"\n{BOLD}{CYAN}{msg}{RESET}")


# ─── Raw seed data ────────────────────────────────────────────────────────────

BRANDS_DATA = [
    {"name": "Toyota",       "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Nissan",       "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Subaru",       "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Mazda",        "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Honda",        "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Mitsubishi",   "country_of_origin": "Japan",        "is_popular": True},
    {"name": "Isuzu",        "country_of_origin": "Japan",        "is_popular": True},
    {"name": "BMW",          "country_of_origin": "Germany",      "is_popular": True},
    {"name": "Mercedes-Benz","country_of_origin": "Germany",      "is_popular": True},
    {"name": "Land Rover",   "country_of_origin": "United Kingdom","is_popular": True},
    {"name": "Volkswagen",   "country_of_origin": "Germany",      "is_popular": False},
    {"name": "Ford",         "country_of_origin": "USA",          "is_popular": False},
    {"name": "Hyundai",      "country_of_origin": "South Korea",  "is_popular": False},
    {"name": "Kia",          "country_of_origin": "South Korea",  "is_popular": False},
    {"name": "Suzuki",       "country_of_origin": "Japan",        "is_popular": False},
]

BRANCHES_DATA = [
    {
        "city": BranchCity.NAIROBI,
        "address": "Mombasa Road, Industrial Area, Nairobi",
        "phone": "+254 112 284 093",
        "email": "nairobi@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM | Sun: 10:00 AM – 4:00 PM",
        "is_headquarters": True,
        "manager_name": "David Mwangi",
        "google_maps_link": "https://maps.google.com/?q=Mombasa+Road+Nairobi",
    },
    {
        "city": BranchCity.MOMBASA,
        "address": "Nyali Bridge Road, Nyali, Mombasa",
        "phone": "+254 112 284 094",
        "email": "mombasa@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM",
        "is_headquarters": False,
        "manager_name": "Ali Hassan",
    },
    {
        "city": BranchCity.KISUMU,
        "address": "Oginga Odinga Street, Kisumu CBD",
        "phone": "+254 112 284 095",
        "email": "kisumu@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM",
        "is_headquarters": False,
        "manager_name": "Grace Otieno",
    },
    {
        "city": BranchCity.NAKURU,
        "address": "Kenyatta Avenue, Nakuru Town",
        "phone": "+254 112 284 096",
        "email": "nakuru@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM",
        "is_headquarters": False,
        "manager_name": "James Kamau",
    },
    {
        "city": BranchCity.ELDORET,
        "address": "Uganda Road, Eldoret Town",
        "phone": "+254 112 284 097",
        "email": "eldoret@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM",
        "is_headquarters": False,
        "manager_name": "Paul Rotich",
    },
    {
        "city": BranchCity.THIKA,
        "address": "Commercial Street, Thika Town",
        "phone": "+254 112 284 098",
        "email": "thika@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 6:00 PM",
        "is_headquarters": False,
        "manager_name": "Mary Njeri",
    },
    {
        "city": BranchCity.NYERI,
        "address": "Kimathi Way, Nyeri Town",
        "phone": "+254 112 284 099",
        "email": "nyeri@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 5:30 PM",
        "is_headquarters": False,
        "manager_name": "Peter Gatheru",
    },
    {
        "city": BranchCity.MERU,
        "address": "Moi Avenue, Meru Town",
        "phone": "+254 112 284 100",
        "email": "meru@bravincars.co.ke",
        "whatsapp": "254112284093",
        "working_hours": "Mon-Sat: 8:00 AM – 5:30 PM",
        "is_headquarters": False,
        "manager_name": "Samuel Kirimi",
    },
]

# (brand, model, category, year, condition, price_ksh, fuel, transmission, drive, engine_cc, mileage, color, seats, is_import, is_featured, description)
VEHICLES_DATA = [
    # ── Toyota ──────────────────────────────────────────────────────────────
    ("Toyota", "Land Cruiser Prado TX", CarCategory.SUV,     2021, CarCondition.FOREIGN_USED, 6_500_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 2800, 35_000,  "Pearl White",  7, True,  True,
     "Immaculate 2021 Toyota Land Cruiser Prado TX sourced from Japan. Full leather interior, sunroof, rear entertainment, cruise control, and lane departure warning. Ideal for both city commutes and off-road adventures across Kenya."),

    ("Toyota", "Hilux Double Cab",      CarCategory.PICKUP,  2020, CarCondition.FOREIGN_USED, 3_800_000, FuelType.DIESEL,  TransmissionType.MANUAL,    DriveType.FOUR_WD, 2800, 52_000,  "Silver",       5, True,  True,
     "Tough and dependable 2020 Toyota Hilux Double Cab. A favourite for contractors and farmers across Kenya. Comes with a bull bar, tow hook, and bed liner. Low mileage, single owner."),

    ("Toyota", "Corolla",               CarCategory.SEDAN,   2019, CarCondition.FOREIGN_USED, 1_650_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     1800, 48_000,  "Black",        5, True,  False,
     "Clean 2019 Toyota Corolla with full service history. Economical, comfortable, and easy to drive. Perfect daily car for Nairobi traffic. Keyless entry, reverse camera, automatic climate control."),

    ("Toyota", "RAV4",                  CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 4_200_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2500, 40_000,  "Blue",         5, True,  True,
     "Sporty 2020 Toyota RAV4 in stunning blue. AWD system, 7-inch touchscreen, Apple CarPlay, adaptive cruise control, and automatic high beams. Excellent condition, full Toyota service history."),

    ("Toyota", "Vitz",                  CarCategory.HATCHBACK,2018, CarCondition.FOREIGN_USED,  850_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     1000, 62_000,  "Red",          5, True,  False,
     "Cute and fuel-efficient 2018 Toyota Vitz. Ideal for a first car or city runabout. Great fuel economy, easy parking, and very reliable. Full service history from Japan."),

    ("Toyota", "Fortuner",              CarCategory.SUV,     2022, CarCondition.FOREIGN_USED, 7_200_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 2800, 18_000,  "Graphite",     7, True,  True,
     "Premium 2022 Toyota Fortuner 2.8 GD-6. Barely used, full leather, 18-inch alloys, electronic diff lock, and terrain management system. The ultimate family SUV."),

    ("Toyota", "Camry",                 CarCategory.SEDAN,   2020, CarCondition.FOREIGN_USED, 3_100_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     2500, 29_000,  "White",        5, True,  False,
     "Sophisticated 2020 Toyota Camry 2.5. Premium build quality, 9-inch infotainment, wireless charging, ambient lighting, and JBL sound system. Ideal for the executive looking for comfort."),

    ("Toyota", "Probox",                CarCategory.WAGON,   2016, CarCondition.LOCAL_USED,    680_000, FuelType.PETROL,  TransmissionType.MANUAL,    DriveType.FWD,     1500, 128_000, "White",        5, False, False,
     "Reliable 2016 Toyota Probox. A workhorse that just keeps going. Great for business deliveries. Recently serviced, new tyres, clean body."),

    # ── Nissan ──────────────────────────────────────────────────────────────
    ("Nissan", "X-Trail",               CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 2_950_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     2000, 45_000,  "White",        7, True,  True,
     "Stylish 2019 Nissan X-Trail 7-seater. Panoramic sunroof, around-view monitor, ProPilot assist, and third-row seats that fold flat for extra cargo space."),

    ("Nissan", "Note",                  CarCategory.HATCHBACK,2018, CarCondition.FOREIGN_USED,  920_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.FWD,     1200, 55_000,  "Silver",       5, True,  False,
     "Fuel-saving 2018 Nissan Note e-POWER hybrid technology. Ultra-quiet ride, smooth acceleration, and remarkably low fuel consumption — great for Nairobi's stop-and-go traffic."),

    ("Nissan", "Navara",                CarCategory.PICKUP,  2020, CarCondition.FOREIGN_USED, 3_650_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 2300, 44_000,  "Gun Metal",    5, True,  False,
     "Powerful 2020 Nissan Navara 2.3 Turbo Diesel. King cab with king bed. Intelligent 4WD, electronic locking diff, and 1-tonne payload. Perfect for Kenyan terrain."),

    ("Nissan", "Patrol",                CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 9_500_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 5600, 32_000,  "White",        8, True,  True,
     "Legendary 2019 Nissan Patrol Y62. V8 5.6L, 7-8 seats, hydraulic body motion control, Bose audio, and captain chairs. The pinnacle of full-size luxury SUVs."),

    # ── Subaru ──────────────────────────────────────────────────────────────
    ("Subaru", "Forester",              CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 2_450_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     2000, 50_000,  "Crystal Black",5, True,  False,
     "Dependable 2019 Subaru Forester with full Symmetrical AWD. EyeSight driver assist technology, panoramic sunroof, and excellent ground clearance. A proven performer on Kenya's roads."),

    ("Subaru", "Outback",               CarCategory.WAGON,   2018, CarCondition.FOREIGN_USED, 2_100_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     2500, 68_000,  "Dark Green",   5, True,  False,
     "Versatile 2018 Subaru Outback. Wagon comfort meets SUV capability. Symmetrical AWD, 213mm ground clearance, and Harman Kardon audio. Perfect for weekend adventures."),

    ("Subaru", "Impreza",               CarCategory.SEDAN,   2017, CarCondition.LOCAL_USED,  1_100_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2000, 95_000,  "Blue",         5, False, False,
     "Sporty 2017 Subaru Impreza. Full-time AWD, turbocharged engine, sport suspension. Has been well-maintained with regular servicing. New tyres and freshly detailed."),

    # ── Mazda ───────────────────────────────────────────────────────────────
    ("Mazda", "CX-5",                   CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 3_400_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2200, 32_000,  "Soul Red",     5, True,  True,
     "Stunning 2020 Mazda CX-5 in exclusive Soul Red Crystal. KODO design, Bose 10-speaker audio, i-Activsense safety suite, heated front seats, and head-up display. Arguably the best-looking SUV in its class."),

    ("Mazda", "Demio",                  CarCategory.HATCHBACK,2018, CarCondition.FOREIGN_USED,  870_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     1300, 48_000,  "White",        5, True,  False,
     "Nimble 2018 Mazda Demio. Fun to drive, excellent fuel economy, and very practical. Perfect for city driving. Clean interior with touch screen and Bluetooth."),

    ("Mazda", "Atenza",                 CarCategory.SEDAN,   2018, CarCondition.FOREIGN_USED, 2_250_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     2500, 55_000,  "Titanium Flash",5,True,  False,
     "Executive 2018 Mazda Atenza (6). 2.5L SkyActiv engine, BOSE audio, i-Activsense, ventilated front seats, and a stunning interior. Drives like a luxury car at a fraction of the price."),

    # ── Honda ───────────────────────────────────────────────────────────────
    ("Honda", "CR-V",                   CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 3_750_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     1500, 38_000,  "Lunar Silver", 5, True,  False,
     "Refined 2020 Honda CR-V 1.5 Turbo. Honda Sensing safety system, panoramic sunroof, and hands-free power tailgate. Excellent blend of practicality and technology."),

    ("Honda", "Fit",                    CarCategory.HATCHBACK,2017, CarCondition.FOREIGN_USED,  790_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.FWD,     1300, 70_000,  "Red",          5, True,  False,
     "Practical 2017 Honda Fit Hybrid. Surprisingly spacious interior with magic seats. Great fuel economy for daily commuting. In excellent condition with clean interior."),

    ("Honda", "Vezel",                  CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 2_300_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.FWD,     1500, 44_000,  "White",        5, True,  True,
     "Modern 2019 Honda Vezel Hybrid. Sleek crossover design, Honda Sensing, LED headlights, and 7-inch touchscreen with Apple CarPlay. Very popular and in high demand."),

    # ── Mitsubishi ──────────────────────────────────────────────────────────
    ("Mitsubishi", "Pajero",            CarCategory.SUV,     2018, CarCondition.FOREIGN_USED, 3_900_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 3200, 58_000,  "Dark Blue",    7, True,  False,
     "Legendary 2018 Mitsubishi Pajero 3.2 DID. Super Select 4WD with low-range, multi-terrain select, and Rockford Fosgate audio. A true go-anywhere 7-seater."),

    ("Mitsubishi", "Outlander",         CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 2_600_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     2400, 46_000,  "White",        7, True,  False,
     "Spacious 2019 Mitsubishi Outlander 7-seater. S-AWC all-wheel control, 8-inch touchscreen, forward collision mitigation, and heated steering wheel. Great family SUV."),

    ("Mitsubishi", "L200 Triton",       CarCategory.PICKUP,  2020, CarCondition.FOREIGN_USED, 3_500_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 2400, 40_000,  "Red",          5, True,  True,
     "Commanding 2020 Mitsubishi L200 Triton. 2.4 MIVEC diesel, Super Select 4WD II, active stability control, and a 1-tonne payload. One of the most capable pickups in Kenya."),

    # ── Isuzu ───────────────────────────────────────────────────────────────
    ("Isuzu", "D-Max",                  CarCategory.PICKUP,  2021, CarCondition.FOREIGN_USED, 4_100_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 3000, 22_000,  "White",        5, True,  True,
     "Premium 2021 Isuzu D-Max LS. 3.0 BluePower turbo diesel, Terrain Command 4WD, 360 around view camera, and front & rear differential locks. The definitive Kenyan workhorse."),

    ("Isuzu", "MU-X",                   CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 4_800_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 3000, 35_000,  "Silver",       7, True,  False,
     "Impressive 2020 Isuzu MU-X 7-seater. Built on the D-Max platform for serious off-road capability. Full leather, 9-inch touchscreen, Apple CarPlay, and rear camera."),

    ("Isuzu", "NPS 75-55",              CarCategory.LORRY,   2019, CarCondition.LOCAL_USED,  4_500_000, FuelType.DIESEL,  TransmissionType.MANUAL,    DriveType.FOUR_WD, 5200, 112_000, "White",        3, False, False,
     "Heavy-duty 2019 Isuzu NPS 75-55. 4x4 tipper truck, ideal for construction and mining. Low mileage for its class. Well-maintained with documented service history."),

    # ── BMW ─────────────────────────────────────────────────────────────────
    ("BMW", "X5 xDrive30d",             CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 8_900_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     3000, 28_000,  "Black Sapphire",5,True,  True,
     "Commanding 2020 BMW X5 xDrive30d. M Sport package, 21-inch alloys, panoramic sunroof, Harman Kardon audio, Head-Up Display, and laser headlights. The benchmark for luxury SUVs."),

    ("BMW", "3 Series 320i",            CarCategory.SEDAN,   2021, CarCondition.FOREIGN_USED, 5_800_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.RWD,     2000, 18_000,  "Alpine White", 5, True,  True,
     "Stunning 2021 BMW 320i M Sport. 2.0L TwinPower Turbo, adaptive M suspension, M sport brakes, live cockpit professional, and wireless phone charging. The ultimate driving machine."),

    ("BMW", "X3 xDrive20d",             CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 5_200_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2000, 42_000,  "Phytonic Blue", 5, True, False,
     "Sporty 2019 BMW X3 xDrive20d M Sport. Adaptive suspension, Park Assist, panoramic roof, and the latest iDrive 7 infotainment. A perfect blend of performance and luxury."),

    # ── Mercedes-Benz ────────────────────────────────────────────────────────
    ("Mercedes-Benz", "GLE 350d",       CarCategory.SUV,     2020, CarCondition.FOREIGN_USED,12_500_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     3000, 25_000,  "Obsidian Black",7,True,  True,
     "Majestic 2020 Mercedes-Benz GLE 350d 4MATIC. E-Active Body Control air suspension, Burmester 3D audio, widescreen cockpit, ambient lighting in 64 colours, and MBUX voice control. Pure luxury."),

    ("Mercedes-Benz", "C200",           CarCategory.SEDAN,   2019, CarCondition.FOREIGN_USED, 4_900_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.RWD,     1500, 38_000,  "Iridium Silver",5,True,  False,
     "Elegant 2019 Mercedes-Benz C200 AMG Line. 1.5L EQ Boost, 64-colour ambient lighting, Burmester audio, MBUX with augmented reality navigation, and heads-up display."),

    ("Mercedes-Benz", "G63 AMG",        CarCategory.SUV,     2021, CarCondition.FOREIGN_USED,32_000_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 4000, 8_000,   "Designo Night Black",5,True,True,
     "Iconic 2021 Mercedes-AMG G63. Handcrafted 4.0L V8 Biturbo, 3 locking differentials, AMG RIDE CONTROL, and an unmistakably commanding presence. The ultimate statement of power and prestige in Kenya."),

    # ── Land Rover ──────────────────────────────────────────────────────────
    ("Land Rover", "Defender 110",      CarCategory.SUV,     2022, CarCondition.FOREIGN_USED,14_000_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 3000, 12_000,  "Gondwana Stone",5,True, True,
     "All-new 2022 Land Rover Defender 110. Terrain Response 2, air suspension, Wade sensing (900mm wading depth), ClearSight Ground View, and Pivi Pro infotainment. Redefining adventure."),

    ("Land Rover", "Discovery Sport",   CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 6_800_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2000, 30_000,  "Fuji White",   7, True,  False,
     "Refined 2020 Land Rover Discovery Sport SE R-Dynamic. 7 seats, Terrain Response, Pivi Pro, ClearSight rear view mirror, and adaptive dynamics. The ideal family adventure vehicle."),

    ("Land Rover", "Range Rover Sport", CarCategory.SUV,     2020, CarCondition.FOREIGN_USED,16_000_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     3000, 22_000,  "Santorini Black",5,True,True,
     "Breathtaking 2020 Range Rover Sport HSE Dynamic. Electronic air suspension, Meridian surround sound, head-up display, Wade sensing, and dynamic response. True luxury meets true off-road ability."),

    # ── Electric / Hybrid ────────────────────────────────────────────────────
    ("Toyota", "Prius",                 CarCategory.HYBRID,  2019, CarCondition.FOREIGN_USED, 1_850_000, FuelType.HYBRID,  TransmissionType.CVT,       DriveType.FWD,     1800, 42_000,  "Silver",       5, True,  False,
     "Eco-friendly 2019 Toyota Prius Hybrid. Class-leading fuel economy, Toyota Safety Sense, LED headlights, and 11.6-inch touch screen. Lowest running costs of any car on the Kenyan market."),

    ("Honda", "Insight",                CarCategory.HYBRID,  2020, CarCondition.FOREIGN_USED, 2_100_000, FuelType.HYBRID,  TransmissionType.CVT,       DriveType.FWD,     1500, 35_000,  "Lunar Silver", 5, True,  False,
     "Sleek 2020 Honda Insight hybrid sedan. Two-motor hybrid system, Honda Sensing, heated front seats, and wireless charging. Incredibly quiet and smooth — perfect for executive use."),

    ("Nissan", "Leaf",                  CarCategory.ELECTRIC,2020, CarCondition.FOREIGN_USED, 2_600_000, FuelType.ELECTRIC,TransmissionType.AUTOMATIC, DriveType.FWD,     None,  38_000,  "Gun Metallic", 5, True,  False,
     "2020 Nissan Leaf 40kWh electric. 270km range per charge, ProPilot driver assist, e-Pedal one-pedal driving, and Bose audio. Zero fuel costs — perfect for Nairobi's growing charging network."),

    # ── Vans / Minivans ──────────────────────────────────────────────────────
    ("Toyota", "Noah",                  CarCategory.MINIVAN, 2018, CarCondition.FOREIGN_USED, 2_200_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     2000, 65_000,  "Pearl White",  8, True,  False,
     "Versatile 2018 Toyota Noah hybrid. 8-seater with sliding rear doors, captain seats for row 2, and flat-fold third row. Great for families and airport transfers."),

    ("Nissan", "Serena",                CarCategory.MINIVAN, 2019, CarCondition.FOREIGN_USED, 2_450_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.FWD,     2000, 52_000,  "White",        8, True,  False,
     "Roomy 2019 Nissan Serena e-POWER. 8 seats, ProPilot highway assist, intelligent around view monitor, and hands-free sliding doors. Ideal for school runs and large families."),

    ("Toyota", "HiAce",                 CarCategory.VAN,     2020, CarCondition.FOREIGN_USED, 4_300_000, FuelType.DIESEL,  TransmissionType.MANUAL,    DriveType.RWD,     2800, 55_000,  "White",       14, True,  False,
     "2020 Toyota HiAce 14-seater matatu-ready. Turbo diesel, durable and proven in Kenyan conditions. Used as a school bus and sacco shuttle. Excellent earnings potential."),

    # ── Coupes / Sports ──────────────────────────────────────────────────────
    ("Mazda", "MX-5 Miata",             CarCategory.CONVERTIBLE,2018,CarCondition.FOREIGN_USED,2_800_000,FuelType.PETROL, TransmissionType.MANUAL,    DriveType.RWD,     2000, 28_000,  "Machine Grey", 2, True,  False,
     "Exciting 2018 Mazda MX-5 Miata. Pure roadster driving experience, retractable soft-top, 2.0L SkyActiv-G, and Bilstein shock absorbers. The most fun you can have on four wheels."),

    ("BMW", "4 Series Coupe",           CarCategory.COUPE,   2020, CarCondition.FOREIGN_USED, 7_500_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.RWD,     2000, 21_000,  "Portimao Blue",4, True,  True,
     "Head-turning 2020 BMW 420i Gran Coupe M Sport. Frameless doors, 19-inch alloys, ambient lighting, and live cockpit professional with 10.25-inch screens. Arrives to impress."),

    # ── Additional Locals / Budget ───────────────────────────────────────────
    ("Volkswagen", "Golf",              CarCategory.HATCHBACK,2017, CarCondition.FOREIGN_USED, 1_450_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     1400, 72_000,  "Reflex Silver",5, True,  False,
     "Premium 2017 Volkswagen Golf 1.4 TSI. DSG gearbox, App-Connect, adaptive cruise control, and park assist. German engineering at an accessible price point."),

    ("Hyundai", "Tucson",               CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 2_800_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.AWD,     1600, 48_000,  "Phantom Black",5, True,  False,
     "Modern 2019 Hyundai Tucson 1.6 Turbo. BlueLink connectivity, wireless charging, heated and ventilated seats, 8-inch touchscreen. Great value premium SUV."),

    ("Kia", "Sportage",                 CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 2_650_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.AWD,     1600, 42_000,  "Snow White",   5, True,  False,
     "Attractive 2020 Kia Sportage GT Line. 10.25-inch digital cluster, Meridian audio, surround view monitor, and smart power tailgate. 7-year manufacturer warranty still valid."),

    ("Suzuki", "Jimny",                 CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 2_100_000, FuelType.PETROL,  TransmissionType.MANUAL,    DriveType.FOUR_WD, 1500, 30_000,  "Jungle Green", 4, True,  True,
     "Iconic 2020 Suzuki Jimny — the go-anywhere compact 4x4. Ladder frame chassis, low-range gearbox, and Allgrip Pro 4WD. Fits anywhere in Nairobi yet conquers any terrain."),

    ("Ford", "Ranger Wildtrak",         CarCategory.PICKUP,  2020, CarCondition.FOREIGN_USED, 3_900_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 2000, 44_000,  "Race Red",     5, True,  False,
     "Tough 2020 Ford Ranger Wildtrak. 2.0L EcoBlue Bi-Turbo diesel, Trail Control (off-road cruise), FX4 off-road package, and Ford SYNC 3 infotainment. Looks as capable as it performs."),

    ("Mitsubishi", "Eclipse Cross",     CarCategory.SUV,     2020, CarCondition.FOREIGN_USED, 2_900_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     1500, 37_000,  "White Diamond",5, True,  False,
     "Stylish 2020 Mitsubishi Eclipse Cross 1.5T. Unique fastback coupe-SUV design, Super All Wheel Control, 8-inch touchscreen, and forward collision mitigation. Stands out from the crowd."),

    ("Toyota", "Land Cruiser 200",      CarCategory.SUV,     2018, CarCondition.FOREIGN_USED,11_500_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.FOUR_WD, 4500, 68_000,  "Super White",  8, True,  True,
     "Bulletproof 2018 Toyota Land Cruiser 200 Series. 4.5L V8 turbo diesel, Kinetic Dynamic Suspension System, 8-seater, multi-terrain select, and crawl control. The undisputed king of Kenyan roads."),

    ("Mercedes-Benz", "Sprinter 516",   CarCategory.VAN,     2019, CarCondition.FOREIGN_USED, 6_200_000, FuelType.DIESEL,  TransmissionType.MANUAL,    DriveType.RWD,     2200, 88_000,  "White",       19, True,  False,
     "Reliable 2019 Mercedes-Benz Sprinter 516 CDI. 19-seater corporate shuttle configuration, high-roof, air conditioning, and reclining seats. Ideal for hotel transfers and corporate transport."),

    ("Nissan", "Tiida",                 CarCategory.SEDAN,   2015, CarCondition.LOCAL_USED,    720_000, FuelType.PETROL,  TransmissionType.AUTOMATIC, DriveType.FWD,     1500, 105_000, "Silver",       5, False, False,
     "Practical 2015 Nissan Tiida. Clean locally used car, recently serviced, new brake pads, and freshly detailed. Ideal budget sedan for a first-time buyer."),

    ("Subaru", "Legacy",                CarCategory.SEDAN,   2017, CarCondition.LOCAL_USED,  1_300_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.AWD,     2500, 88_000,  "Dark Silver",  5, False, False,
     "2017 Subaru Legacy 2.5i. All-wheel drive, EyeSight driver assist, Harman Kardon audio, and power driver seat. Fully serviced and ready for the road."),

    ("Toyota", "Sienta",                CarCategory.MINIVAN, 2018, CarCondition.FOREIGN_USED, 1_600_000, FuelType.PETROL,  TransmissionType.CVT,       DriveType.FWD,     1500, 58_000,  "White",        7, True,  False,
     "Compact 2018 Toyota Sienta Hybrid 7-seater. Sliding rear doors, fold-flat second and third rows, hybrid fuel economy, and Toyota Safety Sense. Perfect for the family that needs space without the bulk."),

    ("Honda", "CRZ",                    CarCategory.COUPE,   2016, CarCondition.FOREIGN_USED, 1_200_000, FuelType.HYBRID,  TransmissionType.MANUAL,    DriveType.FWD,     1500, 72_000,  "Polished Metal",2,True, False,
     "Sporty 2016 Honda CR-Z Sport Hybrid coupe. 6-speed manual with paddle shifters, sports suspension, and Honda's Integrated Motor Assist. A unique mix of sporty driving and hybrid efficiency."),

    ("BMW", "X1 xDrive18d",             CarCategory.SUV,     2019, CarCondition.FOREIGN_USED, 4_400_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2000, 38_000,  "Mineral White",5, True,  False,
     "Entry luxury 2019 BMW X1 xDrive18d. M Sport package, 8.8-inch iDrive display, panoramic sunroof, parking assistant, and rear camera. Premium feel without the premium price tag."),

    ("Land Rover", "Freelander 2",      CarCategory.SUV,     2015, CarCondition.LOCAL_USED,  2_200_000, FuelType.DIESEL,  TransmissionType.AUTOMATIC, DriveType.AWD,     2200, 110_000, "Causeway Grey",5, False, False,
     "Classic Land Rover Freelander 2 TD4. Dynamic Stability Control with Off-road ABS and Hill Descent Control. Well-maintained by a single owner with full service history at an authorised dealer."),
]


TESTIMONIALS_DATA = [
    {
        "name": "Kevin Ochieng",
        "location": "Nairobi",
        "message": "Bought a Toyota Land Cruiser Prado from Bravin Cars last month. The entire process was smooth, the car was exactly as described, and they handled all the paperwork. Highly recommend!",
        "rating": 5,
    },
    {
        "name": "Amina Hassan",
        "location": "Mombasa",
        "message": "I imported a BMW X5 through Bravin Cars from Germany. Their import team was professional, kept me updated every step of the way, and the car arrived in perfect condition. Outstanding service.",
        "rating": 5,
    },
    {
        "name": "Peter Gatheru",
        "location": "Nakuru",
        "message": "Sold my old Subaru through Bravin Cars' commission program. They listed it, handled all the buyers, and I had my money within 3 weeks. Very fair and honest team.",
        "rating": 5,
    },
    {
        "name": "Grace Wambui",
        "location": "Kisumu",
        "message": "Pre-purchase inspection service is top notch. They found hidden issues on a car I was about to buy from a private seller. Saved me a lot of money. Worth every shilling!",
        "rating": 5,
    },
    {
        "name": "Daniel Rotich",
        "location": "Eldoret",
        "message": "Great selection of pickups at the Eldoret branch. The staff were patient and knowledgeable. Got a great deal on an Isuzu D-Max. Will definitely come back.",
        "rating": 4,
    },
    {
        "name": "Susan Njoroge",
        "location": "Thika",
        "message": "Bravin Cars made buying my first car stress-free. I just WhatsApp'd them, they found me the perfect Mazda Demio within my budget, and sorted the transfer in two days!",
        "rating": 5,
    },
]


# ─── Unsplash free car image URLs (no API key needed) ────────────────────────
# Using Unsplash Source API — each URL returns a random car image at given size
UNSPLASH_CAR_URLS = [
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80",
    "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    "https://images.unsplash.com/photo-1627454820516-c0e7fcfb1d8a?w=800&q=80",
    "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    "https://images.unsplash.com/photo-1571987502951-3ad7f776c66e?w=800&q=80",
    "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&q=80",
    "https://images.unsplash.com/photo-1635070040987-1a49d9a66ce0?w=800&q=80",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
    "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80",
    "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&q=80",
    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80",
    "https://images.unsplash.com/photo-1608891750954-97a285b23640?w=800&q=80",
    "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&q=80",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
]


# ─── Command ──────────────────────────────────────────────────────────────────

class Command(BaseCommand):
    help = "Seed the Bravin Cars database with brands, branches, vehicles, testimonials, and sample records."

    def add_arguments(self, parser):
        parser.add_argument(
            "--images-dir",
            type=str,
            default=None,
            help=(
                "Path to a local folder containing vehicle images "
                r"(e.g. D:\gadaf\Documents\images\vehicle). "
                "Images are assigned round-robin to vehicles (3 per vehicle)."
            ),
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            default=False,
            help="Delete all existing vehicle, brand, and branch data before seeding.",
        )
        parser.add_argument(
            "--no-images",
            action="store_true",
            default=False,
            help="Skip image assignment entirely.",
        )
        parser.add_argument(
            "--images-per-vehicle",
            type=int,
            default=3,
            help="Number of images to assign per vehicle (default: 3).",
        )

    # ── Main handle ───────────────────────────────────────────────────────────
    def handle(self, *args, **options):
        self.stdout.write(f"\n{BOLD}{'='*60}{RESET}")
        self.stdout.write(f"{BOLD}  🚗  BRAVIN CARS — DATABASE SEEDER{RESET}")
        self.stdout.write(f"{BOLD}{'='*60}{RESET}\n")

        images_dir     = options["images_dir"]
        do_clear       = options["clear"]
        skip_images    = options["no_images"]
        imgs_per_vehicle = options["images_per_vehicle"]

        # ── Optional wipe ────────────────────────────────────────────────────
        if do_clear:
            head("CLEARING EXISTING DATA")
            self._clear_data()

        # ── Brands ───────────────────────────────────────────────────────────
        head("SEEDING BRANDS")
        brand_map = self._seed_brands()

        # ── Branches ─────────────────────────────────────────────────────────
        head("SEEDING BRANCHES")
        branch_list = self._seed_branches()

        # ── Vehicles ─────────────────────────────────────────────────────────
        head("SEEDING VEHICLES")
        vehicles = self._seed_vehicles(brand_map, branch_list)

        # ── Images ───────────────────────────────────────────────────────────
        if not skip_images:
            head("ASSIGNING VEHICLE IMAGES")
            self._assign_images(vehicles, images_dir, imgs_per_vehicle)
        else:
            warn("Skipping image assignment (--no-images flag set).")

        # ── Testimonials ─────────────────────────────────────────────────────
        head("SEEDING TESTIMONIALS")
        self._seed_testimonials()

        # ── Misc sample records ───────────────────────────────────────────────
        head("SEEDING SAMPLE RECORDS")
        self._seed_sample_records(branch_list, vehicles)

        # ── Done ──────────────────────────────────────────────────────────────
        self.stdout.write(f"\n{BOLD}{GREEN}{'='*60}{RESET}")
        self.stdout.write(f"{BOLD}{GREEN}  ✔  SEEDING COMPLETE!{RESET}")
        self.stdout.write(f"{BOLD}{GREEN}{'='*60}{RESET}")
        self.stdout.write(f"\n  Brands    : {Brand.objects.count()}")
        self.stdout.write(f"  Branches  : {Branch.objects.count()}")
        self.stdout.write(f"  Vehicles  : {Vehicle.objects.count()}")
        self.stdout.write(f"  Images    : {VehicleImage.objects.count()}")
        self.stdout.write(f"  Testimonials: {Testimonial.objects.count()}")
        self.stdout.write(f"\n  Django Admin : http://localhost:8000/admin/")
        self.stdout.write(f"  API Root     : http://localhost:8000/api/\n")

    # ── Clear ─────────────────────────────────────────────────────────────────
    def _clear_data(self):
        models_to_clear = [
            VehicleImage, Vehicle, CommissionImage, CommissionSubmission,
            Inquiry, ImportOrder, InspectionBooking, Testimonial,
            Newsletter, Brand, Branch,
        ]
        for model in models_to_clear:
            count = model.objects.count()
            model.objects.all().delete()
            ok(f"Deleted {count} {model.__name__} records")

    # ── Brands ────────────────────────────────────────────────────────────────
    def _seed_brands(self):
        brand_map = {}
        for data in BRANDS_DATA:
            brand, created = Brand.objects.get_or_create(
                name=data["name"],
                defaults={
                    "slug": slugify(data["name"]),
                    "country_of_origin": data["country_of_origin"],
                    "is_popular": data["is_popular"],
                }
            )
            brand_map[data["name"]] = brand
            status = "Created" if created else "Exists"
            ok(f"{status}: {brand.name} ({brand.country_of_origin})")
        return brand_map

    # ── Branches ──────────────────────────────────────────────────────────────
    def _seed_branches(self):
        branch_list = []
        for data in BRANCHES_DATA:
            branch, created = Branch.objects.get_or_create(
                city=data["city"],
                defaults={k: v for k, v in data.items() if k != "city"}
            )
            branch_list.append(branch)
            hq = " (HQ)" if data.get("is_headquarters") else ""
            status = "Created" if created else "Exists"
            ok(f"{status}: {branch.city}{hq} — {data['address'][:40]}")
        return branch_list

    # ── Vehicles ──────────────────────────────────────────────────────────────
    def _seed_vehicles(self, brand_map, branch_list):
        vehicles = []
        for idx, row in enumerate(VEHICLES_DATA):
            (
                brand_name, model, category, year, condition,
                price, fuel, transmission, drive, engine_cc,
                mileage, color, seats, is_import, is_featured, description
            ) = row

            brand = brand_map.get(brand_name)
            if not brand:
                warn(f"Brand not found: {brand_name} — skipping {model}")
                continue

            branch = branch_list[idx % len(branch_list)]
            title  = f"{year} {brand_name} {model}"
            slug   = slugify(f"{year}-{brand_name}-{model}-{condition}")

            # Ensure slug uniqueness
            base_slug, counter = slug, 1
            while Vehicle.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            vehicle, created = Vehicle.objects.get_or_create(
                slug=slug,
                defaults={
                    "title":        title,
                    "brand":        brand,
                    "model":        model,
                    "category":     category,
                    "year":         year,
                    "condition":    condition,
                    "price_ksh":    Decimal(str(price)),
                    "fuel_type":    fuel,
                    "transmission": transmission,
                    "drive_type":   drive,
                    "engine_cc":    engine_cc,
                    "mileage_km":   mileage,
                    "color":        color,
                    "seats":        seats,
                    "is_import":    is_import,
                    "is_featured":  is_featured,
                    "is_negotiable":True,
                    "status":       ListingStatus.ACTIVE,
                    "description":  description,
                    "branch":       branch,
                    "features":     self._random_features(),
                }
            )
            vehicles.append(vehicle)
            action = "✔ Created" if created else "  Exists "
            price_str = f"KES {price:>12,}"
            info(f"{action}: [{category:12}] {title:45} {price_str}")

        ok(f"Total vehicles in DB: {Vehicle.objects.count()}")
        return vehicles

    def _random_features(self):
        pool = [
            "Reverse Camera", "Parking Sensors", "Sunroof", "Leather Seats",
            "Heated Seats", "Ventilated Seats", "Apple CarPlay", "Android Auto",
            "Bluetooth", "Cruise Control", "Lane Departure Warning",
            "Forward Collision Warning", "Blind Spot Monitor", "Keyless Entry",
            "Push Start", "Alloy Wheels", "LED Headlights", "Fog Lights",
            "Dual Airbags", "Side Airbags", "Curtain Airbags", "ABS",
            "Stability Control", "Hill Start Assist", "Wireless Charging",
            "Heads Up Display", "Ambient Lighting", "Power Tailgate",
            "Memory Seats", "Auto-Dimming Mirror",
        ]
        return ", ".join(random.sample(pool, random.randint(6, 12)))

    # ── Images ────────────────────────────────────────────────────────────────
    def _assign_images(self, vehicles, images_dir, imgs_per_vehicle):
        local_files = self._collect_local_images(images_dir)

        if local_files:
            info(f"Using {len(local_files)} local image(s) from: {images_dir}")
            self._assign_local_images(vehicles, local_files, imgs_per_vehicle)
        else:
            warn("No local images found. Downloading from Unsplash (requires internet)...")
            self._assign_downloaded_images(vehicles, imgs_per_vehicle)

    def _collect_local_images(self, images_dir):
        if not images_dir:
            return []
        path = Path(images_dir)
        if not path.exists():
            warn(f"Images directory not found: {images_dir}")
            return []
        extensions = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG"}
        files = [f for f in path.iterdir() if f.is_file() and f.suffix in extensions]
        files.sort()
        info(f"Found {len(files)} image file(s) in {images_dir}")
        return files

    def _assign_local_images(self, vehicles, local_files, imgs_per_vehicle):
        assigned = 0
        for v_idx, vehicle in enumerate(vehicles):
            if VehicleImage.objects.filter(vehicle=vehicle).exists():
                info(f"  Already has images: {vehicle.title[:40]}")
                continue

            for i in range(imgs_per_vehicle):
                file_path = local_files[(v_idx * imgs_per_vehicle + i) % len(local_files)]
                try:
                    with open(file_path, "rb") as f:
                        filename = f"{slugify(vehicle.title)}-{i+1}{file_path.suffix}"
                        img = VehicleImage(
                            vehicle=vehicle,
                            is_primary=(i == 0),
                            order=i,
                            caption=f"{vehicle.title} — view {i+1}"
                        )
                        img.image.save(filename, File(f), save=True)
                        assigned += 1
                except Exception as exc:
                    warn(f"  Failed to attach {file_path.name}: {exc}")

            ok(f"  Imaged: {vehicle.title[:50]}")
        ok(f"Total images assigned: {assigned}")

    def _assign_downloaded_images(self, vehicles, imgs_per_vehicle):
        """Download car images from Unsplash and assign to vehicles."""
        # Cache downloaded bytes so we don't re-download the same URL
        cache = {}
        assigned = 0
        url_pool = UNSPLASH_CAR_URLS * 10   # repeat pool so it never runs out

        for v_idx, vehicle in enumerate(vehicles):
            if VehicleImage.objects.filter(vehicle=vehicle).exists():
                info(f"  Already has images: {vehicle.title[:40]}")
                continue

            for i in range(imgs_per_vehicle):
                url = url_pool[(v_idx * imgs_per_vehicle + i) % len(url_pool)]
                try:
                    if url not in cache:
                        info(f"  Downloading: {url[:70]}")
                        req = urllib.request.Request(url, headers={"User-Agent": "BravinCars/1.0"})
                        with urllib.request.urlopen(req, timeout=15) as resp:
                            cache[url] = resp.read()

                    data = cache[url]
                    filename = f"{slugify(vehicle.title)}-{i+1}.jpg"
                    img = VehicleImage(
                        vehicle=vehicle,
                        is_primary=(i == 0),
                        order=i,
                        caption=f"{vehicle.title} — view {i+1}"
                    )
                    img.image.save(filename, ContentFile(data), save=True)
                    assigned += 1

                except urllib.error.URLError as exc:
                    warn(f"  Network error for {vehicle.title[:30]}: {exc}")
                except Exception as exc:
                    warn(f"  Image error for {vehicle.title[:30]}: {exc}")

            ok(f"  Imaged: {vehicle.title[:50]}")

        ok(f"Total images downloaded & assigned: {assigned}")

    # ── Testimonials ──────────────────────────────────────────────────────────
    def _seed_testimonials(self):
        for data in TESTIMONIALS_DATA:
            t, created = Testimonial.objects.get_or_create(
                name=data["name"],
                defaults={
                    "location":   data["location"],
                    "message":    data["message"],
                    "rating":     data["rating"],
                    "is_approved": True,
                }
            )
            status = "Created" if created else "Exists"
            ok(f"{status}: {t.name} ({t.location}) — {t.rating}★")

    # ── Sample misc records ───────────────────────────────────────────────────
    def _seed_sample_records(self, branch_list, vehicles):
        hq = next((b for b in branch_list if b.is_headquarters), branch_list[0])

        # Newsletter subscribers
        for email in ["demo@bravincars.co.ke", "test@gmail.com", "customer@outlook.com"]:
            obj, created = Newsletter.objects.get_or_create(email=email)
            if created:
                ok(f"Newsletter: {email}")

        # Sample inquiry
        vehicle = vehicles[0] if vehicles else None
        inq, created = Inquiry.objects.get_or_create(
            email="demo.buyer@gmail.com",
            defaults={
                "vehicle":          vehicle,
                "name":             "Demo Buyer",
                "phone":            "0712000001",
                "message":          f"Hi, I'm interested in the {vehicle.title if vehicle else 'car'}. Is it still available?",
                "preferred_contact":"whatsapp",
                "branch":           hq,
            }
        )
        if created:
            ok(f"Sample inquiry: {inq.name} → {vehicle.title if vehicle else '—'}")

        # Sample import order
        imp, created = ImportOrder.objects.get_or_create(
            email="importer@gmail.com",
            defaults={
                "name":             "John Import",
                "phone":            "0722000001",
                "brand":            "Toyota",
                "model":            "Land Cruiser Prado",
                "year_from":        2020,
                "year_to":          2022,
                "budget_ksh":       Decimal("7000000"),
                "preferred_source": "japan",
                "specifications":   "TX-L Grade, Sunroof, White or Black, under 30,000 km",
            }
        )
        if created:
            ok(f"Sample import order: {imp.name} — {imp.brand} {imp.model}")

        # Sample commission submission
        com, created = CommissionSubmission.objects.get_or_create(
            seller_email="seller@gmail.com",
            defaults={
                "seller_name":     "Jane Seller",
                "seller_phone":    "0733000001",
                "seller_location": "Nairobi, Karen",
                "brand":           "Subaru",
                "model":           "Forester",
                "year":            2017,
                "asking_price_ksh":Decimal("2100000"),
                "condition":       CarCondition.LOCAL_USED,
                "mileage_km":      92000,
                "description":     "Well-maintained Subaru Forester. AWD, no accidents, full service history. Selling because upgrading to a newer model.",
            }
        )
        if created:
            ok(f"Sample commission: {com.seller_name} — {com.year} {com.brand} {com.model}")

        # Sample inspection booking
        import datetime
        bk, created = InspectionBooking.objects.get_or_create(
            email="inspector@gmail.com",
            defaults={
                "name":            "Tom Check",
                "phone":           "0755000001",
                "inspection_type": "pre_purchase",
                "vehicle_make":    "Toyota",
                "vehicle_model":   "Prado",
                "vehicle_year":    2019,
                "preferred_date":  datetime.date.today() + datetime.timedelta(days=7),
                "preferred_branch": hq,
                "additional_notes": "The car I want to buy is at Westlands, can you inspect there?",
            }
        )
        if created:
            ok(f"Sample inspection booking: {bk.name} — {bk.vehicle_make} {bk.vehicle_model}")

        ok("All sample records created.")