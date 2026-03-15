import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { commissionAPI, whatsappURL } from '../services/api'
import { useToast } from '../App'

export default function SellCarPage() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    seller_name: '', seller_phone: '', seller_email: '', seller_location: '',
    brand: '', model: '', year: '', asking_price_ksh: '', condition: 'foreign_used',
    mileage_km: '', description: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
      images.forEach(img => fd.append('uploaded_images', img))
      await commissionAPI.submit(fd)
      setSubmitted(true)
      addToast('success', 'Submitted!', 'We\'ll contact you within 48 hours.')
    } catch {
      addToast('error', 'Submission Failed', 'Please try again or contact us on WhatsApp.')
    } finally { setSubmitting(false) }
  }

  if (submitted) return (
    <div>
      <div className="page-header"><div className="container"><h1>Sell Your Car</h1></div></div>
      <div className="container" style={{ maxWidth: 600, textAlign: 'center', padding: '60px 16px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem', color: 'var(--success)' }}>
          <i className="bi bi-check-circle-fill" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 12 }}>Submission Received!</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
          Thank you for submitting your car to Bravin Cars. Our team will review your listing and contact you within 48 hours via phone or email.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={whatsappURL('Hi! I just submitted my car for commission sale on your website.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <i className="bi bi-whatsapp" /> Follow Up on WhatsApp
          </a>
          <Link to="/vehicles" className="btn btn-outline">Browse Cars</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-tags" /> Sell Your Car</h1>
          <p>Let Bravin Cars sell your car for you. We handle everything!</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>Sell Your Car</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: 900 }}>
          {/* How it Works */}
          <div style={{ background: 'var(--primary-light)', border: '1px solid rgba(196,30,58,0.1)', borderRadius: 12, padding: 24, marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 16, color: 'var(--primary)' }}>
              <i className="bi bi-info-circle" /> How Commission Sales Work
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { step: '1', text: 'Fill the form below and upload clear photos of your car' },
                { step: '2', text: 'Our team reviews and lists your car on the platform' },
                { step: '3', text: 'We handle buyer inquiries and negotiations' },
                { step: '4', text: 'Car sold → You get your money minus our commission' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--gray-700)' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24 }}>
              {/* Seller Info */}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--gray-100)' }}>
                <i className="bi bi-person" /> Your Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-control" value={form.seller_name} onChange={e => set('seller_name', e.target.value)} required placeholder="John Kamau" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input className="form-control" type="tel" value={form.seller_phone} onChange={e => set('seller_phone', e.target.value)} required placeholder="0712 345 678" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address *</label>
                  <input className="form-control" type="email" value={form.seller_email} onChange={e => set('seller_email', e.target.value)} required placeholder="john@email.com" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Location (City) *</label>
                  <input className="form-control" value={form.seller_location} onChange={e => set('seller_location', e.target.value)} required placeholder="Nairobi, Westlands" />
                </div>
              </div>

              {/* Car Info */}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--gray-100)' }}>
                <i className="bi bi-car-front" /> Car Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brand / Make *</label>
                  <input className="form-control" value={form.brand} onChange={e => set('brand', e.target.value)} required placeholder="Toyota, Nissan, BMW..." />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Model *</label>
                  <input className="form-control" value={form.model} onChange={e => set('model', e.target.value)} required placeholder="Corolla, X-Trail..." />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Year *</label>
                  <input className="form-control" type="number" min="1990" max="2026" value={form.year} onChange={e => set('year', e.target.value)} required placeholder="2019" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Asking Price (KES) *</label>
                  <input className="form-control" type="number" value={form.asking_price_ksh} onChange={e => set('asking_price_ksh', e.target.value)} required placeholder="1500000" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Condition *</label>
                  <select className="form-control form-select" value={form.condition} onChange={e => set('condition', e.target.value)}>
                    <option value="new">Brand New</option>
                    <option value="foreign_used">Foreign Used</option>
                    <option value="local_used">Locally Used</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mileage (KM)</label>
                  <input className="form-control" type="number" value={form.mileage_km} onChange={e => set('mileage_km', e.target.value)} placeholder="85000" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  required
                  placeholder="Describe your car — engine condition, any faults, recent servicing, features, reason for selling, etc."
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Upload Car Photos (Max 10)</label>
                <div style={{ border: '2px dashed var(--gray-300)', borderRadius: 10, padding: 24, textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)' }}
                  onClick={() => document.getElementById('car-images').click()}>
                  <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: 'var(--gray-300)', display: 'block', marginBottom: 8 }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Click to upload or drag & drop</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>JPG, PNG up to 5MB each</p>
                  <input id="car-images" type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
                </div>
                {previews.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                    {previews.map((p, i) => (
                      <div key={i} style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--primary)' }}>
                        <img src={p} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <div style={{ fontSize: '0.78rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="bi bi-check-circle-fill" /> {images.length} photo{images.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                {submitting
                  ? <><i className="bi bi-hourglass-split" /> Submitting...</>
                  : <><i className="bi bi-send" /> Submit My Car for Sale</>
                }
              </button>

              <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textAlign: 'center', marginTop: 12 }}>
                By submitting, you agree to let Bravin Cars list and market your vehicle on your behalf.
              </p>
            </form>
          </div>

          {/* WhatsApp Alternative */}
          <div style={{ marginTop: 24, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Prefer to submit via WhatsApp?</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>Send us your car photos and details directly on WhatsApp and we'll list it for you.</p>
            </div>
            <a href={whatsappURL('Hi Bravin Cars! I want to sell my car through you. Please guide me.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ flexShrink: 0 }}>
              <i className="bi bi-whatsapp" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}