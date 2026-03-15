import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inquiriesAPI, branchesAPI, whatsappURL } from '../services/api'
import { useToast } from '../App'

export default function ContactPage() {
  const { addToast } = useToast()
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', preferred_contact: 'whatsapp' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { branchesAPI.list().then(r => setBranches(r.data.results || r.data)).catch(() => {}) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await inquiriesAPI.create(form)
      addToast('success', 'Message Sent!', 'We\'ll get back to you shortly.')
      setForm({ name: '', email: '', phone: '', message: '', preferred_contact: 'whatsapp' })
    } catch { addToast('error', 'Failed', 'Please try WhatsApp instead.') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-telephone" /> Contact Us</h1>
          <p>We're here to help. Reach us via WhatsApp, email, or visit any of our branches.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>Contact Us</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {/* Quick Contact Cards */}
          <div className="contact-cards" style={{ marginBottom: 32 }}>
            <div className="contact-card">
              <div className="contact-card-icon icon-green"><i className="bi bi-whatsapp" /></div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 6 }}>WhatsApp</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', marginBottom: 12 }}>Fastest response. Chat with our team instantly.</p>
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm btn-full">
                <i className="bi bi-whatsapp" /> +254 112 284 093
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-blue"><i className="bi bi-envelope" /></div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Email</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', marginBottom: 12 }}>Send us an email and we'll respond within 24 hours.</p>
              <a href="mailto:info@bravincars.co.ke" className="btn btn-outline btn-sm btn-full">
                info@bravincars.co.ke
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon icon-red"><i className="bi bi-telephone" /></div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 6 }}>Call Us</h4>
              <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)', marginBottom: 12 }}>Mon-Sat 8AM-6PM, Sun 10AM-4PM</p>
              <a href="tel:+254112284093" className="btn btn-primary btn-sm btn-full">
                <i className="bi bi-telephone" /> +254 112 284 093
              </a>
            </div>
          </div>

          {/* Form + Branches */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Contact Form */}
              <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 20 }}>
                  <i className="bi bi-chat-text" /> Send a Message
                </h3>
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'John Kamau' },
                  { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'john@email.com' },
                  { label: 'Phone Number *', key: 'phone', type: 'tel', placeholder: '0712 345 678' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input className="form-control" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-control" rows={4} value={form.message} onChange={e => set('message', e.target.value)} required placeholder="How can we help you today?" />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Contact Method</label>
                  <select className="form-control form-select" value={form.preferred_contact} onChange={e => set('preferred_contact', e.target.value)}>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="call">Phone Call</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-full">
                  {submitting ? <><i className="bi bi-hourglass-split" /> Sending...</> : <><i className="bi bi-send" /> Send Message</>}
                </button>
              </form>

              {/* Branches */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 16 }}>
                  <i className="bi bi-geo-alt" /> Our Branches
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {branches.length > 0 ? branches.map(b => (
                    <div key={b.id} className="branch-card">
                      <h4>
                        <i className="bi bi-building" style={{ color: 'var(--primary)' }} />
                        Bravin Cars — {b.city}
                        {b.is_headquarters && <span className="hq-badge">HQ</span>}
                      </h4>
                      <div className="branch-info-row"><i className="bi bi-geo-alt" /><span>{b.address}</span></div>
                      <div className="branch-info-row"><i className="bi bi-telephone" /><a href={`tel:${b.phone}`}>{b.phone}</a></div>
                      <div className="branch-info-row"><i className="bi bi-clock" /><span>{b.working_hours}</span></div>
                      <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" style={{ marginTop: 8 }}>
                        <i className="bi bi-whatsapp" /> WhatsApp this branch
                      </a>
                    </div>
                  )) : (
                    // Fallback branches
                    ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'].map(city => (
                      <div key={city} className="branch-card">
                        <h4><i className="bi bi-building" style={{ color: 'var(--primary)' }} /> Bravin Cars — {city} {city === 'Nairobi' && <span className="hq-badge">HQ</span>}</h4>
                        <div className="branch-info-row"><i className="bi bi-telephone" /><a href="tel:+254112284093">+254 112 284 093</a></div>
                        <div className="branch-info-row"><i className="bi bi-clock" /><span>Mon-Sat: 8AM-6PM</span></div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}