import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  AlertOctagon,
  ClipboardList,
  CheckCircle2,
  Map,
  Boxes,
  Compass,
  Users,
  Copy,
  History,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'CITIZEN';

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <HeartHandshake size={18} />
        </div>
        <div>
          <div className="sidebar-title">DISASTER RESPONSE</div>
          <div className="sidebar-subtitle">Operational Grid</div>
        </div>
      </div>

      <nav className="sidebar-menu">
        {/* CITIZEN NAVIGATION */}
        {role === 'CITIZEN' && (
          <>
            <div className="sidebar-category-label">Citizen Services</div>
            <NavLink
              to="/citizen"
              end
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
            <NavLink
              to="/citizen/new"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <AlertOctagon size={18} />
              <span>Create Emergency</span>
            </NavLink>
            <NavLink
              to="/citizen/requests"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ClipboardList size={18} />
              <span>My Requests</span>
            </NavLink>
          </>
        )}

        {/* NGO & VOLUNTEER NAVIGATION */}
        {(role === 'NGO' || role === 'VOLUNTEER') && (
          <>
            <div className="sidebar-category-label">Relief Operations</div>
            <NavLink
              to="/relief"
              end
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Responder Hub</span>
            </NavLink>
            <NavLink
              to="/relief/available"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ClipboardList size={18} />
              <span>Available Emergencies</span>
            </NavLink>
            <NavLink
              to="/relief/my-tasks"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <CheckCircle2 size={18} />
              <span>My Claimed Tasks</span>
            </NavLink>
            <NavLink
              to="/control-room/map"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Map size={18} />
              <span>Emergency Map</span>
            </NavLink>
          </>
        )}

        {/* GOVERNMENT NAVIGATION */}
        {role === 'GOVERNMENT' && (
          <>
            <div className="sidebar-category-label">Command Center</div>
            <NavLink
              to="/control-room"
              end
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Control Room</span>
            </NavLink>
            <NavLink
              to="/control-room/map"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Map size={18} />
              <span>Live Tactical Map</span>
            </NavLink>
            <NavLink
              to="/control-room/requests"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ClipboardList size={18} />
              <span>All Requests</span>
            </NavLink>
            <NavLink
              to="/control-room/coverage"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Compass size={18} />
              <span>Coverage Gaps</span>
            </NavLink>
            <NavLink
              to="/control-room/resources"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Boxes size={18} />
              <span>Relief Resources</span>
            </NavLink>
            <NavLink
              to="/control-room/activity"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <History size={18} />
              <span>Activity Audit</span>
            </NavLink>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {role === 'ADMIN' && (
          <>
            <div className="sidebar-category-label">Administration</div>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ShieldCheck size={18} />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Users size={18} />
              <span>User Management</span>
            </NavLink>
            <NavLink
              to="/admin/duplicates"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Copy size={18} />
              <span>Duplicate Auditing</span>
            </NavLink>
            <NavLink
              to="/control-room/requests"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ClipboardList size={18} />
              <span>Request Monitoring</span>
            </NavLink>
            <NavLink
              to="/control-room/map"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Map size={18} />
              <span>Geospatial Map</span>
            </NavLink>
            <NavLink
              to="/control-room/resources"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Boxes size={18} />
              <span>Resource Inventory</span>
            </NavLink>
            <NavLink
              to="/control-room/coverage"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Compass size={18} />
              <span>Coverage Gaps</span>
            </NavLink>
            <NavLink
              to="/control-room/activity"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <History size={18} />
              <span>System Audit Logs</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <span className="user-role-tag">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
