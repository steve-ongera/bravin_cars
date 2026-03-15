import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import { vehiclesAPI, inquiriesAPI, formatPrice, formatMileage, whatsappVehicle, whatsappURL } from '../services/api'
import { useToast } from '../App'

const MEDIA_BASE = 'http://localhost:8000'
function imgUrl(img) {
  if (!img) return null
  const src = img.image || img
  return src.startsWith('http') ? src : MEDIA_BASE + src
}

export default function VehicleDetailPage() {
  const { slug } = useParams()
  const { addToast } = useToast()
  const [vehicle, setVehicle] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '', preferred_contact: 'whatsapp' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      vehiclesAPI.detail(slug),
      vehiclesAPI.similar(slug),
    ]).then(([vRes, sRes]) => {
      setVehicle(vRes.data)
      setSimilar(sRes.data || [])
      setInquiryForm(f => ({ ...f, message: `Hi, I'm interested in the ${vRes.data.title}. Please share more details.` }))
      setActiveImg(0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  const handleInquiry = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await inquiriesAPI.create({ ...inquiryForm, vehicle: vehicle.id })
      addToast('success', 'Inquiry Sent!', 'We\'ll contact you shortly. Check your email.')
      setInquiryForm(f => ({ ...f, name: '', email: '', phone: '' }))
    } catch {
      addToast('error', 'Failed', 'Could not send inquiry. Please try WhatsApp instead.')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 12 }} />
        <div>
          <div className="skeleton" style={{ height: 32, marginBottom: 10, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 20, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  )

  if (!vehicle) return (
    <div className="empty-state" style={{ paddingTop: 80 }}>
      <i className="bi bi-exclamation-circle" />
      <h3>Vehicle not found</h3>
      <p><Link to="/vehicles" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-flex' }}>Browse All Cars</Link></p>
    </div>
  )

  const images = vehicle.images || []
  const currentImg = images[activeImg]
  const features = vehicle.features ? vehicle.features.split(',').map(f => f.trim()).filter(Boolean) : []

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ padding: '24px 0 32px' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to="/vehicles">Vehicles</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to={`/category/${vehicle.category}`}>{vehicle.category_display}</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>{vehicle.title}</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          <div className="vehicle-detail-grid">
            {/* Left: Gallery + Info */}
            <div>
              {/* Gallery */}
              <div className="vehicle-gallery">
                <div className="gallery-main">
                  {currentImg ? (
                    <img src={imgUrl(currentImg)} alt={vehicle.title} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)', fontSize: '4rem' }}>
                      <i className="bi bi-car-front" />
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="gallery-thumbs">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`gallery-thumb ${i === activeImg ? 'active' : ''}`}
                        onClick={() => setActiveImg(i)}
                      >
                        <img src={imgUrl(img)} alt={`View ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20, marginTop: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 12, color: 'var(--gray-800)' }}>
                  <i className="bi bi-text-paragraph" /> Vehicle Description
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.8 }}>{vehicle.description}</p>

                {features.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', marginBottom: 10, color: 'var(--gray-700)' }}>Features & Extras</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {features.map((f, i) => (
                        <span key={i} style={{ background: 'var(--gray-100)', padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                          <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)', marginRight: 4 }} /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specs Table */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20, marginTop: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16, color: 'var(--gray-800)' }}>
                  <i className="bi bi-list-check" /> Full Specifications
                </h3>
                <table className="spec-table">
                  <tbody>
                    {[
                      ['Brand', vehicle.brand?.name],
                      ['Model', vehicle.model],
                      ['Year', vehicle.year],
                      ['Category', vehicle.category_display],
                      ['Condition', vehicle.condition_display],
                      ['Engine', vehicle.engine_cc ? `${vehicle.engine_cc} CC` : null],
                      ['Fuel Type', vehicle.fuel_type_display],
                      ['Transmission', vehicle.transmission_display],
                      ['Drive Type', vehicle.drive_type_display],
                      ['Mileage', vehicle.mileage_km ? formatMileage(vehicle.mileage_km) : null],
                      ['Color', vehicle.color],
                      ['Seats', vehicle.seats],
                      ['Branch', vehicle.branch?.city],
                    ].filter(([, v]) => v).map(([label, val]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Price card + Inquiry form */}
            <div>
              <div className="vehicle-info-card">
                {/* Status badges */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                  {vehicle.is_featured && <span className="card-badge badge-featured" style={{ position: 'static' }}>Featured</span>}
                  {vehicle.is_import && <span className="card-badge badge-import" style={{ position: 'static' }}>Import</span>}
                  {vehicle.condition === 'new' && <span className="card-badge badge-new" style={{ position: 'static' }}>Brand New</span>}
                </div>

                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gray-900)', marginBottom: 8, lineHeight: 1.4 }}>
                  {vehicle.title}
                </h1>

                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
                  {formatPrice(vehicle.price_ksh)}
                </div>
                {vehicle.is_negotiable && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                    <i className="bi bi-check-circle-fill" /> Price is negotiable
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <a
                    href={whatsappVehicle(vehicle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-full btn-lg"
                  >
                    <i className="bi bi-whatsapp" /> Inquire on WhatsApp
                  </a>
                  <a
                    href={`tel:+254112284093`}
                    className="btn btn-secondary btn-full"
                  >
                    <i className="bi bi-telephone" /> Call Us: +254 112 284 093
                  </a>
                </div>

                <div style={{ height: 1, background: 'var(--gray-200)', margin: '16px 0' }} />

                {/* Inquiry Form */}
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: 14 }}>
                  <i className="bi bi-envelope" /> Send Inquiry
                </h4>
                <form onSubmit={handleInquiry}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Your full name *"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                      required
                      style={{ fontSize: '0.83rem', padding: '9px 12px' }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address *"
                      value={inquiryForm.email}
                      onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))}
                      required
                      style={{ fontSize: '0.83rem', padding: '9px 12px' }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone number *"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                      required
                      style={{ fontSize: '0.83rem', padding: '9px 12px' }}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                      rows={3}
                      style={{ fontSize: '0.83rem', padding: '9px 12px', minHeight: 80 }}
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control form-select"
                      value={inquiryForm.preferred_contact}
                      onChange={e => setInquiryForm(f => ({ ...f, preferred_contact: e.target.value }))}
                      style={{ fontSize: '0.83rem', padding: '9px 12px' }}
                    >
                      <option value="whatsapp">Contact via WhatsApp</option>
                      <option value="email">Contact via Email</option>
                      <option value="call">Contact via Phone Call</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                    {submitting ? <><i className="bi bi-hourglass-split" /> Sending...</> : <><i className="bi bi-send" /> Send Inquiry</>}
                  </button>
                </form>

                <div style={{ marginTop: 14, padding: 12, background: 'var(--gray-50)', borderRadius: 8, fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  <i className="bi bi-shield-check" style={{ color: 'var(--success)' }} /> Your details are secure and will only be used to respond to your inquiry.
                </div>
              </div>
            </div>
          </div>

          {/* Similar Vehicles */}
          {similar.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <div className="section-header">
                <h2 className="section-title">Similar Vehicles</h2>
                <Link to="/vehicles" className="view-all-link">View All <i className="bi bi-arrow-right" /></Link>
              </div>
              <div className="vehicles-grid">
                {similar.slice(0, 4).map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}