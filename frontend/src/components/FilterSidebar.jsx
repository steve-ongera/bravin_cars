import React, { useState, useEffect } from 'react'
import { brandsAPI } from '../services/api'

const CATEGORIES = [
  { key: 'sedan', label: 'Sedan' },
  { key: 'suv', label: 'SUV' },
  { key: 'pickup', label: 'Pickup / Truck' },
  { key: 'hatchback', label: 'Hatchback' },
  { key: 'coupe', label: 'Coupe' },
  { key: 'minivan', label: 'Minivan / MPV' },
  { key: 'wagon', label: 'Station Wagon' },
  { key: 'sports', label: 'Sports Car' },
  { key: 'electric', label: 'Electric' },
  { key: 'hybrid', label: 'Hybrid' },
  { key: 'van', label: 'Van / Bus' },
  { key: 'lorry', label: 'Lorry' },
]

const FUEL_TYPES = [
  { key: 'petrol', label: 'Petrol' },
  { key: 'diesel', label: 'Diesel' },
  { key: 'electric', label: 'Electric' },
  { key: 'hybrid', label: 'Hybrid' },
]

const TRANSMISSIONS = [
  { key: 'automatic', label: 'Automatic' },
  { key: 'manual', label: 'Manual' },
  { key: 'cvt', label: 'CVT' },
]

const CONDITIONS = [
  { key: 'new', label: 'Brand New' },
  { key: 'foreign_used', label: 'Foreign Used' },
  { key: 'local_used', label: 'Locally Used' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i)

export default function FilterSidebar({ filters, onChange, onReset }) {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    brandsAPI.list().then(r => setBrands(r.data.results || r.data)).catch(() => {})
  }, [])

  const set = (key, val) => onChange({ ...filters, [key]: val })

  const toggleCheckbox = (key, val) => {
    const current = filters[key] || []
    const updated = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val]
    set(key, updated.length ? updated : undefined)
  }

  const isChecked = (key, val) => (filters[key] || []).includes(val)

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-header">
        <i className="bi bi-sliders" /> Filter Vehicles
      </div>

      {/* Brand */}
      <div className="filter-section">
        <div className="filter-section-title">Brand / Make</div>
        <select
          className="form-select"
          value={filters.brand || ''}
          onChange={e => set('brand', e.target.value || undefined)}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="filter-section">
        <div className="filter-section-title">Body Type</div>
        <div className="filter-checkbox-list">
          {CATEGORIES.map(c => (
            <label key={c.key} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('category', c.key)}
                onChange={() => toggleCheckbox('category', c.key)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Year Range */}
      <div className="filter-section">
        <div className="filter-section-title">Year of Manufacture</div>
        <div className="price-range-row">
          <select
            className="form-select"
            value={filters.year_min || ''}
            onChange={e => set('year_min', e.target.value || undefined)}
          >
            <option value="">From</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            className="form-select"
            value={filters.year_max || ''}
            onChange={e => set('year_max', e.target.value || undefined)}
          >
            <option value="">To</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="filter-section-title">Price Range (KES)</div>
        <div className="price-range-row">
          <input
            type="number"
            placeholder="Min"
            value={filters.price_min || ''}
            onChange={e => set('price_min', e.target.value || undefined)}
            style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.83rem', outline: 'none' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.price_max || ''}
            onChange={e => set('price_max', e.target.value || undefined)}
            style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.83rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div className="filter-section">
        <div className="filter-section-title">Fuel Type</div>
        <div className="filter-checkbox-list">
          {FUEL_TYPES.map(f => (
            <label key={f.key} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('fuel_type', f.key)}
                onChange={() => toggleCheckbox('fuel_type', f.key)}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="filter-section">
        <div className="filter-section-title">Transmission</div>
        <div className="filter-checkbox-list">
          {TRANSMISSIONS.map(t => (
            <label key={t.key} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('transmission', t.key)}
                onChange={() => toggleCheckbox('transmission', t.key)}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="filter-section">
        <div className="filter-section-title">Condition</div>
        <div className="filter-checkbox-list">
          {CONDITIONS.map(c => (
            <label key={c.key} className="filter-checkbox">
              <input
                type="checkbox"
                checked={isChecked('condition', c.key)}
                onChange={() => toggleCheckbox('condition', c.key)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Import toggle */}
      <div className="filter-section">
        <div className="filter-section-title">Listing Type</div>
        <div className="filter-checkbox-list">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.is_import === 'true' || filters.is_import === true}
              onChange={e => set('is_import', e.target.checked ? true : undefined)}
            />
            Import Vehicles Only
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.is_featured === 'true' || filters.is_featured === true}
              onChange={e => set('is_featured', e.target.checked ? true : undefined)}
            />
            Featured Only
          </label>
        </div>
      </div>

      {/* Reset */}
      <div className="filter-section">
        <button
          className="btn btn-outline btn-full btn-sm"
          onClick={onReset}
          style={{ justifyContent: 'center' }}
        >
          <i className="bi bi-arrow-counterclockwise" /> Reset Filters
        </button>
      </div>
    </div>
  )
}