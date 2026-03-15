# 🚗 Bravin Cars — Kenya's Premier Car E-Commerce Platform

> A full-stack car dealership platform built with **Django REST Framework** (backend) and **React + Vite** (frontend). Designed for buying, selling, importing, and inspecting vehicles across Kenya — no user account required for customers.

---

## 📌 What This Platform Does

Bravin Cars is a production-ready vehicle marketplace tailored for the Kenyan market. Here is a breakdown of what it can do:

### 🛒 For Customers (No Account Needed)
- **Browse & Search Vehicles** — filter by brand, category (sedan, SUV, pickup, etc.), year of manufacture, price range in KES, fuel type, transmission, and condition
- **View Detailed Listings** — full specs, image gallery, engine CC, mileage, color, features list, and branch location
- **Instant WhatsApp Inquiry** — every vehicle has a one-click WhatsApp button that opens a pre-filled message to `+254112284093`
- **Send Email Inquiries** — inline contact form on each vehicle page; confirmation email sent automatically to the customer and admin
- **Import a Car** — submit a custom import order (Japan, UAE, UK, USA, Germany); team contacts you with options within 48 hours
- **Sell Your Car (Commission)** — upload photos and car details; Bravin Cars markets and sells it for a commission
- **Book a Car Inspection** — pre-purchase inspection, roadworthy certificate, valuation, or full service inspection
- **Browse by Category** — Sedan, SUV, Pickup, Hatchback, Coupe, Electric, Hybrid, Van, Lorry, and more
- **Browse by Brand** — Toyota, Nissan, Subaru, Mercedes, BMW, Isuzu, Land Rover, and 40+ other brands
- **View All Branches** — 8 branches across Kenya: Nairobi (HQ), Mombasa, Kisumu, Nakuru, Eldoret, Thika, Nyeri, Meru
- **Subscribe to Newsletter** — get new arrivals and deals by email
- **Apply for a Job** — career applications with CV upload

### 🔑 For Staff (Login Required)
- **Staff Dashboard** — overview stats: total vehicles, brands, branches, featured count, import stock, new inquiries
- **Inquiry Management** — view all customer inquiries with status tracking
- **Commission Review** — review cars submitted for commission sale; quick WhatsApp link to seller
- **Django Admin** — full admin panel for managing every model: vehicles, brands, images, branches, inquiries, imports, bookings, testimonials, newsletters, and careers

### 📧 Instant Email Notifications
Every action triggers email notifications (via Gmail SMTP):
- Customer inquiry → confirmation to customer + alert to admin
- Commission submission → receipt to seller + alert to admin
- Import order → confirmation to customer + alert to admin
- Inspection booking → confirmation to customer + alert to admin
- Career application → acknowledgement to applicant + alert to admin
- Newsletter subscribe → welcome email to subscriber

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django 4.2 + Django REST Framework |
| Database | SQLite (dev) / PostgreSQL (production) |
| Authentication | DRF Token Authentication |
| File Storage | Django media files (local / S3 ready) |
| Email | Gmail SMTP via Django EmailBackend |
| Frontend Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | Custom CSS (no Bootstrap framework — Bootstrap Icons only) |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Google Fonts — Outfit (headings) + Inter (body) |
| Dev Proxy | Vite dev proxy → Django port 8000 |

---

## 🗂️ Project Structure

```
bravin-cars/
│
├── README.md
│
├── backend/                          # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example                  # Environment variables template
│   │
│   ├── bravin_cars/                  # Django project config
│   │   ├── __init__.py
│   │   ├── settings.py               # Full settings: email, CORS, DRF, media, static
│   │   ├── urls.py                   # Root URL config
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   └── core/                         # Main Django app
│       ├── __init__.py
│       ├── models.py                 # 11 models with slugs, SEO meta, UUID PKs
│       ├── serializers.py            # DRF serializers (list + detail variants)
│       ├── views.py                  # ViewSets with email notification logic
│       ├── filters.py                # django-filter VehicleFilter (9 filter fields)
│       ├── urls.py                   # DRF Router — 10 registered endpoints
│       └── admin.py                  # Django admin configuration with inlines
│
└── frontend/                         # React + Vite frontend
    ├── index.html                    # Root HTML — Bootstrap Icons CDN, Google Fonts
    ├── package.json
    ├── vite.config.js                # Vite config with API proxy to :8000
    │
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # Router, Auth context, Toast context
        │
        ├── styles/
        │   └── main.css              # Full CSS — variables, components, responsive
        │
        ├── services/
        │   └── api.js                # Axios instance, all API calls, WhatsApp helpers
        │
        ├── components/
        │   ├── Layout.jsx            # Page wrapper with Navbar + Footer + WhatsApp float
        │   ├── Navbar.jsx            # Top bar + main nav + category bar + mobile drawer
        │   ├── Footer.jsx            # 4-column footer + newsletter subscribe
        │   ├── VehicleCard.jsx       # Reusable vehicle card with badges + quick WhatsApp
        │   └── FilterSidebar.jsx     # Desktop filter panel (brand, category, year, price...)
        │
        └── pages/
            ├── IndexPage.jsx         # Homepage: hero, filter bar, categories, featured cars
            ├── VehiclesPage.jsx      # All vehicles listing with filter + sort + pagination
            ├── VehicleDetailPage.jsx # Vehicle detail: gallery, specs table, inquiry form
            ├── CategoryListPage.jsx  # Vehicles filtered by body type (sedan, SUV, etc.)
            ├── SearchResultsPage.jsx # Full-text search results page
            ├── SellCarPage.jsx       # Commission sale form with multi-image upload
            ├── ImportPage.jsx        # Car import order form (Japan, UAE, UK, USA...)
            ├── ContactPage.jsx       # Contact form + all branch info cards
            ├── AboutPage.jsx         # Company story, values, stats, services
            ├── BranchesPage.jsx      # All 8 Kenya branches with contacts
            ├── FAQPage.jsx           # Accordion FAQs grouped by category
            ├── InspectionPage.jsx    # Inspection service booking form
            ├── CareersPage.jsx       # Job listings + application form with CV upload
            ├── LoginPage.jsx         # Staff login portal (token auth)
            └── AdminDashboard.jsx    # Staff dashboard: stats, inquiries, commissions
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/bravin-cars.git
cd bravin-cars
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and fill in your values (see Environment Variables section below)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser

# (Optional) Load sample data
python manage.py loaddata fixtures/sample_data.json

# Start the development server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**
Django Admin: **http://localhost:8000/admin/**
API Root: **http://localhost:8000/api/**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies all `/api` requests to Django at port 8000 automatically.

---

## 🔐 Environment Variables

Create a `.env` file inside `/backend/` based on `.env.example`:

```env
# Django
SECRET_KEY=your-very-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (Gmail SMTP — use an App Password, not your Gmail login)
EMAIL_HOST_USER=info@bravincars.co.ke
EMAIL_HOST_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=admin@bravincars.co.ke

# CORS (set to False in production and list allowed origins in settings.py)
CORS_ALLOW_ALL=True

# PostgreSQL (uncomment in production)
# DB_NAME=bravin_cars_db
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_HOST=localhost
# DB_PORT=5432
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate one for "Mail". Use that as `EMAIL_HOST_PASSWORD`.

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles/` | List all active vehicles (filterable, paginated) |
| GET | `/api/vehicles/{slug}/` | Vehicle detail by SEO slug |
| GET | `/api/vehicles/featured/` | Featured vehicles for homepage |
| GET | `/api/vehicles/imports/` | Import listings only |
| GET | `/api/vehicles/by_category/` | Category list with counts |
| GET | `/api/vehicles/stats/` | Site-wide stats (counts, categories) |
| GET | `/api/vehicles/{slug}/similar/` | Similar vehicles (same brand/category) |
| GET | `/api/brands/` | All brands |
| GET | `/api/brands/popular/` | Popular brands with vehicle counts |
| GET | `/api/brands/{slug}/vehicles/` | Vehicles for a specific brand |
| GET | `/api/branches/` | All branches |
| POST | `/api/inquiries/` | Submit a vehicle or general inquiry |
| POST | `/api/commissions/` | Submit car for commission sale |
| POST | `/api/imports/` | Submit import order |
| POST | `/api/careers/` | Submit job application |
| POST | `/api/inspections/` | Book inspection service |
| POST | `/api/newsletter/` | Subscribe to newsletter |
| GET | `/api/testimonials/` | Approved testimonials |

### Vehicle Filter Parameters

Append these as query parameters to `/api/vehicles/`:

```
?brand=toyota
?category=suv
?year_min=2018&year_max=2022
?price_min=500000&price_max=2000000
?fuel_type=diesel
?transmission=automatic
?condition=foreign_used
?is_import=true
?is_featured=true
?branch_city=nairobi
?search=prado
?ordering=price_ksh          (or -price_ksh, -year, -created_at, -views)
?page=2
```

---

## 📱 WhatsApp Integration

All customer-facing pages include direct WhatsApp links to **+254 112 284 093**.

- **Floating button** on every page (bottom-left, pulsing green)
- **Navbar "WhatsApp Us" button** on desktop
- **Vehicle card hover** reveals a quick WhatsApp button
- **Vehicle detail page** has a prominent "Inquire on WhatsApp" CTA
- **Each page's CTA section** links to WhatsApp with a context-aware pre-filled message

WhatsApp messages are pre-filled with vehicle name and price so the customer doesn't have to type anything.

---

## 🏢 Branches

The platform supports multiple branches. Default branches configured:

| City | Status |
|------|--------|
| Nairobi | Headquarters |
| Mombasa | Branch |
| Kisumu | Branch |
| Nakuru | Branch |
| Eldoret | Branch |
| Thika | Branch |
| Nyeri | Branch |
| Meru | Branch |

Add/edit branches via Django Admin → Core → Branches.

---

## 🔍 SEO Features

- All `Vehicle`, `Brand`, and `Branch` models use **slug fields** for clean URLs
  - Example: `/vehicles/2021-toyota-land-cruiser-prado-foreign-used/`
- Auto-generated `meta_description` field on every vehicle
- Page-specific `<title>` and `<meta>` tags in `index.html`
- Open Graph tags for social sharing
- Semantic HTML structure with proper heading hierarchy

---

## 🖥️ Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, filter bar, featured cars, categories, brands, import banner, sell steps, testimonials |
| All Vehicles | `/vehicles` | Grid listing with sidebar filters, sort, pagination |
| Vehicle Detail | `/vehicles/:slug` | Gallery, full specs, inquiry form, WhatsApp CTA, similar cars |
| Category | `/category/:type` | Filtered by body type (sedan, SUV, pickup...) |
| Brand | `/brand/:slug` | Filtered by car brand |
| Search | `/search?q=...` | Full-text search results |
| Sell Your Car | `/sell-your-car` | Commission sale submission with image upload |
| Imports | `/imports` | Import order form |
| Contact | `/contact` | Contact form + all branches |
| About Us | `/about` | Company story, values, services |
| Branches | `/branches` | All 8 Kenya branches with contacts |
| FAQs | `/faq` | Accordion FAQs grouped by topic |
| Inspection | `/inspection` | Service booking form |
| Careers | `/careers` | Open positions + application form |
| Staff Login | `/login` | Staff authentication portal |
| Admin Dashboard | `/admin-dashboard` | Stats, inquiries, commission review (protected) |

---

## 🎨 Design System

The frontend uses a custom CSS design system (no Bootstrap framework, Bootstrap Icons only):

- **Primary color**: `#c41e3a` (Deep Red — Bravin brand)
- **Secondary**: `#1a1a2e` (Deep Navy)
- **Accent**: `#f4a624` (Gold)
- **Font Headings**: Outfit (Google Fonts)
- **Font Body**: Inter (Google Fonts)
- **Responsive breakpoints**: 640px / 768px / 1024px / 1280px
- **Mobile**: Collapsible sidebar drawer, stacked grids, hidden secondary nav
- **Animations**: Page fade-in, card hover lift, WhatsApp pulse, shimmer skeleton loaders

---

## 🚀 Production Deployment

### Backend (Django)

```bash
# Install production dependencies
pip install gunicorn psycopg2-binary whitenoise

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn bravin_cars.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Switch the database in `.env` to PostgreSQL for production. Set `DEBUG=False` and configure `ALLOWED_HOSTS` with your domain.

### Frontend (React)

```bash
npm run build
# Outputs to /frontend/dist/ — serve with Nginx or deploy to Vercel/Netlify
```

---

## 📋 Django Admin Quick Start

After running `createsuperuser`, go to `/admin/` and:

1. **Add Brands** — Toyota, Nissan, Subaru, etc. (mark popular ones)
2. **Add Branches** — Set up your city branches and mark the HQ
3. **Add Vehicles** — Upload images, set price in KES, mark featured/import
4. **Approve Testimonials** — Set `is_approved = True` to show on homepage
5. **Manage Inquiries** — Update status as you handle each inquiry
6. **Review Commissions** — Check submitted cars and mark as reviewed

---

## 📞 Business Contact Info (Configured in Settings)

```python
WHATSAPP_NUMBER = '254112284093'
BUSINESS_PHONE  = '+254 112 284 093'
BUSINESS_EMAIL  = 'info@bravincars.co.ke'
BUSINESS_NAME   = 'Bravin Cars'
```

To change these, update `backend/bravin_cars/settings.py`.

---

## 📄 License

This project is built exclusively for **Bravin Cars, Kenya**.  
© 2025 Bravin Cars. All rights reserved.

---

*Built with Django + React · Deployed in Kenya 🇰🇪*