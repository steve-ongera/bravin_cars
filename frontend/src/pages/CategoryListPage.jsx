// CategoryListPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import FilterSidebar from '../components/FilterSidebar'
import { vehiclesAPI, CATEGORY_LABELS, CATEGORY_ICONS } from '../services/api'

export function CategoryListPage() {
  const { category } = useParams()
  const [vehicles, setVehicles] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [ordering, setOrdering] = useState('-created_at')
  const [filters, setFilters] = useState({ category })

  useEffect(() => {
    setFilters({ category })
    setPage(1)
  }, [category])

  useEffect(() => {
    setLoading(true)
    const params = { ...filters, page, ordering }
    Object.keys(params).forEach(k => { if (params[k] === undefined) delete params[k] })
    vehiclesAPI.list(params)
      .then(r => {
        const d = r.data
        setVehicles(d.results || d)
        setCount(d.count || (d.results || d).length)
      })
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false))
  }, [filters, page, ordering])

  const label = CATEGORY_LABELS[category] || category
  const icon = CATEGORY_ICONS[category] || 'bi-car-front'

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className={`bi ${icon}`} /> {label} for Sale in Kenya</h1>
          <p>Browse {count} {label} listings across all Bravin Cars branches</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <Link to="/vehicles">Vehicles</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>{label}</span>
          </div>
        </div>
      </div>
      <div className="section-sm">
        <div className="container">
          <div className="listings-layout">
            <FilterSidebar filters={filters} onChange={setFilters} onReset={() => setFilters({ category })} />
            <div>
              <div className="listings-header">
                <div className="listings-count">{loading ? 'Loading...' : `${count} ${label}${count !== 1 ? 's' : ''} found`}</div>
                <select value={ordering} onChange={e => setOrdering(e.target.value)}
                  style={{ padding: '7px 30px 7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.83rem', background: '#f9fafb' }}>
                  <option value="-created_at">Newest First</option>
                  <option value="price_ksh">Price: Low to High</option>
                  <option value="-price_ksh">Price: High to Low</option>
                  <option value="-year">Year: Newest</option>
                </select>
              </div>
              {loading ? (
                <div className="vehicles-grid">
                  {[...Array(8)].map((_, i) => <div key={i}><div className="skeleton" style={{ height: 180, borderRadius: 12 }} /></div>)}
                </div>
              ) : vehicles.length > 0 ? (
                <div className="vehicles-grid">
                  {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
                </div>
              ) : (
                <div className="empty-state">
                  <i className={`bi ${icon}`} />
                  <h3>No {label} found</h3>
                  <p>Try different filters or <Link to="/vehicles" style={{ color: 'var(--primary)' }}>browse all vehicles</Link></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryListPage

// ─── SearchResultsPage ─────────────────────────────────────────────
export function SearchResultsPage() {
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
              {[...Array(8)].map((_, i) => <div key={i}><div className="skeleton" style={{ height: 180, borderRadius: 12 }} /></div>)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Need to add useSearchParams import
import { useSearchParams } from 'react-router-dom'