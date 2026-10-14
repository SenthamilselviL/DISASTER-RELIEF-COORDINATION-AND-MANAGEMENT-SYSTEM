import React, { useState, useEffect } from 'react';
import { UserService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionId, setActionId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UserService.getAll({
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        search: search || undefined
      });
      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setActionId(userId);
      await UserService.updateRole(userId, newRole);
      await fetchUsers();
    } catch (err) {
      alert('Error updating role: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    if (!window.confirm('Change active status for this user?')) return;
    try {
      setActionId(userId);
      await UserService.toggleStatus(userId);
      await fetchUsers();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={26} color="#2563eb" />
          <span>User Access Control & Governance</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Manage citizen, responder, government, and administrator accounts and enforce authorization policies
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="CITIZEN">Citizens</option>
              <option value="NGO">NGO Organizations</option>
              <option value="VOLUNTEER">Volunteers</option>
              <option value="GOVERNMENT">Government Officials</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-outline">
                <Search size={16} />
              </button>
            </form>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Total Users: <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container card">
          <div className="spinner"></div>
          <span>Loading user accounts...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Current Role</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Role Assignment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id;
                const isUpdating = actionId === u._id;

                return (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
                    </td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '700' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.organization || '—'}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: u.isActive ? '#dcfce7' : '#fee2e2',
                          color: u.isActive ? '#15803d' : '#b91c1c'
                        }}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                        value={u.role}
                        disabled={isSelf || isUpdating}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="CITIZEN">CITIZEN</option>
                        <option value="NGO">NGO</option>
                        <option value="VOLUNTEER">VOLUNTEER</option>
                        <option value="GOVERNMENT">GOVERNMENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      {!isSelf ? (
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          disabled={isUpdating}
                          className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`}
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Self</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
