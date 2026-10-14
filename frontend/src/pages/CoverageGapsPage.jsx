import React, { useState, useEffect } from 'react';
import { DashboardService } from '../services/api';
import { LeafletMap } from '../components/LeafletMap';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  Info,
  Users,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const CoverageGapsPage = () => {
  const [coverageData, setCoverageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCoverage = async () => {
    try {
      setLoading(true);
      const res = await DashboardService.getCoverage();
      setCoverageData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze relief coverage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverage();
  }, []);

  if (loading) {
    return (
      <div className="loading-container card">
        <div className="spinner"></div>
        <span>Calculating geographic cluster coverage analysis...</span>
      </div>
    );
  }

  if (error || !coverageData) {
    return <div className="alert alert-danger">{error || 'Data unavailable'}</div>;
  }

  const { clusters, totalGapsIdentified, disclaimer } = coverageData;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass size={26} color="#dc2626" />
          <span>Relief Coverage Gap Analysis</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Rule-based geographic clustering to identify unserved zones with high pending humanitarian demand
        </p>
      </div>

      {/* Official Operational Disclaimer required by Section 12 */}
      <div className="alert alert-info" style={{ borderLeft: '4px solid #0284c7' }}>
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#0369a1' }} />
        <div>
          <strong>Operational Indicator Notice:</strong>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem' }}>{disclaimer}</p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Coverage Gaps Detected</div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{totalGapsIdentified}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Compass size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Analyzed Incident Zones</div>
            <div className="stat-value">{clusters.length}</div>
          </div>
        </div>
      </div>

      {/* Visual Map with Coverage Gap Concentric Rings */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <h2 className="card-title">
            <MapPin size={20} color="#2563eb" />
            <span>Coverage Heatmap & Deficit Perimeters</span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Red dashed rings indicate unassigned critical clusters
          </span>
        </div>

        <LeafletMap
          height="400px"
          zoom={12}
          coverageClusters={clusters}
        />
      </div>

      {/* Cluster Details Table */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>
          <span>Regional Cluster Breakdown</span>
        </h2>

        {clusters.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 className="empty-state-icon" style={{ color: '#16a34a' }} />
            <h3 className="empty-state-title">No Active Coverage Gaps</h3>
            <p className="empty-state-desc">All incident zones currently have active responders deployed.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Zone / Region</th>
                  <th>Coverage Status</th>
                  <th>Severity</th>
                  <th>Pending Requests</th>
                  <th>Active Responders</th>
                  <th>Impacted Citizens</th>
                  <th>Operational Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {clusters.map((cl) => {
                  const isCritical = cl.severity === 'CRITICAL';
                  const isHigh = cl.severity === 'HIGH';

                  return (
                    <tr key={cl.id} style={{ background: isCritical ? '#fef2f2' : undefined }}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{cl.area}</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Lat: {cl.centerLat}, Lng: {cl.centerLng}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: isCritical ? '#fee2e2' : isHigh ? '#ffedd5' : '#eff6ff',
                            color: isCritical ? '#991b1b' : isHigh ? '#9a3412' : '#1d4ed8'
                          }}
                        >
                          {cl.coverageStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            color: isCritical ? '#dc2626' : isHigh ? '#ea580c' : '#2563eb'
                          }}
                        >
                          {cl.severity}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: cl.pendingCount > 0 ? '#dc2626' : '#16a34a' }}>
                          {cl.pendingCount}
                        </strong>
                      </td>
                      <td>
                        <strong>{cl.assignedCount}</strong>
                      </td>
                      <td>
                        {cl.totalPeopleAffected} people
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#334155', maxWidth: '320px', lineHeight: 1.4 }}>
                        {cl.recommendation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
