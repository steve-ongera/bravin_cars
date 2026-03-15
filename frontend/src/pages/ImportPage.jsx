import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { importsAPI, whatsappURL } from '../services/api'
import { useToast } from '../App'

export default function ImportPage() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    brand: '', model: '', year_from: '', year_to: '',
    budget_ksh: '', preferred_source: 'japan', specifications: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await importsAPI.create(form)
      setDone(true)
      addToast('success', 'Import Order Submitted!', 'Our team will contact you with options within 24-48 hrs.')
    } catch {
      addToast('error', 'Failed', 'Could not submit. Please try WhatsApp.')
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-globe" /> Import Your Dream Car</h1>
          <p>We source directly from Japan, UAE, UK & USA. Best prices, full documentation.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>Car Imports</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: 1000 }}>
          {/* Benefits */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { icon: 'bi-currency-dollar', title: 'Best Prices', desc: 'Direct dealer prices, no middlemen' },
              { icon: 'bi-file-earmark-check', title: 'Full Documentation', desc: 'Logbook, insurance, customs clearance' },
              { icon: 'bi-truck', title: 'Door Delivery', desc: 'We deliver to any branch near you' },
              { icon: 'bi-shield-check', title: 'Inspection Report', desc: 'Pre-shipment vehicle inspection included' },
            ].map(b => (
              <div key={b.title} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 18 }}>
                <i className={`bi ${b.icon}`} style={{ fontSize: '1.6rem', color: 'var(--primary)', display: 'block', marginBottom: 8 }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: 4 }}>{b.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{b.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            {done ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12 }}>
                <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 12 }}><i className="bi bi-check-circle-fill" /></div>
                <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Order Received!</h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: 20 }}>Our import specialists will contact you within 24-48 hours with vehicle options matching your specs.</p>
                <a href={whatsappURL('Hello! I just submitted an import order on your website.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <i className="bi bi-whatsapp" /> Follow Up on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--gray-100)' }}>
                  <i className="bi bi-person" /> Your Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                  {[
                    { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'John Kamau' },
                    { label: 'Email *', key: 'email', type: 'email', placeholder: 'john@email.com' },
                    { label: 'Phone *', key: 'phone', type: 'tel', placeholder: '0712 345 678' },
                  ].map(f => (
                    <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-control" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--gray-100)' }}>
                  <i className="bi bi-car-front" /> Car Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
                  {[
                    { label: 'Brand / Make *', key: 'brand', placeholder: 'Toyota, BMW...' },
                    { label: 'Model *', key: 'model', placeholder: 'Prado, X5...' },
                    { label: 'Year From *', key: 'year_from', type: 'number', placeholder: '2018' },
                    { label: 'Year To *', key: 'year_to', type: 'number', placeholder: '2022' },
                    { label: 'Budget (KES) *', key: 'budget_ksh', type: 'number', placeholder: '2500000' },
                  ].map(f => (
                    <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">{f.label}</label>
                      <input className="form-control" type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required={f.label.includes('*')} placeholder={f.placeholder} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Source Country *</label>
                    <select className="form-control form-select" value={form.preferred_source} onChange={e => set('preferred_source', e.target.value)}>
                      <option value="japan">🇯🇵 Japan</option>
                      <option value="uae">🇦🇪 UAE / Dubai</option>
                      <option value="uk">🇬🇧 United Kingdom</option>
                      <option value="usa">🇺🇸 USA</option>
                      <option value="germany">🇩🇪 Germany</option>
                      <option value="south_africa">🇿🇦 South Africa</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Specifications</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.specifications}
                    onChange={e => set('specifications', e.target.value)}
                    placeholder="Color preference, gear type, sunroof, 4WD, mileage limit, etc."
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary btn-full btn-lg">
                  {submitting ? <><i className="bi bi-hourglass-split" /> Submitting...</> : <><i className="bi bi-globe" /> Submit Import Order</>}
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp */}
          <div style={{ marginTop: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Prefer WhatsApp?</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-600)' }}>Chat with our import specialist right now for instant quotes.</p>
            </div>
            <a href={whatsappURL('Hi! I want to import a car. Please help me.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ flexShrink: 0 }}>
              <i className="bi bi-whatsapp" /> Chat Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}