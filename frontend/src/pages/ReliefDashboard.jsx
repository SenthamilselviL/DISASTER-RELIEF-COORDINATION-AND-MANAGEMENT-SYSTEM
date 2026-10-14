import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RequestService, DashboardService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import {
  HeartHandshake,
  AlertOctagon,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';

export const ReliefDashboard = () => {
  const { user } = useAuth();
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [availRes, myRes] = await Promise.all([
          RequestService.getAll({ status: 'PENDING' }),
          RequestService.getAll({ myClaimed: 'true' })
        ]);
        setAvailableRequests(availRes.data.data || []);
        setMyAssignments(myRes.data.data || []);
      } catch (err) {
        console.error('Error loading responder dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const criticalAvailable = availableRequests.filter(r => r.priority === 'CRITICAL').length;
  const inProgressMine = myAssignments.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ASSIGNED').length;
  const resolvedMine = myAssignments.filter(r => r.status === 'RESOLVED').length;

  return (
    <div>
      {/* Responder Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        borderRadius: '14px',
        padding: '26px 30px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#4ade80', marginBottom: '8px' }}>
            <HeartHandshake size={14} /> CERTIFIED RELIEF RESPONDER PORTAL
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '4px 0' }}>
            {user?.name || 'Responder Unit'}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            {user?.organization ? `${user.organization} • ` : ''}Operational Deployment Hub
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/relief/available" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <AlertOctagon size={18} />
            <span>Browse Emergencies ({availableRequests.length})</span>
          </Link>
          <Link to="/relief/my-tasks" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
            <span>My Tasks ({inProgressMine})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <AlertOctagon size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Critical Unassigned</div>
            <div className="stat-value">{criticalAvailable}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Unclaimed</div>
            <div className="stat-value">{availableRequests.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">My Active Tasks</div>
            <div className="stat-value">{inProgressMine}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">My Completed Aid</div>
            <div className="stat-value">{resolvedMine}</div>
          </div>
        </div>
      </div>

      {/* Split View: Available Emergencies & Live Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }}>
        {/* Available to Claim */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <AlertOctagon size={20} color="#dc2626" />
              <span>Immediate Aid Needed</span>
            </h2>
            <Link to="/relief/available" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>
              View All ({availableRequests.length}) &rarr;
            </Link>
          </div>

          {availableRequests.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 className="empty-state-icon" style={{ color: '#16a34a' }} />
              <h3 className="empty-state-title">All Emergencies Handled</h3>
              <p className="empty-state-desc">There are no pending unclaimed emergencies right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {availableRequests.slice(0, 4).map((req) => (
                <div
                  key={req._id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    borderLeft: req.priority === 'CRITICAL' ? '4px solid #dc2626' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{req.category}</span>
                      <PriorityBadge priority={req.priority} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '10px', lineHeight: 1.4 }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      <span>{req.location} ({req.peopleAffected || 1} people)</span>
                    </div>

                    <Link to={`/requests/${req._id}`} className="btn btn-sm btn-primary">
                      Claim Aid &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Map Preview */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <MapPin size={20} color="#2563eb" />
              <span>Emergency Hotspots</span>
            </h2>
            <Link to="/control-room/map" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}>
              Fullscreen &rarr;
            </Link>
          </div>

          <LeafletMap
            height="360px"
            zoom={12}
            requests={availableRequests}
          />
        </div>
      </div>
    </div>
  );
};
