import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardService, RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import {
  Building2,
  AlertOctagon,
  Clock,
  Activity,
  CheckCircle2,
  MapPin,
  Boxes,
  Compass,
  ArrowRight,
  ShieldAlert,
  Users
} from 'lucide-react';

export const ControlRoomDashboard = () => {
  const [stats, setStats] = useState(null);
  const [criticalRequests, setCriticalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, critRes] = await Promise.all([
          DashboardService.getStats(),
          RequestService.getAll({ priority: 'CRITICAL', status: 'PENDING' })
        ]);
        setStats(statsRes.data.data);
        setCriticalRequests(critRes.data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load control room data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-container card">
        <div className="spinner"></div>
        <span>Connecting to Disaster Management Command Grid...</span>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="alert alert-danger">{error || 'Failed to load data'}</div>;
  }

  const { overview, priority, categories, resources, users } = stats;

  return (
    <div>
      {/* Control Room Command Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 60%, #1e293b 100%)',
        borderRadius: '14px',
        padding: '24px 30px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dc2626', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em' }}>
            <span className="pulse-dot" style={{ backgroundColor: '#ffffff' }}></span>
            INCIDENT COMMAND ACTIVE
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '8px 0 4px 0', letterSpacing: '-0.02em' }}>
            Disaster Management Control Room
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Centralized multi-agency response, geospatial tracking, and humanitarian resource dispatch
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/control-room/map" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <MapPin size={18} />
            <span>Live Tactical Map</span>
          </Link>
          <Link to="/control-room/coverage" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Compass size={18} />
            <span>Coverage Gaps</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <ShieldAlert size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Critical Emergencies</div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{priority.critical}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Clock size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Pending Dispatch</div>
            <div className="stat-value">{overview.pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Activity size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Active Field Operations</div>
            <div className="stat-value">{overview.activeOperations}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Resolved / Aid Delivered</div>
            <div className="stat-value">{overview.resolved}</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Critical Attention Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', marginBottom: '28px' }}>
        {/* Urgent Critical Emergencies List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ color: '#dc2626' }}>
              <AlertOctagon size={20} />
              <span>Pending Critical Emergencies</span>
              <span className="badge badge-priority-critical">{criticalRequests.length}</span>
            </h2>
            <Link to="/control-room/requests?priority=CRITICAL" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>
              View All &rarr;
            </Link>
          </div>

          {criticalRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#16a34a' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 10px auto', display: 'block' }} />
              <strong>No pending critical calls at this time.</strong>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>All critical emergencies are either assigned or in progress.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {criticalRequests.slice(0, 4).map((req) => (
                <div
                  key={req._id}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    padding: '14px',
                    borderLeft: '4px solid #dc2626'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: '#991b1b', fontSize: '0.95rem' }}>
                      [{req.category}] #{req._id.slice(-6)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>
                      {req.peopleAffected || 1} PEOPLE TRAPPED
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {req.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#991b1b' }}>
                    <span>📍 {req.location}</span>
                    <Link to={`/requests/${req._id}`} className="btn btn-sm btn-danger" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
                      Dispatch Aid &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories & Resource Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
              Incidents by Emergency Category
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: '600' }}>RESCUE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#dc2626' }}>{categories.Rescue || 0}</div>
              </div>
              <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '8px', border: '1px solid #fce7f3' }}>
                <div style={{ fontSize: '0.8rem', color: '#9d174d', fontWeight: '600' }}>MEDICAL</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#db2777' }}>{categories.Medical || 0}</div>
              </div>
              <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                <div style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: '600' }}>FOOD & WATER</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#d97706' }}>{categories.Food || 0}</div>
              </div>
              <div style={{ background: '#f0f9ff', padding: '14px', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                <div style={{ fontSize: '0.8rem', color: '#075985', fontWeight: '600' }}>SHELTER</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7' }}>{categories.Shelter || 0}</div>
              </div>
            </div>
          </div>

          {/* Relief Resource Reserves Snapshot */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} color="#2563eb" /> Relief Inventory Reserves
              </h3>
              <Link to="/control-room/resources" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>
                Manage Inventory &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>TOTAL UNITS IN STOCK</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{resources.totalStock}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AVAILABLE FOR DISPATCH</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#16a34a' }}>{resources.availableStock}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ALLOCATED TO TEAMS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>{resources.allocatedUnits}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
