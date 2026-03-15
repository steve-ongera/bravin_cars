import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { careersAPI, branchesAPI } from '../services/api'
import { useToast } from '../App'

const POSITIONS = [
  { value: 'sales_executive', label: 'Sales Executive' },
  { value: 'mechanic', label: 'Mechanic / Technician' },
  { value: 'driver', label: 'Driver' },
  { value: 'admin', label: 'Administrative Staff' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance & Accounts' },
  { value: 'it', label: 'IT Support' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'other', label: 'Other' },
]

export default function CareersPage() {
  const { addToast } = useToast()
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', position_applied: 'sales_executive', preferred_branch: '', cover_letter: '' })
  const [cv, setCv] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => { branchesAPI.list().then(r => setBranches(r.data.results || r.data)).catch(() => {}) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cv) { addToast('error', 'CV Required', 'Please upload your CV.'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v))
      fd.append('cv', cv)
      await careersAPI.apply(fd)
      setDone(true)
      addToast('success', 'Application Submitted!', 'We\'ll review your application and contact shortlisted candidates.')
    } catch { addToast('error', 'Failed', 'Please try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-briefcase" /> Careers at Bravin Cars</h1>
          <p>Join Kenya's fastest-growing car dealership. Build a rewarding career with us.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>Careers</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          {/* Why Work with Us */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 20 }}>Why Work at Bravin Cars?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {[
                { icon: 'bi-graph-up', title: 'Career Growth', desc: 'Clear promotion paths and professional development programs.' },
                { icon: 'bi-cash-coin', title: 'Competitive Pay', desc: 'Salary + performance-based commissions and bonuses.' },
                { icon: 'bi-people', title: 'Great Team', desc: 'Work with passionate, driven, and supportive colleagues.' },
                { icon: 'bi-geo-alt', title: 'Multiple Locations', desc: 'Opportunities across 8 branches in Kenya\'s major cities.' },
              ].map(b => (
                <div key={b.title} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 18, display: 'flex', gap: 12 }}>
                  <i className={`bi ${b.icon}`} style={{ fontSize: '1.5rem', color: 'var(--primary)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', marginBottom: 4 }}>{b.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: 16 }}>Open Positions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {POSITIONS.slice(0, 6).map(p => (
                <div key={p.value} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid var(--gray-200)', borderRadius: 10, background: 'var(--white)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Multiple Branches — Full Time</div>
                  </div>
                  <span style={{ background: '#dcfce7', color: 'var(--success)', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>OPEN</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form */}
          {done ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12 }}>
              <div style={{ fontSize: '3rem', color: 'var(--success)', marginBottom: 12 }}><i className="bi bi-check-circle-fill" /></div>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Application Received!</h2>
              <p style={{ color: 'var(--gray-500)' }}>Thank you for applying. We'll review your application and contact shortlisted candidates within 2 weeks.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 20 }}>
                <i className="bi bi-person-plus" /> Apply Now
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'Full Name *', key: 'full_name', type: 'text', placeholder: 'Jane Wanjiku' },
                  { label: 'Email *', key: 'email', type: 'email', placeholder: 'jane@email.com' },
                  { label: 'Phone *', key: 'phone', type: 'tel', placeholder: '0712 345 678' },
                ].map(f => (
                  <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-control" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} required placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Position *</label>
                  <select className="form-control form-select" value={form.position_applied} onChange={e => set('position_applied', e.target.value)}>
                    {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Branch</label>
                  <select className="form-control form-select" value={form.preferred_branch} onChange={e => set('preferred_branch', e.target.value)}>
                    <option value="">Any Branch</option>
                    {branches.map(b => <option key={b.id} value={b.id}>{b.city}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter *</label>
                <textarea className="form-control" rows={5} value={form.cover_letter} onChange={e => set('cover_letter', e.target.value)} required placeholder="Tell us about yourself, your experience, and why you want to work at Bravin Cars..." />
              </div>
              <div className="form-group">
                <label className="form-label">Upload CV / Resume *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setCv(e.target.files[0])}
                  required
                  style={{ display: 'block', padding: '8px', border: '1.5px solid var(--gray-200)', borderRadius: 8, width: '100%', fontSize: '0.875rem' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>PDF, DOC, or DOCX (max 5MB)</p>
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary btn-full btn-lg">
                {submitting ? <><i className="bi bi-hourglass-split" /> Submitting...</> : <><i className="bi bi-send" /> Submit Application</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}