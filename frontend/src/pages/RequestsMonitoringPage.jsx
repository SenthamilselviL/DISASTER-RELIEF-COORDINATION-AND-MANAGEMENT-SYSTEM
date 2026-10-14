import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  ClipboardList,
  Search,
  Filter,
  MapPin,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Copy
} from 'lucide-react';

export const RequestsMonitoringPage = () => {
  const [searchParams] = useSearchParams();
  const initialPriority = searchParams.get('priority') || 'ALL';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('ALL');
  const [priority, setPriority] = useState(initialPriority);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await RequestService.getAll({
        category: category !== 'ALL' ? category : undefined,
        priority: priority !== 'ALL' ? priority : undefined,
        status: status !== 'ALL' ? status : undefined,
        isDuplicate: onlyDuplicates ? 'true' : undefined,
        search: search || undefined
      });
      setRequests(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [category, priority, status, onlyDuplicates]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={26} color="#0f172a" />
            <span>Emergency Requests Command Grid</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Comprehensive overview and operational management of all field requests
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>CATEGORY</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Rescue">Rescue</option>
              <option value="Medical">Medical</option>
              <option value="Food">Food</option>
              <option value="Shelter">Shelter</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>PRIORITY</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>STATUS</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>DUPLICATES</label>
            <button
              type="button"
              onClick={() => setOnlyDuplicates(!onlyDuplicates)}
              className="btn btn-outline"
              style={{
                width: '100%',
                backgroundColor: onlyDuplicates ? '#fef3c7' : '#ffffff',
                borderColor: onlyDuplicates ? '#d97706' : '#cbd5e1',
                color: onlyDuplicates ? '#b45309' : '#334155'
              }}
            >
              <Copy size={14} />
              <span>{onlyDuplicates ? 'Duplicates Only' : 'All Requests'}</span>
            </button>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSearchSubmit}>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>SEARCH</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search landmark, description, area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '0 14px' }}>
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading request registry...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : requests.length === 0 ? (
        <div className="card empty-state">
          <ClipboardList className="empty-state-icon" />
          <h3 className="empty-state-title">No Requests Found</h3>
          <p className="empty-state-desc">No emergency requests match the current filters.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location</th>
                <th>Affected</th>
                <th>Responder Unit</th>
                <th>Duplicate Flag</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td style={{ fontWeight: '700', fontSize: '0.78rem', color: '#64748b' }}>
                    #{req._id.slice(-6)}
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{req.category}</span>
                  </td>
                  <td>
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ maxWidth: '220px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {req.location}
                    </div>
                  </td>
                  <td>{req.peopleAffected || 1}</td>
                  <td>
                    {req.assignedTo ? (
                      <span style={{ color: '#4338ca', fontWeight: '600' }}>
                        {req.assignedTo.name || 'NGO'}
                      </span>
                    ) : (
                      <span style={{ color: '#d97706', fontSize: '0.8rem' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    {req.duplicateOf ? (
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                        Duplicate
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <Link to={`/requests/${req._id}`} className="btn btn-sm btn-outline">
                      View
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
