import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import {
  ClipboardList,
  MapPin,
  HandHeart,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  Map as MapIcon
} from 'lucide-react';

export const AvailableRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Filters & Sorting
  const [category, setCategory] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await RequestService.getAll({
        category: category !== 'ALL' ? category : undefined,
        priority: priority !== 'ALL' ? priority : undefined,
        status: status !== 'ALL' ? status : undefined,
        search: search || undefined
      });
      setRequests(res.data.data || []);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load emergencies');
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
  }, [category, priority, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleClaim = async (requestId) => {
    if (!window.confirm('Claim this emergency for your relief unit?')) return;
    try {
      setClaimingId(requestId);
      await RequestService.claim(requestId);
      await fetchRequests();
    } catch (err) {
      alert('Could not claim request: ' + err.message);
      await fetchRequests(); // Refresh list to reflect latest state
    } finally {
      setClaimingId(null);
    }
  };

  // Sort requests locally
  const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const sortedRequests = [...requests].sort((a, b) => {
    if (sortBy === 'priority') {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={26} color="#dc2626" />
            <span>Emergency Request Grid</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Claim active emergency calls and coordinate field dispatch
          </p>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <MapIcon size={18} />
          <span>{showMap ? 'Hide Map View' : 'Show Map View'}</span>
        </button>
      </div>

      {showMap && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <LeafletMap height="360px" requests={sortedRequests} />
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>CATEGORY</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="Rescue">Rescue & Evacuation</option>
              <option value="Medical">Medical Emergency</option>
              <option value="Food">Food & Water</option>
              <option value="Shelter">Disaster Shelter</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>PRIORITY</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>STATUS</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending (Unassigned)</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>SORT ORDER</label>
            <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Newest First</option>
              <option value="priority">Priority Severity</option>
            </select>
          </div>

          <div>
            <form onSubmit={handleSearchSubmit}>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>SEARCH</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Area or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '0 12px' }}>
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading relief calls...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sortedRequests.length === 0 ? (
        <div className="card empty-state">
          <ClipboardList className="empty-state-icon" />
          <h3 className="empty-state-title">No Requests Found</h3>
          <p className="empty-state-desc">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {sortedRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isClaiming = claimingId === req._id;

            return (
              <div
                key={req._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: req.priority === 'CRITICAL' ? '5px solid #dc2626' : req.priority === 'HIGH' ? '5px solid #ea580c' : undefined
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>#{req._id.slice(-6)}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>{req.category}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, flex: 1, marginBottom: '14px' }}>
                  {req.description}
                </p>

                <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <MapPin size={14} color="#dc2626" />
                    <strong>{req.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Affected: <strong>{req.peopleAffected || 1} people</strong></span>
                    <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {req.assignedTo && (
                    <div style={{ marginTop: '4px', color: '#4338ca', fontWeight: '600' }}>
                      Claimed by: {req.assignedTo.name || 'Another Team'}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/requests/${req._id}`} className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>
                    <Eye size={14} /> Details
                  </Link>

                  {isPending ? (
                    <button
                      onClick={() => handleClaim(req._id)}
                      disabled={isClaiming}
                      className="btn btn-primary"
                      style={{ flex: 1.4, fontSize: '0.85rem', fontWeight: '700' }}
                    >
                      <HandHeart size={15} />
                      <span>{isClaiming ? 'Claiming...' : 'Claim Request'}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-outline"
                      style={{ flex: 1.4, fontSize: '0.82rem', background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }}
                    >
                      Already Claimed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
