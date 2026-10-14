import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  ShieldAlert,
  UserPlus,
  AlertCircle,
  User,
  HeartHandshake,
  LifeBuoy,
  ArrowLeft
} from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    operatingArea: '',
    skills: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accountTypes = [
    {
      id: 'CITIZEN',
      title: t.roles.CITIZEN,
      desc: 'Request emergency aid (Food, Medical, Shelter, Rescue) for yourself or community',
      icon: User,
      color: '#2563eb',
      bg: '#eff6ff'
    },
    {
      id: 'NGO',
      title: t.roles.NGO,
      desc: 'Registered relief organizations coordinating food, medical supplies, & rescue',
      icon: HeartHandshake,
      color: '#ea580c',
      bg: '#fff7ed'
    },
    {
      id: 'VOLUNTEER',
      title: t.roles.VOLUNTEER,
      desc: 'Field volunteers, boat rescue teams, first responders, & distribution helpers',
      icon: LifeBuoy,
      color: '#059669',
      bg: '#ecfdf5'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsDoNotMatch || 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: selectedRole === 'NGO' ? formData.organization : formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
        organization: selectedRole === 'NGO' ? formData.organization : (formData.organization || ''),
        contactPerson: formData.contactPerson,
        operatingArea: formData.operatingArea,
        skills: formData.skills,
        address: formData.address
      };

      const user = await register(payload);
      if (user.role === 'CITIZEN') navigate('/citizen');
      else navigate('/relief');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
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
            {selectedRole ? `Register as ${t.roles[selectedRole] || selectedRole}` : t.registerTitle}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {selectedRole ? 'Complete the form below to create your verified account' : t.accountTypePrompt}
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Choose Account Type */}
          {!selectedRole ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accountTypes.map((opt) => {
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
                      padding: '16px',
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: opt.bg,
                      color: opt.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComponent size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.98rem', color: '#0f172a' }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px', lineHeight: '1.4' }}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}

              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                Note: Government Control Room and System Admin accounts are pre-authorized for security.
              </div>
            </div>
          ) : (
            /* STEP 2: Role-Specific Registration Form */
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <span className="user-role-tag" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                  Account Type: {t.roles[selectedRole] || selectedRole}
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

              {/* CITIZEN FORM */}
              {selectedRole === 'CITIZEN' && (
                <>
                  <div className="form-group">
                    <label className="form-label form-label-required">{t.fullNameLabel}</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Karthik Raman"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.addressLabel}</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="e.g. Velachery, Chennai"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* NGO FORM */}
              {selectedRole === 'NGO' && (
                <>
                  <div className="form-group">
                    <label className="form-label form-label-required">{t.orgNameLabel}</label>
                    <input
                      type="text"
                      name="organization"
                      className="form-control"
                      placeholder="e.g. Relief India Foundation NGO"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.contactPersonLabel}</label>
                    <input
                      type="text"
                      name="contactPerson"
                      className="form-control"
                      placeholder="e.g. Dr. A. Murugan"
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.operatingAreaLabel}</label>
                    <input
                      type="text"
                      name="operatingArea"
                      className="form-control"
                      placeholder="e.g. Chennai, Kanchipuram, Chengalpattu"
                      value={formData.operatingArea}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* VOLUNTEER FORM */}
              {selectedRole === 'VOLUNTEER' && (
                <>
                  <div className="form-group">
                    <label className="form-label form-label-required">{t.fullNameLabel}</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Arun Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.skillsLabel}</label>
                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      placeholder="e.g. Swimmer, First Aid Certified, 4x4 Driver"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.operatingAreaLabel}</label>
                    <input
                      type="text"
                      name="operatingArea"
                      className="form-control"
                      placeholder="e.g. Saidapet, Adyar, Velachery"
                      value={formData.operatingArea}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div className="form-group">
                <label className="form-label form-label-required">{t.emailLabel}</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">{t.phoneLabel}</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 98401 23456"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label form-label-required">{t.passwordLabel}</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">{t.confirmPasswordLabel}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={loading}>
                <UserPlus size={18} />
                <span>{loading ? 'Creating MongoDB Account...' : t.completeRegistration}</span>
              </button>
            </form>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            {t.alreadyHaveAccount}{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'underline' }}>
              {t.login}
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
