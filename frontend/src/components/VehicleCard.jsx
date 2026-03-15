import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, formatMileage, whatsappVehicle } from '../services/api'

const MEDIA_BASE = 'http://localhost:8000'

function getImageUrl(img) {
  if (!img) return null
  const src = img.image || img
  if (src.startsWith('http')) return src
  return MEDIA_BASE + src
}

export default function VehicleCard({ vehicle }) {
  const primaryImg = vehicle.primary_image
  const imgUrl = getImageUrl(primaryImg)

  const conditionClass = {
    new: 'condition-new',
    foreign_used: 'condition-foreign_used',
    local_used: 'condition-local_used',
  }[vehicle.condition] || 'condition-local_used'

  const conditionLabel = {
    new: 'Brand New',
    foreign_used: 'Foreign Used',
    local_used: 'Local Used',
  }[vehicle.condition] || vehicle.condition

  return (
    <div className="vehicle-card">
      <Link to={`/vehicles/${vehicle.slug}`}>
        <div className="card-image">
          {imgUrl ? (
            <img src={imgUrl} alt={vehicle.title} loading="lazy" />
          ) : (
            <div className="no-image"><i className="bi bi-car-front" /></div>
          )}

          {/* Badges */}
          {vehicle.is_featured && <span className="card-badge badge-featured">Featured</span>}
          {vehicle.is_import && !vehicle.is_featured && <span className="card-badge badge-import">Import</span>}
          {vehicle.condition === 'new' && !vehicle.is_featured && !vehicle.is_import && (
            <span className="card-badge badge-new">New</span>
          )}
          {vehicle.status === 'sold' && <span className="card-badge badge-sold">Sold</span>}
          {vehicle.is_commission && <span className="card-badge badge-commission">Commission</span>}

          {/* WhatsApp quick button */}
          <a
            href={whatsappVehicle(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            className="card-whatsapp"
            onClick={e => e.stopPropagation()}
            title="Inquire on WhatsApp"
          >
            <i className="bi bi-whatsapp" />
          </a>
        </div>

        <div className="card-body">
          <div className="card-price">{formatPrice(vehicle.price_ksh)}</div>
          <div className="card-title">{vehicle.title}</div>
          <div className="card-meta">
            <span className="card-meta-item">
              <i className="bi bi-calendar3" /> {vehicle.year}
            </span>
            {vehicle.fuel_type && (
              <span className="card-meta-item">
                <i className="bi bi-fuel-pump" /> {vehicle.fuel_type}
              </span>
            )}
            {vehicle.transmission && (
              <span className="card-meta-item">
                <i className="bi bi-gear" /> {vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}
              </span>
            )}
            {vehicle.mileage_km && (
              <span className="card-meta-item">
                <i className="bi bi-speedometer2" /> {formatMileage(vehicle.mileage_km)}
              </span>
            )}
          </div>
          <div className="card-footer-row">
            <span className="card-location">
              <i className="bi bi-geo-alt" /> {vehicle.branch_city || 'Kenya'}
            </span>
            <span className={`card-condition ${conditionClass}`}>{conditionLabel}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}