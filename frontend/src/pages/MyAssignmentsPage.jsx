import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  CheckCircle2,
  Activity,
  MapPin,
  Clock,
  ArrowRight,
  FileCheck,
  Check,
  AlertCircle
} from 'lucide-react';

export const MyAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  // Resolution modal state
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await RequestService.getAll({ myClaimed: 'true' });
      setAssignments(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStartActivity = async (reqId) => {
    try {
      setActionId(reqId);
      await RequestService.updateStatus(reqId, { status: 'IN_PROGRESS' });
      await fetchAssignments();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!resolveTarget) return;

    try {
      setActionId(resolveTarget._id);
      await RequestService.updateStatus(resolveTarget._id, {
        status: 'RESOLVED',
        resolutionNotes
      });
      setResolveTarget(null);
      setResolutionNotes('');
      await fetchAssignments();
    } catch (err) {
      alert('Error resolving request: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={26} color="#16a34a" />
          <span>My Claimed Relief Tasks</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Manage relief missions claimed by your responder unit and update field progress
        </p>
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading your assigned missions...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : assignments.length === 0 ? (
        <div className="card empty-state">
          <CheckCircle2 className="empty-state-icon" />
          <h3 className="empty-state-title">No Claimed Tasks Yet</h3>
          <p className="empty-state-desc">You have not claimed any emergency relief calls yet.</p>
          <Link to="/relief/available" className="btn btn-primary">
            Claim Available Emergencies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {assignments.map((req) => (
            <div
              key={req._id}
              className="card"
              style={{
                borderLeft: req.status === 'RESOLVED' ? '4px solid #16a34a' : '4px solid #2563eb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>
                      {req.category} Relief Mission
                    </h3>
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    Claimed on: {req.assignedAt ? new Date(req.assignedAt).toLocaleString() : 'Recently'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {req.status === 'ASSIGNED' && (
                    <button
                      onClick={() => handleStartActivity(req._id)}
                      disabled={actionId === req._id}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Activity size={16} />
                      <span>{actionId === req._id ? 'Updating...' : 'Start Activity (In Progress)'}</span>
                    </button>
                  )}

                  {req.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => {
                        setResolveTarget(req);
                        setResolutionNotes('');
                      }}
                      className="btn btn-success"
                      style={{ fontSize: '0.85rem', fontWeight: '700' }}
                    >
                      <Check size={16} />
                      <span>Mark Aid Delivered & Resolved</span>
                    </button>
                  )}

                  <Link to={`/requests/${req._id}`} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                    Details &rarr;
                  </Link>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, marginBottom: '12px' }}>
                {req.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#dc2626" />
                  <strong>{req.location}</strong> ({req.peopleAffected || 1} people)
                </div>

                <div>
                  Citizen: <strong>{req.citizen?.name || 'Citizen'}</strong> {req.contactPhone ? `(${req.contactPhone})` : ''}
                </div>
              </div>

              {req.status === 'RESOLVED' && req.resolutionNotes && (
                <div style={{ marginTop: '10px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.82rem', color: '#166534' }}>
                  <strong>Delivered Aid Notes:</strong> {req.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveTarget && (
        <div className="modal-overlay" onClick={() => setResolveTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={20} color="#16a34a" /> Complete Relief Assignment
              </h3>
            </div>
            <form onSubmit={handleConfirmResolve}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px' }}>
                  Please summarize the relief activity, aid delivered, or safe evacuation for mission records:
                </p>
                <div className="form-group">
                  <label className="form-label form-label-required">Resolution Summary</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="e.g. Distributed 15 dry ration boxes, 10 water cans, and verified family is safe..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setResolveTarget(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={actionId === resolveTarget._id}>
                  {actionId === resolveTarget._id ? 'Saving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
