import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  ShieldAlert,
  LogIn,
  AlertCircle,
  User,
  HeartHandshake,
  LifeBuoy,
  Building2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Step 1: Select Role, Step 2: Enter Email & Password
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sessionExpired = searchParams.get('session') === 'expired';

  const roleOptions = [
    {
      id: 'CITIZEN',
      title: t.roles.CITIZEN,
      desc: 'Request food, medical, shelter, or rescue aid & track status',
      icon: User,
      color: '#2563eb',
      bg: '#eff6ff'
    },
    {
      id: 'NGO',
      title: t.roles.NGO,
      desc: 'Claim broadcasted emergencies & mobilize relief resources',
      icon: HeartHandshake,
      color: '#ea580c',
      bg: '#fff7ed'
    },
    {
      id: 'VOLUNTEER',
      title: t.roles.VOLUNTEER,
      desc: 'Accept field rescue tasks & update on-ground status',
      icon: LifeBuoy,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      id: 'GOVERNMENT',
      title: t.roles.GOVERNMENT,
      desc: 'Command room oversight, resource stockpile, & live maps',
      icon: Building2,
      color: '#7c3aed',
      bg: '#f5f3ff'
    },
    {
      id: 'ADMIN',
      title: t.roles.ADMIN,
      desc: 'User permissions, duplicate auditing, & system monitoring',
      icon: ShieldCheck,
      color: '#0f172a',
      bg: '#f1f5f9'
    }
  ];

  const redirectByRole = (role) => {
    if (role === 'CITIZEN') navigate('/citizen');
    else if (role === 'NGO' || role === 'VOLUNTEER') navigate('/relief');
    else if (role === 'GOVERNMENT') navigate('/control-room');
    else if (role === 'ADMIN') navigate('/admin');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Verify that authenticated database role matches selected portal role
      if (user.role !== selectedRole) {
        throw new Error(
          `Access Denied: Your account is registered as '${user.role}', but you are attempting to log into the '${selectedRole}' portal.`
        );
      }

      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Language selector top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <LanguageSelector />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#dc2626',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '10px'
          }}>
            <ShieldAlert size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            {selectedRole ? `${t.roles[selectedRole] || selectedRole} Portal Login` : t.selectRoleTitle}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {selectedRole ? 'Enter your credentials to access your verified account' : t.selectRoleSubtitle}
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {sessionExpired && (
            <div className="alert alert-warning" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <div>{error}</div>
                {error.includes('does not exist') || error.includes('Invalid') ? (
                  <div style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                    Need an account? <Link to="/register" style={{ color: '#b91c1c', fontWeight: '700', textDecoration: 'underline' }}>Sign up as Citizen, NGO, or Volunteer</Link>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* STEP 1: Select Role */}
          {!selectedRole ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roleOptions.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(opt.id);
                      setError('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = opt.color;
                      e.currentTarget.style.backgroundColor = opt.bg;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: opt.bg,
                      color: opt.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComponent size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* STEP 2: Real Login Form for Selected Role */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <span className="user-role-tag" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  Selected Role: {t.roles[selectedRole] || selectedRole}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(null);
                    setError('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Change Role</span>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">{t.emailLabel}</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">{t.passwordLabel}</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
                <LogIn size={18} />
                <span>{loading ? 'Authenticating with Database...' : t.signInButton}</span>
              </button>
            </form>
          )}

          {/* Registration link */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            {t.dontHaveAccount}{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'underline' }}>
              {t.registerNow}
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none' }}>
            &larr; Back to Public Emergency Home
          </Link>
        </div>
      </div>
    </div>
  );
};
