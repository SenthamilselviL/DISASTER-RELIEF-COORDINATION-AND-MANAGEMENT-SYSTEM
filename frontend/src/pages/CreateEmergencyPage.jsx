import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RequestService } from '../services/api';
import { LeafletMap } from '../components/LeafletMap';
import { PriorityBadge } from '../components/PriorityBadge';
import { reverseGeocode } from '../utils/geocoding';
import {
  AlertTriangle,
  Send,
  MapPin,
  Check,
  AlertCircle,
  LifeBuoy,
  Stethoscope,
  Utensils,
  Home,
  Navigation,
  Info
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'emergency_request_draft_v1';

export const CreateEmergencyPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'Rescue';

  const [formData, setFormData] = useState({
    category: ['Food', 'Medical', 'Shelter', 'Rescue'].includes(initialCat) ? initialCat : 'Rescue',
    description: '',
    location: 'Bhuvaneshwari Nagar, Velachery, Chennai',
    latitude: 12.9815,
    longitude: 80.2180,
    peopleAffected: 1,
    contactPhone: user?.phone || ''
  });

  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Restore draft if any
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  const updateFormField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleLocationSelect = async (lat, lng) => {
    const roundedLat = Number(lat.toFixed(5));
    const roundedLng = Number(lng.toFixed(5));

    setFormData((prev) => ({
      ...prev,
      latitude: roundedLat,
      longitude: roundedLng
    }));

    setGeocodingLoading(true);
    try {
      const address = await reverseGeocode(roundedLat, roundedLng);
      if (address) {
        setFormData((prev) => {
          const updated = { ...prev, location: address };
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        alert('Could not retrieve GPS coordinates: ' + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Rule-based priority preview calculator
  const getPriorityPreview = () => {
    const text = (formData.description || '').toLowerCase();
    const count = Number(formData.peopleAffected) || 1;
    const cat = formData.category;

    if (cat === 'Medical') {
      if (text.includes('unconscious') || text.includes('bleeding') || text.includes('oxygen') || text.includes('heart') || count >= 5) {
        return { priority: 'CRITICAL', reason: 'High vulnerability, oxygen/cardiac, or multiple medical casualties' };
      }
      return { priority: 'HIGH', reason: 'Urgent medical assistance requested' };
    }

    if (cat === 'Rescue') {
      if (text.includes('trapped') || text.includes('drowning') || text.includes('water rising') || text.includes('roof') || text.includes('collapsed') || count >= 8) {
        return { priority: 'CRITICAL', reason: 'Immediate life hazard, drowning peril or trapped victims' };
      }
      return { priority: 'HIGH', reason: 'Rescue and boat evacuation requested' };
    }

    if (cat === 'Shelter') {
      if (count >= 10 || text.includes('baby') || text.includes('infant') || text.includes('elderly')) {
        return { priority: 'HIGH', reason: 'Vulnerable individuals or large group exposed to elements' };
      }
      return { priority: 'MEDIUM', reason: 'Emergency shelter accommodation requested' };
    }

    if (cat === 'Food') {
      if (text.includes('starving') || text.includes('no water') || count >= 15) {
        return { priority: 'HIGH', reason: 'Acute food or drinking water exhaustion' };
      }
      return { priority: 'MEDIUM', reason: 'Essential rations & drinking water request' };
    }

    return { priority: 'MEDIUM', reason: 'Standard aid request' };
  };

  const priorityPreview = getPriorityPreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.description.trim()) {
      setError('Please provide a detailed description of the emergency.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Please provide the location address or landmark.');
      return;
    }

    setLoading(true);
    try {
      const res = await RequestService.create(formData);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSuccessMsg('Emergency request submitted successfully! Dispatch alerts sent to field responders.');

      setTimeout(() => {
        navigate(`/citizen/requests`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit emergency request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle color="#dc2626" size={28} />
          {t.form.submitEmergency}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Real-time coordination transmits this report immediately to certified rescue volunteers, NGOs, and Government Command.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <Check size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Left Column: Form Inputs */}
          <div className="card" style={{ padding: '24px' }}>
            {/* Category Selector */}
            <div className="form-group">
              <label className="form-label form-label-required">{t.form.emergencyCategory}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { id: 'Rescue', label: t.categories.Rescue, icon: LifeBuoy, color: '#dc2626', bg: '#fef2f2' },
                  { id: 'Medical', label: t.categories.Medical, icon: Stethoscope, color: '#ea580c', bg: '#fff7ed' },
                  { id: 'Food', label: t.categories.Food, icon: Utensils, color: '#16a34a', bg: '#f0fdf4' },
                  { id: 'Shelter', label: t.categories.Shelter, icon: Home, color: '#0284c7', bg: '#f0f9ff' }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFormField('category', cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: `2px solid ${isSelected ? cat.color : '#e2e8f0'}`,
                        backgroundColor: isSelected ? cat.bg : '#ffffff',
                        color: isSelected ? cat.color : '#334155',
                        fontWeight: isSelected ? '700' : '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={20} color={cat.color} />
                      <span>{cat.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label form-label-required">{t.form.description}</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Detail what is happening (e.g., Water rising above 4ft, 2 children & elderly trapped on rooftop needing rescue boat)"
                value={formData.description}
                onChange={(e) => updateFormField('description', e.target.value)}
                required
              />
            </div>

            {/* Location Landmark Address */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label form-label-required">{t.form.location}</label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginBottom: '6px'
                  }}
                >
                  <Navigation size={13} />
                  <span>Use GPS Location</span>
                </button>
              </div>

              <input
                type="text"
                className="form-control"
                placeholder="e.g. 3rd Cross Street, Bhuvaneshwari Nagar, Velachery, Chennai"
                value={formData.location}
                onChange={(e) => updateFormField('location', e.target.value)}
                required
              />
              {geocodingLoading && (
                <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '4px' }}>
                  {t.form.detectingAddress}
                </div>
              )}
            </div>

            {/* People Affected & Phone Number */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label form-label-required">{t.form.peopleAffected}</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  className="form-control"
                  value={formData.peopleAffected}
                  onChange={(e) => updateFormField('peopleAffected', Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">{t.form.contactPhone}</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 98401 23456"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormField('contactPhone', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Automated Priority Preview */}
            <div style={{
              marginTop: '10px',
              padding: '14px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  AUTOMATED TRIAGE PRIORITY
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                  {priorityPreview.reason}
                </div>
              </div>
              <PriorityBadge priority={priorityPreview.priority} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-danger"
              style={{ width: '100%', padding: '14px', marginTop: '20px', fontWeight: '800', fontSize: '1rem' }}
              disabled={loading}
            >
              <Send size={18} />
              <span>{loading ? 'Transmitting to Emergency Grid...' : t.form.submitEmergency}</span>
            </button>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '480px' }}>
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>
                <MapPin size={18} color="#dc2626" />
                <span>Select Emergency Pin on Map</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Click map to reposition
              </span>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: '380px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
              <LeafletMap
                center={[formData.latitude, formData.longitude]}
                zoom={14}
                height="100%"
                isPicker={true}
                selectedLocation={{ lat: formData.latitude, lng: formData.longitude }}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '0.76rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={16} color="#0284c7" />
              <span>Map coordinates are logged securely with reverse geocoded landmark address for field responders.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
