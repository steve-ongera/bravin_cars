import React from 'react'
import { Link } from 'react-router-dom'
import { whatsappURL } from '../services/api'

export default function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-info-circle" /> About Bravin Cars</h1>
          <p>Kenya's trusted car dealership since 2010</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>About Us</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 960 }}>
          {/* Mission */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 48 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: 16 }}>
                Kenya's Most Trusted <span style={{ color: 'var(--primary)' }}>Car Dealership</span>
              </h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 14 }}>
                Bravin Cars was founded with a simple mission: to make buying and selling quality vehicles in Kenya transparent, easy, and affordable for every Kenyan.
              </p>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 20 }}>
                From humble beginnings in Nairobi, we've grown to 8 branches across Kenya's major cities, having served over 5,000 satisfied customers. We specialize in quality foreign-used imports from Japan and UAE, locally available vehicles, and commission sales.
              </p>
              <a href={whatsappURL('Hello Bravin Cars! I\'d like to know more about you.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="bi bi-whatsapp" /> Chat With Us
              </a>
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--secondary), #2d1b4e)', borderRadius: 16, padding: 32, color: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 24 }}>By the Numbers</h3>
              {[
                { num: '15+', label: 'Years in Business' },
                { num: '5,000+', label: 'Happy Customers' },
                { num: '8', label: 'Branches in Kenya' },
                { num: '500+', label: 'Cars in Stock' },
                { num: '40+', label: 'Brands Available' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ opacity: 0.8, fontSize: '0.875rem' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent)' }}>{s.num}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: 24, textAlign: 'center' }}>Our Values</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { icon: 'bi-patch-check', title: 'Transparency', desc: 'Honest pricing, no hidden charges or surprises.' },
                { icon: 'bi-shield-check', title: 'Quality', desc: 'Every car is inspected and verified before listing.' },
                { icon: 'bi-people', title: 'Customer First', desc: 'Your satisfaction drives everything we do.' },
                { icon: 'bi-lightning', title: 'Efficiency', desc: 'Fast processes, quick responses, no time-wasting.' },
              ].map(v => (
                <div key={v.title} style={{ textAlign: 'center', padding: '24px 16px', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12 }}>
                  <i className={`bi ${v.icon}`} style={{ fontSize: '2rem', color: 'var(--primary)', display: 'block', marginBottom: 10 }} />
                  <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 6 }}>{v.title}</h4>
                  <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services Summary */}
          <div style={{ background: 'var(--gray-50)', borderRadius: 16, padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: 20 }}>What We Offer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'bi-car-front', title: 'Vehicle Sales', desc: 'Wide range of sedans, SUVs, pickups, hatchbacks, and more across all budget ranges.' },
                { icon: 'bi-globe', title: 'Car Imports', desc: 'Direct imports from Japan, UAE, UK, and USA with full customs clearance and documentation.' },
                { icon: 'bi-tags', title: 'Commission Sales', desc: 'Sell your car through us — we market it, handle buyers, and get you the best price.' },
                { icon: 'bi-shield-check', title: 'Car Inspection', desc: 'Pre-purchase, roadworthy, and full vehicle inspection services at all branches.' },
                { icon: 'bi-geo-alt', title: '8 Branches Across Kenya', desc: 'Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Thika, Nyeri & Meru.' },
              ].map(s => (
                <div key={s.title} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--gray-200)' }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: '1.3rem', color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: 3 }}>{s.title}</h4>
                    <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}