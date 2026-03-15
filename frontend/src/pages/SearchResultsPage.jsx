import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import { vehiclesAPI } from '../services/api'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [vehicles, setVehicles] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) { setLoading(false); return }
    setLoading(true)
    vehiclesAPI.search(query)
      .then(r => {
        const d = r.data
        setVehicles(d.results || d)
        setCount(d.count || (d.results || d).length)
      })
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-search" /> Search Results</h1>
          <p>Results for "{query}"</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>Search: {query}</span>
          </div>
        </div>
      </div>
      <div className="section-sm">
        <div className="container">
          <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            {loading ? 'Searching...' : `Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`}
          </div>
          {loading ? (
            <div className="vehicles-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i}><div className="skeleton" style={{ height: 180, borderRadius: 12 }} /></div>
              ))}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="vehicles-grid">
              {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-search" />
              <h3>No results for "{query}"</h3>
              <p>Try different keywords, or <Link to="/vehicles" style={{ color: 'var(--primary)' }}>browse all vehicles</Link></p>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/vehicles" className="btn btn-primary btn-sm">All Cars</Link>
                <Link to="/imports" className="btn btn-outline btn-sm">Import a Car</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}