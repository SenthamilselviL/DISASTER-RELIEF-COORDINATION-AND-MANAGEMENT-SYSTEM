import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ShieldAlert, LogOut, Menu } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{ display: 'flex', alignItems: 'center', color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Toggle Menu"
          >
            <Menu size={22} />
          </button>
        )}

        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '34px',
            height: '34px',
            background: '#dc2626',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <ShieldAlert size={20} />
          </div>
          <span style={{ fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>RELIEF-SYNC</span>
        </Link>

        <span className="nav-badge-live">
          <span className="pulse-dot"></span>
          {t.activeMonitoring || 'ACTIVE MONITORING'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <LanguageSelector />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600' }}>
                {t.roles[user.role] || user.role} {user.organization ? `• ${user.organization}` : ''}
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-sm btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>{t.logout || 'Logout'}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-sm btn-outline">
              {t.login}
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              {t.signUp}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
