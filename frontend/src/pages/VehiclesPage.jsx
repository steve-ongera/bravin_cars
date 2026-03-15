import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
import VehicleCard from '../components/VehicleCard'
import FilterSidebar from '../components/FilterSidebar'
import { vehiclesAPI } from '../services/api'

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { brand } = useParams()

  const [vehicles, setVehicles] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [ordering, setOrdering] = useState('-created_at')

  // Build initial filters from URL params
  const getInitialFilters = () => {
    const f = {}
    for (const [key, val] of searchParams.entries()) {
      f[key] = val
    }
    if (brand) f.brand = brand
    return f
  }

  const [filters, setFilters] = useState(getInitialFilters)

  const fetchVehicles = useCallback(async (pg = 1) => {
    setLoading(true)
    try {
      const params = { ...filters, page: pg, ordering }
      // Handle arrays
      Object.keys(params).forEach(k => {
        if (Array.isArray(params[k])) params[k] = params[k].join(',')
        if (params[k] === undefined) delete params[k]
      })
      const res = await vehiclesAPI.list(params)
      const data = res.data
      setVehicles(data.results || data)
      const total = data.count || (data.results || data).length
      setCount(total)
      setTotalPages(data.next || data.previous ? Math.ceil(total / 12) : 1)
    } catch { setVehicles([]) } finally { setLoading(false) }
  }, [filters, ordering])

  useEffect(() => { setPage(1); fetchVehicles(1) }, [filters, ordering])
  useEffect(() => { if (page > 1) fetchVehicles(page) }, [page])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleReset = () => {
    setFilters(brand ? { brand } : {})
    setPage(1)
  }

  const pageTitle = brand
    ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} Cars`
    : searchParams.get('category')
      ? `${searchParams.get('category').charAt(0).toUpperCase() + searchParams.get('category').slice(1)} Vehicles`
      : 'All Vehicles'

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-car-front" /> {pageTitle}</h1>
          <p>Browse our full inventory of quality vehicles across Kenya</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep"><i className="bi bi-chevron-right" /></span>
            <span>{pageTitle}</span>
          </div>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          {/* Mobile Filter Toggle */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }} className="hide-desktop">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setMobileFilterOpen(o => !o)}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <i className="bi bi-sliders" /> Filter
            </button>
            <select
              className="form-select"
              style={{ flex: 1, padding: '7px 30px 7px 10px' }}
              value={ordering}
              onChange={e => setOrdering(e.target.value)}
            >
              <option value="-created_at">Newest First</option>
              <option value="price_ksh">Price: Low to High</option>
              <option value="-price_ksh">Price: High to Low</option>
              <option value="-year">Year: Newest</option>
              <option value="year">Year: Oldest</option>
              <option value="-views">Most Viewed</option>
            </select>
          </div>

          <div className="listings-layout">
            {/* Filter Sidebar - Desktop always, Mobile conditional */}
            <div style={{ display: mobileFilterOpen ? 'block' : undefined }}>
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>

            {/* Listings */}
            <div>
              <div className="listings-header">
                <div className="listings-count">
                  {loading ? 'Loading...' : `${count} vehicle${count !== 1 ? 's' : ''} found`}
                </div>
                <div className="listings-sort hide-mobile">
                  <span style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>Sort:</span>
                  <select
                    className="form-select"
                    style={{ padding: '7px 30px 7px 10px', fontSize: '0.83rem' }}
                    value={ordering}
                    onChange={e => setOrdering(e.target.value)}
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="price_ksh">Price: Low to High</option>
                    <option value="-price_ksh">Price: High to Low</option>
                    <option value="-year">Year: Newest</option>
                    <option value="year">Year: Oldest</option>
                    <option value="-views">Most Viewed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="vehicles-grid">
                  {[...Array(12)].map((_, i) => (
                    <div key={i}>
                      <div className="skeleton" style={{ height: 180, borderRadius: 12, marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 16, marginBottom: 6, borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
              ) : vehicles.length > 0 ? (
                <>
                  <div className="vehicles-grid">
                    {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="page-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                      >
                        <i className="bi bi-chevron-left" />
                      </button>
                      {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                        const pg = i + 1
                        return (
                          <button
                            key={pg}
                            className={`page-btn ${page === pg ? 'active' : ''}`}
                            onClick={() => setPage(pg)}
                          >
                            {pg}
                          </button>
                        )
                      })}
                      <button
                        className="page-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                      >
                        <i className="bi bi-chevron-right" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <i className="bi bi-search" />
                  <h3>No vehicles found</h3>
                  <p>Try adjusting your filters or <button onClick={handleReset} style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>reset all filters</button></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}