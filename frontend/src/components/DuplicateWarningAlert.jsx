import React from 'react';
import { Copy, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DuplicateWarningAlert = ({ warning, duplicateOf, score }) => {
  if (!warning && !duplicateOf) return null;

  return (
    <div className="alert alert-warning" style={{ borderLeft: '4px solid #d97706' }}>
      <Copy size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#b45309' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Possible Duplicate Request Detected</span>
          {score ? (
            <span style={{ fontSize: '0.75rem', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
              Similarity Confidence: {score}%
            </span>
          ) : null}
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>{warning || 'This emergency shares similar location, time, and category with an existing active request.'}</p>
        {duplicateOf && (
          <div style={{ marginTop: '8px' }}>
            <Link
              to={typeof duplicateOf === 'object' ? `/requests/${duplicateOf._id}` : `/requests/${duplicateOf}`}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem', padding: '3px 8px', borderColor: '#d97706', color: '#92400e' }}
            >
              <AlertCircle size={12} /> View Suspected Original Request
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
