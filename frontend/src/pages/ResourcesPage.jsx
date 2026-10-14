import React, { useState, useEffect } from 'react';
import { ResourceService, RequestService } from '../services/api';
import { AllocateModal } from '../components/AllocateModal';
import {
  Boxes,
  PlusCircle,
  PackageCheck,
  Send,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react';

export const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Creation form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'Food Kits',
    quantity: 100,
    location: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Allocation modal state
  const [allocateTarget, setAllocateTarget] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [resRes, reqRes] = await Promise.all([
        ResourceService.getAll(),
        RequestService.getAll({ status: 'PENDING' })
      ]);
      setResources(resRes.data.data || []);
      setActiveRequests(reqRes.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newResource.name || !newResource.location || newResource.quantity <= 0) {
      alert('Please fill out all fields with valid quantity');
      return;
    }

    try {
      setCreateLoading(true);
      await ResourceService.create(newResource);
      setShowCreateModal(false);
      setNewResource({ name: '', type: 'Food Kits', quantity: 100, location: '' });
      await fetchResources();
    } catch (err) {
      alert('Failed to register resource: ' + err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Boxes size={26} color="#2563eb" />
            <span>Humanitarian Resource Allocation</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage warehouse stockpile reserves and dispatch critical inventory to active relief calls
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}
        >
          <PlusCircle size={18} />
          <span>Register New Inventory</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading relief inventory...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {resources.map((res) => {
            const allocatedCount = (res.quantity || 0) - (res.availableQuantity || 0);
            const isDepleted = res.availableQuantity <= 0;

            return (
              <div key={res._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', marginBottom: '4px' }}>
                      {res.type}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a' }}>{res.name}</h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: isDepleted ? '#dc2626' : '#16a34a' }}>
                      {res.availableQuantity}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>AVAILABLE</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>Depot: <strong>{res.location}</strong></span>
                </div>

                {/* Inventory Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginBottom: '4px' }}>
                    <span>Allocated: {allocatedCount} units</span>
                    <span>Total Stock: {res.quantity}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (allocatedCount / (res.quantity || 1)) * 100)}%`,
                        background: isDepleted ? '#dc2626' : '#2563eb',
                        borderRadius: '4px'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Recent Dispatches Preview */}
                {res.allocatedTo && res.allocatedTo.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '6px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>Recent Dispatches:</div>
                    {res.allocatedTo.slice(-2).map((alloc, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                        <span>Incident #{alloc.request?._id ? alloc.request._id.slice(-6) : 'Req'}</span>
                        <strong>{alloc.allocatedQuantity} units</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <button
                    onClick={() => setAllocateTarget(res)}
                    disabled={isDepleted}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.875rem', fontWeight: '700' }}
                  >
                    <Truck size={16} />
                    <span>{isDepleted ? 'Stock Depleted' : 'Allocate to Emergency Incident'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register New Resource Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={20} color="#2563eb" /> Register Relief Stockpile
              </h3>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label form-label-required">Resource / Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Inflatable Dinghy Boats or Dry Ration Packets"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Resource Category</label>
                  <select
                    className="form-control"
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  >
                    <option value="Food Kits">Food Kits & Drinking Water</option>
                    <option value="Medical Supplies">Medical Supplies & Trauma Kits</option>
                    <option value="Shelter Units">Shelter Units & Tents</option>
                    <option value="Rescue Teams">Rescue Teams, Boats & Vests</option>
                    <option value="Other">Other Emergency Equipment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Total Initial Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({ ...newResource, quantity: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Depot / Warehouse Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Koyambedu Central Depot, Chennai"
                    value={newResource.location}
                    onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createLoading}>
                  {createLoading ? 'Registering...' : 'Register Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {allocateTarget && (
        <AllocateModal
          resource={allocateTarget}
          activeRequests={activeRequests}
          onClose={() => setAllocateTarget(null)}
          onSuccess={() => {
            setAllocateTarget(null);
            fetchResources();
          }}
        />
      )}
    </div>
  );
};
