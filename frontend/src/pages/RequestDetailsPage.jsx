import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { LeafletMap } from '../components/LeafletMap';
import { DuplicateWarningAlert } from '../components/DuplicateWarningAlert';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Shield,
  CheckCircle,
  Activity,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  HandHeart,
  FileCheck
} from 'lucide-react';

export const RequestDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  const fetchRequestDetails = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await RequestService.getById(id);
      setRequest(res.data.data);
    } catch (err) {
      if (!silent) setError(err.message || 'Failed to load request details');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
    const interval = setInterval(() => {
      fetchRequestDetails(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleClaim = async () => {
    if (!window.confirm('Confirm claiming this emergency request for your relief team?')) return;
    try {
      setActionLoading(true);
      await RequestService.claim(id);
      await fetchRequestDetails();
    } catch (err) {
      alert('Claim failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      await RequestService.updateStatus(id, {
        status: newStatus,
        resolutionNotes: newStatus === 'RESOLVED' ? resolutionNotes : undefined
      });
      setShowResolveModal(false);
      await fetchRequestDetails();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container card">
        <div className="spinner"></div>
        <span>Loading incident details...</span>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="card">
        <div className="alert alert-danger">{error || 'Request not found'}</div>
        <button onClick={() => navigate(-1)} className="btn btn-outline">
          &larr; Go Back
        </button>
      </div>
    );
  }

  const isAssignedToMe = request.assignedTo && (request.assignedTo._id || request.assignedTo) === user?._id;
  const canClaim = ['NGO', 'VOLUNTEER', 'ADMIN'].includes(user?.role) && request.status === 'PENDING';
  const canUpdateStatus = isAssignedToMe || ['GOVERNMENT', 'ADMIN'].includes(user?.role);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>

      {/* Duplicate Alert if flagged */}
      <DuplicateWarningAlert
        warning={request.duplicateWarning}
        duplicateOf={request.duplicateOf}
        score={request.duplicateScore}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px' }}>
        {/* Left Column: Details & Incident Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Incident #{request._id.slice(-6)}
                </span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>
                  {request.category} Emergency
                </h1>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                Description
              </h3>
              <p style={{ fontSize: '1rem', color: '#1e293b', lineHeight: 1.6, background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {request.description}
              </p>
            </div>

            {/* Rule-Based Priority Explanation (Section 8 requirement) */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#166534', fontSize: '0.85rem', marginBottom: '4px' }}>
                <HelpCircle size={16} />
                <span>Rule-Based Priority Assignment Reason:</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d' }}>
                {request.priorityReason || 'Assigned based on category risk guidelines.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>LOCATION LANDMARK</div>
                <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#dc2626" />
                  <span>{request.location}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>PEOPLE AFFECTED</div>
                <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {request.peopleAffected || 1} people
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>CONTACT PHONE</div>
                <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} color="#2563eb" />
                  <span>{request.contactPhone || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>REPORTED BY</div>
                <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                  {request.citizen?.name || 'Citizen'}
                </div>
              </div>
            </div>

            {/* Resolution Notes if Resolved */}
            {request.status === 'RESOLVED' && request.resolutionNotes && (
              <div style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', fontSize: '0.9rem', marginBottom: '4px' }}>
                  <CheckCircle size={18} />
                  <span>Relief Operation Completed & Resolved</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d' }}>
                  <strong>Notes:</strong> {request.resolutionNotes}
                </p>
                {request.resolvedAt && (
                  <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '6px' }}>
                    Resolved on: {new Date(request.resolvedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action / Workflow Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '14px', color: '#0f172a' }}>
              Relief Workflow Actions
            </h3>

            {/* If Pending and User is Responder: Claim Button */}
            {canClaim && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
                  This request is currently unassigned. Claiming it will lock the request to your relief unit and alert the citizen and control room.
                </p>
                <button
                  onClick={handleClaim}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}
                >
                  <HandHeart size={18} />
                  <span>{actionLoading ? 'Claiming...' : 'Claim This Emergency'}</span>
                </button>
              </div>
            )}

            {/* If Assigned and User can update status */}
            {canUpdateStatus && request.status === 'ASSIGNED' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
                  You are assigned to this relief mission. Mark as "In Progress" when your team departs or begins relief operations.
                </p>
                <button
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Activity size={18} />
                  <span>{actionLoading ? 'Updating...' : 'Start Relief Activity (Mark In Progress)'}</span>
                </button>
              </div>
            )}

            {/* If In Progress and User can resolve */}
            {canUpdateStatus && request.status === 'IN_PROGRESS' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
                  Relief activity is active. When aid, medical supplies, or evacuation is completed, mark this request resolved.
                </p>
                <button
                  onClick={() => setShowResolveModal(true)}
                  disabled={actionLoading}
                  className="btn btn-success"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}
                >
                  <CheckCircle size={18} />
                  <span>Mark Request Resolved</span>
                </button>
              </div>
            )}

            {!canClaim && !canUpdateStatus && request.status !== 'RESOLVED' && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                {request.status === 'PENDING'
                  ? 'Request is broadcasted and awaiting dispatch by an NGO or volunteer team.'
                  : `Currently assigned to ${request.assignedTo?.name || 'Relief Team'}.`}
              </p>
            )}

            {request.status === 'RESOLVED' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: '700', fontSize: '0.9rem' }}>
                <CheckCircle size={18} />
                <span>This relief request has been successfully completed.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Leaflet Map & Assigned Responder Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#2563eb" />
              <span>Incident Location Map</span>
            </h3>

            <LeafletMap
              height="280px"
              center={[request.latitude, request.longitude]}
              zoom={14}
              requests={[request]}
            />

            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
              Lat: {request.latitude.toFixed(5)}, Lng: {request.longitude.toFixed(5)}
            </div>
          </div>

          {/* Assigned Responder Info Card */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="#4338ca" />
              <span>Assigned Relief Team</span>
            </h3>

            {request.assignedTo ? (
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>RESPONDER NAME</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{request.assignedTo.name}</div>
                </div>

                <div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>ORGANIZATION</div>
                  <div style={{ fontWeight: '600', color: '#4338ca' }}>
                    {request.assignedTo.organization || request.assignedTo.role}
                  </div>
                </div>

                {request.assignedTo.phone && (
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>PHONE / RADIO</div>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{request.assignedTo.phone}</div>
                  </div>
                )}

                {request.assignedAt && (
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>ASSIGNED AT</div>
                    <div style={{ color: '#475569' }}>{new Date(request.assignedAt).toLocaleString()}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                <Clock size={28} style={{ margin: '0 auto 8px auto', display: 'block', color: '#cbd5e1' }} />
                <span>Pending Responder Assignment</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Notes Modal */}
      {showResolveModal && (
        <div className="modal-overlay" onClick={() => setShowResolveModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={20} color="#16a34a" /> Complete Relief Mission
              </h3>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '14px' }}>
                Record any notes regarding aid delivered, people evacuated, or hospital handover.
              </p>
              <div className="form-group">
                <label className="form-label">Resolution Summary</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Delivered 20 food ration packets and evacuated 4 people safely to relief camp..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowResolveModal(false)} className="btn btn-outline" disabled={actionLoading}>
                Cancel
              </button>
              <button onClick={() => handleStatusUpdate('RESOLVED')} className="btn btn-success" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
