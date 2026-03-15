import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../services/api'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) { navigate('/admin-dashboard'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/token/', form)
      login({ username: form.username }, res.data.token)
      navigate('/admin-dashboard')
    } catch {
      // Try DRF token auth
      try {
        const res = await api.post('/api-token-auth/', form)
        login({ username: form.username }, res.data.token)
        navigate('/admin-dashboard')
      } catch {
        setError('Invalid username or password. Please try again.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--secondary), #2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24, color: 'white' }}>
            <i className="bi bi-car-front-fill" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gray-900)', marginBottom: 4 }}>
            <span style={{ color: 'var(--primary)' }}>Bravin</span> Cars
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Staff Login — Admin Portal</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: 'var(--danger)', fontSize: '0.875rem', display: 'flex', gap: 8 }}>
            <i className="bi bi-exclamation-circle-fill" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className="form-control"
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                placeholder="Staff username"
                style={{ paddingLeft: 36 }}
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                className="form-control"
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                placeholder="Your password"
                style={{ paddingLeft: 36 }}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }}>
            {loading ? <><i className="bi bi-hourglass-split" /> Signing in...</> : <><i className="bi bi-box-arrow-in-right" /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.83rem', color: 'var(--gray-500)' }}>
          <p>This portal is for Bravin Cars staff only.</p>
          <p style={{ marginTop: 4 }}>For admin panel: <a href="/admin" style={{ color: 'var(--primary)', fontWeight: 600 }}>Django Admin →</a></p>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--gray-200)', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--gray-500)', fontSize: '0.83rem' }}>
            <i className="bi bi-arrow-left" /> Back to Bravin Cars website
          </Link>
        </div>
      </div>
    </div>
  )
}