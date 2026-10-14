import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  CheckCircle,
  Activity,
  Phone,
  Shield,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        const res = await RequestService.getAll({ myRequests: 'true' });
        setRequests(res.data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, []);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const inProgressCount = requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS').length;
  const resolvedCount = requests.filter(r => r.status === 'RESOLVED').length;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '14px',
        padding: '28px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#38bdf8', marginBottom: '10px' }}>
            <Shield size={14} /> CITIZEN RELIEF DESK
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '6px' }}>
            Hello, {user?.name || 'Citizen'}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '540px' }}>
            Submit urgent requests for rescue, food, medical assistance, or shelter. Responders and control rooms are monitoring live requests.
          </p>
        </div>

        <Link to="/citizen/new" className="btn btn-lg btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
          <AlertTriangle size={20} />
          <span>Report Emergency</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Dispatch</div>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">In Progress / Assigned</div>
            <div className="stat-value">{inProgressCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Aid Delivered & Resolved</div>
            <div className="stat-value">{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        {/* Recent Requests Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <span>Your Reported Emergencies</span>
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{requests.length}</span>
            </h2>
            <Link to="/citizen/requests" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>
              View All &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <span>Loading your emergency requests...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle className="empty-state-icon" />
              <h3 className="empty-state-title">No Emergency Requests</h3>
              <p className="empty-state-desc">You have not submitted any emergency requests yet.</p>
              <Link to="/citizen/new" className="btn btn-primary">
                <PlusCircle size={16} /> Submit New Request
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req._id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{req.category} Aid</span>
                      <PriorityBadge priority={req.priority} />
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '10px', lineHeight: 1.4 }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} />
                      <span>{req.location}</span>
                    </div>

                    <Link to={`/requests/${req._id}`} style={{ color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Details</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety & Hotline Guidance Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: '#f8fafc' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
              <Phone size={18} color="#dc2626" /> Emergency Helpdesk
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>Disaster Management:</span>
                <strong>1070</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>Police / Fire / Ambulance:</span>
                <strong>112</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span>District Disaster Cell:</span>
                <strong>1077</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Coast Guard Search & Rescue:</span>
                <strong>1554</strong>
              </div>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
              Important Safety Tips
            </h3>
            <ul style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Avoid walking or driving through moving floodwater.</li>
              <li>Keep phones charged and turn off main power if water enters house.</li>
              <li>Move children and elderly to the highest floor or elevated ground.</li>
              <li>Drink only bottled or boiled water to prevent contamination.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
