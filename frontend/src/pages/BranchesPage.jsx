import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { branchesAPI, whatsappURL } from '../services/api'

const FALLBACK_BRANCHES = [
  { id: 1, city: 'Nairobi', is_headquarters: true, address: 'Mombasa Road, Nairobi', phone: '+254 112 284 093', email: 'nairobi@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM, Sun: 10AM-4PM' },
  { id: 2, city: 'Mombasa', is_headquarters: false, address: 'Nyali, Mombasa', phone: '+254 112 284 094', email: 'mombasa@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM' },
  { id: 3, city: 'Kisumu', is_headquarters: false, address: 'Oginga Odinga St, Kisumu', phone: '+254 112 284 095', email: 'kisumu@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM' },
  { id: 4, city: 'Nakuru', is_headquarters: false, address: 'Kenyatta Ave, Nakuru', phone: '+254 112 284 096', email: 'nakuru@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM' },
  { id: 5, city: 'Eldoret', is_headquarters: false, address: 'Uganda Rd, Eldoret', phone: '+254 112 284 097', email: 'eldoret@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM' },
  { id: 6, city: 'Thika', is_headquarters: false, address: 'Commercial St, Thika', phone: '+254 112 284 098', email: 'thika@bravincars.co.ke', whatsapp: '254112284093', working_hours: 'Mon-Sat: 8AM-6PM' },
]

export default function BranchesPage() {
  const [branches, setBranches] = useState([])

  useEffect(() => {
    branchesAPI.list()
      .then(r => {
        const data = r.data.results || r.data
        setBranches(data.length ? data : FALLBACK_BRANCHES)
      })
      .catch(() => setBranches(FALLBACK_BRANCHES))
  }, [])

  const display = branches.length ? branches : FALLBACK_BRANCHES

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-geo-alt" /> Our Branches</h1>
          <p>Find Bravin Cars across {display.length} cities in Kenya</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>Branches</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Branch Map Placeholder */}
          <div style={{ background: 'linear-gradient(135deg, var(--secondary), #1e2d4a)', borderRadius: 16, padding: 32, marginBottom: 32, color: 'white', textAlign: 'center' }}>
            <i className="bi bi-map" style={{ fontSize: '2.5rem', opacity: 0.6, display: 'block', marginBottom: 12 }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Find Us on the Map</h3>
            <p style={{ opacity: 0.8, marginBottom: 16 }}>We have {display.length} branches across Kenya's major cities</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {display.map(b => (
                <span key={b.id} style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem' }}>
                  📍 {b.city} {b.is_headquarters ? '(HQ)' : ''}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {display.map(branch => (
              <div key={branch.id} className="branch-card">
                <h4>
                  <i className="bi bi-building" style={{ color: 'var(--primary)' }} />
                  Bravin Cars — {branch.city}
                  {branch.is_headquarters && <span className="hq-badge">HQ</span>}
                </h4>
                <div className="branch-info-row">
                  <i className="bi bi-geo-alt" />
                  <span>{branch.address}</span>
                </div>
                <div className="branch-info-row">
                  <i className="bi bi-telephone" />
                  <a href={`tel:${branch.phone}`}>{branch.phone}</a>
                </div>
                <div className="branch-info-row">
                  <i className="bi bi-envelope" />
                  <a href={`mailto:${branch.email}`}>{branch.email}</a>
                </div>
                <div className="branch-info-row">
                  <i className="bi bi-clock" />
                  <span>{branch.working_hours}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <a
                    href={`https://wa.me/${branch.whatsapp}?text=Hello! I'm inquiring from your ${branch.city} branch.`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <i className="bi bi-whatsapp" /> WhatsApp
                  </a>
                  <a href={`tel:${branch.phone}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    <i className="bi bi-telephone" /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 40, textAlign: 'center', padding: '32px', background: 'var(--primary-light)', borderRadius: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Can't find a branch near you?</h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: 16 }}>We offer delivery and can arrange viewings at a location convenient for you.</p>
            <a href={whatsappURL('Hello! I want to view a car but there\'s no branch near me. Can you help?')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <i className="bi bi-whatsapp" /> Ask About Delivery
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}