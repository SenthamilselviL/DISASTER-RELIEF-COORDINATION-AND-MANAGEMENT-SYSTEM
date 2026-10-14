import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { MapPin, Navigation } from 'lucide-react';

// Fix Leaflet default icon path issues in bundled Vite applications
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});

// Create custom colored div-icon pins for Leaflet
const createCustomMarker = (priority = 'MEDIUM', status = 'PENDING') => {
  const p = (priority || 'MEDIUM').toUpperCase();
  let color = '#0284c7'; // blue
  let glow = 'rgba(2, 132, 199, 0.4)';

  if (p === 'CRITICAL') {
    color = '#dc2626'; // red
    glow = 'rgba(220, 38, 38, 0.6)';
  } else if (p === 'HIGH') {
    color = '#ea580c'; // orange
    glow = 'rgba(234, 88, 12, 0.5)';
  } else if (p === 'LOW') {
    color = '#64748b'; // slate
    glow = 'rgba(100, 116, 139, 0.3)';
  }

  const isCritical = p === 'CRITICAL';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${isCritical ? `<div style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${glow};
          animation: pulse-ring 1.5s infinite;
        "></div>` : ''}
        <div style="
          width: 26px;
          height: 26px;
          background: ${color};
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Map click listener component for selecting location
const LocationPickerEvents = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect && e && e.latlng) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

// Controls view centering and invalidates size for responsive rendering
const MapViewController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && Array.isArray(center) && center[0] != null && center[1] != null && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom || map.getZoom());
    }
    // Invalidate size immediately and after layout paint
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);

  return null;
};

export const LeafletMap = ({
  center = [12.9815, 80.2180], // Default Chennai center
  zoom = 13,
  height = '400px',
  requests = [],
  coverageClusters = [],
  selectedLocation = null,
  selectedPosition = null,
  onLocationSelect = null,
  isPicker = false,
  pickerMode = false,
  interactive = true
}) => {
  // Normalize picker flag
  const isLocationPicker = isPicker || pickerMode || !!onLocationSelect;

  // Normalize selected location coordinates
  let activeSelectedLat = null;
  let activeSelectedLng = null;

  if (selectedLocation) {
    if (typeof selectedLocation === 'object' && selectedLocation.lat != null && selectedLocation.lng != null) {
      activeSelectedLat = Number(selectedLocation.lat);
      activeSelectedLng = Number(selectedLocation.lng);
    } else if (Array.isArray(selectedLocation) && selectedLocation.length >= 2) {
      activeSelectedLat = Number(selectedLocation[0]);
      activeSelectedLng = Number(selectedLocation[1]);
    }
  } else if (selectedPosition && Array.isArray(selectedPosition) && selectedPosition.length >= 2) {
    activeSelectedLat = Number(selectedPosition[0]);
    activeSelectedLng = Number(selectedPosition[1]);
  }

  // Normalize center
  let activeCenter = [12.9815, 80.2180];
  if (activeSelectedLat != null && activeSelectedLng != null && !isNaN(activeSelectedLat) && !isNaN(activeSelectedLng)) {
    activeCenter = [activeSelectedLat, activeSelectedLng];
  } else if (Array.isArray(center) && center.length >= 2 && center[0] != null && center[1] != null) {
    activeCenter = [Number(center[0]), Number(center[1])];
  } else if (center && typeof center === 'object' && center.lat != null && center.lng != null) {
    activeCenter = [Number(center.lat), Number(center.lng)];
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        },
        (err) => {
          alert('Could not retrieve GPS location: ' + err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div
      className="leaflet-map-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: height || '400px',
        minHeight: '350px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {isLocationPicker && (
        <div className="map-picker-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#2563eb" />
            <span>
              <strong>Click map</strong> to pinpoint coordinates or detect GPS:
            </span>
          </div>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="btn btn-sm btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '4px 8px' }}
          >
            <Navigation size={13} /> Detect GPS
          </button>
        </div>
      )}

      <div style={{ flex: 1, width: '100%', minHeight: '320px', position: 'relative' }}>
        <MapContainer
          center={activeCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%', minHeight: '320px', zIndex: 1 }}
          scrollWheelZoom={interactive}
          dragging={interactive}
        >
          <MapViewController center={activeCenter} zoom={zoom} />

          {/* OpenStreetMap Standard Attribution TileLayer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Location Picker Click Listener */}
          {isLocationPicker && onLocationSelect && (
            <LocationPickerEvents onLocationSelect={onLocationSelect} />
          )}

          {/* Marker for Selected Location in Picker Mode */}
          {isLocationPicker && activeSelectedLat != null && activeSelectedLng != null && !isNaN(activeSelectedLat) && !isNaN(activeSelectedLng) && (
            <Marker
              position={[activeSelectedLat, activeSelectedLng]}
              icon={createCustomMarker('CRITICAL', 'PENDING')}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ color: '#2563eb' }}>Selected Emergency Pin</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                    Lat: {activeSelectedLat.toFixed(5)}, Lng: {activeSelectedLng.toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Markers for Emergency Requests */}
          {requests.map((req) => {
            if (!req || req.latitude == null || req.longitude == null) return null;
            const reqLat = Number(req.latitude);
            const reqLng = Number(req.longitude);
            if (isNaN(reqLat) || isNaN(reqLng)) return null;

            return (
              <Marker
                key={req._id || req.id || `${reqLat}-${reqLng}`}
                position={[reqLat, reqLng]}
                icon={createCustomMarker(req.priority, req.status)}
              >
                <Popup>
                  <div style={{ minWidth: '220px', maxWidth: '280px', padding: '4px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                    </div>

                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0f172a' }}>
                      {req.category} Emergency
                    </h4>

                    <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                      {req.description}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                      <div><strong>Location:</strong> {req.location}</div>
                      <div><strong>Affected:</strong> {req.peopleAffected || 1} people</div>
                      {req.assignedTo && (
                        <div><strong>Assigned To:</strong> {req.assignedTo.name || 'Relief Team'}</div>
                      )}
                      <div><strong>Time:</strong> {new Date(req.createdAt || Date.now()).toLocaleString()}</div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={`/requests/${req._id || req.id}`}
                        style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        View Full Details &rarr;
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Coverage Gap Indicator Circles */}
          {coverageClusters.map((cluster) => {
            if (!cluster || !cluster.centerLat || !cluster.centerLng) return null;

            const isCritical = cluster.severity === 'CRITICAL';
            const isHigh = cluster.severity === 'HIGH';
            const strokeColor = isCritical ? '#dc2626' : isHigh ? '#ea580c' : '#2563eb';
            const fillColor = isCritical ? '#fee2e2' : isHigh ? '#ffedd5' : '#dbeafe';

            return (
              <Circle
                key={cluster.id || `${cluster.centerLat}-${cluster.centerLng}`}
                center={[cluster.centerLat, cluster.centerLng]}
                radius={1800}
                pathOptions={{
                  color: strokeColor,
                  fillColor,
                  fillOpacity: 0.35,
                  weight: 2,
                  dashArray: isCritical ? '6, 6' : undefined
                }}
              >
                <Popup>
                  <div style={{ padding: '6px', maxWidth: '240px' }}>
                    <div style={{ fontWeight: '700', color: strokeColor, marginBottom: '4px' }}>
                      {cluster.coverageStatus ? cluster.coverageStatus.replace(/_/g, ' ') : 'COVERAGE GAP'}
                    </div>
                    <p style={{ fontSize: '0.8rem', margin: '0 0 4px 0', fontWeight: '600' }}>
                      {cluster.area}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      <div>Pending Requests: <strong>{cluster.pendingCount}</strong></div>
                      <div>Active Responders: <strong>{cluster.assignedCount}</strong></div>
                      <div>People Impacted: <strong>{cluster.totalPeopleAffected}</strong></div>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', fontStyle: 'italic', color: '#64748b' }}>
                      {cluster.recommendation}
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
