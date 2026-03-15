import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { newsletterAPI, whatsappURL } from '../services/api'
import { useToast } from '../App'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const { addToast } = useToast()

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      await newsletterAPI.subscribe(email)
      addToast('success', 'Subscribed!', 'You will receive our latest car deals.')
      setEmail('')
    } catch {
      addToast('error', 'Already subscribed', 'This email is already on our list.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <span className="logo-text"><span>Bravin</span> Cars</span>
            <p>Kenya's trusted car dealership. We offer quality vehicles, imports from Japan & UAE, and professional inspection services across all major cities.</p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="bi bi-facebook" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="bi bi-instagram" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="bi bi-twitter-x" /></a>
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer" className="social-btn"><i className="bi bi-whatsapp" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="bi bi-youtube" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/vehicles"><i className="bi bi-chevron-right" />All Vehicles</Link>
              <Link to="/imports"><i className="bi bi-chevron-right" />Import a Car</Link>
              <Link to="/sell-your-car"><i className="bi bi-chevron-right" />Sell Your Car</Link>
              <Link to="/inspection"><i className="bi bi-chevron-right" />Car Inspection</Link>
              <Link to="/branches"><i className="bi bi-chevron-right" />Our Branches</Link>
              <Link to="/about"><i className="bi bi-chevron-right" />About Us</Link>
            </div>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <div className="footer-links">
              <Link to="/contact"><i className="bi bi-chevron-right" />Contact Us</Link>
              <Link to="/faq"><i className="bi bi-chevron-right" />FAQs</Link>
              <Link to="/careers"><i className="bi bi-chevron-right" />Careers</Link>
              <Link to="/inspection"><i className="bi bi-chevron-right" />Book Inspection</Link>
              <a href={whatsappURL()} target="_blank" rel="noopener noreferrer"><i className="bi bi-chevron-right" />WhatsApp Chat</a>
              <Link to="/login"><i className="bi bi-chevron-right" />Staff Login</Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-links" style={{ marginBottom: 16 }}>
              <a href="tel:+254112284093"><i className="bi bi-telephone-fill" />+254 112 284 093</a>
              <a href="mailto:info@bravincars.co.ke"><i className="bi bi-envelope-fill" />info@bravincars.co.ke</a>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                <i className="bi bi-geo-alt-fill" />Nairobi HQ & 7 Branches
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Newsletter</div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 6 }}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: '0.8rem', outline: 'none' }}
              />
              <button
                type="submit"
                disabled={subscribing}
                style={{ background: 'var(--primary)', color: 'white', padding: '8px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', flexShrink: 0 }}
              >
                {subscribing ? '...' : <i className="bi bi-send" />}
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bravin Cars. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <span>Built with ❤️ in Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  )
}