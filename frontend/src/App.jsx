import React, { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import IndexPage from './pages/IndexPage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import CategoryListPage from './pages/CategoryListPage'
import SearchResultsPage from './pages/SearchResultsPage'
import SellCarPage from './pages/SellCarPage'
import ImportPage from './pages/ImportPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import CareersPage from './pages/CareersPage'
import FAQPage from './pages/FAQPage'
import InspectionPage from './pages/InspectionPage'
import BranchesPage from './pages/BranchesPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'

// ─── Auth Context ─────────────────────────────────────
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

// ─── Toast Context ────────────────────────────────────
export const ToastContext = createContext(null)

export function useToast() {
  return useContext(ToastContext)
}

// ─── Protected Route ──────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// ─── App Root ─────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bravin_user')
    return stored ? JSON.parse(stored) : null
  })
  const [toasts, setToasts] = useState([])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('bravin_user', JSON.stringify(userData))
    localStorage.setItem('bravin_token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bravin_user')
    localStorage.removeItem('bravin_token')
  }

  const addToast = (type, title, message, duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastContext.Provider value={{ addToast }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="vehicles/:slug" element={<VehicleDetailPage />} />
              <Route path="category/:category" element={<CategoryListPage />} />
              <Route path="brand/:brand" element={<VehiclesPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="sell-your-car" element={<SellCarPage />} />
              <Route path="imports" element={<ImportPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="inspection" element={<InspectionPage />} />
              <Route path="branches" element={<BranchesPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
          </Routes>

          {/* Toast Notifications */}
          <div className="toast-container">
            {toasts.map(toast => (
              <div key={toast.id} className={`toast ${toast.type}`}>
                <i className={`toast-icon bi ${
                  toast.type === 'success' ? 'bi-check-circle-fill' :
                  toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'
                }`} />
                <div className="toast-body">
                  <div className="toast-title">{toast.title}</div>
                  <div className="toast-msg">{toast.message}</div>
                </div>
              </div>
            ))}
          </div>
        </BrowserRouter>
      </ToastContext.Provider>
    </AuthContext.Provider>
  )
}