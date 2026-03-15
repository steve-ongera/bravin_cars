import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import { vehiclesAPI, brandsAPI, testimonialsAPI, whatsappURL, CATEGORY_ICONS, CATEGORY_LABELS, formatPrice } from '../services/api'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i)

const BRANDS_LIST = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda', 'Mercedes', 'BMW', 'Mitsubishi', 'Isuzu', 'Land Rover']

export default function IndexPage() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({ brand: '', category: '', year_min: '', year_max: '', price_max: '' })

  useEffect(() => {
    Promise.all([
      vehiclesAPI.featured(),
      vehiclesAPI.byCategory(),
      vehiclesAPI.stats(),
      brandsAPI.popular(),
      testimonialsAPI.list(),
    ]).then(([featRes, catRes, statsRes, brandRes, testRes]) => {
      setFeatured(featRes.data)
      setCategories((catRes.data || []).filter(c => c.count > 0).slice(0, 12))
      setStats(statsRes.data || {})
      setBrands(brandRes.data || [])
      setTestimonials((testRes.data.results || testRes.data || []).slice(0, 3))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.brand) params.set('brand', filters.brand)
    if (filters.category) params.set('category', filters.category)
    if (filters.year_min) params.set('year_min', filters.year_min)
    if (filters.year_max) params.set('year_max', filters.year_max)
    if (filters.price_max) params.set('price_max', filters.price_max)
    navigate(`/vehicles?${params.toString()}`)
  }

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="bi bi-patch-check-fill" /> Kenya's Trusted Car Dealer
            </div>
            <h1>Find Your Perfect Car <span>in Kenya</span></h1>
            <p>Buy, sell, or import quality vehicles from Japan, UAE & UK. Trusted by thousands across Nairobi, Mombasa, Kisumu & beyond.</p>
            <div className="hero-actions">
              <Link to="/vehicles" className="btn-primary-hero">
                <i className="bi bi-search" /> Browse All Cars
              </Link>
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="btn-outline-hero">
                <i className="bi bi-whatsapp" /> Chat with Us
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="num">{stats.total_vehicles || '500'}+</span>
                <span className="lbl">Vehicles</span>
              </div>
              <div className="hero-stat">
                <span className="num">{stats.total_brands || '40'}+</span>
                <span className="lbl">Brands</span>
              </div>
              <div className="hero-stat">
                <span className="num">{stats.total_branches || '8'}</span>
                <span className="lbl">Branches</span>
              </div>
              <div className="hero-stat">
                <span className="num">5000+</span>
                <span className="lbl">Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filter Bar ─── */}
      <div className="container">
        <form className="filter-bar" onSubmit={handleFilter}>
          <div className="filter-bar-title"><i className="bi bi-funnel" /> Quick Search</div>
          <div className="filter-bar-grid">
            <select value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}>
              <option value="">All Brands</option>
              {BRANDS_LIST.map(b => <option key={b} value={b.toLowerCase()}>{b}</option>)}
            </select>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="">All Types</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filters.year_min} onChange={e => setFilters(f => ({ ...f, year_min: e.target.value }))}>
              <option value="">From Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={filters.year_max} onChange={e => setFilters(f => ({ ...f, year_max: e.target.value }))}>
              <option value="">To Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={filters.price_max} onChange={e => setFilters(f => ({ ...f, price_max: e.target.value }))}>
              <option value="">Max Budget</option>
              <option value="500000">KES 500K</option>
              <option value="1000000">KES 1M</option>
              <option value="2000000">KES 2M</option>
              <option value="3000000">KES 3M</option>
              <option value="5000000">KES 5M</option>
              <option value="10000000">KES 10M+</option>
            </select>
            <button type="submit" className="filter-search-btn">
              <i className="bi bi-search" /> Search Cars
            </button>
          </div>
        </form>
      </div>

      {/* ─── Categories ─── */}
      {categories.length > 0 && (
        <section className="section-sm">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Type</h2>
              <Link to="/vehicles" className="view-all-link">All Types <i className="bi bi-arrow-right" /></Link>
            </div>
            <div className="categories-grid">
              {categories.map(cat => (
                <Link key={cat.key} to={`/category/${cat.key}`} className="category-card">
                  <i className={`bi ${CATEGORY_ICONS[cat.key] || 'bi-car-front'} category-icon`} />
                  <div className="category-name">{cat.label}</div>
                  <div className="category-count">{cat.count} cars</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Vehicles ─── */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Vehicles</h2>
            <Link to="/vehicles?is_featured=true" className="view-all-link">View All <i className="bi bi-arrow-right" /></Link>
          </div>
          {loading ? (
            <div className="vehicles-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ height: 180, borderRadius: 12, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, marginBottom: 6, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="vehicles-grid">
              {featured.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-car-front" />
              <h3>No featured vehicles yet</h3>
              <p>Check back soon for our top picks!</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/vehicles" className="btn btn-primary btn-lg">
              <i className="bi bi-grid" /> Browse All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Popular Brands ─── */}
      {brands.length > 0 && (
        <section className="section-sm">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Popular Brands</h2>
              <Link to="/vehicles" className="view-all-link">All Brands <i className="bi bi-arrow-right" /></Link>
            </div>
            <div className="brands-strip">
              {brands.map(brand => (
                <Link key={brand.slug} to={`/brand/${brand.slug}`} className="brand-chip">
                  {brand.logo
                    ? <img src={brand.logo} alt={brand.name} />
                    : <i className="bi bi-car-front" style={{ fontSize: 18, color: 'var(--primary)' }} />
                  }
                  {brand.name}
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>({brand.vehicle_count})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Import Banner ─── */}
      <section className="section-sm">
        <div className="container">
          <div className="import-banner">
            <div>
              <h3>🌏 Import Your Dream Car</h3>
              <p>We source vehicles directly from Japan, UAE, UK & more. Competitive prices, full import documentation, and door delivery.</p>
              <div className="import-flags">
                {['🇯🇵 Japan', '🇦🇪 UAE', '🇬🇧 UK', '🇺🇸 USA', '🇩🇪 Germany'].map(f => (
                  <span key={f} className="import-flag">{f}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <Link to="/imports" className="btn btn-primary">
                <i className="bi bi-globe" /> Place Import Order
              </Link>
              <a href={whatsappURL('Hello! I need help importing a car.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="bi bi-whatsapp" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sell Your Car ─── */}
      <section className="section" style={{ background: 'var(--primary-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="section-title" style={{ display: 'inline-block' }}>Sell Your Car With Us</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: 8 }}>We handle everything. You just collect your money.</p>
          </div>
          <div className="sell-steps">
            {[
              { num: '1', title: 'Submit Your Car', desc: 'Upload photos and details of your vehicle online in minutes.', icon: 'bi-upload' },
              { num: '2', title: 'We Handle It All', desc: 'Our team markets, fields inquiries, and negotiates on your behalf.', icon: 'bi-people' },
              { num: '3', title: 'Get Paid', desc: 'Once sold, we transfer your payment minus our small commission.', icon: 'bi-cash-coin' },
            ].map(s => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <i className={`bi ${s.icon}`} style={{ fontSize: '1.6rem', color: 'var(--primary)', marginBottom: 8, display: 'block' }} />
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/sell-your-car" className="btn btn-primary btn-lg">
              <i className="bi bi-tags" /> Sell My Car
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="section-sm">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: 'bi-shield-check', title: 'Car Inspection', desc: 'Professional pre-purchase & roadworthy checks', to: '/inspection', color: '#dbeafe', iconColor: 'var(--info)' },
              { icon: 'bi-globe', title: 'Car Imports', desc: 'Direct imports from Japan, UAE & Europe', to: '/imports', color: '#dcfce7', iconColor: 'var(--success)' },
              { icon: 'bi-tags', title: 'Commission Sales', desc: 'We sell your car for you at best market price', to: '/sell-your-car', color: 'var(--primary-light)', iconColor: 'var(--primary)' },
              { icon: 'bi-geo-alt', title: '8 Branches', desc: 'Conveniently located across major Kenyan cities', to: '/branches', color: '#fef9c3', iconColor: '#ca8a04' },
            ].map(s => (
              <Link key={s.title} to={s.to} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20, transition: 'all 0.2s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: 20, color: s.iconColor }} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: 4 }}>{s.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background: 'var(--gray-50)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Our Clients Say</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.map(t => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, i) => <i key={i} className="bi bi-star-fill" />)}
                  </div>
                  <p className="testimonial-text">"{t.message}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.name[0]}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-loc"><i className="bi bi-geo-alt" /> {t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Banner ─── */}
      <section className="section-sm">
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: 16, padding: '40px 32px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginBottom: 10 }}>
              Ready to Find Your Car?
            </h2>
            <p style={{ opacity: 0.9, marginBottom: 24 }}>Talk to our experts on WhatsApp right now. No waiting, no queues.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <i className="bi bi-whatsapp" /> Chat on WhatsApp
              </a>
              <Link to="/vehicles" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                <i className="bi bi-grid" /> Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}