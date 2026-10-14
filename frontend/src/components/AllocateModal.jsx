import React, { useState } from 'react';
import { X, PackagePlus, AlertCircle } from 'lucide-react';
import { ResourceService } from '../services/api';

export const AllocateModal = ({ resource, activeRequests = [], onClose, onSuccess }) => {
  const [selectedRequestId, setSelectedRequestId] = useState(
    activeRequests.length > 0 ? activeRequests[0]._id : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!resource) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      setError('Please select an active emergency request to allocate to');
      return;
    }
    if (quantity <= 0 || quantity > resource.availableQuantity) {
      setError(`Quantity must be between 1 and ${resource.availableQuantity}`);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await ResourceService.allocate(resource._id, {
        requestId: selectedRequestId,
        quantity: Number(quantity),
        notes
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to allocate resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackagePlus size={22} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Allocate Relief Inventory</h3>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Selected Resource Pool</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{resource.name}</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.85rem' }}>
                <div>Type: <strong>{resource.type}</strong></div>
                <div>Available: <strong style={{ color: '#16a34a' }}>{resource.availableQuantity} units</strong></div>
                <div>Total: <strong>{resource.quantity}</strong></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Select Emergency Incident</label>
              <select
                className="form-control"
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                required
              >
                {activeRequests.length === 0 ? (
                  <option value="">No pending/active requests available</option>
                ) : (
                  activeRequests.map((req) => (
                    <option key={req._id} value={req._id}>
                      [{req.category}] {req.location} - {req.priority} ({req.peopleAffected} affected)
                    </option>
                  ))
                )}
              </select>
              <div className="form-hint">Choose which incident requires this inventory dispatch</div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Quantity to Allocate</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max={resource.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
              <div className="form-hint">Cannot exceed available units: {resource.availableQuantity}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Dispatch / Allocation Notes</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. Dispatched via emergency rescue boat #4..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || resource.availableQuantity <= 0}>
              {loading ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
