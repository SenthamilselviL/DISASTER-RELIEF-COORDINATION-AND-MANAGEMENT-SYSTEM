import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/api';
import { LeafletMap } from '../components/LeafletMap';
import { Map, Filter, Layers, Compass, RefreshCw } from 'lucide-react';

export const LiveMapPage = () => {
  const [requests, setRequests] = useState([]);
  const [coverageClusters, setCoverageClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCoverageGaps, setShowCoverageGaps] = useState(true);

  // Filters
  const [category, setCategory] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [status, setStatus] = useState('ALL');

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const [mapRes, covRes] = await Promise.all([
        DashboardService.getMapData({
          category: category !== 'ALL' ? category : undefined,
          priority: priority !== 'ALL' ? priority : undefined,
          status: status !== 'ALL' ? status : undefined
        }),
        DashboardService.getCoverage()
      ]);
      setRequests(mapRes.data.data || []);
      setCoverageClusters(covRes.data.clusters || []);
    } catch (err) {
      console.error('Error fetching map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [category, priority, status]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Map size={26} color="#2563eb" />
            <span>Live Geospatial Emergency Map</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Real-time incident tactical visualization with priority coding & OpenStreetMap coverage
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowCoverageGaps(!showCoverageGaps)}
            className="btn btn-sm btn-outline"
            style={{
              backgroundColor: showCoverageGaps ? '#eff6ff' : '#ffffff',
              borderColor: showCoverageGaps ? '#2563eb' : '#cbd5e1',
              color: showCoverageGaps ? '#1d4ed8' : '#334155'
            }}
          >
            <Compass size={14} />
            <span>{showCoverageGaps ? 'Coverage Circles: ON' : 'Coverage Circles: OFF'}</span>
          </button>

          <button onClick={fetchMapData} className="btn btn-sm btn-outline" title="Refresh Map Data">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="card" style={{ padding: '12px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>
            <Filter size={16} /> FILTERS:
          </div>

          <div>
            <select
              className="form-control"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Rescue">Rescue & Evacuation</option>
              <option value="Medical">Medical Emergency</option>
              <option value="Food">Food & Water</option>
              <option value="Shelter">Disaster Shelter</option>
            </select>
          </div>

          <div>
            <select
              className="form-control"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <select
              className="form-control"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending (Unassigned)</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#64748b' }}>
            Active Map Pins: <strong>{requests.length}</strong>
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.78rem', color: '#475569', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: '700' }}>PRIORITY PINS:</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span>
          Critical (Life Danger / Pulsing)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span>
          High Priority
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span>
          Medium Priority
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#64748b' }}></span>
          Low Priority
        </span>
      </div>

      {/* Main Large Map */}
      <LeafletMap
        height="620px"
        zoom={12}
        requests={requests}
        coverageClusters={showCoverageGaps ? coverageClusters : []}
      />
    </div>
  );
};
