import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  ClipboardList,
  PlusCircle,
  MapPin,
  Clock,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Filter
} from 'lucide-react';

export const CitizenRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await RequestService.getAll({
        myRequests: 'true',
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      setRequests(res.data.data || []);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load requests');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={26} color="#2563eb" />
            <span>My Emergency Requests</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Live status tracking of all emergency aid requests submitted by your account
          </p>
        </div>

        <Link to="/citizen/new" className="btn btn-danger" style={{ fontWeight: '700' }}>
          <PlusCircle size={18} />
          <span>New Emergency</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((st) => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-sm btn-outline"
              style={{
                backgroundColor: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                borderColor: isActive ? '#0f172a' : '#cbd5e1',
                fontWeight: isActive ? '700' : '500'
              }}
            >
              {st.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading your reported emergencies...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : requests.length === 0 ? (
        <div className="card empty-state">
          <ClipboardList className="empty-state-icon" />
          <h3 className="empty-state-title">No Requests Found</h3>
          <p className="empty-state-desc">You have no requests matching this status filter.</p>
          <Link to="/citizen/new" className="btn btn-primary">
            Create an Emergency Request
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location / Landmark</th>
                <th>Affected</th>
                <th>Assigned Responder</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{req.category}</span>
                  </td>
                  <td>
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#64748b" style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.location}
                      </span>
                    </div>
                  </td>
                  <td>{req.peopleAffected || 1} people</td>
                  <td>
                    {req.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4338ca', fontWeight: '600' }}>
                        <UserCheck size={14} />
                        <span>{req.assignedTo.name || 'Assigned NGO'}</span>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Awaiting Responder</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <Link
                      to={`/requests/${req._id}`}
                      className="btn btn-sm btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Track</span>
                      <ArrowRight size={12} />
                    </Link>
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
