import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../services/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [inquiries, setInquiries] = useState([])
  const [commissions, setCommissions] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/vehicles/stats/'),
      api.get('/inquiries/'),
      api.get('/commissions/'),
    ]).then(([s, i, c]) => {
      setStats(s.data || {})
      setInquiries((i.data.results || i.data || []).slice(0, 10))
      setCommissions((c.data.results || c.data || []).slice(0, 10))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const TABS = [
    { key: 'overview', label: 'Overview', icon: 'bi-grid' },
    { key: 'inquiries', label: 'Inquiries', icon: 'bi-chat-text' },
    { key: 'commissions', label: 'Commission Cars', icon: 'bi-tags' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Dashboard Header */}
      <div style={{ background: 'var(--secondary)', color: 'white', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <i className="bi bi-car-front-fill" style={{ fontSize: 20, color: 'var(--primary)' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Bravin Cars — Staff Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '0.83rem', opacity: 0.8 }}>👋 {user?.username}</span>
          <a href="/admin" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6 }}>
            Django Admin
          </a>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 6 }}>
            Website
          </Link>
          <button onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.83rem', padding: '6px 12px', background: 'var(--primary)', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: 'var(--white)', borderRight: '1px solid var(--gray-200)', padding: '16px 0', flexShrink: 0 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 20px',
                background: activeTab === t.key ? 'var(--primary-light)' : 'none',
                color: activeTab === t.key ? 'var(--primary)' : 'var(--gray-700)',
                borderLeft: activeTab === t.key ? '3px solid var(--primary)' : '3px solid transparent',
                border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, textAlign: 'left',
              }}
            >
              <i className={`bi ${t.icon}`} /> {t.label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--gray-100)', margin: '8px 0' }} />
          <a href="/admin/core/vehicle/add/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500 }}>
            <i className="bi bi-plus-circle" /> Add Vehicle
          </a>
          <a href="/admin/core/brand/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500 }}>
            <i className="bi bi-bookmarks" /> Brands
          </a>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />)}
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>Dashboard Overview</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
                    {[
                      { label: 'Active Vehicles', val: stats.total_vehicles || 0, icon: 'bi-car-front', color: 'var(--primary)', bg: 'var(--primary-light)' },
                      { label: 'Total Brands', val: stats.total_brands || 0, icon: 'bi-bookmarks', color: 'var(--info)', bg: '#dbeafe' },
                      { label: 'Branches', val: stats.total_branches || 0, icon: 'bi-geo-alt', color: 'var(--success)', bg: '#dcfce7' },
                      { label: 'Featured Cars', val: stats.featured_count || 0, icon: 'bi-star', color: '#ca8a04', bg: '#fef9c3' },
                      { label: 'Import Stock', val: stats.import_count || 0, icon: 'bi-globe', color: '#7c3aed', bg: '#ede9fe' },
                      { label: 'New Inquiries', val: inquiries.filter(i => i.status === 'new').length, icon: 'bi-chat-dots', color: 'var(--primary)', bg: 'var(--primary-light)' },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: s.color }}>{s.val}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
                          </div>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={`bi ${s.icon}`} style={{ color: s.color }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                    {/* Recent Inquiries */}
                    <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: 16 }}>Recent Inquiries</h3>
                      {inquiries.slice(0, 5).map(inq => (
                        <div key={inq.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{inq.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{inq.phone} · {inq.preferred_contact}</div>
                          </div>
                          <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.68rem', fontWeight: 700, background: inq.status === 'new' ? '#dbeafe' : '#f3f4f6', color: inq.status === 'new' ? 'var(--info)' : 'var(--gray-500)' }}>
                            {inq.status}
                          </span>
                        </div>
                      ))}
                      {inquiries.length === 0 && <p style={{ fontSize: '0.83rem', color: 'var(--gray-400)' }}>No inquiries yet</p>}
                    </div>

                    {/* Quick Links */}
                    <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20 }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', marginBottom: 16 }}>Quick Actions</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { href: '/admin/core/vehicle/add/', label: 'Add New Vehicle', icon: 'bi-plus-circle', color: 'var(--primary)' },
                          { href: '/admin/core/vehicle/', label: 'Manage Vehicles', icon: 'bi-car-front', color: 'var(--info)' },
                          { href: '/admin/core/commissionsubmission/', label: 'Commission Cars', icon: 'bi-tags', color: 'var(--success)' },
                          { href: '/admin/core/inquiry/', label: 'View All Inquiries', icon: 'bi-chat-text', color: '#7c3aed' },
                          { href: '/admin/core/importorder/', label: 'Import Orders', icon: 'bi-globe', color: '#ca8a04' },
                          { href: '/admin/core/inspectionbooking/', label: 'Inspection Bookings', icon: 'bi-shield-check', color: 'var(--danger)' },
                        ].map(l => (
                          <a key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'var(--gray-50)', fontSize: '0.875rem', color: 'var(--gray-700)', fontWeight: 500, border: '1px solid var(--gray-100)' }}>
                            <i className={`bi ${l.icon}`} style={{ color: l.color }} /> {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)' }}>Customer Inquiries</h2>
                    <a href="/admin/core/inquiry/" className="btn btn-outline btn-sm">View in Admin</a>
                  </div>
                  <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden' }}>
                    {inquiries.length === 0 ? (
                      <div className="empty-state"><i className="bi bi-chat-text" /><h3>No inquiries</h3></div>
                    ) : (
                      <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                            {['Name', 'Contact', 'Vehicle', 'Preferred', 'Status', 'Date'].map(h => (
                              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--gray-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.map(inq => (
                            <tr key={inq.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                              <td style={{ padding: '10px 14px', fontWeight: 600 }}>{inq.name}</td>
                              <td style={{ padding: '10px 14px', color: 'var(--gray-600)' }}>{inq.phone}<br /><span style={{ fontSize: '0.75rem' }}>{inq.email}</span></td>
                              <td style={{ padding: '10px 14px', color: 'var(--gray-600)', maxWidth: 150 }}>{inq.vehicle_title || '—'}</td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{ background: '#dcfce7', color: 'var(--success)', padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 }}>{inq.preferred_contact}</span>
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, background: inq.status === 'new' ? '#dbeafe' : '#f3f4f6', color: inq.status === 'new' ? 'var(--info)' : 'var(--gray-500)' }}>
                                  {inq.status}
                                </span>
                              </td>
                              <td style={{ padding: '10px 14px', color: 'var(--gray-400)', fontSize: '0.75rem' }}>
                                {new Date(inq.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'commissions' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)' }}>Commission Submissions</h2>
                    <a href="/admin/core/commissionsubmission/" className="btn btn-outline btn-sm">View in Admin</a>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {commissions.length === 0 ? (
                      <div className="empty-state"><i className="bi bi-tags" /><h3>No submissions yet</h3></div>
                    ) : commissions.map(c => (
                      <div key={c.id} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.year} {c.brand} {c.model}</div>
                          <div style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>{c.seller_name} · {c.seller_phone}</div>
                          <div style={{ fontSize: '0.83rem', color: 'var(--primary)', fontWeight: 700 }}>KES {Number(c.asking_price_ksh).toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, background: c.is_reviewed ? '#dcfce7' : '#fef9c3', color: c.is_reviewed ? 'var(--success)' : '#ca8a04' }}>
                            {c.is_reviewed ? 'Reviewed' : 'Pending'}
                          </span>
                          <a href={`https://wa.me/${c.seller_phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm">
                            <i className="bi bi-whatsapp" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}