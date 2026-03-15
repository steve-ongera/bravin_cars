/**
 * Bravin Cars - API Service Layer
 * All API calls to Django REST backend
 */
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const WA_NUMBER = '254112284093'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bravin_token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

// ─── Auth ────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
}

// ─── Vehicles ────────────────────────────────────────
export const vehiclesAPI = {
  list: (params = {}) => api.get('/vehicles/', { params }),
  detail: (slug) => api.get(`/vehicles/${slug}/`),
  featured: () => api.get('/vehicles/featured/'),
  imports: (params = {}) => api.get('/vehicles/imports/', { params }),
  byCategory: () => api.get('/vehicles/by_category/'),
  stats: () => api.get('/vehicles/stats/'),
  similar: (slug) => api.get(`/vehicles/${slug}/similar/`),
  search: (query, params = {}) => api.get('/vehicles/', { params: { search: query, ...params } }),
}

// ─── Brands ──────────────────────────────────────────
export const brandsAPI = {
  list: () => api.get('/brands/'),
  popular: () => api.get('/brands/popular/'),
  detail: (slug) => api.get(`/brands/${slug}/`),
  vehicles: (slug, params = {}) => api.get(`/brands/${slug}/vehicles/`, { params }),
}

// ─── Branches ────────────────────────────────────────
export const branchesAPI = {
  list: () => api.get('/branches/'),
  detail: (slug) => api.get(`/branches/${slug}/`),
}

// ─── Inquiries ───────────────────────────────────────
export const inquiriesAPI = {
  create: (data) => api.post('/inquiries/', data),
}

// ─── Commission ───────────────────────────────────────
export const commissionAPI = {
  submit: (formData) => api.post('/commissions/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ─── Imports ─────────────────────────────────────────
export const importsAPI = {
  create: (data) => api.post('/imports/', data),
}

// ─── Careers ─────────────────────────────────────────
export const careersAPI = {
  apply: (formData) => api.post('/careers/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ─── Testimonials ─────────────────────────────────────
export const testimonialsAPI = {
  list: () => api.get('/testimonials/'),
}

// ─── Newsletter ───────────────────────────────────────
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/', { email }),
}

// ─── Inspections ──────────────────────────────────────
export const inspectionsAPI = {
  book: (data) => api.post('/inspections/', data),
}

// ─── WhatsApp Utilities ───────────────────────────────
export const whatsappURL = (message = '') => {
  const encoded = encodeURIComponent(message || 'Hello Bravin Cars, I would like to inquire about a vehicle.')
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`
}

export const whatsappVehicle = (vehicle) => {
  const msg = `Hello Bravin Cars! I'm interested in:\n*${vehicle.title}*\nPrice: KES ${Number(vehicle.price_ksh).toLocaleString()}\nPlease share more details.`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

// ─── Format Utilities ─────────────────────────────────
export const formatPrice = (price) => {
  const num = Number(price)
  if (isNaN(num)) return 'N/A'
  return `KES ${num.toLocaleString('en-KE')}`
}

export const formatMileage = (km) => {
  if (!km) return 'N/A'
  return `${Number(km).toLocaleString()} km`
}

export const CATEGORY_ICONS = {
  sedan: 'bi-car-front',
  suv: 'bi-truck',
  pickup: 'bi-truck-flatbed',
  hatchback: 'bi-car-front-fill',
  coupe: 'bi-car-front',
  convertible: 'bi-wind',
  minivan: 'bi-bus-front',
  wagon: 'bi-car-front',
  sports: 'bi-lightning-charge',
  electric: 'bi-lightning',
  hybrid: 'bi-leaf',
  van: 'bi-bus-front-fill',
  lorry: 'bi-truck',
}

export const CATEGORY_LABELS = {
  sedan: 'Sedan',
  suv: 'SUV',
  pickup: 'Pickup',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  convertible: 'Convertible',
  minivan: 'Minivan',
  wagon: 'Station Wagon',
  sports: 'Sports',
  electric: 'Electric',
  hybrid: 'Hybrid',
  van: 'Van / Bus',
  lorry: 'Lorry',
}

export default api