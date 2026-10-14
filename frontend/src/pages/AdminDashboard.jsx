import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardService, UserService, RequestService } from '../services/api';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  Copy,
  Boxes,
  History,
  Activity,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const [statsRes, dupsRes, usersRes] = await Promise.all([
          DashboardService.getStats(),
          RequestService.getAll({ isDuplicate: 'true' }),
          UserService.getAll()
        ]);
        setStats(statsRes.data.data);
        setDuplicatesCount(dupsRes.data.count || 0);
        setUsersCount(usersRes.data.count || 0);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container card">
        <div className="spinner"></div>
        <span>Loading system administration overview...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        borderRadius: '14px',
        padding: '26px 30px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#3b82f6', padding: '3px 12px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: '800' }}>
            <ShieldCheck size={14} /> ADMINISTRATIVE ROOT
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', margin: '8px 0 4px 0' }}>
            System Administration Console
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Full governance of role-based permissions, incident lifecycle, duplicate detection, and resource oversight
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/users" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <Users size={18} />
            <span>Manage Users ({usersCount})</span>
          </Link>
          <Link to="/admin/duplicates" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
            <Copy size={18} />
            <span>Duplicate Audit ({duplicatesCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Users size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Registered Accounts</div>
            <div className="stat-value">{usersCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Copy size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Flagged Duplicates</div>
            <div className="stat-value">{duplicatesCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <AlertTriangle size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Critical Emergencies</div>
            <div className="stat-value">{stats?.priority?.critical || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Activity size={26} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">{stats?.overview?.total || 0}</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Users size={22} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>User Access Control</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Promote volunteers to NGOs, activate/deactivate compromised credentials, or assign government roles.
          </p>
          <Link to="/admin/users" className="btn btn-outline" style={{ width: '100%' }}>
            Open User Registry &rarr;
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Copy size={22} color="#d97706" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Duplicate Proximity Audit</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Review requests flagged by Haversine 500m proximity and keyword similarity rules to prevent responder overlap.
          </p>
          <Link to="/admin/duplicates" className="btn btn-outline" style={{ width: '100%' }}>
            Review Duplicates &rarr;
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <History size={22} color="#0f172a" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Operational Audit Trail</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
            Review chronological event history, responder claims, status updates, and emergency registrations.
          </p>
          <Link to="/control-room/activity" className="btn btn-outline" style={{ width: '100%' }}>
            View Full Audit Logs &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
