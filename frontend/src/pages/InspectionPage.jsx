import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inspectionsAPI, branchesAPI, whatsappURL } from '../services/api'
import { useToast } from '../App'

export default function InspectionPage() {
  const { addToast } = useToast()
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    inspection_type: 'pre_purchase',
    vehicle_make: '', vehicle_model: '', vehicle_year: '',
    preferred_date: '', preferred_branch: '', additional_notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => { branchesAPI.list().then(r => setBranches(r.data.results || r.data)).catch(() => {}) }, [])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await inspectionsAPI.book(form)
      setDone(true)
      addToast('success', 'Inspection Booked!', 'We\'ll confirm your appointment within 24 hours.')
    } catch { addToast('error', 'Failed', 'Please try WhatsApp.') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-shield-check" /> Car Inspection Services</h1>
          <p>Professional vehicle inspection before you buy — peace of mind guaranteed.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>Inspection</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container" style={{ maxWidth: 960 }}>
          {/* Services */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { icon: 'bi-search', title: 'Pre-Purchase Inspection', desc: 'Know exactly what you\'re buying. Full mechanical and body check.', price: 'From KES 3,500' },
              { icon: 'bi-file-earmark-check', title: 'Roadworthy Certificate', desc: 'Official inspection and roadworthy certification for your vehicle.', price: 'From KES 2,500' },
              { icon: 'bi-currency-dollar', title: 'Vehicle Valuation', desc: 'Get a fair market value estimate for buying, selling, or insurance.', price: 'From KES 2,000' },
              { icon: 'bi-tools', title: 'Full Service Inspection', desc: 'Complete mechanical service + inspection report.', price: 'From KES 6,000' },
            ].map(s => (
              <div key={s.title} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: 20, color: 'var(--primary)' }} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: 6 }}>{s.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: 10 }}>{s.desc}</p>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>{s.price}</span>
              </div>
            ))}
          </div>

          {/* What's Checked */}
          <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 16 }}><i className="bi bi-list-check" /> What Our Inspection Covers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {['Engine health & leaks', 'Transmission', 'Brake system', 'Suspension & steering', 'Electrical systems', 'Body & paintwork', 'Tyre condition', 'Mileage verification', 'Document check', 'Interior & AC', 'Exhaust system', 'Chassis inspection'].map(item => (
                <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.83rem', color: 'var(--gray-700)' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)', flexShrink: 0 }} /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          {done ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12 }}>
              <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 12 }}><i className="bi bi-check-circle-fill" /></div>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Booking Received!</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: 20 }}>We'll confirm your appointment within 24 hours via phone or email.</p>
              <a href={whatsappURL('Hello! I just booked a car inspection. Can you confirm?')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="bi bi-whatsapp" /> Confirm on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 20 }}>
                <i className="bi bi-calendar-plus" /> Book an Inspection
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
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
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Inspection Type *</label>
                  <select className="form-control form-select" value={form.inspection_type} onChange={e => set('inspection_type', e.target.value)}>
                    <option value="pre_purchase">Pre-Purchase Inspection</option>
                    <option value="roadworthy">Roadworthy Certificate</option>
                    <option value="valuation">Vehicle Valuation</option>
                    <option value="full_service">Full Service Inspection</option>
                  </select>
                </div>
                {[
                  { label: 'Vehicle Make *', key: 'vehicle_make', placeholder: 'Toyota' },
                  { label: 'Vehicle Model *', key: 'vehicle_model', placeholder: 'Land Cruiser' },
                  { label: 'Vehicle Year *', key: 'vehicle_year', type: 'number', placeholder: '2018' },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-control" type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Date *</label>
                  <input className="form-control" type="date" value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Branch</label>
                  <select className="form-control form-select" value={form.preferred_branch} onChange={e => set('preferred_branch', e.target.value)}>
                    <option value="">Any Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.city} {b.is_headquarters ? '(HQ)' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea className="form-control" rows={3} value={form.additional_notes} onChange={e => set('additional_notes', e.target.value)} placeholder="Any specific concerns about the vehicle?" />
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary btn-full btn-lg">
                {submitting ? <><i className="bi bi-hourglass-split" /> Booking...</> : <><i className="bi bi-calendar-check" /> Book Inspection</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}