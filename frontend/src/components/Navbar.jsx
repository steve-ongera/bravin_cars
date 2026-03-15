import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import { whatsappURL, CATEGORY_LABELS, CATEGORY_ICONS } from '../services/api'

const CATEGORIES = Object.entries(CATEGORY_LABELS).slice(0, 8)
const WA_NUMBER = '254112284093'

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: 'bi-house' },
    { to: '/vehicles', label: 'All Cars', icon: 'bi-car-front' },
    { to: '/imports', label: 'Imports', icon: 'bi-globe' },
    { to: '/sell-your-car', label: 'Sell Your Car', icon: 'bi-tags' },
    { to: '/inspection', label: 'Car Inspection', icon: 'bi-shield-check' },
    { to: '/branches', label: 'Our Branches', icon: 'bi-geo-alt' },
    { to: '/about', label: 'About Us', icon: 'bi-info-circle' },
    { to: '/contact', label: 'Contact Us', icon: 'bi-telephone' },
    { to: '/faq', label: 'FAQs', icon: 'bi-question-circle' },
    { to: '/careers', label: 'Careers', icon: 'bi-briefcase' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-inner">
            <div className="top-bar-links">
              <a href={`tel:+${WA_NUMBER}`}><i className="bi bi-telephone-fill" /> +254 112 284 093</a>
              <span className="sep">|</span>
              <a href="mailto:info@bravincars.co.ke"><i className="bi bi-envelope-fill" /> info@bravincars.co.ke</a>
            </div>
            <div className="top-bar-links extra-links">
              <Link to="/branches">Branches</Link>
              <span className="sep">|</span>
              <Link to="/careers">Careers</Link>
              <span className="sep">|</span>
              <Link to="/faq">FAQs</Link>
              {user && (
                <>
                  <span className="sep">|</span>
                  <Link to="/admin-dashboard"><i className="bi bi-grid" /> Dashboard</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Hamburger */}
            <button className="navbar-hamburger hide-desktop" onClick={() => setSidebarOpen(true)}>
              <i className="bi bi-list" />
            </button>

            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <div className="logo-icon"><i className="bi bi-car-front-fill" /></div>
              <div className="logo-text"><span>Bravin</span> Cars</div>
            </Link>

            {/* Search Bar */}
            <form className="navbar-search hide-mobile" onSubmit={handleSearch}>
              <i className="bi bi-search search-icon" />
              <input
                type="text"
                placeholder="Search by brand, model, year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            {/* Actions */}
            <div className="navbar-actions">
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="navbar-whatsapp">
                <i className="bi bi-whatsapp" />
                <span className="hide-mobile">WhatsApp Us</span>
              </a>
              <Link to="/sell-your-car" className="navbar-sell-btn">
                <i className="bi bi-plus-circle" /> Sell Car
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Nav Bar */}
      <div className="nav-secondary hide-mobile">
        <div className="container">
          <div className="nav-secondary-inner">
            <Link to="/vehicles" className={`nav-cat-link ${location.pathname === '/vehicles' ? 'active' : ''}`}>
              <i className="bi bi-grid" /> All Vehicles
            </Link>
            {CATEGORIES.map(([key, label]) => (
              <Link
                key={key}
                to={`/category/${key}`}
                className={`nav-cat-link ${location.pathname === `/category/${key}` ? 'active' : ''}`}
              >
                <i className={`bi ${CATEGORY_ICONS[key] || 'bi-car-front'}`} />
                {label}
              </Link>
            ))}
            <Link to="/imports" className={`nav-cat-link ${location.pathname === '/imports' ? 'active' : ''}`}>
              <i className="bi bi-globe" /> Imports
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-text"><span>Bravin</span> Cars</div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Mobile Search */}
        <form style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }} onSubmit={handleSearch}>
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 14 }} />
            <input
              style={{ width: '100%', padding: '9px 14px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }}
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="sidebar-nav">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-nav-item ${location.pathname === to ? 'active' : ''}`}
            >
              <i className={`bi ${icon}`} />
              {label}
            </Link>
          ))}

          <div className="sidebar-divider" />
          <div className="sidebar-section-title">Browse by Category</div>
          {CATEGORIES.map(([key, label]) => (
            <Link key={key} to={`/category/${key}`} className="sidebar-nav-item">
              <i className={`bi ${CATEGORY_ICONS[key] || 'bi-car-front'}`} />
              {label}
            </Link>
          ))}
          {user && (
            <>
              <div className="sidebar-divider" />
              <Link to="/admin-dashboard" className="sidebar-nav-item">
                <i className="bi bi-grid-3x3-gap" /> Admin Dashboard
              </Link>
              <Link to="/login" className="sidebar-nav-item">
                <i className="bi bi-box-arrow-right" /> Logout
              </Link>
            </>
          )}
          {!user && (
            <>
              <div className="sidebar-divider" />
              <Link to="/login" className="sidebar-nav-item">
                <i className="bi bi-person-circle" /> Staff Login
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="sidebar-whatsapp-btn">
            <i className="bi bi-whatsapp" /> Chat on WhatsApp
          </a>
        </div>
      </aside>
    </>
  )
}