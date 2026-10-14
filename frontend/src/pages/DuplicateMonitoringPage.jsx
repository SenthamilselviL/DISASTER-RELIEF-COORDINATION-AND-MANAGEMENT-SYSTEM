import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RequestService } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import {
  Copy,
  AlertTriangle,
  MapPin,
  CheckCircle,
  Clock,
  Eye,
  ArrowRight,
  Info
} from 'lucide-react';

export const DuplicateMonitoringPage = () => {
  const [duplicateRequests, setDuplicateRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const res = await RequestService.getAll({ isDuplicate: 'true' });
      setDuplicateRequests(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load duplicates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuplicates();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Copy size={26} color="#d97706" />
          <span>Rule-Based Duplicate Emergency Detection</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Deterministic audit grid flagging incidents within ~500m of active emergencies in the same category
        </p>
      </div>

      <div className="alert alert-info">
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem' }}>
          <strong>Duplicate Detection Policy:</strong> Flagged requests are <strong>never automatically deleted</strong> to avoid missing legitimate secondary victims. Responders review proximity scores and merge or dispatch accordingly.
        </div>
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Auditing duplicate requests...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : duplicateRequests.length === 0 ? (
        <div className="card empty-state">
          <CheckCircle className="empty-state-icon" style={{ color: '#16a34a' }} />
          <h3 className="empty-state-title">No Duplicate Flags</h3>
          <p className="empty-state-desc">All current emergency requests originate from distinct geographic sectors.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {duplicateRequests.map((req) => (
            <div key={req._id} className="card" style={{ borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
                      #{req._id.slice(-6)}: {req.category} Emergency
                    </span>
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Submitted by: <strong>{req.citizen?.name || 'Citizen'}</strong> at {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {req.duplicateScore > 0 && (
                    <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                      Confidence: {req.duplicateScore}% Match
                    </span>
                  )}
                  <Link to={`/requests/${req._id}`} className="btn btn-sm btn-outline">
                    <Eye size={14} /> View Incident Details
                  </Link>
                </div>
              </div>

              {/* Duplicate Warning Callout */}
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem', color: '#92400e' }}>
                <strong>Flagged Correlation:</strong> {req.duplicateWarning}
              </div>

              {/* Side-by-Side Comparison: Current vs Suspected Original */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Current Request</div>
                  <p style={{ margin: '0 0 8px 0', color: '#475569' }}>"{req.description}"</p>
                  <div>📍 Location: <strong>{req.location}</strong></div>
                  <div>👥 Affected: <strong>{req.peopleAffected || 1} people</strong></div>
                </div>

                {req.duplicateOf && (
                  <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontWeight: '700', color: '#166534', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Suspected Original (#{typeof req.duplicateOf === 'object' ? req.duplicateOf._id.slice(-6) : req.duplicateOf.slice(-6)})</span>
                      <Link to={`/requests/${typeof req.duplicateOf === 'object' ? req.duplicateOf._id : req.duplicateOf}`} style={{ color: '#15803d', textDecoration: 'underline', fontSize: '0.75rem' }}>
                        Open Original &rarr;
                      </Link>
                    </div>
                    {typeof req.duplicateOf === 'object' ? (
                      <div>
                        <p style={{ margin: '0 0 8px 0', color: '#166534' }}>Category: <strong>{req.duplicateOf.category}</strong></p>
                        <div>📍 Location: <strong>{req.duplicateOf.location}</strong></div>
                        <div>Status: <strong>{req.duplicateOf.status}</strong></div>
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: '#166534' }}>Linked to Request ID: {req.duplicateOf}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
