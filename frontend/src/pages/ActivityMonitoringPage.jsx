import React, { useState, useEffect } from 'react';
import { ActivityService } from '../services/api';
import {
  History,
  ShieldAlert,
  HandHeart,
  CheckCircle,
  Copy,
  Boxes,
  UserCheck,
  Filter,
  Clock
} from 'lucide-react';

export const ActivityMonitoringPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await ActivityService.getLogs({
        action: actionFilter !== 'ALL' ? actionFilter : undefined
      });
      setLogs(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const getActionBadge = (action) => {
    switch (action) {
      case 'REQUEST_CREATED':
        return <span className="badge" style={{ background: '#fef2f2', color: '#b91c1c' }}>🚨 Emergency Created</span>;
      case 'REQUEST_CLAIMED':
        return <span className="badge" style={{ background: '#eef2ff', color: '#4338ca' }}>🤝 Responder Claimed</span>;
      case 'STATUS_UPDATED':
        return <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>⚡ Status Updated</span>;
      case 'REQUEST_RESOLVED':
        return <span className="badge" style={{ background: '#f0fdf4', color: '#15803d' }}>✅ Aid Resolved</span>;
      case 'DUPLICATE_FLAGGED':
        return <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>⚠️ Duplicate Flagged</span>;
      case 'RESOURCE_ALLOCATED':
        return <span className="badge" style={{ background: '#f3e8ff', color: '#7e22ce' }}>📦 Resource Dispatched</span>;
      case 'RESOURCE_CREATED':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>📦 Stockpile Added</span>;
      case 'USER_ROLE_CHANGED':
        return <span className="badge" style={{ background: '#f8fafc', color: '#0f172a' }}>🛡️ Role Modified</span>;
      default:
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>{action}</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={26} color="#0f172a" />
          <span>System Activity & Audit Log</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Immutable operational trail of all emergency submissions, responder claims, and resource allocations
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { label: 'All Activities', value: 'ALL' },
          { label: 'Emergencies', value: 'REQUEST_CREATED' },
          { label: 'Claims', value: 'REQUEST_CLAIMED' },
          { label: 'Resolutions', value: 'REQUEST_RESOLVED' },
          { label: 'Duplicates', value: 'DUPLICATE_FLAGGED' },
          { label: 'Resources', value: 'RESOURCE_ALLOCATED' }
        ].map((item) => {
          const isActive = actionFilter === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setActionFilter(item.value)}
              className="btn btn-sm btn-outline"
              style={{
                backgroundColor: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                borderColor: isActive ? '#0f172a' : '#cbd5e1',
                fontWeight: isActive ? '700' : '500'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading activity log...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : logs.length === 0 ? (
        <div className="card empty-state">
          <History className="empty-state-icon" />
          <h3 className="empty-state-title">No Logs Found</h3>
          <p className="empty-state-desc">No events recorded for this activity category.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Operator / User</th>
                <th>Role</th>
                <th>Operational Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{getActionBadge(log.action)}</td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{log.userName || log.user?.name || 'System'}</strong>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem' }}>
                      {log.userRole || log.user?.role || 'SYSTEM'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '420px', lineHeight: 1.4 }}>
                    {log.details}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
